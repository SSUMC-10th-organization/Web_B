export type CommonResponse<T> = {
    status : boolean;
    statusCode : number;
    message : string;
    data : T;
}

export type CursorBasedResponse<T> = {
    status : boolean;
    statusCode : number;
    message : string;
    data : T;
    nextCursor : number;
    hasNext : boolean;
}

export const PAGINATION_ORDER = {
    ASC: "asc",
    DESC: "desc"
} as const;
export type PaginationDto = {
    cursor? : number;
    limit? : number;
    search? : string;
    order?: typeof PAGINATION_ORDER[keyof typeof PAGINATION_ORDER];
    enabled : boolean;
}