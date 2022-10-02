import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'templateFilter'
})
export class TemplateFilterPipe implements PipeTransform {

    transform(items: any, filter: any): any {
        if (!filter) {
            return items;
        }

        if (!Array.isArray(items)) {
            return items;
        }

        if (filter && Array.isArray(items)) {
            const filterKeys = Object.keys(filter);
            return items.filter(item =>
                filterKeys.reduce((x, keyName) =>
                    (x && new RegExp(filter[keyName], 'gi').test(item[keyName])) ||
                    filter[keyName] == "", true)
            );
        }
    }
}
