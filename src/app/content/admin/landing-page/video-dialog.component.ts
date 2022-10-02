import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: "app-video-dialog",
    templateUrl: "video-dialog.html",
    styleUrls: ["./landing-page.component.scss"],
})
export class VideoDialogComponent {
    videoLink: any;

    constructor(
        private sanitizer: DomSanitizer,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.videoLink = this.sanitizer.bypassSecurityTrustResourceUrl(data.link);
    }
}
