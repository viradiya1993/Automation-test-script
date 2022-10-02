import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SchedulerService } from '@app/core/services';
import { Scheduler } from '@app/shared/models';
import { Subscription } from 'rxjs';
import { SchedulerDialogService } from '../../services/scheduler-dialog.service';
import { SchedulerDeleteDialogComponent } from '../scheduler-delete-dialog/scheduler-delete-dialog.component';
import cronstrue from 'cronstrue';

@Component({
    selector: 'app-scheduler-list',
    templateUrl: './scheduler-list.component.html',
    styleUrls: ['./scheduler-list.component.scss']
})
export class SchedulerListComponent implements OnInit, OnDestroy {
    schedulers: Scheduler[] = [];

    private subs = new Subscription();

    constructor(private schedulerService: SchedulerService, public dialog: MatDialog, private dialogService: SchedulerDialogService) {
        const updateSub = this.schedulerService.schedulerFilterUpdated$.subscribe(
            (res) => {
                this.schedulers = res.data;
            }
        );
        this.subs.add(updateSub);
    }

    ngOnInit(): void {
        this.getSchedulers();
    }

    openSchedulerDialog(scheduler: Scheduler) {
        this.dialogService.openSchedulerDialog(scheduler);
    }

    removeScheduler(scheduler: Scheduler) {
        const dialogRef = this.dialog.open(SchedulerDeleteDialogComponent, {
            panelClass: "deleteModal-dialog",
            data: {
                scheduler: scheduler
            },
        });

        dialogRef.afterClosed().subscribe((confirmed: boolean) => {
            if (confirmed) {
                this.schedulerService.removeScheduler(scheduler.schedulerId).subscribe(() => {
                    this.getSchedulers();
                });
            }
        });
    }

    getSchedulers() {
        this.schedulerService.filter();
    }

    parseCronTime(croxExpression): string {
        return cronstrue.toString(croxExpression);
    }

    ngOnDestroy() {
        this.schedulers = [];
        this.subs.unsubscribe();
    }
}
