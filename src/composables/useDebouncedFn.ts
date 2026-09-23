export function useDebouncedFn<Args extends unknown[]>(
    fn: (...args: Args) => void,
    delayMs = 300,
): (...args: Args) => void {
    let timeoutId: ReturnType<typeof setTimeout> | undefined

    return (...args: Args) => {
        if (timeoutId) clearTimeout(timeoutId)
        timeoutId = setTimeout(() => fn(...args), delayMs)
    }
}
