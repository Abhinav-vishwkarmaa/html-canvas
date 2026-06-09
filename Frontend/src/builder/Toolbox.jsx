import { memo, useState, useMemo, useDeferredValue, useTransition, useCallback, useRef } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { Search } from 'lucide-react'
import useStore from '../store/useStore'
import { getBlocksByCategory } from '../registry/index'

const DraggableTool = memo(function DraggableTool({ item, onDoubleClickAdd }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `toolbox-${item.type}`,
    data: { type: item.type, isToolbox: true },
  })

  const clickTimer = useRef(null)

  const handleDoubleClick = useCallback((e) => {
    e.stopPropagation()
    if (clickTimer.current) {
      clearTimeout(clickTimer.current)
      clickTimer.current = null
    }
    onDoubleClickAdd(item.type)
  }, [item.type, onDoubleClickAdd])

  const Icon = item.icon

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onDoubleClick={handleDoubleClick}
      title="Drag to canvas or double-click to add"
      className={`flex items-start gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 cursor-grab active:cursor-grabbing hover:border-primary-400 hover:shadow-sm transition-all ${isDragging ? 'opacity-50' : ''}`}
    >
      <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 shrink-0">
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium truncate">{item.label}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{item.description}</p>
      </div>
    </div>
  )
})

function Toolbox() {
  const [search, setSearch] = useState('')
  const deferredSearch = useDeferredValue(search)
  const [, startTransition] = useTransition()
  const addBlock = useStore((s) => s.addBlock)
  const announce = useStore((s) => s.announce)

  const handleDoubleClickAdd = useCallback((type) => {
    addBlock(type, null)
    announce(`Added ${type} block to canvas`)
  }, [addBlock, announce])

  const filtered = useMemo(() => {
    const categories = getBlocksByCategory()
    const result = []
    for (const [category, items] of categories) {
      const filteredItems = deferredSearch.trim()
        ? items.filter((item) =>
            item.label.toLowerCase().includes(deferredSearch.toLowerCase()) ||
            item.description.toLowerCase().includes(deferredSearch.toLowerCase()) ||
            category.toLowerCase().includes(deferredSearch.toLowerCase())
          )
        : items
      if (filteredItems.length) result.push({ category, items: filteredItems })
    }
    return result
  }, [deferredSearch])

  const handleSearch = (e) => {
    startTransition(() => setSearch(e.target.value))
  }

  return (
    <aside className="w-72 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col h-full" aria-label="Toolbox">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-sm font-semibold font-display mb-3">Toolbox Elements</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search components..."
            value={search}
            onChange={handleSearch}
            aria-label="Search toolbox components"
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <p className="text-[11px] text-slate-400 mt-2">Drag to canvas or double-click to add</p>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {filtered.map(({ category, items }) => (
          <div key={category}>
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{category}</h3>
            <div className="space-y-2">
              {items.map((item) => (
                <DraggableTool key={item.type} item={item} onDoubleClickAdd={handleDoubleClickAdd} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}

export default memo(Toolbox)
