import { TestScriptFilterView } from "./test-script-filter-view.model";

export interface Locator {
    locatorId: string;
    locatorName: string;
    pageId?: string;
    locateBy: string;
    locatorType: string;
    locatorValue: string;
    deleted?: boolean;
    sequenceId?: number;
}

export interface LocatorTestScripts {
    message: string;
    numberOfTestScripts: number;
    testScripts: TestScriptFilterView[];
}
