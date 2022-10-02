import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { TestBotExecutorService } from '@app/core/services';
import { Configuration, TestScriptResult, TestSuiteResult } from '@app/shared/models';
import { MatPaginator } from '@angular/material/paginator';
import { TestScriptResultComponent } from '../test-script-result/test-script-result.component';
import { IterationResultComponent } from '../iteration-result/iteration-result.component';
import { TestResultsFilterService } from '../../services/test-results-filter.service';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
    selector: 'app-test-suite-result',
    templateUrl: './test-suite-result.component.html',
    styleUrls: ['./test-suite-result.component.scss']
})
export class TestSuiteResultComponent implements OnInit {
    @ViewChild('filterFormMatTrigger') filterFormMatTrigger: MatMenuTrigger;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    executionConfiguration: Configuration;
    testSuiteResult: TestSuiteResult;
    testScriptResults: TestScriptResult[] = [];
    resultsLength = 0;
    // passedPer: number;
    // failedPer: number;
    // skippedPer: number;
    displayedColumns: string[] = ["name", "passed", "failed", "skipped", "total"];

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog,
                private testBotExecutorService: TestBotExecutorService,
                private testResultsFilterService: TestResultsFilterService) {

        if (data) {
            this.testSuiteResult = data.testSuiteResult;
            this.testScriptResults = data.testScriptResults;
            this.executionConfiguration = data.executionConfiguration;
        }
    }

    ngOnInit() {
        // let total = this.testSuiteResult.progress.passed + this.testSuiteResult.progress.failed + this.testSuiteResult.progress.skipped;
        // this.passedPer = Math.round((this.testSuiteResult.progress.passed / total) * 100);
        // this.failedPer = Math.round((this.testSuiteResult.progress.failed / total) * 100);
        // this.skippedPer = Math.round((this.testSuiteResult.progress.skipped / total) * 100);
    }

    applyFilter() {
        this.filterFormMatTrigger.closeMenu();
    }

    onFilterCancelClick() {
        this.filterFormMatTrigger.closeMenu();
    }

    openTestScriptResultDialog(testScriptResult: TestScriptResult) {
        this.testBotExecutorService.getIterationResults(testScriptResult.testScriptResultId).subscribe((iterationResults) => {
            testScriptResult.iterationResults = iterationResults;
            if (testScriptResult.iterationResults.length > 1) {
                const dialogRef = this.dialog.open(TestScriptResultComponent, {
                    panelClass: 'test-script-result-dialog',
                    minHeight: "100vh",
                    minWidth: "70vw",
                    maxWidth: "70vw",
                    data: {
                        'testScriptResult': testScriptResult,
                        'executionConfiguration': this.executionConfiguration
                    },
                    position: { right: "1" },
                });

                dialogRef.afterClosed().subscribe(result => {
                });
            } else if (testScriptResult.iterationResults.length === 1) {
                this.openIterationResultDialog(testScriptResult, testScriptResult.iterationResults[0].iterationNumber);
            }
        });
    }

    openIterationResultDialog(testScriptResult: TestScriptResult, iterationNumber: number) {
        const testScriptResultId = testScriptResult.testScriptResultId;
        this.testBotExecutorService.getIterationResultById(testScriptResultId, iterationNumber)
            .subscribe((iterationResult) => {
                const dialogRef = this.dialog.open(IterationResultComponent, {
                    panelClass: 'iteration-result-dialog',
                    minHeight: "100vh",
                    minWidth: "65vw",
                    maxWidth: "65vw",
                    data: {
                        'iterationResult': iterationResult,
                        'executionConfiguration': this.executionConfiguration,
                        'testScriptResult': testScriptResult,
                        'gridStatus': testScriptResult.iterationResults[iterationNumber - 1].gridStatus
                    },
                    position: { right: "1" },
                });

                dialogRef.afterClosed().subscribe(result => {
                });
            });
    }
}
