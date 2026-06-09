import { memo } from 'react'
import { useBlockStyles } from '../hooks/useBlockStyles'

function TextBlock({ block }) {
  const style = useBlockStyles(block)

  return (
    <div style={style}>
      <p style={{ margin: 0, lineHeight: 1.7 }}>{block.content.text}</p>
    </div>
  )
}

export default memo(TextBlock)

