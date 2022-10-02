import { Component, OnInit } from '@angular/core';
import { FilterService } from '../../services/filter.service';

@Component({
    selector: 'app-applied-filters',
    templateUrl: './applied-filters.component.html',
    styleUrls: ['./applied-filters.component.scss']
})
export class AppliedFiltersComponent implements OnInit {

    isFilterApplied = false;
    appliedFilter: any = { ...this.filterService.appliedFilter };

    constructor(public filterService: FilterService) {
        this.filterService.filterUpdated$.subscribe(() => {
            this.appliedFilter = { ...this.filterService.appliedFilter };
            this.filterApplied();
        });
    }

    ngOnInit() {
    }

    removeFilter(type: string): void {
        if (type === 'epic' || type === 'clearAll') {
            this.filterService.appliedFilter.epic = undefined;
            this.appliedFilter.epic = undefined;
        }
        if (type === 'website' || type === 'clearAll') {
            this.filterService.appliedFilter.website = undefined;
            this.appliedFilter.website = undefined;
        }
        if (type === 'name' || type === 'clearAll') {
            this.filterService.appliedFilter.name = '';
            this.appliedFilter.name = '';
        }
        if (type === 'tags' || type === 'clearAll') {
            this.filterService.appliedFilter.tags = [];
            this.appliedFilter.tags = [];
        }
        if (type === 'status' || type === 'clearAll') {
            this.filterService.appliedFilter.status = '';
            this.appliedFilter.status = '';
        }
        if (type === 'clearAll') {
            this.isFilterApplied = false;
        }

        this.filterService.storyExpands = [];

        this.filterService.appliedFilter.size = 10;
        this.filterService.appliedFilter.offset = 0;
        this.filterService.filter();
    }

    filterApplied() {
        if (this.filterService.appliedFilter.epic ||
            this.filterService.appliedFilter.website ||
            this.filterService.appliedFilter.name ||
            this.filterService.appliedFilter.tags.length > 0 ||
            this.filterService.appliedFilter.status
        ) {
            this.isFilterApplied = true;
        } else {
            this.isFilterApplied = false;
        }
    }

}
