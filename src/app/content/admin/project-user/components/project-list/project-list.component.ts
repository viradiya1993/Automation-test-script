import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { MatMenuTrigger } from "@angular/material/menu";
import { ActivatedRoute } from "@angular/router";
import { toggleResponse } from "@app/core/helpers";
import { CommonService, ProjectService } from "@app/core/services";
import { SELECTED_PROJECT } from "@app/shared/configs";
import { Project } from "@app/shared/models";
import { ProjectUserService } from "../../services/project-user.service";
import { MessageService } from "@shared/components/message";
import { NavbarComponent } from "@app/shared/components/navbar/navbar.component";

@Component({
  selector: "app-project-list",
  templateUrl: "./project-list.component.html",
  styleUrls: ["./project-list.component.scss"],
  providers: [NavbarComponent],
})
export class ProjectListComponent implements OnInit, AfterViewInit {
  projects: Project[] = [];
  selectedProject: Project = null;
  deletedProject: Project = null;

  @ViewChild(MatMenuTrigger) projectFormMatTrigger: MatMenuTrigger;

  constructor(
    private projectUserService: ProjectUserService,
    private projectService: ProjectService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private readonly commonService: CommonService,
    private navbarComponent: NavbarComponent
  ) {
    this.projectUserService.projectCreatedObs.subscribe(async ({}) => {
      this.getProject();
      this.navbarComponent.projectOrganization();
    });

    this.projectUserService.projectUpdatedObs.subscribe(async ({}) => {
      this.getProject();
      this.navbarComponent.projectOrganization();
    });

    this.projectUserService.projectDeletedObs.subscribe(async ({}) => {
      this.getProject();
      this.navbarComponent.projectOrganization();
    });

    this.projectUserService.userAssignObs.subscribe(async ({}) => {
      this.getProject();
    });
  }

  async ngOnInit() {
    this.getProject();
  }

  ngAfterViewInit() {
    this.route.queryParams.subscribe((params) => {
      if (params["project"]) {
        setTimeout(() => {
          this.projectFormMatTrigger.openMenu();
          // this.router.navigate([], {});
          const clean_uri =
            location.protocol + "//" + location.host + location.pathname;
          window.history.replaceState({}, document.title, clean_uri);
        }, 1200);
      }
    });
  }

  searchInProjectList(text) {
    this.getProject(text);
  }

  addProject() {
    this.projectFormMatTrigger.openMenu();
  }

  onProjectSelect(project: Project, event) {
    this.selectedProject = project;
    localStorage.removeItem(SELECTED_PROJECT);
    localStorage.setItem(SELECTED_PROJECT, JSON.stringify(project));
    this.projectUserService.projectSelected(project);
    this.projectUserService.filterReset();
  }

  onProjectEdit(project: Project) {
    this.selectedProject = project;
  }

  setProjectToRemove(project: Project) {
    this.deletedProject = project;
  }

  removeProject(project: Project) {
    this.projectService.delete(project.id).subscribe((data) => {
      this.deletedProject = null;
      this.projectUserService.projectDeleted(project);
      toggleResponse(this.messageService, data);
    });
  }

  private getProject(text = "") {
    const organizationAndProjectIds =
      this.commonService.getOrganizationAndProjectIds();
    const orgId = organizationAndProjectIds?.organizationId;
    this.projectService
      .getAllProjectInfoByOrgId(orgId, text)
      .subscribe((project: Project[]) => {
        this.projects = project;
      });
  }
}
