import { memo } from 'react'
import { useBlockStyles } from '../hooks/useBlockStyles'

function ButtonBlock({ block }) {
  const { buttonText, buttonLink } = block.content
  const style = useBlockStyles(block)

  return (
    <div style={{ ...style, textAlign: 'center' }}>
      <a
        href={buttonLink}
        style={{
          display: 'inline-block', background: '#2563eb', color: '#fff',
          padding: '12px 32px', borderRadius: '8px', textDecoration: 'none', fontWeight: 600,
        }}
      >
        {buttonText}
      </a>
    </div>
  )
}

export default memo(ButtonBlock)

