import { memo } from 'react'
import { getBlock } from '../registry/index'

function DragOverlayContent({ activeId, layout }) {
  let type = null
  let label = ''

  if (typeof activeId === 'string' && activeId.startsWith('toolbox-')) {
    type = activeId.replace('toolbox-', '')
    const info = getBlock(type)
    label = info?.label || type
  } else {
    const block = layout.find((b) => b.id === activeId)
    if (block) {
      type = block.type
      label = getBlock(type)?.label || type
    }
  }

  if (!type) return null

  const info = getBlock(type)
  const Icon = info?.icon

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border-2 border-primary-400 bg-white dark:bg-slate-800 shadow-xl">
      {Icon && (
        <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-600">
          <Icon className="w-5 h-5" />
        </div>
      )}
      <span className="text-sm font-medium">{label}</span>
    </div>
  )
}

export default memo(DragOverlayContent)
