import { lazy } from 'react'
import {
  Navigation, PanelTop, Sparkles, Type, MousePointerClick,
  FormInput, Image, CreditCard, Grid3x3, Minus, Link,
} from 'lucide-react'
import { registerBlock } from './index'
import { styleToString, renderLinks } from './htmlRenderers'

const DEFAULT_STYLES = {
  color: '#1e293b', backgroundColor: 'transparent', fontSize: '16px', fontWeight: '400',
  textAlign: 'left', paddingTop: 16, paddingBottom: 16, paddingLeft: 16, paddingRight: 16,
  marginTop: 0, marginBottom: 0, borderRadius: 0, borderWidth: 0, borderStyle: 'solid',
  borderColor: '#e2e8f0', width: '100%', height: 'auto',
}

export function registerAllBlocks() {
  registerBlock({
    type: 'navbar', icon: Navigation, category: 'Navigation', label: 'Navbar Menu',
    description: 'Top navigation bar with logo and links',
    component: lazy(() => import('../blocks/NavbarBlock.jsx')),
    defaultContent: { logoText: 'Brand', buttonText: 'Get Started', buttonLink: '#', links: [{ label: 'Home', url: '#' }, { label: 'About', url: '#' }] },
    defaultStyles: DEFAULT_STYLES,
    generateHTML: (block, s) => {
      const { logoText, buttonText, buttonLink, links } = block.content
      return `<nav style="${s};display:flex;align-items:center;justify-content:space-between"><div style="font-weight:700;font-size:1.25rem">${logoText}</div><div style="display:flex;align-items:center">${renderLinks(links)}${buttonText ? `<a href="${buttonLink}" style="background:#2563eb;color:#fff;padding:8px 20px;border-radius:6px;text-decoration:none;margin-left:16px">${buttonText}</a>` : ''}</div></nav>`
    },
  })

  registerBlock({
    type: 'header', icon: PanelTop, category: 'Navigation', label: 'Title Header',
    description: 'Centered page title and subtitle',
    component: lazy(() => import('../blocks/HeaderBlock.jsx')),
    defaultContent: { title: 'Page Title', subtitle: 'A brief subtitle' },
    defaultStyles: DEFAULT_STYLES,
    generateHTML: (block, s) => `<header style="${s};text-align:center"><h1 style="font-size:2.5rem;font-weight:700;margin:0 0 8px">${block.content.title}</h1><p style="font-size:1.125rem;opacity:0.8;margin:0">${block.content.subtitle}</p></header>`,
  })

  registerBlock({
    type: 'hero', icon: Sparkles, category: 'Hero Sections', label: 'Hero Banner',
    description: 'Full-width hero with CTA button',
    component: lazy(() => import('../blocks/HeroBlock.jsx')),
    defaultContent: { title: 'Welcome', subtitle: 'Build something amazing', buttonText: 'Learn More', buttonLink: '#', imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop' },
    defaultStyles: DEFAULT_STYLES,
    generateHTML: (block, s) => {
      const { title, subtitle, buttonText, buttonLink, imageUrl } = block.content
      return `<section style="${s};text-align:center"><h1 style="font-size:3rem;font-weight:800;margin:0 0 16px">${title}</h1><p style="font-size:1.25rem;opacity:0.9;margin:0 0 32px">${subtitle}</p>${buttonText ? `<a href="${buttonLink}" style="display:inline-block;background:#fff;color:#2563eb;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:600">${buttonText}</a>` : ''}${imageUrl ? `<img src="${imageUrl}" alt="" style="max-width:100%;margin-top:40px;border-radius:12px" />` : ''}</section>`
    },
  })

  registerBlock({
    type: 'text', icon: Type, category: 'Typography', label: 'Paragraph Text',
    description: 'Rich paragraph text block',
    component: lazy(() => import('../blocks/TextBlock.jsx')),
    defaultContent: { text: 'Add your paragraph text here.' },
    defaultStyles: DEFAULT_STYLES,
    generateHTML: (block, s) => `<div style="${s}"><p style="margin:0;line-height:1.7">${block.content.text}</p></div>`,
  })

  registerBlock({
    type: 'button', icon: MousePointerClick, category: 'Actions', label: 'Call-to-Action',
    description: 'Standalone CTA button',
    component: lazy(() => import('../blocks/ButtonBlock.jsx')),
    defaultContent: { buttonText: 'Click Me', buttonLink: '#' },
    defaultStyles: DEFAULT_STYLES,
    generateHTML: (block, s) => `<div style="${s};text-align:center"><a href="${block.content.buttonLink}" style="display:inline-block;background:#2563eb;color:#fff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:600">${block.content.buttonText}</a></div>`,
  })

  registerBlock({
    type: 'form', icon: FormInput, category: 'Actions', label: 'Lead Form',
    description: 'Contact or lead capture form',
    component: lazy(() => import('../blocks/FormBlock.jsx')),
    defaultContent: { title: 'Get in Touch', buttonText: 'Submit', fields: [{ label: 'Name', type: 'text' }, { label: 'Email', type: 'email' }] },
    defaultStyles: DEFAULT_STYLES,
    generateHTML: (block, s) => {
      const fields = (block.content.fields || []).map((f) => f.type === 'textarea'
        ? `<div style="margin-bottom:16px"><label style="display:block;margin-bottom:4px">${f.label}</label><textarea style="width:100%;padding:10px;border:1px solid #e2e8f0;border-radius:6px" rows="4"></textarea></div>`
        : `<div style="margin-bottom:16px"><label style="display:block;margin-bottom:4px">${f.label}</label><input type="${f.type}" style="width:100%;padding:10px;border:1px solid #e2e8f0;border-radius:6px" /></div>`
      ).join('')
      return `<form style="${s};max-width:480px;margin:0 auto"><h2 style="font-size:1.5rem;font-weight:600;margin:0 0 24px;text-align:center">${block.content.title}</h2>${fields}<button type="button" style="width:100%;background:#2563eb;color:#fff;padding:12px;border:none;border-radius:8px;font-weight:600">${block.content.buttonText}</button></form>`
    },
  })

  registerBlock({
    type: 'image', icon: Image, category: 'Media', label: 'Image Section',
    description: 'Image with caption support',
    component: lazy(() => import('../blocks/ImageBlock.jsx')),
    defaultContent: { imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=400&fit=crop', altText: 'Placeholder', caption: '' },
    defaultStyles: DEFAULT_STYLES,
    generateHTML: (block, s) => `<figure style="${s};text-align:center"><img src="${block.content.imageUrl}" alt="${block.content.altText || ''}" style="max-width:100%;border-radius:8px" />${block.content.caption ? `<figcaption style="margin-top:8px;font-size:0.875rem;opacity:0.7">${block.content.caption}</figcaption>` : ''}</figure>`,
  })

  registerBlock({
    type: 'card', icon: CreditCard, category: 'Components', label: 'Feature Card',
    description: 'Card with image, title and body',
    component: lazy(() => import('../blocks/CardBlock.jsx')),
    defaultContent: { title: 'Feature Title', bodyText: 'Describe your feature here.', imageUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=250&fit=crop' },
    defaultStyles: DEFAULT_STYLES,
    generateHTML: (block, s) => `<div style="${s}">${block.content.imageUrl ? `<img src="${block.content.imageUrl}" alt="" style="width:100%;border-radius:8px;margin-bottom:16px" />` : ''}<h3 style="font-size:1.25rem;font-weight:600;margin:0 0 8px">${block.content.title}</h3><p style="margin:0;line-height:1.6;opacity:0.8">${block.content.bodyText}</p></div>`,
  })

  registerBlock({
    type: 'container', icon: Grid3x3, category: 'Layout', label: 'Grid Container',
    description: 'Grid layout for nested blocks',
    component: lazy(() => import('../blocks/ContainerBlock.jsx')),
    defaultContent: { columns: 2 },
    defaultStyles: DEFAULT_STYLES,
    generateHTML: () => '',
  })

  registerBlock({
    type: 'divider', icon: Minus, category: 'Layout', label: 'Spacer Line',
    description: 'Horizontal divider line',
    component: lazy(() => import('../blocks/DividerBlock.jsx')),
    defaultContent: { style: 'solid' },
    defaultStyles: { ...DEFAULT_STYLES, borderWidth: 1 },
    generateHTML: (block, s) => `<hr style="${s};border:none;border-top:1px solid #e2e8f0" />`,
  })

  registerBlock({
    type: 'footer', icon: Link, category: 'Footer', label: 'Footer Links',
    description: 'Footer with text and links',
    component: lazy(() => import('../blocks/FooterBlock.jsx')),
    defaultContent: { footerText: '© 2026 Your Company.', links: [{ label: 'Privacy', url: '#' }] },
    defaultStyles: DEFAULT_STYLES,
    generateHTML: (block, s) => `<footer style="${s};text-align:center"><p style="margin:0 0 8px">${block.content.footerText}</p><div>${renderLinks(block.content.links)}</div></footer>`,
  })
}
