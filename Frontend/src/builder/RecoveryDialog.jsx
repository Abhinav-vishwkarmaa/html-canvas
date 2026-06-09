import { memo } from 'react'
import Modal from '../components/common/Modal'
import useStore from '../store/useStore'

function RecoveryDialog() {
  const show = useStore((s) => s.showRecoveryDialog)
  const pendingDraft = useStore((s) => s.pendingDraft)
  const restoreDraft = useStore((s) => s.restoreDraft)
  const discardDraft = useStore((s) => s.discardDraft)

  if (!show) return null

  return (
    <Modal isOpen={show} onClose={discardDraft} title="Recover Unsaved Changes" size="sm">
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
        A draft from {pendingDraft?.savedAt ? new Date(pendingDraft.savedAt).toLocaleString() : 'recent session'} was found.
      </p>
      <p className="text-sm text-slate-500 mb-6">Would you like to restore your unsaved edits?</p>
      <div className="flex justify-end gap-3">
        <button onClick={discardDraft} className="px-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
          Discard
        </button>
        <button onClick={restoreDraft} className="px-4 py-2 text-sm rounded-lg bg-primary-600 text-white hover:bg-primary-700">
          Restore
        </button>
      </div>
    </Modal>
  )
}

export default memo(RecoveryDialog)
