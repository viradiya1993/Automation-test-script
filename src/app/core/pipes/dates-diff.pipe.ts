import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'datesDiff'
})
export class DatesDiffPipe implements PipeTransform {

    transform(startDate: any, endDate: any): any {
        startDate = new Date(startDate);
        endDate = new Date(endDate);

        if (isNaN(startDate) || isNaN(endDate) || (startDate > endDate)) {
            return;
        }

        const deltaSeconds = ((endDate - startDate) / 1000);
        return this.format(this.calculateWeeksDaysHoursMinutesSeconds(deltaSeconds));
    }

    private calculateDaysHoursMinutesSeconds(delta: number): number[] {
        const days = Math.floor(delta / 60 / 60 / 24);
        const remainder = (delta - (days * 60 * 60 * 24));
        return ([days, ...this.calculateHoursMinutesSeconds(remainder)]);
    }

    private calculateHoursMinutesSeconds(delta: number): number[] {
        const hours = Math.floor(delta / 60 / 60);
        const remainder = (delta - (hours * 60 * 60));
        return ([hours, ...this.calculateMinutesSeconds(remainder)]);
    }

    private calculateMinutesSeconds(delta: number): number[] {
        const minutes = Math.floor(delta / 60);
        const remainder = (delta - (minutes * 60));
        return ([minutes, ...this.calculateSeconds(remainder)]);
    }

    private calculateSeconds(delta: number): number[] {
        return ([delta]);
    }

    private calculateWeeksDaysHoursMinutesSeconds(delta: number): number[] {
        const weeks = Math.floor(delta / 60 / 60 / 24 / 7);
        const remainder = (delta - (weeks * 60 * 60 * 24 * 7));
        return ([weeks, ...this.calculateDaysHoursMinutesSeconds(remainder)]);
    }

    private format(values: number[]): string {
        const units: string[] = ["w", "d", "h", "m", "s"];
        const parts: string[] = [];
        let firstValue = false;
        for (const index in values.slice()) {
            if (values[index] || firstValue) {
                parts.push(values[index].toLocaleString() + units[index]);
                firstValue = true;
            }
        }

        if (parts.length === 0) {
            parts.push("0" + units[4]);
        }

        return (parts.join(" "));
    }

}
