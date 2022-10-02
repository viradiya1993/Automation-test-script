import { AuthService, OrganizationService, RegisterService, } from "@core/services";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Component, ElementRef, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { LoginModel } from "@shared/models";
import { MessageService } from "@shared/components/message/messageService.service";
import {
    ACCESS_TOKEN,
    AHQ_SUPPORT,
    AUTH_REMEMBER,
    AUTH_USER,
    AUTH_USER_ROLE,
    ORGANIZATION,
    ORGANIZATION_ID,
    PROJECT_ID,
} from "@app/shared/configs";
import { FacebookLoginProvider, GoogleLoginProvider, MicrosoftLoginProvider, SocialAuthService, SocialUser, } from "angularx-social-login";

@Component({
    selector: "app-login-cmp",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit, OnDestroy {
    loginDetail: LoginModel = new LoginModel();
    authData: any = null;
    returnUrl: string;
    loginForm: FormGroup;
    submitted = false;
    private toggleButton: any;
    private sidebarVisible: boolean;
    private nativeElement: Node;

    constructor(
        private element: ElementRef,
        private router: Router,
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private route: ActivatedRoute,
        private registerService: RegisterService,
        private organizationService: OrganizationService,
        private messageService: MessageService,
        private socialAuthService: SocialAuthService
    ) {
        this.authData = JSON.parse(localStorage.getItem(AUTH_REMEMBER));

        if (this.authService.isAuthenticated()) {
            this.router.navigate(["dashboard"]);
        } else {
            this.nativeElement = element.nativeElement;
            this.sidebarVisible = false;
        }
    }

    get f() {
        return this.loginForm.controls;
    }

    ngOnInit() {
        const navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName("navbar-toggle")[0];
        const body = document.getElementsByTagName("body")[0];
        body.classList.add("login-page");
        body.classList.add("off-canvas-sidebar");

        this.loginForm = this.formBuilder.group({
            username: [
                this.authData ? this.authData.username : "",
                Validators.compose([Validators.required]),
            ],
            password: [
                this.authData ? this.authData.password : "",
                Validators.compose([Validators.required]),
            ],
            rememberMe: [this.authData],
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams["returnUrl"]
            ? decodeURIComponent(this.route.snapshot.queryParams["returnUrl"])
            : "/dashboard";
    }

    sidebarToggle() {
        const toggleButton = this.toggleButton;
        const body = document.getElementsByTagName("body")[0];
        const sidebar = document.getElementsByClassName("navbar-collapse")[0];
        if (this.sidebarVisible === false) {
            setTimeout(function () {
                toggleButton.classList.add("toggled");
            }, 500);
            body.classList.add("nav-open");
            this.sidebarVisible = true;
        } else {
            this.toggleButton.classList.remove("toggled");
            this.sidebarVisible = false;
            body.classList.remove("nav-open");
        }
    }

    login() {
        this.submitted = true;
        if (this.loginForm.invalid) {
            return;
        }

        const userData = {
            username: this.loginForm.value["username"],
            password: this.loginForm.value["password"],
        };

        this.serviceLogin(userData);
    }

    serviceLogin(
        loginData: any,
        ssoLogin = false,
        socialUser: SocialUser = null
    ) {
        this.authService.login(loginData).subscribe(
            (result) => {
                if (result) {
                    localStorage.clear();
                    const token = result.token;
                    localStorage.setItem(ACCESS_TOKEN, token);

                    this.registerService
                        .show(loginData.username)
                        .subscribe((response: any) => {
                            if (response) {
                                localStorage.setItem(AUTH_USER, JSON.stringify(response));
                                this.organizationService
                                    .show(response.organizationId)
                                    .subscribe(async (org) => {
                                        if (response.userRole) {
                                            localStorage.setItem(
                                                AUTH_USER_ROLE,
                                                JSON.stringify(response.userRole)
                                            );
                                            const role = response.userRole;
                                            // tslint:disable-next-line:triple-equals
                                            if (role && role != AHQ_SUPPORT) {
                                                sessionStorage.setItem(PROJECT_ID, response.projectId);
                                                localStorage.setItem(PROJECT_ID, response.projectId);
                                            }
                                        }
                                        sessionStorage.setItem(ORGANIZATION_ID, response.organizationId);
                                        localStorage.setItem(ORGANIZATION_ID, response.organizationId);
                                        localStorage.setItem(ORGANIZATION, JSON.stringify(org));

                                        this.authService.userPlanType();

                                        if (this.loginForm.value["rememberMe"]) {
                                            localStorage.setItem(
                                                AUTH_REMEMBER,
                                                JSON.stringify(loginData)
                                            );
                                        }

                                        if (response.firstLogin) {
                                            await this.router.navigate(["/landing-page"]);
                                        } else {
                                            await this.router.navigate([this.returnUrl]);
                                        }

                                        this.messageService.showMessage({
                                            timeout: 2000,
                                            type: "success",
                                            title: "",
                                            body: "Login Successfully...",
                                        });
                                    });
                            }
                        });
                }
            },
            (err) => {
                if (ssoLogin && err.ok === false) {
                    this.router.navigate(["/auth/register"], {
                        queryParams: {
                            sso: true,
                            firstName: socialUser.firstName,
                            lastName: socialUser.lastName,
                            email: socialUser.email,
                            provider: socialUser.provider,
                            id: socialUser.id,
                        },
                    });
                } else {
                    this.messageService.showMessage({
                        timeout: 2000,
                        type: "error",
                        title: "Login failed",
                        body: "You have entered incorrect credentials or inactive user/organization.",
                    });
                }
            }
        );
    }

    signInWithGoogle(ev: Event) {
        ev.preventDefault();
        this.socialAuthService
            .signIn(GoogleLoginProvider.PROVIDER_ID)
            .then((userData) => {
                this.setUserAndPass(userData);
            });
    }

    signInWithFacebook(ev: Event) {
        ev.preventDefault();
        this.socialAuthService
            .signIn(FacebookLoginProvider.PROVIDER_ID)
            .then((userData) => {
                this.setUserAndPass(userData);
            });
    }

    signInWithMicrosoft(ev: Event) {
        ev.preventDefault();
        this.socialAuthService
            .signIn(MicrosoftLoginProvider.PROVIDER_ID)
            .then((userData) => {
                this.setUserAndPass(userData);
            });
    }

    setUserAndPass(socialUser: SocialUser) {
        this.loginForm.patchValue({ username: socialUser.email });
        this.loginForm.patchValue({ password: socialUser.id });
        this.loginForm.patchValue({ rememberMe: false });

        const userData = {
            username: this.loginForm.value["username"],
            password: this.loginForm.value["password"],
        };
        this.serviceLogin(userData, true, socialUser);
    }

    ngOnDestroy() {
        const body = document.getElementsByTagName("body")[0];
        body.classList.remove("login-page");
        body.classList.remove("off-canvas-sidebar");
    }
}
