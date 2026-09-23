<script setup lang="ts">
import {ref, watch} from 'vue'
import {useDebouncedFn} from '../composables/useDebouncedFn'
import type {NoteListQuery} from '../types/note'
import BaseSelect from './BaseSelect.vue'

const props = defineProps<{
  search: string
  sort: NoteListQuery['sort']
  order: NoteListQuery['order']
}>()

const emit = defineEmits<{
  'update:search': [value: string]
  'update:sort': [sort: NoteListQuery['sort'], order: NoteListQuery['order']]
}>()

const searchInput = ref(props.search)
const debouncedEmitSearch = useDebouncedFn((value: string) => emit('update:search', value), 350)

watch(searchInput, (value) => debouncedEmitSearch(value))

const sortOptions: Array<{
  value: string;
  sort: NoteListQuery['sort'];
  order: NoteListQuery['order'];
  label: string
}> = [
  {value: 'CreatedAt:DESC', sort: 'CreatedAt', order: 'DESC', label: 'Newest first'},
  {value: 'CreatedAt:ASC', sort: 'CreatedAt', order: 'ASC', label: 'Oldest first'},
  {value: 'UpdatedAt:DESC', sort: 'UpdatedAt', order: 'DESC', label: 'Recently updated'},
  {value: 'Title:ASC', sort: 'Title', order: 'ASC', label: 'Title (A-Z)'},
  {value: 'Title:DESC', sort: 'Title', order: 'DESC', label: 'Title (Z-A)'},
]

function handleSortChange(value: string): void {
  const selected = sortOptions.find((option) => option.value === value)
  if (selected) emit('update:sort', selected.sort, selected.order)
}
</script>

<template>
  <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
    <div class="relative flex-1">
      <svg
          class="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7"/>
        <path stroke-linecap="round" d="m20 20-3.5-3.5"/>
      </svg>
      <input
          v-model="searchInput"
          type="search"
          placeholder="Search notes…"
          aria-label="Search notes"
          class="w-full rounded-lg border border-default-strong bg-neutral-primary text-heading py-2 pr-3 pl-9 text-sm shadow-sm focus:border-brand focus:ring-2 focus:ring-brand/25 focus:outline-none"
      />
    </div>

    <BaseSelect
        class="w-full sm:w-44"
        :model-value="`${sort}:${order}`"
        :options="sortOptions"
        aria-label="Sort notes"
        @update:model-value="handleSortChange"
    />
  </div>
</template>
