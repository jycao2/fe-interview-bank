import { ref } from 'vue'

const theme = ref('light')
const STORAGE_KEY = 'feib-theme'

export function useTheme() {
  function apply(value) {
    theme.value = value
    document.documentElement.setAttribute('data-theme', value)
    localStorage.setItem(STORAGE_KEY, value)
  }

  function initTheme() {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'light' || saved === 'dark') {
      apply(saved)
      return
    }
    const prefersDark =
      window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    apply(prefersDark ? 'dark' : 'light')
  }

  function toggleTheme() {
    apply(theme.value === 'light' ? 'dark' : 'light')
  }

  return { theme, initTheme, toggleTheme }
}
