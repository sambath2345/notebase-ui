<script setup lang="ts">
import BaseButton from './BaseButton.vue'

defineProps<{
  open: boolean
  title: string
  message: string
  isConfirming?: boolean
  errorMessage?: string | null
}>()

const emit = defineEmits<{
  cancel: []
  confirm: []
}>()
</script>

<template>
  <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      @click.self="emit('cancel')"
  >
    <div class="w-full max-w-sm rounded-2xl bg-surface p-6 shadow-xl">
      <h2 class="text-lg font-semibold text-heading">{{ title }}</h2>
      <p class="mt-2 text-sm break-words text-body">{{ message }}</p>
      <p v-if="errorMessage" class="mt-4 rounded-lg bg-danger-soft px-3 py-2 text-sm text-fg-danger">{{
          errorMessage
        }}</p>
      <div class="mt-6 flex justify-end gap-2">
        <BaseButton variant="secondary" :disabled="isConfirming" @click="emit('cancel')">Cancel</BaseButton>
        <BaseButton variant="danger" :loading="isConfirming" @click="emit('confirm')">Delete</BaseButton>
      </div>
    </div>
  </div>
</template>
