import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { startProgressBar, stopProgressBar } from '@app/store/actions/progress-bar.action';

@Injectable({
    providedIn: 'root'
})
export class AjaxBusyIdentifierInterceptorService implements HttpInterceptor {

    requestCounter = 0;

    constructor(private store: Store<{ progressBar: boolean }>) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.beginRequest();
        return next.handle(req).pipe(
            finalize(() => {
                this.endRequest();
            })
        );
    }

    beginRequest() {
        this.requestCounter = Math.max(this.requestCounter, 0) + 1;
        if (this.requestCounter === 1) {
            this.store.dispatch(startProgressBar());
        }
    }

    endRequest() {
        this.requestCounter = Math.max(this.requestCounter, 1) - 1;
        if (this.requestCounter === 0) {
            this.store.dispatch(stopProgressBar());
        }
    }
}
