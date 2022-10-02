import { Locator } from './locator.model';
import { UserInfoModel } from "@shared/models/user-info.model";

export interface Page {
    pageId: string;
    pageName: string;
    description: string;
    locators: Locator[];
    projectId: string;
    websiteId: string;
    createdBy?: UserInfoModel;
    createdDate?: Date;
    updatedBy?: UserInfoModel;
    updatedDate?: Date;
}
