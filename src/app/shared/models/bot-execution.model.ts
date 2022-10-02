import { Configuration } from "./configuration.model";
import { Progress } from "./progress.model";

export interface BotExecution {
    id: string;
    name: string;
    executionNumber: string;
    organizationId: string;
    projectId: string;
    testBotId: string;
    executionConfiguration: Configuration;
    startTime: Date;
    endTime: Date;
    progress: Progress;
    backgroundJobId: string;
}