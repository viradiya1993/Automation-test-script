import { Component, forwardRef, HostBinding, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'app-custom-text-box',
    templateUrl: './custom-text-box.component.html',
    styleUrls: ['./custom-text-box.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CustomTextBoxComponent),
            multi: true
        }
    ]
})
export class CustomTextBoxComponent implements ControlValueAccessor {
    @HostBinding('attr.id')
    externalId = '';
    private _ID = '';

    constructor() {
    }

    get id() {
        return this._ID;
    }

    @Input()
    set id(value: string) {
        this._ID = value;
        this.externalId = null;
    }

    @Input('value') _value = '';

    get value() {
        return this._value;
    }

    set value(val) {
        this._value = val;
        this.onChange(val);
        this.onTouched();
    }

    onChange: any = () => {
    };

    onTouched: any = () => {
    };

    getValue() {
        return this._value;
    }

    setValue(val) {
        this._value = val;
        this.onChange(val);
        this.onTouched();
    }

    registerOnChange(fn) {
        this.onChange = fn;
    }

    writeValue(value) {
        if (value) {
            this.value = value;
        }
    }

    registerOnTouched(fn) {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        throw new Error("Method not implemented.");
    }
}
