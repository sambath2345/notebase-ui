<script setup lang="ts">
import {reactive, ref} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useAuthStore} from '../stores/auth'
import BaseInput from '../components/BaseInput.vue'
import BaseButton from '../components/BaseButton.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const form = reactive({email: '', password: ''})
const isSubmitting = ref(false)
const errorMessage = ref<string | null>(null)

async function handleSubmit(): Promise<void> {
  isSubmitting.value = true
  errorMessage.value = null
  try {
    await authStore.login(form)
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/notes'
    await router.push(redirect)
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : 'Login failed'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-neutral-primary-soft px-4">
    <div class="w-full max-w-sm rounded-2xl bg-surface p-8 shadow-md">
      <h1 class="text-2xl font-bold text-heading">Welcome back</h1>
      <p class="mt-1 text-sm text-body">Sign in to view your notes.</p>

      <p v-if="route.query.registered"
         class="mt-4 rounded-lg bg-emerald-50 dark:bg-emerald-500/15 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-400">
        Account created. You can sign in now.
      </p>

      <form class="mt-6 space-y-4" @submit.prevent="handleSubmit">
        <BaseInput v-model="form.email" type="email" label="Email" placeholder="you@example.com" required/>
        <BaseInput v-model="form.password" type="password" label="Password" placeholder="••••••••" required/>

        <p v-if="errorMessage" class="text-sm text-fg-danger">{{ errorMessage }}</p>

        <BaseButton type="submit" class="w-full" :loading="isSubmitting">Login</BaseButton>
      </form>

      <p class="mt-6 text-center text-sm text-body">
        Don't have an account?
        <RouterLink to="/register" class="font-semibold text-fg-brand hover:underline">Create one</RouterLink>
      </p>
    </div>
  </div>
</template>
