function parseApiDate(value: string): Date {
    const hasZone = /(Z|[+-]\d{2}:?\d{2})$/i.test(value)
    return new Date(hasZone ? value : `${value}Z`)
}

export function formatDate(value: string): string {
    return parseApiDate(value).toLocaleDateString(undefined, {year: 'numeric', month: 'short', day: 'numeric'})
}

export function formatDateTime(value: string): string {
    return parseApiDate(value).toLocaleString(undefined, {dateStyle: 'medium', timeStyle: 'short'})
}

export function isEdited(createdAt: string, updatedAt: string): boolean {
    return parseApiDate(updatedAt).getTime() - parseApiDate(createdAt).getTime() > 1000
}
