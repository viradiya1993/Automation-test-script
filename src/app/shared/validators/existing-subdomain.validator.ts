import { Observable, timer as observableTimer } from "rxjs";

import { map, switchMap } from "rxjs/operators";
import { OrganizationService } from "@core/services/";
import { Directive } from "@angular/core";
import { AbstractControl, AsyncValidator, AsyncValidatorFn, NG_ASYNC_VALIDATORS, ValidationErrors, } from "@angular/forms";

export function existingSubdomainValidator(
    organizationService: OrganizationService
): AsyncValidatorFn {
    return (
        control: AbstractControl
    ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
        const debounceTime = 500; // milliseconds
        return observableTimer(debounceTime).pipe(
            switchMap(() => {
                return organizationService.validateSubDomain(control.value).pipe(
                    map((res: any) => {
                        return res.status !== 200 ? { subdomainExists: true } : null;
                    })
                );
            })
        );
    };
}

@Directive({
    selector:
        "[subdomainExists][formControlName],[subdomainExists][formControl],[subdomainExists][ngModel]",
    providers: [
        {
            provide: NG_ASYNC_VALIDATORS,
            useExisting: ExistingSubdomainValidatorDirective,
            multi: true,
        },
    ],
})
export class ExistingSubdomainValidatorDirective implements AsyncValidator {
    constructor(private organizationService: OrganizationService) {
    }

    validate(
        control: AbstractControl
    ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
        return existingSubdomainValidator(this.organizationService)(control);
    }
}
