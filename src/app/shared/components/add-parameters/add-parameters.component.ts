import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-add-parameters',
    templateUrl: './add-parameters.component.html',
    styleUrls: ['./add-parameters.component.scss']
})
export class AddParametersComponent implements OnInit {
    parameterForm: FormGroup;

    constructor(
        public dialogRef: MatDialogRef<AddParametersComponent>,
        private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: { parameters: string; commonListId: string }
    ) {
        this.parameterForm = this.fb.group({
            paramsName: ["", Validators.required],
            // description: ["", Validators.required],
            // locators: this.fb.array([]),
        });
    }

    ngOnInit(): void {
        console.log(this.data.parameters, 'data');
        console.log(this.data.commonListId, 'c id');
    }

    onParameterSave() {
    }

    onCancelClick() {
        this.dialogRef.close();
    }
}
