import { create } from 'zustand'
import { loadProjects, saveProjects, saveDraft, deleteDraft, loadDrafts } from '../utils/storage'
import { migrateProjects } from '../utils/migration'
import { getTemplateById, cloneLayout } from '../constants/templates'
import { createBlock } from '../constants/blocks'
import { validateLayout } from '../schemas/layout.schema'
import { repairProject, CURRENT_VERSION } from '../schemas/project.schema'
import {
  removeBlockFromLayout, removeBlocksFromLayout, duplicateBlockInLayout,
  duplicateBlocksInLayout, reorderBlocks, moveBlockToParent, countBlocks,
  moveBlockByArrow, wrapBlocksInContainer,
} from '../utils/blockUtils'
import { createHistoryEntry, pushHistory, applyHistoryEntry } from '../utils/history'
import { trackEvent } from '../utils/analytics'
import { createOperation, enqueueOperation, createSyncQueue, OPERATION_TYPES } from '../utils/collaboration'
import { normalizeStyles } from '../schemas/block.schema'

let autosaveTimer = null
let draftTimer = null
let propertyDebounceTimer = null
let pendingPropertyUpdates = null

function seedProjects() {
  const saasTemplate = getTemplateById('saas-landing')
  const portfolioTemplate = getTemplateById('minimal-portfolio')

  return [
    repairProject({
      id: crypto.randomUUID(),
      title: 'SaaS Business Site',
      layout: cloneLayout(saasTemplate.layout),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: CURRENT_VERSION,
      metadata: { tags: [], description: '' },
    }),
    repairProject({
      id: crypto.randomUUID(),
      title: 'Alex Portfolio',
      layout: cloneLayout(portfolioTemplate.layout),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: CURRENT_VERSION,
      metadata: { tags: [], description: '' },
    }),
  ].filter(Boolean)
}

function initProjects() {
  const stored = migrateProjects(loadProjects())
  if (stored.length === 0) {
    const seeded = seedProjects()
    saveProjects(seeded, true)
    return seeded
  }
  return stored
}

const useStore = create((set, get) => ({
  projects: initProjects(),
  project: null,
  layout: [],
  selectedBlockId: null,
  selectedBlocks: [],
  history: [],
  historyIndex: -1,
  previewMode: 'desktop',
  zoom: 100,
  loading: false,
  saving: false,
  error: null,
  activeDragId: null,
  toasts: [],
  srAnnouncement: '',
  isDirty: false,
  syncQueue: createSyncQueue(),
  pendingDraft: null,
  showRecoveryDialog: false,
  showShortcutsModal: false,
  safeMode: false,
  errorLog: [],

  loadProject: (id) => {
    set({ loading: true, error: null })
    const projects = get().projects.length ? get().projects : initProjects()
    const project = projects.find((p) => p.id === id)
    if (!project) {
      set({ loading: false, error: 'Project not found' })
      return
    }

    const drafts = loadDrafts()
    const draft = drafts[id]
    const layout = validateLayout(project.layout || [])
    const entry = createHistoryEntry('load', layout)

    if (draft && draft.savedAt > project.updatedAt) {
      set({
        pendingDraft: draft,
        showRecoveryDialog: true,
        loading: false,
        project,
        layout,
        selectedBlockId: null,
        selectedBlocks: [],
        history: [entry],
        historyIndex: 0,
        isDirty: false,
        previewMode: 'desktop',
        zoom: 100,
      })
      return
    }

    set({
      projects, project, layout,
      selectedBlockId: null, selectedBlocks: [],
      history: [entry], historyIndex: 0,
      loading: false, isDirty: false,
      previewMode: 'desktop', zoom: 100,
      pendingDraft: null,
      showRecoveryDialog: false,
    })
  },

  restoreDraft: () => {
    const { pendingDraft, project } = get()
    if (!pendingDraft) return
    const layout = validateLayout(pendingDraft.layout || [])
    set({
      layout, selectedBlockId: pendingDraft.selectedBlockId || null,
      selectedBlocks: pendingDraft.selectedBlocks || [],
      zoom: pendingDraft.zoom || 100,
      history: [createHistoryEntry('restore', layout)],
      historyIndex: 0, isDirty: true,
      showRecoveryDialog: false, pendingDraft: null,
    })
    get().announce('Draft restored')
  },

  discardDraft: () => {
    const { project, pendingDraft } = get()
    if (project && pendingDraft) deleteDraft(project.id)
    const layout = validateLayout(project?.layout || [])
    set({
      layout, pendingDraft: null, showRecoveryDialog: false,
      history: [createHistoryEntry('load', layout)], historyIndex: 0,
      isDirty: false,
    })
  },

  saveProject: () => {
    const { project, layout } = get()
    if (!project) return

    set({ saving: true })
    const updatedProject = repairProject({
      ...project,
      layout: validateLayout(structuredClone(layout)),
      updatedAt: new Date().toISOString(),
    })

    const projects = get().projects.map((p) =>
      p.id === project.id ? updatedProject : p
    )

    saveProjects(projects, true)
    deleteDraft(project.id)
    trackEvent('saveCount')

    set({ projects, project: updatedProject, saving: false, isDirty: false })
    get().announce('Project saved')
  },

  createProject: (title, templateId = 'blank') => {
    const template = getTemplateById(templateId)
    const project = repairProject({
      id: crypto.randomUUID(),
      title: title || 'Untitled Project',
      layout: validateLayout(cloneLayout(template.layout)),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: CURRENT_VERSION,
      metadata: { tags: [], description: '' },
    })

    const projects = [...get().projects, project]
    saveProjects(projects, true)
    trackEvent('projectsCreated')
    set({ projects })
    get().addToast('Project created successfully', 'success')
    return project.id
  },

  deleteProject: (id) => {
    const projects = get().projects.filter((p) => p.id !== id)
    saveProjects(projects, true)
    deleteDraft(id)
    set({ projects })
    get().addToast('Project deleted', 'info')
  },

  addBlock: (type, parentId = null, index = -1) => {
    const block = createBlock(type, parentId)
    let layout = get().layout

    if (parentId) {
      const parent = layout.find((b) => b.id === parentId)
      if (parent) {
        const children = [...(parent.children || [])]
        children.splice(index >= 0 ? index : children.length, 0, block.id)
        layout = layout.map((b) => b.id === parentId ? { ...b, children } : b)
      }
    }

    layout = validateLayout([...layout, block])
    get().updateLayoutState(layout, 'addBlock')
    get().setSelectedBlockId(block.id)
    trackEvent('blocksAdded')
    get().announce(`Added ${type} block`)

    const op = createOperation(OPERATION_TYPES.CREATE, { blockId: block.id, type })
    set({ syncQueue: enqueueOperation(get().syncQueue, op) })
    return block.id
  },

  removeBlock: (id) => {
    const layout = validateLayout(removeBlockFromLayout(get().layout, id))
    get().updateLayoutState(layout, 'removeBlock')
    set((s) => ({
      selectedBlockId: s.selectedBlockId === id ? null : s.selectedBlockId,
      selectedBlocks: s.selectedBlocks.filter((bid) => bid !== id),
    }))
    get().announce('Block removed')
  },

  duplicateBlock: (id) => {
    const layout = validateLayout(duplicateBlockInLayout(get().layout, id))
    get().updateLayoutState(layout, 'duplicateBlock')
    get().announce('Block duplicated')
  },

  moveBlock: (activeId, overId, parentId = null) => {
    if (activeId === overId) return
    const layout = validateLayout(reorderBlocks(get().layout, activeId, overId, parentId))
    get().updateLayoutState(layout, 'dragging')
  },

  updateBlock: (id, updates, action = 'styleUpdate') => {
    pendingPropertyUpdates = { id, updates, action }
    if (propertyDebounceTimer) clearTimeout(propertyDebounceTimer)
    propertyDebounceTimer = setTimeout(() => {
      const pending = pendingPropertyUpdates
      if (!pending) return
      const { id: blockId, updates: upd, action: act } = pending
      pendingPropertyUpdates = null

      const layout = get().layout.map((b) => {
        if (b.id !== blockId) return b
        const updated = { ...b }
        if (upd.content) updated.content = { ...b.content, ...upd.content }
        if (upd.styles) {
          const device = get().previewMode
          const normalized = normalizeStyles(b.styles)
          normalized[device] = { ...normalized[device], ...upd.styles }
          updated.styles = normalized
        }
        return updated
      })
      get().updateLayoutState(layout, act)
    }, 300)
  },

  updateBlockImmediate: (id, updates) => {
    const device = get().previewMode
    const layout = get().layout.map((b) => {
      if (b.id !== id) return b
      const updated = { ...b }
      if (updates.content) updated.content = { ...b.content, ...updates.content }
      if (updates.styles) {
        const normalized = normalizeStyles(b.styles)
        normalized[device] = { ...normalized[device], ...updates.styles }
        updated.styles = normalized
      }
      return updated
    })
    get().updateLayoutState(layout, 'update')
  },

  undo: () => {
    const { history, historyIndex } = get()
    if (historyIndex <= 0) return
    const newIndex = historyIndex - 1
    const layout = applyHistoryEntry(get().layout, history[newIndex], 'backward')
    set({ layout, historyIndex: newIndex, isDirty: true, selectedBlockId: null, selectedBlocks: [] })
    get().scheduleAutosave()
    get().announce('Undo')
  },

  redo: () => {
    const { history, historyIndex } = get()
    if (historyIndex >= history.length - 1) return
    const newIndex = historyIndex + 1
    const layout = applyHistoryEntry(get().layout, history[newIndex], 'forward')
    set({ layout, historyIndex: newIndex, isDirty: true, selectedBlockId: null, selectedBlocks: [] })
    get().scheduleAutosave()
    get().announce('Redo')
  },

  setPreviewMode: (mode) => set({ previewMode: mode }),
  setZoom: (zoom) => set({ zoom: Math.min(150, Math.max(50, zoom)) }),
  setSelectedBlockId: (id) => set({ selectedBlockId: id, selectedBlocks: id ? [id] : [] }),
  setActiveDragId: (id) => set({ activeDragId: id }),
  setShowShortcutsModal: (show) => set({ showShortcutsModal: show }),

  selectMultiple: (ids) => set({ selectedBlocks: ids, selectedBlockId: ids[0] || null }),

  toggleBlockSelection: (id, shiftKey = false) => {
    const { selectedBlocks } = get()
    if (shiftKey) {
      const next = selectedBlocks.includes(id)
        ? selectedBlocks.filter((bid) => bid !== id)
        : [...selectedBlocks, id]
      set({ selectedBlocks: next, selectedBlockId: next[0] || null })
    } else {
      set({ selectedBlocks: [id], selectedBlockId: id })
    }
  },

  deselectAll: () => set({ selectedBlockId: null, selectedBlocks: [] }),

  deleteMultiple: () => {
    const { selectedBlocks } = get()
    if (!selectedBlocks.length) return
    const layout = validateLayout(removeBlocksFromLayout(get().layout, selectedBlocks))
    get().updateLayoutState(layout, 'removeBlock')
    set({ selectedBlockId: null, selectedBlocks: [] })
    get().announce(`${selectedBlocks.length} blocks deleted`)
  },

  duplicateMultiple: () => {
    const { selectedBlocks } = get()
    if (!selectedBlocks.length) return
    const layout = validateLayout(duplicateBlocksInLayout(get().layout, selectedBlocks))
    get().updateLayoutState(layout, 'duplicateBlock')
    get().announce(`${selectedBlocks.length} blocks duplicated`)
  },

  moveMultiple: (direction) => {
    const { selectedBlocks } = get()
    if (selectedBlocks.length !== 1) return
    const layout = validateLayout(moveBlockByArrow(get().layout, selectedBlocks[0], direction))
    get().updateLayoutState(layout, 'moveBlock')
  },

  wrapInContainer: () => {
    const { selectedBlocks } = get()
    if (selectedBlocks.length < 2) return
    const layout = validateLayout(wrapBlocksInContainer(get().layout, selectedBlocks))
    get().updateLayoutState(layout, 'wrapContainer')
    get().announce('Blocks wrapped in container')
  },

  addToast: (message, type = 'info') => {
    const id = crypto.randomUUID()
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }))
    setTimeout(() => get().removeToast(id), 3500)
  },

  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  announce: (message) => {
    set({ srAnnouncement: '' })
    requestAnimationFrame(() => set({ srAnnouncement: message }))
  },

  scheduleAutosave: () => {
    if (autosaveTimer) clearTimeout(autosaveTimer)
    autosaveTimer = setTimeout(() => {
      if (get().isDirty && get().project) get().saveProject()
    }, 1500)
  },

  scheduleDraftSave: () => {
    if (draftTimer) clearInterval(draftTimer)
    draftTimer = setInterval(() => {
      const { project, layout, selectedBlockId, selectedBlocks, zoom, isDirty } = get()
      if (project && isDirty) {
        saveDraft(project.id, { layout, selectedBlockId, selectedBlocks, zoom, title: project.title })
      }
    }, 20000)
  },

  updateLayoutState: (newLayout, action = 'update') => {
    const validated = validateLayout(newLayout)
    const entry = createHistoryEntry(action, validated)
    const { history, historyIndex } = get()
    const { history: newHistory, historyIndex: newIndex } = pushHistory(history, historyIndex, entry, action)

    set({ layout: validated, history: newHistory, historyIndex: newIndex, isDirty: true })
    get().scheduleAutosave()
  },

  updateProjectTitle: (title) => {
    const { project } = get()
    if (!project) return
    set({ project: { ...project, title }, isDirty: true })
    get().scheduleAutosave()
  },

  getBlockCount: () => countBlocks(get().layout),

  reparentBlock: (activeId, parentId, index) => {
    const layout = validateLayout(moveBlockToParent(get().layout, activeId, parentId, index))
    get().updateLayoutState(layout, 'dragging')
  },

  logError: (component, error) => {
    const entry = { component, timestamp: Date.now(), stack: error?.stack || String(error) }
    set((s) => ({ errorLog: [...s.errorLog.slice(-49), entry] }))
  },

  setSafeMode: (enabled) => set({ safeMode: enabled }),
}))

export default useStore
