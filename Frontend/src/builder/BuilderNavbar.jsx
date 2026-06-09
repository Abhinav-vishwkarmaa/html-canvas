import { memo, useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Monitor, Tablet, Smartphone, Undo2, Redo2,
  Save, Eye, Download, Check, Loader2, Cloud, FileJson,
} from 'lucide-react'
import useStore from '../store/useStore'
import { generateExport, downloadExport } from '../utils/exportEngine'
import { trackEvent } from '../utils/analytics'

function BuilderNavbar() {
  const navigate = useNavigate()
  const project = useStore((s) => s.project)
  const layout = useStore((s) => s.layout)
  const previewMode = useStore((s) => s.previewMode)
  const zoom = useStore((s) => s.zoom)
  const saving = useStore((s) => s.saving)
  const isDirty = useStore((s) => s.isDirty)
  const historyIndex = useStore((s) => s.historyIndex)
  const history = useStore((s) => s.history)
  const setPreviewMode = useStore((s) => s.setPreviewMode)
  const setZoom = useStore((s) => s.setZoom)
  const undo = useStore((s) => s.undo)
  const redo = useStore((s) => s.redo)
  const saveProject = useStore((s) => s.saveProject)
  const updateProjectTitle = useStore((s) => s.updateProjectTitle)

  const [editingTitle, setEditingTitle] = useState(false)
  const [titleValue, setTitleValue] = useState(project?.title || '')

  const saveStatus = useMemo(() => saving ? 'Saving...' : isDirty ? 'Unsaved' : 'Autosaved', [saving, isDirty])

  const handleExport = useCallback(async (format) => {
    if (!project) return
    saveProject()
    const result = await generateExport({ ...project, layout }, { format })
    downloadExport(result)
    trackEvent('exports')
  }, [project, layout, saveProject])

  const handleTitleSave = useCallback(() => {
    updateProjectTitle(titleValue)
    setEditingTitle(false)
  }, [titleValue, updateProjectTitle])

  const devices = useMemo(() => [
    { mode: 'desktop', icon: Monitor, label: 'Desktop' },
    { mode: 'tablet', icon: Tablet, label: 'Tablet' },
    { mode: 'mobile', icon: Smartphone, label: 'Mobile' },
  ], [])

  return (
    <header className="h-14 shrink-0 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-3 px-4">
      <button onClick={() => navigate('/dashboard')} className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Dashboard
      </button>
      <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
      {editingTitle ? (
        <input value={titleValue} onChange={(e) => setTitleValue(e.target.value)} onBlur={handleTitleSave} onKeyDown={(e) => { if (e.key === 'Enter') handleTitleSave(); if (e.key === 'Escape') { setTitleValue(project?.title || ''); setEditingTitle(false) } }} autoFocus className="px-2 py-1 text-sm font-medium rounded border border-primary-400 bg-slate-50 dark:bg-slate-800 focus:outline-none" aria-label="Project title" />
      ) : (
        <button onClick={() => setEditingTitle(true)} className="text-sm font-medium hover:text-primary-600 transition-colors">{project?.title || 'Untitled'}</button>
      )}
      <div className="flex items-center gap-1 text-xs text-slate-400" aria-live="polite">
        {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : isDirty ? <Cloud className="w-3 h-3" /> : <Check className="w-3 h-3 text-emerald-500" />}
        <span>{saveStatus}</span>
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1" role="group" aria-label="Device preview">
        {devices.map(({ mode, icon: Icon, label }) => (
          <button key={mode} onClick={() => setPreviewMode(mode)} className={`p-1.5 rounded-md transition-colors ${previewMode === mode ? 'bg-white dark:bg-slate-700 shadow-sm text-primary-600' : 'text-slate-500 hover:text-slate-700'}`} title={label} aria-label={label} aria-pressed={previewMode === mode}>
            <Icon className="w-4 h-4" />
          </button>
        ))}
      </div>
      <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
      <button onClick={undo} disabled={historyIndex <= 0} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30" title="Undo (Ctrl+Z)" aria-label="Undo"><Undo2 className="w-4 h-4" /></button>
      <button onClick={redo} disabled={historyIndex >= history.length - 1} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30" title="Redo (Ctrl+Y)" aria-label="Redo"><Redo2 className="w-4 h-4" /></button>
      <div className="flex items-center gap-2">
        <input type="range" min={50} max={150} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="w-20 accent-primary-500" aria-label={`Zoom ${zoom}%`} />
        <span className="text-xs text-slate-400 w-10">{zoom}%</span>
      </div>
      <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
      <button onClick={saveProject} className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"><Save className="w-4 h-4" /> Save</button>
      <button onClick={() => { saveProject(); window.open(`/preview/${project?.id}`, '_blank') }} className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"><Eye className="w-4 h-4" /> Preview</button>
      <button onClick={() => handleExport('html')} className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-primary-600 text-white hover:bg-primary-700"><Download className="w-4 h-4" /> Export</button>
      <button onClick={() => handleExport('json')} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" title="Export JSON" aria-label="Export JSON"><FileJson className="w-4 h-4" /></button>
    </header>
  )
}

export default memo(BuilderNavbar)
