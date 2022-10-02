import { Component, OnInit } from '@angular/core';
import { ReleaseFilterService } from '../../services/release-filter.service';

@Component({
    selector: 'app-release',
    templateUrl: './release.component.html',
    styleUrls: ['./release.component.scss']
})
export class ReleaseComponent implements OnInit {

    constructor(public releaseFilterService: ReleaseFilterService) {
    }

    ngOnInit(): void {
    }

}
