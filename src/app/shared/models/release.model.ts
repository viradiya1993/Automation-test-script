import { TestBot } from "./test-bot.model";

export interface Release {
    organizationId: string;
    projectId: string;
    releaseId: string;
    name: string;
    description: string;
    numberOfTestRuns: number;
    numberOfTestBots: number;
    testBots: TestBot[];
}