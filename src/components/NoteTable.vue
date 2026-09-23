<script setup lang="ts">
import type {Note} from '../types/note'
import {formatDate} from '../utils/date'
import NoteActions from './NoteActions.vue'

defineProps<{
  notes: Note[]
  // Number of the first row on this page, so numbering continues across pages
  startNumber: number
}>()

defineEmits<{
  view: [note: Note]
  edit: [note: Note]
  delete: [note: Note]
}>()
</script>

<template>
  <div class="overflow-x-auto rounded-xl border border-default bg-surface shadow-sm">
    <table class="w-full table-fixed text-left text-sm">
      <thead
          class="border-b border-default bg-neutral-secondary-soft text-xs font-medium tracking-wide text-body uppercase">
      <tr>
        <th scope="col" class="w-14 px-4 py-3">No.</th>
        <th scope="col" class="w-2/5 px-4 py-3 md:w-1/4">Title</th>
        <th scope="col" class="hidden px-4 py-3 md:table-cell">Content</th>
        <th scope="col" class="w-32 px-4 py-3">Created At</th>
        <th scope="col" class="w-24 px-4 py-3 text-right md:w-44">Action</th>
      </tr>
      </thead>
      <tbody class="divide-y divide-default">
      <tr
          v-for="(note, index) in notes"
          :key="note.id"
          tabindex="0"
          class="group cursor-pointer transition hover:bg-neutral-secondary-soft focus-visible:bg-neutral-secondary-soft focus-visible:outline-none"
          @click="$emit('view', note)"
          @keydown.enter="$emit('view', note)"
      >
        <td class="px-4 py-3 text-muted tabular-nums">{{ startNumber + index }}</td>
        <td class="px-4 py-3">
          <p class="truncate font-semibold text-heading">{{ note.title }}</p>
          <!-- Content moves under the title on small screens -->
          <p class="truncate text-xs md:hidden" :class="note.content ? 'text-body' : 'text-muted italic'">
            {{ note.content || 'No content' }}
          </p>
        </td>
        <td class="hidden px-4 py-3 md:table-cell">
          <p class="truncate" :class="note.content ? 'text-body' : 'text-muted italic'">{{
              note.content || 'No content'
            }}</p>
        </td>
        <td class="px-4 py-3 whitespace-nowrap text-body">{{ formatDate(note.createdAt) }}</td>
        <td class="px-4 py-3">
          <NoteActions class="justify-end" show-labels @edit="$emit('edit', note)" @delete="$emit('delete', note)"/>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>
