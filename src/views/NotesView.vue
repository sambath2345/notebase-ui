<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'
import {useNotesStore} from '../stores/notes'
import type {Note, NotePayload} from '../types/note'
import BaseButton from '../components/BaseButton.vue'
import NoteTable from '../components/NoteTable.vue'
import NoteFormModal from '../components/NoteFormModal.vue'
import NoteDetailModal from '../components/NoteDetailModal.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'

const notesStore = useNotesStore()

const isFormOpen = ref(false)
const editingNote = ref<Note | null>(null)
const isSaving = ref(false)
const formError = ref<string | null>(null)

const detailNote = ref<Note | null>(null)
const isDetailOpen = ref(false)

const pendingDeleteNote = ref<Note | null>(null)
const isDeleting = ref(false)
const deleteError = ref<string | null>(null)

const totalNotes = computed(() => notesStore.paging?.totals ?? notesStore.notes.length)
// Row number of the first note on the current page (page 2 starts at size + 1)
const startNumber = computed(() => (notesStore.filters.page - 1) * notesStore.filters.size + 1)
// Skeleton only while nothing is on screen yet; refetches keep the table visible (dimmed)
const showSkeleton = computed(() => notesStore.isLoading && notesStore.notes.length === 0)

onMounted(() => {
  notesStore.fetchNotes()
})

function openCreateForm(): void {
  editingNote.value = null
  formError.value = null
  isFormOpen.value = true
}

function openEditForm(note: Note): void {
  editingNote.value = note
  formError.value = null
  isFormOpen.value = true
  isDetailOpen.value = false
}

function openDetail(note: Note): void {
  detailNote.value = note
  isDetailOpen.value = true
}

async function handleFormSubmit(payload: NotePayload): Promise<void> {
  isSaving.value = true
  formError.value = null
  try {
    if (editingNote.value) {
      await notesStore.updateNote(editingNote.value.id, payload)
    } else {
      await notesStore.createNote(payload)
    }
    isFormOpen.value = false
  } catch (err) {
    formError.value = err instanceof Error ? err.message : 'Failed to save note'
  } finally {
    isSaving.value = false
  }
}

function requestDelete(note: Note): void {
  pendingDeleteNote.value = note
  deleteError.value = null
  isDetailOpen.value = false
}

function cancelDelete(): void {
  if (!isDeleting.value) pendingDeleteNote.value = null
}

async function confirmDelete(): Promise<void> {
  if (!pendingDeleteNote.value) return
  isDeleting.value = true
  deleteError.value = null
  try {
    await notesStore.deleteNote(pendingDeleteNote.value.id)
    pendingDeleteNote.value = null
  } catch (err) {
    deleteError.value = err instanceof Error ? err.message : 'Failed to delete note'
  } finally {
    isDeleting.value = false
  }
}

function goToPage(page: number): void {
  notesStore.setPage(page)
  notesStore.fetchNotes()
  window.scrollTo({top: 0, behavior: 'smooth'})
}
</script>

<template>
  <div>
    <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-heading">My notes</h1>
        <p v-if="notesStore.paging || notesStore.notes.length" class="mt-1 text-sm text-body">
          {{ totalNotes }} {{ totalNotes === 1 ? 'note' : 'notes' }}
        </p>
      </div>
      <BaseButton @click="openCreateForm">
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
             aria-hidden="true">
          <path stroke-linecap="round" d="M12 5v14M5 12h14"/>
        </svg>
        New note
      </BaseButton>
    </div>

    <div
        v-if="notesStore.error"
        class="mb-4 flex items-center justify-between gap-4 rounded-lg border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-fg-danger"
    >
      <span>{{ notesStore.error }}</span>
      <button type="button" class="shrink-0 font-semibold hover:underline" @click="notesStore.fetchNotes()">Retry
      </button>
    </div>

    <!-- Loading skeleton -->
    <div v-if="showSkeleton" class="space-y-2">
      <div v-for="n in 6" :key="n"
           class="h-14 animate-pulse rounded-xl border border-default bg-neutral-secondary-soft"/>
    </div>

    <!-- Empty state -->
    <div
        v-else-if="notesStore.notes.length === 0 && !notesStore.error"
        class="rounded-xl border border-dashed border-default-strong bg-surface/60 px-6 py-16 text-center"
    >
      <span class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-fg-brand">
        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round"
                d="M9 12h6m-6 4h4M7 3h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/>
        </svg>
      </span>
      <p class="font-medium text-heading">No notes yet</p>
      <p class="mt-1 text-sm text-body">Create your first note to get started.</p>
      <BaseButton class="mt-4" @click="openCreateForm">New note</BaseButton>
    </div>

    <!-- Notes table -->
    <NoteTable
        v-else-if="notesStore.notes.length > 0"
        class="transition-opacity"
        :class="{ 'pointer-events-none opacity-60': notesStore.isLoading }"
        :notes="notesStore.notes"
        :start-number="startNumber"
        @view="openDetail"
        @edit="openEditForm"
        @delete="requestDelete"
    />

    <nav
        v-if="notesStore.paging && notesStore.paging.totalPage > 1"
        class="mt-8 flex flex-wrap items-center justify-center gap-1"
        aria-label="Pagination"
    >
      <button
          type="button"
          class="rounded-lg px-3 py-1.5 text-sm font-medium text-body transition hover:bg-neutral-tertiary disabled:opacity-40 disabled:hover:bg-transparent"
          :disabled="notesStore.filters.page <= 1"
          @click="goToPage(notesStore.filters.page - 1)"
      >
        Prev
      </button>
      <button
          v-for="page in notesStore.paging.totalPage"
          :key="page"
          type="button"
          class="h-8 w-8 rounded-lg text-sm font-medium transition"
          :class="page === notesStore.filters.page ? 'bg-brand text-white' : 'text-body hover:bg-neutral-tertiary'"
          :aria-current="page === notesStore.filters.page ? 'page' : undefined"
          @click="goToPage(page)"
      >
        {{ page }}
      </button>
      <button
          type="button"
          class="rounded-lg px-3 py-1.5 text-sm font-medium text-body transition hover:bg-neutral-tertiary disabled:opacity-40 disabled:hover:bg-transparent"
          :disabled="notesStore.filters.page >= notesStore.paging.totalPage"
          @click="goToPage(notesStore.filters.page + 1)"
      >
        Next
      </button>
    </nav>

    <NoteFormModal
        :open="isFormOpen"
        :note="editingNote"
        :is-saving="isSaving"
        :error-message="formError"
        @close="isFormOpen = false"
        @submit="handleFormSubmit"
    />

    <NoteDetailModal
        :open="isDetailOpen"
        :note="detailNote"
        @close="isDetailOpen = false"
        @edit="openEditForm"
        @delete="requestDelete"
    />

    <ConfirmDialog
        :open="pendingDeleteNote !== null"
        title="Delete note"
        :message="`“${pendingDeleteNote?.title ?? ''}” will be permanently deleted. This can't be undone.`"
        :is-confirming="isDeleting"
        :error-message="deleteError"
        @cancel="cancelDelete"
        @confirm="confirmDelete"
    />
  </div>
</template>
