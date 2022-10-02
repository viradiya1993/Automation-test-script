export interface Log {
    testStepId: string;
    statusId: string;
    returnValue: string;
    screenshotLink: string;
    statusVerify: boolean;
    message: string;
    status: boolean;
    streamed: boolean;
    startTimeStamp: Date;
    endTimeStamp: Date;
}
