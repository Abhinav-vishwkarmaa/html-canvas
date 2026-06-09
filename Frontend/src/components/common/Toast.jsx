import { memo } from 'react'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'
import useStore from '../../store/useStore'

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
}

const colors = {
  success: 'bg-emerald-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
}

function Toast({ toast }) {
  const removeToast = useStore((s) => s.removeToast)
  const Icon = icons[toast.type] || Info

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-white ${colors[toast.type] || colors.info} animate-slide-up`}>
      <Icon className="w-5 h-5 shrink-0" />
      <span className="text-sm font-medium flex-1">{toast.message}</span>
      <button onClick={() => removeToast(toast.id)} className="p-0.5 hover:opacity-70" aria-label="Dismiss">
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

function ToastContainer() {
  const toasts = useStore((s) => s.toasts)

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm" aria-live="polite">
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} />
      ))}
    </div>
  )
}

export default memo(ToastContainer)
