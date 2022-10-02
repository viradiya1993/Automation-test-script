import { Injectable } from "@angular/core";
import { SchedulerService } from "@app/core/services";
import { SchedulerResourceType, TestBotTab } from "@app/shared/enums";
import { TestBotFilter } from "@app/shared/models";
import { Subject } from "rxjs";
import { TestResultsFilterService } from "../../test-results/services/test-results-filter.service";

@Injectable()
export class TestBotFilterService {
    selectedTab: TestBotTab = TestBotTab.TestResults;
    readonly defaultFilter: TestBotFilter = {
        testBotId: "",
        offset: 0,
        size: 10,
    };
    appliedFilter: any = {
        testBot: undefined,
    };
    private filterSource = new Subject();
    filterUpdated$ = this.filterSource.asObservable();
    private refreshTestBotDetailsSource = new Subject();
    refreshTestBotDetailsUpdated$ =
        this.refreshTestBotDetailsSource.asObservable();

    constructor(
        private testResultsFilterService: TestResultsFilterService,
        private schedulerService: SchedulerService
    ) {
    }

    filter() {
        this.testResultsFilterService.appliedFilter.testBot =
            this.appliedFilter.testBot;

        this.schedulerService.appliedFilter.resourceId =
            this.appliedFilter.testBot.testBotId;
        this.schedulerService.appliedFilter.resourceType =
            SchedulerResourceType.TestBot;

        if (this.selectedTab === TestBotTab.TestResults) {
            this.testResultsFilterService.filterSourceTrigger();
        } else if (this.selectedTab === TestBotTab.TestBotDetails) {
            this.refreshTestBotDetailsSource.next();
        } else if (this.selectedTab === TestBotTab.Schedulers) {
            this.schedulerService.filter();
        }
    }
}
