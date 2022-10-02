import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { Component, Inject, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, } from "@angular/material/dialog";
import { ObjectRepositoryV2Service } from "@app/content/admin/object-repository-v2/services/object-repository-v2.service";
import { NotificationService, PageService } from "@app/core/services";
import { Locator, Page, Website } from "@app/shared/models";
import { LocatorTestScripts } from "@app/shared/models/locator.model";
import {
    DeleteLocatorDialogComponent
} from '@content/admin/object-repository-v2/components/page-form/delete-locator-dialog/delete-locator-dialog.component';

@Component({
    selector: "app-add-pages",
    templateUrl: "./add-pages.component.html",
    styleUrls: ["./add-pages.component.scss"],
})
export class AddPagesComponent implements OnInit {
    pageForm: FormGroup;
    websiteId: string;
    website: Website;
    pageId: string;
    page: Page;
    locatorService = false;
    websiteUrl: string = null;

    constructor(
        public dialogRef: MatDialogRef<AddPagesComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { websiteId: string; pageId: string },
        private fb: FormBuilder,
        public dialog: MatDialog,
        private pageService: PageService,
        private objectRepositoryV2Service: ObjectRepositoryV2Service,
        private notificationService: NotificationService
    ) {
        this.pageForm = this.fb.group({
            pageName: [""],
            description: [""],
            locatorName: ["", Validators.required],
            locateBy: [""],
            locatorType: [""],
            locatorValue: [""],
        });
        this.pageForm = this.fb.group({
            pageName: ["", Validators.required],
            description: ["", Validators.required],
            locators: this.fb.array([]),
            websiteUrl: [""],
        });
    }

    get f() {
        return this.pageForm.controls;
    }

    ngOnInit(): void {
    }

    getLocatorFormArray() {
        return this.pageForm.get("locators") as FormArray;
    }

    addLocatorFG(locator: Locator) {
        let currentIndex: number = this.getLocatorFormArray().controls.length;
        this.getLocatorFormArray().push(
            this.fb.group({
                locatorId: [locator ? locator.locatorId : null],
                locatorName: [locator ? locator.locatorName : ""],
                locateBy: [locator ? locator.locateBy : ""],
                locatorType: [locator ? locator.locatorType : ""],
                locatorValue: [locator ? locator.locatorValue : ""],
                sequenceId: [locator ? locator.sequenceId : currentIndex++],
            })
        );
    }

    public async removeLocatorFG(index: number, item: FormControl) {
        const testscripts: LocatorTestScripts = await this.getTestScriptsForLocator(
            item
        );
        if (testscripts.numberOfTestScripts > 0) {
            this.confirmDeleteLocation(index, testscripts);
        } else {
            this.removeLocator(index);
        }
    }

    public getTestScriptsForLocator(
        item: FormControl
    ): Promise<LocatorTestScripts> {
        return this.pageService
            .getTestScriptsForLocator(
                this.websiteId,
                this.pageId,
                item.get("locatorId").value
            )
            .toPromise();
    }

    confirmDeleteLocation(index: number, testscripts: LocatorTestScripts) {
        const dialogRef = this.dialog.open(DeleteLocatorDialogComponent, {
            panelClass: "delete-location-dialog-panel",
            data: { testscripts, locator: this.page.locators[index] },
        });
        dialogRef.afterClosed().subscribe((res) => {
            if (res) {
                this.removeLocator(index);
            }
        });
    }

    drop(event: CdkDragDrop<FormArray[]>) {
        moveItemInArray(
            this.getLocatorFormArray().controls,
            event.previousIndex,
            event.currentIndex
        );
    }

    onPageSaveClick() {
        this.pageService
            .addPages(this.pageForm.value, this.data.websiteId)
            .subscribe(
                (res: any) => {
                    if (res) {
                        this.pageForm.reset();
                        this.pageForm.setControl("locators", this.fb.array([]));
                        this.notificationService.showNotification(
                            "Page created successfully",
                            "top"
                        );
                        this.dialogRef.close({
                            result: res,
                        });
                    }
                },
                (err) => {
                }
            );
    }

    onCancelClick() {
        this.dialogRef.close();
    }

    private removeLocator(index: number) {
        this.getLocatorFormArray().removeAt(index);
    }
}
