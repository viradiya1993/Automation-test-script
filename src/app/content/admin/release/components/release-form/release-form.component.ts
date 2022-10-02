import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { NotificationService, ReleaseService } from '@app/core/services';
import { Release } from '@app/shared/models';

@Component({
    selector: 'app-release-form',
    templateUrl: './release-form.component.html',
    styleUrls: ['./release-form.component.scss']
})
export class ReleaseFormComponent implements OnInit {

    @ViewChild('releaseFormMatTrigger') releaseFormMatTrigger: MatMenuTrigger;
    @Output() releaseSaveChange = new EventEmitter();

    @Input() release: Release;
    releaseForm: FormGroup;

    constructor(private fb: FormBuilder, private releaseService: ReleaseService,
                private notificationService: NotificationService) {
        this.releaseForm = this.fb.group({
            name: ['', Validators.required],
            description: ['']
        });
    }

    ngOnInit() {
        if (this.release) {
            this.releaseForm.patchValue(this.release, { emitEvent: false });
        }
    }

    onReleaseCancelClick() {
        this.releaseForm.reset();
        this.releaseFormMatTrigger.closeMenu();
    }

    onReleaseSaveClick() {
        this.release = { ...this.release, ...this.releaseForm.value };
        if (this.release.releaseId) {
            this.releaseService.updateRelease(this.release).subscribe(() => {
                this.releaseForm.reset();
                this.release = null;
                this.notificationService.showNotification('Release updated successfully', 'top');
                this.releaseFormMatTrigger.closeMenu();
                this.releaseSaveChange.emit(null);
            });
        } else {
            this.releaseService.addRelease(this.release).subscribe((result) => {
                this.releaseForm.reset();
                this.release = null;
                this.notificationService.showNotification('Release created successfully', 'top');
                this.releaseFormMatTrigger.closeMenu();
                this.releaseSaveChange.emit(null);
            });
        }
    }

}
