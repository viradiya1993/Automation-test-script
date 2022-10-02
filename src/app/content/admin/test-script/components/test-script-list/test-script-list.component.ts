import { Component, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { StoryFilterView, TestScriptFilterView } from "@app/shared/models";
import { Subscription } from "rxjs";
import { FilterService } from '@content/admin/test-script/services/filter.service';
import { DialogService } from '@content/admin/test-script/services/dialog.service';
import { TestScriptHandlerService } from '@content/admin/test-script/services/test-script-handler.service';

@Component({
    selector: "app-test-script-list",
    templateUrl: "./test-script-list.component.html",
    styleUrls: ["./test-script-list.component.scss"]
})
export class TestScriptListComponent implements OnInit, OnDestroy {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @Input() testScripts: TestScriptFilterView[] = [];
    @Input() storyId = undefined;
    @Input() story: StoryFilterView = undefined;
    totalElements: number;

    private subs = new Subscription();

    constructor(
        public filterService: FilterService,
        public dialogService: DialogService,
        private testScriptHandler: TestScriptHandlerService
    ) {
        const updateSub = this.filterService.testScriptFilterUpdated$.subscribe(
            res => {
                if (this.paginator) {
                    this.paginator.pageIndex = this.filterService.appliedFilter.offset;
                }
                this.testScripts = res.data;
                this.totalElements = res.totalCount;
            }
        );
        this.subs.add(updateSub);
    }

    ngOnInit() {
        if (this.filterService.appliedFilter.showList === "testScripts") {
            this.filterService.appliedFilter.size = 10;
            this.filterService.appliedFilter.offset = 0;
            this.filterService.filterTestScripts();
        }
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

    pageChange(pageEvent: PageEvent) {
        this.filterService.appliedFilter.size = pageEvent.pageSize;
        this.filterService.appliedFilter.offset = pageEvent.pageIndex;
        this.filterService.filterTestScripts();
    }

    public openTestScriptDialog(testScriptFilterView: TestScriptFilterView) {
        this.dialogService.openTestScriptDialog(
            "edit",
            this.storyId,
            testScriptFilterView.testScriptId
        );
    }

    public openTestScriptCopyDialog(testScriptFilterView: TestScriptFilterView) {
        this.dialogService.openTestScriptDialog(
            "copy",
            this.storyId,
            testScriptFilterView.testScriptId
        );
    }

    public setTestScriptToExecute(testScriptFilterView: TestScriptFilterView) {
        this.testScriptHandler.openTestScriptExecution(
            testScriptFilterView.testScriptId
        );
    }

    public getStatusClass(status: string) {
        if (status === "In Progress") {
            return "badge badge-warning";
        } else if (status === "Ready") {
            return "badge badge-success";
        } else if (status === "To Be Repaired") {
            return "badge badge-danger";
        } else if (status === "To Be Repaired (AHQ Rec)") {
            return "badge badge-danger";
        } else if (status === "Valid") {
            return "badge badge-info";
        } else {
            return "badge badge-default";
        }
    }
}
