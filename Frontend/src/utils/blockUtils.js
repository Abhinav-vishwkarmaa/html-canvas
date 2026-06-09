import { getResolvedStyleObject } from './responsiveStyles'

export function getRootBlocks(layout) {
  return layout.filter((b) => !b.parentId)
}

export function getChildBlocks(layout, parentId) {
  const parent = layout.find((b) => b.id === parentId)
  if (!parent?.children) return []
  return parent.children
    .map((id) => layout.find((b) => b.id === id))
    .filter(Boolean)
}

export function getBlockById(layout, id) {
  return layout.find((b) => b.id === id)
}

export function countBlocks(layout) {
  return layout.length
}

export function isDescendant(layout, ancestorId, descendantId) {
  if (ancestorId === descendantId) return true
  const block = layout.find((b) => b.id === descendantId)
  if (!block?.parentId) return false
  if (block.parentId === ancestorId) return true
  return isDescendant(layout, ancestorId, block.parentId)
}

export function removeBlockFromLayout(layout, blockId) {
  const block = layout.find((b) => b.id === blockId)
  if (!block) return layout

  let newLayout = layout.filter((b) => b.id !== blockId)

  if (block.children) {
    for (const childId of block.children) {
      newLayout = removeBlockFromLayout(newLayout, childId)
    }
  }

  newLayout = newLayout.map((b) => {
    if (b.children?.includes(blockId)) {
      return { ...b, children: b.children.filter((id) => id !== blockId) }
    }
    if (b.parentId === blockId) {
      return { ...b, parentId: null }
    }
    return b
  })

  return newLayout
}

export function removeBlocksFromLayout(layout, blockIds) {
  let result = layout
  for (const id of blockIds) {
    result = removeBlockFromLayout(result, id)
  }
  return result
}

export function duplicateBlockInLayout(layout, blockId) {
  const block = layout.find((b) => b.id === blockId)
  if (!block) return layout

  const newId = crypto.randomUUID()
  const newBlock = {
    ...block,
    id: newId,
    content: structuredClone(block.content),
    styles: structuredClone(block.styles),
    children: block.children ? [...block.children] : undefined,
  }

  let newLayout = [...layout, newBlock]

  if (block.parentId) {
    newLayout = newLayout.map((b) => {
      if (b.id === block.parentId && b.children) {
        const idx = b.children.indexOf(blockId)
        const children = [...b.children]
        children.splice(idx + 1, 0, newId)
        return { ...b, children }
      }
      return b
    })
  }

  return newLayout
}

export function duplicateBlocksInLayout(layout, blockIds) {
  let result = layout
  for (const id of blockIds) {
    result = duplicateBlockInLayout(result, id)
  }
  return result
}

export function reorderBlocks(layout, activeId, overId, parentId = null) {
  const activeBlock = layout.find((b) => b.id === activeId)
  if (!activeBlock) return layout

  let newLayout = layout.map((b) => ({ ...b }))

  if (parentId) {
    const parent = newLayout.find((b) => b.id === parentId)
    if (!parent?.children) return layout

    const children = [...parent.children]
    const oldIndex = children.indexOf(activeId)
    const newIndex = children.indexOf(overId)

    if (oldIndex === -1 || newIndex === -1) return layout

    children.splice(oldIndex, 1)
    children.splice(newIndex, 0, activeId)

    newLayout = newLayout.map((b) => {
      if (b.id === parentId) return { ...b, children }
      if (b.id === activeId) return { ...b, parentId }
      return b
    })
  } else {
    const roots = getRootBlocks(newLayout)
    const oldIndex = roots.findIndex((b) => b.id === activeId)
    const newIndex = roots.findIndex((b) => b.id === overId)

    if (oldIndex === -1 || newIndex === -1) return layout

    const reordered = [...roots]
    const [moved] = reordered.splice(oldIndex, 1)
    reordered.splice(newIndex, 0, moved)

    const childBlocks = newLayout.filter((b) => b.parentId)
    newLayout = [...reordered, ...childBlocks]
  }

  return newLayout
}

export function moveBlockToParent(layout, activeId, parentId, index) {
  let newLayout = layout.map((b) => ({ ...b, children: b.children ? [...b.children] : undefined }))
  const activeBlock = newLayout.find((b) => b.id === activeId)
  if (!activeBlock) return layout

  if (activeBlock.parentId) {
    newLayout = newLayout.map((b) => {
      if (b.id === activeBlock.parentId && b.children) {
        return { ...b, children: b.children.filter((id) => id !== activeId) }
      }
      return b
    })
  }

  if (parentId) {
    const parent = newLayout.find((b) => b.id === parentId)
    if (parent) {
      const children = [...(parent.children || [])]
      children.splice(index, 0, activeId)
      newLayout = newLayout.map((b) => {
        if (b.id === parentId) return { ...b, children }
        if (b.id === activeId) return { ...b, parentId }
        return b
      })
    }
  } else {
    newLayout = newLayout.map((b) => {
      if (b.id === activeId) return { ...b, parentId: null }
      return b
    })
  }

  return newLayout
}

export function getBlockStyleObject(styles, device = 'desktop') {
  return getResolvedStyleObject(styles, device)
}

export function moveBlockByArrow(layout, blockId, direction) {
  const block = layout.find((b) => b.id === blockId)
  if (!block) return layout

  const siblings = block.parentId
    ? getChildBlocks(layout, block.parentId)
    : getRootBlocks(layout)

  const idx = siblings.findIndex((b) => b.id === blockId)
  const newIdx = direction === 'up' ? idx - 1 : idx + 1
  if (newIdx < 0 || newIdx >= siblings.length) return layout

  return reorderBlocks(layout, blockId, siblings[newIdx].id, block.parentId)
}

export function wrapBlocksInContainer(layout, blockIds) {
  const container = {
    id: crypto.randomUUID(),
    type: 'container',
    parentId: null,
    content: { columns: Math.min(blockIds.length, 3) },
    styles: { desktop: { color: '#1e293b', backgroundColor: 'transparent', fontSize: '16px', fontWeight: '400', textAlign: 'left', paddingTop: 16, paddingBottom: 16, paddingLeft: 16, paddingRight: 16, marginTop: 0, marginBottom: 0, borderRadius: 0, borderWidth: 0, borderStyle: 'solid', borderColor: '#e2e8f0', width: '100%', height: 'auto' }, tablet: {}, mobile: {} },
    children: [...blockIds],
  }

  let newLayout = [...layout, container]
  newLayout = newLayout.map((b) => {
    if (blockIds.includes(b.id)) {
      return { ...b, parentId: container.id }
    }
    return b
  })

  return newLayout
}
