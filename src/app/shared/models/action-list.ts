import { Params } from '@angular/router';

export interface ActionListQueryParams {
    key: string;
    value: string;
}

export interface ActionList {
    "id": string;
    "sequence": number;
    "name": string;
    "icon": string;
    "url": string;
    "roleId": string;
    "queryParams": Array<ActionListQueryParams> | Params;
}
