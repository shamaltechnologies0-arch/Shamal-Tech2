import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest } from 'next/server'

/**
 * Manual revalidation API - call after saving Site Settings in admin if changes don't appear.
 * Usage: POST /api/revalidate with body { "tag": "global_site-settings" } or { "path": "/" }
 * Or GET /api/revalidate?tag=global_site-settings (for quick testing)
 */
export async function GET(request: NextRequest) {
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
