import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatMenuTrigger } from "@angular/material/menu";
import { ActivatedRoute } from "@angular/router";
import { GlobalService, ProjectService, RoleService } from "@app/core/services";
import { ORGANIZATION_ID } from "@app/shared/configs";
import { Project, Role, UserInfoModel } from "@app/shared/models";
import { ProjectUserService } from "../services/project-user.service";
import { MatDialog } from "@angular/material/dialog";
import { UserFormComponent } from "@content/admin/project-user/components/user-form/user-form.component";

@Component({
  selector: "app-project-user",
  templateUrl: "./project-user.component.html",
  styleUrls: ["./project-user.component.scss"],
})
export class ProjectUserComponent implements OnInit, AfterViewInit {
  projects: Project[] = [];
  users: UserInfoModel[] = [];
  roles: Role[] = [];

  selectedProject: Project;
  selectedProjectId: string;

  selectedUser: UserInfoModel;
  selectedUserId: string;

  showList = "all-users";

  @ViewChild("filterFormMatTrigger") filterFormMatTrigger: MatMenuTrigger;
  @ViewChild("usersRef") usersRef: any;

  @ViewChild(MatMenuTrigger) assignUserFormMatTrigger: MatMenuTrigger;
  @Input() userAddError = "";
  searchText = "";

  constructor(
    private projectUserService: ProjectUserService,
    private globalService: GlobalService,
    private projectService: ProjectService,
    private roleService: RoleService,
    private route: ActivatedRoute,
    private readonly dialog: MatDialog
  ) {
    this.globalService.changeGoal("Projects & Users Module");

    this.projectUserService.projectSelectedObs.subscribe(({ project }) => {
      if (project) {
        this.selectedProject = project;
        this.selectedProjectId = project.id;
        this.showList = "users";
      } else {
        this.selectedProject = null;
        this.selectedProjectId = null;
        this.showList = "all-users";
      }
    });
    this.projectUserService.filterResetObs.subscribe((bool) => {
      if (bool) {
        this.searchText = "";
      }
    });

    this.projectUserService.userFilterObs.subscribe(({ filter }) => {
      this.searchText = "";
    });

    this.projectUserService.userFilterObs.subscribe((res) => {
      if (!res.filter) {
        this.usersRef.currentIndex = 0;
        this.usersRef.pageNumber = 10;
        this.usersRef.searchText = "";
        if (
          this.showList === "all-users" ||
          (this.showList === "available-users" && this.selectedProject)
        ) {
          this.usersRef.getUser();
        } else if (this.showList === "users" && this.selectedProject) {
          this.usersRef.getUserList();
        }
      }
    });
  }

  ngOnInit() {
    this.getProject();
    this.getRole();
  }

  ngAfterViewInit() {
    this.route.queryParams.subscribe((params) => {
      if (params["invite"]) {
        setTimeout(() => {
          this.assignUserFormMatTrigger.openMenu();
          const clean_uri =
            location.protocol + "//" + location.host + location.pathname;
          window.history.replaceState({}, document.title, clean_uri);
        }, 1200);
      }
    });
  }

  updateList() {
    const currentProject = this.selectedProject;
    this.getProject();
    this.projectUserService.projectSelected(null);
    this.projectUserService.projectSelected(currentProject);
  }

  modelChangeShowList(e) {
    this.searchText = "";
  }

  closeInfoMsg() {
    this.userAddError = "";
  }

  dashboardClick() {
    this.userAddError = "";
  }

  applyFilter() {
    this.filterFormMatTrigger.closeMenu();
    this.usersRef.currentIndex = 0;
    this.usersRef.pageNumber = 10;
    this.usersRef.searchText = this.searchText;
    this.projectUserService.userFilter(this.searchText);
    if (
      this.showList === "all-users" ||
      (this.showList === "available-users" && this.selectedProject)
    ) {
      this.usersRef.getUser();
    } else if (this.showList === "users" && this.selectedProject) {
      this.usersRef.getUserList();
    }
  }

  onFilterCancelClick() {
    this.searchText = "";
    this.filterFormMatTrigger.closeMenu();
  }

  openAddUserForm() {
    this.dialog.open(UserFormComponent, {
      width: "40%",
      maxWidth: "100vw",
      height: "75vh",
      position: { right: "1", top: "4.8%" },
      data: {
        selectedProject: this.selectedProject,
      },
    });
  }

  private getProject() {
    const orgId = localStorage.getItem(ORGANIZATION_ID);
    this.projectService
      .getAllProjectInfoByOrgId(orgId)
      .subscribe((project: Project[]) => {
        this.projects = project;
      });
  }

  private getRole() {
    this.roleService.getAssignList().subscribe((roles: Role[]) => {
      this.roles = roles;
    });
  }
}
