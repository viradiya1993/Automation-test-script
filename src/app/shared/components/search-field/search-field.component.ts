import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
    selector: "app-search-field",
    templateUrl: "./search-field.component.html",
    styleUrls: ["./search-field.component.scss"],
})
export class SearchFieldComponent implements OnInit {

    @Input() searchValue = ''
    @Input() label = 'Search Text'
    @Input() type: 'text' | 'number' = 'text'

    @Output() searchEvent = new EventEmitter<string>();

    constructor() {
    }

    ngOnInit(): void {
    }

    search() {
        this.searchEvent.emit(this.searchValue);
    }

    resetFieldValue() {
        this.searchValue = ""
        this.searchEvent.emit(this.searchValue);
    }
}
