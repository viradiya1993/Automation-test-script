import { Router } from '@angular/router';
import { HttpXhrBackend } from '@angular/common/http';
import { HttpRequestInterceptor } from '@app/core/interceptors/http-request.interceptor';
import { CommonService, LocalStorageService } from '@core/services';
import { MessageService } from '@shared/components/message';
import { Store } from '@ngrx/store';

export function httpFactory(
    xhrBackend: HttpXhrBackend,
    router: Router,
    localStorageService: LocalStorageService,
    messageService: MessageService,
    commonService: CommonService,
    store: Store<{ progressBar: boolean }>
) {
    return new HttpRequestInterceptor(xhrBackend, router, localStorageService, messageService, commonService, store);
}
