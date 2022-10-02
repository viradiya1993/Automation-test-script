import { Progress } from './progress.model';

export interface TestSuiteResult {
    testSuiteResultId: string;
    testExecutionId: string;
    testBotId: string;
    testSuiteId: string;
    testSuiteName: string;
    progress: Progress;
}
