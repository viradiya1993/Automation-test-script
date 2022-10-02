import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { SchedulerFormComponent } from "../components/scheduler-form/scheduler-form.component";

@Injectable()
export class SchedulerDialogService {
    constructor(public dialog: MatDialog) {
    }

    openSchedulerDialog(scheduler: any) {
        const dialogRef = this.dialog.open(SchedulerFormComponent, {
            panelClass: "scheduler-form-dialog",
            minHeight: "100vh",
            minWidth: "65vw",
            maxWidth: "65vw",
            position: { right: "1" },
            data: {
                scheduler: scheduler
            }
        });

        dialogRef.afterClosed().subscribe(result => {

        });
    }
}


