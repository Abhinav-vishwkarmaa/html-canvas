import { memo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Modal from '../common/Modal'
import useStore from '../../store/useStore'
import { PREBUILT_TEMPLATES } from '../../constants/templates'

function CreateProjectModal({ isOpen, onClose }) {
  const [title, setTitle] = useState('')
  const [templateId, setTemplateId] = useState('blank')
  const createProject = useStore((s) => s.createProject)
  const navigate = useNavigate()

  const handleCreate = () => {
    const id = createProject(title || 'Untitled Project', templateId)
    setTitle('')
    setTemplateId('blank')
    onClose()
    navigate(`/builder/${id}`)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Project">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Project Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="My Awesome Website"
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
            autoFocus
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Choose Template</label>
          <div className="grid grid-cols-2 gap-3">
            {PREBUILT_TEMPLATES.map((template) => (
              <button
                key={template.id}
                onClick={() => setTemplateId(template.id)}
                className={`p-3 rounded-xl border-2 text-left transition-all ${
                  templateId === template.id
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <img
                  src={template.thumbnail}
                  alt={template.name}
                  className="w-full h-20 object-cover rounded-lg mb-2"
                />
                <p className="text-sm font-medium">{template.name}</p>
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{template.description}</p>
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-4 py-2 text-sm rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors"
          >
            Create
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default memo(CreateProjectModal)
