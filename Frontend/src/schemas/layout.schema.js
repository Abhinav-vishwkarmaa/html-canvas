import { repairBlock, validateBlock } from './block.schema'

export function removeOrphanChildren(layout) {
  const ids = new Set(layout.map((b) => b.id))
  return layout.map((block) => {
    if (!block.children) return block
    return {
      ...block,
      children: block.children.filter((id) => ids.has(id)),
    }
  })
}

export function preventCircularNesting(layout) {
  const blockMap = new Map(layout.map((b) => [b.id, b]))

  function isCircular(blockId, parentId, visited = new Set()) {
    if (!parentId) return false
    if (blockId === parentId) return true
    if (visited.has(parentId)) return true
    visited.add(parentId)
    const parent = blockMap.get(parentId)
    return parent ? isCircular(blockId, parent.parentId, visited) : false
  }

  return layout.map((block) => {
    if (block.parentId && isCircular(block.id, block.parentId)) {
      return { ...block, parentId: null }
    }
    return block
  })
}

export function validateLayout(layout) {
  if (!Array.isArray(layout)) return []
  const repaired = layout
    .map(repairBlock)
    .filter(Boolean)
  const deduped = removeOrphanChildren(repaired)
  return preventCircularNesting(deduped)
}

export function validateExport(data) {
  if (!data || typeof data !== 'object') return null
  if (!Array.isArray(data.layout)) return null
  return { ...data, layout: validateLayout(data.layout) }
}

export function validateImport(data) {
  return validateExport(data)
}
