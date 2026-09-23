<script setup lang="ts">
import {reactive, ref} from 'vue'
import {useRouter} from 'vue-router'
import {useAuthStore} from '../stores/auth'
import BaseInput from '../components/BaseInput.vue'
import BaseButton from '../components/BaseButton.vue'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  passwordConfirm: '',
})
const isSubmitting = ref(false)
const errorMessage = ref<string | null>(null)

async function handleSubmit(): Promise<void> {
  isSubmitting.value = true
  errorMessage.value = null
  try {
    await authStore.register(form)
    await router.push({name: 'login', query: {registered: '1'}})
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : 'Registration failed'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-neutral-primary-soft px-4 py-10">
    <div class="w-full max-w-sm rounded-2xl bg-surface p-8 shadow-md">
      <h1 class="text-2xl font-bold text-heading">Create your account</h1>
      <p class="mt-1 text-sm text-body">Start capturing your notes.</p>

      <form class="mt-6 space-y-4" @submit.prevent="handleSubmit">
        <div class="grid grid-cols-2 gap-3">
          <BaseInput v-model="form.firstName" label="First name" required/>
          <BaseInput v-model="form.lastName" label="Last name" required/>
        </div>
        <BaseInput v-model="form.email" type="email" label="Email" placeholder="you@example.com" required/>
        <BaseInput v-model="form.password" type="password" label="Password" placeholder="••••••••" required/>
        <BaseInput v-model="form.passwordConfirm" type="password" label="Confirm password" placeholder="••••••••"
                   required/>

        <p v-if="errorMessage" class="text-sm text-fg-danger">{{ errorMessage }}</p>

        <BaseButton type="submit" class="w-full" :loading="isSubmitting">Create account</BaseButton>
      </form>

      <p class="mt-6 text-center text-sm text-body">
        Already have an account?
        <RouterLink to="/login" class="font-semibold text-fg-brand hover:underline">Sign in</RouterLink>
      </p>
    </div>
  </div>
</template>
