'use client'

import React from 'react'

interface ErrorBoundaryState {
  hasError: boolean
}

interface ErrorBoundaryProps {
  children: React.ReactNode
}

export class AdminBarErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    // Silently handle errors (e.g., unauthorized when not logged in)
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Only log non-authentication errors in development
    if (
      process.env.NODE_ENV === 'development' &&
      !error.message?.includes('Unauthorized') &&
      !error.message?.includes('must be logged in')
    ) {
      console.debug('AdminBar error:', error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError) {
      // Don't render anything if there's an error (user is not authenticated)
      return null
    }

    return this.props.children
  }
}
