import { catchError, map, tap } from "rxjs/operators";
import { HttpClient, HttpParams } from "@angular/common/http";
import { USER_API, USER_ROLE_API } from "@core/helpers/api.helper";
import { Observable } from "rxjs/Observable";
import "rxjs/Rx";
import { Injectable } from "@angular/core";
import { throwError } from "rxjs";
import { AUTH_USER, SELECTED_PROJECT, } from "@app/shared/configs";
import { CommonService } from '@core/services/common.service';

@Injectable()
export class UserService {
    userApi: string = USER_API;
    userRoleApi: string = USER_ROLE_API;
    paidUser = true;

    constructor(private http: HttpClient, private readonly commonService: CommonService) {
    }

    getUser(user: string) {
        return this.http
            .get(this.userApi + "users", {
                params: new HttpParams().set("username", user),
            })
            .pipe(
                map((res: any) => {
                    return res;
                })
            );
    }

    getUserListByOrgId(orgId: string, offset: number = 0): Observable<any> {
        return this.http
            .get(this.userApi + "users/list/" + orgId, {
                params: new HttpParams().set("offset", offset.toString()),
            })
            .pipe(
                map((res: any) => {
                    return res;
                })
            );
    }

    getAllUserListByOrgId(): Observable<any> {
        return this.http.get(this.userApi + "users/all").pipe(
            map((res: any) => {
                return res;
            })
        );
    }

    getAllNonAdminUserList(
        offset: number = -1,
        size: number = 10, searchText = ""
    ): Observable<any> {
        const organizationAndProjectIds = this.commonService.getOrganizationAndProjectIds();
        const orgId = organizationAndProjectIds?.organizationId;
        return this.http
            .get(this.userApi + "users/list/" + orgId, {
                params: new HttpParams()
                    .set("offset", offset.toString())
                    .append("size", size.toString())
                    .append("search", searchText)
            })
            .pipe(
                map((res: any) => {
                    return res;
                })
            );
    }

    getAllAssignedNonAdminUserListProject(
        offset: number = -1,
        size: number = 10, searchText = ""
    ): Observable<any> {
        const organizationAndProjectIds = this.commonService.getOrganizationAndProjectIds();
        const orgId = organizationAndProjectIds?.organizationId;
        const project = localStorage.getItem(SELECTED_PROJECT) ? JSON.parse(localStorage.getItem(SELECTED_PROJECT)) : "";
        return this.http
            .get(
                this.userApi + "users/list/" + orgId + "/assignedUsers/" + project.id,
                {
                    params: new HttpParams()
                        .set("offset", offset.toString())
                        .append("size", size.toString())
                        .append("search", searchText)
                }
            )
            .pipe(
                map((res: any) => {
                    return res;
                })
            );
    }

    getAllNonAdminUserListProject(
        offset: number = -1,
        size: number = 10, searchText = ''
    ): Observable<any> {
        const organizationAndProjectIds = this.commonService.getOrganizationAndProjectIds();
        const orgId = organizationAndProjectIds?.organizationId;
        const project = JSON.parse(localStorage.getItem(SELECTED_PROJECT));
        return this.http
            .get(
                this.userApi + "users/list/" + orgId + "/unassignedUsers/" + project.id,
                {
                    params: new HttpParams()
                        .set("offset", offset.toString())
                        .append("size", size.toString())
                        .append("search", searchText)

                }
            )
            .pipe(
                map((res: any) => {
                    return res;
                })
            );
    }

    store(data: object): Observable<any> {
        return this.http.post(this.userApi + "users", data).pipe(
            map((res: any) => {
                return res;
            })
        );
    }

    update(id: string, data: object): Observable<any> {
        return this.http.put(this.userApi + "users/" + id, data).pipe(
            map((res: any) => {
                return res;
            })
        );
    }

    delete(id: string): Observable<any> {
        return this.http.delete(this.userApi + "users/" + id).pipe(
            map((res: any) => {
                return res;
            })
        );
    }

    setUserRole(data: object): Observable<any> {
        return this.http.post(this.userRoleApi + "userRoles", data).pipe(
            map((res: any) => {
                return res;
            })
        );
    }

    deleteUserRole(roleId: string): Observable<any> {
        return this.http.delete(this.userRoleApi + "userRoles/" + roleId).pipe(
            map((res: any) => {
                return res;
            })
        );
    }

    activate(id: string): Observable<any> {
        return this.http.put(this.userApi + "users/" + id + "/activate", {}).pipe(
            map((res: any) => {
                return res;
            }),
            catchError((err) => {
                return throwError(err);
            })
        );
    }

    deactivate(id: string): Observable<any> {
        return this.http.put(this.userApi + "users/" + id + "/deactivate", {}).pipe(
            map((res: any) => {
                return res;
            }),
            catchError((err) => {
                return throwError(err);
            })
        );
    }

    firstTimeLogin(id: string): Observable<any> {
        return this.http
            .put(this.userApi + "users/" + id + "/firstTimeUser", {})
            .pipe(
                map((res: any) => {
                    return res;
                }),
                catchError((err) => {
                    return throwError(err);
                })
            );
    }

    getUserRole(projectId: string, userId: string): Observable<any> {
        return this.http
            .get(
                this.userRoleApi + "userRoles/projects/" + projectId + "/user/" + userId
            )
            .pipe(
                map((res: any) => {
                    return res;
                })
            );
    }

    /**
     * Get User & Role by Project Id
     *
     * @param projectId [any]
     */
    getProjectUserRole(projectId: string): Observable<any> {
        return this.http
            .get(this.userRoleApi + "userRoles/projects/" + projectId + "/users")
            .pipe(
                map((res: any) => {
                    return res;
                })
            );
    }

    /**
     * Update user Selected Project
     */
    updateSelectedProject(projectId: string, userId: string): Observable<any> {
        return this.http
            .put(
                this.userApi + "users/" + userId + "/selectedProject/" + projectId,
                []
            )
            .pipe(
                map((res: any) => {
                    return res;
                })
            );
    }

    userFilter(projectId: string, userName: string): Observable<any> {
        return this.http
            .post(this.userApi + "users/unassignedUsers/query", {
                projectId: projectId,
                username: userName,
            })
            .pipe(tap((res: any) => res));
    }

    logOut(): Observable<any> {
        const user = JSON.parse(localStorage.getItem(AUTH_USER))
        return this.http.post(this.userApi + "users/logout", {
            username: user.email
        })
    }
}
