import { Configuration } from "./configuration.model";
import { Progress } from "./progress.model";
import { TestBotView } from "./test-bot-view.model";
import { TestSuiteResult } from "./test-suite-result.model";

export interface TestBotExecution {
    executionId: string;
    name: string;
    executionConfiguration: Configuration;
    createdDate: Date;
    startTime: Date;
    endTime: Date;
    progress: Progress;
    testSuiteResults: TestSuiteResult[];
    testBotView: TestBotView;
}