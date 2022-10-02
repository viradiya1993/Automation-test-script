import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import {
    Filter,
    NameFilterResult,
    SearchFilter,
    Story,
    StoryFilterView,
    TestScript,
    TestScriptFilterView,
    TestScriptView,
    TestSuiteView
} from '@app/shared/models';
import { Test_Script_API } from '@core/helpers';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonService } from '@core/services/common.service';

@Injectable({
    providedIn: 'root'
})
export class TestScriptService {
    gridApi;
    gridColumnApi;
    columnDefs: any[] = [
        // {
        //   headerCheckboxSelection: true,
        //   headerCheckboxSelectionFilteredOnly: true,
        //   checkboxSelection: true
        // }
    ];

    testScriptSelected = new EventEmitter<TestScript>();
    testScriptAddEvent = new EventEmitter();

    constructor(private http: HttpClient, private readonly commonService: CommonService) {
    }

    getTestScripts(offset: number) {
        const organizationAndProjectIds = this.commonService.getOrganizationAndProjectIds();
        const testScriptApi = Test_Script_API + 'projects/' + organizationAndProjectIds?.projectId + '/scripts';
        return this.http.get(testScriptApi + '?offset=' + offset).pipe(
            map(res => {
                return res['content'] as TestScript[];
            })
        );
    }

    getTestScriptsByStoryId(offset, story: Story) {
        return this.http.get(Test_Script_API + 'stories/' + story.storyId + '/scripts?offset=' + offset).pipe(
            map(res => {
                return res['content'] as TestScript[];
            })
        );
    }

    getStoriesByFilter(filter: Filter) {
        return this.http.post(Test_Script_API + 'stories/query', filter).pipe(
            map(res => {
                return {
                    data: res['content'] as StoryFilterView[],
                    totalCount: res['totalElements']
                };
            })
        );
    }

    getTestScriptsByFilter(filter: Filter) {
        return this.http.post(Test_Script_API + 'stories/scripts/query', filter).pipe(
            map(res => {
                return {
                    data: res['content'] as TestScriptFilterView[],
                    totalCount: res['totalElements']
                };
            })
        );
    }

    getTestScriptsByResultByName(searchFilter: SearchFilter) {
        return this.http.post<NameFilterResult[]>(Test_Script_API + 'stories/scripts/search/resultByName', searchFilter).pipe();
    }

    getTestScriptsByQuery(searchFilter: SearchFilter) {
        return this.http.post<TestScriptView[]>(Test_Script_API + 'stories/scripts/search/testScriptsByQuery', searchFilter).pipe();
    }

    public getTestScriptViewById(testScriptId: string): Observable<TestScriptFilterView> {
        return this.http.get<TestScriptFilterView>(Test_Script_API + `stories/scripts/${testScriptId}/view`)
    }

    addTestScript(testScript: TestScript) {
        const organizationAndProjectIds = this.commonService.getOrganizationAndProjectIds();
        testScript.organizationId = organizationAndProjectIds?.organizationId
        testScript.projectId = organizationAndProjectIds?.projectId;
        return this.http.post(Test_Script_API + 'stories/scripts', testScript).pipe();
    }

    fileUpload(file: File) {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post(Test_Script_API + 'stories/scripts/upload', formData, { reportProgress: true }).pipe();
    }

    fileUpdate(fileId: string, file: File) {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.put(Test_Script_API + `stories/scripts/upload/${fileId}`, formData, { reportProgress: true }).pipe();
    }

    fileRemove(fileId: string) {
        return this.http.delete(Test_Script_API + `stories/scripts/deleteFile/${fileId}`).pipe();
    }

    updateTestScript(testScript: TestScript) {
        const organizationAndProjectIds = this.commonService.getOrganizationAndProjectIds();
        testScript.organizationId = organizationAndProjectIds?.organizationId
        testScript.projectId = organizationAndProjectIds?.projectId;
        return this.http.put(Test_Script_API + 'stories/scripts/' + testScript.testScriptId, testScript).pipe();
    }

    removeTestScript(storyId?: string, testScriptId?: string) {
      //https://api-test2.automationhq.ai/test-script-services/rest/api/stories/f88435d2-7238-4340-945a-f8f4c8a2e534/deleteTestSuiteWithTestScript/c042158d-9d52-4b6e-9da1-c1240183e0d3
        return this.http.delete(Test_Script_API + 'stories/' + storyId + '/deleteTestSuiteWithTestScript/' + testScriptId).pipe();
        //return this.http.delete(Test_Script_API + 'stories/scripts/' + testScriptId).pipe();
    }

    getTestScriptById(testScriptId: string): Observable<TestScript> {
        return this.http.get(Test_Script_API + 'stories/scripts/' + testScriptId).pipe(
            map(res => {
                return res as TestScript;
            })
        );
    }

    public locatorSpyStart(data) {
        return this.http
            .post("http://localhost:8088/rest/api/spy/start", { ...data })
            .pipe();
    }

    public locatorSpyStop() {
        return this.http.post("http://localhost:8088/rest/api/spy/stop", {}).pipe();
    }

    checkTestScriptExist(testScriptId: string) {
        return this.http.get<TestSuiteView[]>(`${Test_Script_API}stories/scripts/${testScriptId}/isAddedToTestSuites`).pipe();
    }

    checkAhqAgentIsRunning() {
        return this.http.get("http://localhost:8087/", {}).pipe();
    }
}
