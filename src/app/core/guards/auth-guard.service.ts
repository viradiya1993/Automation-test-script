import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, } from "@angular/router";
import { AuthService } from "@core/services/auth.service";
import { Observable } from "rxjs";
import { CommonService } from "../services";

import { AUTH_USER, AUTH_USER_ROLE, SITE_ADMIN_EMAIL, SITE_ADMIN_NAME, SUBSCRIBER } from "@shared/configs";
import { Role, UserInfoModel } from "@shared/models";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate, CanActivateChild {
    constructor(
        private router: Router,
        private authService: AuthService,
        private commonService: CommonService
    ) {
    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        return new Promise<boolean>((resolve, reject) => {
            const userInfo: UserInfoModel = JSON.parse(localStorage.getItem(AUTH_USER));
            const splitString = state.url ? state.url.split("?") : "";
            if (
                userInfo &&
                userInfo.userId &&
                splitString &&
                splitString.length > 0
            ) {
                if (splitString[0] === "/unauthorized") {
                    resolve(true);
                } else {
                    this.commonService
                        .isAuthorized(splitString[0], userInfo.userId)
                        .subscribe((res: any) => {
                            const isAuthorized = res.authorized;
                            if (this.authService.isAuthenticated()) {
                                if (isAuthorized) {
                                    if (this.isOnBoardingPending()) {
                                        this.router.navigate(["/onboard"]);
                                        resolve(true);
                                    } else {
                                        // logged in so return true
                                        if ((!this.commonService.isSupportRole()) && (splitString[0] === "/user-scripts")) {
                                            this.router.navigate(["/unauthorized"], {});
                                        }
                                        resolve(true);
                                    }
                                } else {
                                    this.router.navigate(["/unauthorized"], {});
                                    resolve(true);
                                }
                            } else {
                                // not logged in so redirect to login page with the return url
                                this.router.navigate(["auth/login"], {
                                    queryParams: { returnUrl: encodeURIComponent(state.url) },
                                });
                                reject(false);
                            }
                        });
                }
            } else {
                this.router.navigate(["auth/login"], {
                    queryParams: { returnUrl: encodeURIComponent(state.url) },
                });
                reject(false);
            }
        });
    }

    canActivateChild(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        return new Promise<boolean>((resolve, reject) => {
            const userInfo: UserInfoModel = JSON.parse(localStorage.getItem(AUTH_USER));
            const splitString = state.url ? state.url.split("?") : "";

            if (
                userInfo &&
                userInfo.userId &&
                splitString &&
                splitString.length > 0
            ) {
                if (splitString[0] === "/unauthorized") {
                    resolve(true);
                } else {
                    this.commonService
                        .isAuthorized(splitString[0], userInfo.userId)
                        .subscribe((res: any) => {
                            sessionStorage.setItem(SITE_ADMIN_EMAIL, res?.siteAdminEmail || 'support@automationhq.ai')
                            sessionStorage.setItem(SITE_ADMIN_NAME, res?.siteAdminName || 'Site Admin')
                            const isAuthorized = res.authorized;
                            if (this.authService.isAuthenticated()) {
                                if (isAuthorized) {
                                    if (this.isOnBoardingPending()) {
                                        this.router.navigate(["/onboard"]);
                                        resolve(true);
                                    } else {
                                        // logged in so return true
                                        if ((!this.commonService.isSupportRole()) && (splitString[0] === "/user-scripts")) {
                                            this.router.navigate(["/unauthorized"], {});
                                        }
                                        resolve(true);
                                    }
                                } else {
                                    this.router.navigate(["/unauthorized"], {});
                                    resolve(true);
                                }
                            } else {
                                // not logged in so redirect to login page with the return url
                                this.router.navigate(["auth/login"], {
                                    queryParams: { returnUrl: encodeURIComponent(state.url) },
                                });
                                reject(false);
                            }
                        });
                }
            } else {
                this.router.navigate(["auth/login"], {
                    queryParams: { returnUrl: encodeURIComponent(state.url) },
                });
                reject(false);
            }
        });
    }

    public isOnBoardingPending(): boolean {
        const userInfo: UserInfoModel = JSON.parse(localStorage.getItem(AUTH_USER));
        const userRole: Role = JSON.parse(localStorage.getItem(AUTH_USER_ROLE));

        return (
            this.authService.isAuthenticated() &&
            userInfo?.firstTimeLogin &&
            userRole?.roleId === SUBSCRIBER
        );
    }
}
