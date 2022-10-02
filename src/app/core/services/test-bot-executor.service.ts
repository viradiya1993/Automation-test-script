import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Configuration, ConsolidatedExecution, Execution, IterationResult, TestScriptResult, TestSuiteResult, } from "@app/shared/models";
import { Grid_API, Test_Bot_Executor_API, Test_Bot_Executor_API_LOCAL, } from "@core/helpers";
import { map } from "rxjs/operators";
import { CommonService } from '@core/services/common.service';

@Injectable({
    providedIn: "root",
})
export class TestBotExecutorService {
    constructor(
        private http: HttpClient,
        private readonly commonService: CommonService,
    ) {
    }

    get testBotExecutionURL() {
        // TODO:: always call the api to get the data
        // return this.commonService.isUserPaid() ? Test_Bot_Executor_API : Test_Bot_Executor_API_LOCAL
        return Test_Bot_Executor_API
    }

    getIsLocalGrid(gridId: string) {
        return this.http.get(`${Grid_API}grids/${gridId}/isLocal`).pipe(
            map((res: any) => res),
        );
    }

    runTestBot(executeTestBot: any, isLocal: boolean) {
        const executionUrl = this.commonService.isUserPaid() ?
            (isLocal ? Test_Bot_Executor_API_LOCAL : Test_Bot_Executor_API) :
            Test_Bot_Executor_API_LOCAL;
        return this.http
            .post(
                executionUrl +
                "bots/" +
                executeTestBot.testBotId +
                "/execute",
                executeTestBot
            )
            .pipe(
                map((res) => {
                    return res as string;
                })
            );
    }

    getConsolidatedExecutionsByTestBotId(
        testBotId: string,
        pageNumber = 0,
        pageSize = 10,
        searchText = ""
    ) {
        let endPoint = `${this.testBotExecutionURL}executions/bots/${testBotId}?offset=${pageNumber}&size=${pageSize}`;
        if (searchText) {
            endPoint = `${endPoint}&search=${searchText}`;
        }
        return this.http.get(endPoint).pipe(
            map((res) => {
                return {
                    totalCount: res["totalElements"],
                    data: res["content"] as ConsolidatedExecution[],
                };
            })
        );
    }

    /* Orignal */
    getTestSuiteResult(testSuiteResultId: string) {
        return this.http
            .get(
                `${this.testBotExecutionURL}executions/testSuiteResults/${testSuiteResultId}`
            )
            .pipe(
                map((res) => {
                    return res as TestScriptResult[];
                })
            );
    }

    /* Duplicate With Pagination */
    getTestSuitPagination(
        testSuiteResultId: string,
        pageNumber = 0,
        pageSize = 10
    ) {
        return this.http
            .get(
                `${this.testBotExecutionURL}executions/testSuiteResults/${testSuiteResultId}?offset=${pageNumber}&size=${pageSize}`
            )
            .pipe(
                map((res) => {
                    return {
                        totalCount: 0,
                        data: res as TestScriptResult[],
                    };
                })
            );
    }

    getConsolidatedExecutions(pageNumber = 0, pageSize = 10) {
        return this.http
            .get(
                `${this.testBotExecutionURL}executions?offset=${pageNumber}&size=${pageSize}`
            )
            .pipe(
                map((res) => {
                    return {
                        totalCount: res["totalElements"],
                        data: res["content"] as ConsolidatedExecution[],
                    };
                })
            );
    }

    getExecutions(pageNumber = 0, pageSize = 10) {
        return this.http
            .get(
                `${this.testBotExecutionURL}executions?page=${pageNumber}&max=${pageSize}`
            )
            .pipe(
                map((res) => {
                    return {
                        totalCount: res["totalElements"],
                        data: res["content"] as Execution[],
                    };
                })
            );
    }

    getExecution(executionId: string) {
        return this.http
            .get(`${this.testBotExecutionURL}executions/${executionId}`)
            .pipe(
                map((result) => {
                    return result as TestSuiteResult[];
                })
            );
    }

    getConfiguration(testSuiteResultId: string) {
        return this.http
            .get(
                `${this.testBotExecutionURL}executions/testSuiteResults/${testSuiteResultId}/configuration`
            )
            .pipe(
                map((res) => {
                    return res as Configuration;
                })
            );
    }

    getIterationResults(testScriptResultId: string) {
        return this.http
            .get(
                `${this.testBotExecutionURL}executions/testScriptResults/${testScriptResultId}/iterations`
            )
            .pipe(
                map((res) => {
                    return res as IterationResult[];
                })
            );
    }

    getIterationResultById(testScriptResultId: string, iterationNumber: number) {
        return this.http
            .get(
                `${this.testBotExecutionURL}executions/testScriptResults/${testScriptResultId}/iterations/${iterationNumber}`
            )
            .pipe(
                map((res) => {
                    return res as IterationResult;
                })
            );
    }

    getGridStatus(executionId: string, sessionId: string) {
        return this.http
            .get(
                `${this.testBotExecutionURL}executions/${executionId}/agentStatus/${sessionId}`
            )
            .pipe(
                map((res) => {
                    return res as any;
                })
            );
    }
}
