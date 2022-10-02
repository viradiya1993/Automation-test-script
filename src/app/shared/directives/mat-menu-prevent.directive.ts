import { Directive, HostListener } from "@angular/core";

@Directive({ selector: "[mat-menu-prevent]" })
export class MatMenuPreventDirective {
    @HostListener("keydown", ["$event"])
    onClick(e: KeyboardEvent) {
        if (e.code === "Escape" || e.code === "Tab") {
            e.stopPropagation();
            e.preventDefault();
            return false;
        }
    }
}
