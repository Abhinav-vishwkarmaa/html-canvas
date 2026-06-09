import { memo } from 'react'
import { useBlockStyles } from '../hooks/useBlockStyles'

function HeroBlock({ block }) {
  const { title, subtitle, buttonText, buttonLink, imageUrl } = block.content
  const style = useBlockStyles(block)

  return (
    <section style={{ ...style, textAlign: 'center' }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 800, margin: '0 0 16px' }}>{title}</h1>
      <p style={{ fontSize: '1.25rem', opacity: 0.9, margin: '0 0 32px' }}>{subtitle}</p>
      {buttonText && (
        <a
          href={buttonLink}
          style={{
            display: 'inline-block', background: '#fff', color: '#2563eb',
            padding: '12px 32px', borderRadius: '8px', textDecoration: 'none', fontWeight: 600,
          }}
        >
          {buttonText}
        </a>
      )}
      {imageUrl && (
        <img src={imageUrl} alt="" style={{ maxWidth: '100%', marginTop: '40px', borderRadius: '12px' }} />
      )}
    </section>
  )
}

export default memo(HeroBlock)

