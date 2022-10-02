import { InviteUserComponent } from "./invite-user/invite-user-dialog.component";
import { Component, Input, OnInit } from "@angular/core";
import { CommonService, GlobalService, UserService } from "@core/services";
import { MatDialog } from "@angular/material/dialog";
import { PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { UserInfoDialogComponent } from "./user-information-dialog.component";
import Swal from "sweetalert2/dist/sweetalert2.js";

@Component({
    selector: "app-user-info",
    templateUrl: "./user-information.component.html",
    styleUrls: ["./user-information.component.css"],
})
export class UserInformationComponent implements OnInit {
    displayedColumns: string[] = [
        "firstName",
        "email",
        "phone",
        "active",
        "actions",
    ];

    pageLength = 0;
    pageSize = 10;
    currentIndex = 0;

    organizationId: string = this.commonService.getOrganizationAndProjectIds().organizationId;

    dataSource = new MatTableDataSource();
    pageSizeOptions: number[] = [10, 30, 50, 100];

    pageEvent: PageEvent;
    objects = [];

    userInfo = [];
    linear: true;
    @Input() orgId: string;

    constructor(
        private globalService: GlobalService,
        private userService: UserService,
        public dialog: MatDialog,
        private readonly commonService: CommonService
    ) {
    }

    ngOnInit() {
        const organizationAndProjectIds = this.commonService.getOrganizationAndProjectIds();
        this.organizationId = organizationAndProjectIds?.organizationId;

        this.globalService.changeGoal("Client Detail");

        this.getUserListByOrgId();

        this.globalService.goal.subscribe((res) => {
            if (res === "User Saved") {
                this.getUserListByOrgId();
            }
        });
    }

    loadUsersPage(pageEvent: any) {
        this.getUserListByOrgId(pageEvent.pageIndex);
    }

    openInviteDialog() {
        const obj = {
            flag: "invitation",
            orgId: this.orgId,
            title: "Add User",
        };
        this.globalService.changeGoal(obj);
        const dialogRef = this.dialog.open(InviteUserComponent, {
            height: "40%",
            width: "60%",
        });
        dialogRef.afterClosed().subscribe(() => {
            this.getUserListByOrgId(0);
            this.globalService.changeGoal("Client Detail");
        });
    }

    openDialog() {
        const obj = {
            flag: "userInfo",
            orgId: this.orgId,
            title: "Add User",
        };
        this.globalService.changeGoal(obj);
        const dialogRef = this.dialog.open(UserInfoDialogComponent, {
            height: "40%",
            width: "60%",
        });
        dialogRef.afterClosed().subscribe(() => {
            this.getUserListByOrgId(0);
            this.globalService.changeGoal("Client Detail");
        });
    }

    editUser(data) {
        data["title"] = "Edit User";
        data["orgId"] = this.orgId;
        this.globalService.changeGoal(data);
        const dialogRef = this.dialog.open(UserInfoDialogComponent);
        dialogRef.afterClosed().subscribe(() => {
            this.getUserListByOrgId(0);
            this.globalService.changeGoal("Client Detail");
        });
    }

    deleteUser(userId) {
        Swal.fire({
            title: "Are you sure?",
            text: "You will not be able to recover this imaginary file!",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, keep it",
        }).then((result) => {
            if (result.value) {
                this.userService.delete(userId).subscribe((res) => {
                    if (res) {
                        this.getUserListByOrgId();
                        Swal.fire(
                            "Deleted!",
                            "Your imaginary file has been deleted.",
                            "success"
                        );
                    }
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire("Cancelled", "Your imaginary file is safe :)", "error");
            }
        });
    }

    userUpdate(userId: string, data, e) {
        if (data) {
            Swal.fire({
                title: "Are you sure?",
                text: "User Status Deactivate.",
                type: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, deacivate it!",
                cancelButtonText: "No, keep it",
            }).then((result) => {
                if (result.value) {
                    this.userService.deactivate(userId).subscribe((res) => {
                        if (res) {
                            const obj = this.objects.findIndex((d) => d.userId === userId);
                            this.objects[obj]["active"] = false;
                            this.dataSource.data = this.objects;
                            Swal.fire("Deactivated!", "User Status Deactivate.", "success");
                        }
                    });
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    const obj = this.objects.findIndex((d) => d.userId === userId);
                    this.objects[obj]["active"] = true;
                    this.dataSource.data = this.objects;
                    e.source.checked = true;
                    Swal.fire("Cancelled", "User Status Activate. :)", "error");
                }
            });
        } else {
            Swal.fire({
                title: "Are you sure?",
                text: "User Status Activate.",
                type: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, Acivate it!",
                cancelButtonText: "No, keep it",
            }).then((result) => {
                if (result.value) {
                    this.userService.activate(userId).subscribe((res) => {
                        if (res) {
                            const obj = this.objects.findIndex((d) => d.userId === userId);
                            this.objects[obj]["active"] = true;
                            this.dataSource.data = this.objects;
                            Swal.fire("Activated!", "User Status Activate.", "success");
                        }
                    });
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    const obj = this.objects.findIndex((d) => d.userId === userId);
                    this.objects[obj]["active"] = false;
                    this.dataSource.data = this.objects;
                    e.source.checked = false;
                    Swal.fire("Cancelled", "User Status Deactivate. :)", "error");
                }
            });
        }
    }

    getUserListByOrgId(pageIndex = 0) {
        this.currentIndex = pageIndex;

        let org = this.organizationId;

        if (this.orgId !== undefined) {
            org = this.orgId;
        }

        this.userService.getUserListByOrgId(org, pageIndex).subscribe((result) => {
            if (result) {
                this.objects = result.content;
                this.dataSource.data = result.content;
                this.pageSize = result.pageable;
                this.pageLength = result.totalElements;
            }
        });
    }
}
