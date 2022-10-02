import { Injectable } from "@angular/core";
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, } from "@angular/common/http";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { environment } from "environments/environment";

@Injectable({
    providedIn: "root",
})
export class RequestTimestampService implements HttpInterceptor {
    constructor() {
    }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const startTime = new Date().getTime();
        const newReq = req.clone({
            headers: req.headers.set("startTime", startTime.toString()),
        });

        return next.handle(req).pipe(
            map((event) => {
                if (event instanceof HttpResponse) {
                    const endTime = new Date().getTime();
                    event = event.clone({
                        headers: event.headers.set("endTime", endTime.toString()),
                    });
                    event = event.clone({
                        headers: event.headers.set("startTime", startTime.toString()),
                    });
                    const diff = endTime - startTime;

                    if (!environment.production) {
                        //console.log(event.url + " succeded in " + diff + " milli seconds");
                    }
                }
                return event;
            }),
            tap((event) => {
                },
                (error) => {
                    if (error instanceof HttpErrorResponse) {
                        const endTime = new Date().getTime();
                        const diff = endTime - startTime;
                        if (!environment.production) {
                            console.log(error.url + " failed in " + diff + " milli seconds");
                        }
                        return error;
                    }
                }
            )
        );
    }
}
