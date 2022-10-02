import { Component, EventEmitter, } from "@angular/core";
import { GridFormComponent } from "../grid-form/grid-form.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
    selector: 'app-grid',
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.scss']
})
export class GridComponent {
    dialogClosedEvent = new EventEmitter();

    constructor(public dialog: MatDialog) {
    }

    openAddGridDialog() {
        const dialogRef = this.dialog.open(GridFormComponent);
        dialogRef.afterClosed().subscribe(() => {
            this.dialogClosedEvent.emit();
        });
    }
}
