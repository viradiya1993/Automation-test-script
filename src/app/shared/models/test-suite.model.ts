import { TestScriptView } from './test-script-view.model';
import { UserInfoModel } from './user-info.model';

export interface TestSuite {
    organizationId: string;
    projectId: string;
    testSuiteId: string;
    name: string;
    description: string;
    testScripts: TestScriptView[];
    createdBy: UserInfoModel;
    createdDate: Date;
    updatedBy: UserInfoModel;
    updatedDate: Date;
}
