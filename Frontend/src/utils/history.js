export const HISTORY_MAX = 100

const BATCH_ACTIONS = new Set(['typing', 'dragging', 'styleUpdate'])
const BATCH_WINDOW_MS = 500

let lastBatch = null

export function createHistoryEntry(action, layout, patch = null) {
  return {
    action,
    timestamp: Date.now(),
    patch: patch || { layout: structuredClone(layout) },
  }
}

export function shouldBatch(action, timestamp) {
  if (!BATCH_ACTIONS.has(action)) return false
  if (!lastBatch) return true
  return lastBatch.action === action && timestamp - lastBatch.timestamp < BATCH_WINDOW_MS
}

export function pushHistory(history, historyIndex, entry, action = 'update') {
  const now = Date.now()

  if (shouldBatch(action, now) && historyIndex >= 0) {
    const updated = [...history]
    updated[historyIndex] = entry
    lastBatch = { action, timestamp: now }
    return { history: updated, historyIndex }
  }

  lastBatch = { action, timestamp: now }
  const newHistory = history.slice(0, historyIndex + 1)
  newHistory.push(entry)
  if (newHistory.length > HISTORY_MAX) newHistory.shift()
  return { history: newHistory, historyIndex: newHistory.length - 1 }
}

export function applyHistoryEntry(layout, entry, direction = 'backward') {
  if (entry.patch?.layout) {
    return structuredClone(entry.patch.layout)
  }
  return layout
}

export function resetBatch() {
  lastBatch = null
}
