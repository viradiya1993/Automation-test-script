import { AfterViewInit, Component, OnDestroy, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { MessageService } from "./messageService.service";
import { Toast, ToasterConfig, ToasterService } from "angular2-toaster";
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: "app-message",
    templateUrl: "messageService.component.html",
    styleUrls: ["messageService.component.scss"],
    providers: [ToasterService],
})
export class MessageServiceComponent implements OnInit, OnDestroy, AfterViewInit {
    componentDestroyed$: Subject<boolean> = new Subject();
    messageDetail: Toast;

    public config1: ToasterConfig = new ToasterConfig({
        animation: "fade",
        newestOnTop: true,
        positionClass: "toast-top-center",
        showCloseButton: true,
        timeout: 2000,
    });
    private toasterService: ToasterService;

    constructor(public messageService: MessageService, toasterService: ToasterService) {
        this.toasterService = toasterService;
        this.messageService.loaderState.pipe(takeUntil(this.componentDestroyed$)).subscribe(
            (state: Toast) => {
                this.messageDetail = state;
                this.toasterService.pop(this.messageDetail);
            }
        );
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
    }

    ngOnDestroy() {
        this.componentDestroyed$.next(true);
        this.componentDestroyed$.complete();
    }
}
