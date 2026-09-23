<script setup lang="ts">
defineProps<{
  modelValue: string
  label?: string
  type?: string
  placeholder?: string
  error?: string | null
  required?: boolean
  maxlength?: number
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <label class="block">
    <span v-if="label" class="mb-1 block text-sm font-medium text-heading">
      {{ label }}<span v-if="required" class="text-fg-danger" aria-hidden="true"> *</span>
    </span>
    <input
        :type="type ?? 'text'"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        :maxlength="maxlength"
        :aria-invalid="error ? true : undefined"
        class="w-full rounded-lg border border-default-strong bg-neutral-primary px-3 py-2 text-sm text-heading placeholder:text-muted shadow-sm transition focus:border-brand focus:ring-2 focus:ring-brand/25 focus:outline-none"
        :class="error ? 'border-danger focus:border-danger focus:ring-danger/25' : ''"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <slot name="hint"/>
    <p v-if="error" class="mt-1 text-xs text-fg-danger">{{ error }}</p>
  </label>
</template>
