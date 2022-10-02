import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-screen-shot',
    templateUrl: './screen-shot.component.html',
    styleUrls: ['./screen-shot.component.scss']
})
export class ScreenShotComponent implements OnInit {

    title: string;
    screenShotLink: string;
    details: string;

    constructor(@Inject(MAT_DIALOG_DATA) public data) {
        if (this.data) {
            this.title = this.data.title;
            this.screenShotLink = this.data.screenShotLink;
            this.details = this.data.details;
        }
    }

    ngOnInit(): void {
    }

}
