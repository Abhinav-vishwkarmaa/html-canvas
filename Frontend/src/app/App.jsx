import { memo } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import GlobalErrorBoundary from '../components/common/GlobalErrorBoundary'
import ToastContainer from '../components/common/Toast'
import ScreenReaderAnnouncer from '../components/common/ScreenReaderAnnouncer'
import DashboardPage from '../pages/DashboardPage'
import Templates from '../pages/Templates'
import Builder from '../pages/Builder'
import Preview from '../pages/Preview'

function App() {
  return (
    <GlobalErrorBoundary name="App">
      <BrowserRouter>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-lg">
          Skip to main content
        </a>
        <main id="main-content">
          <Routes>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/builder/:id" element={<Builder />} />
            <Route path="/preview/:id" element={<Preview />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
        <ToastContainer />
        <ScreenReaderAnnouncer />
      </BrowserRouter>
    </GlobalErrorBoundary>
  )
}

export default memo(App)
