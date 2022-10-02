import { CommonService, TestScriptExecutorService } from "@core/services";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { TestScriptService, WebsiteService } from "@app/core/services";
import { TestScript, Website } from "@app/shared/models";
import { Subscription } from "rxjs";
import { environment } from "../../../../../../environments/environment";
import { DialogService } from '@content/admin/test-script/services/dialog.service';
import { FilterService } from '@content/admin/test-script/services/filter.service';
import { TestScriptHandlerService } from '@content/admin/test-script/services/test-script-handler.service';
import {
    AhqAgentDownloadDialogComponent
} from '@content/admin/test-script/components/ahq-agent-download-dialog/ahq-agent-download-dialog.component';

@Component({
    templateUrl: "./test-script.component.html",
    styleUrls: ["./test-script.component.scss"],
})
export class TestScriptComponent implements OnInit, OnDestroy {
    groupBy: string;
    sortBy: string;
    showList = "stories";
    websites: Website[] = [];
    selectedProject: string = null;

    agents = environment.agents;

    noEpicsAvailable = false;
    noStoriesAvailable = false;

    private subs = new Subscription();

    constructor(
        router: Router,
        private websiteService: WebsiteService,
        private dialogService: DialogService,
        private dialog: MatDialog,
        private testScriptService: TestScriptService,
        private testScriptExecutorService: TestScriptExecutorService,
        public filterService: FilterService,
        private testScriptHandler: TestScriptHandlerService,
        private readonly commonService: CommonService
    ) {
        this.init(router);
    }

    ngOnInit() {
        this.selectedProject = this.commonService.getOrganizationAndProjectIds().projectId || null;
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

    modelChangeShowList(e) {
        this.filterService.appliedFilter.showList = e;
    }

    openTestScriptDialog() {
        this.dialogService.openTestScriptDialog("add");
    }

    public openTestScriptDialogById(testScriptId: string) {
        this.testScriptService
            .getTestScriptById(testScriptId)
            .subscribe((res: TestScript) => {
                this.dialogService.openTestScriptDialog(
                    "edit",
                    res.storyId,
                    testScriptId
                );
            });
    }

    public openTestScriptExecutionDialogById(testScriptId) {
        this.testScriptExecutorService.stage(testScriptId).subscribe(() => {
            this.testScriptService
                .getTestScriptById(testScriptId)
                .subscribe((testScript) => {
                    this.dialogService.openTestScriptExecutionDialog(testScript);
                });
        }, () => {
            const dialogRef = this.dialog.open(AhqAgentDownloadDialogComponent);
            dialogRef.afterClosed().subscribe(() => {
            });
        });
    }

    public closeAll() {
        this.dialog.closeAll();
    }

    private init(router) {
        const websiteSub = this.websiteService
            .getWebsites(0)
            .subscribe((websites) => {
                this.websites = websites;
            });
        this.subs.add(websiteSub);

        const openTestScriptEditSub =
            this.testScriptHandler.openTestScriptEditObs.subscribe(
                ({ testscriptId, closeAll }) => {
                    this.openTestScriptDialogById(testscriptId);
                    if (closeAll) {
                        this.closeAll();
                    }
                }
            );
        this.subs.add(openTestScriptEditSub);

        const openTestScriptExecutionSub =
            this.testScriptHandler.openTestScriptExecutionObs.subscribe(
                ({ testscriptId, closeAll }) => {
                    this.openTestScriptExecutionDialogById(testscriptId);
                    if (closeAll) {
                        this.closeAll();
                    }
                }
            );
        this.subs.add(openTestScriptExecutionSub);

        const extras = router.getCurrentNavigation()?.extras;
        if (extras?.state?.openTestScriptId) {
            this.testScriptHandler.openTestScriptEdit(extras.state.openTestScriptId);
            this.showList = "testScripts";
        }
        this.filterService.appliedFilter.showList = this.showList;
    }
}
