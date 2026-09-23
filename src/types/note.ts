export interface Note {
    id: number
    title: string
    content: string | null
    createdAt: string
    updatedAt: string
}

export interface NoteListQuery {
    page?: number
    size?: number
    query?: string
    sort?: 'Id' | 'Title' | 'CreatedAt' | 'UpdatedAt'
    order?: 'ASC' | 'DESC'
}

export interface NotePayload {
    title: string
    content: string | null
}
