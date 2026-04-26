import type { Payload } from 'payload'

import type { AnalyticsEventRow } from './types'

const PAGE = 500
const MAX_PAGES = 120

export async function loadAnalyticsEventsInRange(
  payload: Payload,
  fromIso: string,
  toIso: string,
): Promise<AnalyticsEventRow[]> {
  const out: AnalyticsEventRow[] = []
  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const res = await payload.find({
      collection: 'analytics-events',
      where: {
        and: [
          { createdAt: { greater_than_equal: fromIso } },
          { createdAt: { less_than_equal: toIso } },
        ],
      },
      depth: 0,
      limit: PAGE,
      page,
      sort: '-createdAt',
      overrideAccess: true,
    })
    for (const d of res.docs) {
      out.push(d as unknown as AnalyticsEventRow)
    }
    if (res.docs.length < PAGE) break
  }
  return out
}

export async function loadPurchaseEventsBetween(
  payload: Payload,
  fromIso: string,
  toIso: string,
): Promise<AnalyticsEventRow[]> {
  const out: AnalyticsEventRow[] = []
  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const res = await payload.find({
      collection: 'analytics-events',
      where: {
        and: [
          { eventType: { equals: 'PURCHASE_SUCCESS' } },
          { createdAt: { greater_than_equal: fromIso } },
          { createdAt: { less_than_equal: toIso } },
        ],
      },
      depth: 0,
      limit: PAGE,
      page,
      sort: '-createdAt',
      overrideAccess: true,
    })
    for (const d of res.docs) out.push(d as unknown as AnalyticsEventRow)
    if (res.docs.length < PAGE) break
  }
  return out
}
