'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'

import { trackPublicEvent } from '@/lib/analytics/client'

/**
 * Fires PAGE_VIEW on route changes for the public marketing site (not Payload admin).
 */
export function PublicSiteAnalytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const last = useRef<string | null>(null)

  useEffect(() => {
    if (!pathname) return
    if (pathname.startsWith('/next/')) return
    const q = searchParams?.toString()
    const full = q ? `${pathname}?${q}` : pathname
    if (last.current === full) return
    last.current = full
    trackPublicEvent({
      eventType: 'PAGE_VIEW',
      pageUrl: full,
    })
  }, [pathname, searchParams])

  return null
}
