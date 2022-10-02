import { filter } from "rxjs/operators";
import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { NavigationEnd, NavigationStart, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { Location, PopStateEvent } from "@angular/common";
import PerfectScrollbar from "perfect-scrollbar";
import { CommonService } from '@core/services';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';

@Component({
    selector: "app-layout",
    templateUrl: "./admin-layout.component.html",
    styleUrls: ["./admin-layout.component.scss"]
})
export class AdminLayoutComponent implements OnInit, AfterViewInit {
    url: string;
    location: Location;
    videoLink: SafeResourceUrl = '';
    @ViewChild("sidebar") sidebar: any;
    @ViewChild(NavbarComponent) navbar: NavbarComponent;
    private _router: Subscription;
    private lastPoppedUrl: string;
    private yScrollStack: number[] = [];

    constructor(
        public router: Router,
        location: Location,
        public readonly commonService: CommonService,
        public readonly sanitizer: DomSanitizer
    ) {
        this.location = location;
        this.videoLink = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/niSnI10duYc?muted=1&enablejsapi=1')
    }

    ngOnInit() {
        const elemMainPanel = <HTMLElement>document.querySelector(".main-panel");
        const elemSidebar = <HTMLElement>(
            document.querySelector(".sidebar .sidebar-wrapper")
        );
        this.location.subscribe((ev: PopStateEvent) => {
            this.lastPoppedUrl = ev.url;
        });
        this.router.events.subscribe((event: any) => {
            if (event instanceof NavigationStart) {
                // tslint:disable-next-line:triple-equals
                if (event.url != this.lastPoppedUrl) {
                    this.yScrollStack.push(window.scrollY);
                }
            } else if (event instanceof NavigationEnd) {
                // tslint:disable-next-line:triple-equals
                if (event.url == this.lastPoppedUrl) {
                    this.lastPoppedUrl = undefined;
                    window.scrollTo(0, this.yScrollStack.pop());
                } else {
                    window.scrollTo(0, 0);
                }
            }
        });
        this._router = this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe(() => {
                elemMainPanel.scrollTop = 0;
                if (elemSidebar) {
                    elemSidebar.scrollTop = 0;
                }
            });
        const html = document.getElementsByTagName("html")[0];
        if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
            let ps = new PerfectScrollbar(elemMainPanel);
            if (elemSidebar) {
                ps = new PerfectScrollbar(elemSidebar);
            }
            html.classList.add("perfect-scrollbar-on");
        } else {
            html.classList.add("perfect-scrollbar-off");
        }
        this._router = this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe(() => {
                this.navbar.sidebarClose();
            });
    }

    ngAfterViewInit() {
        this.runOnRouteChange();
    }

    public isMap() {
        return this.location.prepareExternalUrl(this.location.path()) === "/maps/fullscreen";
    }

    runOnRouteChange(): void {
        if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
            const elemSidebar = <HTMLElement>(
                document.querySelector(".sidebar .sidebar-wrapper")
            );
            const elemMainPanel = <HTMLElement>document.querySelector(".main-panel");
            let ps = new PerfectScrollbar(elemMainPanel);
            if (elemSidebar) {
                ps = new PerfectScrollbar(elemSidebar);
            }
            ps.update();
        }
    }

    isMac(): boolean {
        let bool = false;
        if (
            navigator.platform.toUpperCase().indexOf("MAC") >= 0 ||
            navigator.platform.toUpperCase().indexOf("IPAD") >= 0
        ) {
            bool = true;
        }
        return bool;
    }
}
