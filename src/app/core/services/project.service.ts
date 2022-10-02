import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import "rxjs/Rx";
import { PROJECT_API, USER_ROLE_API } from "@core/helpers/";
import { map } from "rxjs/operators";
import { Project } from "@app/shared/models";
import { SELECTED_PROJECT } from "@app/shared/configs";

@Injectable()
export class ProjectService {
    projectApi: string = PROJECT_API;
    userRoleApi: string = USER_ROLE_API;

    constructor(private http: HttpClient) {
    }

    getProjectInfoByUserId(userId: string, offset: number = 0): Observable<any> {
        return this.http
            .get(this.projectApi + "projects/users/" + userId, {
                params: new HttpParams().set("offset", offset.toString()),
            })
            .pipe(
                map((res: any) => {
                    return res;
                })
            );
    }

    getProjectUserByRole(): Observable<Project[]> {
        return this.http.get(this.projectApi + "projects/users/listByRoles").pipe(
            map((res: Project[]) => {
                return res;
            })
        );
    }

    getUserByProjectId(projectId: string): Observable<any> {
        return this.http
            .get(this.projectApi + "projects/" + projectId + "/users")
            .pipe(
                map((res: any) => {
                    return res;
                })
            );
    }

    getProjectInfoByOrgId(orgId: string, offset: number = 0): Observable<any> {
        return this.http
            .get(this.projectApi + "projects/organizations/" + orgId, {
                params: new HttpParams().set("offset", offset.toString()),
            })
            .pipe(
                map((res: any) => {
                    return res;
                })
            );
    }

    getAllProjectInfoByOrgId(orgId: string, search = ""): Observable<Project[]> {
        let endPoint = this.projectApi + "projects/organizations/" + orgId + "/all";
        if (search) {
            endPoint = endPoint + `/search?search=${search}`;
        }
        return this.http.get(endPoint).pipe(
            map((res: Project[]) => {
                return res;
            })
        );
    }

    getAllActiveProjectInfoByOrgId(orgId: string): Observable<Project[]> {
        return this.http
            .get(
                this.projectApi + "projects/organizations/" + orgId + "/activeProjects"
            )
            .pipe(
                map((res: Project[]) => {
                    return res;
                })
            );
    }

    addUser(userIds: any): Observable<any> {
        const project = JSON.parse(localStorage.getItem(SELECTED_PROJECT));
        return this.http
            .put(this.projectApi + "projects/" + project.id + "/addUsers", userIds)
            .pipe(
                map((res) => {
                    return res;
                })
            );
    }

    disable(id: any): Observable<any> {
        return this.http
            .put(this.projectApi + "projects/" + id + "/disable", null)
            .pipe(
                map((res: any) => {
                    return res;
                })
            );
    }

    enable(id: any): Observable<any> {
        return this.http
            .put(this.projectApi + "projects/" + id + "/enable", null)
            .pipe(
                map((res: any) => {
                    return res;
                })
            );
    }

    store(data: object): Observable<any> {
        return this.http.post(this.projectApi + "projects", data).pipe(
            map((res: any) => {
                return res;
            })
        );
    }

    removeUsers(projectId: string, userId: string): Observable<any> {
        return this.http
            .delete(
                this.projectApi + "projects/" + projectId + "/removeUser/" + userId
            )
            .pipe(
                map((res: any) => {
                    return res;
                })
            );
    }

    projectUser(id: string, data: object): Observable<any> {
        return this.http.put(this.projectApi + "projects/" + id, data).pipe(
            map((res: any) => {
                return res;
            })
        );
    }

    projectUserRole(
        id: string,
        data: { userId: string; roleId: string }
    ): Observable<any> {
        return this.http
            .put(
                this.projectApi + "projects/" + id + "/updateRole/" + data.userId,
                data
            )
            .pipe(
                map((res: any) => {
                    return res;
                })
            );
    }

    update(id: string, data: object): Observable<any> {
        return this.http.put(this.projectApi + "projects/" + id, data).pipe(
            map((res: any) => {
                return res;
            })
        );
    }

    delete(id: string): Observable<any> {
        return this.http.delete(this.projectApi + "projects/" + id).pipe(
            map((res: any) => {
                return res;
            })
        );
    }
}
