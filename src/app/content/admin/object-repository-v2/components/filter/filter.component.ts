import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { Website } from "@app/shared/models";
import { ObjectRepositoryV2Service } from "../../services/object-repository-v2.service";

@Component({
    selector: "app-filter",
    templateUrl: "./filter.component.html",
})
export class FilterComponent implements OnInit, OnChanges {
    selectWebsite: Website;
    isFilterApplied = false;
    @Input() filter: any;
    @Output() valueChange = new EventEmitter();

    constructor(private objectRepositoryV2Service: ObjectRepositoryV2Service) {
        this.objectRepositoryV2Service.websiteSelectedEvent.subscribe((website) => {
            this.selectWebsite = website;
            this.isFilterApplied = true;
        });
    }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.filter = changes.filter.currentValue;
    }

    removeFilter() {
        this.selectWebsite = null;
        this.isFilterApplied = false;
        this.objectRepositoryV2Service.websiteSelectedEvent.emit(null);
    }
}
