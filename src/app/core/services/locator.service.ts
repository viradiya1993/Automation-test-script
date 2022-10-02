import { Locator } from '@shared/models/locator.model';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { LOCATOR_API } from '@core/helpers';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LocatorService {
    locatorApi: string = LOCATOR_API;

    constructor(private http: HttpClient) {
    }

    getLocatorById(locatorId: string): Observable<any> {
        return this.http.get(this.locatorApi + 'locators/' + locatorId)
            .pipe(
                map((res: any) => {
                    return res;
                }),
                catchError(err => {
                    return throwError(err);
                })
            );
    }

    store(locator: Locator): Observable<any> {
        return this.http.post(this.locatorApi + 'locators/', locator).pipe(
            map((res: any) => {
                return res;
            }),
            catchError(err => {
                return throwError(err);
            })
        );
    }

    update(locator: Locator): Observable<any> {
        return this.http.put(this.locatorApi + 'locators/' + locator.locatorId, locator).pipe(
            map((res: any) => {
                return res;
            }),
            catchError(err => {
                return throwError(err);
            })
        );
    }

    deleteLocatorById(locatorId: string): Observable<any> {
        return this.http.delete(this.locatorApi + 'locators/' + locatorId).pipe(
            map((res: any) => {
                return res;
            }),
            catchError(err => {
                return throwError(err);
            })
        );
    }
}
