import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NotificationService, UserScriptService } from '@app/core/services';
import { CommonObjects, UserScript } from '@app/shared/models/user-script.model';
import { CustomValidator } from '@shared/validators/custom.validator';

@Component({
    selector: 'app-custom-parmas',
    templateUrl: './custom-parmas.component.html',
    styleUrls: ['./custom-parmas.component.scss']
})
export class CustomParmasComponent implements OnInit {
    customParameterForm: FormGroup;
    customParameterObject: UserScript;
    commonObjects = [];

    constructor(
        private fb: FormBuilder,
        private userScript: UserScriptService,
        private notificationService: NotificationService,
        public matDialogRef: MatDialogRef<CustomParmasComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { commonFunctionType: Array<any>, websiteId: string, commonObject: UserScript },
        public dialog: MatDialog
    ) {
        this.customParameterObject = data.commonObject;
    }

    ngOnInit(): void {
        this.customParameterForm = this.fb.group({
            name: ['', [Validators.required, CustomValidator.cannotContainSpace]],
            fields: this.fb.array([this.setInfomationGroup()]),
        });
        if (this.data.commonObject) {
            this.customParameterForm.patchValue({
                name: this.data.commonObject.name,
            });
            this.data.commonObject.fields.forEach((element, index) => {
                this.getCustomeInfo().insert(index, this.fb.group({
                    name: [element.name, [Validators.required, CustomValidator.cannotContainSpace]],
                    type: [element.type, Validators.required],
                    array: [element.array],
                }));
                this.getCustomeInfo().removeAt(index + 1);
            });
        }
        this.getCommonOject();
    }

    getCommonOject() {
        this.userScript.getCommonObject(this.data.websiteId).subscribe((res: any) => {
            this.commonObjects = res.content.map((i) => {
                i.id = i.commonObjectId + '+' + '1';
                return i
            });
            if (this.data.commonObject) {
                this.commonObjects.forEach((element, index) => {
                    if (element.commonObjectId === this.data.commonObject.commonObjectId) {
                        this.commonObjects.splice(index, 1);
                    }
                });
            }
        });
    }

    getParameterType(type: string) {
        const findFromCommonFunctionType = this.data.commonFunctionType.find(x => x.value === type);
        if (findFromCommonFunctionType) {
            return findFromCommonFunctionType.type;
        }
        const findFromCommonObject = this.commonObjects.find(x => x.id === type);
        if (findFromCommonObject) {
            return findFromCommonObject.name;
        }
    }

    onSaveParams() {
        if (this.customParameterForm.valid) {
            this.customParameterObject = {
                ...this.customParameterObject,
                ...this.customParameterForm.value,
                websiteId: this.data.websiteId
            };
            if (this.data.commonObject) {
                this.userScript.updateCommonObject(this.customParameterObject).subscribe((res: any) => {
                    this.onCancelClick(true);
                    this.notificationService.showNotification(
                        res.details,
                        "top"
                    );
                    this.customParameterForm.reset();
                });
            } else {
                this.userScript.createCommonObject(this.customParameterObject).subscribe((res: any) => {
                    this.customParameterForm.reset();
                    this.notificationService.showNotification(
                        res.details,
                        "top"
                    );
                    this.onCancelClick(true);
                });
            }
        }
    }

    addCustomParams() {
        const dialogRef = this.dialog.open(CustomParmasComponent, {
            width: '1000px',
            disableClose: true,
            data: {
                commonObject: null,
                websiteId: this.data.websiteId,
                commonFunctionType: this.data.commonFunctionType,
            }
        });

        dialogRef.afterClosed().subscribe((result) => {
            this.getCommonOject();
        });
    }

    onEditCustomParameter(commonObject: CommonObjects) {
        const dialogRef = this.dialog.open(CustomParmasComponent, {
            width: '1000px',
            disableClose: true,
            data: {
                commonObject: commonObject,
                commonFunctionType: this.data.commonFunctionType,
                websiteId: this.data.websiteId
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result === true) {
                this.getCommonOject();
            }
        });
    }

    // Information from array
    getCustomeInfo() {
        return this.customParameterForm.get("fields") as FormArray;
    }

    // set Parameters form group
    setInfomationGroup(): FormGroup {
        return this.fb.group({
            name: ['', [Validators.required, CustomValidator.cannotContainSpace]],
            type: ['', Validators.required],
            array: [],
        })
    }

    // Add Parameters
    addParameters(): void {
        this.getCustomeInfo().push(this.setInfomationGroup());
    }

    // Remove Parameter from array
    removeParameters(index: number, item: FormControl) {
        this.getCustomeInfo().removeAt(index);
    }

    onCancelClick(refetch = false) {
        this.matDialogRef.close(refetch);
    }
}
