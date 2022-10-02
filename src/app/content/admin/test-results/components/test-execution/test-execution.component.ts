import { AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TestBotExecutorService } from '@app/core/services';
import { Configuration, ConsolidatedExecution, TestSuiteResult } from '@app/shared/models';
import { interval, merge, of as observableOf, Subscription } from 'rxjs';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { TestSuiteResultComponent } from '../test-suite-result/test-suite-result.component';
import { TestResultsFilterService } from '../../services/test-results-filter.service';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
    selector: 'app-test-execution',
    templateUrl: './test-execution.component.html',
    styleUrls: ['./test-execution.component.scss'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ])
    ],
})
export class TestExecutionComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild("filterFormMatTrigger") filterFormMatTrigger: MatMenuTrigger;

    refreshEvent = new EventEmitter();
    autoRefreshSubscription: Subscription;

    displayedColumns: string[] = ["executionName", "backgroundJobStatus", "progress", "executionTime", "createdBy"];
    displayedTSColumns: string[] = ["testSuiteName", "progress"];
    consolidatedExecutions: ConsolidatedExecution[] = [];
    expandedConsolidatedExecution: ConsolidatedExecution | null;
    resultsLength = 0;
    isRateLimitReached = false;
    isAutoRefresh = false;
    searchText = ""

    constructor(
        public dialog: MatDialog,
        private testBotExecutorService: TestBotExecutorService,
        private testResultsFilterService: TestResultsFilterService
    ) {
    }

    ngOnInit() {
        this.autoRefreshSubscription = interval(30000).subscribe(
            (val) => {
                if (this.isAutoRefresh) {
                    this.refreshEvent.emit();
                }
            });

        this.testResultsFilterService.filterUpdated$.subscribe(() => {
            this.refreshEvent.emit();
        });
        this.testResultsFilterService.appliedFilter = {
            testBot: undefined
        };
    }

    ngAfterViewInit() {

        // If the user changes the sort order, reset back to the first page.
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

        merge(this.sort.sortChange, this.paginator.page, this.refreshEvent)
            .pipe(
                startWith({}),
                switchMap(() => {
                    this.testResultsFilterService.appliedFilter.size = this.paginator.pageSize;
                    this.testResultsFilterService.appliedFilter.offset = this.paginator.pageIndex;
                    return this.testResultsFilterService.filter(this.searchText);
                }),
                map(res => {
                    this.isRateLimitReached = false;
                    this.resultsLength = res.totalCount;
                    return res.data;
                }),
                catchError(() => {
                    this.isRateLimitReached = true;
                    return observableOf([]);
                })
            ).subscribe(data => {
            this.consolidatedExecutions = data;
        });
    }

    openTestSuiteResultDialog(testSuiteResult: TestSuiteResult, executionConfiguration: Configuration) {
        this.testBotExecutorService.getTestSuiteResult(testSuiteResult.testSuiteResultId).subscribe((testScriptResults) => {
            const dialogRef = this.dialog.open(TestSuiteResultComponent, {
                panelClass: 'test-result-dialog',
                minHeight: "100vh",
                minWidth: "75vw",
                maxWidth: "75vw",
                data: {
                    'testSuiteResult': testSuiteResult,
                    'testScriptResults': testScriptResults,
                    'executionConfiguration': executionConfiguration,
                    'testSuiteResultId': testSuiteResult.testSuiteResultId
                },
                // option1
                // animation:{  },
                position: { right: "1" },
            });

            dialogRef.afterClosed().subscribe(result => {

            });
        });

        // this.testBotExecutorService.getTestSuitPagination(testSuiteResult.testSuiteResultId).subscribe((testScriptResults: any) => {
        //   const dialogRef = this.dialog.open(TestSuiteResultComponent, {
        //     panelClass: 'test-result-dialog',
        //     minHeight:"100vh",
        //     minWidth:"68vw",
        //     data: {
        //       'testSuiteResult': testSuiteResult,
        //       'testScriptResults': testScriptResults,
        //       'executionConfiguration': executionConfiguration
        //     },
        //      // option1
        //     //animation:{  },
        //     position: { right: "1" },
        //   });

        //   dialogRef.afterClosed().subscribe(result => {
        //   });
        // });
    }

    manualRefresh() {
        this.refreshEvent.emit();
    }

    onFilterReset() {
        this.searchText = "";
        this.refreshEvent.emit();
    }

    applyFilter() {
        this.filterFormMatTrigger.closeMenu();
        this.refreshEvent.emit();
    }

    onFilterCancelClick() {
        this.filterFormMatTrigger.closeMenu();
    }

    ngOnDestroy(): void {
        this.consolidatedExecutions = [];
        this.autoRefreshSubscription.unsubscribe();
    }
}
