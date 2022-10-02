import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Scheduler } from '@app/shared/models';

@Component({
    selector: 'app-scheduler-delete-dialog',
    templateUrl: './scheduler-delete-dialog.component.html',
    styleUrls: ['./scheduler-delete-dialog.component.scss']
})
export class SchedulerDeleteDialogComponent implements OnInit {

    scheduler: Scheduler;

    constructor(@Inject(MAT_DIALOG_DATA) private data: any,
                private dialogRef: MatDialogRef<SchedulerDeleteDialogComponent>) {
        if (this.data) {
            this.scheduler = data;
        }
    }

    ngOnInit(): void {
    }

    onConfirmClick(): void {
        this.dialogRef.close(true);
    }

}
