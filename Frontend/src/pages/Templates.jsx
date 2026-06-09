import { memo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Eye, Plus } from 'lucide-react'
import { PREBUILT_TEMPLATES } from '../constants/templates'
import useStore from '../store/useStore'
import Modal from '../components/common/Modal'

function Templates() {
  const navigate = useNavigate()
  const createProject = useStore((s) => s.createProject)
  const [previewTemplate, setPreviewTemplate] = useState(null)

  const handleUseTemplate = (template) => {
    const id = createProject(template.name, template.id)
    navigate(`/builder/${id}`)
  }

  const handleStartBlank = () => {
    const id = createProject('Untitled Project', 'blank')
    navigate(`/builder/${id}`)
  }

  const templates = PREBUILT_TEMPLATES.filter((t) => t.id !== 'blank')

  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-40 glass border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <h1 className="text-xl font-bold font-display bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
            TemplateCraft
          </h1>
          <button
            onClick={handleStartBlank}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Start Blank Project
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold font-display mb-3">Template Library</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Choose a professionally designed template to jumpstart your project, or start from scratch.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template) => (
            <div key={template.id} className="glass rounded-2xl overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className="relative">
                <img
                  src={template.thumbnail}
                  alt={template.name}
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={() => setPreviewTemplate(template)}
                  className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-slate-800/90 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow"
                  title="Quick preview"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
              <div className="p-5">
                <h3 className="font-semibold font-display text-lg mb-1">{template.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">{template.description}</p>
                <button
                  onClick={() => handleUseTemplate(template)}
                  className="w-full py-2.5 text-sm font-medium rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                >
                  Use Template
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Modal
        isOpen={!!previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        title={previewTemplate?.name || 'Preview'}
        size="lg"
      >
        {previewTemplate && (
          <div className="space-y-4">
            <img
              src={previewTemplate.thumbnail}
              alt={previewTemplate.name}
              className="w-full h-48 object-cover rounded-xl"
            />
            <p className="text-sm text-slate-600 dark:text-slate-400">{previewTemplate.description}</p>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
              <h4 className="text-sm font-semibold mb-3">Layout Structure</h4>
              <ul className="space-y-2">
                {(previewTemplate.layout || []).filter((b) => !b.parentId).map((block) => (
                  <li key={block.id} className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 rounded-full bg-primary-500" />
                    <span className="capitalize font-medium">{block.type}</span>
                    {block.type === 'container' && block.children && (
                      <span className="text-slate-400 text-xs">
                        ({block.children.length} children)
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => {
                handleUseTemplate(previewTemplate)
                setPreviewTemplate(null)
              }}
              className="w-full py-2.5 text-sm font-medium rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition-colors"
            >
              Use This Template
            </button>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default memo(Templates)
