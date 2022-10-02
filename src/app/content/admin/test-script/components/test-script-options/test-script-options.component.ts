import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DialogService } from '@content/admin/test-script/services/dialog.service';

@Component({
    selector: 'app-test-script-options',
    templateUrl: './test-script-options.component.html',
    styleUrls: ['./test-script-options.component.scss']
})
export class TestScriptOptionsComponent implements OnInit {

    groupBy = "1";
    sortBy: string;

    @Output() onGroupByChanged = new EventEmitter<string>();
    @Output() onSortByChanged = new EventEmitter<string>();

    constructor(private dialogService: DialogService) {
    }

    ngOnInit() {
        this.onGroupByChange();
        this.onSortByChange();
    }

    openEpicDialog() {
        this.dialogService.openEpicDialog();
    }

    openStoryDialog() {
        this.dialogService.openStoryDialog();
    }

    openTestScriptDialog() {
        this.dialogService.openTestScriptDialog('add');
    }

    onGroupByChange() {
        this.onGroupByChanged.emit(this.groupBy);
    }

    onSortByChange() {
        this.onSortByChanged.emit(this.sortBy);
    }
}
