import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DASHBOARD_API } from "@core/helpers/api.helper";
import { Menu } from "@shared/models/menu.model";
import { Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Role } from '@shared/models';
import { AHQ_SUPPORT, AUTH_USER, AUTH_USER_ROLE, ORGANIZATION_ID, PROJECT_ID, USER_PLAN_TYPE } from '@shared/configs';
import { Params, Router } from '@angular/router';
import { ActionList } from '@shared/models/action-list';

@Injectable({
    providedIn: "root",
})
export class CommonService {
    public notify = new Subject<any>();
    public logo = "";
    public onImageChange = new Subject<any>();
    dashboardApi: string = DASHBOARD_API;

    menuLists: Menu[] = [];
    menuUserId = null;

    constructor(
        private http: HttpClient,
        private router: Router
    ) {
    }

    getOrganizationAndProjectIds(): {
        organizationId: string,
        projectId: string
    } {
        let projectId = sessionStorage.getItem(PROJECT_ID);
        let organizationId = sessionStorage.getItem(ORGANIZATION_ID);

        if (!organizationId) {
            organizationId = localStorage.getItem(ORGANIZATION_ID);
        }

        if (!projectId) {
            projectId = localStorage.getItem(PROJECT_ID);
        }
        return {
            organizationId,
            projectId
        };
    }

    getCurrencyList(): Observable<any> {
        const url = "../../../../assets/data/country.json";
        return this.http.get(url).pipe(
            map((res: any) => {
                return res;
            })
        );
    }

    getMenu(): Observable<any> {
        const userData = JSON.parse(localStorage.getItem(AUTH_USER));

        const userInfoID = userData.userId ? userData.userId : userData.id;

        this.menuUserId = userInfoID;
        return this.http.get(this.dashboardApi + "dashboard/" + userInfoID).pipe(
            map((res: any) => {
                // TODO:: remove filtering when upgrade plan is working
                this.menuLists = res.filter(item => item.url !== "/upgrade-plan");
                return res;
            })
        );
    }

    getShortcutMenus(): Observable<Array<ActionList>> {
        const userData = JSON.parse(localStorage.getItem(AUTH_USER));
        const userInfoID = userData.userId ? userData.userId : userData.id;

        const organizationAndProjectIds = this.getOrganizationAndProjectIds();
        const projectId = organizationAndProjectIds?.projectId;

        return this.http.get(this.dashboardApi + "shortcut-menus/" + userInfoID, {
            headers: new HttpHeaders().set("projectid", projectId),
        }).pipe(
            map((res: ActionList[]) => {
                return res.sort((a, b) => a.sequence - b.sequence).map(item => {
                    item.queryParams = item.queryParams ? item.queryParams : null;
                    if (item.queryParams instanceof Array) {
                        const queryParams: Params = {};
                        for (const queryParam of item.queryParams) {
                            if (queryParam.value === 'true') {
                                queryParam.value = true;
                            } else if (queryParam.value === 'false') {
                                queryParam.value = false;
                            }
                            queryParams[queryParam.key] = queryParam.value;
                        }
                        item.queryParams = Object.keys(queryParams).length > 0 ? queryParams : null;
                    }
                    return item;
                });
            })
        );
    }

    upLoadImage(file, fileId): Observable<any> {
        // const url = (environment.api_url. $environment.url + 'Attachment/addProfilePicture/');
        // return this.http.post(url, JSON.stringify(file));
        return;
    }

    notifyOther(data: any) {
        if (data) {
            this.notify.next(data);
        }
    }

    isAuthorized(url: string, userId: string) {
        return this.http.post(this.dashboardApi + `dashboard/${userId}`, {
            "url": url
        }).pipe(
            map((res: any) => {
                return res;
            })
        );
    }

    getUpgradeRequire(): boolean {
        const authUserRole: Role = JSON.parse(localStorage.getItem(AUTH_USER_ROLE));
        return authUserRole.roleId !== AHQ_SUPPORT ? localStorage.getItem(USER_PLAN_TYPE) !== 'true' : false;
    }

    isUserPaid(): boolean {
        return localStorage.getItem(USER_PLAN_TYPE) === 'true';
    }

    isSupportRole(): boolean {
        const authUserRole: Role = JSON.parse(localStorage.getItem(AUTH_USER_ROLE));
        return authUserRole?.roleId ? authUserRole.roleId === AHQ_SUPPORT : false;
    }

    gotIt(): boolean {
        const userId = JSON.parse(localStorage.getItem(AUTH_USER))?.userId;
        const currentRoute = this.router.url;
        const key = `got_it_${userId}_${currentRoute}`;
        return localStorage.getItem(key) === 'true';
    }

    gotItTooltip() {
        const currentRoute = this.router.url;
        let route = currentRoute.replace('-', ' ').slice(1);
        if (route === 'object repository') {
            route = 'elements library';
        }
        return `Help details for ${route}`;
    }

    changeGotIt() {
        const userId = JSON.parse(localStorage.getItem(AUTH_USER))?.userId;
        const currentRoute = this.router.url;
        const key = `got_it_${userId}_${currentRoute}`;

        const currentState = this.gotIt();
        const updatedState = !!currentState ? 'false' : 'true';
        localStorage.setItem(`${key}`, updatedState);
    }
}
