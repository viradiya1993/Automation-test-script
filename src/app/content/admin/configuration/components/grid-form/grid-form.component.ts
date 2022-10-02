import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Grid } from '@app/shared/models';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GridService } from '@app/core/services';

@Component({
    selector: 'app-grid-form',
    templateUrl: './grid-form.component.html',
    styleUrls: ['./grid-form.component.scss']
})
export class GridFormComponent implements OnInit {

    grid: Grid;
    gridForm: FormGroup;

    constructor(private fb: FormBuilder, private gridService: GridService, @Inject(MAT_DIALOG_DATA) public data: any) {
        this.gridForm = this.fb.group({
            name: ['', Validators.required],
            username: [''],
            accessKey: [''],
            url: ['', Validators.required]
        });

        if (data) {
            this.grid = data.grid;
            if (this.grid) {
                this.gridForm.patchValue(this.grid);
            }
        }
    }

    ngOnInit() {
    }

    onGridSaveClick() {
        this.grid = { ...this.grid, ...this.gridForm.value };
        if (this.grid.gridId) {
            this.gridService.updateGrid(this.grid).subscribe();
        } else {
            this.gridService.addGrid(this.grid).subscribe();
        }
    }

    onGridCancelClick() {
        this.gridForm.reset();
    }

}
