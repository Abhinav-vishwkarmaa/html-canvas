import { memo } from 'react'
import { Copy, Trash2, Grid3x3 } from 'lucide-react'
import useStore from '../store/useStore'

function BulkToolbar() {
  const selectedBlocks = useStore((s) => s.selectedBlocks)
  const duplicateMultiple = useStore((s) => s.duplicateMultiple)
  const deleteMultiple = useStore((s) => s.deleteMultiple)
  const wrapInContainer = useStore((s) => s.wrapInContainer)

  if (selectedBlocks.length < 2) return null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 px-4 py-2 glass rounded-xl shadow-lg animate-slide-up" role="toolbar" aria-label="Bulk actions">
      <span className="text-sm font-medium mr-2">{selectedBlocks.length} selected</span>
      <button onClick={duplicateMultiple} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" title="Duplicate" aria-label="Duplicate selected">
        <Copy className="w-4 h-4" />
      </button>
      <button onClick={deleteMultiple} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 text-red-500" title="Delete" aria-label="Delete selected">
        <Trash2 className="w-4 h-4" />
      </button>
      <button onClick={wrapInContainer} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" title="Wrap in Container" aria-label="Wrap in container">
        <Grid3x3 className="w-4 h-4" />
      </button>
    </div>
  )
}

export default memo(BulkToolbar)
