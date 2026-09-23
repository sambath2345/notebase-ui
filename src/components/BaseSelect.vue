<script setup lang="ts" generic="T extends string">
import {computed, nextTick, onBeforeUnmount, onMounted, ref, useId} from 'vue'

// Custom dropdown so the open list follows the app theme (a native <select>
// popup is drawn by the browser/OS and ignores it).
const props = defineProps<{
  modelValue: T
  options: Array<{ value: T; label: string }>
  ariaLabel?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: T]
}>()

const idPrefix = useId()
const isOpen = ref(false)
const activeIndex = ref(0)
const rootRef = ref<HTMLElement | null>(null)
const listRef = ref<HTMLElement | null>(null)
const buttonRef = ref<HTMLButtonElement | null>(null)

const selectedLabel = computed(() => props.options.find((o) => o.value === props.modelValue)?.label ?? '')

function open(): void {
  isOpen.value = true
  activeIndex.value = Math.max(0, props.options.findIndex((o) => o.value === props.modelValue))
  nextTick(() => listRef.value?.focus())
}

function close(): void {
  isOpen.value = false
}

function select(value: T): void {
  emit('update:modelValue', value)
  close()
  buttonRef.value?.focus()
}

function handleListKeydown(event: KeyboardEvent): void {
  const last = props.options.length - 1
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    activeIndex.value = activeIndex.value >= last ? 0 : activeIndex.value + 1
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    activeIndex.value = activeIndex.value <= 0 ? last : activeIndex.value - 1
  } else if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    select(props.options[activeIndex.value].value)
  } else if (event.key === 'Escape') {
    close()
    buttonRef.value?.focus()
  } else if (event.key === 'Tab') {
    close()
  }
}

function handleDocumentClick(event: MouseEvent): void {
  if (rootRef.value && !rootRef.value.contains(event.target as Node)) close()
}

onMounted(() => document.addEventListener('click', handleDocumentClick))
onBeforeUnmount(() => document.removeEventListener('click', handleDocumentClick))
</script>

<template>
  <div ref="rootRef" class="relative">
    <button
        ref="buttonRef"
        type="button"
        class="flex w-full items-center justify-between gap-2 rounded-lg border border-default-strong bg-neutral-primary px-3 py-2 text-left text-sm text-heading shadow-sm transition focus:border-brand focus:ring-2 focus:ring-brand/25 focus:outline-none"
        aria-haspopup="listbox"
        :aria-expanded="isOpen"
        :aria-label="ariaLabel"
        @click="isOpen ? close() : open()"
        @keydown.down.prevent="open()"
    >
      <span class="truncate">{{ selectedLabel }}</span>
      <svg class="h-4 w-4 shrink-0 text-muted transition" :class="{ 'rotate-180': isOpen }" viewBox="0 0 24 24"
           fill="none" aria-hidden="true">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7"/>
      </svg>
    </button>

    <Transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="scale-95 opacity-0"
        leave-active-class="transition duration-75 ease-in"
        leave-to-class="scale-95 opacity-0"
    >
      <ul
          v-if="isOpen"
          ref="listRef"
          tabindex="-1"
          role="listbox"
          :aria-label="ariaLabel"
          :aria-activedescendant="`${idPrefix}-option-${activeIndex}`"
          class="absolute right-0 z-40 mt-2 w-full min-w-44 origin-top rounded-base border border-default-medium bg-neutral-primary-medium p-1.5 text-sm shadow-lg focus:outline-none"
          @keydown="handleListKeydown"
      >
        <li
            v-for="(option, index) in options"
            :id="`${idPrefix}-option-${index}`"
            :key="option.value"
            role="option"
            :aria-selected="option.value === modelValue"
            class="flex cursor-pointer items-center justify-between rounded px-2.5 py-2"
            :class="[
            index === activeIndex ? 'bg-neutral-tertiary-medium text-heading' : 'text-body',
            option.value === modelValue ? 'font-medium !text-fg-brand' : '',
          ]"
            @mouseenter="activeIndex = index"
            @click="select(option.value)"
        >
          {{ option.label }}
          <svg v-if="option.value === modelValue" class="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="m5 12 4.5 4.5L19 7"/>
          </svg>
        </li>
      </ul>
    </Transition>
  </div>
</template>
