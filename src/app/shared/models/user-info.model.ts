import { PhoneModal } from "@shared/models/phone.model";
import { Project } from "./project.model";
import { Role } from "./role.model";

export class UserInfoModel {
    id: string;
    active: boolean;
    firstTimeLogin: boolean;
    invited: boolean;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    company: string;
    userName: string;
    organizationId: string;
    registrationUrl: string;
    selectedProject: string;
    termsAccepted: boolean;
    userId: string;
    confirmEmail = true;
    phone: PhoneModal = new PhoneModal();
    accessCode: string;
    project?: Project;
    role?: Role;
    createdBy: string;
    createdDate: string;
    lastActivityDate: string
    updatedBy: string;
    updatedDate: string;

    ssoClient: string;
    ssoEnabled: boolean;
}
