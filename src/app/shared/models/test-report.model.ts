import { Progress, } from './progress.model';
import { TestSuiteResult } from './test-suite-result.model';

export interface TestReport {
    executionTrend: ExecutionTrend;
    lastExecutionReport: ExecutionReport;
    tagReport: TagReport;
    testSuiteReport: TestSuitReport;
}

export interface ExecutionReport {
    executionId: string;
    executionName: string;
    executionDate: Date;
    progress: Progress;
    testBotId: string;
    testBotName: string;
}

export interface ExecutionTrend {
    createdDate: Date;
    executionReports: ExecutionReport[];
}

export interface TagReport {
    executionId: string;
    executionName: string;
    executionDate: Date;
    tagResults: TagResult[];
}

export interface TagResult {
    progress: Progress;
    tagName: string;
}

export interface TestSuitReport {
    executionId: string;
    executionName: string;
    executionDate: Date;
    testSuiteResults: TestSuiteResult[];
}
