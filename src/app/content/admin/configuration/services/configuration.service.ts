import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { Browser, Environment, Grid } from "@app/shared/models";

@Injectable({ providedIn: "root" })
export class ConfigurationService {
    public environmentCreatedObs: Observable<{ environment: Environment }>;
    public environmentUpdatedObs: Observable<{ environment: Environment }>;
    public environmentDeletedObs: Observable<{ environment: Environment }>;
    public browserCreatedObs: Observable<{ browser: Browser }>;
    public browserUpdatedObs: Observable<{ browser: Browser }>;
    public browserDeletedObs: Observable<{ browser: Browser }>;
    public gridCreatedObs: Observable<{ grid: Grid }>;
    public gridUpdatedObs: Observable<{ grid: Grid }>;
    public gridDeletedObs: Observable<{ grid: Grid }>;
    // Environment Created
    private environmentCreatedSubject: Subject<{ environment: Environment }>;
    // Environment Updated
    private environmentUpdatedSubject: Subject<{ environment: Environment }>;
    // Environment Deleted
    private environmentDeletedSubject: Subject<{ environment: Environment }>;
    // Browser Created
    private browserCreatedSubject: Subject<{ browser: Browser }>;
    // Browser Updated
    private browserUpdatedSubject: Subject<{ browser: Browser }>;
    // Browser Deleted
    private browserDeletedSubject: Subject<{ browser: Browser }>;
    // Grids Created
    private gridCreatedSubject: Subject<{ grid: Grid }>;
    // Grids Updated
    private gridUpdatedSubject: Subject<{ grid: Grid }>;
    // Grids Deleted
    private gridDeletedSubject: Subject<{ grid: Grid }>;

    constructor() {
        // Environment Created
        this.environmentCreatedSubject = new Subject<{
            environment: Environment;
        }>();
        this.environmentCreatedObs = this.environmentCreatedSubject.asObservable();

        // Environment Updated
        this.environmentUpdatedSubject = new Subject<{
            environment: Environment;
        }>();
        this.environmentUpdatedObs = this.environmentUpdatedSubject.asObservable();

        // Environment Deleted
        this.environmentDeletedSubject = new Subject<{
            environment: Environment;
        }>();
        this.environmentDeletedObs = this.environmentDeletedSubject.asObservable();

        // Browser Created
        this.browserCreatedSubject = new Subject<{
            browser: Browser;
        }>();
        this.browserCreatedObs = this.browserCreatedSubject.asObservable();

        // Browser Updated
        this.browserUpdatedSubject = new Subject<{
            browser: Browser;
        }>();
        this.browserUpdatedObs = this.browserUpdatedSubject.asObservable();

        // Browser Deleted
        this.browserDeletedSubject = new Subject<{
            browser: Browser;
        }>();
        this.browserDeletedObs = this.browserDeletedSubject.asObservable();

        // Grid Created
        this.gridCreatedSubject = new Subject<{
            grid: Grid;
        }>();
        this.gridCreatedObs = this.gridCreatedSubject.asObservable();

        // Grid Updated
        this.gridUpdatedSubject = new Subject<{
            grid: Grid;
        }>();
        this.gridUpdatedObs = this.gridUpdatedSubject.asObservable();

        // Grid Deleted
        this.gridDeletedSubject = new Subject<{
            grid: Grid;
        }>();
        this.gridDeletedObs = this.gridDeletedSubject.asObservable();
    }

    public environmentCreated(environment: Environment) {
        this.environmentCreatedSubject.next({ environment });
    }

    public environmentUpdated(environment: Environment) {
        this.environmentUpdatedSubject.next({ environment });
    }

    public environmentDeleted(environment: Environment) {
        this.environmentDeletedSubject.next({ environment });
    }

    public browserCreated(browser: Browser) {
        this.browserCreatedSubject.next({ browser });
    }

    public browserUpdated(browser: Browser) {
        this.browserUpdatedSubject.next({ browser });
    }

    public browserDeleted(browser: Browser) {
        this.browserDeletedSubject.next({ browser });
    }

    public gridCreated(grid: Grid) {
        this.gridCreatedSubject.next({ grid });
    }

    public gridUpdated(grid: Grid) {
        this.gridUpdatedSubject.next({ grid });
    }

    public gridDeleted(grid: Grid) {
        this.gridDeletedSubject.next({ grid });
    }
}
