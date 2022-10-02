import { AuthErrorModel, Country, RegisterModel, RegistrationObj } from "@shared/models";
import { CommonService } from "@core/services/common.service";
import { AfterContentInit, Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService, OrganizationService, ProjectService, RegisterService } from "@core/services";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { Location } from '@angular/common';
import { FacebookLoginProvider, GoogleLoginProvider, MicrosoftLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';
import {
    ACCESS_TOKEN,
    AHQ_SUPPORT,
    AUTH_REMEMBER,
    AUTH_USER,
    AUTH_USER_ROLE,
    ORGANIZATION,
    ORGANIZATION_ID,
    PROJECT_ID
} from '@shared/configs';
import { environment } from '../../../../environments/environment';
import { MessageService } from '@shared/components/message';

@Component({
    selector: "app-register-cmp",
    templateUrl: "./register.component.html",
    styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit, AfterContentInit, OnDestroy {
    emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$";
    test: Date = new Date();
    registrationModel: RegisterModel = new RegisterModel();
    error: AuthErrorModel = new AuthErrorModel();
    countryCode: Country[] = [];
    submitted = false;
    selectedCountryDialCode = "+1";
    selectedCountryCode = "CA";
    success: string = null;
    filteredOptions: Observable<Country[]>;
    countryObject: any = null;
    hasError = {};
    errorMsg = "";
    registrationObj: RegistrationObj;

    returnUrl = '/';
    ssoToken = '';
    recaptchaSiteKey = environment.recaptchaSiteKey;
    registrationForm: FormGroup;

    constructor(
        private location: Location,
        private _fb: FormBuilder,
        public router: Router,
        public route: ActivatedRoute,
        private registerService: RegisterService,
        private commonService: CommonService,
        private projectService: ProjectService,
        private socialAuthService: SocialAuthService,
        private authService: AuthService,
        private organizationService: OrganizationService,
        private messageService: MessageService
    ) {
        this.getCurrencyList();
    }

    // convenience getter for easy access to form fields
    get f() {
        return this.registrationForm.controls;
    }

    ngOnInit() {
        this.registrationForm = this._fb.group({
            company: ["", Validators.compose([Validators.required])],
            email: [
                "",
                Validators.compose([
                    Validators.required,
                    Validators.email,
                    Validators.pattern(this.emailPattern),
                ]),
            ],
            firstName: ["", Validators.compose([Validators.required])],
            lastName: ["", Validators.compose([Validators.required])],
            phone: [
                "",
                Validators.compose([Validators.required, Validators.pattern("[0-9]*")]),
            ],
            countryCode: [null, Validators.compose([])],
            accessCode: ["", Validators.compose([])],
            termsAccepted: [null, Validators.compose([Validators.requiredTrue])],
            ssoClient: ["NONE"],
            ssoEnabled: [false],
            recaptcha: [null, Validators.compose([Validators.required])],
        });

        const routeParams = this.route.snapshot.queryParamMap;
        const accessCode = routeParams.get('accessCode');
        if (accessCode) {
            this.registerService.validateAccessCode(accessCode).subscribe(registrationObj => {
                    this.registrationObj = registrationObj;
                    this.registrationModel.user.accessCode = this.registrationObj.code;
                    this.location.replaceState('/auth/register');
                },
                err => {
                    this.registrationObj = err.error;
                    this.errorMsg = err.error.message.replace("support@automationhq.ai", '<a href="mailto:support@automationhq.ai">AHQ Support</a>');
                    this.location.replaceState('/auth/register');
                });
        }

        const body = document.getElementsByTagName("body")[0];
        body.classList.add("register-page");
        body.classList.add("off-canvas-sidebar");
        this.filteredOptions = this.registrationForm.controls[
            "countryCode"
            ].valueChanges.pipe(
            startWith(""),
            map((value: any) => (typeof value === "string" ? value : value.name)),
            map((name) => (name ? this._filter(name) : this.countryCode.slice()))
        );

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams["returnUrl"]
            ? decodeURIComponent(this.route.snapshot.queryParams["returnUrl"])
            : "/dashboard";
    }

    ngAfterContentInit() {
        let sso = this.route.snapshot.queryParams['sso'];
        sso = sso === 'true';
        if (sso) {
            const socialUserData = {
                id: this.route.snapshot.queryParams['id'],
                email: this.route.snapshot.queryParams['email'],
                firstName: this.route.snapshot.queryParams['firstName'],
                lastName: this.route.snapshot.queryParams['lastName'],
                provider: this.route.snapshot.queryParams['provider'],
            } as SocialUser;
            // must wait at least one second before setting the user
            setTimeout(() => {
                this.setSocialLoginParam(socialUserData);
            }, 1200);
        }
    }

    displayFn(code?: Country): string | undefined {
        return code ? code.name : undefined;
    }

    getCurrencyList() {
        this.commonService.getCurrencyList().subscribe((res) => {
            this.countryCode = res;
            this.assignSelectedCompany();
        });
    }

    // * Registration Form Submit
    register(autoLoginData: any = null) {
        this.submitted = true;

        if (!autoLoginData) {
            if (this.registrationForm.invalid) {
                return;
            }
        }

        this.registrationModel.user.userName = this.registrationForm.value.email;
        this.registrationModel.user.phone.countryCode = this.selectedCountryDialCode;

        this.registrationModel.user.ssoClient = this.registrationForm.value.ssoClient;
        this.registrationModel.user.ssoEnabled = this.registrationForm.value.ssoEnabled;

        this.registerService.register({ ...this.registrationModel }, this.ssoToken).subscribe(
            (response) => {
                if (response.status === 200) {
                    this.errorMsg = "";
                    localStorage.clear();
                    if (autoLoginData) {
                        this.autoLogin({
                            username: autoLoginData.username,
                            password: autoLoginData.password,
                        }, autoLoginData.rememberMe);
                    } else {
                        this.success = "Thank you for registering account with AHQ. Please check your email and activate your account.";
                        setTimeout(() => {
                            this.redirectLogin();
                        }, 15000);
                    }
                } else {
                    this.router.navigate(['/auth/register']);
                    showErrorMessage(response);
                }
            },
            (err) => {
                this.router.navigate(['/auth/register']);
                showErrorMessage(err);
            }
        );

        const showErrorMessage = (err) => {
            const { message, validationErrors } = err.error;
            let duplicateEmail = null;
            let duplicateCompany = null;
            validationErrors.forEach((item) => {
                if (item.key === 'email') {
                    duplicateEmail = item;
                }
                if (item.key === 'company') {
                    duplicateCompany = item;
                }
                this.hasError[item.key] = item.message;
            });
            if (message.includes('The access code is not valid')) {
                this.hasError['accessCode'] = 'Invalid Affiliation Code';
            }
            this.errorMsg = message.replace("support@automationhq.ai", '<a href="mailto:support@automationhq.ai">AHQ Support</a>');

            /*if (duplicateEmail) {
                this.messageService.showMessage({
                    timeout: 2000,
                    type: "warning",
                    title: "Registration failed",
                    body: duplicateEmail.message,
                });
            }
            if (duplicateCompany) {
                this.messageService.showMessage({
                    timeout: 2000,
                    type: "warning",
                    title: "Registration failed",
                    body: duplicateCompany.message,
                });
            }*/
        }
    }

    autoLogin(loginData: any, rememberMe: boolean) {
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

                                        if (rememberMe) {
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
            () => {
                this.messageService.showMessage({
                    timeout: 2000,
                    type: "error",
                    title: "Login failed",
                    body: "You have entered incorrect credentials or inactive user/organization.",
                });
            }
        );
    }

    changeCountry(event) {
        if (event?.dial_code) {
            this.selectedCountryDialCode = event.dial_code;
        }
        if (event?.code) {
            this.selectedCountryCode = event.code;
        }
    }

    countryBlur() {
        setTimeout(_ => { // Wait till change country to be applied
            this.assignSelectedCompany();
        }, 500)
    }

    // * Redirect Login
    redirectLogin() {
        this.router.navigate(["auth/login"]);
    }

    createProject(orgId, userIds) {
        this.projectService
            .store({
                description: "Demo",
                isEnabled: true,
                orgId: orgId,
                projectName: "Demo",
                userIds: userIds,
            })
            .subscribe(() => {
            });
    }

    signUpWithGoogle(ev: Event) {
        ev.preventDefault();
        this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then(userData => {
            this.setSocialLoginParam(userData);
        });
    }

    signUpWithFacebook(ev: Event) {
        ev.preventDefault();
        this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID).then((userData: SocialUser) => {
            this.setSocialLoginParam(userData);
        });
    }

    signUpWithMicrosoft(ev: Event) {
        ev.preventDefault();
        this.socialAuthService.signIn(MicrosoftLoginProvider.PROVIDER_ID).then((userData: SocialUser) => {
            this.setSocialLoginParam(userData);
        });
    }

    setSocialLoginParam(socialUser: SocialUser) {
        const generateCompanyName = () => `${socialUser.firstName}'s Organization ${new Date().getTime()}`;
        const accessCode = 'AHQ-Testing';

        const generateRandomPhone = () => {
            let phoneNumber = '';
            for (let i = 0; i < 10; i++) {
                phoneNumber += Math.floor(Math.random() * (9 + 1) + 1)
            }
            return phoneNumber;
        };
        this.registrationForm.patchValue({ 'company': generateCompanyName() });
        this.registrationForm.patchValue({ 'phone': generateRandomPhone() });
        this.registrationForm.patchValue({ 'accessCode': accessCode });
        this.registrationForm.patchValue({ 'termsAccepted': true });

        this.registrationForm.patchValue({ 'firstName': socialUser.firstName || null });
        this.registrationForm.patchValue({ 'lastName': socialUser.lastName || null });
        this.registrationForm.patchValue({ 'email': socialUser.email });
        this.registrationForm.patchValue({ 'ssoClient': socialUser.provider.toUpperCase() });
        this.registrationForm.patchValue({ 'ssoEnabled': true });
        this.registrationForm.patchValue({ 'recaptcha': true });
        this.ssoToken = socialUser.id;

        const autoLoginData: any = {
            username: socialUser.email,
            password: socialUser.id,
            rememberMe: false,
        }

        this.register(autoLoginData);
    }

    ngOnDestroy() {
        const body = document.getElementsByTagName("body")[0];
        body.classList.remove("register-page");
        body.classList.remove("off-canvas-sidebar");
    }

    private _filter(name: string): Country[] {
        const filterValue = name.toLowerCase();

        return this.countryCode.filter(
            (option) => option.name.toLowerCase().indexOf(filterValue) === 0
        );
    }

    private assignSelectedCompany() {
        if (this.selectedCountryDialCode && this.selectedCountryCode) {
            const countryObject = this.countryCode.find(
                (country) => (country.dial_code === this.selectedCountryDialCode && country.code === this.selectedCountryCode)
            );
            if (countryObject) {
                this.countryObject = countryObject;
                return;
            }
        }

        this.countryObject = null;
        this.selectedCountryDialCode = null;
        this.selectedCountryCode = null;
    }
}
