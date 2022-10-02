import { UserDetailsComponent } from "./user-details/user-details.component";
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { CommonService, GlobalService, ProjectService } from "@core/services";
import { MatDialog } from "@angular/material/dialog";
import { ProjectInfoDialogComponent } from "./project-information-dialog.component";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { List } from "@app/shared/models";
import { MessageService } from '@shared/components/message';

@Component({
    selector: "app-project-info",
    templateUrl: "./project-information.component.html",
    styleUrls: ["./project-information.component.css"],
})
export class ProjectInformationComponent implements OnInit {
    clientSummary = [];
    linear: true;
    @Input() orgId: string;

    pageLength = 0;
    pageSize = 10;
    currentIndex = 0;
    organizationId: string = this.commonService.getOrganizationAndProjectIds().organizationId;

    dataSource = new MatTableDataSource();
    organizations: List[] = [];
    objects = [];

    pageSizeOptions: number[] = [10, 30, 50, 100];

    pageEvent: PageEvent;
    displayedColumns: string[] = [
        "projectName",
        "description",
        "isEnabled",
        "actions",
    ];

    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private projectService: ProjectService,
        private globalService: GlobalService,
        public messageService: MessageService,
        public dialog: MatDialog,
        private readonly commonService: CommonService
    ) {
    }

    ngOnInit() {
        const organizationAndProjectIds = this.commonService.getOrganizationAndProjectIds();
        this.organizationId = organizationAndProjectIds?.organizationId;

        this.globalService.changeGoal("Client Detail");

        this.getProjectInfoByOrgId();

        this.globalService.goal.subscribe((res) => {
            if (res === "Project Saved") {
                this.getProjectInfoByOrgId();
            }
        });
    }

    openDialog() {
        const obj = {
            flag: "project",
            orgId: this.orgId,
            title: "Add Project Information",
        };
        this.globalService.changeGoal(obj);
        const dialogRef = this.dialog.open(ProjectInfoDialogComponent, {
            width: "500px",
        });
        dialogRef.afterClosed().subscribe(() => {
            this.globalService.changeGoal("Client Detail");
        });
    }

    editProject(data) {
        // this.router.navigate(['client/' + data.orgId + '/detail/projectEdit/' + data.id ])
        data["title"] = "Edit Project Information";
        this.globalService.changeGoal(data);
        const dialogRef = this.dialog.open(ProjectInfoDialogComponent, {
            width: "500px",
        });
        dialogRef.afterClosed().subscribe(() => {
            this.globalService.changeGoal("Client Detail");
        });
    }

    deleteProject(projectId) {
        Swal.fire({
            title: "Are you sure?",
            text: "You will not be able to recover this imaginary file!",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, keep it",
        }).then((result) => {
            if (result.value) {
                this.projectService.delete(projectId).subscribe(() => {
                    Swal.fire(
                        "Deleted!",
                        "Your imaginary file has been deleted.",
                        "success"
                    );
                    this.getProjectInfoByOrgId();
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire("Cancelled", "Your imaginary file is safe :)", "error");
            }
        });
    }

    updateStatus(status: any, project: any) {
        if (project) {
            // tslint:disable-next-line:triple-equals
            if (status.checked == true) {
                this.projectService.enable(project).subscribe(() => {
                    this.getProjectInfoByOrgId();
                    this.messageService.showMessage({
                        timeout: 2000,
                        type: "success",
                        title: "",
                        body: "Project status enable.",
                    });
                });
            } else {
                this.projectService.disable(project).subscribe(() => {
                    this.getProjectInfoByOrgId();
                    this.messageService.showMessage({
                        timeout: 2000,
                        type: "success",
                        title: "",
                        body: "Project status disable.",
                    });
                });
            }

            const obj = this.objects.findIndex((data) => data.id === project);
            this.objects[obj]["isEnabled"] = status.checked;

            this.dataSource.data = this.objects;
        }
    }

    projectUser(project: any) {
        const obj = {
            flag: "users",
            projectId: project.id,
            orgId: this.organizationId,
            projectUsers: project.userIds,
            title: "Users List",
        };

        this.globalService.changeGoal(obj);

        const dialogRef = this.dialog.open(UserDetailsComponent, {
            width: "60%",
            height: "40%",
            maxWidth: "100vw",
        });
        dialogRef.afterClosed().subscribe(() => {
            this.globalService.changeGoal("Client Detail");
        });
    }

    loadProjectPage(pageEvent: any) {
        this.getProjectInfoByOrgId(pageEvent.pageIndex);
    }

    getProjectInfoByOrgId(pageIndex = 0) {
        this.currentIndex = pageIndex;

        let org = this.organizationId;
        if (this.orgId !== undefined) {
            org = this.orgId;
        }

        this.projectService
            .getProjectInfoByOrgId(org, pageIndex)
            .subscribe((result) => {
                if (result) {
                    this.objects = result.content;
                    this.dataSource.data = result.content;
                    this.pageSize = result.pageable;
                    this.pageLength = result.totalElements;
                }
            });
    }
}
