import axios, {type AxiosRequestConfig, type InternalAxiosRequestConfig} from 'axios'
import type {StructureRS} from '../types/api'
import type {AuthResponse} from '../types/auth'
import {clearTokens, getAccessToken, getRefreshToken, setTokens} from './tokenStorage'

const baseURL = import.meta.env.VITE_API_BASE_URL as string

export const http = axios.create({baseURL})

http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getAccessToken()
    if (token) {
        config.headers.set('Authorization', `Bearer ${token}`)
    }
    return config
})

let refreshPromise: Promise<string | null> | null = null

async function refreshAccessToken(): Promise<string | null> {
    const refreshToken = getRefreshToken()
    if (!refreshToken) return null

    try {
        const response = await axios.post<StructureRS<AuthResponse>>(`${baseURL}/auth/refresh-token`, {
            refreshToken,
        })
        const {accessToken, refreshToken: newRefreshToken} = response.data.data
        if (!accessToken || !newRefreshToken) return null

        setTokens(accessToken, newRefreshToken)
        return accessToken
    } catch {
        return null
    }
}

interface RetryableRequestConfig extends AxiosRequestConfig {
    _retry?: boolean
}

http.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config as RetryableRequestConfig | undefined
        const status = error.response?.status
        const isAuthEndpoint = originalRequest?.url?.includes('/auth/')

        if (status === 401 && originalRequest && !originalRequest._retry && !isAuthEndpoint) {
            originalRequest._retry = true
            refreshPromise ??= refreshAccessToken().finally(() => {
                refreshPromise = null
            })

            const newToken = await refreshPromise
            if (newToken) {
                originalRequest.headers = {...originalRequest.headers, Authorization: `Bearer ${newToken}`}
                return http(originalRequest)
            }

            clearTokens()
            window.location.assign('/login')
        }

        const message = error.response?.data?.message ?? error.message ?? 'Something went wrong'
        return Promise.reject(new Error(message))
    },
)
