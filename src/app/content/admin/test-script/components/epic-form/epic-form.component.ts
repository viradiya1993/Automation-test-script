import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { EpicService, NotificationService } from '@app/core/services';
import { Epic } from '@app/shared/models';

@Component({
    selector: 'app-epic-form',
    templateUrl: './epic-form.component.html',
    styleUrls: ['./epic-form.component.scss']
})
export class EpicFormComponent implements OnInit {

    @ViewChild('epicFormMatTrigger') epicFormMatTrigger: MatMenuTrigger;
    @Output() epicSaveChange = new EventEmitter();

    @Input() epic: Epic;
    epicForm: FormGroup;

    isEdit = false;

    constructor(private fb: FormBuilder, private epicService: EpicService,
                private notificationService: NotificationService) {
        this.epicForm = this.fb.group({
            name: ['', Validators.required],
            summary: ['']
        });
    }

    ngOnInit() {
        this.setEpicForEdit();
    }

    setEpicForEdit() {
        if (this.epic) {
            this.epicForm.patchValue(this.epic, { emitEvent: false });
            this.isEdit = true;
        }
    }

    onEpicCancelClick() {
        this.epicForm.reset();
        this.epicFormMatTrigger.closeMenu();
    }

    onEpicSaveClick() {
        this.epic = { ...this.epic, ...this.epicForm.value };
        if (this.epic.epicId) {
            this.epicService.updateEpic(this.epic).subscribe(() => {
                this.epicForm.reset();
                this.notificationService.showNotification('Epic updated successfully', 'top');
                this.epicFormMatTrigger.closeMenu();
                this.epicSaveChange.emit(null);
            });
        } else {
            this.epicService.addEpic(this.epic).subscribe((result) => {
                this.epicForm.reset();
                this.notificationService.showNotification('Epic created successfully', 'top');
                this.epicFormMatTrigger.closeMenu();
                this.epicSaveChange.emit(null);
            });
        }
    }

    changeTab(epicName, epicSummary, epicSaveBtn, epicCancelBtn) {
        const active = document.activeElement;
        epicSaveBtn = epicSaveBtn._elementRef.nativeElement;
        epicCancelBtn = epicCancelBtn._elementRef.nativeElement;
        if (active == epicName) {
            epicSummary.focus();
        }
        if (active == epicSummary) {
            epicSaveBtn.focus();
        }
        if (active == epicSaveBtn) {
            epicCancelBtn.focus();
        }
        if (active == epicCancelBtn) {
            epicName.focus();
        }
    }
}
