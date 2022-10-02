import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { TestBotExecutorService } from '@app/core/services';
import { ConsolidatedExecution, TestSuiteResult } from '@app/shared/models';
import { TestSuiteResultComponent } from '../test-suite-result/test-suite-result.component';

@Component({
    selector: 'app-test-execution-details',
    templateUrl: './test-execution-details.component.html',
    styleUrls: ['./test-execution-details.component.scss']
})
export class TestExecutionDetailsComponent implements OnInit {

    consolidatedExecution: ConsolidatedExecution;

    displayedColumns: string[] = ["name", "passed", "failed", "skipped", "total"];

    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
                public dialog: MatDialog,
                private testBotExecutorService: TestBotExecutorService) {
        if (data) {
            this.consolidatedExecution = data.consolidatedExecution;
        }
    }

    ngOnInit(): void {
        this.testBotExecutorService.getExecution(this.consolidatedExecution.executionId)
            .subscribe(testSuiteResults => {
                this.consolidatedExecution.testSuiteResults = testSuiteResults;
            })
    }

    openTestSuiteResultDialog(testSuiteResult: TestSuiteResult) {
        this.testBotExecutorService.getConfiguration(testSuiteResult.testSuiteResultId).subscribe((configuration) => {
            this.testBotExecutorService.getTestSuiteResult(testSuiteResult.testSuiteResultId).subscribe((testScriptResults) => {
                const dialogRef = this.dialog.open(TestSuiteResultComponent, {
                    panelClass: 'test-result-dialog',
                    minHeight: "100vh",
                    minWidth: "68vw",
                    data: {
                        'testSuiteResult': testSuiteResult,
                        'testScriptResults': testScriptResults,
                        'executionConfiguration': configuration
                    },
                    // option1
                    // animation:{  },
                    position: { right: "1" },
                });

                dialogRef.afterClosed().subscribe(result => {
                });
            });
        });
    }

}
