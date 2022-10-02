import 'rxjs/Rx';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ACCESS_TOKEN, AUTH_USER, AUTH_USER_ROLE, USER_PLAN_TYPE } from '@app/shared/configs';
import { Role, UserInfoModel } from '@app/shared/models';
import { LOGIN_API, USER_API } from '@core/helpers';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonService } from '@core/services/common.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    loginApi: string = LOGIN_API;

    constructor(private http: HttpClient, private readonly commonService: CommonService) {
    }

    public get user(): UserInfoModel | null {
        let user = null;
        const userStr = localStorage.getItem(AUTH_USER);
        if (userStr) {
            try {
                user = JSON.parse(userStr)
            } catch (e) {
                console.error(e);
            }
        }

        return user;
    }

    public set user(model: UserInfoModel | null) {
        if (model) {
            localStorage.setItem(AUTH_USER, JSON.stringify(model))
        } else {
            localStorage.removeItem(AUTH_USER)
        }
    }

    public get userRole(): Role | null {
        let userRole = null;
        const userRoleStr = localStorage.getItem(AUTH_USER_ROLE);
        if (userRoleStr) {
            try {
                userRole = JSON.parse(userRoleStr)
            } catch (e) {
                console.error(e);
            }
        }

        return userRole;
    }

    public login(loginDetail: LoginDetail): Observable<any> {
        return this.http.post(this.loginApi + "login", loginDetail).pipe(
            map((res: any) => {
                return res;
            })
        );
    }

    public isAuthenticated(): boolean {
        const token = localStorage.getItem(ACCESS_TOKEN);
        return !!token;
    }

    public userPlanType() {
        const organizationAndProjectIds = this.commonService.getOrganizationAndProjectIds();
        const orgId = organizationAndProjectIds?.organizationId;
        let headers = {};
        if (orgId) {
            headers = {
                headers: {
                    "org-id": orgId
                }
            }
        }
        this.http.get(USER_API + "users/license/is-paid", headers).subscribe((res: any) => {
            localStorage.setItem(USER_PLAN_TYPE, res.paid.toString());
        });
    }

}

interface LoginDetail {
    username: string;
    password: string;
}
