'use client'

import type { AnalyticsEventType } from '@/lib/analytics/eventTypes'

const SESSION_KEY = 'st_analytics_sid_v1'

function randomId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`
}

export function getAnalyticsSessionId(): string {
  if (typeof window === 'undefined') return ''
  try {
    let id = sessionStorage.getItem(SESSION_KEY)
    if (!id) {
      id = randomId()
      sessionStorage.setItem(SESSION_KEY, id)
    }
    return id
  } catch {
    return randomId()
  }
}

export function trackPublicEvent(payload: {
  eventType: AnalyticsEventType
  pageUrl?: string
  productId?: number | string
  orderId?: string
  searchKeyword?: string
  referrerUrl?: string
  metaData?: Record<string, unknown>
}): void {
  if (typeof window === 'undefined') return
  const sessionId = getAnalyticsSessionId()
  if (!sessionId) return

  const body = JSON.stringify({
    eventType: payload.eventType,
    pageUrl: payload.pageUrl ?? window.location.pathname + window.location.search,
    sessionId,
    productId: payload.productId,
    orderId: payload.orderId,
    searchKeyword: payload.searchKeyword,
    referrerUrl: (payload.referrerUrl ?? document.referrer) || null,
    metaData: payload.metaData,
  })

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' })
      navigator.sendBeacon('/api/analytics/track', blob)
      return
    }
  } catch {
    // fall through
  }

  void fetch('/api/analytics/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
  }).catch(() => {})
}
