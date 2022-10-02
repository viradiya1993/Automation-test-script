import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Browser } from '@app/shared/models';
import { map } from 'rxjs/operators';
import { Browser_API } from '@core/helpers';
import { AUTH_USER } from '@shared/configs';
import { CommonService } from '@core/services/common.service';

@Injectable({
    providedIn: 'root'
})
export class BrowserService {

    browsers: Browser[] = [];

    browser_api = Browser_API + 'browsers';

    constructor(private http: HttpClient, private readonly commonService: CommonService) {
    }

    getBrowsers(sortColumn = 'name', sortOrder = 'asc', pageNumber = 0, pageSize = 10) {
        return this.http.get(`${this.browser_api}?offset=${pageNumber}&orderBy=${sortOrder}&size=${pageSize}&sortBy=${sortColumn}`)
            .pipe(
                map(res => {
                    return {
                        totalCount: res['totalElements'],
                        data: res["content"] as Browser[]
                    };
                })
            );
    }

    addBrowser(browser: Browser) {
        const organizationAndProjectIds = this.commonService.getOrganizationAndProjectIds();
        browser.organizationId = organizationAndProjectIds?.organizationId;
        browser.projectId = organizationAndProjectIds?.projectId;
        browser.createdBy = JSON.parse(localStorage.getItem(AUTH_USER));
        return this.http.post(this.browser_api, browser).pipe();
    }

    updateBrowser(browser: Browser) {
        browser.updatedBy = JSON.parse(localStorage.getItem(AUTH_USER));
        return this.http.put(`${this.browser_api}/${browser.browserId}`, browser).pipe();
    }

    removeBrowser(browserId: string) {
        return this.http.delete(`${this.browser_api}/${browserId}`).pipe();
    }
}
