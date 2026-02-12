'use client'
import { getClientSideURL } from '../../utilities/getURL'
import { RefreshRouteOnSave as PayloadLivePreview } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation'
import React, { useCallback } from 'react'

export const LivePreviewListener: React.FC = () => {
  const router = useRouter()
  const serverURL = getClientSideURL()
  // Defer refresh to avoid Next.js 15 "Rendered more hooks than during the previous render" (App Router + useMemo)
  const deferredRefresh = useCallback(() => {
    setTimeout(() => router.refresh(), 0)
  }, [router])
  return <PayloadLivePreview refresh={deferredRefresh} serverURL={serverURL} />
}
