import { describe, it, expect } from 'vitest'
import { validateLayout, validateExport } from '../../src/schemas/layout.schema'
import { repairProject, CURRENT_VERSION } from '../../src/schemas/project.schema'
import { normalizeStyles, repairBlock } from '../../src/schemas/block.schema'
import { createHistoryEntry, pushHistory } from '../../src/utils/history'
import { resolveBlockStyles } from '../../src/utils/responsiveStyles'

describe('Schema Validation', () => {
  it('validates and repairs blocks', () => {
    const block = repairBlock({ id: 'test-1', type: 'text', content: { text: 'Hello' }, styles: { color: '#000' } })
    expect(block).toBeTruthy()
    expect(block.styles.desktop).toBeDefined()
  })

  it('rejects invalid block types', () => {
    expect(repairBlock({ id: 'x', type: 'invalid' })).toBeNull()
  })

  it('validates layout and removes orphans', () => {
    const layout = validateLayout([
      { id: 'c1', type: 'container', parentId: null, content: {}, styles: {}, children: ['missing'] },
    ])
    expect(layout[0].children).toEqual([])
  })

  it('repairs project with version migration', () => {
    const project = repairProject({ id: 'p1', title: 'Test', layout: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
    expect(project.version).toBe(CURRENT_VERSION)
  })

  it('validates export data', () => {
    const result = validateExport({ layout: [{ id: 'b1', type: 'text', content: { text: 'Hi' }, styles: {} }] })
    expect(result).toBeTruthy()
  })
})

describe('Responsive Styles', () => {
  it('inherits desktop styles to tablet', () => {
    const styles = normalizeStyles({ color: '#000', backgroundColor: 'transparent', fontSize: '16px', fontWeight: '400', textAlign: 'left', paddingTop: 16, paddingBottom: 16, paddingLeft: 16, paddingRight: 16, marginTop: 0, marginBottom: 0, borderRadius: 0, borderWidth: 0, borderStyle: 'solid', borderColor: '#e2e8f0', width: '100%', height: 'auto' })
    const resolved = resolveBlockStyles(styles, 'tablet')
    expect(resolved.color).toBe('#000')
  })

  it('applies tablet overrides', () => {
    const styles = { desktop: { color: '#000', fontSize: '16px' }, tablet: { fontSize: '14px' }, mobile: {} }
    const resolved = resolveBlockStyles(styles, 'tablet')
    expect(resolved.fontSize).toBe('14px')
    expect(resolved.color).toBe('#000')
  })
})

describe('History Optimization', () => {
  it('creates history entries with patches', () => {
    const layout = [{ id: 'b1', type: 'text' }]
    const entry = createHistoryEntry('update', layout)
    expect(entry.action).toBe('update')
    expect(entry.patch.layout).toEqual(layout)
  })

  it('batches typing updates', () => {
    const layout = [{ id: 'b1', type: 'text' }]
    const entry = createHistoryEntry('typing', layout)
    const { history, historyIndex } = pushHistory([], -1, entry, 'typing')
    const batched = pushHistory(history, historyIndex, createHistoryEntry('typing', layout), 'typing')
    expect(batched.history.length).toBe(1)
  })
})

describe('Block Utils', () => {
  it('counts blocks correctly', async () => {
    const { countBlocks } = await import('../../src/utils/blockUtils')
    expect(countBlocks([{ id: '1' }, { id: '2' }])).toBe(2)
  })
})

describe('Analytics', () => {
  it('tracks events locally', async () => {
    const { loadMetrics, trackEvent } = await import('../../src/utils/analytics')
    trackEvent('blocksAdded')
    const metrics = loadMetrics()
    expect(metrics.blocksAdded).toBeGreaterThan(0)
  })
})

describe('Export Engine', () => {
  it('generates JSON export', async () => {
    const { generateExport } = await import('../../src/utils/exportEngine')
    const project = { title: 'Test', layout: [{ id: 'b1', type: 'text', content: { text: 'Hi' }, styles: { desktop: {} }, parentId: null }] }
    const result = await generateExport(project, { format: 'json' })
    expect(result.mimeType).toBe('application/json')
    expect(result.content).toContain('Test')
  })
})

describe('Collaboration Structure', () => {
  it('creates sync queue operations', async () => {
    const { createOperation, enqueueOperation, createSyncQueue, OPERATION_TYPES } = await import('../../src/utils/collaboration')
    const queue = createSyncQueue()
    const op = createOperation(OPERATION_TYPES.CREATE, { blockId: 'b1' })
    const updated = enqueueOperation(queue, op)
    expect(updated.operations).toHaveLength(1)
    expect(updated.futureSyncQueue).toHaveLength(1)
  })
})

describe('Registry', () => {
  it('registers and retrieves blocks', async () => {
    const { registerAllBlocks } = await import('../../src/registry/registerBlocks')
    const { getBlock, getBlocks } = await import('../../src/registry/index')
    registerAllBlocks()
    expect(getBlocks().length).toBeGreaterThan(0)
    expect(getBlock('navbar')).toBeTruthy()
  })
})
