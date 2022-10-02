import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { NotificationService, ReleaseService } from '@app/core/services';
import { ReleaseRun } from '@app/shared/models';

@Component({
    selector: 'app-release-run-form',
    templateUrl: './release-run-form.component.html',
    styleUrls: ['./release-run-form.component.scss']
})
export class ReleaseRunFormComponent implements OnInit {

    @ViewChild('releaseRunFormMatTrigger') releaseRunFormMatTrigger: MatMenuTrigger;
    @Output() releaseRunSaveChange = new EventEmitter();

    @Input() releaseId: string;
    releaseRunForm: FormGroup;

    releaseRun: ReleaseRun;

    constructor(private fb: FormBuilder, private releaseService: ReleaseService,
                private notificationService: NotificationService) {
        this.releaseRunForm = this.fb.group({
            releaseId: ['', Validators.required],
            name: ['', Validators.required]
        });
    }

    ngOnInit() {

    }

    setReleaseId() {
        this.releaseRunForm.patchValue({ 'releaseId': this.releaseId });
    }

    onReleaseRunCancelClick() {
        this.releaseRunForm.reset();
        this.releaseRunFormMatTrigger.closeMenu();
    }

    onReleaseRunSaveClick() {
        this.releaseRun = { ...this.releaseRun, ...this.releaseRunForm.value };
        this.releaseService.executeRelease(this.releaseRun).subscribe((result) => {
            this.releaseRunForm.reset();
            this.releaseRun = null;
            this.notificationService.showNotification('Release Run successfully', 'top');
            this.releaseRunFormMatTrigger.closeMenu();
            this.releaseRunSaveChange.emit(null);
        });

    }

}

