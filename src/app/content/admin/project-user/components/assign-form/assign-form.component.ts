import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, } from "@angular/core";
import { COMMA, ENTER, SPACE } from "@angular/cdk/keycodes";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatAutocomplete, MatAutocompleteSelectedEvent, } from "@angular/material/autocomplete";
import { CommonService, ProjectService, UserService } from "@app/core/services";
import { Project, Role, UserInfoModel, UserRoleModal, } from "@app/shared/models";
import { Observable, of } from "rxjs";
import { debounceTime, finalize, switchMap, tap } from "rxjs/operators";
import * as _ from "lodash";
import { SELECTED_PROJECT } from "@app/shared/configs";
import { ProjectUserService } from "../../services/project-user.service";
import { toggleResponse } from "@app/core/helpers";
import { MessageService } from '@shared/components/message';

@Component({
    selector: "app-assign-user",
    templateUrl: "./assign-form.component.html",
})
export class AssignUserComponent implements OnInit {
    assignForm: FormGroup;
    submitted: Boolean = false;
    project: Project = null;
    organizationId: string = null;
    users: any[] = [];
    separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];
    visible = true;
    selectable = true;
    removable = true;
    roles: Role[] = [];
    selectedRole: string = null;
    selectedUser: any[] = [];
    filteredUsers = [];
    filteredRoles: Observable<Role[]>;
    isLoading = false;

    @Input() projectInput: Project = null;
    @Input() roleList: Role[] = [];
    @Output() closeMenu = new EventEmitter();

    @ViewChild("userInput") userInput: ElementRef<HTMLInputElement>;
    @ViewChild("roleInput") roleInput: ElementRef<HTMLInputElement>;
    @ViewChild("auto") matAutocomplete: MatAutocomplete;

    constructor(
        private _fb: FormBuilder,
        private messageService: MessageService,
        private projectUserService: ProjectUserService,
        private projectService: ProjectService,
        private userService: UserService,
        private readonly commonService: CommonService
    ) {
        const organizationAndProjectIds = this.commonService.getOrganizationAndProjectIds();
        this.organizationId = organizationAndProjectIds.organizationId;
        this.project = null;
        if (localStorage.getItem(SELECTED_PROJECT)) {
            this.project = JSON.parse(localStorage.getItem(SELECTED_PROJECT));
        } else {
            this.project = null;
        }
    }

    get f() {
        return this.assignForm.controls;
    }

    ngOnInit() {
        const organizationAndProjectIds = this.commonService.getOrganizationAndProjectIds();
        this.organizationId = organizationAndProjectIds?.organizationId;

        this.assignForm = this._fb.group({
            userId: [""],
            roleId: [this.selectedRole, Validators.compose([Validators.required])],
        });

        this.assignForm.controls["userId"].valueChanges
            .pipe(
                debounceTime(500),
                tap(() => {
                    this.filteredUsers = [];
                }),
                switchMap((filterValue) => {
                    if (typeof filterValue === "string" && filterValue.length > 0) {
                        this.isLoading = true;
                        return this.userService
                            .userFilter(this.project.id, filterValue)
                            .pipe(
                                finalize(() => {
                                    this.isLoading = false;
                                })
                            );
                    } else {
                        return of(null);
                    }
                })
            )
            .subscribe((res) => {
                this.isLoading = false;
                if (!res) {
                    this.filteredUsers = [];
                } else {
                    const userMap = {};
                    this.users.forEach((user: UserInfoModel) => (userMap[user.id] = 1));
                    const mergeUser = res.filter((e) => userMap[e.id] === undefined);
                    this.filteredUsers = [];
                    this.filteredUsers = mergeUser;
                }
            });

        this.roles = this.roleList;
    }

    add(event: any): void {
        this.assignForm.patchValue({
            userId: null,
        });
    }

    remove(user: UserInfoModel): void {
        const index = this.users.indexOf(user);

        if (index >= 0) {
            this.users.splice(index, 1);
        }
    }

    selected(event: MatAutocompleteSelectedEvent): void {
        this.users.push(event.option.value);
        this.userInput.nativeElement.value = "";
        this.assignForm.patchValue({
            userId: null,
        });
    }

    saveAssignUser() {
        this.submitted = true;
        if (this.assignForm.invalid || this.users.length === 0) {
            return false;
        }

        let userRoles: UserRoleModal[] = [];

        if (this.project && this.project.roles && this.project.roles.length > 0) {
            this.project.roles.forEach((role) => {
                if (role.users.length > 0) {
                    role.users.forEach((user) => {
                        userRoles.push({
                            userId: user.id ? user.id : user.userId,
                            roleId: role.id ? role.id : role.roleId,
                        });
                    });
                }
            });
        }

        this.users.forEach((item) => {
            userRoles.push({
                userId: item.id ? item.id : item.userId,
                roleId: this.selectedRole,
            });
        });

        userRoles = _.uniqWith(userRoles, _.isEqual);

        this.projectService
            .addUser(userRoles)
            .subscribe((data: any) => {
                toggleResponse(this.messageService, data);
                this.projectUserService.userRoleAssign(this.project.id, null);
                this.selectedUser = null;
                this.selectedRole = null;
                this.users = [];
                this.assignForm.reset();
                this.closeMenu.emit();
            });
    }

    onAssignUserCancel() {
        this.selectedUser = null;
        this.selectedRole = null;
        this.assignForm.reset();
        this.closeMenu.emit();
    }

    changeTab(assignUser, assignUserRole, assignUserSaveBtn, assignUserCancelBtn) {
        const active = document.activeElement;
        assignUserRole = assignUserRole._elementRef.nativeElement;
        assignUserSaveBtn = assignUserSaveBtn._elementRef.nativeElement;
        assignUserCancelBtn = assignUserCancelBtn._elementRef.nativeElement;

        if (active == assignUser) {
            assignUserRole.focus();
        }
        if (active == assignUserRole) {
            assignUserSaveBtn.focus();
        }
        if (active == assignUserSaveBtn) {
            assignUserCancelBtn.focus();
        }
        if (active == assignUserCancelBtn) {
            assignUser.focus();
        }
    }
}
