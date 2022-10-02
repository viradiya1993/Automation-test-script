import { AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BrowserFormComponent } from '../browser-form/browser-form.component';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Browser } from '@app/shared/models';
import { BrowserService } from '@app/core/services';
import { merge, of as observableOf, Subject } from 'rxjs';
import { catchError, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { ConfigurationService } from '../../services/configuration.service';

declare const $: any;

@Component({
    selector: 'app-browser-list',
    templateUrl: './browser-list.component.html',
    styleUrls: ['./browser-list.component.scss']
})
export class BrowserListComponent implements OnInit, AfterViewInit, OnDestroy {
    componentDestroyed$: Subject<boolean> = new Subject();

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    displayedColumns: string[] = ["name", "value", "createdBy", "updatedBy", "actions"];
    browsers: Browser[] = [];
    browserToRemove: Browser;
    resultsLength = 0;
    isRateLimitReached = false;

    dialogClosedEvent = new EventEmitter();

    constructor(public dialog: MatDialog, private browserService: BrowserService, private configurationService: ConfigurationService) {
        this.configurationService.browserCreatedObs.pipe(takeUntil(this.componentDestroyed$)).subscribe(
            ({ browser }) => {
                this.getBrowsers();
            }
        );
        this.configurationService.browserUpdatedObs.pipe(takeUntil(this.componentDestroyed$)).subscribe(
            ({ browser }) => {
                this.getBrowsers();
            }
        );
        this.configurationService.browserDeletedObs.pipe(takeUntil(this.componentDestroyed$)).subscribe(
            ({ browser }) => {
                this.getBrowsers();
            }
        );
    }

    ngOnInit() {
        $("#removeBrowserConfirmation").on('hide.bs.modal', function () {
            this.browserToRemove = undefined;
        });
    }

    ngAfterViewInit() {

        // If the user changes the sort order, reset back to the first page.
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
        this.getBrowsers()
    }

    getBrowsers() {
        merge(this.sort.sortChange, this.paginator.page, this.dialogClosedEvent)
            .pipe(
                startWith({}),
                switchMap(() => {
                    return this.browserService.getBrowsers(
                        this.sort.active,
                        this.sort.direction,
                        this.paginator.pageIndex,
                        this.paginator.pageSize
                    );
                }),
                map(res => {
                    this.isRateLimitReached = false;
                    this.resultsLength = res.totalCount;
                    return res.data;
                }),
                catchError(() => {
                    this.isRateLimitReached = true;
                    return observableOf([]);
                })
            ).subscribe(data => this.browsers = data);
    }

    setBrowserToRemove(browser: Browser) {
        this.browserToRemove = browser;
    }

    removeBrowser(browser: Browser) {
        this.browserService.removeBrowser(browser.browserId).subscribe(() => {
            this.dialogClosedEvent.emit();
            this.configurationService.browserDeleted(browser);
        });
    }

    editBrowser(browser: Browser) {
        const dialogRef = this.dialog.open(BrowserFormComponent, { data: { 'browser': browser } });

        dialogRef.afterClosed().subscribe(result => {
            this.dialogClosedEvent.emit();
        });
    }

    ngOnDestroy() {
        this.componentDestroyed$.next(true);
        this.componentDestroyed$.complete();
    }
}
