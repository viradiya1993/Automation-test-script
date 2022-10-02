import { UserInfoModel } from "@shared/models/user-info.model";
import { TestStep } from "./test-step.model";

export interface UserScript {
    commonObjectId?: string;
    name: string;
    fields: Field[];
    createdBy?: UserInfoModel;
    createdDate?: Date;
    updatedBy?: UserInfoModel;
    updatedDate?: Date;
    websiteId?: string;
}

export interface Field {
    name: string;
    type: string;
    value: string;
    array?: boolean;
}

/* user script */
export interface CommonObjects {
    commonFunctionId: string;
    description: string;
    name: string;
    organizationId: string;
    status: string;
    parameters: Parameters[];
    returnType: ReturnType[];
    testSteps: TestStep[];
    createdBy?: UserInfoModel;
    createdDate?: Date;
    updatedBy?: UserInfoModel;
    updatedDate?: Date;
}

export interface Parameters {
    name: string;
    type: string;
    value: ParameterValue;
    array?: boolean;
}

export interface ParameterValue {
    type: ValueType;
    value: string;
}

export enum ValueType {
    Undefined = -1,
    Data = 0,
    Column = 1,
    Configuration = 2,
    Params = 3,
}

export interface ReturnType {
    name: string;
    type: string;
}
