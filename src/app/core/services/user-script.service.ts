import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { CommonObjects, UserScript } from '@app/shared/models/user-script.model';
import { Common_DataTypes_API, Common_function_API, User_commonObject_API } from '../helpers';

@Injectable({
    providedIn: 'root'
})
export class UserScriptService {

    commonOject = User_commonObject_API;
    commonFunction = Common_function_API;
    commonDataTypes = Common_DataTypes_API;

    paramterChanged = new EventEmitter<{ prev: string, next: string }>();
    paramterDeleted = new EventEmitter<string>();

    constructor(private http: HttpClient) {
    }

    public createCommonObject(userScripts: UserScript) {
        return this.http.post(this.commonOject + 'commonObjects', userScripts).pipe();
    }

    public updateCommonObject(userScripts: UserScript) {
        return this.http.put(this.commonOject + 'commonObjects/' + userScripts.commonObjectId, userScripts).pipe();
    }

    public getCommonObject(websiteId: string) {
        const params = new HttpParams().set('offset', '0')
        return this.http.get(this.commonOject + 'commonObjects/' + websiteId + '/list', { params })
    }

    public getCommonObjectById(commonObjectId: string) {
        return this.http.get(this.commonOject + 'commonObjects/' + commonObjectId).toPromise();
    }

    public getDataTypesByPrimitiveType(primitiveType: string) {
        primitiveType = (primitiveType || '').toLowerCase();
        if (primitiveType) {
            let value: any = 'string';
            switch (primitiveType) {
                case 'string':
                    value = 'string';
                    break;
                case 'short':
                case 'long':
                case 'integer':
                case 'float':
                case 'double':
                    value = 0;
                    break;
            }
            const headers = new HttpHeaders().set('Content-Type', 'application/json').set('accept', '*/*');
            const url = `${this.commonDataTypes}list-${primitiveType}-methods`;
            return this.http.post(url, { value }, { headers }).toPromise();
        }
        return Promise.resolve([]);
    }

    public getCommonFunctionList() {
        const params = new HttpParams().set('offset', '0')
        return this.http.get(this.commonFunction + 'commonFunctions', { params })
    }

    public getCommonFunctionWittId(commonFunctionId: string) {
        return this.http.get(this.commonFunction + 'commonFunctions/' + commonFunctionId).pipe();
    }

    public addCommonObject(commonObject: CommonObjects) {
        return this.http.post(this.commonFunction + 'commonFunctions', commonObject).pipe();
    }

    // Get single common function
    public getCommonFunctionId(commonFunctionId: string) {
        return this.http.get(this.commonFunction + 'commonFunctions/' + commonFunctionId).pipe();
    }

    public updateCommonFunction(commonObject: CommonObjects) {
        return this.http.put(this.commonFunction + 'commonFunctions/' + commonObject.commonFunctionId, commonObject).pipe();
    }

    public deleteCommonFunction(commonFunctionId: string) {
        return this.http.delete(this.commonFunction + 'commonFunctions/' + commonFunctionId).pipe();
    }

    // for set local storage value
    setLocalStorage(storageKey: any, storageValue: any) {
        localStorage.setItem(storageKey, storageValue);
    }

    // for get local storage value
    getLocalStorage(storageKey: any) {
        return localStorage.getItem(storageKey);
    }
}
