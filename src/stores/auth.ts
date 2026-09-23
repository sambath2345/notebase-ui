import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import * as authService from '../services/authService'
import { clearTokens, getAccessToken, setTokens } from '../services/tokenStorage'
import type { LoginPayload, RegisterPayload } from '../types/auth'
import { getUserFromToken } from '../utils/jwt'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(getAccessToken())
  const isAuthenticated = computed(() => accessToken.value !== null)

  const user = computed(() => getUserFromToken(accessToken.value))
  const email = computed(() => user.value?.email ?? null)
  // "First Last", falling back to the part of the email before "@"
  const displayName = computed(() => {
    const fullName = [user.value?.firstName, user.value?.lastName].filter(Boolean).join(' ')
    return fullName || email.value?.split('@')[0] || 'Account'
  })
  const initials = computed(() => {
    const first = user.value?.firstName?.[0]
    const last = user.value?.lastName?.[0]
    return ((first ?? '') + (last ?? '') || displayName.value[0]).toUpperCase()
  })

  async function login(payload: LoginPayload): Promise<void> {
    const result = await authService.login(payload)
    if (!result.accessToken || !result.refreshToken) {
      throw new Error(result.message)
    }
    setTokens(result.accessToken, result.refreshToken)
    accessToken.value = result.accessToken
  }

  async function register(payload: RegisterPayload): Promise<void> {
    await authService.register(payload)
  }

  function logout(): void {
    clearTokens()
    accessToken.value = null
  }

  return { isAuthenticated, email, displayName, initials, login, register, logout }
})
