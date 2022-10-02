import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { HttpClient } from '@angular/common/http';
import { TEST_REPORT_API } from "@core/helpers";
import { TestBot, TestReport } from "@app/shared/models";

@Injectable({
    providedIn: "root",
})
export class TestReportService {
    reportApi = `${TEST_REPORT_API}testreports/`;

    constructor(private http: HttpClient) {
    }

    getBots() {
        return this.http.get(`${this.reportApi}bots`).pipe(
            map(res => {
                return res as TestBot;
            })
        );
    }

    getReports(botId) {
        return this.http.get(`${this.reportApi}${botId}`).pipe(
            map(res => {
                return res as TestReport;
            })
        );
    }

    getEpicReports(testBotId: String) {
        return this.http.get(this.reportApi + 'epicReport/' + testBotId).pipe();
    }

    getStoryReports(botId: string) {
        return this.http.get(this.reportApi + 'storyReport/' + botId).pipe();
    }
}
