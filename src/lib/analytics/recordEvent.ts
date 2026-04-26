import type { Payload } from 'payload'

import type { AnalyticsEventType } from './eventTypes'
import { classifyTrafficSource } from './trafficSource'
import { detectBrowserName, detectDeviceType, type DeviceKind } from './device'
import { countryFromRequestHeaders } from './geo'
import { getClientIp } from './clientIp'

export type TrackBody = {
  eventType: AnalyticsEventType
  pageUrl: string
  sessionId: string
  productId?: number | string | null
  orderId?: string | null
  searchKeyword?: string | null
  referrerUrl?: string | null
  metaData?: Record<string, unknown> | null
}

const BOT_RE = /bot|crawler|spider|slurp|bingpreview|facebookexternalhit|embedly|quora link preview/i

export async function recordAnalyticsEventFromRequest(
  payload: Payload,
  req: Request,
  body: TrackBody,
): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  const ua = req.headers.get('user-agent')
  if (ua && BOT_RE.test(ua)) {
    return { ok: true }
  }

  if (!body?.sessionId || typeof body.sessionId !== 'string') {
    return { ok: false, status: 400, error: 'sessionId required' }
  }
  if (!body?.pageUrl || typeof body.pageUrl !== 'string') {
    return { ok: false, status: 400, error: 'pageUrl required' }
  }
  if (!body?.eventType) {
    return { ok: false, status: 400, error: 'eventType required' }
  }

  const headers = req.headers
  const ip = getClientIp(headers)
  const { country, city } = countryFromRequestHeaders(headers)
  const deviceType: DeviceKind = detectDeviceType(ua, headers.get('sec-ch-ua-mobile'))
  const browser = detectBrowserName(ua)
  const source = classifyTrafficSource(body.referrerUrl ?? null, body.pageUrl)

  const since = new Date(Date.now() - 4000).toISOString()
  const dup = await payload.find({
    collection: 'analytics-events',
    where: {
      and: [
        { sessionId: { equals: body.sessionId } },
        { eventType: { equals: body.eventType } },
        { pageUrl: { equals: body.pageUrl } },
        ...(body.productId != null && String(body.productId).length > 0
          ? [{ productId: { equals: Number(body.productId) } }]
          : []),
        { createdAt: { greater_than: since } },
      ],
    },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  if (dup.docs.length > 0) {
    return { ok: true }
  }

  const productIdNum =
    body.productId != null && body.productId !== '' ? Number(body.productId) : undefined
  const data: Record<string, unknown> = {
    sessionId: body.sessionId.slice(0, 120),
    eventType: body.eventType,
    pageUrl: body.pageUrl.slice(0, 2000),
    source,
    deviceType,
    browser,
    country: country || undefined,
    city: city || undefined,
    ipAddress: ip ? ip.slice(0, 64) : undefined,
    searchKeyword: body.searchKeyword?.slice(0, 500) || undefined,
    referrerUrl: body.referrerUrl?.slice(0, 2000) || undefined,
    orderId: body.orderId?.slice(0, 120) || undefined,
    metaData: body.metaData ?? undefined,
  }
  if (productIdNum != null && !Number.isNaN(productIdNum)) {
    data.productId = productIdNum
  }

  await payload.create({
    collection: 'analytics-events',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: data as any,
    overrideAccess: true,
    context: { disableRevalidate: true },
  })

  return { ok: true }
}

/** Server-side (webhooks, API routes) — no dedupe, trusted caller. */
export async function recordAnalyticsEventTrusted(
  payload: Payload,
  data: {
    sessionId: string
    eventType: AnalyticsEventType
    pageUrl: string
    productId?: number | null
    orderId?: string | null
    searchKeyword?: string | null
    referrerUrl?: string | null
    source?: string
    deviceType?: DeviceKind
    browser?: string
    country?: string
    city?: string
    ipAddress?: string
    metaData?: Record<string, unknown> | null
  },
): Promise<void> {
  const row: Record<string, unknown> = {
    sessionId: data.sessionId.slice(0, 120),
    eventType: data.eventType,
    pageUrl: data.pageUrl.slice(0, 2000),
    source: data.source ?? 'unknown',
    deviceType: data.deviceType ?? 'unknown',
    browser: data.browser ?? 'Other',
    country: data.country,
    city: data.city,
    ipAddress: data.ipAddress,
    searchKeyword: data.searchKeyword,
    referrerUrl: data.referrerUrl,
    orderId: data.orderId,
    metaData: data.metaData ?? undefined,
  }
  if (data.productId != null && !Number.isNaN(data.productId)) row.productId = data.productId

  await payload.create({
    collection: 'analytics-events',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: row as any,
    overrideAccess: true,
    context: { disableRevalidate: true },
  })
}
