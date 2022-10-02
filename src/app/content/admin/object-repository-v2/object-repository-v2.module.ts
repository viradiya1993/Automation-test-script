import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA, } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CoreModule } from "@app/core/core.module";
import { SharedModule } from "@app/shared/shared.module";
import { ObjectRepositoryV2Service } from "./services/object-repository-v2.service";
import { WebsiteFormComponent } from '@content/admin/object-repository-v2/components/website-form/website-form.component';
import {
    ObjectRepositoryV2Component
} from '@content/admin/object-repository-v2/components/object-repository-v2/object-repository-v2.component';
import { PageFormComponent } from '@content/admin/object-repository-v2/components/page-form/page-form.component';
import {
    DeleteLocatorDialogComponent
} from '@content/admin/object-repository-v2/components/page-form/delete-locator-dialog/delete-locator-dialog.component';
import { WebsiteListComponent } from '@content/admin/object-repository-v2/components/website-list/website-list.component';
import { FilterComponent } from '@content/admin/object-repository-v2/components/filter/filter.component';

const ObjectRepositoryV2Routes: Routes = [
    {
        path: "",
        component: ObjectRepositoryV2Component,
    },
];

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        CoreModule,
        RouterModule.forChild(ObjectRepositoryV2Routes),
    ],
    exports: [RouterModule, WebsiteFormComponent],
    declarations: [
        ObjectRepositoryV2Component,
        PageFormComponent,
        DeleteLocatorDialogComponent,
        WebsiteListComponent,
        WebsiteFormComponent,
        FilterComponent
    ],
    providers: [ObjectRepositoryV2Service],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class ObjectRepositoryV2Module {
}
