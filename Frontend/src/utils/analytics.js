const METRICS_KEY = 'templatecraft_metrics'

const defaultMetrics = {
  projectsCreated: 0,
  blocksAdded: 0,
  exports: 0,
  saveCount: 0,
  sessionTime: 0,
  sessions: 0,
}

let sessionStart = Date.now()

export function loadMetrics() {
  try {
    const data = localStorage.getItem(METRICS_KEY)
    return data ? { ...defaultMetrics, ...JSON.parse(data) } : { ...defaultMetrics }
  } catch {
    return { ...defaultMetrics }
  }
}

function saveMetrics(metrics) {
  localStorage.setItem(METRICS_KEY, JSON.stringify(metrics))
}

export function trackEvent(event, value = 1) {
  const metrics = loadMetrics()
  if (event in metrics) {
    metrics[event] = (metrics[event] || 0) + value
  }
  saveMetrics(metrics)
}

export function startSession() {
  sessionStart = Date.now()
  trackEvent('sessions')
}

export function endSession() {
  const duration = Math.round((Date.now() - sessionStart) / 1000)
  const metrics = loadMetrics()
  metrics.sessionTime = (metrics.sessionTime || 0) + duration
  saveMetrics(metrics)
}

export function getUsageSummary() {
  return loadMetrics()
}
