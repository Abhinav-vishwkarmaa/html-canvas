import { memo } from 'react'
import { useBlockStyles } from '../hooks/useBlockStyles'

function NavbarBlock({ block }) {
  const { logoText, buttonText, buttonLink, links } = block.content
  const style = useBlockStyles(block)

  return (
    <nav style={{ ...style, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ fontWeight: 700, fontSize: '1.25rem' }}>{logoText}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {(links || []).map((link, i) => (
          <a key={i} href={link.url} style={{ color: 'inherit', textDecoration: 'none', margin: '0 12px' }}>
            {link.label}
          </a>
        ))}
        {buttonText && (
          <a
            href={buttonLink}
            style={{
              background: '#2563eb', color: '#fff', padding: '8px 20px',
              borderRadius: '6px', textDecoration: 'none', marginLeft: '16px',
            }}
          >
            {buttonText}
          </a>
        )}
      </div>
    </nav>
  )
}

export default memo(NavbarBlock)

