import { UserInfoModel } from './user-info.model';

export interface Browser {
    organizationId: string;
    projectId: string;
    browserId: string;
    name: string;
    value: string;
    createdBy: UserInfoModel;
    createdDate: Date;
    updatedBy: UserInfoModel;
    updatedDate: Date;
}