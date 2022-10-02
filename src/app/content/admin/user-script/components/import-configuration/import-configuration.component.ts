import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-import-configuration',
    templateUrl: './import-configuration.component.html',
    styleUrls: ['./import-configuration.component.scss']
})
export class ImportConfigurationComponent implements OnInit {
    constructor(
        public dialogRef: MatDialogRef<ImportConfigurationComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { websiteId: string; },
        public dialog: MatDialog
    ) {
    }

    ngOnInit(): void {
    }
}
