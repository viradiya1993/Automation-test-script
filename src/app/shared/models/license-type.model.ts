import { UserInfoModel } from "@shared/models/user-info.model";

export interface LicenseType {
    name: string;
    executorLicense: ExecutorLicense;
    supportLicense: SupportLicense;
    informations: Information[];
    createdBy?: UserInfoModel;
    createdDate?: Date;
    updatedBy?: UserInfoModel;
    updatedDate?: Date;
}

export interface ExecutorLicense {
    numberOfMinutes: number;
    frequencyType: string;
    basePrice: number;
    parallelLicenseMatrix: PrallelLicense[];
}

export interface PrallelLicense {
    from: number;
    to: number;
    price: number;
}

export interface SupportLicense {
    perHourCost: number;
    type: string;
}

export interface Information {
    information: string;
}
