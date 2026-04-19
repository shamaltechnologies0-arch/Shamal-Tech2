import { getPayload } from 'payload'
import configPromise from '../payload.config'
import type { Payload } from 'payload'
import { unstable_cache } from 'next/cache'

/**
 * Get a Payload instance with proper error handling for MongoDB session expiration
 * This ensures each server component gets a fresh Payload instance per request
 */
export async function getPayloadInstance(): Promise<Payload> {
  try {
    return await getPayload({ config: configPromise })
  } catch (error) {
    // If session expired, log and rethrow
    if (error instanceof Error && error.message?.includes('session')) {
      console.error('MongoDB session error:', error.message)
      // Retry once with a fresh instance
      return await getPayload({ config: configPromise })
    }
    throw error
  }
}

/**
 * Safe payload.find() wrapper that handles session expiration and ensures
 * proper access control for public pages
 */
export async function safePayloadFind<T = any>(options: {
  collection: string
  limit?: number
  where?: any
  sort?: string
  depth?: number
  draft?: boolean
  overrideAccess?: boolean
  select?: Record<string, boolean>
}): Promise<{ docs: T[]; totalDocs: number; limit: number; totalPages: number; page?: number; hasNextPage?: boolean; hasPrevPage?: boolean; nextPage?: number; prevPage?: number }> {
  const payload = await getPayloadInstance()
  
  // Ensure public queries always use these settings
  const safeOptions = {
    ...options,
    draft: options.draft ?? false, // Never fetch drafts on public pages
    overrideAccess: options.overrideAccess ?? false, // Respect access control
  }

  try {
    return await payload.find({
      collection: safeOptions.collection,
      limit: safeOptions.limit,
      where: safeOptions.where,
      sort: safeOptions.sort,
      depth: safeOptions.depth ?? 0,
      draft: safeOptions.draft,
      overrideAccess: safeOptions.overrideAccess,
      select: safeOptions.select,
    })
  } catch (error) {
    // Handle MongoDB session expiration
    if (error instanceof Error && (error.message?.includes('session') || error.message?.includes('MongoExpiredSession'))) {
      console.warn('MongoDB session expired, retrying query...')
      // Get a fresh payload instance and retry
      const freshPayload = await getPayloadInstance()
      return await freshPayload.find({
        collection: safeOptions.collection,
        limit: safeOptions.limit,
        where: safeOptions.where,
        sort: safeOptions.sort,
        depth: safeOptions.depth ?? 0,
        draft: safeOptions.draft,
        overrideAccess: safeOptions.overrideAccess,
        select: safeOptions.select,
      })
    }
    throw error
  }
}

/**
 * Cached wrapper around `safePayloadFind` for public pages.
 *
 * Notes:
 * - The caller must provide a stable `cacheKeyParts` array (no random/Date).
 * - Use `tags` to support on-demand revalidation when content updates.
 * - Use `revalidate` as a safety net for eventual consistency.
 */
export async function safePayloadFindCached<T = any>(args: {
  cacheKeyParts: string[]
  tags: string[]
  revalidate?: number
  options: Parameters<typeof safePayloadFind<T>>[0]
}): Promise<Awaited<ReturnType<typeof safePayloadFind<T>>>> {
  const { cacheKeyParts, tags, revalidate, options } = args
  return unstable_cache(() => safePayloadFind<T>(options), cacheKeyParts, {
    tags,
    ...(typeof revalidate === 'number' ? { revalidate } : {}),
  })()
}
