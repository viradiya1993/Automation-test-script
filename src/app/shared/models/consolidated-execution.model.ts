import { Configuration } from './configuration.model';
import { Progress } from './progress.model';
import { TestSuiteResult } from './test-suite-result.model';
import { UserInfoModel } from './user-info.model';

export interface ConsolidatedExecution {
    organizationId: string;
    projectId: string;
    testBotId: string;
    executionId: string;
    executionName: string;
    createdBy: UserInfoModel;
    createdDate: Date;
    updatedBy: UserInfoModel;
    updatedDate: Date;
    progress: Progress;
    executionConfiguration: Configuration;
    testSuiteResults: TestSuiteResult[];
}
