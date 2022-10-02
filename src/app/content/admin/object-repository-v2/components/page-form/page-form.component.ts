import { Component, Inject, OnChanges, OnInit, Optional, SimpleChanges, } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, } from "@angular/material/dialog";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { NotificationService, PageService, TestScriptService, } from "@app/core/services";
import { Locator, Page, Website } from "@app/shared/models";
import { ObjectRepositoryV2Service } from "../../services/object-repository-v2.service";
import { LocatorTestScripts } from "@shared/models/locator.model";
import {
    DeleteLocatorDialogComponent
} from '@content/admin/object-repository-v2/components/page-form/delete-locator-dialog/delete-locator-dialog.component';

@Component({
    selector: "app-page-form",
    templateUrl: "./page-form.component.html",
    styleUrls: ["./page-form.component.scss"],
})
export class PageFormComponent implements OnInit, OnChanges {
    // @Input() websiteId: string;
    // @Input() pageId: string;

    websiteId: string;
    website: Website;
    pageId: string;
    page: Page;
    pageForm: FormGroup;
    locatorService = false;
    websiteUrl: string = null;
    locatorTypes: {
        icon: string,
        value: string,
        name: string
    }[] = [
        { icon: "account_circle", value: "TEXTBOX", name: "Textbox" },
        { icon: "build", value: "BUTTON", name: "Button" },
        { icon: "delete", value: "HYPERLINK", name: "Hyperlink" },
        { icon: "done", value: "STATIC_TEXT", name: "Static Text" },
        { icon: "explore", value: "TABLE", name: "Table" },
        { icon: "favorite", value: "DROP_DOWN", name: "Dropdown" },
        { icon: "fingerprint", value: "RADIO_BUTTON", name: "Radio Button" },
        { icon: "home", value: "CHECK_BOX", name: "Checkbox" },
        { icon: "home", value: "OTHER", name: "Other" },
    ]

    constructor(
        private fb: FormBuilder,
        public dialog: MatDialog,
        private pageService: PageService,
        private testScriptService: TestScriptService,
        private objectRepositoryV2Service: ObjectRepositoryV2Service,
        private notificationService: NotificationService,
        @Optional() public dialogRef: MatDialogRef<PageFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { websiteId: string; pageId: string }
    ) {
        this.pageForm = this.fb.group({
            pageName: ["", Validators.required],
            pageUrl: [""],
            description: [""],
            locators: this.fb.array([]),
            websiteUrl: [""],
        });
    }

    ngOnInit() {
        if (this.data) {
            // if (this.websiteId && this.pageId) {
            this.websiteId = this.data.websiteId;
            this.website = this.website;
            if (this.data.pageId) {
                this.pageId = this.data.pageId;
                this.pageService
                    .getPageByWebsiteIdAndPageId(this.websiteId, this.pageId)
                    .subscribe((page) => {
                        this.page = page;
                        this.pageForm.patchValue(this.page);
                        this.pageForm.setControl("locators", this.fb.array([]));
                        this.page.locators.forEach((locator) => {
                            this.addLocatorFG(locator);
                        });
                    });
            }
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.websiteId && this.pageId) {
            this.pageService
                .getPageByWebsiteIdAndPageId(this.websiteId, this.pageId)
                .subscribe((page) => {
                    this.page = page;
                    this.pageForm.patchValue(this.page);
                    this.pageForm.setControl("locators", this.fb.array([]));
                    this.page.locators.forEach((locator) => {
                        this.addLocatorFG(locator);
                    });
                });
        }
    }

    drop(event: CdkDragDrop<FormArray[]>) {
        moveItemInArray(
            this.getLocatorFormArray().controls,
            event.previousIndex,
            event.currentIndex
        );
    }

    getLocatorFormArray() {
        return this.pageForm.get("locators") as FormArray;
    }

    addLocatorFG(locator: Locator) {
        let currentIndex: number = this.getLocatorFormArray().controls.length;
        this.getLocatorFormArray().push(
            this.fb.group({
                locatorId: [locator ? locator.locatorId : null],
                locatorName: [locator ? locator.locatorName : "", Validators.required],
                locateBy: [locator ? locator.locateBy : "", Validators.required],
                locatorType: [locator ? locator.locatorType : "", Validators.required],
                locatorValue: [
                    locator ? locator.locatorValue : "",
                    Validators.required,
                ],
                sequenceId: [locator ? locator.sequenceId : currentIndex++],
            })
        );
    }

    public getLocatorTypeString(type: string) {
        const locatorTypeName = this.locatorTypes.find((res: any) => res.value === type);
        return `<mat-icon>${locatorTypeName.icon}</mat-icon> ${locatorTypeName.name}`;
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

    onPageCancelClick() {
        this.pageForm.reset();
        this.pageForm.setControl("locators", this.fb.array([]));
        this.objectRepositoryV2Service.pageClosedEvent.emit();
    }

    startLocator() {
        this.locatorService = true;
        this.testScriptService
            .locatorSpyStart({
                websiteId: this.websiteId,
                pageName: this.page.pageName,
                url: this.websiteUrl,
            })
            .subscribe((data) => {

            });
    }

    stopLocator() {
        this.locatorService = false;
        this.testScriptService.locatorSpyStop().subscribe((data) => {

        });
    }

    onPageSaveClick() {
        this.page = { ...this.page, ...this.pageForm.value };
        this.page.websiteId = this.websiteId;

        if (this.page.pageId) {
            this.pageService.updatePageById(this.page).subscribe(() => {
                this.notificationService.showNotification(
                    "Page updated successfully",
                    "top"
                );
                this.objectRepositoryV2Service.pageUpdatedEvent.emit(this.page);
            });
        } else {
            this.pageService.addPage(this.page).subscribe(() => {
                this.pageForm.reset();
                this.pageForm.setControl("locators", this.fb.array([]));
                this.notificationService.showNotification(
                    "Page created successfully",
                    "top"
                );
                this.objectRepositoryV2Service.pageCreatedEvent.emit(this.page);
            });
        }
        this.objectRepositoryV2Service.pageClosedEvent.emit();
        this.dialogRef.close();
    }

    private removeLocator(index: number) {
        this.getLocatorFormArray().removeAt(index);
    }
}
