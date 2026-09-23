<script setup lang="ts">
import type {Note} from '../types/note'
import BaseButton from './BaseButton.vue'
import {formatDateTime, isEdited} from '../utils/date'

defineProps<{ open: boolean; note: Note | null }>()

const emit = defineEmits<{
  close: []
  edit: [note: Note]
  delete: [note: Note]
}>()
</script>

<template>
  <div
      v-if="open && note"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      @click.self="emit('close')"
  >
    <div class="w-full max-w-lg rounded-2xl bg-surface p-6 shadow-xl" role="dialog" aria-modal="true"
         aria-labelledby="note-detail-title">
      <div class="flex items-start justify-between gap-4">
        <h2 id="note-detail-title" class="text-xl font-semibold break-words text-heading">{{ note.title }}</h2>
        <button
            type="button"
            class="-m-1 rounded-md p-1 text-muted transition hover:bg-neutral-tertiary hover:text-heading"
            aria-label="Close"
            @click="emit('close')"
        >
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M6 6l12 12M18 6 6 18"/>
          </svg>
        </button>
      </div>

      <dl class="mt-4 grid grid-cols-2 gap-3 rounded-lg bg-neutral-secondary-soft px-3 py-2 text-xs">
        <div>
          <dt class="text-muted">Created At</dt>
          <dd class="font-medium text-heading">{{ formatDateTime(note.createdAt) }}</dd>
        </div>
        <div>
          <dt class="text-muted">Updated At</dt>
          <dd class="font-medium text-heading">
            {{ isEdited(note.createdAt, note.updatedAt) ? formatDateTime(note.updatedAt) : 'Not edited yet' }}
          </dd>
        </div>
      </dl>

      <div class="mt-4">
        <h3 class="mb-1 text-xs font-medium text-muted">Content</h3>
        <div class="max-h-96 overflow-y-auto">
          <p v-if="note.content" class="text-sm whitespace-pre-wrap break-words text-heading">{{ note.content }}</p>
          <p v-else class="text-sm text-muted italic">No content</p>
        </div>
      </div>

      <div class="mt-6 flex justify-between gap-2">
        <BaseButton variant="secondary" class="!text-fg-danger" @click="emit('delete', note)">Delete</BaseButton>
        <BaseButton @click="emit('edit', note)">Edit note</BaseButton>
      </div>
    </div>
  </div>
</template>
