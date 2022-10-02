import { Component, Input } from "@angular/core";

@Component({
    selector: "app-status-bar",
    templateUrl: "./status-bar.component.html",
    styleUrls: ["./status-bar.component.scss"],
})
export class StatusBarComponent {
    @Input() items: StatusBar[] = [];
}

interface StatusBar {
    width: string;
    color: string;
    text?: string;
}
