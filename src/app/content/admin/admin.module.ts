import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA, } from "@angular/core";
import { CoreModule } from "@core/core.module";
import { SharedModule } from "@shared/shared.module";
import { AgGridModule } from "ag-grid-angular";
import { ChartsModule } from "ng2-charts";
import { CronEditorModule } from "ngx-cron-editor";
import { MatTableExporterModule } from 'mat-table-exporter';

import { AdminLayoutComponent } from "./admin-layout.component";
import { AdminRoutingModule } from "./admin.routing";
import { ClientDetailComponent } from "./client/client-details/client-details.component";
import { ClientDialogComponent } from "./client/client-dialog/client-dialog.component";
import { ClientComponent } from "./client/client.component";
import { ProjectInfoDialogComponent } from "./client/project-information/project-information-dialog.component";
import { ProjectInformationComponent } from "./client/project-information/project-information.component";
import { UserDetailsComponent } from "./client/project-information/user-details/user-details.component";
import { SystemInformationComponent } from "./client/system-information/system-information.component";
import { InviteUserComponent } from "./client/user-information/invite-user/invite-user-dialog.component";
import { UserInfoDialogComponent } from "./client/user-information/user-information-dialog.component";
import { UserInformationComponent } from "./client/user-information/user-information.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { LandingPageComponent } from "./landing-page/landing-page.component";
import { VideoDialogComponent } from "./landing-page/video-dialog.component";
import { ReleaseAppliedFiltersComponent } from "./release/components/release-applied-filters/release-applied-filters.component";
import { ReleaseDetailsComponent } from "./release/components/release-details/release-details.component";
import { ReleaseFormComponent } from "./release/components/release-form/release-form.component";
import { ReleaseListComponent } from "./release/components/release-list/release-list.component";
import { ReleaseRunFilterFormComponent } from "./release/components/release-run-filter-form/release-run-filter-form.component";
import { ReleaseRunFormComponent } from "./release/components/release-run-form/release-run-form.component";
import { ReleaseComponent } from "./release/components/release/release.component";
import { TestRunListComponent } from "./release/components/test-run-list/test-run-list.component";
import { ReleaseFilterService } from "./release/services/release-filter.service";
import { SearchApiComponent } from "./search-api/search-api.component";

import { TestBotComponent } from "./test-bot/components/test-bot/test-bot.component";
import { TestBotDetailsComponent } from "./test-bot/components/test-bot-details/test-bot-details.component";
//import { TestResultsComponent } from './test-bot/components/test-results/test-results.component';
import { TestBotListComponent } from "./test-bot/components/test-bot-list/test-bot-list.component";

import { IterationResultComponent } from "./test-results/components/iteration-result/iteration-result.component";
import { TestExecutionComponent } from "./test-results/components/test-execution/test-execution.component";
import { TestResultsComponent } from "./test-results/components/test-results/test-results.component";
import { TestScriptResultComponent } from "./test-results/components/test-script-result/test-script-result.component";
import { TestSuiteResultComponent } from "./test-results/components/test-suite-result/test-suite-result.component";
import { LocatorComponent } from "./test-script-pages/locator/locator.component";
import { TestScriptPagesComponent } from "./test-script-pages/test-script-pages.component";
import { TemplateFilterPipe } from "./test-script/pipes";
import { DialogService } from "./test-script/services/dialog.service";
import { SchedulerDialogService } from "./scheduler/services/scheduler-dialog.service";
import { FilterService } from "./test-script/services/filter.service";
import { TestScriptHandlerService } from "./test-script/services/test-script-handler.service";
import { TestSuiteDetailsComponent } from './test-suite/components/test-suite-details/test-suite-details.component';
import { TestSuiteFormComponent } from "./test-suite/components/test-suite-form/test-suite-form.component";
import { TestSuiteListComponent } from "./test-suite/components/test-suite-list/test-suite-list.component";
import { TestSuiteComponent } from "./test-suite/components/test-suite/test-suite.component";
import { TestExecutionDetailsComponent } from "./test-results/components/test-execution-details/test-execution-details.component";
import { TestBotFormComponent } from "./test-bot/components/test-bot-form/test-bot-form.component";
import { TestBotFilterService } from "./test-bot/services/test-bot-filter.service";
//import { TestBotAppliedFiltersComponent } from "./test-bot/components/test-bot-applied-filters/test-bot-applied-filters.component";
import { SchedulerFormComponent } from "./scheduler/components/scheduler-form/scheduler-form.component";
import { SchedulerListComponent } from "./scheduler/components/scheduler-list/scheduler-list.component";
import { SchedulerComponent } from "./scheduler/components/scheduler/scheduler.component";
import { SchedulerDeleteDialogComponent } from "./scheduler/components/scheduler-delete-dialog/scheduler-delete-dialog.component";
import { TestBotExecutionComponent } from "./test-bot/components/test-bot-execution/test-bot-execution.component";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { ObjectRepositoryV2Module } from '@content/admin/object-repository-v2/object-repository-v2.module';
import { UpgradePlanComponent } from "./upgrade-plan/components";
import { LicenseTypesComponent } from "./license-types/components";

import { EpicListComponent } from '@content/admin/test-script/components/epic-list/epic-list.component';
import { EpicFormComponent } from '@content/admin/test-script/components/epic-form/epic-form.component';
import { StoryFormComponent } from '@content/admin/test-script/components/story-form/story-form.component';
import { TestScriptComponent } from '@content/admin/test-script/components/test-script/test-script.component';
import { TestScriptFormComponent } from '@content/admin/test-script/components/test-script-form/test-script-form.component';
import { TestScriptOptionsComponent } from '@content/admin/test-script/components/test-script-options/test-script-options.component';
import { StoryListComponent } from '@content/admin/test-script/components/story-list/story-list.component';
import { TestScriptExecutionComponent } from '@content/admin/test-script/components/test-script-execution/test-script-execution.component';
import { TestStepFormComponent } from '@content/admin/test-script/components/test-step-form/test-step-form.component';
import { TestScriptListComponent } from '@content/admin/test-script/components/test-script-list/test-script-list.component';
import { AppliedFiltersComponent } from '@content/admin/test-script/components/applied-filters/applied-filters.component';
import { FilterFormComponent } from '@content/admin/test-script/components/filter-form/filter-form.component';
import { DeleteDialogComponent } from '@content/admin/test-script/components/delete-dialog/delete-dialog.component';
import { AhqAgentDownloadComponent } from '@content/admin/test-script/components/ahq-agent-download/ahq-agent-download.component';
import {
    AhqAgentDownloadDialogComponent
} from '@content/admin/test-script/components/ahq-agent-download-dialog/ahq-agent-download-dialog.component';
import { AgGridActionCellRendererComponent } from '@shared/components/ag-grid-action-cell-renderer/ag-grid-action-cell-renderer.component';
import { ScreenShotComponent } from '@shared/components/screen-shot/screen-shot.component';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { EditUserScriptComponent } from './user-script/components/edit-user-script/edit-user-script.component';
import { UserScriptComponent } from '@content/admin/user-script/components/user-script/user-script.component';
import { CustomParmasComponent } from '@content/admin/user-script/components/custom-parmas/custom-parmas.component';
import { ImportConfigurationComponent } from '@content/admin/user-script/components/import-configuration/import-configuration.component';

@NgModule({
    declarations: [
        DashboardComponent,
        AdminLayoutComponent,
        SearchApiComponent,
        TestScriptPagesComponent,
        LocatorComponent,
        ClientComponent,
        ClientDetailComponent,
        UserInformationComponent,
        LandingPageComponent,
        ProjectInformationComponent,
        SystemInformationComponent,
        UserInfoDialogComponent,
        VideoDialogComponent,
        InviteUserComponent,
        ProjectInfoDialogComponent,
        ClientDialogComponent,
        UserDetailsComponent,
        EpicListComponent,
        EpicFormComponent,
        StoryFormComponent,
        TemplateFilterPipe,
        TestSuiteComponent,
        TestSuiteDetailsComponent,
        TestSuiteFormComponent,
        TestSuiteListComponent,
        TestBotComponent,
        TestBotListComponent,
        TestBotDetailsComponent,
        TestResultsComponent,
        TestExecutionComponent,
        TestSuiteResultComponent,
        TestResultsComponent,
        TestExecutionComponent,
        TestSuiteResultComponent,
        TestScriptResultComponent,
        IterationResultComponent,
        TestScriptComponent,
        TestScriptFormComponent,
        TestScriptOptionsComponent,
        StoryListComponent,
        TestScriptExecutionComponent,
        TestStepFormComponent,
        TestScriptListComponent,
        AppliedFiltersComponent,
        FilterFormComponent,
        DeleteDialogComponent,
        AhqAgentDownloadComponent,
        AhqAgentDownloadDialogComponent,
        ReleaseComponent,
        ReleaseListComponent,
        ReleaseDetailsComponent,
        TestRunListComponent,
        ReleaseFormComponent,
        ReleaseAppliedFiltersComponent,
        ReleaseRunFormComponent,
        ReleaseRunFilterFormComponent,
        TestExecutionDetailsComponent,
        TestBotFormComponent,
        TestBotExecutionComponent,
        // TestBotAppliedFiltersComponent,
        SchedulerFormComponent,
        SchedulerListComponent,
        SchedulerComponent,
        SchedulerDeleteDialogComponent,
        UserScriptComponent,
        EditUserScriptComponent,
        CustomParmasComponent,
        ImportConfigurationComponent,
        LicenseTypesComponent,
        UpgradePlanComponent,
        EditUserScriptComponent,
    ],
    imports: [
        CoreModule,
        SharedModule,
        AdminRoutingModule,
        AgGridModule.withComponents([AgGridActionCellRendererComponent]),
        ChartsModule,
        CronEditorModule,
        MatTableExporterModule,
        ObjectRepositoryV2Module,
        ShareButtonsModule,
        ShareIconsModule,
    ],
    entryComponents: [
        UserInfoDialogComponent,
        VideoDialogComponent,
        ProjectInfoDialogComponent,
        ClientDialogComponent,
        UserDetailsComponent,
        InviteUserComponent,
        TestBotFormComponent,
        TestExecutionDetailsComponent,
        TestSuiteResultComponent,
        TestScriptResultComponent,
        IterationResultComponent,
        EpicFormComponent,
        StoryFormComponent,
        TestScriptFormComponent,
        TestScriptExecutionComponent,
        TestBotExecutionComponent,
        AgGridActionCellRendererComponent,
        ScreenShotComponent,
    ],
    providers: [
        DialogService,
        FilterService,
        ReleaseFilterService,
        TestBotFilterService,
        TestScriptHandlerService,
        SchedulerDialogService,
        {
            provide: 'canActivateTeam',
            useValue: (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => true
        }
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    exports: [
        VideoDialogComponent
    ]
})
export class AdminModule {
}
