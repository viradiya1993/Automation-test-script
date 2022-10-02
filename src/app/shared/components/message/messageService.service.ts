import { Injectable } from "@angular/core";
import { Toast } from "angular2-toaster";
import { Subject } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class MessageService {
    private loaderSubject = new Subject<Toast>();

    public loaderState = this.loaderSubject.asObservable();

    constructor() {
    }

    showMessage(messageDetail: Toast) {
        this.loaderSubject.next(messageDetail);
    }
}
