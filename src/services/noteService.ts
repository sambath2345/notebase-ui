import {http} from './http'
import type {StructureRS} from '../types/api'
import type {Note, NoteListQuery, NotePayload} from '../types/note'

export interface NoteListResult {
    items: Note[]
    paging: StructureRS<Note[]>['paging']
}

export async function fetchNotes(query: NoteListQuery): Promise<NoteListResult> {
    const response = await http.get<StructureRS<Note[]>>('/notes', {params: query})
    return {items: response.data.data, paging: response.data.paging}
}

export async function fetchNoteById(id: number): Promise<Note> {
    const response = await http.get<StructureRS<Note>>(`/notes/${id}`)
    return response.data.data
}

export async function createNote(payload: NotePayload): Promise<Note> {
    const response = await http.post<StructureRS<Note>>('/notes', payload)
    return response.data.data
}

export async function updateNote(id: number, payload: NotePayload): Promise<Note> {
    const response = await http.put<StructureRS<Note>>(`/notes/${id}`, payload)
    return response.data.data
}

export async function deleteNote(id: number): Promise<void> {
    await http.delete<StructureRS<null>>(`/notes/${id}`)
}
