import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { EpicService } from "@app/core/services";
import { Epic } from "@app/shared/models";
import * as _ from "lodash";
import { DialogService } from '@content/admin/test-script/services/dialog.service';
import { FilterService } from '@content/admin/test-script/services/filter.service';

declare const $: any;

@Component({
    selector: "app-epic-list",
    templateUrl: "./epic-list.component.html",
    styleUrls: ["./epic-list.component.scss"],
})
export class EpicListComponent implements OnInit {
    @Output() noEpics = new EventEmitter<boolean>();

    epics: Epic[] = [];
    epicToRemove: Epic;
    panelOpenState = false;

    constructor(
        private epicService: EpicService,
        private dialogService: DialogService,
        private filterService: FilterService
    ) {
        this.getEpicList();
    }

    ngOnInit() {
        $("#removeEpicConfirmation").on("hide.bs.modal", function () {
            this.epicToRemove = undefined;
        });
    }

    getEpicList() {
        this.epicService.getEpics().subscribe((res) => {
            this.epics = res.data;
            this.showAllEpics();
            this.noEpics.emit(this.epics.length === 0);
        });
    }

    searchInEpicList(text: string) {
        if (text) {
            this.epicService.searchEpics(text).subscribe((res) => {
                this.epics = res.data;
                this.showAllEpics();
            });
        } else {
            this.getEpicList();
        }
    }

    selectedEpic(epic: Epic) {
        this.filterService.appliedFilter.epic = {
            epicId: epic.epicId,
            name: epic.name,
        };
        this.filterService.appliedFilter.size = 10;
        this.filterService.appliedFilter.offset = 0;
        this.filterService.filter();
    }

    showAllEpics() {
        this.filterService.appliedFilter.epic = undefined;
        this.filterService.appliedFilter.size = 10;
        this.filterService.appliedFilter.offset = 0;
        this.filterService.filter();
    }

    openEpicDialog() {
        this.dialogService.openEpicDialog();
    }

    onEpicSaveChange() {
        this.epicService.getEpics().subscribe((res) => {
            this.epics = res.data;
            this.noEpics.emit(this.epics.length === 0);
        });
    }

    setEpicToRemove(epic: Epic) {
        this.epicToRemove = epic;
    }

    removeEpic(epic: Epic) {
        this.epicService.removeEpicById(epic.epicId).subscribe(() => {
            this.epics = _.reject(this.epics, ["epicId", epic.epicId]);
            if (
                this.filterService.appliedFilter.epic &&
                this.filterService.appliedFilter.epic.epicId === epic.epicId
            ) {
                this.filterService.appliedFilter.epic = undefined;
            }
            this.filterService.appliedFilter.size = 10;
            this.filterService.appliedFilter.offset = 0;
            this.filterService.filter();
            this.noEpics.emit(this.epics.length === 0);
        });
    }
}
