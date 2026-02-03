'use client'

import React from 'react'
import { useFormFields } from '@payloadcms/ui'

type QRCodeFieldProps = {
  path?: string
}

const QRCodeField: React.FC<QRCodeFieldProps> = () => {
  const slug = useFormFields(([fields]) => (fields?.slug?.value as string) ?? null)
  if (!slug) {
    return (
      <div className="payload-field-type">
        <p className="text-sm text-muted-foreground">
          Save the employee to generate the profile URL and QR code.
        </p>
      </div>
    )
  }

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const profileUrl = `${baseUrl}/profile/${slug}`
  const qrUrl = `${baseUrl}/api/qr?slug=${encodeURIComponent(slug)}`

  return (
    <div className="payload-field-type space-y-4">
      <div>
        <label className="text-xs font-medium text-muted-foreground block mb-1">Profile URL (for QR code)</label>
        <div className="flex items-center gap-2">
          <code className="text-sm bg-muted px-2 py-1 rounded flex-1 truncate">{profileUrl}</code>
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(profileUrl)}
            className="text-xs px-2 py-1 border rounded hover:bg-muted"
          >
            Copy
          </button>
        </div>
      </div>
      <div>
        <label className="text-xs font-medium text-muted-foreground block mb-2">QR Code (for printing)</label>
        <img
          src={qrUrl}
          alt={`QR code for ${slug}`}
          className="w-48 h-48 border rounded-lg bg-white p-2"
        />
      </div>
    </div>
  )
}

export default QRCodeField
