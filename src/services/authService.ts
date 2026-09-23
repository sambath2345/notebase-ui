import {http} from './http'
import type {StructureRS} from '../types/api'
import type {AuthResponse, LoginPayload, RegisterPayload} from '../types/auth'

export async function register(payload: RegisterPayload): Promise<void> {
    await http.post<StructureRS<{ id: number; email: string }>>('/auth/register', payload)
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
    const response = await http.post<StructureRS<AuthResponse>>('/auth/login', payload)
    return response.data.data
}
