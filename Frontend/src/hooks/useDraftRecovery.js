import { useEffect } from 'react'
import useStore from '../store/useStore'
import { startSession, endSession } from '../utils/analytics'

export function useDraftRecovery() {
  const scheduleDraftSave = useStore((s) => s.scheduleDraftSave)
  const project = useStore((s) => s.project)

  useEffect(() => {
    startSession()
    return () => endSession()
  }, [])

  useEffect(() => {
    if (project) {
      scheduleDraftSave()
    }
  }, [project, scheduleDraftSave])
}
