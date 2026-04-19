import type { Config } from '../payload-types'

import configPromise from '../payload.config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

type Global = keyof Config['globals']

async function getGlobal(slug: Global, depth = 0) {
  const payload = await getPayload({ config: configPromise })

  const global = await payload.findGlobal({
    slug,
    depth,
  })

  return global
}

/**
 * unstable_cache persists entries via JSON.stringify. Clone through JSON so the payload is
 * serializable (avoids rare stringify failures on background revalidation).
 */
function toCacheableJson<T>(value: T): T {
  return JSON.parse(
    JSON.stringify(value, (_key, v) => (typeof v === 'bigint' ? v.toString() : v)),
  ) as T
}

/**
 * Returns an unstable_cache wrapper tagged for `revalidateTag('global_<slug>')` from Payload hooks.
 *
 * Uses `revalidate: false` (infinite lifetime) so Next does **not** time-stale the entry and run
 * background revalidations that log `revalidating cache with key: ...` when the DB hiccups.
 * Updates still propagate via tags when globals change in the CMS.
 */
export const getCachedGlobal = (slug: Global, depth = 0) =>
  unstable_cache(
    async () => {
      const doc = await getGlobal(slug, depth)
      return toCacheableJson(doc)
    },
    [slug, String(depth)],
    {
      tags: [`global_${slug}`],
      revalidate: false,
    },
  )
