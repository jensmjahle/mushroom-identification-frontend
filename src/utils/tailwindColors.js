export function resolveTailwindColor(className) {
  const el = document.createElement('div')
  el.className = className
  el.style.display = 'none'
  document.body.appendChild(el)
  const color = getComputedStyle(el).backgroundColor
  document.body.removeChild(el)
  return color
}
