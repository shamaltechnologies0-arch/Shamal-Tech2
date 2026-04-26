export type AnalyticsEventRow = {
  id: number | string
  sessionId: string
  eventType: string
  pageUrl: string
  productId?: number | { id: number } | null
  orderId?: string | null
  source?: string | null
  deviceType?: string | null
  browser?: string | null
  country?: string | null
  city?: string | null
  searchKeyword?: string | null
  referrerUrl?: string | null
  userId?: number | { id: number } | null
  metaData?: Record<string, unknown> | null
  createdAt: string
}
