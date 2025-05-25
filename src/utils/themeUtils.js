// src/utils/themeUtils.js
export function setTheme(value) {
  const themePath = `/themes/${value}.css`
  let link = document.getElementById('theme-style')

  if (!link) {
    link = document.createElement('link')
    link.id = 'theme-style'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
  }

  link.href = themePath
  sessionStorage.setItem('theme', value)
  window.dispatchEvent(new Event('theme-changed'))
}

export function detectInitialTheme() {
  const stored = sessionStorage.getItem('theme');
  if (stored) return stored;

  // Only call matchMedia if it exists
  if (typeof window !== 'undefined'
      && typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
}
