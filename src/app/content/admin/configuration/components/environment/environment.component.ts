import { Component, EventEmitter } from '@angular/core';
import { EnvironmentFormComponent } from '@content/admin/configuration/components';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-environment',
    templateUrl: './environment.component.html',
    styleUrls: ['./environment.component.scss']
})
export class EnvironmentComponent {
    dialogClosedEvent = new EventEmitter();

    constructor(public dialog: MatDialog) {
    }

    openAddEnvironmentDialog() {
        const dialogRef = this.dialog.open(EnvironmentFormComponent);

        dialogRef.afterClosed().subscribe(result => {
            this.dialogClosedEvent.emit();
        });
    }
}
