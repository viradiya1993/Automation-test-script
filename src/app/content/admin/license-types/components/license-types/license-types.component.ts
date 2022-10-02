import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LicenseTypeService, NotificationService } from '@app/core/services';
import { LicenseType } from '@app/shared/models';

declare const $: any;

@Component({
    selector: 'app-license-types',
    templateUrl: './license-types.component.html',
    styleUrls: ['./license-types.component.scss']
})
export class LicenseTypesComponent implements OnInit {
    licenseTypeForm: FormGroup;
    licenseType: LicenseType;
    removedLicense: LicenseType;
    integerValid = /^[0-9]+$/;
    // decimalValid = /^[-+]?[0-9]+\.[0-9]+$/
    decimalValid = /^[0-9]*\.?[0-9]*$/

    constructor(
        private fb: FormBuilder,
        private notificationService: NotificationService,
        private paymentService: LicenseTypeService
    ) {
    }

    // get License form controls
    get f() {
        return this.licenseTypeForm.controls;
    }

    // get executorLicense controls
    get executorLicense() {
        const executorLicense = this.licenseTypeForm.get('executorLicense') as FormGroup;
        return executorLicense.controls;
    }

    // get License matrix controls
    get licenseMatrix() {
        const configurationFG = this.licenseTypeForm.get('executorLicense') as FormGroup;
        return configurationFG.controls['parallelLicenseMatrix'] as FormArray;
    }

    // get supportLicense controls
    get supportLicense() {
        const supportLicense = this.licenseTypeForm.get('supportLicense') as FormGroup;
        return supportLicense.controls
    }

    ngOnInit(): void {
        $("#removeLicenceConfirmation").on("hide.bs.modal", function () {
            this.removedLicense = undefined;
        });

        this.licenseTypeForm = this.fb.group({
            name: ["", Validators.compose([Validators.required])],
            executorLicense: this.fb.group({
                numberOfMinutes: ["", Validators.compose([Validators.required, Validators.pattern(this.integerValid)])],
                frequencyType: ["", Validators.compose([Validators.required])],
                basePrice: ["", Validators.compose([Validators.required, Validators.pattern(this.decimalValid)])],
                parallelLicenseMatrix: this.fb.array([this.setMatrixForm()]),
            }),
            supportLicense: this.fb.group({
                perHourCost: ["", Validators.compose([Validators.required, Validators.pattern(this.decimalValid)])],
                type: ["", Validators.compose([Validators.required])],
            }),
            informations: this.fb.array([this.setInfomationGroup()]),
        });

    }

    // License matrix from array
    getLicenseConfig() {
        const configurationFG = this.licenseTypeForm.get('executorLicense') as FormGroup;
        return configurationFG.controls['parallelLicenseMatrix'] as FormArray;
    }

    // set License matrix form group
    setMatrixForm(): FormGroup {
        return this.fb.group({
            from: ['', Validators.compose([Validators.required, Validators.pattern(this.integerValid)])],
            to: ['', Validators.compose([Validators.required, Validators.pattern(this.integerValid)])],
            price: ['', Validators.compose([Validators.required, Validators.pattern(this.decimalValid)])],
        })
    }

    // Add License matrix
    addLicense(): void {
        this.getLicenseConfig().push(this.setMatrixForm())
    }

    // Remove license from array
    removeLicense(index: number, item: FormControl) {
        this.getLicenseConfig().removeAt(index);
    }

    // Information from array
    getCommentInfo() {
        return this.licenseTypeForm.get("informations") as FormArray;
    }

    // set infromations form group
    setInfomationGroup(): FormGroup {
        return this.fb.group({
            information: ['', Validators.compose([Validators.required])],
        })
    }

    // Add infomations
    addInfomations(): void {
        this.getCommentInfo().push(this.setInfomationGroup());
    }

    // Remove informtation from array
    removeInformation(index: number, item: FormControl) {
        this.getCommentInfo().removeAt(index);
    }

    // Save
    onLicenseTypeSaveClick() {
        if (this.isValid()) {
            this.licenseType = { ...this.licenseType, ...this.licenseTypeForm.value };
            this.paymentService.createLincense(this.licenseType).subscribe((res: any) => {
                this.licenseTypeForm.reset();
                this.licenseTypeForm.setControl("parallelLicenseMatrix", this.fb.array([this.setMatrixForm()]));
                this.licenseTypeForm.setControl("informations", this.fb.array([this.setInfomationGroup()]));
                this.notificationService.showNotification(
                    "License created successfully",
                    "top"
                );
            });
        }

    }

    onLicenseTypeCancelClick() {
        this.licenseTypeForm.reset();
    }

    // check form valid or not
    isValid() {
        return this.licenseTypeForm.valid;
    }

    numberOnly(event: any): boolean {
        const charCode = event.which ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }

    removeLicenseList(license) {
    }

    openLicenceDialog(license) {
    }

    selectedLicense(license) {
    }

    deleteLicence(license) {
    }

    onLicenceTypeCancelClick() {
    }

    onLicenceTypeSaveClick() {
    }
}
