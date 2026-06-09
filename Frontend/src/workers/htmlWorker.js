import { generateHTML } from './htmlGenerator.js'

self.onmessage = (e) => {
  const { layout, title, device, requestId } = e.data
  try {
    const html = generateHTML(layout, title, device)
    self.postMessage({ html, requestId })
  } catch (err) {
    self.postMessage({ html: generateHTML(layout || [], title, device), requestId, error: err?.message })
  }
}
