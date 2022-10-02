import { SchedulerResourceType } from '../enums';
import { Configuration } from './configuration.model';
import { UserInfoModel } from './user-info.model';

export interface Scheduler {
    organizationId: string;
    projectId: string;
    resourceId: string;
    resourceType: SchedulerResourceType
    schedulerId: string;
    name: string;
    recurringRule: string;
    emails: string[];
    active: boolean;
    executionConfiguration: Configuration;
    createdBy?: UserInfoModel;
    createdDate?: Date;
    updatedBy?: UserInfoModel;
    updatedDate?: Date;
}