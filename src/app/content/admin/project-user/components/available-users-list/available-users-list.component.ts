import { Component, Input, OnInit } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { MatSlideToggleChange } from "@angular/material/slide-toggle";
import { toggleResponse } from "@app/core/helpers";
import { RegisterService, UserService } from "@app/core/services";
import { Project, UserInfoModel } from "@app/shared/models";
import { ProjectUserService } from "../../services/project-user.service";
import { MessageService } from '@shared/components/message';

@Component({
    selector: "app-available-users-list",
    templateUrl: "./available-users-list.component.html",
    styleUrls: ["./available-users-list.component.scss"],
})
export class AvailableUsersListComponent implements OnInit {
    users: UserInfoModel[] = [];
    totalElements = 0;
    pageNumber = 10;
    currentIndex = 0;
    project: Project = null;
    deleteUserInfo: UserInfoModel = null;
    searchText = "";

    @Input("projectInput") projectInput: Project = null;

    constructor(
        private projectUserService: ProjectUserService,
        private userService: UserService,
        private registerService: RegisterService,
        private messageService: MessageService
    ) {
    }

    async ngOnInit() {
        if (this.projectInput) {
            this.project = this.projectInput;
            this.getUser();
        }

        this.projectUserService.userCreatedObs.subscribe(async () => {
            this.users = [];
            this.totalElements = 0;
            this.pageNumber = 10;
            this.getUser();
        });

        this.projectUserService.projectSelectedObs.subscribe(async ({ project }) => {
            this.project = project;
            this.users = [];
            this.totalElements = 0;
            this.pageNumber = 10;
            this.getUser();
        });

        this.projectUserService.userUpdatedObs.subscribe(async () => {
            this.users = [];
            this.totalElements = 0;
            this.pageNumber = 10;
            this.getUser();
        });

        this.projectUserService.userDeletedObs.subscribe(async () => {
            this.users = [];
            this.totalElements = 0;
            this.pageNumber = 10;
            this.getUser();
        });

        this.projectUserService.userAssignObs.subscribe(async () => {
            this.users = [];
            this.totalElements = 0;
            this.pageNumber = 10;
            this.getUser();
        });

        this.projectUserService.projectDeletedObs.subscribe(async () => {
            this.users = [];
            this.totalElements = 0;
            this.pageNumber = 10;
            this.getUser();
        });
    }

    updateUserStatus(user: UserInfoModel, event: MatSlideToggleChange) {
        if (event.checked) {
            this.userService.activate(user.userId).subscribe((data: any) => {
                this.projectUserService.userUpdated(null);
                toggleResponse(this.messageService, data);
            });
        } else {
            this.userService.deactivate(user.userId).subscribe((data: any) => {
                this.projectUserService.userUpdated(null);
                toggleResponse(this.messageService, data);
            });
        }
    }

    resendInvitationUser(user: UserInfoModel) {
        if (user && user.email) {
            this.registerService.resendInvite(user.email).subscribe((res: any) => {
                toggleResponse(this.messageService, res);
            });
        }
    }

    setUserToRemove(user: UserInfoModel) {
        this.deleteUserInfo = null;
        this.deleteUserInfo = user;
    }

    deleteUser() {
        if (this.deleteUserInfo) {
            this.userService
                .delete(this.deleteUserInfo.userId)
                .subscribe((data: any) => {
                    this.projectUserService.userDeleted(null);
                    toggleResponse(this.messageService, data);
                    this.deleteUserInfo = null;
                    // this.users = [];
                    // this.totalElements = 0;
                    // this.pageNumber = 10;
                    // this.getUser();
                });
        }
    }

    pageChange(pageEvent: PageEvent) {
        this.currentIndex = pageEvent.pageIndex;
        this.pageNumber = pageEvent.pageSize;
        this.getUser();
    }

    private getUser() {
        this.userService.getAllNonAdminUserListProject(this.currentIndex, this.pageNumber, this.searchText).subscribe((userData: any) => {
            this.users = userData.content;
            this.totalElements = userData.totalElements;
            this.pageNumber = userData.pageable.pageSize;
        });
    }
}
