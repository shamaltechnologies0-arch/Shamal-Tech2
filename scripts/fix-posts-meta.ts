/**
 * One-time migration: ensures all posts and their versions have meta: {} to prevent
 * "Cannot read properties of undefined (reading 'title')" when saving/editing in CMS.
 *
 * Run: pnpm run fix:posts-meta
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

async function fixPostsMeta() {
  const payload = await getPayload({ config })
  let totalFixed = 0

  // Iterate through all posts and patch missing/null meta.
  let page = 1
  let hasNext = true
  while (hasNext) {
    const result = await payload.find({
      collection: 'posts',
      depth: 0,
      limit: 100,
      page,
      overrideAccess: true,
    })

    for (const post of result.docs) {
      if (!post.meta) {
        await payload.update({
          collection: 'posts',
          id: post.id,
          data: { meta: {} },
          depth: 0,
          overrideAccess: true,
        })
        totalFixed += 1
      }
    }

    hasNext = result.hasNextPage
    page += 1
  }

  console.log(`Done. Total posts fixed: ${totalFixed}`)

  await payload.db.connection?.close()
}

fixPostsMeta().catch((err) => {
  console.error(err)
  process.exit(1)
})
