import { CdkDragDrop } from "@angular/cdk/drag-drop";
import { AfterViewInit, Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { NotificationService, TestScriptService, TestSuiteService } from "@app/core/services";
import { EntityType } from "@app/shared/enums";
import { Filter, NameFilterResult, SearchFilter, TestScript, TestScriptView, TestSuite } from "@app/shared/models";
import { of } from "rxjs";
import { debounceTime, finalize, switchMap, tap } from "rxjs/operators";
import { TestSuiteFilterService } from "../../services/test-suite-filter.service";

@Component({
    selector: "app-test-suite-details",
    templateUrl: "./test-suite-details.component.html",
    styleUrls: ["./test-suite-details.component.scss"]
})
export class TestSuiteDetailsComponent implements OnInit, AfterViewInit {
    testSuite: TestSuite;
    testSuiteForm: FormGroup;
    testScripts: TestScriptView[] = [];
    nameFilterResults: NameFilterResult[] = [];

    filter: Filter = {
        name: "",
        applicationId: "",
        epicId: "",
        status: "",
        tags: [],
        offset: 0,
        size: 1000
    };

    selectedSearchOption: NameFilterResult = null;

    searchByNameCtrl = new FormControl("", [Validators.required]);
    isLoading = false;

    constructor(
        private fb: FormBuilder,
        private testSuiteService: TestSuiteService,
        private testScriptService: TestScriptService,
        private testSuiteFilterService: TestSuiteFilterService,
        private notificationService: NotificationService
    ) {
        this.testSuiteForm = this.fb.group({
            name: ["", Validators.required],
            description: ["", Validators.required],
            testScripts: this.fb.array([])
        });
    }

    ngOnInit() {
        this.testScriptService
            .getTestScriptsByFilter(this.filter)
            .subscribe(testScripts => {
                this.testScripts = testScripts.data;
            });

        this.testSuiteFilterService.testSuiteChanged$.subscribe(testSuite => {
            this.testSuite = testSuite;
            if (this.testSuite) {
                this.testSuiteForm.patchValue(this.testSuite);
                this.deleteAllTestScripts();
                this.testSuite.testScripts.forEach((testScript, index) => {
                    this.addTestScript(index, testScript);
                });
                this.selectedSearchOption = null;
                this.testScriptService
                    .getTestScriptsByFilter(this.filter)
                    .subscribe(testScripts => {
                        this.testScripts = testScripts.data;
                    });
            }
        });

        this.testSuiteFilterService.testSuiteListEmpty$.subscribe(() => {
            this.testSuite = null;
            this.selectedSearchOption = null;
        });

        this.searchByNameCtrl.valueChanges
            .pipe(
                debounceTime(500),
                tap(() => {
                    this.nameFilterResults = [];
                }),
                switchMap(filterValue => {
                    if (typeof filterValue === "string" && filterValue.length > 0) {
                        this.isLoading = true;
                        return this.testScriptService
                            .getTestScriptsByResultByName({
                                name: filterValue,
                                storyId: null,
                                epicId: null,
                                offset: 0,
                                size: 0,
                                testScriptId: null
                            })
                            .pipe(
                                finalize(() => {
                                    this.isLoading = false;
                                })
                            );
                    } else {
                        return of(null);
                    }
                })
            )
            .subscribe(res => {
                if (!res) {
                    this.nameFilterResults = [];
                } else {
                    this.nameFilterResults = res;
                }
            });
    }

    public displayFn(nameFilterResult: NameFilterResult): string {
        if (nameFilterResult.type !== EntityType.TestScript) {
            this.selectedSearchOption = nameFilterResult;
        }
        return ""; // nameFilterResult ? nameFilterResult?.type + " - " + nameFilterResult?.name : '';
    }

    removeSelectedSearchOption() {
        this.selectedSearchOption = null;
        this.testScriptService
            .getTestScriptsByFilter(this.filter)
            .subscribe(testScripts => {
                this.testScripts = testScripts.data;
            });
    }

    getSelectedNameFilterResult(nameFilterResult: NameFilterResult) {
        const searchFilter: SearchFilter = {
            name: null,
            storyId: null,
            epicId: null,
            offset: 0,
            size: 0,
            testScriptId: null
        };

        if (nameFilterResult.type === EntityType.Epic) {
            searchFilter.epicId = nameFilterResult.id;
            this.testScriptService
                .getTestScriptsByQuery(searchFilter)
                .subscribe(testScripts => {
                    this.testScripts = testScripts;
                });
        } else if (nameFilterResult.type === EntityType.Story) {
            searchFilter.storyId = nameFilterResult.id;
            this.testScriptService
                .getTestScriptsByQuery(searchFilter)
                .subscribe(testScripts => {
                    this.testScripts = testScripts;
                });
        } else if (nameFilterResult.type === EntityType.TestScript) {
            this.addTestScript(-1, {
                testScriptId: nameFilterResult.id,
                name: nameFilterResult.name
            });
            this.selectedSearchOption = null;
            this.testScriptService
                .getTestScriptsByFilter(this.filter)
                .subscribe(testScripts => {
                    this.testScripts = testScripts.data;
                });
        }
    }

    ngAfterViewInit() {
    }

    getTestScriptFormArray() {
        return this.testSuiteForm.get("testScripts") as FormArray;
    }

    drop(event: CdkDragDrop<any[]>) {
        if (event.previousContainer === event.container) {
            const dir = event.currentIndex > event.previousIndex ? 1 : -1;
            const from = event.previousIndex;
            const to = event.currentIndex;
            const testScriptFA = this.getTestScriptFormArray();
            const temp = testScriptFA.at(from);
            for (let i = from; i * dir < to * dir; i = i + dir) {
                const current = testScriptFA.at(i + dir);
                testScriptFA.setControl(i, current);
            }
            testScriptFA.setControl(to, temp);
        } else {
            const selectedTestscript = event.previousContainer.data[
                event.previousIndex
                ] as TestScript;
            const testScript = {
                testScriptId: selectedTestscript.testScriptId,
                name: selectedTestscript.name
            };
            this.addTestScript(event.currentIndex, testScript);
        }
    }

    addTestScript(
        index: number,
        testScript: { testScriptId: string; name: string }
    ) {
        const testScriptFA = this.getTestScriptFormArray();
        const testScripts = testScriptFA.value as TestScript[];
        const isIndexExist = testScripts.findIndex(
            tb => tb.testScriptId === testScript.testScriptId
        );
        if (isIndexExist < 0) {
            if (index === -1) {
                index = testScriptFA.length;
            }
            if (index >= 0 && index <= testScriptFA.length) {
                testScriptFA.insert(
                    index,
                    this.fb.group({
                        testScriptId: [testScript.testScriptId, Validators.required],
                        name: [testScript.name, Validators.required]
                    })
                );
            }
        }
    }

    deleteTestScript(index: number) {
        this.getTestScriptFormArray().removeAt(index);
    }

    deleteAllTestScripts() {
        this.testSuiteForm.setControl("testScripts", this.fb.array([]));
    }

    onTestSuiteSaveClick() {
        this.testSuite = { ...this.testSuite, ...this.testSuiteForm.value };
        if (this.testSuite.testSuiteId) {
            this.testSuiteService.updateTestSuite(this.testSuite).subscribe(() => {
                this.testSuiteFilterService.testSuiteUpdated(this.testSuite);
                // this.testSuiteForm.reset();
                // this.deleteAllTestScripts();
                this.notificationService.showNotification(
                    "Test Suite updated successfully",
                    "top"
                );
            });
        } else {
            this.testSuiteService.addTestSuite(this.testSuite).subscribe(result => {
                this.testSuiteFilterService.testSuiteAdded(this.testSuite);
                this.testSuiteForm.reset();
                this.deleteAllTestScripts();
                this.notificationService.showNotification(
                    "Test Suite added successfully",
                    "top"
                );
            });
        }
    }

    public getStatusClass(status: string) {
        if (status === "In Progress") {
            return "badge badge-warning";
        } else if (status === "Ready") {
            return "badge badge-success";
        } else if (status === "To Be Repaired") {
            return "badge badge-danger";
        } else if (status === "To Be Repaired (AHQ Rec)") {
            return "badge badge-danger";
        } else if (status === "Valid") {
            return "badge badge-info";
        } else {
            return "badge badge-default";
        }
    }
}
