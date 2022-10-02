import { TestScriptFilterView } from '@app/shared/models';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Locator, LocatorTestScripts } from './../../../../../../shared/models/locator.model';

@Component({
    templateUrl: "./delete-locator-dialog.component.html",
})

export class DeleteLocatorDialogComponent implements OnInit {

    public locatorTestScripts: LocatorTestScripts;
    public visibleTestScripts: TestScriptFilterView[] = [];
    public locator: Locator;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    }

    ngOnInit() {
        this.locatorTestScripts = this.data.testscripts;
        this.visibleTestScripts = this.locatorTestScripts.testScripts.slice(0, 5);
        this.locator = this.data.locator;
    }

    public showLoadMore() {
        this.visibleTestScripts = this.locatorTestScripts.testScripts;
    }
}
