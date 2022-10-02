import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, } from "@angular/common/http";
import { AuthService } from "@core/services/auth.service";
import { Router } from "@angular/router";
import { ACCESS_TOKEN, CLIENT_ID, CONFIRM_PASSWORD_TOKEN, HEADER_ORGANIZATION_ID, PROJECT_ID, USER_PASSWORD, } from "@app/shared/configs";
import { CommonService } from '@core/services';

@Injectable({
    providedIn: "root",
})
export class AuthInterceptorService implements HttpInterceptor {
    constructor(public auth: AuthService, public router: Router, private readonly commonService: CommonService) {
    }

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        if (!!localStorage.getItem(CONFIRM_PASSWORD_TOKEN)) {
            const password = localStorage.getItem(USER_PASSWORD);
            if (password) {
                request = request.clone({
                    headers: request.headers.set(USER_PASSWORD, password),
                });
            }
        }

        if (this.auth.isAuthenticated()) {
            request = request.clone({
                headers: request.headers.set(
                    "Authorization",
                    localStorage.getItem(ACCESS_TOKEN)
                ),
            });
            const organizationAndProjectIds = this.commonService.getOrganizationAndProjectIds();
            let org = organizationAndProjectIds?.organizationId;
            const projectId = organizationAndProjectIds?.projectId;

            if (localStorage.getItem(CLIENT_ID)) {
                org = localStorage.getItem(CLIENT_ID);
            }

            if (org) {
                request = request.clone({
                    headers: request.headers.set(HEADER_ORGANIZATION_ID, org),
                });
            }

            if (projectId) {
                request = request.clone({
                    headers: request.headers.set(PROJECT_ID, projectId),
                });
            } else {
                request = request.clone({
                    headers: request.headers.set(PROJECT_ID, "all"),
                });
            }
        }
        return next.handle(request);
    }
}
