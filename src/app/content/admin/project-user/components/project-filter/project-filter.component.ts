import { Component } from "@angular/core";
import { SELECTED_PROJECT } from "@app/shared/configs";
import { Project } from "@app/shared/models";
import { ProjectUserService } from "../../services/project-user.service";

@Component({
    selector: "app-project-filter",
    templateUrl: "./project-filter.component.html",
})
export class ProjectFilterComponent {
    selectedProject: Project = null;

    constructor(private projectUserService: ProjectUserService) {
        this.projectUserService.projectSelectedObs.subscribe(({ project }) => {
            this.selectedProject = project;
        });
    }

    removeFilter() {
        this.selectedProject = null;
        localStorage.setItem(SELECTED_PROJECT, null);
        this.projectUserService.projectSelected(null);
    }
}
