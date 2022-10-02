import { Injectable } from '@angular/core';
import { TestSuite } from '@app/shared/models';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TestSuiteFilterService {

    private filterSource = new Subject();
    filterUpdated$ = this.filterSource.asObservable();
    private testSuiteChangedSource = new Subject<TestSuite>();
    testSuiteChanged$ = this.testSuiteChangedSource.asObservable();
    private testSuiteAddedSource = new Subject<TestSuite>();
    testSuiteAdded$ = this.testSuiteAddedSource.asObservable();
    private testSuiteUpdatedSource = new Subject<TestSuite>();
    testSuiteUpdated$ = this.testSuiteUpdatedSource.asObservable();
    private testSuiteListEmptySource = new Subject<TestSuite>();
    testSuiteListEmpty$ = this.testSuiteListEmptySource.asObservable();

    constructor() {
    }

    testSuiteChanged(testSuite: TestSuite) {
        this.testSuiteChangedSource.next(testSuite);
    }

    testSuiteAdded(testSuite: TestSuite) {
        this.testSuiteAddedSource.next(testSuite);
    }

    testSuiteUpdated(testSuite: TestSuite) {
        this.testSuiteUpdatedSource.next(testSuite);
    }

    testSuiteListEmpty() {
        this.testSuiteListEmptySource.next();
    }
}
