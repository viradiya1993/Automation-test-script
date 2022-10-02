import { Data } from './data.model';
import { TestStep } from './test-step.model';
import { UserInfoModel } from "@shared/models/user-info.model";

export interface TestScript {
    data: Data[];
    description: string;
    name: string;
    organizationId: string;
    projectId: string;
    tags: string[];
    storyId: string;
    testScriptId: string;
    testSteps: TestStep[];
    type: string;
    status: string;
    websiteId: string;
    createdBy?: UserInfoModel;
    createdDate?: Date;
    updatedBy?: UserInfoModel;
    updatedDate?: Date;
    configRequired?: boolean;

    // ticket : 732
    consolidateResults: boolean
    consolidatedResultFile?: string
}
