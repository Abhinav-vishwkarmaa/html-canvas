import { memo } from 'react'
import { useBlockStyles } from '../hooks/useBlockStyles'

function FooterBlock({ block }) {
  const { footerText, links } = block.content
  const style = useBlockStyles(block)

  return (
    <footer style={{ ...style, textAlign: 'center' }}>
      <p style={{ margin: '0 0 8px' }}>{footerText}</p>
      <div>
        {(links || []).map((link, i) => (
          <a key={i} href={link.url} style={{ color: 'inherit', textDecoration: 'none', margin: '0 12px' }}>
            {link.label}
          </a>
        ))}
      </div>
    </footer>
  )
}

export default memo(FooterBlock)

