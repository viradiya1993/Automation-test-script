import { TestStepResult } from "./test-step-result.model";

export interface IterationResult {
    dataInfo: string;
    iterationNumber: number;
    skipped: boolean;
    status: boolean;
    startTimeStamp: Date;
    endTimeStamp: Date;
    testStepResults: TestStepResult[];
    videoUrl: string;
    gridMessage: string;
    gridStatus: string;
    sessionId: string;
}
