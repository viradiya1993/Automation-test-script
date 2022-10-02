import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { MatTabChangeEvent } from "@angular/material/tabs";
import { TestBotFilterService } from "../../services/test-bot-filter.service";

@Component({
    selector: "app-test-bot",
    templateUrl: "./test-bot.component.html",
    styleUrls: ["./test-bot.component.scss"],
})
export class TestBotComponent implements OnInit {
    @ViewChild("tabHost", { read: TemplateRef }) container: TemplateRef<any>;

    constructor(
        public testBotFilterService: TestBotFilterService,
    ) {
    }

    ngOnInit(): void {
        this.setTab(0);
    }

    setTab(tab: number) {
        this.testBotFilterService.selectedTab = tab;
    }

    selectedTabChange(changeEvent: MatTabChangeEvent) {
        this.testBotFilterService.selectedTab = changeEvent.index;
        this.testBotFilterService.filter();
    }
}
