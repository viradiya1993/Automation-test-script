import { Component, OnInit } from '@angular/core';
import { GlobalService, OrganizationService } from '@core/services';

declare interface DataTable {
    headerRow: string[];
    dataRows: string[][];
}

@Component({
    selector: 'app-system-info',
    templateUrl: './system-information.component.html'
})

export class SystemInformationComponent implements OnInit {
    public dataTable: DataTable;
    clientSummary = [];
    linear: true

    constructor(
        private organizationService: OrganizationService,
        private globalService: GlobalService,
    ) {
    }

    ngOnInit() {
        this.globalService.changeGoal('Client Detail');
        this.dataTable = {
            headerRow: ['System Name', 'System ID', 'Users'],

            dataRows: [
                ['ABC', 'e123dg', 'xyz'],
            ]
        };
    }

    getClientSummary() {
        this.organizationService.getClientSummary().subscribe(result => {
            if (result) {
                this.clientSummary = result;
            }
        })
    }
}
