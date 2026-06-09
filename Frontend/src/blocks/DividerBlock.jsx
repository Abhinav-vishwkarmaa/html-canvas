import { memo } from 'react'
import { useBlockStyles } from '../hooks/useBlockStyles'

function DividerBlock({ block }) {
  const style = useBlockStyles(block)

  return (
    <hr
      style={{
        ...style,
        border: 'none',
        borderTop: `${block.styles.borderWidth || 1}px ${block.content.style || 'solid'} ${block.styles.borderColor || '#e2e8f0'}`,
      }}
    />
  )
}

export default memo(DividerBlock)

