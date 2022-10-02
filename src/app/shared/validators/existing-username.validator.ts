import { Observable, timer as observableTimer } from 'rxjs';

import { map, switchMap } from 'rxjs/operators';
import { Directive } from '@angular/core';
import { AbstractControl, AsyncValidator, AsyncValidatorFn, NG_ASYNC_VALIDATORS, ValidationErrors } from '@angular/forms';

import { RegisterService } from '@app/core/services';

export function existingUsernameValidator(registerService: RegisterService): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
        const debounceTime = 500; //milliseconds
        return observableTimer(debounceTime).pipe(switchMap(() => {
            return registerService.validateUserName(control.value).pipe(
                map((res: any) => {
                    return (res.status !== 200) ? { "usernameExists": true } : null;
                })
            );
        }));
    };
}

@Directive({
    selector: '[usernameExists][formControlName],[usernameExists][formControl],[usernameExists][ngModel]',
    providers: [{ provide: NG_ASYNC_VALIDATORS, useExisting: ExistingUsernameValidatorDirective, multi: true }]
})
export class ExistingUsernameValidatorDirective implements AsyncValidator {
    constructor(private registerService: RegisterService) {
    }

    validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
        return existingUsernameValidator(this.registerService)(control);
    }
}
