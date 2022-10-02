import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA, } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CoreModule } from "@app/core/core.module";
import { SharedModule } from "@app/shared/shared.module";
import { AuthLayoutComponent } from "./auth-layout.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { LoginComponent } from "./login/login.component";
import { PasswordComponent } from "./password/password.component";
import { RegisterComponent } from "./register/register.component";
import { NgxCaptchaModule } from 'ngx-captcha';

const AuthLayoutRoute: Routes = [
    {
        path: "",
        component: AuthLayoutComponent,
        children: [
            {
                path: "login",
                component: LoginComponent,
            },
            {
                path: "register",
                component: RegisterComponent,
            },
            {
                path: "password",
                component: PasswordComponent,
            },
            {
                path: "forgot-password",
                component: ForgotPasswordComponent,
            },
            {
                path: "",
                redirectTo: "auth/login",
                pathMatch: "full",
            },
        ],
    },
];

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        CoreModule,
        RouterModule.forChild(AuthLayoutRoute),
        NgxCaptchaModule,
    ],
    exports: [RouterModule],
    declarations: [
        AuthLayoutComponent,
        RegisterComponent,
        LoginComponent,
        PasswordComponent,
        ForgotPasswordComponent,
    ],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class AuthLayoutModule {
}
