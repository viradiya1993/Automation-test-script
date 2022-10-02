import { HTTP_INTERCEPTORS } from "@angular/common/http";

import { AuthInterceptorService } from "./auth-interceptor.service";
import { AjaxBusyIdentifierInterceptorService } from "./ajax-busy-identifier-interceptor.service";
import { RequestTimestampService } from "./request-timestamp.service";
import { ErrorNotifierService } from "./error-notifier.service";
import { RetryInterceptorService } from "./retry-interceptor.service";

export const interceptorProviders = [
    {
        provide: HTTP_INTERCEPTORS,
        useClass: RequestTimestampService,
        multi: true,
    },
    {
        provide: HTTP_INTERCEPTORS,
        useClass: AjaxBusyIdentifierInterceptorService,
        multi: true,
    },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorNotifierService, multi: true },
    {
        provide: HTTP_INTERCEPTORS,
        useClass: RetryInterceptorService,
        multi: true,
    },
];
