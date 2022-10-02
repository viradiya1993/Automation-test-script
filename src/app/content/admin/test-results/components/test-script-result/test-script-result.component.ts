import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { TestBotExecutorService } from '@app/core/services';
import { Configuration, TestScriptResult } from '@app/shared/models';
import { IterationResultComponent } from '../iteration-result/iteration-result.component';

@Component({
    selector: 'app-test-script-result',
    templateUrl: './test-script-result.component.html',
    styleUrls: ['./test-script-result.component.scss']
})
export class TestScriptResultComponent implements OnInit {
    @ViewChild('filterFormMatTrigger') filterFormMatTrigger: MatMenuTrigger;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    testScriptResult: TestScriptResult;
    executionConfiguration: Configuration;
    // tslint:disable-next-line:max-line-length
    displayedColumns2: string[] = ["iterationNumber", "dataInfo", "executionTime", "gridStatus", "startTimeStamp", "endTimeStamp"]; // "skipped", "status",
    resultsLength = 0;

    // tslint:disable-next-line:max-line-length
    constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog, private testBotExecutorService: TestBotExecutorService) {
        if (data) {
            this.testScriptResult = data.testScriptResult;
            this.executionConfiguration = data.executionConfiguration;
        }
    }

    ngOnInit() {
    }

    applyFilter() {
        this.filterFormMatTrigger.closeMenu();
    }

    onFilterCancelClick() {
        this.filterFormMatTrigger.closeMenu();
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

    public closeAll() {
        this.dialog.closeAll();
    }

    downloadConsolidatedReport() {
        const file = this.testScriptResult.consolidatedResult;
        if (file) {
            window.location.href = file;
        }
    }
}
