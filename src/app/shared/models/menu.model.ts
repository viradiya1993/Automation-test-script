export interface Menu {
    url: string;
    title: string;
    type?: string;
    iconType?: string;
    collapse?: string;
    hasChildren?: boolean;
    children?: ChildrenItems[];
    enabled: boolean;
}

export interface ChildrenItems {
    url: string;
    title: string;
    ab: string;
    iconType?: string;
    type?: string;
    collapse?: string;
    hasChildren?: boolean;
    children?: ChildrenItems[];
    enabled: boolean;
}
