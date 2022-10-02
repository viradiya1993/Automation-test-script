import { catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TEMPLATE_API } from '@core/helpers';
import { Observable, throwError } from 'rxjs';
import { Template } from '@app/shared/models';

@Injectable({
    providedIn: 'root'
})
export class TemplateService {
    templateApi: string = TEMPLATE_API;
    private title: String;

    constructor(
        public http: HttpClient
    ) {
    }

    getPage(offset: number = 0) {
        return this.http.get(this.templateApi + 'templates', {
            params: {
                offset: offset.toString()
            }
        }).pipe(map(res => res));
    }

    getLinks() {
        return this.http.get(this.templateApi + 'templates/search', {
            params: {
                title: this.title.toString()
            }
        }).pipe(map(res => res));
    }

    getTemplatesByTitle(title: string): Observable<Template[]> {
        return this.http.get(
            this.templateApi + 'templates/search',
            //  './assets/data/templates.json',
            {
                params: {
                    title: title
                }
            }).pipe(map(res => res as Template[]));
    }

    getTemplateById(id: string): Observable<Template> {
        return this.http.get(this.templateApi + 'templates/' + id)
            .pipe(map(res => res as Template));
    }

    store(data: object): Observable<any> {
        return this.http.post(this.templateApi + 'templates', data).pipe(
            map(res => res), catchError(err => throwError(err)));
    }

    update(id: string, data: string): Observable<any> {
        return this.http.put(this.templateApi + 'templates/' + id, data).pipe(
            map(res => res), catchError(err => throwError(err)));
    }

    delete(id: string): Observable<any> {
        return this.http.delete(this.templateApi + 'templates/' + id).pipe(
            map(res => res), catchError(err => throwError(err)));
    }

    updateTemplate(title: string) {
        this.title = title;
    }
}
