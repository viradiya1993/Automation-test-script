import { RoleResponse } from './../../shared/models/role.model';
import { map } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import "rxjs/Rx";
import { ROLE_API } from "@core/helpers/";
import { Role } from "@app/shared/models/role.model";

@Injectable()
export class RoleService {
    roleApi: string = ROLE_API;

    constructor(private http: HttpClient) {
    }

    public getRoleList(offset: number = 0): Observable<Role[]> {
        return this.http
            .get(this.roleApi + "roles", { params: { offset: offset.toString() } })
            .pipe(map((res: RoleResponse) => res.content as Role[]));
    }

    public getAssignList(): Observable<Role[]> {
        return this.http.get(this.roleApi + "roles").pipe(map((res) => res as Role[]));
    }
}
