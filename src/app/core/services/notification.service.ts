import { Injectable } from "@angular/core";
import Swal from "sweetalert2/dist/sweetalert2.js";

@Injectable({
    providedIn: "root",
})
export class NotificationService {
    Toast = Swal.mixin({
        showConfirmButton: false,
        showCloseButton: true,
        toast: true,
        padding: '0.5rem',
        background: '#9c27b0',
        customClass: 'swal-white-text',
    })

    constructor() {
    }

    async showNotification(
        title: string,
        from: 'top' | 'center' | 'bottom' = 'top',
        align: 'start' | 'end' = null,
        timer: number = 2000
    ) {
        await this.Toast.fire({
            timer: timer,
            position: from + (align ? ('-' + align) : ''),
            title: title,
        })
    }
}
