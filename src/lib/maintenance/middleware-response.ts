import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { getMaintenanceContact, getMaintenanceRetryAfterSeconds } from './config'
import { buildMaintenancePageHtml } from './page-html'

const JSON_BODY = JSON.stringify({
  error: 'Service Unavailable',
  message: 'The site is temporarily unavailable due to maintenance.',
  maintenance: true,
})

export function maintenanceMiddlewareResponse(request: NextRequest): NextResponse {
  const retryAfter = getMaintenanceRetryAfterSeconds()
  const headers = new Headers({
    'Retry-After': String(retryAfter),
    'Cache-Control': 'no-store, must-revalidate',
  })

  const pathname = request.nextUrl.pathname
  const isApi = pathname.startsWith('/api')

  if (isApi) {
    headers.set('Content-Type', 'application/json; charset=utf-8')
    if (request.method === 'HEAD') {
      return new NextResponse(null, { status: 503, headers })
    }
    return new NextResponse(JSON_BODY, { status: 503, headers })
  }

  headers.set('Content-Type', 'text/html; charset=utf-8')
  if (request.method === 'HEAD') {
    return new NextResponse(null, { status: 503, headers })
  }

  const html = buildMaintenancePageHtml(getMaintenanceContact())
  return new NextResponse(html, { status: 503, headers })
}
