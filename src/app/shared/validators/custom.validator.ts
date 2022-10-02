import { AbstractControl, ValidationErrors } from '@angular/forms';

export class CustomValidator {
    static cannotContainSpace(control: AbstractControl): ValidationErrors | null {
        if ((control?.value || "").toString().indexOf(' ') >= 0) {
            return { cannotContainSpace: true }
        }
        return null;
    }
}
