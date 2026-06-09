import { memo } from 'react'
import { useBlockStyles } from '../hooks/useBlockStyles'

function CardBlock({ block }) {
  const { title, bodyText, imageUrl } = block.content
  const style = useBlockStyles(block)

  return (
    <div style={style}>
      {imageUrl && (
        <img src={imageUrl} alt="" style={{ width: '100%', borderRadius: '8px', marginBottom: '16px' }} />
      )}
      <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0 0 8px' }}>{title}</h3>
      <p style={{ margin: 0, lineHeight: 1.6, opacity: 0.8 }}>{bodyText}</p>
    </div>
  )
}

export default memo(CardBlock)

