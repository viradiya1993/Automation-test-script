import { UserInfoModel } from './user-info.model';

export interface Environment {
    organizationId: string;
    projectId: string;
    environmentId: string;
    name: string;
    value: string;
    createdBy: UserInfoModel;
    createdDate: Date;
    updatedBy: UserInfoModel;
    updatedDate: Date;
}