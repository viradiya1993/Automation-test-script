import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LicenseType } from '@app/shared/models';
import { Payment_Service_API } from '../helpers';

@Injectable({
    providedIn: 'root'
})
export class LicenseTypeService {

    payment_api = Payment_Service_API;

    constructor(private http: HttpClient) {
    }

    public createLincense(licenseDetails: LicenseType) {
        return this.http.post(this.payment_api + 'license-types', licenseDetails).pipe();
    }

    public getLincense() {
        // https://api-test.automationhq.ai/payment-services/rest/api/license-types
        return this.http.get(this.payment_api + 'license-types')
    }
}

