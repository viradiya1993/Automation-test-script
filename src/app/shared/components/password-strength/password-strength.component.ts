import { Component, EventEmitter, Input, OnChanges, Output, SimpleChange } from '@angular/core';

@Component({
    selector: 'app-password-strength',
    templateUrl: './password-strength.component.html',
    styleUrls: ['./password-strength.component.scss']
})
export class PasswordStrengthComponent implements OnChanges {
    @Input() passwordToCheck: string;
    @Input() barLabel: string;
    @Input() barColors: Array<string>;
    @Input() baseColor: string;
    @Input() strengthLabels: Array<string>;
    @Output() onStrengthChanged: EventEmitter<number> = new EventEmitter<number>();

    bar0: string;
    bar1: string;
    bar2: string;
    bar3: string;
    bar4: string;

    strengthLabel: string;
    strengths: Array<string>;
    private colors: Array<string>;
    private defaultColors = ['#F00', '#F90', '#FF0', '#9F0', '#0F0'];
    private defaultBaseColor: string = '#DDD';

    constructor() {
        this.colors = this.defaultColors;
    }

    private static measureStrength(pass: string) {
        let score = 0;
        // award every unique letter until 5 repetitions
        let letters = {};
        for (let i = 0; i < pass.length; i++) {
            letters[pass[i]] = (letters[pass[i]] || 0) + 1;
            score += 5.0 / letters[pass[i]];
        }
        // bonus points for mixing it up
        let variations = {
            digits: /\d/.test(pass),
            lower: /[a-z]/.test(pass),
            upper: /[A-Z]/.test(pass),
            nonWords: /\W/.test(pass),
        };

        let variationCount = 0;
        for (let check in variations) {
            variationCount += (variations[check]) ? 1 : 0;
        }
        score += (variationCount - 1) * 10;
        return Math.trunc(score);
    }

    getStrengthIndexAndColor(password: string) {
        return this.getColor(PasswordStrengthComponent.measureStrength(password));
    }

    ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
        const password = changes['passwordToCheck'].currentValue;
        this.checkBarColors();
        this.setBarColors(5, this.baseColor);
        let strength = 0;
        if (password) {
            const c = this.getStrengthIndexAndColor(password);
            strength = c.idx - 1;
            this.setStrengthLabel(strength);
            this.setBarColors(c.idx, c.col);
        }
        this.onStrengthChanged.emit(strength);
    }

    private checkBarColors(): void {
        // Accept custom colors if input is valid, otherwise the default colors will be used
        if (this.barColors && this.barColors.length === 5) {
            this.colors = this.barColors.slice();
        } else {
            this.colors = this.defaultColors;
        }

        this.strengths = this.strengthLabels && this.strengthLabels.length === 5 ? this.strengthLabels.slice() : null;
        this.setStrengthLabel(0);

        if (!/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(this.baseColor)) {
            this.baseColor = this.defaultBaseColor;
        }
    }

    private getColor(score: number) {
        let idx = 0;
        if (score > 90) {
            idx = 4;
        } else if (score > 70) {
            idx = 3;
        } else if (score >= 40) {
            idx = 2;
        } else if (score >= 20) {
            idx = 1;
        }
        return {
            idx: idx + 1,
            col: this.colors[idx]
        };
    }

    private setBarColors(count: number, col: string) {
        for (let _n = 0; _n < count; _n++) {
            this['bar' + _n] = col;
        }
    }

    private setStrengthLabel(index: number) {
        if (this.strengths) {
            this.strengthLabel = this.strengths[index];
        }
    }
}
