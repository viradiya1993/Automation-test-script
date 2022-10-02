import { Injectable } from "@angular/core";
import { TestScriptService } from "@app/core/services";
import { Filter } from "@app/shared/models";
import { Subject } from "rxjs";

@Injectable()
export class FilterService {

    readonly defaultFilter: Filter = {
        applicationId: "",
        epicId: "",
        name: "",
        offset: -1,
        size: -1,
        tags: [],
        status: ""
    };
    appliedFilter: any = {
        offset: -1,
        size: -1,
        showList: '',
        website: undefined,
        epic: undefined,
        name: "",
        tags: [],
        status: ""
    }
    storyExpands: boolean[] = [];
    private storyFilterSource = new Subject<any>();
    storyFilterUpdated$ = this.storyFilterSource.asObservable();
    private testScriptFilterSource = new Subject<any>();
    testScriptFilterUpdated$ = this.testScriptFilterSource.asObservable();
    private filterSource = new Subject();
    filterUpdated$ = this.filterSource.asObservable();

    constructor(private testScriptService: TestScriptService) {
    }

    filter() {
        if (this.appliedFilter.showList === 'stories') {
            this.filterStories();
        } else if (this.appliedFilter.showList === 'testScripts') {
            this.filterTestScripts();
        }
    }

    filterStories() {
        return this.testScriptService.getStoriesByFilter(this.getFilterObj()).subscribe(res => {
            this.filterSource.next();
            this.storyFilterSource.next(res);
        });
    }

    filterTestScripts() {
        return this.testScriptService.getTestScriptsByFilter(this.getFilterObj()).subscribe(res => {
            this.filterSource.next();
            this.testScriptFilterSource.next(res);
        });
    }

    getFilterObj() {
        const filter = this.defaultFilter;
        if (this.appliedFilter.website) {
            filter.applicationId = this.appliedFilter.website.websiteId;
        } else {
            filter.applicationId = "";
        }
        if (this.appliedFilter.epic) {
            filter.epicId = this.appliedFilter.epic.epicId;
        } else {
            filter.epicId = "";
        }
        filter.name = this.appliedFilter.name;
        filter.tags = this.appliedFilter.tags;
        filter.status = this.appliedFilter.status;
        filter.offset = this.appliedFilter.offset;
        filter.size = this.appliedFilter.size;
        return filter;
    }
}
