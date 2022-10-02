import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { StoryService } from '@app/core/services';
import { StoryFilterView } from '@app/shared/models';
import * as _ from "lodash";
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { DialogService } from '@content/admin/test-script/services/dialog.service';
import { FilterService } from '@content/admin/test-script/services/filter.service';

declare const $: any;

@Component({
    selector: 'app-story-list',
    templateUrl: './story-list.component.html',
    styleUrls: ['./story-list.component.scss']
})
export class StoryListComponent implements OnInit {
    @Input() noEpicsAvailable = false;
    @Output() noStoriesAvailable = new EventEmitter<boolean>(false);

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatAccordion) accordion: MatAccordion;
    expanded = false;
    stories: StoryFilterView[] = [];
    storyFilterViewToRemove: StoryFilterView;
    totalElements: number;

    constructor(
        public filterService: FilterService,
        private dialogService: DialogService,
        private storyService: StoryService
    ) {

        this.filterService.storyFilterUpdated$.subscribe(res => {
            if (this.paginator) {
                this.paginator.pageIndex = this.filterService.appliedFilter.offset;
            }
            this.stories = res.data;
            this.totalElements = res.totalCount;
            this.noStoriesAvailable.emit(this.stories.length === 0);
        });

        this.filterService.appliedFilter.size = 10;
        this.filterService.appliedFilter.offset = 0;
        this.filterService.filterStories();

    }

    pageChange(pageEvent: PageEvent) {
        this.filterService.appliedFilter.size = pageEvent.pageSize;
        this.filterService.appliedFilter.offset = pageEvent.pageIndex;
        this.filterService.storyExpands = [];
        this.filterService.filterStories();
    }

    ngOnInit() {
        $("#removeStoryConfirmation").on("hide.bs.modal", function () {
            this.storyFilterViewToRemove = undefined;
        });
    }

    toggle() {
        if (this.expanded) {
            this.accordion.closeAll();
            this.expanded = false;
        } else {
            this.accordion.openAll();
            this.expanded = true;
        }
    }

    openStoryDialog() {
        this.dialogService.openStoryDialog();
    }

    setStoryToRemove(storyFilterView: StoryFilterView) {
        this.storyFilterViewToRemove = storyFilterView;
    }

    removeStory(storyFilterView: StoryFilterView) {
        this.storyService.removeStoryById(storyFilterView.epic.epicId, storyFilterView.storyId)
            .subscribe(() => {
                this.stories = _.reject(this.stories, ["storyId", storyFilterView.storyId]);
                // this.filterService.filter();
                this.noStoriesAvailable.emit(this.stories.length === 0);
            });
    }

}
