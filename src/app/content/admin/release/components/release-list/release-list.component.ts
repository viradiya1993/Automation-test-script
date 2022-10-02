import { Component, OnInit } from '@angular/core';
import { ReleaseService } from '@app/core/services';
import { Release } from '@app/shared/models';
import * as _ from "lodash";
import { ReleaseFilterService } from '../../services/release-filter.service';

declare const $: any;

@Component({
    selector: 'app-release-list',
    templateUrl: './release-list.component.html',
    styleUrls: ['./release-list.component.scss']
})
export class ReleaseListComponent implements OnInit {

    releases: Release[] = [];
    releaseToRemove: Release;

    constructor(private releaseService: ReleaseService, private releaseFilterService: ReleaseFilterService) {
        this.releaseService.getReleaseViews().subscribe((res) => {
            this.releases = res.data;
        });
    }

    ngOnInit() {
        $("#removeReleaseConfirmation").on("hide.bs.modal", function () {
            this.releaseToRemove = undefined;
        });
    }

    selectedRelease(release: Release) {
        this.releaseFilterService.appliedFilter.release = { releaseId: release.releaseId, name: release.name };
        this.releaseFilterService.filter();
    }

    showAllReleases() {
        this.releaseFilterService.appliedFilter.release = undefined;
        this.releaseFilterService.filter();
    }

    onReleaseSaveChange() {
        this.releaseService.getReleaseViews().subscribe((res) => {
            this.releases = res.data;
        });
    }

    setReleaseToRemove(release: Release) {
        this.releaseToRemove = release;
    }

    removeRelease(release: Release) {
        this.releaseService.removeReleaseById(release.releaseId).subscribe(() => {
            this.releases = _.reject(this.releases, ["releaseId", release.releaseId]);
            this.releaseFilterService.filter();
        });
    }

    onReleaseRunSaveChange() {
        this.releaseFilterService.filter();
    }

}
