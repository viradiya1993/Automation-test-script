import { AfterViewInit, Component, Inject, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import {
    CommonService,
    EnvironmentService,
    GlobalParametersService,
    GridService,
    NotificationService,
    TestBotExecutorService
} from "@app/core/services";
import { BotExecution, CustomProperty, Environment, Grid, TestBot } from "@app/shared/models";
import { forkJoin } from "rxjs";
import { ConfigurationService } from "@content/admin/configuration/services/configuration.service";
import { pairwise, startWith } from "rxjs/operators";
import { EnvironmentFormComponent } from "@content/admin/configuration/components";
import { TestBotFilterService } from "../../services/test-bot-filter.service";
import {
    AhqAgentDownloadDialogComponent
} from '@content/admin/test-script/components/ahq-agent-download-dialog/ahq-agent-download-dialog.component';

@Component({
    selector: "app-test-bot-execution",
    templateUrl: "./test-bot-execution.component.html",
    styleUrls: ["./test-bot-execution.component.scss"]
})
export class TestBotExecutionComponent implements OnInit, AfterViewInit {
    testBot: TestBot;
    testBotExecutionForm: FormGroup;
    environmentPageNo = 0;
    environmentTotalCount = 0;
    environments: Environment[] = [];
    grids: Grid[] = [];
    gridPageNo = 0;
    gridTotalCount = 0;
    resolutions: string[] = [];
    osType: string[] = [];
    browsers: string[] = [];
    browserVersions: string[] = [];

    isLocalGridSelected = true;

    constructor(
        private fb: FormBuilder,
        private testBotExecutorService: TestBotExecutorService,
        private testBotFilterService: TestBotFilterService,
        private gridService: GridService,
        private environmentService: EnvironmentService,
        private globalParametersService: GlobalParametersService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<TestBotExecutionComponent>,
        private notificationService: NotificationService,
        private readonly dialog: MatDialog,
        private readonly configurationService: ConfigurationService,
        public readonly commonService: CommonService
    ) {
        if (data) {
            this.testBot = data.testBot;
        }

        this.testBotExecutionForm = this.fb.group({
            testBotId: ["" || this.testBot.testBotId, Validators.required],
            name: ["", Validators.required],
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
                    const findNewEnv = (res.data || []).find(
                        env => env.name === environment.name
                    );
                    this.getECFormGroup().get("baseUrl").patchValue({ baseUrl: findNewEnv.value });
                });
            }
        );
    }

    ngOnInit() {
        const gps = this.globalParametersService.getGlobalParameters();
        const es = this.environmentService.getEnvironments();
        const gs = this.gridService.getGrids();
 
        forkJoin([gps, es, gs]).subscribe(results => {
            const globalParameters = results[0];
            this.environments = results[1].data;
            this.environmentTotalCount = results[1].totalCount;
            this.grids = results[2].data;
            this.gridTotalCount = results[2].totalCount;

            // tslint:disable-next-line:no-shadowed-variable
            const configurationFG = this.getECFormGroup();

            // set to blank, it gives bowserId which is not used any more
            globalParameters.browser = "";

            configurationFG.patchValue(globalParameters);
            configurationFG.get("gridId").setValue(globalParameters.gridUrl);
            // tslint:disable-next-line:max-line-length
            configurationFG
                .get("baseUrl")
                .setValue(
                    this.environments.find(
                        environment =>
                            environment.environmentId === globalParameters.baseUrl
                    )?.value || ""
                );

            globalParameters.customProperties.forEach(customProperty => {
                this.addCustomPropertyFG(customProperty);
            });
        });

        this.getECFormGroup().patchValue({ type: "Web" });
    }

    ngAfterViewInit() {
        this.getECFormGroup()
            .get("baseUrl")
            .valueChanges.pipe(startWith(null as string), pairwise())
            .subscribe(([prev, next]: [string, string]) => {
                if (next === "createNewEnv") {
                    this.dialog.open(EnvironmentFormComponent);
                    this.getECFormGroup().patchValue({ baseUrl: prev });
                }
            });

        this.getECFormGroup().get("gridId").valueChanges.subscribe(gridId => {
            this.disableControls();
            if (gridId) {
                this.gridService.getPlatforms(gridId).subscribe(platforms => {
                    this.osType = platforms;
                    this.getECFormGroup().patchValue({ osType: platforms[0] });
                });

                this.testBotExecutorService.getIsLocalGrid(gridId).subscribe(isLocalGrid => {
                    this.isLocalGridSelected = !!isLocalGrid.status;
                    if (isLocalGrid.status) {
                        this.getECFormGroup().patchValue({ type: "Web" });
                    }
                });
            }
        });

        this.getECFormGroup().get("osType").valueChanges.subscribe(osType => {
            this.disableControls();
            let gridId = this.getECFormGroup().get("gridId").value;
            if (gridId && osType) {

                const gbbp = this.gridService.getBrowsersByPlatform(gridId, osType);
                const gr = this.gridService.getResolutions(gridId, osType);

                forkJoin([gbbp, gr]).subscribe(results => {
                    this.browsers = results[0];
                    this.resolutions = results[1];
                    this.getECFormGroup().patchValue({ browser: this.browsers[0] });
                    this.getECFormGroup().patchValue({ resolution: this.resolutions[0] });
                });
            }
        });

        this.getECFormGroup().get("browser").valueChanges.subscribe(browser => {
            this.disableControls();
            let gridId = this.getECFormGroup().get("gridId").value;
            let osType = this.getECFormGroup().get("osType").value;
            if (gridId && osType && browser) {
                this.gridService.getVersionsByBrowser(gridId, osType, browser).subscribe(browserVersions => {
                    this.browserVersions = browserVersions;
                    this.getECFormGroup().patchValue({ browserVersion: browserVersions[0] });
                    this.enableControls();
                });
            }
        });

    }

    getECFormGroup() {
        return this.testBotExecutionForm.get("executionConfiguration") as FormGroup;
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
        return configurationFG.controls["customProperties"] as FormArray;
    }

    addCustomPropertyFG(customProperty: CustomProperty) {
        this.getCustomPropertiesFA().push(
            this.fb.group({
                customPropertyId: [
                    customProperty ? customProperty.customPropertyId : ""
                ],
                name: [
                    { value: customProperty ? customProperty.name : "", disabled: true },
                    Validators.required
                ],
                value: [customProperty ? customProperty.value : "", Validators.required]
            })
        );
    }

    removeCustomPropertyFG(index: number) {
        this.getCustomPropertiesFA().removeAt(index);
    }

    onExecuteTestBotClick() {
        const configurationFG = this.getECFormGroup();

        const botExecution: BotExecution = this.testBotExecutionForm.value;
        this.testBotFilterService.appliedFilter.testBot = {
            testBotId: botExecution.testBotId,
            name: botExecution.name,
        };
        this.testBotFilterService.filter();
        this.testBotExecutorService.getIsLocalGrid(configurationFG.get("gridId").value).subscribe(isLocalGrid => {
            this.testBotExecutorService.runTestBot(botExecution, !!isLocalGrid.status).subscribe(result => {
                this.dialogRef.close(result["message"]);
                this.notificationService.showNotification(
                    result["message"],
                    "top"
                );
            }, () => {
                const dialogRef = this.dialog.open(AhqAgentDownloadDialogComponent);
                dialogRef.afterClosed().subscribe(() => {
                });
            });
        }, () => {
            this.notificationService.showNotification(
                "Grid Id is not valid",
                "top"
            )
        });
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
