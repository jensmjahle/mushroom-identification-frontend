export const setTheme = (themeName) => {
  const id = 'theme-style'
  const existing = document.getElementById(id)
  if (existing) existing.remove()

  const link = document.createElement('link')
  link.id = id
  link.rel = 'stylesheet'
  link.href = `/themes/${themeName}.css`
  document.head.appendChild(link)

  localStorage.setItem('theme', themeName)
}

export const initTheme = () => {
  const saved = localStorage.getItem('theme') || 'light'
  
  setTheme(saved)
}
