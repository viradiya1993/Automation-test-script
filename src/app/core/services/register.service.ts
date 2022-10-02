import { catchError, map } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { REGISTER_API } from "@core/helpers/";
import { HttpClient, HttpHeaders, HttpParams, HttpResponse, } from "@angular/common/http";
import { RegistrationObj } from "@app/shared/models";
import { CONFIRM_PASSWORD_TOKEN, FORGOT_PASSWORD_TOKEN, USER_INVITED, } from "@shared/configs";

@Injectable()
export class RegisterService {
    registerApi: string = REGISTER_API;

    constructor(private http: HttpClient) {
    }

    validateEmail(email: any): Observable<any> {
        return this.http.get(this.registerApi + "checkEmailAvailability", {
            params: new HttpParams().set("email", email.toString()),
        });
    }

    validateUserName(user: any): Observable<any> {
        return this.http.get(this.registerApi + "checkUserNameAvailability", {
            params: new HttpParams().set("username", user.toString()),
        });
    }

    show(username: string): Observable<any> {
        return this.http.post(this.registerApi + "info", {
            value: username
        }).pipe(
            map((res: any) => {
                return res;
            })
        );
    }

    isValidEmail(emails: string): Observable<any> {
        return this.http
            .post(this.registerApi + "register/isValidEmail", emails)
            .pipe(
                map((res: any) => {
                    return res;
                })
            );
    }

    register(data: any, ssoToken: string): Observable<any> {
        let apiUrl = this.registerApi;
        if (!!data.user.ssoEnabled) {
            apiUrl += "sso/";
        }
        apiUrl += "register";

        return this.http
            .post(apiUrl, data, {
                headers: {
                    ssoToken: ssoToken || "",
                },
            })
            .pipe(
                map((res: any) => {
                    return res;
                })
            );
    }

    forgotPassword(data: any): Observable<any> {
        return this.http
            .post(this.registerApi + "forgot", { email: data.toString() })
            .pipe(
                map((res: HttpResponse<any>) => {
                    return res;
                }),
                catchError((err) => {
                    return throwError(err);
                })
            );
    }

    confirm(token: string): Observable<any> {
        return this.http.get(this.registerApi + "confirm?token=" + token).pipe(
            map((res: any) => {
                return res;
            })
        );
    }

    setPassword(password: string, data: object = {}): Observable<any> {
        const token = localStorage.getItem(CONFIRM_PASSWORD_TOKEN);
        const forgotPassword = localStorage.getItem(FORGOT_PASSWORD_TOKEN)
            ? localStorage.getItem(FORGOT_PASSWORD_TOKEN) === "true"
            : false;
        const invite = localStorage.getItem(USER_INVITED)
            ? localStorage.getItem(USER_INVITED) === "true"
            : false;
        let passwordUrl = "confirm?token=" + token;

        if (invite) {
            passwordUrl = "confirm/invitedUser?token=" + token;
        }

        if (!!forgotPassword) {
            passwordUrl = passwordUrl + "&forgotPassword=" + forgotPassword;
        }

        return this.http
            .post(
                this.registerApi + passwordUrl,
                { ...data },
                {
                    headers: new HttpHeaders().set("password", password.toString()),
                }
            )
            .pipe(
                map((res: any) => {
                    return res;
                })
            );
    }

    multipleUser(objects: any, projectId: string = ''): Observable<any> {
        let apiUrl = this.registerApi + "register/multiple";
        if (!!projectId) {
            apiUrl += "/" + projectId;
        }
        return this.http.post(apiUrl, objects).pipe(
            map((res) => {
                return res;
            }),
            catchError((err) => {
                return throwError(err);
            })
        );
    }

    onboarding(data: any): Observable<any> {
        return this.http.post(this.registerApi + "onboarding", data);
    }

    validateAccessCode(accessCode: string) {
        return this.http.get<RegistrationObj>(
            `${this.registerApi}register/code/${accessCode}`
        );
    }

    resendInvite(email: string): Observable<any> {
        return this.http
            .post(this.registerApi + "resend", { email: email })
            .pipe(map((res) => res));
    }
}
