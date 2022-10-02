import { List } from "@app/shared/models";
import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { GlobalService, OrganizationService } from "@core/services/";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { ClientDialogComponent } from "./client-dialog/client-dialog.component";
import { MatMenuTrigger } from "@angular/material/menu";
import { CLIENT_ID, COMPANY_DETAIL } from '@shared/configs';
import { MessageService } from '@shared/components/message';

@Component({
    selector: "app-client",
    templateUrl: "./client.component.html",
    styleUrls: ["./client.component.scss"],
})
export class ClientComponent implements OnInit {
    displayedColumns: string[] = [
        "orgName",
        "userName",
        "email",
        "phone",
        "status",
        "actions",
    ];

    pageLength = 0;
    pageSize = 10;
    currentIndex = 0;

    dataSource = new MatTableDataSource();
    organizations: List[] = [];
    objects = [];

    pageSizeOptions: number[] = [10, 30, 50, 100];

    pageEvent: PageEvent;

    checked = false;
    @ViewChild('filterFormMatTrigger') filterFormMatTrigger: MatMenuTrigger;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private router: Router,
        private organizationService: OrganizationService,
        private globalService: GlobalService,
        public messageService: MessageService,
        public dialog: MatDialog
    ) {
    }

    ngOnInit() {
        localStorage.removeItem(CLIENT_ID);
        this.globalService.changeGoal("Client");
        this.getClient();
    }

    loadClientsPage(pageEvent: any) {
        this.getClient(pageEvent.pageIndex);
    }

    editClient(data) {
        data["title"] = "Edit Organization Information";
        this.globalService.changeGoal(data);
        const dialogRef = this.dialog.open(ClientDialogComponent);
        dialogRef.afterClosed().subscribe(() => {
            this.globalService.changeGoal("Client");
            this.getClient();
        });
    }

    getClient(offset = 0) {
        this.currentIndex = offset;
        this.organizationService
            .getClients(offset, this.pageSize)
            .subscribe((client: any) => {
                const data: any[] = [];
                if (client.content) {
                    client.content.forEach((org: any) => {
                        const obj: any = {
                            orgName: org.organization.orgName,
                            subDomain: org.organization.subDomain,
                            userName: org.adminUser
                                ? org.adminUser.firstname + " " + org.adminUser.lastname
                                : "No Admins found for this organization",
                            email: org.adminUser ? org.adminUser.email : null,
                            phone: org.adminUser ? org.adminUser.phone : null,
                            id: org.organization.id,
                            userId: org.adminUser ? org.adminUser.userId : null,
                            active: org.organization.active,
                        };
                        data.push(obj);
                    });
                }

                this.objects = data;
                this.dataSource.data = data;
                this.pageSize = client.pageable;
                this.pageLength = client.totalElements;
            });
    }

    getColSpan(ele: any) {
        return ele === "No Admins found for this organization" ? 3 : null;
    }

    getTextSpan(ele: any) {
        return ele === "No Admins found for this organization" ? "none" : null;
    }

    openDialog() {
        const obj = {
            flag: "Client",
            title: "Add Organization Information",
        };
        this.globalService.changeGoal(obj);
        const dialogRef = this.dialog.open(ClientDialogComponent);
        dialogRef.afterClosed().subscribe(() => {
            this.globalService.changeGoal("Client");
        });
    }

    updateStatus(status: any, org: any) {
        if (org) {
            // tslint:disable-next-line:triple-equals
            if (status.checked == true) {
                this.organizationService.enableOrganization(org).subscribe(() => {
                    this.messageService.showMessage({
                        timeout: 2000,
                        type: "success",
                        title: "",
                        body: "Organization status enable.",
                    });
                });
            } else {
                this.organizationService.disableOrganization(org).subscribe(() => {
                    this.messageService.showMessage({
                        timeout: 2000,
                        type: "success",
                        title: "",
                        body: "Organization status disable.",
                    });
                });
            }

            const organization = this.objects.findIndex((data) => data.id === org);
            this.objects[organization]["active"] = status.checked;

            this.dataSource.data = this.objects;
        }
    }

    companyDetail(companyDetail: any) {
        const obj = {
            orgName: companyDetail.orgName,
        };
        localStorage.setItem(COMPANY_DETAIL, JSON.stringify(obj));
        localStorage.setItem(CLIENT_ID, companyDetail.id);
        this.router.navigate(["/clients/" + companyDetail.id + "/detail"]);
    }

    applyFilter() {
        this.filterFormMatTrigger.closeMenu();
    }

    onFilterCancelClick() {
        this.filterFormMatTrigger.closeMenu();
    }
}
