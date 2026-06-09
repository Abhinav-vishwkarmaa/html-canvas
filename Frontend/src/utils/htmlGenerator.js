import { getRootBlocks, getChildBlocks } from './blockUtils'
import { resolveBlockStyles } from './responsiveStyles'

function escapeHtml(str) {
  if (str == null) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function styleToString(styles, device = 'desktop') {
  const resolved = resolveBlockStyles(styles, device)
  return Object.entries(resolved)
    .filter(([, v]) => v !== undefined && v !== 'auto')
    .map(([k, v]) => {
      const prop = k.replace(/([A-Z])/g, '-$1').toLowerCase()
      const val = typeof v === 'number' && k !== 'fontWeight' ? `${v}px` : v
      return `${prop}:${val}`
    })
    .join(';')
}

function renderLinks(links = []) {
  return links.map((l) =>
    `<a href="${escapeHtml(l.url)}" style="color:inherit;text-decoration:none;margin:0 12px">${escapeHtml(l.label)}</a>`
  ).join('')
}

function renderNavbar(block, device) {
  const { logoText, buttonText, buttonLink, links } = block.content || {}
  const s = styleToString(block.styles, device)
  return `<nav style="${s};display:flex;align-items:center;justify-content:space-between;width:100%">
    <div style="font-weight:700;font-size:1.25rem;color:inherit">${escapeHtml(logoText)}</div>
    <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
      ${renderLinks(links)}
      ${buttonText ? `<a href="${escapeHtml(buttonLink)}" style="background:#2563eb;color:#fff;padding:8px 20px;border-radius:6px;text-decoration:none;margin-left:16px">${escapeHtml(buttonText)}</a>` : ''}
    </div>
  </nav>`
}

function renderHeader(block, device) {
  const { title, subtitle } = block.content || {}
  return `<header style="${styleToString(block.styles, device)};text-align:center;width:100%">
    <h1 style="font-size:2.5rem;font-weight:700;margin:0 0 8px;color:inherit">${escapeHtml(title)}</h1>
    <p style="font-size:1.125rem;opacity:0.8;margin:0;color:inherit">${escapeHtml(subtitle)}</p>
  </header>`
}

function renderHero(block, device) {
  const { title, subtitle, buttonText, buttonLink, imageUrl } = block.content || {}
  const s = styleToString(block.styles, device)
  return `<section style="${s};text-align:center;width:100%">
    <h1 style="font-size:3rem;font-weight:800;margin:0 0 16px;color:inherit">${escapeHtml(title)}</h1>
    <p style="font-size:1.25rem;opacity:0.9;margin:0 0 32px;color:inherit">${escapeHtml(subtitle)}</p>
    ${buttonText ? `<a href="${escapeHtml(buttonLink)}" style="display:inline-block;background:#fff;color:#2563eb;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:600">${escapeHtml(buttonText)}</a>` : ''}
    ${imageUrl ? `<img src="${escapeHtml(imageUrl)}" alt="" style="max-width:100%;margin-top:40px;border-radius:12px;display:block;margin-left:auto;margin-right:auto" />` : ''}
  </section>`
}

function renderText(block, device) {
  return `<div style="${styleToString(block.styles, device)};width:100%"><p style="margin:0;line-height:1.7;color:inherit">${escapeHtml(block.content?.text)}</p></div>`
}

function renderButton(block, device) {
  const { buttonText, buttonLink } = block.content || {}
  return `<div style="${styleToString(block.styles, device)};text-align:center;width:100%">
    <a href="${escapeHtml(buttonLink)}" style="display:inline-block;background:#2563eb;color:#fff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:600">${escapeHtml(buttonText)}</a>
  </div>`
}

function renderImage(block, device) {
  const { imageUrl, altText, caption } = block.content || {}
  return `<figure style="${styleToString(block.styles, device)};text-align:center;width:100%">
    ${imageUrl ? `<img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(altText || '')}" style="max-width:100%;border-radius:8px;display:block;margin:0 auto" />` : ''}
    ${caption ? `<figcaption style="margin-top:8px;font-size:0.875rem;opacity:0.7;color:inherit">${escapeHtml(caption)}</figcaption>` : ''}
  </figure>`
}

function renderCard(block, device) {
  const { title, bodyText, imageUrl } = block.content || {}
  return `<div style="${styleToString(block.styles, device)};width:100%">
    ${imageUrl ? `<img src="${escapeHtml(imageUrl)}" alt="" style="width:100%;border-radius:8px;margin-bottom:16px;display:block" />` : ''}
    <h3 style="font-size:1.25rem;font-weight:600;margin:0 0 8px;color:inherit">${escapeHtml(title)}</h3>
    <p style="margin:0;line-height:1.6;opacity:0.8;color:inherit">${escapeHtml(bodyText)}</p>
  </div>`
}

function renderForm(block, device) {
  const { title, buttonText, fields } = block.content || {}
  const fieldsHtml = (fields || []).map((f) => {
    if (f.type === 'textarea') {
      return `<div style="margin-bottom:16px"><label style="display:block;margin-bottom:4px;font-weight:500;color:inherit">${escapeHtml(f.label)}</label><textarea style="width:100%;padding:10px;border:1px solid #e2e8f0;border-radius:6px;box-sizing:border-box" rows="4"></textarea></div>`
    }
    return `<div style="margin-bottom:16px"><label style="display:block;margin-bottom:4px;font-weight:500;color:inherit">${escapeHtml(f.label)}</label><input type="${escapeHtml(f.type)}" style="width:100%;padding:10px;border:1px solid #e2e8f0;border-radius:6px;box-sizing:border-box" /></div>`
  }).join('')
  return `<form style="${styleToString(block.styles, device)};max-width:480px;margin:0 auto;width:100%">
    <h2 style="font-size:1.5rem;font-weight:600;margin:0 0 24px;text-align:center;color:inherit">${escapeHtml(title)}</h2>
    ${fieldsHtml}
    <button type="button" style="width:100%;background:#2563eb;color:#fff;padding:12px;border:none;border-radius:8px;font-weight:600;cursor:pointer">${escapeHtml(buttonText)}</button>
  </form>`
}

function renderDivider(block, device) {
  const resolved = resolveBlockStyles(block.styles, device)
  return `<hr style="border:none;border-top:${resolved.borderWidth || 1}px ${block.content?.style || 'solid'} ${resolved.borderColor || '#e2e8f0'};margin:${resolved.marginTop || 0}px 0 ${resolved.marginBottom || 0}px;width:100%" />`
}

function renderContainer(block, layout, device) {
  const children = getChildBlocks(layout, block.id)
  const cols = block.content?.columns || 2
  const childrenHtml = children.map((c) => renderBlock(c, layout, device)).join('')
  return `<div style="${styleToString(block.styles, device)};display:grid;grid-template-columns:repeat(${cols},1fr);gap:16px;width:100%">${childrenHtml}</div>`
}

function renderFooter(block, device) {
  const { footerText, links } = block.content || {}
  return `<footer style="${styleToString(block.styles, device)};text-align:center;width:100%">
    <p style="margin:0 0 8px;color:inherit">${escapeHtml(footerText)}</p>
    <div>${renderLinks(links)}</div>
  </footer>`
}

function renderBlock(block, layout, device = 'desktop') {
  if (!block?.type) return ''
  const renderers = {
    navbar: renderNavbar,
    header: renderHeader,
    hero: renderHero,
    text: renderText,
    button: renderButton,
    image: renderImage,
    card: renderCard,
    form: renderForm,
    divider: renderDivider,
    container: (b) => renderContainer(b, layout, device),
    footer: renderFooter,
  }
  const renderer = renderers[block.type]
  return renderer ? renderer(block, device) : ''
}

export function generateHTML(layout, title = 'My Website', device = 'desktop') {
  if (!Array.isArray(layout) || layout.length === 0) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <style>
    body { font-family: system-ui, sans-serif; display:flex; align-items:center; justify-content:center; min-height:100vh; color:#64748b; }
  </style>
</head>
<body><p>No content yet. Add blocks in TemplateCraft and export again.</p></body>
</html>`
  }

  const roots = getRootBlocks(layout)
  const body = roots.map((b) => renderBlock(b, layout, device)).join('\n')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      line-height: 1.5;
      color: #1e293b;
      background: #ffffff;
      min-height: 100vh;
    }
    img { max-width: 100%; height: auto; display: block; }
    a { color: inherit; }
    @media (max-width: 768px) {
      h1 { font-size: 2rem !important; }
      nav { flex-direction: column !important; gap: 12px !important; }
    }
  </style>
</head>
<body>
${body}
</body>
</html>`
}

function sanitizeFilename(str) {
  return (str || 'export').replace(/[^a-z0-9]/gi, '_').toLowerCase()
}

export function downloadHTML(layout, title, device = 'desktop') {
  const html = generateHTML(layout, title, device)
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${sanitizeFilename(title)}.html`
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  setTimeout(() => {
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, 200)
}
