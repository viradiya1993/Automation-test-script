import { Component, EventEmitter, OnInit, Output, ViewChild, } from "@angular/core";
import { PageService, TestScriptService, WebsiteService, } from "@app/core/services";
import { Page, Website } from "@app/shared/models";
import { ObjectRepositoryV2Service } from "../../services/object-repository-v2.service";
import * as _ from "lodash";
import { MatDrawer } from "@angular/material/sidenav";
import { MatMenuTrigger } from "@angular/material/menu";
import { MatDialog } from "@angular/material/dialog";
import { PageFormComponent } from "../page-form/page-form.component";

declare const $: any;

@Component({
    selector: "app-website-list",
    templateUrl: "./website-list.component.html",
    styleUrls: ["./website-list.component.scss"],
})
export class WebsiteListComponent implements OnInit {
    @Output() counter1 = new EventEmitter<number>();
    @ViewChild("filterFormMatTrigger") filterFormMatTrigger: MatMenuTrigger;
    @ViewChild(MatMenuTrigger) websiteFormMatTrigger: MatMenuTrigger;

    websites: Website[] = [];
    selectedWebsite: Website = null;
    websiteToRemove: Website = null;
    locatorService = false;
    websiteUrl: string = null;
    panelOpenState = false;

    pages: Page[] = [];
    selectedPage: Page;
    selectedWebsiteLactor: Website = null;
    pageToRemove: Page;

    hideSections = [false, false];
    countSections = 2;

    toggleAddApp = false;
    toggleAddPage = false;
    toggleUpdateApp = false;

    @ViewChild(MatDrawer) drawer: MatDrawer;

    showList = "page";
    filter = true;
    searchText = '';
    filterValue = '';

    constructor(
        private websiteService: WebsiteService,
        private testScriptService: TestScriptService,
        private pageService: PageService,
        private objectRepositoryV2Service: ObjectRepositoryV2Service,
        public dialog: MatDialog
    ) {
        this.getWebsites();

        this.objectRepositoryV2Service.pageCreatedEvent.subscribe((page) => {
            this.websiteService.getWebsites(0).subscribe((websites) => {
                this.websites = websites;
            });
            this.pageService
                .getPagesByWebsiteId(this.selectedWebsite.websiteId)
                .subscribe((pages) => {
                    this.pages = pages;
                });
        });

        this.objectRepositoryV2Service.pageUpdatedEvent.subscribe((page) => {
            this.pages = _.map(this.pages, (page_t) =>
                page_t.pageId === page.pageId ? page : page_t
            );
        });

        this.objectRepositoryV2Service.websiteCreatedEvent.subscribe((website) => {
            this.websites.push(website);
        });

        this.objectRepositoryV2Service.websiteUpdatedEvent.subscribe((website) => {
            this.websites = _.map(this.websites, (website_t) =>
                website_t.websiteId === website.websiteId ? website : website_t
            );
        });

        this.objectRepositoryV2Service.websiteSelectedEvent.subscribe((website) => {
            if (!website) {
                this.selectedWebsite = null;
                this.pages = [];
            }
        });
    }

    ngOnInit() {
        $("#removeWebsiteConfirmation").on("hide.bs.modal", function () {
            this.websiteToRemove = undefined;
        });

        $("#removePageConfirmation").on("hide.bs.modal", function () {
            this.pageToRemove = undefined;
        });
    }

    getWebsites() {
        this.websiteService.getWebsites(0).subscribe((websites) => {
            this.websites = websites;
        });
    }

    searchInWebList(text) {
        if (text) {
            this.websiteService.searchWebsites(text).subscribe((websites) => {
                this.websites = websites;
            });
        } else {
            this.getWebsites();
        }
    }

    addWebsite() {
        this.websiteFormMatTrigger.openMenu();
        // this.toggleAddApp = !this.toggleAddApp;
        // this.toggleUpdateApp = false;
        this.objectRepositoryV2Service.addWebsiteEvent.emit();
    }

    setWebsiteToRemove(website: Website) {
        this.websiteToRemove = website;
    }

    removeWebsite(website: Website) {
        this.websiteService.removeWebsiteById(website.websiteId).subscribe(() => {
            if (
                this.selectedWebsite &&
                this.selectedWebsite.websiteId === website.websiteId
            ) {
                this.selectedWebsite = undefined;
            }
            this.websites = _.reject(this.websites, ["websiteId", website.websiteId]);
            this.objectRepositoryV2Service.websiteRemovedEvent.emit(website);
        });
    }

    onWebsiteEdit(website: Website, thisEl) {
        this.objectRepositoryV2Service.websiteUpdatedEvent.emit(website);
        this.objectRepositoryV2Service.websiteSelectedEvent.emit(website);
        this.selectedWebsite = website;
        this.pageService
            .getPagesByWebsiteId(this.selectedWebsite.websiteId)
            .subscribe((pages) => {
                this.pages = pages;
            });
    }

    closeWebsiteForm() {
        this.objectRepositoryV2Service.websiteSelectedEvent.emit();
        this.selectedWebsite = null;
        // this.pages = null;
    }

    onWebsiteSelect(website: Website, thisEl) {
        const parentEl = thisEl.currentTarget.parentElement;
        const allItems = document.querySelectorAll(".item-1");
        this.highlightActiveElement(parentEl, allItems);

        this.selectedWebsite = website;
        this.objectRepositoryV2Service.websiteSelectedEvent.emit(website);
        this.pageService
            .getPagesByWebsiteId(this.selectedWebsite.websiteId)
            .subscribe((pages) => {
                this.pages = pages;
            });
        this.toggleAddApp = false;
        this.toggleUpdateApp = false;
    }

    addPage() {
        this.selectedPage = undefined;
        if (this.toggleAddApp) {
            this.toggleAddApp = false;
        }
        const dialogRef = this.dialog.open(PageFormComponent, {
            panelClass: "application-page-dialog",
            width: "80vw",
            height: "100vh",
            position: {
                top: "0px",
                right: "0px",
                bottom: "0px",
            },
            data: {
                website: this.selectedWebsite,
                websiteId: this.selectedWebsite.websiteId,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            // this.animal = result;
        });
        this.objectRepositoryV2Service.addPageEvent.emit(
            this.selectedWebsite.websiteId
        );
    }

    setPageToRemove(page: Page) {
        this.pageToRemove = page;
    }

    removePage(page: Page) {
        this.pageService
            .removePageById(page.websiteId, page.pageId)
            .subscribe(() => {
                if (this.selectedPage && this.selectedPage.pageId === page.pageId) {
                    this.selectedPage = undefined;
                }
                this.pages = _.reject(this.pages, ["pageId", page.pageId]);
                this.objectRepositoryV2Service.pageRemovedEvent.emit(page);
            });
    }

    onPageSelect(page: Page, thisEl) {
        const parentEl = thisEl.currentTarget.parentElement;
        const allItems = document.querySelectorAll(".item-2");
        this.highlightActiveElement(parentEl, allItems);

        this.selectedPage = page;

        const dialogRef = this.dialog.open(PageFormComponent, {
            panelClass: "application-page-dialog",
            width: "80vw",
            height: "100vh",
            position: {
                top: "0px",
                right: "0px",
                bottom: "0px",
            },
            data: {
                website: this.selectedWebsite,
                websiteId: this.selectedWebsite.websiteId,
                pageId: this.selectedPage.pageId,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            // this.animal = result;
        });
        this.objectRepositoryV2Service.pageSelectedEvent.emit({
            websiteId: this.selectedPage.websiteId,
            pageId: this.selectedPage.pageId,
        });
    }

    onWebsiteSelectLocator(website: Website) {
        this.selectedWebsiteLactor = website;
    }

    // New Layout
    toggleSection(sectionNumber) {
        const tabEpic = document.getElementById("tab-1");
        const tabStory = document.getElementById("tab-2");

        switch (sectionNumber) {
            case 0:
                this.updateTabFocus(tabEpic, sectionNumber);
                break;
            case 1:
                this.updateTabFocus(tabStory, sectionNumber);
                break;
            default:
                break;
        }
    }

    updateTabFocus(thisEl, sectionNumber) {
        thisEl.classList.toggle("focus-tab");

        if (thisEl.classList.contains("focus-tab")) {
            this.countSections--;
            this.hideSections[sectionNumber] = true;
        } else {
            this.countSections++;
            this.hideSections[sectionNumber] = false;
        }

        this.counter1.emit(this.countSections);
    }

    highlightActiveElement(parentEl, allItems) {
        for (let i = 0; i < allItems.length; i++) {
            allItems[i].classList.remove("active");
        }
        parentEl.classList.add("active");
    }

    startLocator() {
        this.locatorService = true;
        this.testScriptService
            .locatorSpyStart({
                websiteId: this.selectedWebsiteLactor.websiteId,
                url: this.websiteUrl,
            })
            .subscribe((data) => {

            });
    }

    stopLocator() {
        this.locatorService = false;
        this.testScriptService.locatorSpyStop().subscribe((data) => {
            this.selectedWebsiteLactor = null;
        });
    }

    applyFilter() {
        this.filterFormMatTrigger.closeMenu();
        this.filterValue = this.searchText;
        this.pageService.getPagesByWebsiteId(this.selectedWebsite.websiteId, this.searchText)
            .subscribe((pages) => {
                this.pages = pages;
            });
    }

    onFilterCancelClick() {
        this.filterFormMatTrigger.closeMenu();
    }

    modelChangeShowList(e) {
        this.filter = e === "page";
    }

    changeFilter() {
        this.filterValue = this.searchText = '';
        this.applyFilter();
    }
}
