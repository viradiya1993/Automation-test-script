import { Component, EventEmitter, Input, OnChanges, OnInit, Optional, Output, } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ObjectRepositoryV2Service } from "../../services/object-repository-v2.service";
import { Website } from "@app/shared/models";
import { NotificationService, WebsiteService } from "@app/core/services";
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: "app-website-form",
    templateUrl: "./website-form.component.html",
    styleUrls: ["./website-form.component.scss"],
})
export class WebsiteFormComponent implements OnInit, OnChanges {
    @Input() website: Website = null;
    @Output() cancelForm = new EventEmitter();
    @Output() closeMenu = new EventEmitter();
    websiteFormGroup: FormGroup;
    websiteData: Website = null;

    constructor(
        private fb: FormBuilder,
        private websiteService: WebsiteService,
        private objectRepositoryV2Service: ObjectRepositoryV2Service,
        private notificationService: NotificationService,
        @Optional() private readonly dialogRef: MatDialogRef<WebsiteFormComponent>
    ) {
        this.objectRepositoryV2Service.websiteSelectedEvent.subscribe(
            (res: Website) => {
                this.websiteData = res;
            }
        );

        this.websiteFormGroup = this.fb.group({
            name: ["", Validators.required],
            websiteUrl: [""],
        });
    }

    ngOnInit() {
        if (this.websiteData) {
            this.websiteFormGroup.patchValue(this.websiteData);
        }

        if (this.website) {
            this.websiteFormGroup.patchValue(this.website);
        }
    }

    ngOnChanges(): void {
        if (this.websiteData) {
            this.websiteFormGroup.patchValue(this.websiteData);
        }

        if (this.website) {
            this.websiteFormGroup.patchValue(this.website);
        }
    }

    onWebsiteCancelClick() {
        this.dialogRef?.close();
        this.closeMenu?.emit();
        if (this.website) {
            this.websiteFormGroup.patchValue(this.website);
        }
        this.objectRepositoryV2Service.websiteClosedEvent.emit();
    }

    onWebsiteSaveClick() {
        this.website = { ...this.website, ...this.websiteFormGroup.value };
        if (this.website.websiteId) {
            this.websiteService.updateWebsite(this.website).subscribe(() => {
                this.websiteFormGroup.reset();
                this.notificationService.showNotification(
                    "Website updated successfully",
                    "top"
                );
                this.objectRepositoryV2Service.websiteUpdatedEvent.emit(this.website);
                this.website = null;
            });
        } else {
            this.websiteService.addWebsite(this.website).subscribe((result) => {
                this.website.websiteId = result["id"];
                this.website.numberOfPages = 0;
                this.websiteFormGroup.reset();
                this.notificationService.showNotification(
                    "Website created successfully",
                    "top"
                );
                this.objectRepositoryV2Service.websiteCreatedEvent.emit(this.website);
                this.website = null;
            });
        }
        this.onWebsiteCancelClick();
    }
}
