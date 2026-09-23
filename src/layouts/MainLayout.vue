<script setup lang="ts">
import AppNavbar from '../components/AppNavbar.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col bg-neutral-primary-soft">
    <AppNavbar/>

    <main class="mx-auto w-full max-w-screen-xl flex-1 px-4 py-6 sm:py-8">
      <RouterView/>
    </main>

    <footer class="border-t border-default bg-neutral-primary">
      <div class="mx-auto max-w-screen-xl px-4 py-4 text-center text-xs text-muted">
        © {{ new Date().getFullYear() }} NoteBase
      </div>
    </footer>
  </div>
</template>
