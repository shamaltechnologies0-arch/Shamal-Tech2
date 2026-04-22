'use client'

import React, { useState } from 'react'

export const ExportNewsletterButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleExport = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const apiBase = typeof window !== 'undefined' ? window.location.origin : ''
      const response = await fetch(`${apiBase}/api/newsletter-subscriptions/export`, {
        method: 'GET',
        credentials: 'include',
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.message || data?.error || 'Failed to export subscribers')
      }

      const blob = await response.blob()
      const contentDisposition = response.headers.get('content-disposition')
      const fallbackName = `newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.xlsx`
      const fileName =
        contentDisposition?.match(/filename="(.+)"/)?.[1] || fallbackName

      const downloadUrl = window.URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = downloadUrl
      anchor.download = fileName
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      window.URL.revokeObjectURL(downloadUrl)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Export failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="payload-field-type">
      <div className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">
          Export all newsletter subscriptions to an Excel file.
        </p>
        <button
          type="button"
          onClick={handleExport}
          disabled={isLoading}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {isLoading ? 'Exporting...' : 'Export to Excel (.xlsx)'}
        </button>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    </div>
  )
}

export default ExportNewsletterButton
