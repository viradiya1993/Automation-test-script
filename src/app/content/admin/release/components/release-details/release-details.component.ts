import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService, ReleaseService, TestBotService } from '@app/core/services';
import { Release, TestBot } from '@app/shared/models';
import { ReleaseFilterService } from '../../services/release-filter.service';

@Component({
    selector: 'app-release-details',
    templateUrl: './release-details.component.html',
    styleUrls: ['./release-details.component.scss']
})
export class ReleaseDetailsComponent implements OnInit {

    release: Release;
    testBots: TestBot[] = [];
    releaseDetailsForm: FormGroup;
    searchTextPS: string;

    constructor(private fb: FormBuilder,
                private releaseService: ReleaseService,
                private releaseFilterService: ReleaseFilterService,
                private testBotService: TestBotService,
                private notificationService: NotificationService) {
        this.releaseDetailsForm = this.fb.group({
            name: ['', Validators.required],
            description: [''],
            testBots: this.fb.array([])
        });
    }

    ngOnInit(): void {
        this.getRelease();
        this.releaseFilterService.filterUpdated$.subscribe(() => {
            this.getRelease();
        });

        this.testBotService.getTestBots()
            .subscribe(res => {
                if (!res) {
                    this.testBots = [];
                } else {
                    this.testBots = res['data'];
                }
            });

    }

    public displayFn(testBot: TestBot): string {
        return testBot?.name || '';
    }

    getTestBotFormArray() {
        return this.releaseDetailsForm.get('testBots') as FormArray;
    }

    getRelease() {
        if (this.releaseFilterService.appliedFilter.release) {
            this.releaseService
                .getReleaseById(this.releaseFilterService.appliedFilter.release.releaseId)
                .subscribe((release) => {
                    this.release = release;
                    this.releaseDetailsForm.patchValue(this.release);
                    this.release.testBots.forEach((testBot, index) => {
                        this.addTestBot(index, testBot);
                    });
                });
        }
    }

    getControls(frmGrp: FormGroup, key: string) {
        return (<FormArray>frmGrp.controls[key]).controls;
    }

    drop(event: CdkDragDrop<any[]>) {
        if (event.previousContainer === event.container) {
            const dir = event.currentIndex > event.previousIndex ? 1 : -1;
            const from = event.previousIndex;
            const to = event.currentIndex;
            const testbotFA = this.getTestBotFormArray();
            const temp = testbotFA.at(from);
            for (let i = from; i * dir < to * dir; i = i + dir) {
                const current = testbotFA.at(i + dir);
                testbotFA.setControl(i, current);
            }
            testbotFA.setControl(to, temp);
        } else {
            const selectedTestbot = event.previousContainer.data[event.previousIndex] as TestBot;
            const testbot = {
                testBotId: selectedTestbot.testBotId,
                name: selectedTestbot.name
            };
            this.addTestBot(event.currentIndex, testbot);
        }
    }

    addTestBot(index: number, testBot: { testBotId: string, name: string }) {
        const testbotFA = this.getTestBotFormArray();
        const testbots = (testbotFA.value) as TestBot[];
        const isIndexExist = testbots.findIndex(tb => tb.testBotId === testBot.testBotId);
        if (isIndexExist < 0) {
            if (index >= 0 && index <= testbotFA.length) {
                testbotFA.insert(index,
                    this.fb.group({
                        testBotId: [testBot.testBotId, Validators.required],
                        name: [testBot.name, Validators.required],
                    }));
            }
        }
    }

    deleteTestBot(index: number) {
        this.getTestBotFormArray().removeAt(index);
    }

    deleteAllTestBots() {
        this.releaseDetailsForm.setControl('testBots', this.fb.array([]));
    }

    onReleaseSaveClick() {
        this.release = { ...this.release, ...this.releaseDetailsForm.getRawValue() };
        if (this.release.releaseId) {
            this.releaseService.updateRelease(this.release).subscribe(() => {
                this.notificationService.showNotification('Release updated successfully', 'top');
            });
        } else {
            this.releaseService.addRelease(this.release).subscribe(() => {
                this.notificationService.showNotification('Release created successfully', 'top');
            });
        }
    }

}
