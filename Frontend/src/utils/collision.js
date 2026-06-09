import { pointerWithin } from '@dnd-kit/core'

export function customCollisionDetection(args) {
  const { active, droppableContainers } = args
  const activeId = active?.id

  // Toolbox items: only detect drop when pointer is physically over canvas/container
  if (typeof activeId === 'string' && activeId.startsWith('toolbox-')) {
    const canvasContainers = droppableContainers.filter(
      (c) => c.id === 'canvas-root' || String(c.id).startsWith('container-')
    )
    return pointerWithin({ ...args, droppableContainers: canvasContainers })
  }

  const pointerCollisions = pointerWithin(args)
  if (pointerCollisions.length > 0) return pointerCollisions

  return pointerWithin(args)
}

export function isValidDropTarget(overId) {
  if (!overId) return false
  if (overId === 'canvas-root') return true
  if (typeof overId === 'string' && overId.startsWith('container-')) return true
  return false
}
