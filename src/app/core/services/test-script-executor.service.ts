import { Injectable, NgZone } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Test_Script_Executor_API } from "@core/helpers";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Log } from "@app/shared/models";

@Injectable({
    providedIn: "root"
})
export class TestScriptExecutorService {
    constructor(private http: HttpClient, private zone: NgZone) {
        this.zone = new NgZone({ enableLongStackTrace: false });
    }

    ping() {
        return this.http.get(Test_Script_Executor_API + "ping").pipe();
    }

    stage(testScriptId: string) {
        return this.http
            .post(Test_Script_Executor_API + "script/" + testScriptId + "/stage", {})
            .pipe();
    }

    enableBreakpoint(testStepId: string) {
        return this.http
            .put(
                Test_Script_Executor_API + "steps/" + testStepId + "/breakpoint/enable",
                {}
            )
            .pipe();
    }

    disableBreakpoint(testStepId: string) {
        return this.http
            .put(
                Test_Script_Executor_API +
                "steps/" +
                testStepId +
                "/breakpoint/disable",
                {}
            )
            .pipe();
    }

    continue(testStepId: string) {
        return this.http
            .post(Test_Script_Executor_API + "steps/" + testStepId + "/continue", {})
            .pipe();
    }

    stepOver(testStepId: string) {
        return this.http
            .post(Test_Script_Executor_API + "steps/" + testStepId + "/stepover", {})
            .pipe();
    }

    debug() {
        return this.http.post(Test_Script_Executor_API + "steps/debug", {}).pipe();
    }

    run() {
        return this.http.post(Test_Script_Executor_API + "steps/run", {}).pipe();
    }

    logsRestart() {
        return this.http.post(Test_Script_Executor_API + "logs/restart", {}).pipe();
    }

    observeLogs(): Observable<Log> {
        return new Observable<any>(obs => {
            const es = new EventSource(Test_Script_Executor_API + "logs");
            es.addEventListener("message", (evt: any) => {
                obs.next(evt.data != null ? JSON.parse(evt.data) : evt.data);
            });
            return () => es.close();
        }).pipe(
            map((log: Log) => {
                return log;
            })
        );
    }

    watch(): Observable<Log> {
        return Observable.create(observer => {
            const eventSource = new EventSource(Test_Script_Executor_API + "logs");

            eventSource.onmessage = event =>
                this.zone.run(() => {
                    observer.next(JSON.parse(event.data));
                });
            eventSource.addEventListener("darko", (event: any) =>
                this.zone.run(() => {
                    observer.next(JSON.parse(event.data));
                })
            );

            eventSource.onerror = error =>
                this.zone.run(() => {
                    if (eventSource.readyState === eventSource.CLOSED) {
                        eventSource.close();
                        observer.complete();
                    } else {
                        observer.error(error);
                    }
                });
            return () => eventSource.close();
        });
    }
}
