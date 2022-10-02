import { AfterViewInit, Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Browser, CustomProperty, Environment, GlobalParameters, Grid } from '@app/shared/models';
import {
    BrowserService,
    CommonService,
    EnvironmentService,
    GlobalParametersService,
    GridService,
    NotificationService
} from '@app/core/services';
import { EnvironmentFormComponent } from '@content/admin/configuration/components';
import { MatDialog } from '@angular/material/dialog';
import { ConfigurationService } from '@content/admin/configuration/services/configuration.service';
import { pairwise, startWith } from 'rxjs/operators';

@Component({
    selector: 'app-global-parameters',
    templateUrl: './global-parameters.component.html',
    styleUrls: ['./global-parameters.component.scss']
})
export class GlobalParametersComponent implements AfterViewInit {
    environmentPageNo = 0;
    environmentTotalCount = 0;
    environments: Environment[] = [];

    browserPageNo = 0;
    browserTotalCount = 0;
    browsers: Browser[] = [];
    gridPageNo = 0;
    gridTotalCount = 0;
    grids: Grid[] = [];

    globalParameters: GlobalParameters;
    globalParametersForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private environmentService: EnvironmentService,
        private browserService: BrowserService,
        private notificationService: NotificationService,
        private globalParametersService: GlobalParametersService,
        private gridService: GridService,
        private readonly dialog: MatDialog,
        private readonly configurationService: ConfigurationService,
        public readonly commonService: CommonService
    ) {

        this.environmentService.getEnvironments().subscribe(res => {
            this.environments = res.data;
        });

        this.browserService.getBrowsers().subscribe(res => {
            this.browsers = res.data;
        });

        this.gridService.getGrids().subscribe(res => {
            this.grids = res.data;
        });
        this.configurationService.environmentCreatedObs.subscribe(({ environment }) => {
            this.environmentService.getEnvironments(
                'name',
                'asc',
                this.environmentPageNo
            ).subscribe(res => {
                this.environmentTotalCount = res.totalCount;
                this.environments = res.data;
                const findNewEnv = (res.data || []).find(env => env.name === environment.name);
                this.globalParametersForm.patchValue({ 'baseUrl': findNewEnv.environmentId });
            });
        })

        this.globalParametersForm = this.fb.group({
            baseUrl: ['', Validators.required],
            browser: ['', Validators.required],
            gridUrl: ['', Validators.required],
            type: new FormControl({
                value: !this.commonService.isUserPaid() ? 'Web' : '',
                disabled: !this.commonService.isUserPaid()
            }, Validators.required),
            screenshotAfterEachStep: [false, Validators.required],
            screenshotOnError: [true, Validators.required],
            screenshotOnFinish: [true, Validators.required],
            closeBrowserAfterEachExecution: [true, Validators.required],
            timeout: [0, Validators.required],
            waitForElementTimeout: [0, Validators.required],
            customProperties: this.fb.array([])
        });

    }

    ngAfterViewInit() {
        this.globalParametersService.getGlobalParameters().subscribe(globalParameters => {
            this.globalParameters = globalParameters;
            this.globalParametersForm.patchValue(this.globalParameters);
            this.globalParameters.customProperties.forEach((customProperty) => {
                this.addCustomPropertyFG(customProperty);
            });
        });

        this.globalParametersForm.controls['baseUrl']
            .valueChanges.pipe(startWith(null as string), pairwise())
            .subscribe(([prev, next]: [string, string]) => {
                if (next === 'createNewEnv') {
                    this.dialog.open(EnvironmentFormComponent);
                    this.globalParametersForm.patchValue({ 'baseUrl': prev });
                }
            })
    }

    getCustomPropertiesFA() {
        return this.globalParametersForm.get('customProperties') as FormArray;
    }

    addCustomPropertyFG(customProperty: CustomProperty) {
        this.getCustomPropertiesFA().push(
            this.fb.group({
                customPropertyId: [customProperty ? customProperty.customPropertyId : ''],
                name: [customProperty ? customProperty.name : '', Validators.required],
                value: [customProperty ? customProperty.value : '', Validators.required]
            })
        );
    }

    removeCustomPropertyFG(index: number) {
        this.getCustomPropertiesFA().removeAt(index);
    }

    onGlobalParametersSaveClick() {
        this.globalParameters = { ...this.globalParameters, ...this.globalParametersForm.value };

        if (this.globalParameters.globalParameterId) {
            this.globalParametersService.updateGlobalParameters(this.globalParameters).subscribe(res => {
                this.notificationService.showNotification('Global Parameters saved successfully', 'top');
            });
        } else {
            this.globalParametersService.addGlobalParameters(this.globalParameters).subscribe(res => {
                this.notificationService.showNotification('Global Parameters saved successfully', 'top');
            });
        }
    }

    loadNextEnvironments() {
        if (this.environments.length < this.environmentTotalCount) {
            this.environmentPageNo += 1;
            this.environmentService.getEnvironments(
                'name',
                'asc',
                this.environmentPageNo
            ).subscribe(res => {
                this.environmentTotalCount = res.totalCount;
                this.environments.push(...res.data);
            })
        }
    }

    loadNextBrowsers() {
        if (this.browsers.length < this.browserTotalCount) {
            this.browserPageNo += 1;
            this.browserService.getBrowsers(
                'name',
                'asc',
                this.browserPageNo
            ).subscribe(res => {
                this.browserTotalCount = res.totalCount;
                this.browsers.push(...res.data);
            })
        }
    }

    loadNextGrids() {
        if (this.grids.length < this.gridTotalCount) {
            this.gridPageNo += 1;
            this.gridService.getGrids(
                'name',
                'asc',
                this.gridPageNo
            ).subscribe(res => {
                this.gridTotalCount = res.totalCount;
                this.grids.push(...res.data);
            })
        }
    }
}
