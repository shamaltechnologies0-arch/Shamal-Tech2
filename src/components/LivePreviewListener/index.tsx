'use client'
import { getClientSideURL } from '../../utilities/getURL'
import { RefreshRouteOnSave as PayloadLivePreview } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation'
import React from 'react'

export const LivePreviewListener: React.FC = () => {
  const router = useRouter()
  // serverURL should point to the Payload API endpoint (same origin as frontend in this setup)
  const serverURL = getClientSideURL()
  return <PayloadLivePreview refresh={router.refresh} serverURL={serverURL} />
}
