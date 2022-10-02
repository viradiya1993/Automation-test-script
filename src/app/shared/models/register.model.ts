import { UserInfoModel } from "./user-info.model";

export class RegisterModel {
    organizationName: string;
    user: UserInfoModel = new UserInfoModel();
}
