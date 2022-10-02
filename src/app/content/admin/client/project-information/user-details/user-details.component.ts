import { Component, OnInit } from "@angular/core";
import { UserService } from "@core/services/user.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { GlobalService, RoleService } from "@core/services";
import { ProjectService } from "@app/core/services";
import { UserRoleModal } from "@app/shared/models";
import { MessageService } from '@shared/components/message';

@Component({
    selector: "app-user-dialog",
    templateUrl: "./user-details.component.html",
    styleUrls: ["./user-details.component.scss"],
})
export class UserDetailsComponent implements OnInit {
    selectedItems = [];
    selectedRole = "";
    options = [];
    userForm: FormGroup;
    submitted = false;
    orgId: string = null;
    projectId: string = null;
    currentProjectUsers = [];
    dataSource = new MatTableDataSource();
    userLists = [];
    userResponse = [];
    userRoleObject = [];
    roles = [];
    userRole: UserRoleModal = new UserRoleModal();
    displayedColumns: string[] = ["name", "email", "role", "actions"];
    updateDataTable = true;
    deletedObject = [];

    config = {
        displayKey: "display",
        search: true,
        height: "200px",
        limitTo: this.options.length,
        placeholder: "Select User",
        moreText: "more",
        noResultsFound: "No results found!",
        searchPlaceholder: "Search",
        searchOnKey: "display",
    };

    constructor(
        private projectService: ProjectService,
        private globalService: GlobalService,
        private userService: UserService,
        private messageService: MessageService,
        private roleService: RoleService,
        private _fb: FormBuilder,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<any>
    ) {
        this.globalService.goal.subscribe((res) => {
            this.projectId = res.projectId;
            this.orgId = res.orgId;
            this.currentProjectUsers = res.projectUsers;
        });

        setTimeout(() => {
            this.callApi();
        }, 100);
    }

    // convenience getter for easy access to form fields
    get f() {
        return this.userForm.controls;
    }

    ngOnInit() {
        this.dialogRef.updateSize("60%", "80%");
        this.userForm = this._fb.group({
            userIds: [null, Validators.compose([Validators.required])],
            role: [null, Validators.compose([Validators.required])],
        });
    }

    getRoleData(role) {
        const roleData = this.roles.find(res => res.id === role);
        if (roleData) {
            return roleData.roleName;
        }
        return roleData;
    }

    callApi() {
        if (this.projectId && this.orgId) {
            this.getRole();

            // Get Not Assign Role User
            const userData = [];
            this.userService.getAllUserListByOrgId().subscribe((org) => {
                this.userResponse = org;
                org.forEach((element) => {
                    userData.push({
                        id: element.userId,
                        display: element.firstName + " " + element.lastName,
                    });
                });

                this.projectService.getUserByProjectId(this.projectId)
                    .subscribe((res) => {
                        this.dataSource.data = res.users;
                        this.userLists = res.users;

                        res.users.forEach((ele) => {
                            const userIndex = userData.findIndex((u) => u.id === ele.userId);
                            if (userIndex === 1) {
                                userData.splice(userIndex, 1);
                            }
                        });

                        this.options = userData;
                    });
            });
        }
    }

    getRole() {
        this.roleService.getAssignList().subscribe((res) => {
            this.roles = res;
        });
    }

    selectionChanged(event) {
        //
    }

    addUser() {
        this.submitted = true;
        const that = this;

        if (this.userForm.invalid) {
            return;
        }

        const userIds = this.userForm.value["userIds"];
        const role = this.userForm.value["role"];

        userIds.forEach(function (ele) {
            const user = that.userResponse.find((res) => res.userId === ele.id);
            if (user) {
                const roleFind = that.userRoleObject.findIndex((res) => res.userId === ele.id);
                const userRole = {
                    organizationId: that.orgId,
                    projectId: that.projectId,
                    roleId: role,
                    userId: ele.id,
                };

                if (roleFind === -1) {
                    that.userRoleObject.push(userRole);
                }

                user["userRole"] = userRole;
                const recordFind = that.userLists.findIndex((res) => res.userId === ele.id);

                if (recordFind === -1) {
                    that.userLists.push(user);
                }
            }
        });

        this.dataSource.data = this.userLists;
        this.updateDataTable = false;

        setTimeout(() => {
            this.userForm.clearValidators();
            this.selectedItems = [];
            this.selectedRole = "";
            this.updateDataTable = true;
            this.submitted = false;
        }, 100);
    }

    deleteProject(user) {
        const userIndex = this.userLists.findIndex((res) => res.userId === user.userId);
        this.deletedObject.push(user);

        this.userLists.splice(userIndex, 1);
        this.dataSource.data = this.userLists;
        this.updateDataTable = false;

        setTimeout(() => {
            this.updateDataTable = true;
        }, 100);
    }

    saveUser() {
        const users: UserAndRole[] = [];

        if (this.userLists.length > 0) {
            this.userLists.forEach(function (user) {
                users.push({
                    userId: user.userId,
                    roleId: user.userRole.roleId
                });
            });
        }

        this.projectService.addUser(users).subscribe((res) => {
            if (res.status <= 300) {
                this.messageService.showMessage({
                    timeout: 2000,
                    type: "success",
                    title: "",
                    body: "Add User SuccessFully in Project.",
                });

                this.dialog.closeAll();
            } else {
                this.messageService.showMessage({
                    timeout: 2000,
                    type: "error",
                    title: "",
                    body: "Add User SuccessFully in Project.",
                });
            }
        });
    }

    getUserRole(user) {
        this.userService.getUserRole(this.projectId, user).subscribe((res) => {
            if (res.id) {
                // this.messageService.showMessage({ timeout: 2000, type: 'success', title: '', body: res.message });
                return res.roleId;
            } else {
                return null;
            }
        });
    }
}

export interface UserAndRole {
    userId: string;
    roleId: string;
}
