import { Story } from './story.model';
import { Epic } from './epic.model';
import { Website } from './website.model';

export interface TestScriptView {
    testScriptId: string;
    name: string;
    status: string;
    tags: string[];
    story: Story;
    epic: Epic;
    website: Website;
}
