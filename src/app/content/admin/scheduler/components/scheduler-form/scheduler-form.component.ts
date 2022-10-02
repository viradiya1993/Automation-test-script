import { COMMA, ENTER, SEMICOLON } from '@angular/cdk/keycodes';
import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import {
    CommonService,
    EnvironmentService,
    GlobalParametersService,
    GridService,
    SchedulerService
} from '@app/core/services';
import { CustomProperty, Environment, Grid, Scheduler } from '@app/shared/models';
import * as _ from "lodash";
import { CronOptions } from 'ngx-cron-editor';
import { forkJoin } from 'rxjs';
import { pairwise, startWith, map } from 'rxjs/operators';
import { ConfigurationService } from '@content/admin/configuration/services/configuration.service';
import { EnvironmentFormComponent } from '@content/admin/configuration/components';

@Component({
    selector: 'app-scheduler-form',
    templateUrl: './scheduler-form.component.html',
    styleUrls: ['./scheduler-form.component.scss']
})
export class SchedulerFormComponent implements OnInit, AfterViewInit {
    environments: Environment[] = [];
    environmentTotalCount = 0;
    environmentPageNo = 0;
    browsers: string[] = [];
    browserPageNo = 0;
    browserTotalCount = 0;
    grids: Grid[] = [];
    gridPageNo = 0;
    gridTotalCount = 0;

    osTypes: string[] = [];
    resolutions: string[] = [];
    browserVersions: string[] = [];

    isLocalGridSelected = true;

    removable = true;
    schedulerForm: FormGroup;
    scheduler: Scheduler;
    public separatorKeysCodes = [ENTER, COMMA, SEMICOLON];

    public cronOptions: CronOptions = {
        defaultTime: "00:00:00",

        hideMinutesTab: false,
        hideHourlyTab: false,
        hideDailyTab: false,
        hideWeeklyTab: false,
        hideMonthlyTab: false,
        hideYearlyTab: false,
        hideAdvancedTab: true,
        hideSpecificWeekDayTab: false,
        hideSpecificMonthWeekTab: false,

        use24HourTime: true,
        hideSeconds: false,

        cronFlavor: "standard" // standard or quartz
    };

    constructor(
        private fb: FormBuilder,
        private schedulerService: SchedulerService,
        private gridService: GridService,
        private environmentService: EnvironmentService,
        private globalParametersService: GlobalParametersService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private readonly dialog: MatDialog,
        private readonly configurationService: ConfigurationService,
        public commonService: CommonService
    ) {
        if (this.data) {
            this.scheduler = data.scheduler;
        }

        this.schedulerForm = this.fb.group({
            name: [this.scheduler?.name, Validators.required],
            emails: new FormControl(
                this.scheduler?.emails || [],
                [this.requiredArrayValidator(), this.emailArrayValidator(), this.patternValidator()]
            ),
            recurringRule: [this.scheduler?.recurringRule || "", Validators.required],
            active: [true],
            resourceId: this.scheduler?.resourceId || null,
            resourceType: this.scheduler?.resourceType || 1,
            executionConfiguration: this.fb.group({
                baseUrl: '',
                browser: ["", Validators.required],
                browserVersion: ["", Validators.required],
                resolution: ["", Validators.required],
                gridId: ["", Validators.required],
                type: 'Web',
                osType: ["", Validators.required],
                screenshotAfterEachStep: new FormControl({
                    value: false,
                    disabled: !!this.commonService.getUpgradeRequire()
                }),
                screenshotOnError: new FormControl({
                    value: false,
                    disabled: !!this.commonService.getUpgradeRequire()
                }),
                screenshotOnFinish: false,
                closeBrowserAfterEachExecution: false,
                timeout: 0,
                waitForElementTimeout: 0,
                customProperties: this.fb.array([])
            })
        });

        this.configurationService.environmentCreatedObs.subscribe(
            ({ environment }) => {
                this.environmentPageNo = 0;
                this.environmentService.getEnvironments(
                    'name',
                    'asc',
                    this.environmentPageNo
                ).subscribe(res => {
                    this.environmentTotalCount = res.totalCount;
                    this.environments = res.data;
                    const findNewEnv = (res.data || []).find(env => env.name === environment.name);
                    this.getECFormGroup().get("baseUrl").patchValue({ baseUrl: findNewEnv.value });
                });
            }
        );
    }

    get f() {
        return this.schedulerForm.controls
    }

    ngOnInit(): void {

        const es = this.environmentService.getEnvironments();
        const gs = this.gridService.getGrids();

        forkJoin([es, gs]).subscribe(results => {

            this.grids = results[1].data;
            this.environments = results[0].data;

            if (this.scheduler.schedulerId) {
                const gp = this.getPlatforms(this.scheduler?.executionConfiguration?.gridId);
                const gbp = this.getBrowsersByPlatform(this.scheduler?.executionConfiguration?.gridId, this.scheduler?.executionConfiguration?.osType);
                const gr = this.getResolutions(this.scheduler?.executionConfiguration?.gridId, this.scheduler?.executionConfiguration?.osType);
                const gvb = this.getVersionsByBrowser(this.scheduler?.executionConfiguration?.gridId, this.scheduler?.executionConfiguration?.osType, this.scheduler?.executionConfiguration?.browser);

                forkJoin([gp, gbp, gr, gvb]).subscribe(res => {
                    this.schedulerForm.patchValue(this.scheduler, {emitEvent: false});
                    this.scheduler?.executionConfiguration?.customProperties.forEach((customProperty) => {
                        this.addCustomPropertyFG(customProperty);
                    });
                });
            } else {
                this.globalParametersService.getGlobalParameters().subscribe(globalParameters => {
                    this.getECFormGroup().patchValue(globalParameters);
                    this.getECFormGroup().get("gridId").setValue(globalParameters.gridUrl);
                    this.getECFormGroup().get("baseUrl").setValue(this.environments.find(environment => environment.environmentId === globalParameters.baseUrl).value || "");
                    globalParameters.customProperties.forEach((customProperty) => {
                        this.addCustomPropertyFG(customProperty);
                    });
                });
            }
        });
    }

    ngAfterViewInit() {
        this.getECFormGroup().get('baseUrl')
            .valueChanges.pipe(startWith(null as string), pairwise())
            .subscribe(([prev, next]: [string, string]) => {
                if (next === 'createNewEnv') {
                    this.dialog.open(EnvironmentFormComponent);
                    this.getECFormGroup().patchValue({ 'baseUrl': prev });
                }
            });
        this.getECFormGroup().get("gridId").valueChanges.subscribe(gridId => {
            this.disableControls();
            if (gridId) {
                this.getPlatforms(gridId).subscribe(platforms => {
                    this.getECFormGroup().patchValue({ osType: platforms[0] });
                });

                this.schedulerService.getIsLocalGrid(gridId).subscribe(isLocalGrid => {
                    this.isLocalGridSelected = !!isLocalGrid.status;
                    if (isLocalGrid.status) {
                        this.getECFormGroup().patchValue({ osType: this.osTypes[0] });
                        this.getECFormGroup().patchValue({ type: "Web" });
                    }
                });
            }
        });

        this.getECFormGroup().get("osType").valueChanges.subscribe(osType => {
            this.disableControls();
            let gridId = this.getECFormGroup().get("gridId").value;

            if (gridId && osType) {
                this.getBrowsersByPlatform(gridId, osType).subscribe(browsers => {
                    this.getECFormGroup().patchValue({ browser: browsers[0] });
                });

                this.getResolutions(gridId, osType).subscribe(resolutions => {
                    this.getECFormGroup().patchValue({ resolution: resolutions[0] });
                });
            }
        });

        this.getECFormGroup().get("browser").valueChanges.subscribe(browser => {
            this.disableControls();
            let gridId = this.getECFormGroup().get("gridId").value;
            let osType = this.getECFormGroup().get("osType").value;
 
            if (gridId && osType && browser) {
                this.getVersionsByBrowser(gridId, osType, browser).subscribe(browserVersions => {
                    this.getECFormGroup().patchValue({ browserVersion: browserVersions[0] });
                    this.enableControls();
                });
            }
        });
    }

    getPlatforms(gridId: string) {
        return this.gridService.getPlatforms(gridId).pipe(
            map(platforms => {
                this.osTypes = platforms;
                return platforms;
            })
        );
    }

    getVersionsByBrowser(gridId: string, osType: string, browser: string) {
        return this.gridService.getVersionsByBrowser(gridId, osType, browser).pipe(
            map(browserVersions => {
                this.browserVersions = browserVersions;
                return browserVersions;
            })
        );
    }

    getBrowsersByPlatform(gridId: string, osType: string) {
        return this.gridService.getBrowsersByPlatform(gridId, osType).pipe(
            map(browsers => {
                this.browsers = browsers;
                return browsers;
            })
        );
    }

    getResolutions(gridId: string, osType: string) {
        return this.gridService.getResolutions(gridId, osType).pipe(
            map(resolutions => {
                this.resolutions = resolutions;
                return resolutions;
            })
        );
    }

    paste(event: ClipboardEvent): void {
        const formControl: AbstractControl = this.schedulerForm.get('emails');
        event.preventDefault();
        event.clipboardData
            .getData('Text')
            .split(/;|,|\n/)
            .forEach(value => {
                if (value.trim()) {
                    if (value && _.isArray(formControl.value)
                        && [...formControl.value].findIndex((val) => val === value) === -1, { invalid: false }) {
                        formControl.setValue([...formControl.value, value]);
                    }
                }
            })
    }

    public addEmailAddress(event: MatChipInputEvent): void {
        const formControl: AbstractControl = this.schedulerForm.get('emails');
        const input: HTMLInputElement = event.input;
        const value: string = (event.value || '').trim();
        if (value && _.isArray(formControl.value) && [...formControl.value].findIndex((val) => val === value) === -1) {
            formControl.setValue([...formControl.value, value]);
        }
        formControl.updateValueAndValidity();

        if (input) {
            input.value = '';
        }
    }

    public removeEmailAddress(selectedEmail: string): void {
        const formControl: AbstractControl = this.schedulerForm.get('emails');
        const value: string[] = formControl.value.filter(
            (email: string) => email !== selectedEmail
        );
        formControl.setValue(value);
        formControl.updateValueAndValidity();
    }

    onSchedulerSaveClick() {
        const scheduler = { ...this.schedulerForm.value };
        const otherKeys = Object.keys(this.scheduler).filter(key => Object.keys(this.schedulerForm.value).indexOf(key) === -1);
        otherKeys.forEach(key => {
            scheduler[key] = this.scheduler[key];
        });
        if (scheduler.schedulerId) {
            this.schedulerService.updateScheduler(scheduler).subscribe(() => {
                this.resetSchedulerForm();
                this.schedulerService.filter();
            });
        } else {
            this.schedulerService.addScheduler(scheduler).subscribe(() => {
                this.resetSchedulerForm();
                this.schedulerService.filter();
            });
        }
    }

    onSchedulerCancelClick() {
        // console.log("onSchedulerCancelClick");
    }

    resetSchedulerForm() {
        this.schedulerForm.reset();
        this.schedulerForm.setControl('emails', new FormControl([], [this.requiredArrayValidator(), this.emailArrayValidator()]));
        this.scheduler = undefined;
    }

    emailArrayValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            let isPassed = true;
            if (Array.isArray(control.value)) {
                for (const email of control.value) {
                    const innerControl: FormControl = new FormControl(
                        email,
                        Validators.email
                    );
                    if (innerControl.errors && innerControl.errors.email) {
                        isPassed = false;
                        break;
                    }
                }
            } else {
                isPassed = false;
            }

            return isPassed ? null : { emailArray: true };
        };
    }

    requiredArrayValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const isPassed: boolean = Array.isArray(control.value) && control.value.length > 0;
            return isPassed ? null : { required: true };
        };
    }

    patternValidator(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            if (!control.value) {
                return null;
            }
            const regex = new RegExp(/^([\w+-.%]+@[\w-.]+\.[A-Za-z]{2,4},?)+$/);
            const valid = regex.test(control.value);
            return valid ? null : { invalid: true };
        };
    }

    getECFormGroup() {
        return this.schedulerForm.get("executionConfiguration") as FormGroup;
    }

    enableControls() {
        this.getECFormGroup().get("gridId").enable({ emitEvent: false });
        this.getECFormGroup().get("osType").enable({ emitEvent: false });
        this.getECFormGroup().get("resolution").enable({ emitEvent: false });
        this.getECFormGroup().get("browser").enable({ emitEvent: false });
        this.getECFormGroup().get("browserVersion").enable({ emitEvent: false });
    }

    disableControls() {
        this.getECFormGroup().get("gridId").disable({ emitEvent: false });
        this.getECFormGroup().get("osType").disable({ emitEvent: false });
        this.getECFormGroup().get("resolution").disable({ emitEvent: false });
        this.getECFormGroup().get("browser").disable({ emitEvent: false });
        this.getECFormGroup().get("browserVersion").disable({ emitEvent: false });
    }

    getCustomPropertiesFA() {
        const configurationFG = this.getECFormGroup();
        return configurationFG.controls['customProperties'] as FormArray;
    }

    addCustomPropertyFG(customProperty: CustomProperty) {
        this.getCustomPropertiesFA().push(
            this.fb.group({
                customPropertyId: [customProperty ? customProperty.customPropertyId : ''],
                name: [{ value: customProperty ? customProperty.name : '', disabled: true }, Validators.required],
                value: [customProperty ? customProperty.value : '', Validators.required]
            })
        );
    }

    removeCustomPropertyFG(index: number) {
        this.getCustomPropertiesFA().removeAt(index);
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
