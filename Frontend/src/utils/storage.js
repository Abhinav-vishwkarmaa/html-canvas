const STORAGE_KEY = 'templatecraft_projects'
const DRAFTS_KEY = 'templatecraft_drafts'
const THEME_KEY = 'templatecraft_theme'

let saveTimer = null
let pendingProjects = null

export function loadProjects() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveProjects(projects, immediate = false) {
  pendingProjects = projects
  if (immediate) {
    flushSave()
    return
  }
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(flushSave, 500)
}

function flushSave() {
  if (pendingProjects) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pendingProjects))
    pendingProjects = null
  }
  saveTimer = null
}

export function loadDrafts() {
  try {
    const data = localStorage.getItem(DRAFTS_KEY)
    return data ? JSON.parse(data) : {}
  } catch {
    return {}
  }
}

export function saveDraft(projectId, draft) {
  const drafts = loadDrafts()
  drafts[projectId] = {
    ...draft,
    savedAt: new Date().toISOString(),
  }
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts))
}

export function deleteDraft(projectId) {
  const drafts = loadDrafts()
  delete drafts[projectId]
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts))
}

export function loadTheme() {
  return localStorage.getItem(THEME_KEY) || 'light'
}

export function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, theme)
}
