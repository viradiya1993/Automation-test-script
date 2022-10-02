import { UserInfoModel } from './user-info.model';

export interface Grid {
    organizationId: string;
    projectId: string;
    gridId: string;
    name: string;
    username: string;
    accessKey: string;
    url: string;
    createdBy: UserInfoModel;
    createdDate: Date;
    updatedBy: UserInfoModel;
    updatedDate: Date;
}