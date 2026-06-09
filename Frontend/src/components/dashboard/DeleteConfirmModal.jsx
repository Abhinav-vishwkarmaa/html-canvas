import { memo } from 'react'
import Modal from '../common/Modal'

function DeleteConfirmModal({ isOpen, onClose, onConfirm, projectTitle }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Project" size="sm">
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
        Are you sure you want to delete <strong>{projectTitle}</strong>? This action cannot be undone.
      </p>
      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
        >
          Delete
        </button>
      </div>
    </Modal>
  )
}

export default memo(DeleteConfirmModal)
