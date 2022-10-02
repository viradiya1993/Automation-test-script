import { SchedulerResourceType } from "../enums";

export interface SchedulerFilter {
    resourceId: string;
    resourceType: SchedulerResourceType;
    orderBy: string;
    sortBy: string;
    offset: number;
    size: number;
}
