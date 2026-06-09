import { resolveBlockStyles } from '../utils/responsiveStyles'

export function styleToString(styles, device = 'desktop') {
  const resolved = resolveBlockStyles(styles, device)
  return Object.entries(resolved)
    .filter(([, v]) => v !== undefined && v !== 'auto' && v !== 'transparent')
    .map(([k, v]) => {
      const prop = k.replace(/([A-Z])/g, '-$1').toLowerCase()
      const val = typeof v === 'number' && !['fontWeight'].includes(k) ? `${v}px` : v
      return `${prop}:${val}`
    })
    .join(';')
}

export function renderLinks(links = []) {
  return links.map((l) =>
    `<a href="${l.url}" style="color:inherit;text-decoration:none;margin:0 12px">${l.label}</a>`
  ).join('')
}
