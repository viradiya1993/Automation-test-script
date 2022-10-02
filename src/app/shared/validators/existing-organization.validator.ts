import { Observable, timer as observableTimer } from 'rxjs';

import { map, switchMap } from 'rxjs/operators';
import { OrganizationService } from '@core/services/';
import { Directive } from '@angular/core';
import { AbstractControl, AsyncValidator, AsyncValidatorFn, NG_ASYNC_VALIDATORS, ValidationErrors } from '@angular/forms';

export function existingOrganizationValidator(organizationService: OrganizationService): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
        const debounceTime = 500; // milliseconds
        return observableTimer(debounceTime).pipe(switchMap(() => {
            return organizationService.validateOrgName(control.value).pipe(
                map((res: any) => {
                    return (res.status !== 200) ? { "organizationExists": true } : null;
                })
            );
        }));
    };
}

@Directive({
    selector: '[organizationExists][formControlName],[organizationExists][formControl],[organizationExists][ngModel]',
    providers: [{ provide: NG_ASYNC_VALIDATORS, useExisting: ExistingOrganizationValidatorDirective, multi: true }]
})
export class ExistingOrganizationValidatorDirective implements AsyncValidator {
    constructor(private organizationService: OrganizationService) {
    }

    validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
        return existingOrganizationValidator(this.organizationService)(control);
    }
}
