import { ToastType } from "angular2-toaster";

export class MessageModel {
    type: ToastType;
    title?: string;
    body?: string;
    showCloseButton: true;
}
