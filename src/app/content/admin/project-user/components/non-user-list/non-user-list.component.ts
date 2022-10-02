import { Component, Input, OnInit } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { MatSlideToggleChange } from "@angular/material/slide-toggle";
import { toggleResponse } from "@app/core/helpers";
import { RegisterService, UserService } from "@app/core/services";
import { Project, UserInfoModel } from "@app/shared/models";
import { ProjectUserService } from "../../services/project-user.service";
import { MessageService } from '@shared/components/message';

@Component({
    selector: "app-non-users-list",
    templateUrl: "./non-user-list.component.html",
    styleUrls: ["./non-user-list.component.scss"],
})
export class NonUserListComponent implements OnInit {
    users: UserInfoModel[] = [];
    totalElements = 0;
    pageNumber = 10;
    currentIndex = 0;
    searchText = "";
    selectedProject: Project = null;
    deleteUserInfo: UserInfoModel = null;

    @Input() projectInput: Project = null;

    constructor(
        private projectUserService: ProjectUserService,
        private userService: UserService,
        private registerService: RegisterService,
        private messageService: MessageService
    ) {
        this.projectUserService.userCreatedObs.subscribe(() => {
            this.users = [];
            this.totalElements = 0;
            this.pageNumber = 10;
            this.getUser();
        });

        this.projectUserService.projectSelectedObs.subscribe(({ project }) => {
            this.selectedProject = project;
            this.users = [];
            this.totalElements = 0;
            this.pageNumber = 10;
            this.getUser();
        });

        this.projectUserService.userUpdatedObs.subscribe(() => {
            this.users = [];
            this.totalElements = 0;
            this.pageNumber = 10;
            this.getUser();
        });

        this.projectUserService.userDeletedObs.subscribe(() => {
            this.users = [];
            this.totalElements = 0;
            this.pageNumber = 10;
            this.getUser();
        });

        if (this.projectInput) {
            this.selectedProject = this.projectInput;
        }
    }

    async ngOnInit() {
        this.getUser();
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
        if (this.selectedProject) {
            this.userService.getAllNonAdminUserListProject(this.currentIndex, this.pageNumber, this.searchText).subscribe((user: any) => {
                this.users = user.content;
                this.totalElements = user.totalElements;
                this.pageNumber = user.pageable.pageSize;
            });
        } else {
            this.userService.getAllNonAdminUserList(this.currentIndex, this.pageNumber, this.searchText).subscribe((user: any) => {
                this.users = user.content;
                this.totalElements = user.totalElements;
                this.pageNumber = user.pageable.pageSize;
            });
        }
    }
}
