import {defineStore} from 'pinia'
import {reactive, ref} from 'vue'
import * as noteService from '../services/noteService'
import type {PagingInfo} from '../types/api'
import type {Note, NoteListQuery, NotePayload} from '../types/note'

export const useNotesStore = defineStore('notes', () => {
    const notes = ref<Note[]>([])
    const paging = ref<PagingInfo | null>(null)
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    const filters = reactive<Required<NoteListQuery>>({
        page: 1,
        size: 12,
        query: '',
        sort: 'CreatedAt',
        order: 'DESC',
    })

    async function fetchNotes(): Promise<void> {
        isLoading.value = true
        error.value = null
        try {
            const result = await noteService.fetchNotes({...filters})
            notes.value = result.items
            paging.value = result.paging
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to load notes'
        } finally {
            isLoading.value = false
        }
    }

    async function createNote(payload: NotePayload): Promise<void> {
        await noteService.createNote(payload)
        filters.page = 1
        await fetchNotes()
    }

    async function updateNote(id: number, payload: NotePayload): Promise<void> {
        await noteService.updateNote(id, payload)
        await fetchNotes()
    }

    async function deleteNote(id: number): Promise<void> {
        await noteService.deleteNote(id)
        if (notes.value.length === 1 && filters.page > 1) {
            filters.page -= 1
        }
        await fetchNotes()
    }

    function setSearch(query: string): void {
        filters.query = query
        filters.page = 1
    }

    function setSort(sort: NoteListQuery['sort'], order: NoteListQuery['order']): void {
        filters.sort = sort ?? 'CreatedAt'
        filters.order = order ?? 'DESC'
        filters.page = 1
    }

    function setPage(page: number): void {
        filters.page = page
    }

    return {
        notes,
        paging,
        isLoading,
        error,
        filters,
        fetchNotes,
        createNote,
        updateNote,
        deleteNote,
        setSearch,
        setSort,
        setPage,
    }
})
