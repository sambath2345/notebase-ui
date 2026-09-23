export interface PagingInfo {
    page: number
    size: number
    totalPage: number
    totals: number
}

export interface StructureRS<T> {
    status: number
    message: string
    messageKey: string
    data: T
    paging: PagingInfo | null
}
