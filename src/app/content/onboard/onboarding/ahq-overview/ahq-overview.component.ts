import { Component, EventEmitter, Output } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
    selector: "app-ahq-overview",
    templateUrl: "./ahq-overview.component.html",
    styleUrls: ["./ahq-overview.component.scss"],
})
export class AHQOverviewComponent {
    @Output() back = new EventEmitter<null>();
    @Output() goToDashboard = new EventEmitter<null>();

    overviewLink: SafeResourceUrl;

    constructor(private sanitizer: DomSanitizer) {
        const link = 'https://www.youtube.com/embed/niSnI10duYc?muted=1&enablejsapi=1';
        this.overviewLink = this.sanitizer.bypassSecurityTrustResourceUrl(link);
    }

    goToAHQAgentInfo() {
        this.back.next();
    }
}
