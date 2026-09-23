import {ref} from 'vue'

export type Theme = 'light' | 'dark'

const THEME_KEY = 'notebase.theme'

function readStoredTheme(): Theme | null {
    try {
        const value = localStorage.getItem(THEME_KEY)
        return value === 'light' || value === 'dark' ? value : null
    } catch {
        return null
    }
}

// Light by default; dark only when the user picked it with the toggle.
// Shared across all callers so every toggle stays in sync.
const theme = ref<Theme>(readStoredTheme() ?? 'light')

function applyTheme(value: Theme): void {
    document.documentElement.classList.toggle('dark', value === 'dark')
}

applyTheme(theme.value)

export function useTheme() {
    function setTheme(value: Theme): void {
        theme.value = value
        applyTheme(value)
        try {
            localStorage.setItem(THEME_KEY, value)
        } catch {
            // storage unavailable; theme still applies for this session
        }
    }

    function toggleTheme(): void {
        setTheme(theme.value === 'dark' ? 'light' : 'dark')
    }

    return {theme, setTheme, toggleTheme}
}
