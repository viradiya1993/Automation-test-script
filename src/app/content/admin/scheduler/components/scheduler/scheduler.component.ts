import { Component } from '@angular/core';
import { CommonService, SchedulerService } from '@app/core/services';
import { Scheduler } from '@app/shared/models';
import { SchedulerDialogService } from "../../services/scheduler-dialog.service";

@Component({
    selector: 'app-scheduler',
    templateUrl: './scheduler.component.html',
    styleUrls: ['./scheduler.component.scss']
})
export class SchedulerComponent {

    constructor(
        private dialogService: SchedulerDialogService,
        private schedulerService: SchedulerService,
        public readonly commonService: CommonService
    ) {
    }

    openSchedulerDialog() {
        const scheduler: Scheduler = {
            organizationId: '',
            projectId: '',
            resourceId: this.schedulerService.appliedFilter.resourceId,
            resourceType: this.schedulerService.appliedFilter.resourceType,
            schedulerId: '',
            name: '',
            recurringRule: '',
            emails: [],
            active: true,
            executionConfiguration: undefined
        }

        this.dialogService.openSchedulerDialog(scheduler);
    }
}
