import { Params } from './params.model';
import { Status } from '../enums';

export interface TestStep {
    testStepId: string;
    params: Params;
    templateId: string;
    testStepTitle?: string;
    templateTitle: string;
    breakpoint: boolean;
    sequence: number;
    status: Status;
    logs?: any;
}
