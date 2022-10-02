import { LocatorTestScripts } from "@shared/models/locator.model";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Locator, Page, Project } from "@shared/models";
import { map } from "rxjs/operators";
import { PAGE_API } from "@core/helpers";
import { Observable } from "rxjs";
import { CommonService } from '@core/services/common.service';

@Injectable({
    providedIn: "root",
})
export class PageService {
    project: Project;

    constructor(private http: HttpClient, private readonly commonService: CommonService) {
    }

    baseUrl() {
        const organizationAndProjectIds = this.commonService.getOrganizationAndProjectIds();
        return PAGE_API + "projects/" + organizationAndProjectIds?.projectId + "/pages/";
    }

    async getProject() {
        return this.http.get(this.baseUrl()).pipe(
            map((project) => {
                this.project = project as Project;
                return this.project;
            })
        );
    }

    async getPages() {
        return this.http.get(this.baseUrl() + "list").pipe(
            map((project) => {
                this.project = project as Project;

                this.project.pages.forEach((page) => {
                    page.locators.forEach((locator) => {
                        locator.pageId = page.pageId;
                    });
                });

                return this.project.pages;
            })
        );
    }

    async getPageById(pageId: string) {
        return this.http.get(this.baseUrl() + pageId).pipe(
            map((page) => {
                return page as Page;
            })
        );
    }

    async deletePageById(pageId: string) {
        return this.http.delete(this.baseUrl() + pageId).pipe();
    }

    async updatePage(page: Page) {
        return this.http.put(this.baseUrl() + page.pageId, page).pipe();
    }

    async getLocatorsByPageId(pageId: string) {
        return this.http.get(this.baseUrl() + pageId + "/locators?offset=0").pipe(
            map((res) => {
                return res["content"] as Locator[];
            })
        );
    }

    addPage(page: Page) {
        return this.http
            .post(PAGE_API + "websites/" + page.websiteId + "/pages", page)
            .pipe();
    }

    addPages(data: any, websiteId: string) {
        return this.http
            .post(PAGE_API + "websites/" + websiteId + "/pages/", data)
            .pipe();
    }

    addLocatore(data: any, websiteId: string, pageId: string) {
        return this.http.put(
            PAGE_API + "websites/" + websiteId + "/pages/" + pageId + "/locator",
            data
        );
    }

    updateLocator(data: Locator, websiteId: string, pageId: string) {
        return this.http
            .put(
                PAGE_API +
                "websites/" +
                websiteId +
                "/pages/" +
                pageId +
                "/locator/" +
                data.locatorId,
                data
            )
            .pipe();
    }

    updatePageById(page: Page) {
        return this.http
            .put(
                PAGE_API + "websites/" + page.websiteId + "/pages/" + page.pageId,
                page
            )
            .pipe();
    }

    removePageById(websiteId: string, pageId: string) {
        return this.http
            .delete(PAGE_API + "websites/" + websiteId + "/pages/" + pageId)
            .pipe();
    }

    getPagesByWebsiteId(websiteId: string, searchText = "") {
        let endPoint = "websites/" + websiteId + "/pages/list";
        if (searchText) {
            endPoint = `${endPoint}?search=${searchText}`;
        }
        return this.http.get(PAGE_API + endPoint).pipe(
            map((res) => {
                return res["pages"] as Page[];
            })
        );
    }

    getPageByWebsiteIdAndPageId(websiteId: string, pageId: string) {
        return this.http
            .get(PAGE_API + "websites/" + websiteId + "/pages/" + pageId)
            .pipe(
                map((page) => {
                    return page as Page;
                })
            );
    }

    public getTestScriptsForLocator(
        websiteId: string,
        pageId: string,
        locatorId: string
    ): Observable<LocatorTestScripts> {
        const url =
            PAGE_API +
            `websites/${websiteId}/pages/${pageId}/getTestScriptsForLocator/${locatorId}`;
        return this.http.get(url) as Observable<LocatorTestScripts>;
    }
}
