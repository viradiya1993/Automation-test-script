import { HttpClient } from "@angular/common/http";
import { Component, Inject, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ObjectRepositoryV2Service } from "@app/content/admin/object-repository-v2/services/object-repository-v2.service";
import { NotificationService, PageService } from "@app/core/services";
import { Locator, Page, Website } from "@app/shared/models";

@Component({
    selector: "app-add-locator",
    templateUrl: "./add-locator.component.html",
    styleUrls: ["./add-locator.component.scss"],
})
export class AddLocatorComponent implements OnInit {
    locatorFormGroup: FormGroup;

    websiteId: string;
    website: Website;
    pageId: string;
    page: Page;
    locatorService = false;
    websiteUrl: string = null;
    Locator: Locator;
    @Input() locatorInput: Locator = null;

    constructor(
        public dialogRef: MatDialogRef<AddLocatorComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: { websiteId: string; pageId: string; locator: Locator },
        private fb: FormBuilder,
        private objectRepositoryV2Service: ObjectRepositoryV2Service,
        private notificationService: NotificationService,
        private pageService: PageService,
        private http: HttpClient
    ) {
        this.locatorFormGroup = this.fb.group({
            locatorId: [""],
            locatorName: ["", Validators.required],
            locateBy: [""],
            locatorType: [""],
            locatorValue: [""],
            sequenceId: [""],
        });
    }

    get f() {
        return this.locatorFormGroup.controls;
    }

    ngOnInit(): void {
        this.locatorFormGroup.patchValue({
            ...this.data.locator,
        });
    }

    onSaveLocator() {
        const formData: any = {};
        formData["locatorId"] = this.locatorFormGroup.controls.locatorId.value
            ? this.locatorFormGroup.controls.locatorId.value
            : null;
        formData["locatorName"] = this.locatorFormGroup.controls.locatorName.value;
        formData["locateBy"] = this.locatorFormGroup.controls.locateBy.value;
        formData["locatorType"] = this.locatorFormGroup.controls.locatorType.value;
        formData["sequenceId"] = 0;
        formData["locatorValue"] =
            this.locatorFormGroup.controls.locatorValue.value;
        if (this.locatorFormGroup.invalid) {
            return;
        }

        if (this.data.locator) {
            this.pageService
                .updateLocator(formData, this.data.websiteId, this.data.pageId)
                .subscribe(
                    (res: any) => {
                        if (res) {
                            this.notificationService.showNotification(
                                "Locator Updated successfully",
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
        } else {
            this.pageService
                .addLocatore(formData, this.data.websiteId, this.data.pageId)
                .subscribe(
                    (res: any) => {
                        if (res) {
                            this.notificationService.showNotification(
                                "Locator Added successfully",
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
    }

    onCancelClick() {
        this.dialogRef.close();
    }
}
