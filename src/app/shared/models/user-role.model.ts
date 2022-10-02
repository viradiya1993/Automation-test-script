import { UserInfoModel } from "./user-info.model";
import { Role } from "./role.model";

export class UserRoleModal {
    id?: string;
    organizationId?: string;
    roleId: string;
    userId: string;
    projectId?: string;
}

export interface UserRole {
    user: UserInfoModel;
    role: Role;
}
