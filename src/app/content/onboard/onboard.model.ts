export interface IOnboardProjectInfo {
    name: string;
    description: string;
}

export class AssignableRole {
    id: string;
    roleName: string;
    emailAddresses: string[];
    emailInput: string;

    [k: string]: any
}
