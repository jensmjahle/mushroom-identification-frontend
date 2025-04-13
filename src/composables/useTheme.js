export const setTheme = (themeName, onLoadCallback) => {
  const id = 'theme-style'
  const existing = document.getElementById(id)
  if (existing) existing.remove()

  const link = document.createElement('link')
  link.id = id
  link.rel = 'stylesheet'
  link.href = `/themes/${themeName}.css`

  if (onLoadCallback) {
    link.onload = onLoadCallback
  }

  document.head.appendChild(link)
  localStorage.setItem('theme', themeName)
}
