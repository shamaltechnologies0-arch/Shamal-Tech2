import { NextRequest, NextResponse } from 'next/server'

import configPromise from '../../../../../payload.config'
import { syncSeoKeywordsFromPublicFile } from '@/lib/seo/syncKeywordsFromPublicTxt'
import { getPayload } from 'payload'
import type { PayloadRequest } from 'payload'

const SEO_SYNC_SECRET =
  process.env.SEO_SYNC_SECRET || process.env.REVALIDATE_SECRET || process.env.CRON_SECRET

/**
 * Bulk-load SEO keywords from `public/keywords.txt` into Payload:
 * - `seo-keywords` collection (upsert)
 * - `seo-settings` global (replaces primary/secondary/long-tail with file-derived lists; merges JSON mappings)
 *
 * Auth: `Authorization: Bearer <SEO_SYNC_SECRET|REVALIDATE_SECRET|CRON_SECRET>`
 *
 * Example:
 *   curl -X POST https://shamal.sa/api/seo/sync-keywords -H "Authorization: Bearer YOUR_SECRET"
 */
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

  if (!SEO_SYNC_SECRET || token !== SEO_SYNC_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload = await getPayload({ config: configPromise })
    const req = {
      payload,
      user: null,
      context: { disableRevalidate: true },
      headers: new Headers(),
    } as unknown as PayloadRequest

    const result = await syncSeoKeywordsFromPublicFile({ payload, req })

    return NextResponse.json({
      ok: true,
      ...result,
      message:
        'SEO keywords synced from public/keywords.txt. Refresh Globals → SEO Settings in admin.',
    })
  } catch (error) {
    console.error('[api/seo/sync-keywords]', error)
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Sync failed' },
      { status: 500 },
    )
  }
}
