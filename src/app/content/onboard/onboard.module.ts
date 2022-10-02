import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA, } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RegisterService } from "@app/core/services";
import { interceptorProviders } from "@core/interceptors";
import { RoleService } from "@core/services";

import { SharedModule } from "./../../shared/shared.module";
import { OnBoardLayoutComponent } from "./layout/onboard-layout.component";
import { AddProjectComponent } from "./onboarding/add-project/add-project.component";
import { AddUsersComponent } from "./onboarding/add-users/add-users.component";
import { AHQAgentComponent } from "./onboarding/ahq-agent/ahq-agent.component";
import { AHQOverviewComponent } from "./onboarding/ahq-overview/ahq-overview.component";
import { OnBoardingComponent } from "./onboarding/onboarding.component";

const OnBoardRoutes: Routes = [
    {
        path: "",
        component: OnBoardLayoutComponent,
        children: [
            {
                path: "",
                component: OnBoardingComponent,
            },
        ],
    },
];

@NgModule({
    declarations: [
        OnBoardLayoutComponent,
        OnBoardingComponent,
        AddProjectComponent,
        AddUsersComponent,
        AHQAgentComponent,
        AHQOverviewComponent,
    ],
    providers: [...interceptorProviders, RoleService, RegisterService],
    imports: [CommonModule, SharedModule, RouterModule.forChild(OnBoardRoutes)],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class OnboardModule {
    debounceTime;
}
