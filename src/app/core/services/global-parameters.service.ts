import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalParameters, NameValuePair } from '@app/shared/models';
import { Global_Parameters_API } from '@core/helpers';
import { map } from 'rxjs/operators';
import { AUTH_USER } from '@shared/configs';
import { CommonService } from '@core/services/common.service';

@Injectable({
    providedIn: 'root'
})
export class GlobalParametersService {

    globalParameters_api = Global_Parameters_API + 'globalParameters';

    constructor(private http: HttpClient, private readonly commonService: CommonService) {
    }

    addGlobalParameters(globalParameters: GlobalParameters) {
        const organizationAndProjectIds = this.commonService.getOrganizationAndProjectIds();
        globalParameters.organizationId = organizationAndProjectIds?.organizationId;
        globalParameters.projectId = organizationAndProjectIds?.projectId;

        globalParameters.createdBy = JSON.parse(localStorage.getItem(AUTH_USER));
        return this.http.post(this.globalParameters_api, globalParameters).pipe();
    }

    updateGlobalParameters(globalParameters: GlobalParameters) {
        globalParameters.updatedBy = JSON.parse(localStorage.getItem(AUTH_USER));
        return this.http.put(`${this.globalParameters_api}/${globalParameters.globalParameterId}`, globalParameters).pipe();
    }

    getGlobalParameters() {
        return this.http.get(`${this.globalParameters_api}`).pipe(
            map(res => {
                return res as GlobalParameters;
            })
        );
    }

    getGlobalParametersById(globalParameterId: string) {
        return this.http.get(`${this.globalParameters_api}/${globalParameterId}`).pipe(
            map(res => {
                return res as GlobalParameters;
            })
        );
    }

    getGlobalParametersByName(globalParameterName: string) {
        return this.http.get(`${this.globalParameters_api}/search?name=${globalParameterName}`).pipe(
            map(res => {
                return res as NameValuePair[];
            })
        );
    }
}
