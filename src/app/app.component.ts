import { delay, filter } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';

@Component({
    selector: 'app-my-app',
    templateUrl: './app.component.html',
})

export class AppComponent implements OnInit {
    private _router: Subscription;
    progressBar$: Observable<boolean>;

    constructor(
        private router: Router,
        private store: Store<{ progressBar: boolean }>,
    ) {
        this.progressBar$ = store.pipe(delay(0), select('progressBar'));
    }

    ngOnInit() {
        this._router = this.router.events.pipe(filter(event => event instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => {
                const body = document.getElementsByTagName('body')[0];
                const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
                if (body.classList.contains('modal-open')) {
                    body.classList.remove('modal-open');
                    modalBackdrop.remove();
                }
            });
    }
}
