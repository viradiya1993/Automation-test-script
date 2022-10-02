export interface Pageable {
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    sort: {
        sorted: boolean;
        unsorted: boolean;
    };
    unpaged: boolean;
}