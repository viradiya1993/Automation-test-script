import { Component } from "@angular/core";
import { ProjectUserService } from "../../services/project-user.service";

@Component({
    selector: "app-user-filter",
    templateUrl: "./user-filter.component.html",
})
export class UserFilterComponent {
    searchText: string = null;

    constructor(private projectUserService: ProjectUserService) {
        this.projectUserService.userFilterObs.subscribe(({ filter }) => {
            this.searchText = filter;
        });
    }

    removeFilter() {
        this.searchText = null;
        this.projectUserService.userFilter(null);
    }
}
