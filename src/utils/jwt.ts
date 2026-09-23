const CLAIM_KEYS = {
    email: ['email', 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
    firstName: ['given_name', 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'],
    lastName: ['family_name', 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname'],
} as const

export interface TokenUser {
    email: string | null
    firstName: string | null
    lastName: string | null
}

function decodePayload(token: string): Record<string, unknown> | null {
    try {
        const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
        const json = decodeURIComponent(
            atob(base64)
                .split('')
                .map((char) => '%' + char.charCodeAt(0).toString(16).padStart(2, '0'))
                .join(''),
        )
        return JSON.parse(json) as Record<string, unknown>
    } catch {
        return null
    }
}

function readClaim(payload: Record<string, unknown>, keys: readonly string[]): string | null {
    const value = keys.map((key) => payload[key]).find((v) => typeof v === 'string' && v.trim() !== '')
    return (value as string | undefined)?.trim() ?? null
}

export function getUserFromToken(token: string | null): TokenUser | null {
    if (!token) return null
    const payload = decodePayload(token)
    if (!payload) return null
    return {
        email: readClaim(payload, CLAIM_KEYS.email),
        firstName: readClaim(payload, CLAIM_KEYS.firstName),
        lastName: readClaim(payload, CLAIM_KEYS.lastName),
    }
}
