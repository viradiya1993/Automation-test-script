import { Epic } from "./epic.model";
import { TestScriptFilterView } from "./test-script-filter-view.model";

export interface StoryFilterView {
    organizationId: string;
    projectId: string;
    epic: Epic;
    storyId: string;
    name: string;
    summary: string;
    numberOfTestScripts: number;
    testScripts: TestScriptFilterView[];
}
