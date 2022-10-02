import { LandingPageComponent } from "./landing-page/landing-page.component";
import { UserInformationComponent } from "./client/user-information/user-information.component";
import { ClientComponent } from "./client/client.component";
import { ClientDetailComponent } from "./client/client-details/client-details.component";
import { SearchApiComponent } from "./search-api/search-api.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { AdminLayoutComponent } from "./admin-layout.component";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ProjectInformationComponent } from "./client/project-information/project-information.component";
import { TestSuiteComponent } from "./test-suite/components/test-suite/test-suite.component";
import { TestBotComponent } from "./test-bot/components/test-bot/test-bot.component";
import { ComingSoonComponent } from "./coming-soon/coming-soon.component";
import { TestResultsComponent } from "./test-results/components/test-results/test-results.component";
import { ReleaseComponent } from "./release/components/release/release.component";
import { LicenseTypesComponent } from "./license-types/components";
import { UpgradePlanComponent } from "./upgrade-plan/components";
import { TestScriptComponent } from '@content/admin/test-script/components/test-script/test-script.component';
import { ErrorComponent } from '@shared/components/error/error.component';
import { UnAuthorizedComponent } from '@shared/components/unauthorized/unauthorized.component';
import { UserScriptComponent } from '@content/admin/user-script/components/user-script/user-script.component';

export const AdminRoutes: Routes = [
    {
        path: "",
        component: AdminLayoutComponent,
        children: [
            {
                path: "operational-dashboard",
                pathMatch: "full",
                component: DashboardComponent,
            },
            {
                path: "search-api",
                component: SearchApiComponent,
            },
            {
                path: "object-repository",
                loadChildren: () =>
                    import("./object-repository-v2/object-repository-v2.module").then(
                        (objectRepositoryV2) => objectRepositoryV2.ObjectRepositoryV2Module
                    ),
            },
            {
                path: "test-script",
                component: TestScriptComponent,
            },
            {
                path: "user-scripts",
                component: UserScriptComponent,
            },
            {
                path: "test-suite",
                component: TestSuiteComponent,
            },
            {
                path: "test-bot",
                component: TestBotComponent,
            },
            {
                path: "license-types",
                component: LicenseTypesComponent,
            },
            {
                path: "upgrade-plan",
                component: UpgradePlanComponent,
            },
            // {
            //   path: "global-parameters",
            //   component: GlobalParametersComponent,
            // },
            // {
            //   path: "environments",
            //   component: EnvironmentComponent,
            // },
            // {
            //   path: "browsers",
            //   component: BrowserComponent,
            // },
            // {
            //   path: "grids",
            //   component: GridComponent,
            // },
            {
                path: "clients",
                component: ClientComponent,
            },
            {
                path: "clients/:id/detail",
                component: ClientDetailComponent,
            },
            {
                path: "projects",
                component: ProjectInformationComponent,
            },
            {
                path: "users",
                component: UserInformationComponent,
            },
            {
                path: "dashboard",
                component: LandingPageComponent,
            },
            {
                path: "coming-soon",
                component: ComingSoonComponent,
            },
            {
                path: "404",
                component: ErrorComponent,
            },
            {
                path: "forbidden",
                component: UnAuthorizedComponent,
            },
            {
                path: "test-results",
                component: TestResultsComponent,
            },
            {
                path: "releases",
                component: ReleaseComponent,
            },
            {
                path: "user-defined-tests",
                component: ComingSoonComponent,
            },
            {
                path: "strategic-dashboard",
                component: ComingSoonComponent,
            },
            {
                path: "dashboard-parameters",
                component: ComingSoonComponent,
            },
            {
                path: "integrations",
                component: ComingSoonComponent,
            },
            {
                path: "projects-and-users",
                loadChildren: () =>
                    import("./project-user/project-user.module").then(
                        (projectUser) => projectUser.ProjectUserModule
                    ),
                runGuardsAndResolvers: "paramsOrQueryParamsChange",
                //
            },
            {
                path: "settings",
                loadChildren: () =>
                    import("./configuration/configuration.module").then(
                        (configuration) => configuration.ConfigurationModule
                    ),
            },
            {
                path: "unauthorized", component: UnAuthorizedComponent
            },
            {
                path: "license-types",
                component: LicenseTypesComponent,
            },
            {
                path: "upgrade-plan",
                component: UpgradePlanComponent,
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(AdminRoutes)],
    exports: [RouterModule],
})
export class AdminRoutingModule {
}
