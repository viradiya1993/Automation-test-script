import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { TestSuiteResultComponent } from '@app/content/admin/test-results/components/test-suite-result/test-suite-result.component';
import { TestBotExecutorService } from '@app/core/services';
import { Configuration, ReleaseRunView, TestSuiteResult } from '@app/shared/models';
import { ReleaseFilterService } from '../../services/release-filter.service';

@Component({
    selector: 'app-test-run-list',
    templateUrl: './test-run-list.component.html',
    styleUrls: ['./test-run-list.component.scss']
})
export class TestRunListComponent implements OnInit {

    @ViewChild(MatAccordion) releaseRunViewsMA: MatAccordion;
    expanded = false;
    releaseRunViews: ReleaseRunView[] = [];

    constructor(
        public dialog: MatDialog,
        private testBotExecutorService: TestBotExecutorService,
        private releaseFilterService: ReleaseFilterService
    ) {

        this.releaseFilterService.testRunFilterUpdated$.subscribe(releaseRunViews => {
            this.releaseRunViews = releaseRunViews;
            this.expanded = false;
        });

        this.releaseFilterService.filter();

    }

    ngOnInit(): void {
    }

    toggle() {
        if (this.expanded) {
            this.releaseRunViewsMA.closeAll();
            this.expanded = false;
        } else {
            this.releaseRunViewsMA.openAll();
            this.expanded = true;
        }
    }

    openTestSuiteResultDialog(testSuiteResult: TestSuiteResult, executionConfiguration: Configuration) {

        this.testBotExecutorService.getTestSuiteResult(testSuiteResult.testSuiteResultId).subscribe((testScriptResults) => {
            const dialogRef = this.dialog.open(TestSuiteResultComponent, {
                panelClass: 'test-result-dialog',
                minHeight: "100vh",
                minWidth: "68vw",
                data: {
                    'testSuiteResult': testSuiteResult,
                    'testScriptResults': testScriptResults,
                    'executionConfiguration': executionConfiguration
                },
                // option1
                // animation:{  },
                position: { right: "1" },
            });

            dialogRef.afterClosed().subscribe(result => {
            });
        });
    }
}
