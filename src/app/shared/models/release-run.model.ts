import { UserInfoModel } from "./user-info.model";

export interface ReleaseRun {
    releaseId: string;
    releaseRunId: string;
    name: string;
    createdBy: UserInfoModel;
}


