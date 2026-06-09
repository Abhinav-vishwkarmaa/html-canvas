import { memo, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Monitor, Tablet, Smartphone } from 'lucide-react'
import useStore from '../store/useStore'
import { generateHTML } from '../utils/htmlGenerator'

function Preview() {
  const { id } = useParams()
  const navigate = useNavigate()
  const loadProject = useStore((s) => s.loadProject)
  const project = useStore((s) => s.project)
  const layout = useStore((s) => s.layout)
  const previewMode = useStore((s) => s.previewMode)
  const setPreviewMode = useStore((s) => s.setPreviewMode)

  useEffect(() => {
    if (id) loadProject(id)
  }, [id, loadProject])

  const html = useMemo(() => {
    if (!project || !layout.length) return generateHTML([], project?.title || 'Preview', previewMode)
    return generateHTML(layout, project.title, previewMode)
  }, [layout, project, previewMode])

  const widthMap = { desktop: '100%', tablet: '768px', mobile: '375px' }
  const devices = [
    { mode: 'desktop', icon: Monitor },
    { mode: 'tablet', icon: Tablet },
    { mode: 'mobile', icon: Smartphone },
  ]

  if (!project) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-pulse text-slate-400">Loading preview...</div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-slate-100 dark:bg-slate-950">
      <header className="h-14 shrink-0 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-4 px-4">
        <button
          onClick={() => navigate(`/builder/${id}`)}
          className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Builder
        </button>
        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
        <span className="text-sm font-medium">{project.title}</span>
        <div className="flex-1" />
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1" role="group" aria-label="Viewport">
          {devices.map(({ mode, icon: Icon }) => (
            <button
              key={mode}
              onClick={() => setPreviewMode(mode)}
              className={`p-1.5 rounded-md ${previewMode === mode ? 'bg-white dark:bg-slate-700 shadow-sm text-primary-600' : 'text-slate-500'}`}
              aria-label={mode}
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>
      </header>
      <div className="flex-1 overflow-auto p-6 flex justify-center">
        <div
          className="canvas-transition bg-white shadow-xl rounded-lg overflow-hidden"
          style={{ width: widthMap[previewMode], maxWidth: '100%', minHeight: '100%' }}
        >
          <iframe
            srcDoc={html}
            title="Preview"
            className="w-full border-0"
            style={{ minHeight: 'calc(100vh - 120px)' }}
            sandbox="allow-scripts"
          />
        </div>
      </div>
    </div>
  )
}

export default memo(Preview)
