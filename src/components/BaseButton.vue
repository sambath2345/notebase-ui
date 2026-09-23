<script setup lang="ts">
withDefaults(
    defineProps<{
      variant?: 'primary' | 'secondary' | 'danger'
      type?: 'button' | 'submit'
      disabled?: boolean
      loading?: boolean
    }>(),
    {
      variant: 'primary',
      type: 'button',
      disabled: false,
      loading: false,
    },
)

const variantClasses: Record<string, string> = {
  primary: 'bg-brand text-white hover:bg-brand-strong focus-visible:outline-brand',
  secondary: 'bg-neutral-primary text-heading border border-default-strong hover:bg-neutral-secondary-soft focus-visible:outline-muted',
  danger: 'bg-danger text-white hover:bg-danger-strong focus-visible:outline-danger',
}
</script>

<template>
  <button
      :type="type"
      :disabled="disabled || loading"
      class="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      :class="variantClasses[variant]"
  >
    <span
        v-if="loading"
        class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        aria-hidden="true"
    />
    <slot/>
  </button>
</template>
