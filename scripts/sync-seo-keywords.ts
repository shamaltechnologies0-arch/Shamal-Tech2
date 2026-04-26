import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { PayloadRequest } from 'payload'
import { syncSeoKeywordsFromPublicFile } from '../src/lib/seo/syncKeywordsFromPublicTxt'

async function main() {
  const payload = await getPayload({ config })
  const req = {
    payload,
    user: null,
    context: { disableRevalidate: true },
    headers: new Headers(),
  } as unknown as PayloadRequest

  const result = await syncSeoKeywordsFromPublicFile({ payload, req })

  console.log(`Synced from ${result.keywordsPath}`)
  console.log(
    `Parsed: ${result.parsedCount} | Created: ${result.collectionCreated} | Updated: ${result.collectionUpdated}`,
  )
  console.log(
    `SEO Settings → primary: ${result.primaryKeywordsCount}, secondary: ${result.secondaryKeywordsCount}, long-tail: ${result.longTailKeywordsCount}`,
  )

  await payload.db.connection?.close()
}

main().catch((error) => {
  console.error('Failed to sync SEO keywords:', error)
  process.exit(1)
})
