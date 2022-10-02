import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
    GlobalParametersService,
    NotificationService,
    PageService,
    TemplateService,
    UserScriptService,
    WebsiteService
} from '@app/core/services';
import { Status } from '@app/shared/enums';
import { Locator, NameValuePair, Page, Params, Template, TestScript, TestStep, ValueType, Website } from '@app/shared/models';
import { CommonObjects } from '@app/shared/models/user-script.model';
import { FormArrayValidators } from '@app/shared/validators';

import * as _ from 'lodash';
import { CustomParmasComponent } from '@content/admin/user-script/components/custom-parmas/custom-parmas.component';
import { ImportConfigurationComponent } from '@content/admin/user-script/components/import-configuration/import-configuration.component';
import { pairwise } from 'rxjs/operators';

@Component({
    selector: 'app-edit-user-script',
    templateUrl: './edit-user-script.component.html',
    styleUrls: ['./edit-user-script.component.scss']
})
export class EditUserScriptComponent implements OnInit {
    userScriptForm: FormGroup;
    commonObject: CommonObjects;
    scriptRemove: CommonObjects;
    websites: Website[] = [];
    templates: Template[] = [];
    templateTypes: string[] = [];
    pages: Page[] = [];
    columnsToDisplay: string[] = ["select_ahq_2021", "action_ahq_2021"];
    rowData = [];
    globalParameters: NameValuePair[] = [];
    searchTextPS: string;
    selectTemplateType: string;
    currentIndex: number;
    commonObjects = [];
    commonFunctionType = [
        {
            value: "STRING+0",
            type: "String"
        },
        {
            value: "INTEGER+0",
            type: "Integer"
        },
        {
            value: "FLOAT+0",
            type: "Float"
        },
        {
            value: "LONG+0",
            type: "Long"
        }
    ]

    userscriptId = null;
    getValidParametersFormArray: FormArray;

    @Output() reFetch = new EventEmitter<boolean>();

    constructor(
        public dialog: MatDialog,
        private fb: FormBuilder,
        private websiteService: WebsiteService,
        private pageService: PageService,
        private userScript: UserScriptService,
        private notificationService: NotificationService,
        private templateService: TemplateService,
        private globalParametersService: GlobalParametersService,
    ) {
    }

    @Input('userscriptId') set patchUserScript(userscriptId) {
        this.userscriptId = userscriptId;
        this.init();
        if (userscriptId) {
            this.userScript.getCommonFunctionId(this.userscriptId).subscribe((userScript: any) => {
                this.commonObject = userScript;
                this.userScriptForm.patchValue(this.commonObject);
                this.commonObject.parameters.forEach((element, index) => {
                    this.getParametersFormArray().insert(index, this.fb.group({
                        name: [element.name, Validators.required],
                        type: [element.type, Validators.required],
                        array: [element.array],
                    }));
                    this.getParametersFormArray().removeAt(index + 1);
                });

                let columnNames = [];
                if (this.commonObject.testSteps.length !== 0) {
                    this.commonObject.testSteps.forEach((testStep, index) => {
                        this.addTestStep(index, testStep);
                        columnNames = columnNames.concat(this.getColumnsfromParams(testStep.params));
                    });
                }
            });
        }
    }

    ngOnInit(): void {
        this.init();
    }

    init() {
        this.userScriptForm = this.fb.group({
            name: ["", Validators.required],
            description: ["", Validators.required],
            status: ["", Validators.required],
            websiteId: ["", Validators.required],
            parameters: this.fb.array([this.setParamsGroup()]),
            returnType: this.fb.group({
                type: ["", Validators.required],
                array: [""],
            }),
            testSteps: this.fb.array([], FormArrayValidators.minLength(1))
        });
        this.globalParametersService
            .getGlobalParametersByName("config.")
            .subscribe((globalParameters) => {
                this.globalParameters = globalParameters;
            })

        this.userScriptForm.get("websiteId").valueChanges.subscribe(websiteId => {
            if (websiteId) {
                this.getCommonOject(websiteId);
                this.pageService.getPagesByWebsiteId(websiteId).subscribe(pages => {
                    this.pages = pages;
                    this.commonObject?.testSteps?.forEach(testStep => {
                        this.addDeletedLocator(testStep);
                    });
                });
            }
        });
        this.getWebsites();
        this.getTemplete();
    }

    getWebsites() {
        this.websiteService.getWebsites(0).subscribe((websites: any) => {
            if (websites) {
                this.websites = websites;
            }
        });
    }

    getTemplete() {
        this.templateService.getTemplatesByTitle("").subscribe((templatesRes: any) => {
            if (templatesRes) {
                this.templates = templatesRes;
                this.templateTypes = _.map(_.uniqBy(this.templates, "type"), "type");
            }
        });
    }

    getCommonOject(websiteId: string) {
        this.userScript.getCommonObject(websiteId).subscribe((res: any) => {
            this.commonObjects = res.content.map((i) => {
                i.id = i.commonObjectId + '+' + '1';
                return i
            });
        });
    }

    getControls(frmGrp: FormGroup, key: string) {
        return (<FormArray>frmGrp.controls[key]).controls;
    }

    drop(event: CdkDragDrop<any[]>) {
        if (event.previousContainer === event.container) {
            const dir = event.currentIndex > event.previousIndex ? 1 : -1;
            const from = event.previousIndex;
            const to = event.currentIndex;
            const testStepFormArray = <FormArray>(
                this.userScriptForm.controls["testSteps"]
            );
            const temp = testStepFormArray.at(from);
            for (let i = from; i * dir < to * dir; i = i + dir) {
                const current = testStepFormArray.at(i + dir);
                testStepFormArray.setControl(i, current);
            }
            testStepFormArray.setControl(to, temp);
        } else {
            const template = event.previousContainer.data[
                event.previousIndex
                ] as Template;
            const testStep: TestStep = {
                testStepId: "",
                templateId: template.templateId,
                templateTitle: template.templateTitle,
                breakpoint: false,
                // status: Status.Pending,
                status: Status.Pending,
                sequence: 0,
                params: {
                    number: {
                        type: ValueType.Undefined,
                        value: ""
                    },
                    xPos: {
                        type: ValueType.Undefined,
                        value: ""
                    },
                    yPos: {
                        type: ValueType.Undefined,
                        value: ""
                    },
                    height: {
                        type: ValueType.Undefined,
                        value: ""
                    },
                    width: {
                        type: ValueType.Undefined,
                        value: ""
                    },
                    text: {
                        type: ValueType.Undefined,
                        value: ""
                    },
                    variable: {
                        type: ValueType.Undefined,
                        value: ""
                    },
                    cookie: {
                        type: ValueType.Undefined,
                        value: ""
                    },
                    expected: {
                        type: ValueType.Undefined,
                        value: ""
                    },
                    test: {
                        testScriptId: "",
                        name: ""
                    },
                    file: {
                        fileId: "",
                        name: "",
                        url: ""
                    },
                    uiLocator: {
                        locateBy: "",
                        locatorId: "",
                        locatorName: "",
                        locatorType: "",
                        locatorValue: "",
                        pageId: ""
                    },
                    uiTable: {
                        locateBy: "",
                        locatorId: "",
                        locatorName: "",
                        locatorType: "",
                        locatorValue: "",
                        pageId: ""
                    },
                    commonFunction: {
                        commonFunctionId: "",
                        name: "",
                        description: "",
                        testSteps: [],
                        parameters: [],
                        deleted: false
                    },
                    paramsValue: {
                        paramsValue: "",
                        deleted: false
                    }
                }
            };
            this.addTestStep(event.currentIndex, testStep);
        }
    }

    addTestStep(index: number, testStep: TestStep) {
        const testSteps = this.userScriptForm.get("testSteps") as FormArray;
        if (index >= 0 && index <= testSteps.length) {
            const testStepFG = this.fb.group({
                templateId: ["", Validators.required],
                templateTitle: ["", Validators.required],
                params: this.fb.group({
                    number: this.fb.group({
                        type: [ValueType.Undefined],
                        value: [""]
                    }),
                    text: this.fb.group({
                        type: [ValueType.Undefined],
                        value: [""]
                    }),
                    variable: this.fb.group({
                        type: [ValueType.Undefined],
                        value: [""]
                    }),
                    password: this.fb.group({
                        type: [ValueType.Undefined],
                        value: [""]
                    }),
                    cookie: this.fb.group({
                        type: [ValueType.Undefined],
                        value: [""]
                    }),
                    expected: this.fb.group({
                        type: [ValueType.Undefined],
                        value: [""]
                    }),
                    file: this.fb.group({
                        fileId: [""],
                        name: [""],
                        url: [""]
                    }),
                    uiLocator: this.fb.group({
                        locatorId: [""],
                        pageId: [""],
                        deleted: false
                    }),
                    uiTable: this.fb.group({
                        locatorId: [""],
                        pageId: [""]
                    }),
                    commonFunction: this.fb.group({
                        commonFunctionId: [""],
                        name: [""],
                        description: [""],
                        testSteps: [[]],
                        parameters: [[]],
                        deleted: false
                    }),
                    paramsValue: this.fb.group({
                        paramsValue: [""],
                        deleted: false
                    })
                })
            });
            // console.log(testStep);
            testStepFG.patchValue(testStep);
            this.addDeletedLocator(testStep);
            testSteps.insert(index, testStepFG);
        }
    }

    deleteTestStep(index: number) {
        const testSteps = this.userScriptForm.get("testSteps") as FormArray;
        testSteps.removeAt(index);
    }

    addColumn(columnName: string) {
        if (
            this.columnsToDisplay.findIndex(colName => colName === columnName) === -1
        ) {
            this.columnsToDisplay.splice(this.columnsToDisplay.length, 0, columnName);
        }
    }

    removeColumn(columnName: string) {
        if (!this.onlyOneOccurance(columnName)) {
            return;
        }

        this.columnsToDisplay = _.reject(this.columnsToDisplay, function (
            displayedColumn
        ) {
            return displayedColumn === columnName;
        });

        if (this.columnsToDisplay.length > 2) {
            this.rowData = _.map(this.rowData, row => {
                return _.omit(row, columnName);
            });
        } else if (this.columnsToDisplay.length === 2) {
            this.rowData = [];
        }
    }

    removeAllColumns() {
        this.columnsToDisplay = ["select_ahq_2021", "action_ahq_2021"];
        this.rowData = [];
    }

    getDataColumns() {
        return _.reject(
            [...this.columnsToDisplay],
            col =>
                col === "id_ahq_2021" ||
                col === "edit_ahq_2021" ||
                col === "select_ahq_2021" ||
                col === "action_ahq_2021"
        );
    }

    onlyOneOccurance(columnName: string) {
        const ts = this.userScriptForm.value as TestScript;
        let cnt = 0;
        ts.testSteps.forEach(step => {
            if (
                step.params &&
                ((step.params.text && step.params.text.value === columnName) ||
                    (step.params.number && step.params.number.value === columnName) ||
                    (step.params.variable && step.params.variable.value === columnName) ||
                    (step.params.cookie && step.params.cookie.value === columnName) ||
                    (step.params.expected && step.params.expected.value === columnName))
            ) {
                cnt++;
            }
        });
        return cnt === 1;
    }

    getDisplayTemplateTitle(templateTitle: string) {
        let displayTemplateTitle = "";
        const keywords = templateTitle.split(" ");

        keywords.forEach(keyword => {
            if (keyword === "{{text}}") {
                displayTemplateTitle =
                    displayTemplateTitle +
                    ' <span class="badge badge-danger">text</span>';
            } else if (keyword === "{{number}}") {
                displayTemplateTitle =
                    displayTemplateTitle +
                    ' <span class="badge badge-danger">number</span>';
            } else if (keyword === "{{variable}}") {
                displayTemplateTitle =
                    displayTemplateTitle +
                    ' <span class="badge badge-danger">variable</span>';
            } else if (keyword === "{{cookie}}") {
                displayTemplateTitle =
                    displayTemplateTitle +
                    ' <span class="badge badge-danger">cookie</span>';
            } else if (keyword === "{{ui-locator}}") {
                displayTemplateTitle =
                    displayTemplateTitle +
                    ' <span class="badge badge-primary">ui-locator</span>';
            } else if (keyword === "{{ui-table}}") {
                displayTemplateTitle =
                    displayTemplateTitle +
                    ' <span class="badge badge-primary">ui-table</span>';
            } else if (keyword === "{{Test}}") {
                displayTemplateTitle =
                    displayTemplateTitle +
                    ' <span class="badge badge-danger">Test</span>';
            } else if (keyword === "{{expected}}") {
                displayTemplateTitle =
                    displayTemplateTitle +
                    ' <span class="badge badge-danger">expected</span>';
            } else if (keyword === "{{file}}") {
                displayTemplateTitle =
                    displayTemplateTitle +
                    ' <span class="badge badge-danger">file</span>';
            } else if (keyword === "{{password}}") {
                displayTemplateTitle =
                    displayTemplateTitle +
                    ' <span class="badge badge-danger">password</span>';
            } else if (keyword === "{{common-function}}") {
                displayTemplateTitle =
                    displayTemplateTitle +
                    ' <span class="badge badge-primary">common-function</span>';
            } else if (keyword === "{{parameters}}") {
                displayTemplateTitle =
                    displayTemplateTitle +
                    ' <span class="badge badge-danger">parameters</span>';
            } else {
                displayTemplateTitle = displayTemplateTitle + " " + keyword;
            }
        });

        return displayTemplateTitle;
    }

    getParametersFormArray(): FormArray {
        return this.userScriptForm.get("parameters") as FormArray;
    }

    getParameterType(type: string) {
        const findFromCommonFunctionType = this.commonFunctionType.find(x => x.value === type);
        if (findFromCommonFunctionType) {
            return findFromCommonFunctionType.type;
        }
        const findFromCommonObject = this.commonObjects.find(x => x.id === type);
        if (findFromCommonObject) {
            return findFromCommonObject.name;
        }
    }

    setParamsGroup(): FormGroup {
        return this.fb.group({
            name: ['params.', Validators.required],
            type: ['', Validators.required],
            array: [],
        })
    }

    addParamter() {
        this.getParametersFormArray().push(this.setParamsGroup());
        this.currentIndex = this.getParametersFormArray().controls.length;
    }

    removeParams(index: number) {
        this.userScript.paramterDeleted.emit(this.getParametersFormArray().at(index).get('name').value);
        this.getParametersFormArray().removeAt(index);
    }

    checkDuplicateParam(index: number, string: string) {
        this.getParametersFormArray().controls[index].patchValue({ name: string });
        if (string.startsWith('params.')) {
            const toLower = t => (t || '').toLowerCase();
            const findIndex = this.getParametersFormArray().value
                // tslint:disable-next-line:no-shadowed-variable
                .filter((_: any, i: number) => i !== index)
                .findIndex(val => toLower(string) === toLower(val.name));
            this.getParametersFormArray().controls[index].get('name').setErrors(findIndex > -1 ? { 'duplicated': true } : null);
        } else {
            this.getParametersFormArray().controls[index].get('name').setErrors({ 'wrongString': true });
        }
        this.userScriptForm.updateValueAndValidity();
        this.getParametersFormArray().controls[index].get('name').valueChanges.pipe(pairwise()).subscribe(([prev, next]) => {
            this.userScript.paramterChanged.emit({ prev, next });
        });
    }
    addCompletedParam() {
        const newFormArray = new FormArray([]);
        const fa = this.userScriptForm.get("parameters") as FormArray;
        fa.controls.forEach(faElement => {
            if (faElement.get('name').errors === null) {
                newFormArray.push(faElement);
            }
        })
        this.getValidParametersFormArray = newFormArray
    }

    getColumnsfromParams(params: Params) {
        const columns = [];
        if (params.cookie.type === ValueType.Column) {
            columns.push(params.cookie.value);
        }
        if (params.expected.type === ValueType.Column) {
            columns.push(params.expected.value);
        }
        if (params.number.type === ValueType.Column) {
            columns.push(params.number.value);
        }
        if (params.xPos.type === ValueType.Column) {
            columns.push(params.xPos.value);
        }
        if (params.yPos.type === ValueType.Column) {
            columns.push(params.yPos.value);
        }
        if (params.width.type === ValueType.Column) {
            columns.push(params.width.value);
        }
        if (params.height.type === ValueType.Column) {
            columns.push(params.height.value);
        }
        if (params.password?.type === ValueType.Column) {
            columns.push(params.password.value);
        }
        if (params.text.type === ValueType.Column) {
            columns.push(params.text.value);
        }
        if (params.variable.type === ValueType.Column) {
            columns.push(params.variable.value);
        }
        return columns;
    }

    onUserScriptSaveClick() {
        if (this.userscriptId) {
            this.update();
        } else {
            this.save();
        }
    }

    update() {
        if (this.userScriptForm.valid) {
            this.commonObject = { ...this.commonObject, ...this.userScriptForm.value };
            if (this.commonObject.commonFunctionId) {
                this.userScript.updateCommonFunction(this.commonObject).subscribe((res: any) => {
                    this.notificationService.showNotification(
                        res.details,
                        "top"
                    );
                    this.reFetch.emit(true);
                });
            }
        }
    }

    save() {
        this.commonObject = { ...this.commonObject, ...this.userScriptForm.value };
        this.userScript.addCommonObject(this.commonObject).subscribe((res: any) => {
            this.notificationService.showNotification(
                res.details,
                "top"
            );
            this.onUserScriptCancelClick();
            this.reFetch.emit(true);
        });
    }

    onUserScriptCancelClick() {
        this.userScriptForm.reset();
        this.userScriptForm.setControl("testSteps", this.fb.array([]));
        this.rowData = [];
        this.removeAllColumns();
    }

    addCustomParams() {
        if (this.userScriptForm.get('websiteId').value) {
            const dialogRef = this.dialog.open(CustomParmasComponent, {
                width: '1000px',
                disableClose: true,
                data: {
                    commonObject: null,
                    commonFunctionType: this.commonFunctionType,
                    websiteId: this.userScriptForm.get('websiteId').value
                },
            });

            dialogRef.afterClosed().subscribe((result) => {
                if (result === true) {
                    this.getCommonOject(this.userScriptForm.get("websiteId").value);
                }
            });
        } else {
            this.notificationService.showNotification(
                "Please select application first",
                "top"
            );
        }
    }

    onEditCustomParameter(commonObject: CommonObjects) {
        if (this.userScriptForm.get('websiteId').value) {
            const dialogRef = this.dialog.open(CustomParmasComponent, {
                width: '1000px',
                disableClose: true,
                data: {
                    commonObject: commonObject,
                    commonFunctionType: this.commonFunctionType,
                    websiteId: this.userScriptForm.get('websiteId').value
                },
            });

            dialogRef.afterClosed().subscribe((result) => {
                if (result === true) {
                    this.getCommonOject(this.userScriptForm.get("websiteId").value);
                }
            });
        } else {
            this.notificationService.showNotification(
                "Please select application first",
                "top"
            );
        }
    }

    addCustomConfiguration() {
        if (this.userScriptForm.get('websiteId').value) {
            const dialogRef = this.dialog.open(ImportConfigurationComponent, {
                width: '1000px',
                disableClose: true,
                data: {
                    websiteId: this.userScriptForm.get('websiteId').value
                },
            });

            dialogRef.afterClosed().subscribe((result) => {
                if (result === true) {
                    this.getCommonOject(this.userScriptForm.get("websiteId").value);
                }
            });
        } else {
            this.notificationService.showNotification(
                "Please select application first",
                "top"
            );
        }
    }

    private addDeletedLocator(testStep: TestStep) {
        // add selected and deleed locator in list to show it strikethrough
        if (testStep.params?.uiLocator?.deleted) {
            const uiLocator: Locator = testStep.params?.uiLocator;
            const page = this.pages.find(item => item.pageId === uiLocator.pageId);
            if (page && !page.locators?.some(item => item.locatorId === "")) {
                page.locators.push({
                    locatorId: "",
                    locatorName: uiLocator.locatorName,
                    pageId: page.pageId,
                    locateBy: null,
                    locatorType: null,
                    locatorValue: null,
                    deleted: true
                });
            }
        }
    }
}
