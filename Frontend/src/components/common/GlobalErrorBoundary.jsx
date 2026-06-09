import { Component } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import useStore from '../../store/useStore'

export default class GlobalErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    useStore.getState().logError(this.props.name || 'App', error)
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null })
  }

  handleSafeMode = () => {
    useStore.getState().setSafeMode(true)
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-950">
          <div className="max-w-md w-full glass rounded-2xl p-8 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-sm text-slate-500 mb-4">{this.state.error?.message}</p>
            <details className="text-left text-xs text-slate-400 mb-6 max-h-32 overflow-auto">
              <summary className="cursor-pointer mb-1">Diagnostics</summary>
              <pre className="whitespace-pre-wrap">{this.state.error?.stack}</pre>
            </details>
            <div className="flex gap-3 justify-center">
              <button onClick={this.handleReload} className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-primary-600 text-white hover:bg-primary-700">
                <RefreshCw className="w-4 h-4" /> Reload
              </button>
              <button onClick={this.handleSafeMode} className="px-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700">
                Safe Mode
              </button>
            </div>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
