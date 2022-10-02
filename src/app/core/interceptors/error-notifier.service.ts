import { throwError as observableThrowError, } from "rxjs";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest, } from "@angular/common/http";
import { tap } from "rxjs/operators";
import { LocalStorageService } from "@core/services";
import { MessageService } from "@app/shared/components/message/messageService.service";

@Injectable({
    providedIn: "root",
})
export class ErrorNotifierService implements HttpInterceptor {
    constructor(
        public messageService: MessageService,
        private router: Router,
        private localStorageService: LocalStorageService
    ) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): any {
        return next.handle(request).pipe(
            tap(
                (event) => {
                },
                (error) => {
                    if (error instanceof HttpErrorResponse) {
                        if (error.status === 401) {
                            /* Unauthorized Access */
                            this.localStorageService.removeLogin();
                            this.router.navigate(["/auth/login"]);
                            return observableThrowError(error);
                        } else if (error.status === 403) {
                            this.router.navigate(["/dashboard"]);
                            return observableThrowError(error);
                        } else if (error.status === 0) {
                            /* Api Connection Refused*/
                            this.showErrorMessage("Server down!");
                            return observableThrowError(error);
                        } else if (error.status === 404) {
                            /*API path not found*/
                            return observableThrowError(error);
                        } else if (error.status === 400) {
                            /*Bad Request*/
                            if (error && Object.keys(error).length === 0) {
                                const errorResult = error.error;
                                if (
                                    errorResult.validationErrors &&
                                    errorResult.validationErrors.length > 0
                                ) {
                                    errorResult.validationErrors.forEach((errMsg) => {
                                        this.showErrorMessage(errMsg.ErrorMessage);
                                    });
                                    const errorResponse =
                                        errorResult.validationErrors[0].errorMessage;
                                    this.showErrorMessage(errorResponse);

                                    if (
                                        errorResult.validationErrors[0].errorCode === 120 ||
                                        errorResult.validationErrors[0].errorCode === 115
                                    ) {
                                        return observableThrowError(errorResponse);
                                    } else {
                                        return observableThrowError(error);
                                    }
                                } else {
                                    if (
                                        errorResult.type !== undefined &&
                                        errorResult.type === "text/xml"
                                    ) {
                                        this.messageService.showMessage({
                                            timeout: 2000,
                                            type: "error",
                                            title: "Error",
                                            body: "No Record found by search criteria.",
                                        });
                                    } else {
                                        this.showErrorMessage(errorResult);
                                        return observableThrowError(error);
                                    }
                                }
                            } else {
                                this.showErrorMessage(error?.error?.message);
                                this.router.navigate(["/dashboard"]);
                                return observableThrowError(error);
                            }
                        } else if (error.status === 500) {
                            /* Internal Server error*/
                            this.showErrorMessage("500 (Internal Server error)");
                            return observableThrowError(error);
                        } else {
                            return observableThrowError(error);
                        }
                    } else {
                        return observableThrowError(error);
                    }
                }
            )
        );
    }

    private showErrorMessage(errorMessage) {
        if (!errorMessage) {
            return;
        }
        // this.messageService.showMessage({
        //   timeout: 2000,
        //   type: "error",
        //   title: "Request Failure",
        //   body: errorMessage,
        // });
    }
}
