import React from 'react'
import { ConnectionErrorPage } from '@/components/errors/ConnectionErrorPage'

type ErrorBoundaryProps = {
  children: React.ReactNode
  variant?: 'site' | 'admin'
  homeHref?: string
}

type ErrorBoundaryState = {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Unhandled render error:', error, info)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <ConnectionErrorPage
          variant={this.props.variant ?? 'site'}
          homeHref={this.props.homeHref ?? '/'}
          onRetry={this.handleRetry}
          showHome
        />
      )
    }

    return this.props.children
  }
}
