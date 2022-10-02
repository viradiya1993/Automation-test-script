import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { ORGANIZATION_API } from "@core/helpers/";
import { catchError, map } from "rxjs/operators";
import { List } from "@app/shared/models";

@Injectable({
    providedIn: "root",
})
export class OrganizationService {
    organizationApi: string = ORGANIZATION_API;

    constructor(private http: HttpClient) {
    }

    getClients(pageNumber = 0, pageSize = 3): Observable<List[]> {
        return this.http
            .get(this.organizationApi + "organizations/users/admin", {
                params: new HttpParams().set("offset", pageNumber.toString()),
            })
            .pipe(
                map((res: any) => {
                    return res;
                })
            );
    }

    getClientSummary(offset: number = 0): Observable<any> {
        return this.http
            .get(this.organizationApi + "organizations/users/admin?offset=" + offset)
            .pipe(
                map((res: any) => {
                    return res;
                }),
                catchError((err) => {
                    return throwError(err);
                })
            );
    }

    validateOrgName(orgName: string): Observable<any> {
        return this.http.get(
            this.organizationApi + "organizations/checkOrganizationNameAvailability",
            {
                params: {
                    organizationName: orgName,
                },
            }
        );
    }

    validateSubDomain(subDomain: string): Observable<any> {
        return this.http.get(
            this.organizationApi + "organizations/checkSubDomainAvailability",
            {
                params: {
                    subDomain: subDomain,
                },
            }
        );
    }

    index(): Observable<any> {
        return this.http.get(this.organizationApi + "organizations").pipe(
            map((res: any) => {
                return res;
            }),
            catchError((err) => {
                return throwError(err);
            })
        );
    }

    show(id: string): Observable<any> {
        return this.http.get(this.organizationApi + "organizations/" + id).pipe(
            map((res: any) => {
                return res;
            }),
            catchError((err) => {
                return throwError(err);
            })
        );
    }

    store(data: object): Observable<any> {
        return this.http.post(this.organizationApi + "organizations", data).pipe(
            map((res: any) => {
                return res;
            }),
            catchError((err) => {
                return throwError(err);
            })
        );
    }

    enableOrganization(id): Observable<any> {
        return this.http
            .put(this.organizationApi + "organizations/" + id + "/enable", {})
            .pipe(
                map((res: any) => {
                    return res;
                })
            );
    }

    disableOrganization(id): Observable<any> {
        return this.http
            .put(this.organizationApi + "organizations/" + id + "/disable", {})
            .pipe(
                map((res: any) => {
                    return res;
                })
            );
    }

    update(id: string, data: object): Observable<any> {
        return this.http
            .put(this.organizationApi + "organizations/" + id, data)
            .pipe(
                map((res: any) => {
                    return res;
                })
            );
    }

    delete(id: string): Observable<any> {
        return this.http.delete(this.organizationApi + "organizations/" + id).pipe(
            map((res: any) => {
                return res;
            })
        );
    }
}
