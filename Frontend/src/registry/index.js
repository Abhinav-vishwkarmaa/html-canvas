const blockRegistry = new Map()

export function registerBlock(config) {
  if (!config.type) throw new Error('Block type is required')
  blockRegistry.set(config.type, {
    type: config.type,
    icon: config.icon,
    category: config.category,
    label: config.label,
    description: config.description,
    component: config.component,
    preview: config.preview,
    defaultProps: config.defaultProps,
    defaultContent: config.defaultContent || config.defaultProps?.content,
    defaultStyles: config.defaultStyles || config.defaultProps?.styles,
    propertyPanel: config.propertyPanel,
    generateHTML: config.generateHTML,
  })
}

export function getBlock(type) {
  return blockRegistry.get(type) || null
}

export function getBlocks() {
  return Array.from(blockRegistry.values())
}

export function getBlocksByCategory() {
  const categories = new Map()
  for (const block of blockRegistry.values()) {
    const cat = block.category || 'Other'
    if (!categories.has(cat)) categories.set(cat, [])
    categories.get(cat).push(block)
  }
  return categories
}

export function getBlockComponent(type) {
  return blockRegistry.get(type)?.component || null
}

export function getBlockHTMLGenerator(type) {
  return blockRegistry.get(type)?.generateHTML || null
}
