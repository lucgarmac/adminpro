export interface TableColumn {
    id: string;
    label: string;
    type: TableColumnTypeEnum;
    fixed: boolean;
    columnWidth?: number;
}

export enum TableColumnTypeEnum {
    Data = 'data',
    Html = 'html'
}

export interface TablePagination {
    offset: number;
    limit: number;
    totalItems: number;
}