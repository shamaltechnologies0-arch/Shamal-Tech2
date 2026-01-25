'use client'
import React from 'react'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

class RowLabelErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    // Silently handle errors (e.g., when not in admin context)
    if (process.env.NODE_ENV === 'development') {
      console.debug('RowLabel error (expected outside admin context):', error.message)
    }
  }

  render() {
    if (this.state.hasError) {
      return <div>Row</div>
    }
    return this.props.children
  }
}

const RowLabelInner: React.FC<RowLabelProps> = () => {
  // Always call the hook (React rules require unconditional hook calls)
  const data = useRowLabel<{ sectorSlug?: string }>()

  // If data is not available (e.g., not in admin context), return fallback
  if (!data || !data.data) {
    return <div>Row</div>
  }

  const sectorName = data.data.sectorSlug
    ? data.data.sectorSlug
        .split('-')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    : `Sector ${data.rowNumber !== undefined ? String(data.rowNumber + 1).padStart(2, '0') : ''}`

  return <div>{sectorName}</div>
}

export const RowLabel: React.FC<RowLabelProps> = (props) => {
  return (
    <RowLabelErrorBoundary>
      <RowLabelInner {...props} />
    </RowLabelErrorBoundary>
  )
}

