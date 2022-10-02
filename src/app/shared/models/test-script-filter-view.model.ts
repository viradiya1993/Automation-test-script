import { Story } from './story.model';
import { Epic } from './epic.model';
import { Website } from './website.model';

export interface TestScriptFilterView {
    testScriptId: string;
    numberOfSteps: number;
    status: string;
    name: string;
    tags: string[];
    story: Story;
    epic: Epic;
    website: Website;
}
