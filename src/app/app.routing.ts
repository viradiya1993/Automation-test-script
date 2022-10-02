import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { AuthLayoutComponent } from "@content/auth";
import { ConfirmComponent } from "@content/confirm/confirm.component";
import { AuthGuard } from "@core/guards";
import { ErrorComponent } from '@shared/components/error/error.component';

export const AppRoutes: Routes = [
    {
        path: "",
        pathMatch: "full",
        redirectTo: "/dashboard",
    },
    {
        path: "",
        loadChildren: () =>
            import("app/content/admin/admin.module").then((m) => m.AdminModule),
        runGuardsAndResolvers: "always",
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
    },
    {
        path: "auth",
        loadChildren: () =>
            import("app/content/auth/auth-layout.module").then(
                (auth) => auth.AuthLayoutModule
            ),
    },
    {
        path: "onboard",
        loadChildren: () =>
            import("app/content/onboard/onboard.module").then((m) => m.OnboardModule),
    },
    {
        path: "",
        component: AuthLayoutComponent,
        children: [
            {
                path: "confirm",
                component: ConfirmComponent,
            },
            {
                path: "error",
                component: ErrorComponent,
            },
        ],
    },
    // { path: "**", redirectTo: "/coming-soon" },
];

@NgModule({
    imports: [
        RouterModule.forRoot(AppRoutes, {
            preloadingStrategy: PreloadAllModules,
            onSameUrlNavigation: "reload",
            relativeLinkResolution: "legacy",
        }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {
}
