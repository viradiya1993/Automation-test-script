import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Environment } from '@app/shared/models';
import { map } from 'rxjs/operators';
import { Environment_API } from '@core/helpers';
import { AUTH_USER } from '@shared/configs';
import { CommonService } from '@core/services/common.service';

@Injectable({
    providedIn: 'root'
})
export class EnvironmentService {

    environments: Environment[] = [];

    environment_api = Environment_API + 'environments';

    constructor(private http: HttpClient, private readonly commonService: CommonService) {
    }

    getEnvironments(sortColumn = 'name', sortOrder = 'asc', pageNumber = 0, pageSize = 10) {
        return this.http.get(`${this.environment_api}?offset=${pageNumber}&orderBy=${sortOrder}&size=${pageSize}&sortBy=${sortColumn}`)
            .pipe(
                map(res => {
                    return {
                        totalCount: res['totalElements'],
                        data: res["content"] as Environment[]
                    };
                })
            );
    }

    addEnvironment(environment: Environment) {
        const organizationAndProjectIds = this.commonService.getOrganizationAndProjectIds();
        environment.organizationId = organizationAndProjectIds?.organizationId;
        environment.projectId = organizationAndProjectIds?.projectId;
        environment.createdBy = JSON.parse(localStorage.getItem(AUTH_USER));
        return this.http.post(this.environment_api, environment).pipe();
    }

    updateEnvironment(environment: Environment) {
        environment.updatedBy = JSON.parse(localStorage.getItem(AUTH_USER));
        return this.http.put(`${this.environment_api}/${environment.environmentId}`, environment).pipe();
    }

    removeEnvironment(environmentId: string) {
        return this.http.delete(`${this.environment_api}/${environmentId}`).pipe();
    }
}
