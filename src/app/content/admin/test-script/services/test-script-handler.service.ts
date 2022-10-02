import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class TestScriptHandlerService {

    public openTestScriptEditObs: Observable<{ testscriptId: string, closeAll: boolean }>;
    public openTestScriptExecutionObs: Observable<{ testscriptId: string, closeAll: boolean }>;
    private = false;
    private openTestScriptEditSubject: Subject<{ testscriptId: string, closeAll: boolean }>;
    private openTestScriptExecutionSubject: Subject<{ testscriptId: string, closeAll: boolean }>;

    constructor() {
        this.openTestScriptEditSubject = new Subject<{ testscriptId: string, closeAll: boolean }>();
        this.openTestScriptEditObs = this.openTestScriptEditSubject.asObservable();

        this.openTestScriptExecutionSubject = new Subject<{ testscriptId: string, closeAll: boolean }>();
        this.openTestScriptExecutionObs = this.openTestScriptExecutionSubject.asObservable();
    }

    public openTestScriptEdit(testscriptId: string, closeAll = true) {
        this.openTestScriptEditSubject.next({ testscriptId, closeAll });
    }

    public openTestScriptExecution(testscriptId: string, closeAll = true) {
        this.openTestScriptExecutionSubject.next({ testscriptId, closeAll });
    }

}
