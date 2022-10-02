import { EntityType } from "../enums";

export interface NameFilterResult {
    id: string;
    name: string;
    type: EntityType;
}
