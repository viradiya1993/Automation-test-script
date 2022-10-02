import { Location } from "@angular/common";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatSelect } from "@angular/material/select";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { AuthService, CommonService, ProjectService } from "@app/core/services";
import {
  GlobalService,
  LocalStorageService,
  OrganizationService,
  UserService,
} from "@core/services";
import {
  AHQ_SUPPORT,
  AUTH_USER,
  AUTH_USER_ROLE,
  ORGANIZATION,
  ORGANIZATION_ID,
  PROJECT_ID,
} from "@shared/configs";
import { SUBSCRIBER } from "@shared/configs/roles";
import { Project } from "@shared/models/project.model";
import { finalize } from "rxjs/operators";
import { Subscription } from "rxjs/Subscription";
import "rxjs/add/operator/filter";
import { OrganizationModal } from "@shared/models";

const misc: any = {
  navbar_menu_visible: 0,
  active_collapse: true,
  disabled_collapse_init: 0,
};

declare var $: any;

@Component({
  selector: "app-navbar-cmp",
  templateUrl: "navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent implements OnInit {
  @ViewChild("app-navbar-cmp") button: any;

  location: Location;
  mobile_menu_visible: any = 0;
  header: any;
  userData: any = JSON.parse(localStorage.getItem(AUTH_USER));
  public isProjectsLoading = false;
  projects: Project[] = [];
  organizations: OrganizationModal[] = [];
  selectedProject: any = "null";
  selectedOrganization: any = null;
  orgName: string = null;
  offset = 0;
  limit = 10;
  total = 100;
  options = [];
  @ViewChild("projectSelect") selectElem: MatSelect;
  private nativeElement: Node;
  private toggleButton: any;
  private sidebarVisible: boolean;
  private _router: Subscription;
  private readonly RELOAD_TOP_SCROLL_POSITION = 100;

  constructor(
    location: Location,
    private element: ElementRef,
    private localService: LocalStorageService,
    public router: Router,
    private route: ActivatedRoute,
    private globalService: GlobalService,
    private projectService: ProjectService,
    private organizationService: OrganizationService,
    private userService: UserService,
    private readonly authService: AuthService,
    public readonly commonService: CommonService
  ) {
    this.location = location;
    this.nativeElement = element.nativeElement;
    this.sidebarVisible = false;

    this.globalService.goal.subscribe((res) => {
      this.header = res;
    });
  }

  minimizeSidebar() {
    const body = document.getElementsByTagName("body")[0];

    if (misc.sidebar_mini_active === true) {
      body.classList.remove("sidebar-mini");
      misc.sidebar_mini_active = false;
    } else {
      setTimeout(function () {
        body.classList.add("sidebar-mini");
        misc.sidebar_mini_active = true;
        $(".sidebar-wrapper").find(".collapse").removeClass("show");
        $(".sidebar-wrapper")
          .find(".collapse")
          .parent()
          .find("a")
          .attr("aria-expanded", false);
      }, 300);
    }

    // we simulate the window Resize so the charts will get updated in realtime.
    const simulateWindowResize = setInterval(function () {
      window.dispatchEvent(new Event("resize"));
    }, 180);

    // we stop the simulation of Window Resize after the animations are completed
    setTimeout(function () {
      clearInterval(simulateWindowResize);
    }, 1000);
  }

  hideSidebar() {
    const body = document.getElementsByTagName("body")[0];
    const sidebar = document.getElementsByClassName("sidebar")[0];

    if (misc.hide_sidebar_active === true) {
      setTimeout(function () {
        body.classList.remove("hide-sidebar");
        misc.hide_sidebar_active = false;
      }, 300);
      setTimeout(function () {
        sidebar.classList.remove("animation");
      }, 600);
      sidebar.classList.add("animation");
    } else {
      setTimeout(function () {
        body.classList.add("hide-sidebar");
        // $('.sidebar').addClass('animation');
        misc.hide_sidebar_active = true;
      }, 300);
    }

    // we simulate the window Resize so the charts will get updated in realtime.
    const simulateWindowResize = setInterval(function () {
      window.dispatchEvent(new Event("resize"));
    }, 180);

    // we stop the simulation of Window Resize after the animations are completed
    setTimeout(function () {
      clearInterval(simulateWindowResize);
    }, 1000);
  }

  registerPanelScrollEvent() {
    const panel = this.selectElem.panel.nativeElement;
    panel.addEventListener("scroll", (event) => this.loadAllOnScroll(event));
  }

  loadAllOnScroll(event) {
    if (event.target.scrollTop > this.RELOAD_TOP_SCROLL_POSITION) {
      const obj = this.projects.slice(this.offset, this.offset + this.limit);
      obj.forEach((item) => {
        this.options.push(item);
      });
      this.offset += this.limit;
    }
  }

  ngOnInit() {
    this.authService.userPlanType();
    const navbar: HTMLElement = this.element.nativeElement;
    const body = document.getElementsByTagName("body")[0];
    this.toggleButton = navbar.getElementsByClassName("navbar-toggler")[0];

    if (body.classList.contains("sidebar-mini")) {
      misc.sidebar_mini_active = true;
    }

    const role = JSON.parse(localStorage.getItem(AUTH_USER_ROLE));

    if (!role) {
      this.userRole();
    }

    const organizationAndProjectIds =
      this.commonService.getOrganizationAndProjectIds();
    // tslint:disable-next-line:triple-equals
    if (role && role.roleId == AHQ_SUPPORT) {
      // tslint:disable-next-line:triple-equals
      if (this.organizations.length == 0) {
        this.organizationService.index().subscribe((res: any) => {
          this.organizations = res.sort((a, b) => {
            return a.orgName.localeCompare(b.orgName);
          });
        });
      }

      this.projectOrganization();
      this.selectedOrganization = organizationAndProjectIds?.organizationId;
      this.selectedProject = organizationAndProjectIds?.projectId;
    } else {
      const organization = JSON.parse(localStorage.getItem(ORGANIZATION));
      if (organization) {
        this.orgName = organization.orgName;
      }

      // tslint:disable-next-line:triple-equals
      if (role && role.roleId == SUBSCRIBER) {
        this.projectOrganization();
      } else {
        this.projectRequest();
      }

      if (this.commonService.getOrganizationAndProjectIds().projectId) {
        this.selectedProject =
          this.commonService.getOrganizationAndProjectIds().projectId;
      } else {
        const user = JSON.parse(localStorage.getItem(AUTH_USER));
        if (user && user.selectedProject) {
          this.selectedProject = user.selectedProject;
          this.checkSelectFirstProject();
        }
      }
    }

    if (body.classList.contains("hide-sidebar")) {
      misc.hide_sidebar_active = true;
    }

    this._router = this.router.events
      .filter((event) => event instanceof NavigationEnd)
      .subscribe((event: NavigationEnd) => {
        const $layer = document.getElementsByClassName("close-layer")[0];
        if ($layer) {
          $layer.remove();
        }
      });
  }

  public projectOrganization() {
    const organizationAndProjectIds =
      this.commonService.getOrganizationAndProjectIds();
    if (
      organizationAndProjectIds &&
      organizationAndProjectIds?.organizationId
    ) {
      this.isProjectsLoading = true;
      this.projectService
        .getAllActiveProjectInfoByOrgId(
          organizationAndProjectIds?.organizationId
        )
        .pipe(finalize(() => (this.isProjectsLoading = false)))
        .subscribe((res) => {
          this.projects = res
            .filter((item: Project) => item.isEnabled)
            .sort((a, b) => a.projectName.localeCompare(b.projectName));
          this.options = res
            .filter((item: Project) => item.isEnabled)
            .slice(this.offset, this.limit);
          this.offset += this.limit;
          this.checkSelectFirstProject();
        });
    }
  }

  projectRequest() {
    this.projectService
      .getProjectInfoByUserId(this.userData.userId, 0)
      .pipe(finalize(() => (this.isProjectsLoading = false)))
      .subscribe((res) => {
        this.projects = res.filter((item: Project) => item.isEnabled);
        this.options = res
          .filter((item: Project) => item.isEnabled)
          .slice(this.offset, this.limit);
        this.offset += this.limit;
        this.checkSelectFirstProject();
      });
  }

  onResize(event) {
    return $(window).width() <= 991;
  }

  projectChange(project) {
    const user = JSON.parse(localStorage.getItem(AUTH_USER));
    const role = JSON.parse(localStorage.getItem(AUTH_USER_ROLE));
    // tslint:disable-next-line:triple-equals
    if (role && role.roleId != AHQ_SUPPORT) {
      this.userService.updateSelectedProject(project, user.userId).subscribe();
    }
    sessionStorage.setItem(PROJECT_ID, project);
    this.refreshButton();
  }

  userRole(project = null) {
    const user = JSON.parse(localStorage.getItem(AUTH_USER));
    this.userService.getUserRole(project, user.userId).subscribe((res: any) => {
      localStorage.setItem(AUTH_USER_ROLE, JSON.stringify(res));
      this.refreshButton();
    });
  }

  organizationChange(organization) {
    this.projects = [];
    sessionStorage.setItem(PROJECT_ID, "all");
    sessionStorage.removeItem(PROJECT_ID);
    if (organization) {
      this.organizationService.show(organization).subscribe((res: any) => {
        sessionStorage.setItem(ORGANIZATION_ID, organization);
        localStorage.setItem(ORGANIZATION, JSON.stringify(res));
        this.selectedOrganization = organization;
        this.selectedProject = "null";
        this.refreshButton();
      });
    }
  }

  refreshButton() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = "reload";
    this.router.navigate([this.getPath()], {});
  }

  sidebarOpen() {
    const toggleButton = this.toggleButton;
    const body = document.getElementsByTagName("body")[0];
    setTimeout(function () {
      toggleButton.classList.add("toggled");
    }, 500);
    body.classList.add("nav-open");
    this.sidebarVisible = true;
  }

  sidebarClose() {
    const body = document.getElementsByTagName("body")[0];
    this.toggleButton.classList.remove("toggled");
    this.sidebarVisible = false;
    body.classList.remove("nav-open");
  }

  sidebarToggle() {
    if (this.sidebarVisible === false) {
      this.sidebarOpen();
    } else {
      this.sidebarClose();
    }
    const body = document.getElementsByTagName("body")[0];

    var $toggle = document.getElementsByClassName("navbar-toggler")[0];
    var $layer = document.createElement("div");
    // tslint:disable-next-line:triple-equals
    if (this.mobile_menu_visible == 1) {
      // $('html').removeClass('nav-open');
      body.classList.remove("nav-open");
      if ($layer) {
        $layer.remove();
      }

      setTimeout(function () {
        $toggle.classList.remove("toggled");
      }, 400);

      this.mobile_menu_visible = 0;
    } else {
      setTimeout(function () {
        $toggle.classList.add("toggled");
      }, 430);

      $layer.setAttribute("class", "close-layer");

      if (body.querySelectorAll(".main-panel")) {
        document.getElementsByClassName("main-panel")[0].appendChild($layer);
      } else if (body.classList.contains("off-canvas-sidebar")) {
        document
          .getElementsByClassName("wrapper-full-page")[0]
          .appendChild($layer);
      }

      setTimeout(function () {
        $layer.classList.add("visible");
      }, 100);

      $layer.onclick = function () {
        // asign a function
        body.classList.remove("nav-open");
        this.mobile_menu_visible = 0;
        $layer.classList.remove("visible");
        setTimeout(function () {
          $layer.remove();
          $toggle.classList.remove("toggled");
        }, 400);
      }.bind(this);

      body.classList.add("nav-open");
      this.mobile_menu_visible = 1;
    }
  }

  getPath() {
    return this.location.prepareExternalUrl(this.location.path());
  }

  logout() {
    if (this.commonService.getOrganizationAndProjectIds().projectId) {
      this.userService.logOut().subscribe((res: any) => {
        if (res.status === 200) {
          this.localService.removeLogin();
          this.router.navigate(["auth/login"]);
        } else {
          this.router.navigate(["/dashboard"]);
        }
      });
    } else {
      this.localService.removeLogin();
      this.router.navigate(["auth/login"]);
    }
  }

  private checkSelectFirstProject() {
    // If no project is selected then select first project from dropdown
    if (
      (this.selectedProject === "null" ||
        this.commonService.getOrganizationAndProjectIds().projectId === null) &&
      this.projects.length > 0
    ) {
      this.selectedProject = this.projects[0].id;
      this.projectChange(this.selectedProject);
    }
  }
}
