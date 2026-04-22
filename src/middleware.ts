import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose/jwt/verify'

import { isMaintenanceMode } from './lib/maintenance/config'
import { maintenanceMiddlewareResponse } from './lib/maintenance/middleware-response'

const COOKIE_NAME = 'training_session'

const TRAINING_PROTECTED_PREFIXES = [
  '/training/dashboard',
  '/training/courses',
  '/training/checkout',
  '/training/admin',
] as const

function matchesRoute(pathname: string, base: string): boolean {
  return pathname === base || pathname.startsWith(`${base}/`)
}

function isTrainingProtectedPath(pathname: string): boolean {
  return TRAINING_PROTECTED_PREFIXES.some((prefix) => matchesRoute(pathname, prefix))
}

function isMaintenanceBypassPath(pathname: string): boolean {
  // Keep admin operations available during public maintenance windows.
  return matchesRoute(pathname, '/admin') || pathname.startsWith('/api/')
}

/**
 * Training JWT gate (when not in maintenance). Maintenance mode short-circuits first with 503.
 */
export async function middleware(request: NextRequest) {
  if (isMaintenanceMode() && !isMaintenanceBypassPath(request.nextUrl.pathname)) {
    return maintenanceMiddlewareResponse(request)
  }

  const secret = process.env.TRAINING_JWT_SECRET
  if (!secret || !isTrainingProtectedPath(request.nextUrl.pathname)) {
    return NextResponse.next()
  }

  const token = request.cookies.get(COOKIE_NAME)?.value
  if (!token) {
    return redirectToLogin(request)
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(secret))
    return NextResponse.next()
  } catch {
    return redirectToLogin(request)
  }
}

function redirectToLogin(request: NextRequest) {
  const url = request.nextUrl.clone()
  url.pathname = '/training/login'
  url.searchParams.set('from', request.nextUrl.pathname + request.nextUrl.search)
  return NextResponse.redirect(url)
}

export const config = {
  matcher: [
    // Explicit `/` — some Next versions do not match the catch-all regex for the homepage.
    '/',
    /*
     * All paths except Next.js internals and common static assets (maintenance HTML is self-contained).
     */
    '/((?!_next/static|_next/image|favicon.ico|favicon.svg|icon.svg|apple-icon.png|robots.txt|site.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|eot)$).*)',
  ],
}
