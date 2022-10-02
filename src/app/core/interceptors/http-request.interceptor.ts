import { EMPTY, Observable, throwError as observableThrowError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpXhrBackend } from '@angular/common/http';
import { CommonService, LocalStorageService } from '@core/services';
import { MessageService } from '@app/shared/components/message/messageService.service';
import { ACCESS_TOKEN, CONFIRM_PASSWORD_TOKEN, USER_PASSWORD } from '@shared/configs';
import { Store } from '@ngrx/store';
import { startProgressBar, stopProgressBar } from '@app/store/actions/progress-bar.action';

@Injectable()
export class HttpRequestInterceptor extends HttpClient {

    contador = 0;

    constructor(
        httpXhrBackend: HttpXhrBackend,
        private router: Router,
        private localStorageService: LocalStorageService,
        public messageService: MessageService,
        private readonly commonService: CommonService,
        private store: Store<{ progressBar: boolean }>
    ) {
        super(httpXhrBackend);
    }

    request: any = (method: string, url: string, options?: any): Observable<any> => {
        return this.intercept(super.request(method, url, options));
    }

    get(url: string, options?: any): Observable<any> {
        return this.intercept(super.get(url, this.getRequestOptionArgs(options)));
    }

    post(url: string, body: string, options?: any): Observable<any> {
        return this.intercept(super.post(url, body, this.getRequestOptionArgs(options)));
    }

    put(url: string, body: string, options?: any): Observable<any> {
        return this.intercept(super.put(url, body, this.getRequestOptionArgs(options)));
    }

    delete(url: string, options?: any): Observable<any> {
        return this.intercept(super.delete(url, this.getRequestOptionArgs(options)));
    }

    intercept(observable: Observable<any>): Observable<any> {
        this.contador++;
        this.store.dispatch(startProgressBar());
        return observable.pipe(catchError((err, source) => {
            this.contador--;
            if (this.contador === 0) {
                setTimeout(() => {
                    /** spinner ends after 5 seconds */
                    this.store.dispatch(stopProgressBar());
                }, 800);
            }
            if (err.status === 401) {                /*UnOthorised Access*/
                this.localStorageService.removeLogin();
                this.router.navigate(['/login']);
                setTimeout(() => {
                    /** spinner ends after 5 seconds */
                    this.store.dispatch(stopProgressBar());
                }, 800);
                return observableThrowError({ key: 'login', message: 'unauthorise' });
            } else if (err.status === 403) {
                this.router.navigate(['/dashboard']
                );
                setTimeout(() => {
                    /** spinner ends after 5 seconds */
                    this.store.dispatch(stopProgressBar());
                }, 800);
                return EMPTY;
            } else if (err.status === 0) {                /* Api Connection Refused*/
                this.showErrorMessage('Server down!');
                return observableThrowError(err);
            } else if (err.status === 404) {              /*API path not found*/
                return observableThrowError(err);
            } else if (err.status === 400) {              /*Bad Request*/
                if (err && (Object.keys(err).length === 0)) {
                    const errorResult = err.json();
                    if (errorResult.validationErrors && errorResult.validationErrors.length > 0) {
                        errorResult.validationErrors.forEach(errMsg => {
                            this.showErrorMessage(errMsg.ErrorMessage);
                        });
                        const error = errorResult.validationErrors[0].errorMessage;
                        this.showErrorMessage(error);
                        setTimeout(() => {
                            /** spinner ends after 5 seconds */
                            this.store.dispatch(stopProgressBar());
                        }, 800);
                        if (errorResult.validationErrors[0].errorCode === 120 ||
                            errorResult.validationErrors[0].errorCode === 115) {
                            return observableThrowError(err);
                        } else {
                            return;
                        }
                    } else {
                        if (errorResult.type !== undefined && errorResult.type === 'text/xml') {
                            this.messageService.showMessage({
                                timeout: 2000,
                                type: 'error',
                                title: 'Error',
                                body: 'No Record found by search criteria.'
                            });
                        } else {
                            this.showErrorMessage(errorResult);
                        }
                        setTimeout(() => {
                            /** spinner ends after 5 seconds */
                            this.store.dispatch(stopProgressBar());
                        }, 800);
                    }
                }
                return observableThrowError(err);
            } else if (err.status === 500) {              /* Internal Server error*/
                this.showErrorMessage('500 (Internal Server error)');
                setTimeout(() => {
                    /** spinner ends after 5 seconds */
                    this.store.dispatch(stopProgressBar());
                }, 800);
                return;

            } else {
                return observableThrowError(err);
            }
        }), tap(event => {
            if (event) { /*only when event is a HttpRespose*/
                this.contador--;
                // if (this.contador === 0) {
                setTimeout(() => {
                    /** spinner ends after 5 seconds */
                    this.store.dispatch(stopProgressBar());
                }, 800);
                // }
            }
        }));
    }

    private getRequestOptionArgs(options?: any): any {
        if (options == null) {
            options = {};
        }
        options.headers = new HttpHeaders();
        options.headers = options.headers.append('Content-Type', 'application/json');
        options.headers = options.headers.append('Access-Control-Allow-Origin', '*');

        const token = localStorage.getItem(CONFIRM_PASSWORD_TOKEN);
        const tokenValue = localStorage.getItem(ACCESS_TOKEN);
        const orgId = this.commonService.getOrganizationAndProjectIds().organizationId;
        const projectId = this.commonService.getOrganizationAndProjectIds().projectId;
        if (tokenValue && orgId) {
            options.headers = options.headers.append('Authorization', tokenValue);
            options.headers = options.headers.append('org-id', orgId);
            options.headers = options.headers.append('projectId', projectId || "");
        }
        if (token) {
            const password = localStorage.getItem(USER_PASSWORD)
            if (password) {
                options.headers = options.headers.append('password', password);
            }

        }
        return options;
    }

    private showErrorMessage(errorMessage) {
        if (!errorMessage) {
            return;
        }
        this.messageService.showMessage({
            timeout: 2000,
            type: 'error',
            title: 'Request Failure',
            body: errorMessage
        });
    }
}
