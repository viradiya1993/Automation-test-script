import { UserInfoModel } from './user-info.model';

export interface Execution {
    organizationId: string;
    projectId: string;
    testBotId: string;
    executionId: string;
    executionName: string;
    createdBy: UserInfoModel;
    createdDate: Date;
    updatedBy: UserInfoModel;
    updatedDate: Date;
}
