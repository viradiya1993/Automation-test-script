export class OrganizationModal {
    id: string;
    orgName: string;
    subDomain?: string;
}

export interface OrgAdminUser {
    adminUser: AdminUser[];
    organization: OrganizationModal[];
}

export class AdminUser {
    email: string;
    phone: string;
    userId: string;
    userName: string;
}

export interface Sort {
    sorted: boolean;
    unsorted: boolean;
}
