import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService, TestBotService } from '@app/core/services';
import { TestBot } from '@app/shared/models';

@Component({
    selector: 'app-test-bot-form',
    templateUrl: './test-bot-form.component.html',
    styleUrls: ['./test-bot-form.component.scss']
})
export class TestBotFormComponent implements OnInit {
    @Output() testBotSaveChange = new EventEmitter();
    @Output() closeMenu = new EventEmitter();

    testBot: TestBot = {
        createdBy: undefined,
        createdDate: undefined,
        description: undefined,
        name: undefined,
        organizationId: undefined,
        projectId: undefined,
        testBotId: undefined,
        testSuites: [],
        updatedBy: undefined,
        updatedDate: undefined
    };
    testBotForm: FormGroup;

    constructor(private fb: FormBuilder, private testBotService: TestBotService,
                private notificationService: NotificationService) {
        this.testBotForm = this.fb.group({
            name: ['', Validators.required],
            description: ['']
        });
    }

    ngOnInit() {
        if (this.testBot.testBotId) {
            this.testBotForm.patchValue(this.testBot, { emitEvent: false });
        }
    }

    onTestBotCancelClick() {
        this.testBotForm.reset();
        this.closeMenu.emit(true);
    }

    onTestBotSaveClick() {
        this.testBot = { ...this.testBot, ...this.testBotForm.value };
        if (this.testBot.testBotId) {
            this.testBotService.updateTestBot(this.testBot).subscribe(() => {
                this.testBotForm.reset();
                this.testBot = null;
                this.notificationService.showNotification('Test Bot updated successfully', 'top');
                this.closeMenu.emit(true);
                this.testBotSaveChange.emit(null);
            });
        } else {
            this.testBotService.addTestBot(this.testBot).subscribe((result) => {
                this.testBotForm.reset();
                this.testBot = null;
                this.notificationService.showNotification('Test Bot created successfully', 'top');
                this.closeMenu.emit(true);
                this.testBotSaveChange.emit(null);
            });
        }
    }

    changeTab(testBotName, testBotDescription, testBotSaveBtn, testBotCancelBtn) {
        const active = document.activeElement;
        testBotSaveBtn = testBotSaveBtn._elementRef.nativeElement;
        testBotCancelBtn = testBotCancelBtn._elementRef.nativeElement;

        if (active == testBotName) {
            testBotDescription.focus();
        } else if (active == testBotDescription) {
            testBotSaveBtn.focus();
        } else if (active == testBotSaveBtn) {
            testBotCancelBtn.focus();
        } else if (active == testBotCancelBtn) {
            testBotName.focus();
        }
    }
}
