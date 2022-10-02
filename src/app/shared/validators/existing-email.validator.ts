import { Directive } from '@angular/core';
import { AbstractControl, AsyncValidator, AsyncValidatorFn, NG_ASYNC_VALIDATORS, ValidationErrors } from '@angular/forms';
import { Observable } from "rxjs";

import { RegisterService } from '@app/core/services';
import { map } from 'rxjs/operators';

export function existingEmailValidator(registerService: RegisterService): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
        return registerService.validateEmail(control.value).pipe(
            map((res: any) => {
                return (res.status !== 200) ? { "emailExists": true } : null;
            })
        );
    };
}

@Directive({
    selector: '[emailExists][formControlName],[emailExists][formControl],[emailExists][ngModel]',
    providers: [{ provide: NG_ASYNC_VALIDATORS, useExisting: ExistingEmailValidatorDirective, multi: true }]
})
export class ExistingEmailValidatorDirective implements AsyncValidator {
    constructor(private registerService: RegisterService) {
    }

    validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
        return existingEmailValidator(this.registerService)(control);
    }
}
