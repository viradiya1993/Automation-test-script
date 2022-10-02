import { Injectable } from '@angular/core';
import { Release, ReleaseFilter, ReleaseRun, ReleaseRunView } from '@app/shared/models';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Release_API } from '@core/helpers';
import { AUTH_USER } from '@shared/configs';
import { CommonService } from '@core/services/common.service';

@Injectable({
    providedIn: 'root'
})
export class ReleaseService {
    releaseApi: string = Release_API + 'releases';

    releases: Release[] = [];
    releaseRuns = [
        {
            "name": "1",
            "releaseView": {
                "releaseId": "3951c836-2adf-4ed8-963d-3cc9aa54ed77",
                "name": "Test Release",
                "description": "Test Release Description",
                "numberOfTestRuns": 0,
                "numberOfTestBots": 0
            },
            "progress": {
                "passed": 1,
                "failed": 1,
                "skipped": 0,
                "total": 1
            },
            "createdBy": {
                "userId": "fca06d50-6f0d-4af9-812c-4120a3a8d903",
                "firstName": "AutomationHQ",
                "lastName": "Support Team",
                "email": "rajesh23427@gmail.com"
            },
            "testBotExecutions": [
                {
                    "executionId": "b892908d-333a-42b7-bd7e-d0dd88f41b3e",
                    "name": "Test Release - AHQ Demo TestBot 1 - Run Number#1",
                    "executionConfiguration": {
                        "baseUrl": "Test Env",
                        "browser": "Chrome",
                        "type": "Web",
                        "gridUrl": "AHQ Grid Configuration (http://ec2-3-16-79-40.us-east-2.compute.amazonaws.com:4444/wd/hub)",
                        "timeout": 120,
                        "waitForElementTimeout": 20,
                        "screenshotAfterEachStep": false,
                        "screenshotOnError": true,
                        "screenshotOnFinish": true,
                        "closeBrowserAfterEachExecution": true,
                        "organizationId": "",
                        "projectId": "",
                        "configurationId": "",
                        "customProperties": []
                    },
                    // "createdDate": "2021-03-08",
                    // "startTime": "2021-03-08T12:07:10.955+0000",
                    // "endTime": "2021-03-08T12:08:04.803+0000",
                    "progress": {
                        "passed": 1,
                        "failed": 1,
                        "skipped": 0,
                        "total": 1
                    },
                    "testSuiteResults": [
                        {
                            "testSuiteResultId": "2a57ff32-2172-4550-b76c-a7cc0a6d8f6d",
                            "testExecutionId": "b892908d-333a-42b7-bd7e-d0dd88f41b3e",
                            "testBotId": "0cca2d42-54ec-49c6-ac4b-f4cfa672f13f",
                            "testSuiteId": "e7568c27-5e79-43e9-abd2-25852be6cb8a",
                            "testSuiteName": "AHQ Demo Test Suite 1",
                            "progress": {
                                "passed": 1,
                                "failed": 1,
                                "skipped": 0,
                                "total": 1
                            }
                        },
                        {
                            "testSuiteResultId": "2a57ff32-2172-4550-b76c-a7cc0a6d8f6d",
                            "testExecutionId": "b892908d-333a-42b7-bd7e-d0dd88f41b3e",
                            "testBotId": "0cca2d42-54ec-49c6-ac4b-f4cfa672f13f",
                            "testSuiteId": "e7568c27-5e79-43e9-abd2-25852be6cb8a",
                            "testSuiteName": "AHQ Demo Test Suite 2",
                            "progress": {
                                "passed": 1,
                                "failed": 1,
                                "skipped": 0,
                                "total": 1
                            }
                        },
                        {
                            "testSuiteResultId": "2a57ff32-2172-4550-b76c-a7cc0a6d8f6d",
                            "testExecutionId": "b892908d-333a-42b7-bd7e-d0dd88f41b3e",
                            "testBotId": "0cca2d42-54ec-49c6-ac4b-f4cfa672f13f",
                            "testSuiteId": "e7568c27-5e79-43e9-abd2-25852be6cb8a",
                            "testSuiteName": "AHQ Demo Test Suite 3",
                            "progress": {
                                "passed": 1,
                                "failed": 1,
                                "skipped": 0,
                                "total": 1
                            }
                        }
                    ],
                    "testBotView": {
                        "testBotId": "0cca2d42-54ec-49c6-ac4b-f4cfa672f13f",
                        "name": "AHQ Demo TestBot 1",
                        "numberOfTestSuites": 3
                    }
                }
            ]
        }
    ];

    constructor(private http: HttpClient, private readonly commonService: CommonService) {
    }

    getReleaseViews(pageNumber = -1, pageSize = -1) {
        return this.http.get(`${this.releaseApi}/view?offset=${pageNumber}&size=${pageSize}`).pipe(
            map(res => {
                return {
                    totalCount: res['totalElements'],
                    data: res["content"] as Release[]
                };
            })
        );
    }

    getReleases() {
        return this.http.get(`${this.releaseApi}`).pipe(
            map(res => {
                return {
                    totalCount: res['totalElements'],
                    data: res["content"] as Release[]
                };
            })
        );
    }

    getReleaseById(releaseId: string) {
        return this.http.get<Release>(`${this.releaseApi}/${releaseId}`).pipe();
    }

    executeRelease(releaseRun: ReleaseRun) {
        releaseRun.createdBy = JSON.parse(localStorage.getItem(AUTH_USER));
        return this.http.post(`${this.releaseApi}/${releaseRun.releaseId}/execute`, releaseRun).pipe();
    }

    addRelease(release: Release) {
        const organizationAndProjectIds = this.commonService.getOrganizationAndProjectIds();
        release.organizationId = organizationAndProjectIds?.organizationId;
        release.projectId = organizationAndProjectIds?.projectId;
        release.releaseId = (this.releases.length + 1).toString();
        release.testBots = [];
        return this.http.post(this.releaseApi, release).pipe();
    }

    updateRelease(release: Release) {
        return this.http.put(this.releaseApi + '/' + release.releaseId, release).pipe();
    }

    removeReleaseById(releaseId: string) {
        return this.http.delete(this.releaseApi + '/' + releaseId).pipe();
    }

    getReleaseRunsByFilter(releaseFilter: ReleaseFilter) {
        return this.http.post(`${this.releaseApi}/testRuns/query`, releaseFilter).pipe(
            map(res => {
                return {
                    totalCount: res['totalElements'],
                    data: res["content"] as ReleaseRunView[]
                };
            })
        );
    }
}
