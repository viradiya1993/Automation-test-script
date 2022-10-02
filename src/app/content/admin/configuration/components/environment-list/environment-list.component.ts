import { AfterViewInit, Component, EventEmitter, OnInit, ViewChild, } from "@angular/core";
import { EnvironmentFormComponent } from "@content/admin/configuration/components";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { Environment } from "@app/shared/models";
import { EnvironmentService } from "@app/core/services";
import { merge, of as observableOf } from "rxjs";
import { catchError, map, startWith, switchMap } from "rxjs/operators";
import { ConfigurationService } from "../../services/configuration.service";

declare const $: any;

@Component({
    selector: "app-environment-list",
    templateUrl: "./environment-list.component.html",
    styleUrls: ["./environment-list.component.scss"],
})
export class EnvironmentListComponent implements OnInit, AfterViewInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    displayedColumns: string[] = [
        "name",
        "value",
        "createdBy",
        "updatedBy",
        "actions",
    ];
    environments: Environment[] = [];
    environmentToRemove: Environment;
    resultsLength = 0;
    isRateLimitReached = false;

    dialogClosedEvent = new EventEmitter();

    constructor(
        public dialog: MatDialog,
        private environmentService: EnvironmentService,
        private configurationService: ConfigurationService
    ) {
        this.configurationService.environmentCreatedObs.subscribe(
            ({ environment }) => {
                this.getEnvironments();
            }
        );
        this.configurationService.environmentUpdatedObs.subscribe(
            ({ environment }) => {
                this.getEnvironments();
            }
        );
        this.configurationService.environmentDeletedObs.subscribe(
            ({ environment }) => {
                this.getEnvironments();
            }
        );
    }

    ngOnInit() {
        $("#removeEnvironmentConfirmation").on("hide.bs.modal", function () {
            this.environmentToRemove = undefined;
        });
    }

    ngAfterViewInit() {
        // If the user changes the sort order, reset back to the first page.
        this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
        this.getEnvironments();
    }

    getEnvironments() {
        merge(this.sort.sortChange, this.paginator.page, this.dialogClosedEvent)
            .pipe(
                startWith({}),
                switchMap(() => {
                    return this.environmentService.getEnvironments(
                        this.sort.active,
                        this.sort.direction,
                        this.paginator.pageIndex,
                        this.paginator.pageSize
                    );
                }),
                map((res) => {
                    this.isRateLimitReached = false;
                    this.resultsLength = res.totalCount;
                    return res.data;
                }),
                catchError(() => {
                    this.isRateLimitReached = true;
                    return observableOf([]);
                })
            )
            .subscribe((data) => (this.environments = data));
    }

    setEnvironmentToRemove(environment: Environment) {
        this.environmentToRemove = environment;
    }

    removeEnvironment(environment: Environment) {
        this.environmentService
            .removeEnvironment(environment.environmentId)
            .subscribe(() => {
                this.dialogClosedEvent.emit();
                this.configurationService.environmentDeleted(environment);
            });
    }

    editEnvironment(environment: Environment) {
        const dialogRef = this.dialog.open(EnvironmentFormComponent, {
            data: { environment: environment },
        });

        dialogRef.afterClosed().subscribe((result) => {
            this.dialogClosedEvent.emit();
        });
    }
}
