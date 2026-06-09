import { memo } from 'react'
import { useBlockStyles } from '../hooks/useBlockStyles'

function HeaderBlock({ block }) {
  const { title, subtitle } = block.content
  const style = useBlockStyles(block)

  return (
    <header style={{ ...style, textAlign: 'center' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 700, margin: '0 0 8px' }}>{title}</h1>
      <p style={{ fontSize: '1.125rem', opacity: 0.8, margin: 0 }}>{subtitle}</p>
    </header>
  )
}

export default memo(HeaderBlock)

