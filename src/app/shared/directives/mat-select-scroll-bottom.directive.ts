import { Directive, EventEmitter, OnDestroy, Output } from '@angular/core';
import { MatSelect } from '@angular/material/select/';
import { fromEvent, Subject } from 'rxjs';
import { filter, switchMap, takeUntil, throttleTime } from 'rxjs/operators';

@Directive({
    selector: '[appMatSelectScrollBottom]'
})
export class MatSelectScrollBottomDirective implements OnDestroy {
    componentDestroyed$: Subject<boolean> = new Subject();

    @Output('appMatSelectScrollBottom') reachedBottom = new EventEmitter<void>();
    private readonly BOTTOM_SCROLL_OFFSET = 25;

    constructor(private matSelect: MatSelect) {
        this.matSelect.openedChange
            .pipe(takeUntil(this.componentDestroyed$))
            .pipe(filter(isOpened => !!isOpened),
                switchMap(isOpened => fromEvent(
                    this.matSelect.panel.nativeElement,
                    'scroll'
                ).pipe(throttleTime(50)))
            )
            .subscribe((event: any) => {
                if (
                    event.target.scrollTop >= (event.target.scrollHeight - event.target.offsetHeight - this.BOTTOM_SCROLL_OFFSET)) {
                    this.reachedBottom.emit();
                }
            });
    }

    ngOnDestroy(): void {
        this.componentDestroyed$.next(true);
        this.componentDestroyed$.complete();
    }
}
