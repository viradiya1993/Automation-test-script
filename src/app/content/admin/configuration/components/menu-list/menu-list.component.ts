import { Component, EventEmitter, Output } from "@angular/core";
import { CommonService } from '@core/services';

@Component({
    selector: "app-settings-menu",
    templateUrl: "./menu-list.component.html",
})
export class MenuListComponent {
    currentMenu = "globalParameters";

    @Output() menuSelect = new EventEmitter();

    constructor(
        public readonly commonService: CommonService
    ) {
    }

    onMenuSelect(menuName: string, event: any) {
        this.currentMenu = menuName;
        this.menuSelect.emit(menuName);
    }
}
