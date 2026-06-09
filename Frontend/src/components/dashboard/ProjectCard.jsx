import { memo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { LayoutTemplate, Download, Trash2 } from 'lucide-react'
import { countBlocks } from '../../utils/blockUtils'
import { downloadHTML } from '../../utils/htmlGenerator'

function ProjectCard({ project, onDelete }) {
  const navigate = useNavigate()
  const blockCount = countBlocks(project.layout || [])

  const handleCardClick = useCallback(() => {
    navigate(`/builder/${project.id}`)
  }, [navigate, project.id])

  const handleExport = useCallback((e) => {
    e.stopPropagation()
    downloadHTML(project.layout || [], project.title)
  }, [project])

  const handleDelete = useCallback((e) => {
    e.stopPropagation()
    onDelete(project)
  }, [onDelete, project])

  const formattedDate = new Date(project.updatedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div
      onClick={handleCardClick}
      className="group glass rounded-2xl p-5 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-xl bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
          <LayoutTemplate className="w-6 h-6" />
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleExport}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Export HTML"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 text-red-500 transition-colors"
            title="Delete project"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <h3 className="font-semibold font-display text-lg mb-1 truncate">{project.title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        {blockCount} {blockCount === 1 ? 'block' : 'blocks'}
      </p>
      <p className="text-xs text-slate-400 mt-2">Updated {formattedDate}</p>
    </div>
  )
}

export default memo(ProjectCard)
