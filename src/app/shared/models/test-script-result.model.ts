import { IterationResult } from './iteration-result.model';
import { Progress } from './progress.model';

export interface TestScriptResult {
    testScriptResultId: string;
    testScriptId: string;
    testScriptName: string;
    progress: Progress;
    iterationResults: IterationResult[];
    testExecutionId: string;
    consolidatedResult?: string;
}
