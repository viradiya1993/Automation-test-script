import { AfterViewInit, Component, EventEmitter, OnInit, ViewChild, } from "@angular/core";
import { GridFormComponent } from "../grid-form/grid-form.component";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { Grid } from "@app/shared/models";
import { GridService } from "@app/core/services";
import { merge, of as observableOf } from "rxjs";
import { catchError, map, startWith, switchMap } from "rxjs/operators";

declare const $: any;

@Component({
    selector: "app-grid-list",
    templateUrl: "./grid-list.component.html",
    styleUrls: ["./grid-list.component.scss"]
})
export class GridListComponent implements OnInit, AfterViewInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    displayedColumns: string[] = [
        "name",
        "createdBy",
        "updatedBy",
        "actions",
    ];
    grids: Grid[] = [];
    gridToRemove: Grid;
    resultsLength = 0;
    isRateLimitReached = false;

    dialogClosedEvent = new EventEmitter();

    constructor(public dialog: MatDialog, private gridService: GridService) {
    }

    openAddGridDialog() {
        const dialogRef = this.dialog.open(GridFormComponent);

        dialogRef.afterClosed().subscribe((result) => {
            this.dialogClosedEvent.emit();
        });
    }

    ngOnInit() {
        $("#removeGridConfirmation").on("hide.bs.modal", function () {
            this.gridToRemove = undefined;
        });
    }

    ngAfterViewInit() {
        // If the user changes the sort order, reset back to the first page.
        this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

        merge(this.sort.sortChange, this.paginator.page, this.dialogClosedEvent)
            .pipe(
                startWith({}),
                switchMap(() => {
                    return this.gridService.getGrids(
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
            .subscribe((data) => (this.grids = data));
    }

    setGridToRemove(grid: Grid) {
        this.gridToRemove = grid;
    }

    removeGrid(grid: Grid) {
        this.gridService.removeGrid(grid.gridId).subscribe(() => {
            this.dialogClosedEvent.emit();
        });
    }

    editGrid(grid: Grid) {
        const dialogRef = this.dialog.open(GridFormComponent, {
            data: { grid: grid },
        });

        dialogRef.afterClosed().subscribe((result) => {
            this.dialogClosedEvent.emit();
        });
    }
}
