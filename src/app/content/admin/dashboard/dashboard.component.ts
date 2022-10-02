import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { areaChartColors, areaChartOption, barChartOption, chartOptions, piChartOptions } from '@app/core/helpers/chart.helper';
import { CommonService, TestBotExecutorService, TestReportService } from '@app/core/services';
import { TestBot } from '@app/shared/models';
import { ExecutionReport, ExecutionTrend, TagReport, TestSuitReport } from '@app/shared/models/test-report.model';
import { GlobalService } from '@core/services/global.service';
import { ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { finalize } from 'rxjs/operators';
import { TestExecutionDetailsComponent } from '../test-results/components/test-execution-details/test-execution-details.component';
import { TestSuiteResultComponent } from '../test-results/components/test-suite-result/test-suite-result.component';

import { chartBarThickness, chartColors, lineChartColors, piChartColors } from '@core/helpers';
import { Progress, TestSuiteResult } from '@shared/models';

@Component({
    templateUrl: "./dashboard.component.html",
    styleUrls: ["./dashboard.component.scss"],
})

export class DashboardComponent implements OnInit {

    public isLoading = false;
    public testBotsFromApi: TestBot[] = [];
    public testBots: TestBot[] = [];
    public selectedBot: TestBot[] = [];
    public lastExecutionReport: ExecutionReport;
    // public botExecutionTrend: ExecutionReport[] = [];
    public executionTrend: ExecutionTrend;

    public tagReport: TagReport;

    public testSuiteReport: TestSuitReport;
    public testSuiteResults: TestSuiteResult[] = [];

    public trendLabels: Label[] = [];
    public trendData = [];
    public lastExecutionLabels: Label[] = [];
    public lastExecutionData = [];
    public testSuitLabels: Label[] = [];
    public testSuiteData = [];

    public tagDataLabels: Label[] = [];
    public tagData = [];

    public storyReport: any = [];
    public storyDataLabels: Label[] = [];
    public storyData: any = [];

    public epicReport: any = [];
    public epicDataLabels: Label[] = [];
    public epicData: any = [];
    public chartColors: Array<Color> = chartColors;
    public piChartColors: Color[] = piChartColors;
    public lineChartColors: Color[] = lineChartColors;
    public areaChartColors: Color[] = areaChartColors;
    public chartOptions: ChartOptions = chartOptions;
    public piChartOptions: ChartOptions = piChartOptions;
    public barchartOptionForTestSuiteResults: ChartOptions = { ...barChartOption };
    public barchartOption: ChartOptions = barChartOption;
    public areaChartOption: ChartOptions = { ...areaChartOption };
    private barThickness = chartBarThickness;

    constructor(
        private globalService: GlobalService,
        private testReport: TestReportService,
        public dialog: MatDialog,
        private testBotExecutorService: TestBotExecutorService,
        public readonly commonService: CommonService,
    ) {
    }

    ngOnInit() {
        this.barchartOptionForTestSuiteResults.onClick = (event, activeElements) => {
            if (activeElements.length) {
                this.openTestSuiteResultDialog(activeElements[0]["_index"]);
            }
        }

        this.areaChartOption.onClick = (event, activeElements) => {
            if (activeElements.length) {
                this.openTestExecutionDetailsDialog(activeElements[0]["_index"]);
            }
        }
        this.piChartOptions.cutoutPercentage = 70;
        this.piChartOptions.onClick = (event, activeElements) => {
            if (activeElements.length) {
                this.openTestExecutionDetailsDialog(-1);
            }
        }

        this.globalService.changeGoal("Dashboard");
        this.isLoading = true;
        this.testReport.getBots()
            .pipe(finalize(() => this.isLoading = false))
            .subscribe((res: any) => {
                this.testBotsFromApi = res;
                this.testBots = res;
                if (res.length) {
                    this.selectedBot = [res[0]];
                    this.botChange(this.selectedBot[0])
                }
            });
    }

    public botChange(testBot: TestBot) {
        this.testReport.getReports(testBot.testBotId).subscribe((res: any) => {
            this.manageBotChangeResponse(res);
        });
        this.testReport.getEpicReports(testBot.testBotId).subscribe((res: any) => {
            this.manageEpicReports(res);
        });

        this.testReport.getStoryReports(testBot.testBotId).subscribe((res: any) => {
            this.manageStoryReports(res);
        });
    }

    openTestSuiteResultDialog(index: number) {
        this.testBotExecutorService.getConfiguration(this.testSuiteResults[index].testSuiteResultId).subscribe((configuration) => {
            this.testBotExecutorService.getTestSuiteResult(this.testSuiteResults[index].testSuiteResultId)
                .subscribe((testScriptResults) => {
                    const dialogRef = this.dialog.open(TestSuiteResultComponent, {
                        panelClass: 'test-result-dialog',
                        minHeight: "100vh",
                        minWidth: "68vw",
                        data: {
                            'testSuiteResult': this.testSuiteResults[index],
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

    openTestExecutionDetailsDialog(index: number) {
        const dialogRef = this.dialog.open(TestExecutionDetailsComponent, {
            panelClass: 'test-result-dialog',
            minHeight: "100vh",
            minWidth: "71vw",
            data: {
                'consolidatedExecution': (index > -1 ? this.executionTrend[index] : this.lastExecutionReport),
            },
            // option1
            // animation:{  },
            position: { right: "1" },
        });

        dialogRef.afterClosed().subscribe(result => {

        });
    }

    private manageBotChangeResponse({ lastExecutionReport, executionTrend, testSuiteReport, tagReport }) {

        /*  **************** Last Execution Report - Pie Chart ******************** */
        this.lastExecutionReport = lastExecutionReport;
        const progress: Progress = lastExecutionReport.progress;
        this.lastExecutionLabels = ['Passed', 'Failed', 'Skipped'];
        this.lastExecutionData = [progress.passed, progress.failed, progress.skipped];
        if (progress.passed === 0 && progress.failed === 0 && progress.skipped === 0 && progress.total) {
            this.lastExecutionLabels.push('All');
            this.lastExecutionData.push(progress.total);
        }

        /*  **************** Bot Execution Trend - Vertical Line Chart ******************** */
        const skippedData = [];
        const failedData = [];
        const passedData = [];
        const totalData = [];
        this.trendLabels = [];

        this.executionTrend = executionTrend;

        executionTrend.executionReport.forEach(val => {
            this.trendLabels.push(val.executionNumber);
            passedData.push(val.progress.passed);
            failedData.push(val.progress.failed);
            skippedData.push(val.progress.skipped);
            totalData.push(val.progress.total);
        });

        this.trendData = [
            {
                label: "Passed",
                data: passedData,
                borderColor: areaChartColors[0].borderColor,
                backgroundColor: areaChartColors[0].borderColor,
                fill: true,
            },
            {
                label: "Failed",
                data: failedData,
                borderColor: areaChartColors[1].borderColor,
                backgroundColor: areaChartColors[1].borderColor,
                fill: true,
            },
            {
                label: "Skipped",
                data: skippedData,
                borderColor: areaChartColors[2].borderColor,
                backgroundColor: areaChartColors[2].borderColor,
                fill: true,
            }
        ];

        /*  **************** Test Suite Results - Vertical Bar Chart ******************** */
        this.testSuiteReport = testSuiteReport;
        this.testSuiteResults = this.testSuiteReport.testSuiteResults;
        const passedTestSuitData = [];
        const failedTestSuitData = [];
        const skippedTestSuitData = [];
        const testSuitLabels = [];

        this.testSuiteResults.forEach(val => {
            testSuitLabels.push(val.testSuiteName)
            passedTestSuitData.push(val.progress.passed);
            failedTestSuitData.push(val.progress.failed);
            skippedTestSuitData.push(val.progress.skipped);
        });

        this.testSuitLabels = testSuitLabels;
        this.testSuiteData = [
            { data: passedTestSuitData, label: 'Passed', barThickness: this.barThickness },
            { data: failedTestSuitData, label: 'Failed', barThickness: this.barThickness },
            { data: skippedTestSuitData, label: 'Skipped', barThickness: this.barThickness }
        ];

        /*  **************** Tag Results - Vertical Bar Chart ******************** */
        this.tagReport = tagReport;

        const tagResults = this.tagReport.tagResults;
        const passedTagData = [];
        const failedTagData = [];
        const skippedTagData = [];
        const tagDataLabels = [];

        tagResults.forEach(val => {
            tagDataLabels.push(val.tagName)
            passedTagData.push(val.progress.passed);
            failedTagData.push(val.progress.failed);
            skippedTagData.push(val.progress.skipped);
        });

        this.tagDataLabels = tagDataLabels;
        this.tagData = [
            { data: passedTagData, label: 'Passed', barThickness: this.barThickness },
            { data: failedTagData, label: 'Failed', barThickness: this.barThickness },
            { data: skippedTagData, label: 'Skipped', barThickness: this.barThickness }
        ];

    }

    private manageEpicReports(epicReport) {
        /* ******************* Epic Results - Vertical Bar Chart ***********************/
        this.epicReport = epicReport;

        const passedTagData = [];
        const failedTagData = [];
        const skippedTagData = [];
        const epicDataLabels = [];

        this.epicReport.reports.forEach(val => {
            epicDataLabels.push(val.name);
            passedTagData.push(val.passed);
            failedTagData.push(val.failed);
            skippedTagData.push(val.skipped);
        });

        this.epicDataLabels = epicDataLabels;
        this.epicData = [
            { data: passedTagData, label: 'Passed', barThickness: this.barThickness },
            { data: failedTagData, label: 'Failed', barThickness: this.barThickness },
            { data: skippedTagData, label: 'Skipped', barThickness: this.barThickness }
        ];
    }

    private manageStoryReports(storyReport) {
        /* ******************* Story Results - Vertical Bar Chart ***********************/
        this.storyReport = storyReport;
        const passedTagData = [];
        const failedTagData = [];
        const skippedTagData = [];
        const storyDataLabels = [];

        this.storyReport.reports.forEach(val => {
            storyDataLabels.push(val.name);
            passedTagData.push(val.passed);
            failedTagData.push(val.failed);
            skippedTagData.push(val.skipped);
        });

        this.storyDataLabels = storyDataLabels;
        this.storyData = [
            { data: passedTagData, label: 'Passed', barThickness: this.barThickness },
            { data: failedTagData, label: 'Failed', barThickness: this.barThickness },
            { data: skippedTagData, label: 'Skipped', barThickness: this.barThickness }
        ];
    }

    searchInBotList(text: string) {
        if (text) {
            const toLower = t => (t || '').toLowerCase()
            this.testBots = this.testBotsFromApi.filter(tb =>
                toLower(tb.name).includes(toLower(text)) || toLower(tb.description).includes(toLower(text))
            );
        } else {
            this.testBots = this.testBotsFromApi
        }
    }
}
