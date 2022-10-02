import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "orderBy"
})
export class OrderPipe implements PipeTransform {
    transform(array: any[], field: string): any[] {
        return array.sort((a, b) =>
            a[field].toLowerCase() !== b[field].toLowerCase()
                ? a[field].toLowerCase() < b[field].toLowerCase()
                    ? -1
                    : 1
                : 0
        );
    }
}
