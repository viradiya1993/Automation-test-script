import { Component } from "@angular/core";
import { SITE_ADMIN_EMAIL, SITE_ADMIN_NAME } from '@shared/configs';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: "app-unauthorized-modal",
    templateUrl: "./unauthorized-modal.component.html",
    styleUrls: ["./unauthorized-modal.component.scss"],
})
export class UnauthorizedModalComponent {
    toggleFrame3 = true;

    siteAdmin = {
        name: sessionStorage.getItem(SITE_ADMIN_NAME),
        email: sessionStorage.getItem(SITE_ADMIN_EMAIL),
    }

    constructor(
        public dialogRef: MatDialogRef<UnauthorizedModalComponent>) {
    }
}
