import { Component, OnInit } from "@angular/core";
import { TestBotService } from "@app/core/services";
import { TestBot } from "@app/shared/models";
import * as _ from "lodash";
import { TestBotFilterService } from "../../services/test-bot-filter.service";
import { MatDialog } from "@angular/material/dialog";
import { TestBotExecutionComponent } from "../test-bot-execution/test-bot-execution.component";

declare const $: any;

@Component({
    selector: "app-test-bot-list",
    templateUrl: "./test-bot-list.component.html",
    styleUrls: ["./test-bot-list.component.scss"],
})
export class TestBotListComponent implements OnInit {
    testBots: TestBot[] = [];
    testBotToRemove: TestBot;
    selectedTestBotData: TestBot = null;

    constructor(
        private testBotService: TestBotService,
        private testBotFilterService: TestBotFilterService,
        public dialog: MatDialog
    ) {
        this.getTestBots();
    }

    ngOnInit() {
        $("#removeTestBotConfirmation").on("hide.bs.modal", function () {
            this.testBotToRemove = undefined;
        });
        this.testBotFilterService.appliedFilter = {
            testBot: undefined,
        };
    }

    getTestBots() {
        this.testBotService.getTestBots().subscribe((res) => {
            this.testBots = res.data;
        });
    }

    searchInBotList(text: string) {
        if (text) {
            this.testBotService.searchTestBots(text).subscribe((res) => {
                this.testBots = res.data;
            });
        } else {
            this.getTestBots();
        }
    }

    selectedTestBot(testBot: TestBot) {
        this.testBotFilterService.appliedFilter.testBot = {
            testBotId: testBot.testBotId,
            name: testBot.name,
        };
        this.testBotFilterService.filter();
        this.selectedTestBotData = this.testBotFilterService.appliedFilter.testBot;
    }

    onTestBotSaveChange() {
        this.testBotService.getTestBots().subscribe((res) => {
            this.testBots = res.data;
        });
    }

    setTestBotToRemove(testBot: TestBot) {
        this.testBotToRemove = testBot;
    }

    openExecuteTestBotDialog(testBot: TestBot) {
        this.selectedTestBot(testBot);
        const dialogRef = this.dialog.open(TestBotExecutionComponent, {
            data: { testBot: testBot },
            panelClass: 'test-result-dialog',
            minHeight: "100vh",
            minWidth: "55vw",
            maxWidth: '60vw',
            position: { right: "1" },
        });

        dialogRef.afterClosed().subscribe((result) => {
            this.selectedTestBot(testBot);
        });
    }

    removeTestBot(testBot: TestBot) {
        this.testBotService.removeTestBot(testBot.testBotId).subscribe(() => {
            this.testBots = _.reject(this.testBots, ["testBotId", testBot.testBotId]);
            window.location.reload();
        });
    }
}
