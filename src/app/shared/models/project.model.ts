import { UserInfoModel } from ".";
import { Page } from "./page.model";
import { RoleUser } from "./role.model";

export interface Project {
    id: string;
    description: string;
    isEnabled: boolean;
    orgId: string;
    projectName: string;
    numberOfUsers?: number;
    userIds?: any[];
    name?: string;
    pages?: Page[];
    roles?: RoleUser[];
    createdBy?: UserInfoModel;
    createdDate?: Date;
    updatedBy?: UserInfoModel;
    updatedDate?: Date;
}

export interface Sort {
    unsorted: boolean;
    sorted: boolean;
    empty: boolean;
}

export interface Pageable {
    sort: Sort;
    pageSize: number;
    pageNumber: number;
    offset: number;
    paged: boolean;
    unpaged: boolean;
}

export interface ProjectResponse {
    content: Project[];
    pageable: Pageable;
    totalPages: number;
    totalElements: number;
    last: boolean;
    first: boolean;
    sort: Sort;
    number: number;
    numberOfElements: number;
    size: number;
    empty: boolean;
}
