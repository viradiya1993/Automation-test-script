import { Component, OnInit } from '@angular/core';
import { ReleaseFilterService } from '../../services/release-filter.service';

@Component({
    selector: 'app-release-applied-filters',
    templateUrl: './release-applied-filters.component.html',
    styleUrls: ['./release-applied-filters.component.scss']
})
export class ReleaseAppliedFiltersComponent implements OnInit {

    isFilterApplied = false;
    appliedFilter: any = { ...this.releaseFilterService.appliedFilter };

    constructor(public releaseFilterService: ReleaseFilterService) {
        this.filterApplied();
        this.releaseFilterService.filterUpdated$.subscribe(() => {
            this.appliedFilter = { ...this.releaseFilterService.appliedFilter };
            this.filterApplied();
        });
    }

    ngOnInit() {
    }

    removeFilter(type: string): void {
        if (type === 'release' || type === 'clearAll') {
            this.releaseFilterService.appliedFilter.release = undefined;
            this.appliedFilter.release = undefined;
        }
        if (type === 'hasFailedTests' || type === 'clearAll') {
            this.releaseFilterService.appliedFilter.hasFailedTests = false;
            this.appliedFilter.status = '';
        }
        if (type === 'noPassedTests' || type === 'clearAll') {
            this.releaseFilterService.appliedFilter.noPassedTests = false;
            this.appliedFilter.status = '';
        }
        if (type === 'hasSkippedTests' || type === 'clearAll') {
            this.releaseFilterService.appliedFilter.hasSkippedTests = false;
            this.appliedFilter.status = '';
        }

        if (type === 'clearAll') {
            this.isFilterApplied = false;
        }

        this.releaseFilterService.filter();
    }

    filterApplied() {
        if (this.releaseFilterService.appliedFilter.release ||
            this.releaseFilterService.appliedFilter.hasFailedTests ||
            this.releaseFilterService.appliedFilter.noPassedTests ||
            this.releaseFilterService.appliedFilter.hasSkippedTests) {
            this.isFilterApplied = true;
        } else {
            this.isFilterApplied = false;
        }
    }

}
