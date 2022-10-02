import { Injectable } from '@angular/core';
import { TestBotExecutorService } from '@app/core/services';
import { ConsolidatedExecution, TestResultsFilter } from '@app/shared/models';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TestResultsFilterService {

    readonly defaultFilter: TestResultsFilter = {
        testBotId: '',
        releaseId: '',
        offset: 0,
        size: 10
    };
    appliedFilter: any = {
        testBot: undefined,
        release: undefined
    }
    private filterSource = new Subject();
    filterUpdated$ = this.filterSource.asObservable();
    private testResultsFilterSource = new Subject<ConsolidatedExecution[]>();
    testResultsFilterUpdated$ = this.testResultsFilterSource.asObservable();

    constructor(private testBotExecutorService: TestBotExecutorService) {
    }

    filterSourceTrigger() {
        this.filterSource.next();
    }

    filter(searchText = '') {
        return this.testBotExecutorService.getConsolidatedExecutionsByTestBotId(
            this.getFilterObj().testBotId,
            this.getFilterObj().offset,
            this.getFilterObj().size,
            searchText
        );
    }

    getFilterObj() {
        const filter = this.defaultFilter;
        if (this.appliedFilter.testBot) {
            filter.testBotId = this.appliedFilter.testBot.testBotId;
        } else {
            filter.testBotId = "";
        }
        filter.offset = this.appliedFilter.offset;
        filter.size = this.appliedFilter.size;
        return filter;
    }
}
