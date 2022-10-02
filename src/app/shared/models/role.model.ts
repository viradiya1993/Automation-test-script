import { Pageable, Sort } from "./project.model";
import { UserInfoModel } from "./user-info.model";

export interface Role {
    id?: string;
    roleId?: string;
    description?: string;
    roleName: string;
    assignableToProject: boolean;
}

export interface RoleUser {
    id?: string;
    roleId?: string;
    roleName: string;
    assignableToProject: boolean;
    users?: UserInfoModel[];
}

export interface RoleResponse {
    content: Role[];
    empty: boolean;
    first: boolean;
    last: boolean;
    number: number;
    numberOfElements: number;
    pageable: Pageable;
    size: number;
    sort: Sort;
    totalElements: number;
    totalPages: number;
}
