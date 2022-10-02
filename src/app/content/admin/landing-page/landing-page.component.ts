import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { VideoDialogComponent } from "./video-dialog.component";
import { CommonService } from '@core/services';
import { ActionList } from '@shared/models/action-list';

@Component({
    selector: "app-landing-page",
    templateUrl: "./landing-page.component.html",
    styleUrls: ["./landing-page.component.scss"],
})
export class LandingPageComponent implements OnInit {
    layoutProject = true;
    shortcutFrame = true;
    downloadFrame = true;
    actionFrame = true;
    ahqKnowledgeFrame = true;
    ahqShareFrame = true;

    actionLists: Array<ActionList> = [];

    constructor(
        public dialog: MatDialog,
        public readonly commonService: CommonService,
    ) {
    }

    ngOnInit() {
        this.commonService.getShortcutMenus().subscribe(shortcutMenus => {
            this.actionLists = shortcutMenus;
        })
    }

    openVideoDialog(url: any) {
        this.dialog.open(VideoDialogComponent, {
            width: "90%",
            height: "90%",
            data: { link: url },
        });
    }
}
