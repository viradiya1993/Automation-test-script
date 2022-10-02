import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA, } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CoreModule } from "@app/core/core.module";
import { SharedModule } from "@app/shared/shared.module";
import {
    BrowserComponent,
    BrowserFormComponent,
    BrowserListComponent,
    EnvironmentFormComponent,
    GridComponent,
    GridFormComponent,
    GridListComponent,
    MenuListComponent,
    MobileAppComponent,
    MobileDeviceComponent,
    SettingsComponent,
} from "./components/";
import { EnvironmentListComponent } from "./components/environment-list/environment-list.component";
import { EnvironmentComponent } from "./components/environment/environment.component";
import { GlobalParametersComponent } from "./components/global-parameters/global-parameters.component";
import { ConfigurationService } from "./services/configuration.service";

export const ConfigurationRoutes: Routes = [
    {
        path: "",
        component: SettingsComponent,
    },
];

@NgModule({
    declarations: [
        SettingsComponent,
        MenuListComponent,
        GlobalParametersComponent,
        EnvironmentComponent,
        EnvironmentFormComponent,
        EnvironmentListComponent,
        BrowserComponent,
        BrowserFormComponent,
        BrowserListComponent,
        GridComponent,
        GridFormComponent,
        GridListComponent,
        MobileDeviceComponent,
        MobileAppComponent,
    ],
    entryComponents: [
        GridFormComponent,
        EnvironmentFormComponent,
        BrowserFormComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        CoreModule,
        RouterModule.forChild(ConfigurationRoutes),
    ],
    exports: [RouterModule],
    providers: [ConfigurationService],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class ConfigurationModule {
}
