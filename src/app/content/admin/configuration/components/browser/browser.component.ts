import { Component, EventEmitter } from '@angular/core';
import { BrowserFormComponent } from '../browser-form/browser-form.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from '@core/services';

@Component({
    selector: 'app-browser',
    templateUrl: './browser.component.html',
    styleUrls: ['./browser.component.scss']
})
export class BrowserComponent {
    dialogClosedEvent = new EventEmitter();

    constructor(
        public dialog: MatDialog,
        public readonly commonService: CommonService
    ) {
    }

    openAddBrowserDialog() {
        const dialogRef = this.dialog.open(BrowserFormComponent);

        dialogRef.afterClosed().subscribe(result => {
            this.dialogClosedEvent.emit();
        });
    }
}
