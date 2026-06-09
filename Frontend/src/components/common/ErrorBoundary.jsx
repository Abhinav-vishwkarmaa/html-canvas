import { Component } from 'react'
import { AlertTriangle } from 'lucide-react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="border-2 border-dashed border-red-400 bg-red-50 dark:bg-red-950/30 rounded-lg p-6 flex flex-col items-center gap-2 text-red-600 dark:text-red-400">
          <AlertTriangle className="w-6 h-6" />
          <p className="text-sm font-medium">Block render error</p>
          <p className="text-xs opacity-70">{this.state.error?.message}</p>
        </div>
      )
    }
    return this.props.children
  }
}
