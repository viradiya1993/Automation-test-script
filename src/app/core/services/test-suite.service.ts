import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { TestBotView, TestScriptView, TestSuite } from "@app/shared/models";
import { map } from "rxjs/operators";
import { Test_Suite_API } from "@core/helpers";
import { CommonService } from '@core/services/common.service';

@Injectable({
    providedIn: "root",
})
export class TestSuiteService {
    test_Suite_api = Test_Suite_API + "suites";

    constructor(private http: HttpClient, private readonly commonService: CommonService) {
    }

    searchTestSuites(searchText: string) {
        return this.http
            .get(`${this.test_Suite_api}/list/search?search=${searchText}`)
            .pipe(
                map((res: any) => {
                    return {
                        totalCount: res?.length,
                        data: res as TestSuite[],
                    };
                })
            );
    }

    getTestSuites(
        sortColumn = "name",
        sortOrder = "asc",
        pageNumber = -1,
        pageSize = -1
    ) {
        return this.http
            .get(
                `${this.test_Suite_api}?offset=${pageNumber}&orderBy=${sortOrder}&size=${pageSize}&sortBy=${sortColumn}`
            )
            .pipe(
                map((res) => {
                    return {
                        totalCount: res["totalElements"],
                        data: res["content"] as TestSuite[],
                    };
                })
            );
    }

    getTestScripts(
        sortColumn = "name",
        sortOrder = "asc",
        pageNumber = 0,
        pageSize = 10
    ) {
        return this.http
            .get(
                `${this.test_Suite_api}/view/scripts?offset=${pageNumber}&orderBy=${sortOrder}&size=${pageSize}&sortBy=${sortColumn}`
            )
            .pipe(
                map((res) => {
                    return {
                        totalCount: res["totalElements"],
                        data: res["content"] as TestScriptView[],
                    };
                })
            );
    }

    addTestSuite(testSuite: TestSuite) {
        const organizationAndProjectIds = this.commonService.getOrganizationAndProjectIds();
        testSuite.organizationId = organizationAndProjectIds?.organizationId
        testSuite.projectId = organizationAndProjectIds?.projectId;
        return this.http.post(this.test_Suite_api, testSuite).pipe();
    }

    updateTestSuite(testSuite: TestSuite) {
        return this.http
            .put(`${this.test_Suite_api}/${testSuite.testSuiteId}`, testSuite)
            .pipe();
    }

    removeTestSuite(testSuiteId: string) {
        return this.http.delete(`${this.test_Suite_api}/${testSuiteId}`).pipe();
    }

    checkTestSuiteExist(testSuiteId: string) {
        return this.http
            .get<TestBotView[]>(
                `${this.test_Suite_api}/${testSuiteId}/isAddedToTestBots`
            )
            .pipe();
    }
}
