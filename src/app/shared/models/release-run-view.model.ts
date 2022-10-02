import { Progress } from "./progress.model";
import { ReleaseView } from "./release-view.model";
import { TestBotExecution } from "./test-bot-execution.model";
import { UserInfoModel } from "./user-info.model";

export interface ReleaseRunView {
    name: string;
    releaseView: ReleaseView;
    progress: Progress;
    testBotExecutions: TestBotExecution[];
    createdBy: UserInfoModel;
}
