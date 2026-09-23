<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useAuthStore} from '../stores/auth'
import ThemeToggle from './ThemeToggle.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const navLinks = [{to: '/notes', label: 'My notes'}]

const isMenuOpen = ref(false)
const isUserMenuOpen = ref(false)
const userMenuRef = ref<HTMLElement | null>(null)

// Close both menus whenever the page changes
watch(
    () => route.fullPath,
    () => {
      isMenuOpen.value = false
      isUserMenuOpen.value = false
    },
)

function handleDocumentClick(event: MouseEvent): void {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
    isUserMenuOpen.value = false
  }
}

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    isUserMenuOpen.value = false
    isMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleDocumentClick)
  document.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick)
  document.removeEventListener('keydown', handleKeydown)
})

function handleLogout(): void {
  isUserMenuOpen.value = false
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <nav class="sticky top-0 z-30 w-full border-b border-default bg-neutral-primary">
    <div class="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
      <!-- Brand -->
      <RouterLink to="/notes" class="flex items-center gap-3">
        <span class="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-white">
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
               aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round"
                  d="M9 12h6m-6 4h4M7 3h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/>
          </svg>
        </span>
        <span class="self-center text-xl font-semibold whitespace-nowrap text-heading">NoteBase</span>
      </RouterLink>

      <!-- Right side: theme, user menu, hamburger -->
      <div class="flex items-center gap-2 md:order-2 md:gap-3">
        <ThemeToggle/>

        <div ref="userMenuRef" class="relative">
          <button
              type="button"
              class="flex items-center gap-2 rounded-full p-0.5 text-sm font-medium text-heading hover:bg-neutral-secondary-soft focus:ring-4 focus:ring-brand-medium focus:outline-none md:pe-3"
              aria-haspopup="menu"
              :aria-expanded="isUserMenuOpen"
              @click="isUserMenuOpen = !isUserMenuOpen"
          >
            <span class="sr-only">Open user menu</span>
            <span
                class="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-xs font-semibold text-white"
                aria-hidden="true">
              {{ authStore.initials }}
            </span>
            <span class="hidden max-w-40 truncate md:block">{{ authStore.displayName }}</span>
            <svg class="hidden h-4 w-4 text-muted md:block" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="m19 9-7 7-7-7"/>
            </svg>
          </button>

          <Transition
              enter-active-class="transition duration-100 ease-out"
              enter-from-class="scale-95 opacity-0"
              leave-active-class="transition duration-75 ease-in"
              leave-to-class="scale-95 opacity-0"
          >
            <div
                v-if="isUserMenuOpen"
                class="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-base border border-default-medium bg-neutral-primary-medium shadow-lg"
                role="menu"
            >
              <div class="border-b border-default px-4 py-3 text-sm">
                <span class="block truncate font-medium text-heading">{{ authStore.displayName }}</span>
                <span v-if="authStore.email" class="block truncate text-body">{{ authStore.email }}</span>
              </div>
              <ul class="p-2 text-sm font-medium text-body">
                <li>
                  <button
                      type="button"
                      class="inline-flex w-full items-center rounded p-2 text-fg-danger hover:bg-danger-soft"
                      role="menuitem"
                      @click="handleLogout"
                  >
                    Sign out
                  </button>
                </li>
              </ul>
            </div>
          </Transition>
        </div>

        <!-- Hamburger (mobile) -->
        <button
            type="button"
            class="inline-flex h-10 w-10 items-center justify-center rounded-base p-2 text-sm text-body hover:bg-neutral-secondary-soft hover:text-heading focus:ring-2 focus:ring-neutral-tertiary focus:outline-none md:hidden"
            aria-controls="navbar-main"
            :aria-expanded="isMenuOpen"
            @click="isMenuOpen = !isMenuOpen"
        >
          <span class="sr-only">{{ isMenuOpen ? 'Close main menu' : 'Open main menu' }}</span>
          <svg v-if="!isMenuOpen" class="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M5 7h14M5 12h14M5 17h14"/>
          </svg>
          <svg v-else class="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M6 6l12 12M18 6 6 18"/>
          </svg>
        </button>
      </div>

      <!-- Links: inline on desktop, collapsible panel on mobile -->
      <div id="navbar-main" class="w-full items-center justify-between md:order-1 md:flex md:w-auto"
           :class="isMenuOpen ? 'block' : 'hidden'">
        <ul
            class="mt-4 flex flex-col rounded-base border border-default bg-neutral-secondary-soft p-4 font-medium md:mt-0 md:flex-row md:gap-8 md:border-0 md:bg-neutral-primary md:p-0"
        >
          <li v-for="link in navLinks" :key="link.to">
            <RouterLink
                :to="link.to"
                custom
                v-slot="{ href, navigate, isActive }"
            >
              <a
                  :href="href"
                  :aria-current="isActive ? 'page' : undefined"
                  class="block rounded px-3 py-2 md:p-0"
                  :class="
                  isActive
                    ? 'bg-brand text-white md:bg-transparent md:text-fg-brand'
                    : 'text-heading hover:bg-neutral-tertiary md:hover:bg-transparent md:hover:text-fg-brand'
                "
                  @click="navigate"
              >
                {{ link.label }}
              </a>
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
