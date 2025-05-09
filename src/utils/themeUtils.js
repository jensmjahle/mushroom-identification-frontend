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
  localStorage.setItem('theme', value)
}

export function detectInitialTheme() {
  return localStorage.getItem('theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
}
