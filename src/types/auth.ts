export interface RegisterPayload {
    firstName: string
    lastName: string
    email: string
    password: string
    passwordConfirm: string
}

export interface LoginPayload {
    email: string
    password: string
}

export interface AuthResponse {
    isSuccess: boolean
    message: string
    accessToken: string | null
    refreshToken: string | null
}
