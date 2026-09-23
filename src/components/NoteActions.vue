<script setup lang="ts">
withDefaults(
    defineProps<{
      // Show "Edit" / "Delete" text next to the icons (from the md breakpoint up)
      showLabels?: boolean
    }>(),
    {showLabels: false},
)

defineEmits<{
  edit: []
  delete: []
}>()
</script>

<template>
  <div class="flex items-center gap-1.5">
    <button
        type="button"
        title="Edit note"
        aria-label="Edit note"
        class="inline-flex items-center gap-1.5 rounded-lg border border-default px-2 py-1.5 text-xs font-medium text-body transition hover:border-brand/40 hover:bg-brand-soft hover:text-fg-brand focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:outline-none"
        @click.stop="$emit('edit')"
        @keydown.enter.stop
    >
      <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
           aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M16.9 3.6a2 2 0 0 1 2.8 2.8L8 18l-4 1 1-4L16.9 3.6Z"/>
      </svg>
      <span v-if="showLabels" class="hidden md:inline">Edit</span>
    </button>
    <button
        type="button"
        title="Delete note"
        aria-label="Delete note"
        class="inline-flex items-center gap-1.5 rounded-lg border border-default px-2 py-1.5 text-xs font-medium text-body transition hover:border-danger/40 hover:bg-danger-soft hover:text-fg-danger focus-visible:ring-2 focus-visible:ring-danger/40 focus-visible:outline-none"
        @click.stop="$emit('delete')"
        @keydown.enter.stop
    >
      <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
           aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round"
              d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/>
      </svg>
      <span v-if="showLabels" class="hidden md:inline">Delete</span>
    </button>
  </div>
</template>
