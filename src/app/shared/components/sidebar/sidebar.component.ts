import { SlugPipe } from '@shared/pipes/slug.pipe';
import { CommonService, LocalStorageService } from '@core/services';
import { Component, OnInit } from '@angular/core';
import PerfectScrollbar from 'perfect-scrollbar';
import { Router } from '@angular/router';
import { Menu } from '@shared/models';

declare const $: any;

@Component({
    selector: 'app-sidebar-cmp',
    templateUrl: 'sidebar.component.html',
    styleUrls: ['sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
    public menuItems: Menu[] = [];

    constructor(
        private router: Router,
        private commonService: CommonService,
        private localService: LocalStorageService,
        private slugPipe: SlugPipe
    ) {
    }

    isMobileMenu() {
        return $(window).width() <= 991;
    };

    ngOnInit() {
        this.commonService.getMenu().subscribe((res: any) => {
            this.menuItems = res;
        });

        $(".sidebar-wrapper").find('.collapse.show').parent().find('a').attr('aria-expanded', true);
    }

    menuSlug(input: string) {
        return this.slugPipe.transform(input);
    }

    updatePS(): void {
        if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
            const elemSidebar = <HTMLElement>document.querySelector('.sidebar .app-sidebar-cmp');
            if (elemSidebar) {
                new PerfectScrollbar(elemSidebar, { wheelSpeed: 2, suppressScrollX: true });
            }
        }
    }

    isMac(): boolean {
        let bool = false;
        if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
            bool = true;
        }
        return bool;
    }

    onSelectNavBard(route) {
        this.router.navigate(['.' + route.url])
    }

    logout() {
        this.localService.removeLogin();
        this.router.navigate(['auth/login']);
    }
}
