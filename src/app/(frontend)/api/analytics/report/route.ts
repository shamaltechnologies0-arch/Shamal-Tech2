import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

import configPromise from '@/payload.config'
import { canAccessBusinessAnalytics } from '@/access/analyticsSuperAdmin'
import { computeDashboard } from '@/lib/analytics/computeDashboard'
import { loadAnalyticsEventsInRange, loadPurchaseEventsBetween } from '@/lib/analytics/loadEvents'
import { parseRange, rollingFrom, utcDayBounds } from '@/lib/analytics/dateRange'
import { getPayload } from 'payload'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(req: Request) {
  const payload = await getPayload({ config: configPromise })
  const requestHeaders = await headers()
  const { user } = await payload.auth({ headers: requestHeaders })
  if (!(await canAccessBusinessAnalytics(payload, user))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const url = new URL(req.url)
  const { from, to, preset } = parseRange(url.searchParams)

  const todayB = utcDayBounds(new Date())
  const weekB = rollingFrom(7)
  const monthB = rollingFrom(30)

  const [events, leadsLostResult, todayPurchases, weekPurchases, monthPurchases] = await Promise.all([
    loadAnalyticsEventsInRange(payload, from, to),
    payload.count({
      collection: 'leads',
      where: {
        and: [
          { status: { equals: 'lost' } },
          { createdAt: { greater_than_equal: from } },
          { createdAt: { less_than_equal: to } },
        ],
      },
      overrideAccess: true,
    }),
    loadPurchaseEventsBetween(payload, todayB.from, todayB.to),
    loadPurchaseEventsBetween(payload, weekB.from, weekB.to),
    loadPurchaseEventsBetween(payload, monthB.from, monthB.to),
  ])

  const report = await computeDashboard(payload, events, {
    from,
    to,
    leadsLostInRange: leadsLostResult.totalDocs,
    purchaseEventsForRevenueWindows: {
      today: todayPurchases,
      week: weekPurchases,
      month: monthPurchases,
    },
  })

  return NextResponse.json({ ...report, preset })
}
