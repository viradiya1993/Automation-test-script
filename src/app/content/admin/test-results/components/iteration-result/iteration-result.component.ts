import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { Configuration, IterationResult, TestScriptResult, } from "@app/shared/models";
import * as Browser from "@shared/configs/browser";
import { CommonService, TestBotExecutorService } from "@core/services";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { USER_PLAN_TYPE } from "@app/shared/configs";
import { ScreenShotComponent } from '@shared/components/screen-shot/screen-shot.component';

@Component({
    selector: "app-iteration-result",
    templateUrl: "./iteration-result.component.html",
    styleUrls: ["./iteration-result.component.scss"],
})
export class IterationResultComponent implements OnInit {
    public iterationResult: IterationResult;
    public executionConfiguration: Configuration;
    public testScriptResult: TestScriptResult;
    public browsers: any = Browser;
    imagePath: String = null;
    imageTitle: String = null;
    gridStatus: string;
    gridMessage: string;
    urlSafe: SafeResourceUrl;
    userType: boolean = localStorage.getItem(USER_PLAN_TYPE) === "true";

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        private testBotExecutorService: TestBotExecutorService,
        public sanitizer: DomSanitizer,
        public readonly commonService: CommonService
    ) {
        if (data) {
            this.iterationResult = data.iterationResult;
            this.executionConfiguration = data.executionConfiguration;
            this.testScriptResult = data.testScriptResult;
            this.gridStatus = data.gridStatus;
        }
    }

    previewImage(testScript) {
        this.imagePath = testScript.status.screenshotLink;
        this.imageTitle = testScript.testStepName;
    }

    removeImage() {
        this.imagePath = null;
        this.imageTitle = null;
    }

    showScreenShot(index: number) {
        const dialogRef = this.dialog.open(ScreenShotComponent, {
            panelClass: "test-step-result-screen-shot-dialog",
            minHeight: "100vh",
            minWidth: "59vw",
            maxWidth: "59vw",
            data: {
                title: this.iterationResult.testStepResults[index].status.message,
                screenShotLink:
                this.iterationResult.testStepResults[index].status.screenshotLink,
                details: "",
            },
            position: { right: "1" },
        });

        dialogRef.afterClosed().subscribe(() => {
        });
    }

    ngOnInit() {
        this.getGridStatus();
    }

    getGridStatus() {
        this.testBotExecutorService.getGridStatus(this.testScriptResult.testExecutionId, this.iterationResult.sessionId)
            .subscribe(response => {
                this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(response.videoUrl);
                this.gridStatus = response.gridStatus;
                this.gridMessage = response.gridMessage;
            })
    }

    downloadConsolidatedReport() {
        const file = this.testScriptResult.consolidatedResult;
        if (file) {
            window.location.href = file;
        }
    }
}
