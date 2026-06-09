import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import App from './App'
import { loadTheme } from '../utils/storage'
import { registerAllBlocks } from '../registry/registerBlocks'

registerAllBlocks()

const theme = loadTheme()
if (theme === 'dark') {
  document.documentElement.classList.add('dark')
}

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('reduce-motion')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
