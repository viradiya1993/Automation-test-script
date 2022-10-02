import { Component, OnInit, ViewChild } from "@angular/core";
import { ObjectRepositoryV2Service } from "../../services/object-repository-v2.service";
import { Website } from "@app/shared/models";
import { CommonService, GlobalService } from "@app/core/services";
import { MatDrawerContainer, MatSidenavContainer, } from "@angular/material/sidenav";

@Component({
    selector: "app-object-repository-v2",
    templateUrl: "./object-repository-v2.component.html",
    styleUrls: ["./object-repository-v2.component.scss"],
})
export class ObjectRepositoryV2Component implements OnInit {
    isUpdatePageView: boolean;
    isAddPageView: boolean;
    isAddWebsiteView: boolean;
    isUpdateWebsiteView: boolean;
    selectedWebsite: Website;
    selectedWebsiteId: string;
    selectedPageId: string;
    selectedProject = false;
    projectId = null;

    currentView: string;
    calcWidth = "100%";

    @ViewChild(MatSidenavContainer) sidenavContainer: MatSidenavContainer;
    @ViewChild(MatDrawerContainer) drawer: MatDrawerContainer;

    constructor(
        private objectRepositoryV2Service: ObjectRepositoryV2Service,
        private globalService: GlobalService,
        private readonly commonService: CommonService
    ) {
        this.globalService.changeGoal("Object Repository");

        if (
            this.projectId !== "null" &&
            this.projectId !== "all"
        ) {
            this.selectedProject = true;
        }

        this.objectRepositoryV2Service.websiteClosedEvent.subscribe(() => {
            this.isAddWebsiteView = false;
            this.isUpdateWebsiteView = false;
        });

        this.objectRepositoryV2Service.websiteCreatedEvent.subscribe((website) => {
            this.isAddWebsiteView = false;
        });

        this.objectRepositoryV2Service.websiteRemovedEvent.subscribe((website) => {
            if (website.websiteId === this.selectedWebsiteId) {
                this.isAddPageView = false;
                this.isUpdatePageView = false;
            }
        });

        this.objectRepositoryV2Service.addPageEvent.subscribe((websiteId) => {
            this.selectedWebsiteId = websiteId;
            this.isAddPageView = true;
            this.isAddWebsiteView = false;
            this.isUpdatePageView = false;
            this.isUpdateWebsiteView = false;
        });

        this.objectRepositoryV2Service.pageClosedEvent.subscribe(() => {
            this.isAddPageView = false;
            this.isUpdatePageView = false;
        });

        this.objectRepositoryV2Service.pageCreatedEvent.subscribe((page) => {
            this.isAddPageView = false;
            this.isUpdatePageView = false;
        });

        this.objectRepositoryV2Service.pageRemovedEvent.subscribe((page) => {
            if (page.pageId === this.selectedPageId) {
                this.isAddPageView = false;
                this.isUpdatePageView = false;
            }
        });

        this.objectRepositoryV2Service.pageSelectedEvent.subscribe((page) => {
            this.selectedWebsiteId = page.websiteId;
            this.selectedPageId = page.pageId;
            this.isUpdatePageView = true;
            this.isAddPageView = false;
            this.isUpdateWebsiteView = false;
            this.isAddWebsiteView = false;
        });

        this.objectRepositoryV2Service.websiteSelectedEvent.subscribe((website) => {
            if (website) {
                this.selectedWebsiteId = website.websiteId;
                this.selectedWebsite = website;
                this.isUpdateWebsiteView = true;
                this.isUpdatePageView = false;
                this.isAddPageView = false;
                this.isAddWebsiteView = false;
            } else {
                this.selectedWebsiteId = null;
                this.selectedWebsite = null;
                this.isUpdateWebsiteView = false;
                this.isUpdatePageView = false;
                this.isAddPageView = false;
                this.isAddWebsiteView = false;
            }
        });

        this.objectRepositoryV2Service.addWebsiteEvent.subscribe(() => {
            this.selectedWebsiteId = null;
            this.selectedWebsite = null;
            this.isUpdateWebsiteView = false;
            this.isUpdatePageView = false;
            this.isAddPageView = false;
            this.isAddWebsiteView = true;
        });

        this.objectRepositoryV2Service.websiteUpdatedEvent.subscribe((website) => {
            this.selectedWebsiteId = website.websiteId;
            this.selectedWebsite = website;
            this.isUpdateWebsiteView = true;
            this.isUpdatePageView = false;
            this.isAddPageView = false;
            this.isAddWebsiteView = false;
        });
    }

    ngOnInit() {
        this.projectId = this.commonService.getOrganizationAndProjectIds().projectId;
    }

    sidenavWidth() {
        if (this.isAddPageView) {
            return "80vw";
        } else if (this.isUpdatePageView) {
            return "80vw";
        } else {
            return "40vw";
        }
    }

    dispVal(sectionsVisible) {
        if (this.currentView === "") {
            this.calcWidth = "100%";
            return;
        }

        switch (sectionsVisible) {
            case 0: {
                this.calcWidth = "0";
                break;
            }
            case 1: {
                this.calcWidth = "50%";
                break;
            }
            case 2: {
                this.calcWidth = "100%";
                break;
            }
            default: {
                this.calcWidth = "100%";
                break;
            }
        }
    }
}
