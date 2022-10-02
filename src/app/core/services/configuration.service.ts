import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Configuration } from '@app/shared/models';
import { Configuration_API } from '@core/helpers';
import { Observable } from 'rxjs';
import { CommonService } from '@core/services/common.service';
import { CONFIGURATION } from '@shared/configs';

@Injectable({
    providedIn: 'root'
})
export class ConfigurationService {

    configuration_api = Configuration_API + 'configuration';

    constructor(private http: HttpClient, private readonly commonService: CommonService) {
    }

    saveConfiguration(configuration: Configuration) {
        const organizationAndProjectIds = this.commonService.getOrganizationAndProjectIds();
        configuration.organizationId = organizationAndProjectIds?.organizationId
        configuration.projectId = organizationAndProjectIds?.projectId;
        configuration.configurationId = organizationAndProjectIds?.projectId + "_1";
        localStorage.setItem(CONFIGURATION, JSON.stringify(configuration));
        return Observable.of(configuration.configurationId);
    }

    getConfiguration() {
        const configuration = JSON.parse(localStorage.getItem(CONFIGURATION));
        return Observable.of(configuration);
    }
}
