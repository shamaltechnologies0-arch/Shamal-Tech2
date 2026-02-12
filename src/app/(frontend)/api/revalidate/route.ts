import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest } from 'next/server'

const REVALIDATE_SECRET =
  process.env.REVALIDATE_SECRET || process.env.CRON_SECRET

/**
 * Manual revalidation API - call after saving Site Settings in admin if changes don't appear.
 * Requires: Authorization: Bearer <REVALIDATE_SECRET> or Bearer <CRON_SECRET> (if REVALIDATE_SECRET not set).
 * Usage: GET /api/revalidate?tag=global_site-settings (or path=/) with header Authorization: Bearer <secret>
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (!REVALIDATE_SECRET || token !== REVALIDATE_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const tag = request.nextUrl.searchParams.get('tag')
  const path = request.nextUrl.searchParams.get('path')

  if (tag) {
    revalidateTag(tag)
    return Response.json({ revalidated: true, tag })
  }

  if (path) {
    revalidatePath(path, 'layout')
    return Response.json({ revalidated: true, path })
  }

  // Default: revalidate site settings (most common use case)
  revalidateTag('global_site-settings')
  revalidatePath('/', 'layout')
  revalidatePath('/contact')
  revalidatePath('/about')

  return Response.json({
    revalidated: true,
    message: 'Site settings cache cleared. Refresh the frontend to see changes.',
  })
}
