import { CustomProperty } from './custom-property.model';
import { UserInfoModel } from './user-info.model';

export interface GlobalParameters {
    organizationId: string;
    projectId: string;
    globalParameterId: string;
    baseUrl: string;
    browser: string;
    gridUrl: string;
    type: string;
    screenshotAfterEachStep: boolean;
    screenshotOnError: boolean;
    screenshotOnFinish: boolean;
    closeBrowserAfterEachExecution: boolean;
    timeout: number;
    waitForElementTimeout: number;
    customProperties: CustomProperty[];
    createdBy: UserInfoModel;
    createdDate: Date;
    updatedBy: UserInfoModel;
    updatedDate: Date;
}
