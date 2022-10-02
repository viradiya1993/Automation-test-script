import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-multi-value-chip',
    templateUrl: './multi-value-chip.component.html',
    styleUrls: ['./multi-value-chip.component.scss']
})
export class MultiValueChipComponent implements OnInit {

    @Input() values: any[] = [];
    minDisplayValues = 1;
    toolTipValues: string;

    constructor() {
    }

    ngOnInit() {
        this.toolTipValues = this.values.slice(1).join("\r\n");
    }

}
