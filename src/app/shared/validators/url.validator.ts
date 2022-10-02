import { AbstractControl } from '@angular/forms';

export function UrlValidator(control: AbstractControl) {
    let validUrl = true;

    try {
        // tslint:disable-next-line:no-unused-expression
        new URL(control.value)
    } catch {
        validUrl = false;
    }

    return validUrl ? null : { invalidUrl: true };
}
