import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { ReleaseFilterService } from '../../services/release-filter.service';

@Component({
    selector: 'app-release-run-filter-form',
    templateUrl: './release-run-filter-form.component.html',
    styleUrls: ['./release-run-filter-form.component.scss']
})
export class ReleaseRunFilterFormComponent implements OnInit {

    @ViewChild('releaseRunFilterFormMatTrigger') releaseRunFilterFormMatTrigger: MatMenuTrigger;

    appliedFilter: any;

    constructor(private releaseFilterService: ReleaseFilterService) {
        this.appliedFilter = this.releaseFilterService.appliedFilter;
    }

    ngOnInit() {
    }

    applyFilter() {
        this.releaseFilterService.filter();
        this.releaseRunFilterFormMatTrigger.closeMenu();
    }

    onFilterCancelClick() {
        this.releaseRunFilterFormMatTrigger.closeMenu();
    }

}
