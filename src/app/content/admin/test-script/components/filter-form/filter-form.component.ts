import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatMenuTrigger } from '@angular/material/menu';
import { Website } from '@app/shared/models';
import { FilterService } from '../../services/filter.service';

@Component({
    selector: 'app-filter-form',
    templateUrl: './filter-form.component.html',
    styleUrls: ['./filter-form.component.scss']
})
export class FilterFormComponent implements OnInit {

    @ViewChild('filterFormMatTrigger') filterFormMatTrigger: MatMenuTrigger;

    @Input() websites: Website[] = [];

    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    appliedFilter: any;

    constructor(private filterService: FilterService) {
        this.appliedFilter = this.filterService.appliedFilter;
    }

    ngOnInit() {
    }

    addTag(event: MatChipInputEvent) {
        const input = event.input;
        const value = event.value;
        if ((value.trim() !== '')) {
            this.appliedFilter.tags.push(value.trim());
            input.value = '';
        }
    }

    onRemoveTag(tag: string) {
        const index = this.appliedFilter.tags.indexOf(tag, 0);
        if (index > -1) {
            this.appliedFilter.tags.splice(index, 1);
        }
    }

    applyFilter() {
        this.filterService.storyExpands = [];
        this.filterService.appliedFilter.offset = 0;
        this.filterService.appliedFilter.size = 10;
        this.filterService.filter();
        this.filterFormMatTrigger.closeMenu();
    }

    onFilterCancelClick() {
        this.filterFormMatTrigger.closeMenu();
    }
}
