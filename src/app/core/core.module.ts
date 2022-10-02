import { SharedModule } from "@shared/shared.module";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import {
    CommonService,
    GlobalService,
    LicenseTypeService,
    LocalStorageService,
    LocatorService,
    OrganizationService,
    ProjectService,
    RegisterService,
    RoleService,
    TemplateService,
    TestReportService,
    UserService
} from "@core/services";
import { interceptorProviders } from "@core/interceptors";
import { DatesDiffPipe } from "./pipes/dates-diff.pipe";
import { TestbotFilterPipe } from "./pipes/testbot-filter.pipe";
import { TestSuiteFilterPipe } from "./pipes/test-suite-filter.pipe";

const SERVICES = [
    LocalStorageService,
    RegisterService,
    TemplateService,
    ProjectService,
    OrganizationService,
    RoleService,
    CommonService,
    GlobalService,
    LocatorService,
    UserService,
    TestReportService,
    LicenseTypeService
];

@NgModule({
    imports: [SharedModule],
    declarations: [DatesDiffPipe, TestbotFilterPipe, TestSuiteFilterPipe],
    exports: [DatesDiffPipe, TestbotFilterPipe, TestSuiteFilterPipe],
    providers: [SERVICES, ...interceptorProviders],
    schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
})
export class CoreModule {
}
