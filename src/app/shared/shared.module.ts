import {
    ExistingEmailValidatorDirective,
    ExistingOrganizationValidatorDirective,
    ExistingSubdomainValidatorDirective,
    ExistingUsernameValidatorDirective
} from "@shared/validators";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA, } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { CdkTreeModule } from "@angular/cdk/tree";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { ClipboardModule } from "@angular/cdk/clipboard";
import { SelectDropDownModule } from "ngx-select-dropdown";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatChipsModule } from "@angular/material/chips";
import { MatNativeDateModule, MatRippleModule } from "@angular/material/core";
import { MatDialogModule } from "@angular/material/dialog";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSliderModule } from "@angular/material/slider";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSortModule } from "@angular/material/sort";
import { MatStepperModule } from "@angular/material/stepper";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatTreeModule } from "@angular/material/tree";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { FullscreenOverlayContainer, OverlayContainer, } from "@angular/cdk/overlay";
import { OrderPipe, SlugPipe, SortByPipe } from "./pipes";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { ComingSoonComponent } from "@app/content/admin/coming-soon/coming-soon.component";
import { MatMenuPreventDirective, MatSelectScrollBottomDirective } from "./directives";
import { SearchFieldComponent } from "./components/search-field/search-field.component";
import { MatBadgeModule } from '@angular/material/badge';
import { PasswordStrengthComponent } from '@shared/components/password-strength/password-strength.component';
import { FixedPluginComponent } from '@shared/components/fixed-plugin/fixed-plugin.component';
import { FooterComponent } from '@shared/components/footer/footer.component';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';
import { SidebarComponent } from '@shared/components/sidebar/sidebar.component';
import { TestScriptMenuComponent } from '@shared/components/test-script-menu/test-script-menu.component';
import { ErrorComponent } from '@shared/components/error/error.component';
import { CustomTextBoxComponent } from '@shared/components/custom-text-box/custom-text-box.component';
import { StatusBarComponent } from '@shared/components/status-bar/status-bar.component';
import { MultiValueChipComponent } from '@shared/components/multi-value-chip/multi-value-chip.component';
import { AgGridActionCellRendererComponent } from '@shared/components/ag-grid-action-cell-renderer/ag-grid-action-cell-renderer.component';
import { UnAuthorizedComponent } from '@shared/components/unauthorized/unauthorized.component';
import { UnauthorizedModalComponent } from '@shared/components/unauthorized-modal/unauthorized-modal.component';
import { AddLocatorComponent } from '@shared/components/add-locator/add-locator.component';
import { AddPagesComponent } from '@shared/components/add-pages/add-pages.component';
import { ConfirmComponent } from '@content/confirm/confirm.component';
import { ScreenShotComponent } from '@shared/components/screen-shot/screen-shot.component';
import { AddParametersComponent } from '@shared/components/add-parameters/add-parameters.component';

const MATERIAL_COMPONENTS = [
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatNativeDateModule,
    MatStepperModule,
    CdkTreeModule,
    MatTreeModule,
    SelectDropDownModule,
    DragDropModule,
    ScrollingModule,
    ClipboardModule,
    MatBadgeModule,
];

const COMPONENTS = [
    PasswordStrengthComponent,
    FixedPluginComponent,
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    TestScriptMenuComponent,
    ConfirmComponent,
    ErrorComponent,
    CustomTextBoxComponent,
    StatusBarComponent,
    ComingSoonComponent,
    MultiValueChipComponent,
    AgGridActionCellRendererComponent,
    ScreenShotComponent,
    UnAuthorizedComponent,
    UnauthorizedModalComponent,
    AddLocatorComponent,
    AddPagesComponent,
    SearchFieldComponent,
];

const DIRECTIVES = [
    ExistingUsernameValidatorDirective,
    ExistingEmailValidatorDirective,
    ExistingOrganizationValidatorDirective,
    ExistingSubdomainValidatorDirective,
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: "never" }),
        HttpClientModule,
        MATERIAL_COMPONENTS,
        RouterModule,
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        MATERIAL_COMPONENTS,
        COMPONENTS,
        DIRECTIVES,
        SlugPipe,
        SortByPipe,
        OrderPipe,
        RouterModule,
        MatMenuPreventDirective,
        MatSelectScrollBottomDirective,
    ],
    declarations: [
        COMPONENTS,
        DIRECTIVES,
        SlugPipe,
        SortByPipe,
        OrderPipe,
        MatMenuPreventDirective,
        AddParametersComponent,
        MatSelectScrollBottomDirective,
        // AddLocatorComponent,
        // AddPagesComponent
    ],
    providers: [
        SlugPipe,
        { provide: OverlayContainer, useClass: FullscreenOverlayContainer },
    ],
    schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {
}
