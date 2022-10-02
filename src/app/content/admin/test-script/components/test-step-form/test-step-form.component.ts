import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, } from "@angular/core";
import { AbstractControl, FormGroup, Validators } from "@angular/forms";
import { FileValuePair, Locator, NameValuePair, Page, Website, } from "@app/shared/models";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { MatChipInputEvent } from "@angular/material/chips";
import { of, Subject } from "rxjs";
import { debounceTime, delay, switchMap, takeUntil } from "rxjs/operators";
import { PageService, TestScriptService, UserScriptService, WebsiteService, } from "@app/core/services";
import { MatDialog } from "@angular/material/dialog";
import { ObjectRepositoryV2Service } from "@app/content/admin/object-repository-v2/services/object-repository-v2.service";
import * as _ from "lodash";
import { Parameters, ValueType } from '@shared/models/user-script.model';
import { AddLocatorComponent } from '@shared/components/add-locator/add-locator.component';
import { AddPagesComponent } from '@shared/components/add-pages/add-pages.component';
import { AddParametersComponent } from '@shared/components/add-parameters/add-parameters.component';

@Component({
    selector: "app-test-step-form",
    templateUrl: "./test-step-form.component.html",
    styleUrls: ["./test-step-form.component.scss"],
})
export class TestStepFormComponent implements OnInit, OnDestroy {
    componentDestroyed$: Subject<boolean> = new Subject();

    keywords: string[] = [];
    paramsFG: FormGroup;
    removable = true;
    addOnBlur = true;
    show = true;
    texts: string[] = [];
    numbers: string[] = [];
    xPoss: string[] = [];
    yPoss: string[] = [];
    widths: string[] = [];
    heights: string[] = [];
    variables: string[] = [];
    cookies: string[] = [];
    expecteds: string[] = [];
    passwords: string[] = [];

    filteredNameValuePairs: NameValuePair[] = [];
    fileValuePair: FileValuePair = {
        fileId: "",
        name: "",
        url: "",
    };

    websites: Website[] = [];
    selectedWebsite: Website = null;
    commonFunctionList = [];
    commonFunctionParams = [];
    commonFunctionId: string;

    parametersObject: Parameters[] = [];

    @ViewChild("number") numberInputRef: ElementRef;
    @ViewChild("xPos") xPosInputRef: ElementRef;
    @ViewChild("yPos") yPosInputRef: ElementRef;
    @ViewChild("width") widthInputRef: ElementRef;
    @ViewChild("height") heightInputRef: ElementRef;
    @ViewChild("text") textInputRef: ElementRef;
    @ViewChild("password") passwordInputRef: ElementRef;
    @ViewChild("variable") variableInputRef: ElementRef;
    @ViewChild("cookie") cookieInputRef: ElementRef;
    @ViewChild("expected") expectedInputRef: ElementRef;

    @Input() testStepFG: FormGroup | AbstractControl | any;
    @Input() pages: Page[];
    @Input() columns: any[];
    @Input() globalParameters: NameValuePair[];

    @Output() addColumnEvent = new EventEmitter<string>();
    @Output() removeColumnEvent = new EventEmitter<string>();

    @Input('parametersObject') set patchParametersObject(values) {
        this.parametersObject = values.filter(p => p.name !== "params.");
    }

    constructor(
        private testScriptService: TestScriptService,
        public dialog: MatDialog,
        private websiteService: WebsiteService,
        private pageService: PageService,
        private userScript: UserScriptService,
        private objectRepositoryV2Service: ObjectRepositoryV2Service,
    ) {

        this.websiteService.getWebsites(0).subscribe((websites) => {
            this.websites = websites;
        });

        this.objectRepositoryV2Service.pageCreatedEvent.pipe(takeUntil(this.componentDestroyed$)).subscribe((page) => {
            this.websiteService.getWebsites(0).subscribe((websites) => {
                this.websites = websites;
            });
            this.pageService
                .getPagesByWebsiteId(this.selectedWebsite.websiteId)
                .subscribe((pages) => {
                    this.pages = pages;
                });
        });

        this.objectRepositoryV2Service.pageUpdatedEvent.pipe(takeUntil(this.componentDestroyed$)).subscribe((page) => {
            this.pages = _.map(this.pages, (page_t) =>
                page_t.pageId === page.pageId ? page : page_t
            );
        });

        this.objectRepositoryV2Service.websiteCreatedEvent.pipe(takeUntil(this.componentDestroyed$)).subscribe((website) => {
            this.websites.push(website);
        });

        this.objectRepositoryV2Service.websiteUpdatedEvent.pipe(takeUntil(this.componentDestroyed$)).subscribe((website) => {
            this.websites = _.map(this.websites, (website_t) =>
                website_t.websiteId === website.websiteId ? website : website_t
            );
        });

        this.objectRepositoryV2Service.websiteSelectedEvent.pipe(takeUntil(this.componentDestroyed$)).subscribe((website) => {
            if (!website) {
                this.selectedWebsite = null;
                this.pages = [];
            }
        });

        this.userScript.paramterChanged
            .pipe(delay(0))
            .pipe(takeUntil(this.componentDestroyed$))
            .subscribe(({ prev, next }) => {
                for (const type of Object.keys(this.paramsFG.controls)) {
                    const po = this.paramsFG.controls[type].value;
                    if (next.startsWith('params.')) {
                        if (po.type === ValueType.Params && (po.value || '').startsWith(prev.replace('params.', ''))) {
                            this.paramsFG.controls[type].patchValue({ value: next.replace('params.', '') });
                            this.testStepFG.updateValueAndValidity();
                            this.resetShowTextInParams(prev, next, false);
                        }
                    }
                }
            })
        this.userScript.paramterDeleted
            .pipe(delay(0))
            .pipe(takeUntil(this.componentDestroyed$))
            .subscribe((prev) => {
                for (const type of Object.keys(this.paramsFG.controls)) {
                    const po = this.paramsFG.controls[type].value;
                    if (po.type === ValueType.Params && po.value === prev.replace('params.', '')) {
                        this.paramsFG.controls[type].patchValue({ type: -1, value: '' });
                        this.testStepFG.updateValueAndValidity();
                        this.resetShowTextInParams(prev, "", true);
                    }
                }
            })
    }

    ngOnInit() {
        this.getCommonFunctionList();
        const templateTitle = this.testStepFG.controls["templateTitle"].value as string;
        this.keywords = templateTitle.split(" ");
        this.paramsFG = this.testStepFG.controls["params"] as FormGroup;

        this.keywords.forEach(keyword => {
            if (keyword === "{{text}}") {
                this.params2ValueChanges("text");
            } else if (keyword === "{{number}}") {
                this.params2ValueChanges("number");
            } else if (keyword === "{{xPos}}") {
                this.params2ValueChanges("xPos");
            } else if (keyword === "{{yPos}}") {
                this.params2ValueChanges("yPos");
            } else if (keyword === "{{width}}") {
                this.params2ValueChanges("width");
            } else if (keyword === "{{height}}") {
                this.params2ValueChanges("height");
            } else if (keyword === "{{variable}}") {
                this.params2ValueChanges("variable");
            } else if (keyword === "{{cookie}}") {
                this.params2ValueChanges("cookie");
            } else if (keyword === "{{expected}}") {
                this.params2ValueChanges("expected");
            } else if (keyword === "{{ui-locator}}") {
                this.params1ValueChanges("uiLocator", "locatorId");
            } else if (keyword === "{{ui-table}}") {
                this.params1ValueChanges("uiTable", "locatorId");
            } else if (keyword === "{{password}}") {
                this.params2ValueChanges("password");
            } else if (keyword === "{{common-function}}") {
                this.params1ValueChanges("commonFunction", "commonFunctionId");
            } else if (keyword === "{{parameters}}") {
                this.params1ValueChanges("paramsValue", "paramsValue");
            } else if (keyword === "{{file}}") {
                this.fileValuePair = this.paramsFG.controls["file"].value;
            }
        });

        if (this.globalParameters && this.globalParameters.length) {
            if (this.texts.length) {
                this.texts = this.texts.map((text) => this.getConfigName(text));
            }
            if (this.passwords.length) {
                this.passwords = this.passwords.map((password) => this.getConfigName(password));
            }
            if (this.numbers.length) {
                this.numbers = this.numbers.map((number) => this.getConfigName(number));
            }
            if (this.variables.length) {
                this.variables = this.variables.map((variable) => this.getConfigName(variable));
            }
            if (this.cookies.length) {
                this.cookies = this.cookies.map((cookie) => this.getConfigName(cookie));
            }
            if (this.expecteds.length) {
                this.expecteds = this.expecteds.map((expected) => this.getConfigName(expected));
            }
        }
        if (this.parametersObject && this.parametersObject.length) {
            if (this.texts.length) {
                this.texts = this.texts.filter(text => this.getUserParams(text));
            }
            if (this.passwords.length) {
                this.passwords = this.passwords.map((password) => this.getUserParams(password));
            }
            if (this.numbers.length) {
                this.numbers = this.numbers.map((number) => this.getUserParams(number));
            }
            if (this.variables.length) {
                this.variables = this.variables.map((variable) => this.getUserParams(variable));
            }
            if (this.cookies.length) {
                this.cookies = this.cookies.map((cookie) => this.getUserParams(cookie));
            }
            if (this.expecteds.length) {
                this.expecteds = this.expecteds.map((expected) => this.getUserParams(expected));
            }
        }
    }

    getConfigName(tag: string) {
        if (tag.startsWith("config.")) {
            const found = this.globalParameters.findIndex(gp => gp.value === tag.replace("config.", ""));
            if (found > -1) {
                return this.globalParameters[found].name;
            } else {
                return tag;
            }
        } else {
            return tag;
        }
    }

    getUserParams(tag: string) {
        if (tag.startsWith("params.")) {
            const found = this.parametersObject.findIndex(pb => pb.name === tag);
            if (found > -1) {
                return this.parametersObject[found].name;
            } else {
                return tag;
            }
        } else {
            return tag;
        }
    }

    add(event: MatChipInputEvent, type: string) {
        setTimeout(() => {
            const typeFG = this.paramsFG.controls[type];
            const input = event.input;
            const value = event.value.trim();
            if (
                this.allowOnlyOneTag(type) &&
                value &&
                value !== "data." &&
                value !== "config." &&
                value !== "params."
            ) {
                typeFG.setErrors(null);
                if (type === "text") {
                    this.texts.push(value);
                } else if (type === "number") {
                    this.numbers.push(value);
                } else if (type === "xPos") {
                    this.xPoss.push(value);
                } else if (type === "yPos") {
                    this.yPoss.push(value);
                } else if (type === "width") {
                    this.widths.push(value);
                } else if (type === "height") {
                    this.heights.push(value);
                } else if (type === "variable") {
                    this.variables.push(value);
                } else if (type === "cookie") {
                    this.cookies.push(value);
                } else if (type === "password") {
                    this.passwords.push(value);
                } else if (type === "expected") {
                    this.expecteds.push(value);
                }

                if (value && value.match(/data\.([A-Z*a-z*]+[0-9]*)+/)) {
                    this.addColumnEvent.emit(value.replace("data.", ""));
                    typeFG.get("type").setValue(ValueType.Column);
                    typeFG.get("value").setValue(value.replace("data.", ""));
                } else if (value && value.match(/config\.([A-Z*a-z*]+[0-9]*)+/)) {
                    typeFG.get("type").setValue(ValueType.Configuration);
                    typeFG.get("value").setValue(value.replace("config.", ""));
                } else if (value && value.match(/params\.([A-Z*a-z*]+[0-9]*)+/)) {
                    typeFG.get("type").setValue(ValueType.Params);
                    typeFG.get("value").setValue(value.replace("params.", ""));
                } else {
                    typeFG.get("type").setValue(ValueType.Data);
                    typeFG.get("value").setValue(value || "");
                }

                if (typeFG.valid) {
                    typeFG.markAsDirty();
                    input.value = "";
                }
            } else {
                input.value = "";
            }
            typeFG.updateValueAndValidity();
        }, 500)
    }

    allowOnlyOneTag(type: string) {
        return (type === "text" && this.texts.length === 0) ||
            (type === "password" && this.passwords.length === 0) ||
            (type === "number" && this.numbers.length === 0) ||
            (type === "xPos" && this.xPoss.length === 0) ||
            (type === "yPos" && this.yPoss.length === 0) ||
            (type === "width" && this.widths.length === 0) ||
            (type === "height" && this.heights.length === 0) ||
            (type === "variable" && this.variables.length === 0) ||
            (type === "cookie" && this.cookies.length === 0) ||
            (type === "expected" && this.expecteds.length === 0);
    }

    selected(event: MatAutocompleteSelectedEvent, type: string) {
        const viewValue = event.option.viewValue.trim();
        if (!this.allowOnlyOneTag(type)) {
            return;
        }
        if (type === "text") {
            this.texts.push(viewValue);
            this.textInputRef.nativeElement.value = "";
        } else if (type === "number") {
            this.numbers.push(viewValue);
            this.numberInputRef.nativeElement.value = "";
        } else if (type === "xPos") {
            this.xPoss.push(viewValue);
            this.xPosInputRef.nativeElement.value = "";
        } else if (type === "yPos") {
            this.yPoss.push(viewValue);
            this.yPosInputRef.nativeElement.value = "";
        } else if (type === "width") {
            this.widths.push(viewValue);
            this.widthInputRef.nativeElement.value = "";
        } else if (type === "height") {
            this.heights.push(viewValue);
            this.heightInputRef.nativeElement.value = "";
        } else if (type === "password") {
            this.passwords.push(viewValue);
            this.passwordInputRef.nativeElement.value = "";
        } else if (type === "variable") {
            this.variables.push(viewValue);
            this.variableInputRef.nativeElement.value = "";
        } else if (type === "cookie") {
            this.cookies.push(viewValue);
            this.cookieInputRef.nativeElement.value = "";
        } else if (type === "expected") {
            this.expecteds.push(viewValue);
            this.expectedInputRef.nativeElement.value = "";
        }
        if (viewValue.match(/data\.([A-Z*a-z*]+[0-9]*)+/)) {
            this.paramsFG.controls[type].get("type").setValue(ValueType.Column);
        } else if (viewValue.match(/config\.([A-Z*a-z*]+[0-9]*)+/)) {
            this.paramsFG.controls[type].get("type").setValue(ValueType.Configuration);
        } else if (viewValue.match(/params\.([A-Z*a-z*]+[0-9]*)+/)) {
            this.paramsFG.controls[type].get("type").setValue(ValueType.Params)
        }
    }

    remove(type: string, val: string): void {
        const controller = this.paramsFG.controls[type].get("value");
        let index = -1;
        if (type === "text") {
            index = this.texts.indexOf(val);
        } else if (type === "number") {
            index = this.numbers.indexOf(val);
        } else if (type === "xPos") {
            index = this.xPoss.indexOf(val);
        } else if (type === "yPos") {
            index = this.yPoss.indexOf(val);
        } else if (type === "width") {
            index = this.widths.indexOf(val);
        } else if (type === "height") {
            index = this.heights.indexOf(val);
        } else if (type === "password") {
            index = this.passwords.indexOf(val);
        } else if (type === "variable") {
            index = this.variables.indexOf(val);
        } else if (type === "cookie") {
            index = this.cookies.indexOf(val);
        } else if (type === "expected") {
            index = this.expecteds.indexOf(val);
        }

        if (index >= 0) {
            if (type === "text") {
                this.texts.splice(index, 1);
            } else if (type === "number") {
                this.numbers.splice(index, 1);
            } else if (type === "xPos") {
                this.xPoss.splice(index, 1);
            } else if (type === "yPos") {
                this.yPoss.splice(index, 1);
            } else if (type === "width") {
                this.widths.splice(index, 1);
            } else if (type === "height") {
                this.heights.splice(index, 1);
            } else if (type === "password") {
                this.passwords.splice(index, 1);
            } else if (type === "variable") {
                this.variables.splice(index, 1);
            } else if (type === "cookie") {
                this.cookies.splice(index, 1);
            } else if (type === "expected") {
                this.expecteds.splice(index, 1);
            }

            if (val.trim() && val.trim().match(/data\.([A-Z*a-z*]+[0-9]*)+/)) {
                this.removeColumnEvent.emit(val.trim().replace("data.", ""));
            }
            controller.setValue("");
            controller.enable();
            controller.updateValueAndValidity();
            controller.markAsDirty();
        }
    }

    params1ValueChanges(formGroupName: string, controlName: string) {
        this.paramsFG.controls[formGroupName].get(controlName).setValidators(Validators.required);
        this.paramsFG.controls[formGroupName].get(controlName).updateValueAndValidity();
        if (this.paramsFG.controls[formGroupName].get("deleted").value) {
            if (controlName === "locatorId") {
                this.paramsFG.controls[formGroupName].patchValue({ locatorId: "" });
            } else if (controlName === "commonFunctionId") {
                this.paramsFG.controls[formGroupName].patchValue({ commonFunctionId: "" });
            } else if (controlName === "paramsValue") {
                this.paramsFG.controls[formGroupName].patchValue({ paramsValue: "" });
            }
        }
    }

    setPageId(controlName: string, pageId: string) {
        if (controlName && pageId) {
            this.paramsFG.controls[controlName].get("pageId").setValue(pageId);
            this.paramsFG.controls[controlName].get("deleted").setValue(false);
        }
    }

    isDeleted(controlName: string): boolean {
        return this.paramsFG.controls[controlName].get("deleted").value;
    }

    params2ValueChanges(controlName: string) {
        let value = this.paramsFG.controls[controlName].get("value").value;
        if (value) {
            const type = this.paramsFG.controls[controlName].get("type").value;
            if (type === 1) {
                value = "data." + value;
            } else if (type === 2) {
                value = "config." + value;
            } else if (type === 3) {
                value = "params." + value;
            }

            if (controlName === "number") {
                this.numbers.push(value.trim());
            } else if (controlName === "xPos") {
                this.xPoss.push(value.trim());
            } else if (controlName === "yPos") {
                this.yPoss.push(value.trim());
            } else if (controlName === "width") {
                this.widths.push(value.trim());
            } else if (controlName === "height") {
                this.heights.push(value.trim());
            } else if (controlName === "text") {
                this.texts.push(value.trim());
            } else if (controlName === "password") {
                this.passwords.push(value.trim());
            } else if (controlName === "variable") {
                this.variables.push(value.trim());
            } else if (controlName === "cookie") {
                this.cookies.push(value.trim());
            } else if (controlName === "expected") {
                this.expecteds.push(value);
            }
        }
        this.paramsFG.controls[controlName].get("value").setValidators(Validators.required);
        this.paramsFG.controls[controlName].get("value").updateValueAndValidity();
        this.paramsFG.controls[controlName].get("type").setValidators(Validators.min(0));
        this.paramsFG.controls[controlName].get("type").updateValueAndValidity();

        this.paramsFG.controls[controlName].get("value").valueChanges.pipe(
            debounceTime(500),
            switchMap((searchTerm) => {
                if (searchTerm && searchTerm.startsWith("config.")) {
                    return of(this.getFilteredGlobalParameters(searchTerm));
                } else if (searchTerm && searchTerm.startsWith("data.")) {
                    return of(this.getfilteredColumns(searchTerm));
                } else if (searchTerm && searchTerm.startsWith("params.")) {
                    return of(this.getFilterUserParams(searchTerm));
                } else {
                    return of(null);
                }
            })
        ).subscribe(async (nameValuePairs) => {
            this.filteredNameValuePairs = await nameValuePairs;
        });
    }

    getfilteredColumns(name) {
        return this.columns
            .map(column => ({
                name: "data." + column,
                value: column
            } as NameValuePair)).filter(column => column.name.startsWith(name));
    }

    getFilteredGlobalParameters(name) {
        return this.globalParameters.filter(globalParameter => globalParameter.name.startsWith(name));
    }

    // Get Globed Params
    async getFilterUserParams(name) {
        if (name.startsWith("params.") && name.endsWith(".")) {
            const slicedName = name.slice(0, name.length - 1);
            const foundObject = this.parametersObject.find(pof => pof.name === slicedName);
            if (foundObject) {
                const primitiveType = !!foundObject.type.endsWith("+0");
                if (primitiveType) {
                    const typeId = foundObject.type.split("+0")[0];
                    const typeData: any = await this.userScript.getDataTypesByPrimitiveType(typeId);
                    for (const field of (typeData?.data || [])) {
                        const newName = name + field;
                        const findIndex = this.parametersObject.findIndex(pof => pof.name === newName);
                        if (findIndex === -1) {
                            this.parametersObject.push({
                                name: newName,
                                value: (name + field.name).replace('params.', ""),
                                type: foundObject.type
                            });
                        }
                    }
                } else {
                    const commonObjectId = foundObject.type.split("+1")[0];
                    const commonObject: any = await this.userScript.getCommonObjectById(commonObjectId);
                    for (const field of (commonObject?.fields || [])) {
                        const newName = name + field.name;
                        const findIndex = this.parametersObject.findIndex(pof => pof.name === newName);
                        if (findIndex === -1) {
                            this.parametersObject.push({
                                name: newName,
                                value: (name + field.name).replace('params.', ""),
                                type: field.type
                            });
                        }
                    }
                }
            }
        }
        return this.parametersObject.filter(pof => pof.name.startsWith(name)).map(po => ({
            name: po.name,
            value: po.name.replace('params.', "")
        })) as NameValuePair[];
    }

    resetShowTextInParams(checkText: string, resetText: string, deleteText = true) {
        for (const each of ['text', 'number', 'xPos', 'yPos', 'width', 'height', 'password', 'variable', 'cookie', 'expected']) {
            const find = this[each + 's'].findIndex(e => e.startsWith(checkText));
            if (find !== -1) {
                if (deleteText) {
                    this[each + 's'].splice(find, 1);
                    this[each + 'InputRef'].nativeElement.value = resetText;
                } else {
                    this[each + 's'][find] = resetText;
                }
            }
        }
    }

    uploadFileEvt(imgFile: any) {
        if (imgFile.target.files && imgFile.target.files[0]) {
            if (this.fileValuePair && this.fileValuePair.fileId) {
                this.testScriptService
                    .fileUpdate(this.fileValuePair.fileId, imgFile.target.files[0])
                    .subscribe((res) => {
                        this.paramsFG.controls["file"].setValue({
                            fileId: res["fileId"],
                            name: res["name"],
                            url: res["url"],
                        });
                    });
            } else {
                this.testScriptService
                    .fileUpload(imgFile.target.files[0])
                    .subscribe((res) => {
                        this.paramsFG.controls["file"].setValue({
                            fileId: res["fileId"],
                            name: res["name"],
                            url: res["url"],
                        });
                    });
            }
        }
    }

    addLocator(page: Page, thisEl) {
        this.show = false;
        const dialogRef = this.dialog.open(AddLocatorComponent, {
            disableClose: true,
            data: {
                website: this.selectedWebsite,
                websiteId: page.websiteId,
                pageId: page.pageId,
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            this.show = true;
            if (result) {
                this.pageService
                    .getPagesByWebsiteId(page.websiteId)
                    .subscribe((pages) => {
                        this.pages = pages;
                    });
            }
        });
    }

    editOption(page: Page, event, locator: Locator) {
        this.show = false;
        const dialogRef = this.dialog.open(AddLocatorComponent, {
            disableClose: true,
            data: {
                website: this.selectedWebsite,
                websiteId: page.websiteId,
                pageId: page.pageId,
                locator: locator
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            this.show = true;
            if (result) {
                this.pageService
                    .getPagesByWebsiteId(page.websiteId)
                    .subscribe((pages) => {
                        this.pages = pages;
                    });
            }
        });
    }

    addPage(page: Page, thisEl) {
        this.show = false;
        const dialogPageRef = this.dialog.open(AddPagesComponent, {
            disableClose: true,
            panelClass: "popup-page-dialog",
            width: "80vw",
            height: "100vh",
            position: {
                top: "0px",
                right: "0px",
                bottom: "0px",
            },
            data: {
                website: this.selectedWebsite,
                websiteId: page.websiteId,
                pageId: page.pageId,
            },
        });
        dialogPageRef.afterClosed().subscribe((result) => {
            this.show = true;
            if (result) {
                this.pageService
                    .getPagesByWebsiteId(page.websiteId)
                    .subscribe((pages) => {
                        this.pages = pages;
                    });
            }
        });
    }

    getCommonFunctionList() {
        this.userScript.getCommonFunctionList().subscribe((res: any) => {
            if (res) {
                this.commonFunctionList = res.content;
            }
        });
    }

    commonListChange(commonListId: string) {
        this.userScript.getCommonFunctionWittId(commonListId).subscribe((res: any) => {
            if (res) {
                this.commonFunctionParams = [];
                this.commonFunctionParams = res.parameters;
                this.commonFunctionId = res.commonFunctionId;
                this.paramsFG.controls['commonFunction'].patchValue(res);
            }
        });
    }

    parametersTypes(parameter, commonFunctionId: string) {
        const dialogRef = this.dialog.open(AddParametersComponent, {
            width: '1000px',
            disableClose: true,
            data: {
                parameters: parameter.type,
                commonListId: commonFunctionId
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log(`Dialog result: ${result}`);
        });
    }

    ngOnDestroy() {
        this.parametersObject = [];
        this.componentDestroyed$.next(true);
        this.componentDestroyed$.complete();
    }
}
