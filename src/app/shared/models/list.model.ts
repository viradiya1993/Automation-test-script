import { Pageable } from './pageable.model';

export interface List {
    content: any;
    first: boolean;
    last: boolean;
    number: number;
    numberOfElements: number;
    pageable: Pageable;
    size: number;
    sort: {
        sorted: boolean;
        unsorted: boolean;
    };
    totalElements: number;
    totalPages: number;
}
