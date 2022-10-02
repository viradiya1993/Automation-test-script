import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService, TestBotService } from '@app/core/services';
import { TestBot, TestSuiteView } from '@app/shared/models';
import * as _ from 'lodash';
import { TestBotFilterService } from '../../services/test-bot-filter.service';
import { TestBotTab } from '@app/shared/enums';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
    selector: 'app-test-bot-details',
    templateUrl: './test-bot-details.component.html',
    styleUrls: ['./test-bot-details.component.scss']
})
export class TestBotDetailsComponent implements OnInit {

    testBot: TestBot;
    testBotForm: FormGroup = this.fb.group({
        name: ['', Validators.required],
        description: '',
        testSuites: this.fb.array([])
    });
    testSuites: TestSuiteView[] = [];
    searchTextTS = "";
    type: 'text' | 'number' = 'text';
    currentIndex = 0;
    totalCount = 0;

    constructor(private fb: FormBuilder, private testBotService: TestBotService,
                private testBotFilterService: TestBotFilterService,
                private notificationService: NotificationService) {
    }

    ngOnInit() {
        this.getTestBot();
        this.testBotFilterService.refreshTestBotDetailsUpdated$.subscribe(() => {
            if (this.testBotFilterService.selectedTab === TestBotTab.TestBotDetails) {
                this.getTestBot();
            }
        });
        this.testSuites = [];
        this.getTestSuites();
    }

    getTestSuites() {
        this.testBotService.getTestSuites("name", "asc", this.currentIndex, 10).subscribe(result => {
            this.totalCount = result.totalCount;
            this.testSuites = [...result.data, ...this.testSuites];
        });
    }
    search(event: any) {
        if (this.searchTextTS !== event) {
            this.searchTextTS = event;
        }
    }
    onNext() {
        if (this.totalCount > this.testSuites.length) {
            this.currentIndex = this.currentIndex + 1;
            this.getTestSuites();
        }
    }

    getTestSuiteFormArray() {
        return this.testBotForm.get('testSuites') as FormArray;
    }

    onTestBotSaveClick() {
        this.testBot = { ...this.testBot, ...this.testBotForm.getRawValue() };
        if (this.testBot.testBotId) {
            this.testBotService.updateTestBot(this.testBot).subscribe(() => {
                this.notificationService.showNotification('Test Bot updated successfully', 'top');
            });
        } else {
            this.testBotService.addTestBot(this.testBot).subscribe(() => {
                this.notificationService.showNotification('Test Bot created successfully', 'top');
            });
        }
    }

    addTestSuiteToTestBot(testSuite: TestSuiteView) {
        if (_.find(this.getTestSuiteFormArray().value, { 'testSuiteId': testSuite.testSuiteId })) {
        } else {
            this.getTestSuiteFormArray().push(
                this.fb.group({
                    testSuiteId: [testSuite.testSuiteId, Validators.required],
                    name: [testSuite.name, Validators.required],
                    numberOfTestScripts: [testSuite.numberOfTestScripts, Validators.required],
                }));
        }
    }

    removeTestSuiteFromTestBot(index: number) {
        this.getTestSuiteFormArray().removeAt(index);
    }

    getTestBot() {
        if (this.testBotFilterService.appliedFilter.testBot) {
            this.testBotForm.reset();
            this.testBotForm.setControl('testSuites', this.fb.array([]));
            this.testBotService
                .getTestBot(this.testBotFilterService.appliedFilter.testBot.testBotId)
                .subscribe((testBot) => {
                    this.testBot = testBot;
                    this.testBotForm.patchValue(this.testBot);
                    this.testBot.testSuites.forEach(testSuite => {
                        this.addTestSuiteToTestBot(testSuite);
                    });
                });
        }
    }

    drop(event: CdkDragDrop<any[]>) {
        if (event.previousContainer === event.container) {
            const dir = event.currentIndex > event.previousIndex ? 1 : -1;
            const from = event.previousIndex;
            const to = event.currentIndex;
            const testSuiteFA = this.getTestSuiteFormArray();
            const temp = testSuiteFA.at(from);
            for (let i = from; i * dir < to * dir; i = i + dir) {
                const current = testSuiteFA.at(i + dir);
                testSuiteFA.setControl(i, current);
            }
            testSuiteFA.setControl(to, temp);
        } else {
            const selectedTestSuite = event.previousContainer.data[
                event.previousIndex
                ] as TestSuiteView;
            const testSuite = {
                testSuiteId: selectedTestSuite.testSuiteId,
                name: selectedTestSuite.name,
                numberOfTestScripts: selectedTestSuite.numberOfTestScripts
            } as TestSuiteView;
            this.addTestSuiteToTestBot(testSuite);
            // tslint:disable-next-line:no-unused-expression
            (event.currentIndex, testSuite);
        }
    }
}
