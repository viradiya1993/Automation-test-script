import { Locator } from './locator.model';
import { Status } from './status.model';
import { TestStep } from './test-step.model';

export interface TestStepResult {
    data: string;
    locator: Locator;
    result: string;
    sequence: number;
    status: Status;
    templateId: string;
    testStep: TestStep;
    testStepId: string;
}
