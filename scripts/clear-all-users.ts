/**
 * Deletes every document in the `users` collection (Payload auth).
 * After this, /admin should offer first-user registration again (empty users).
 *
 * SAFETY — will not run unless you explicitly confirm:
 *   CLEAR_USERS_CONFIRM=yes npx tsx scripts/clear-all-users.ts
 *
 * Uses MONGODB_URI / DATABASE_URI from .env (same as the app).
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import type { PayloadRequest } from 'payload'

import config from '@payload-config'

if (process.env.CLEAR_USERS_CONFIRM !== 'yes') {
  console.error(
    'Refusing to delete users. Run:\n  CLEAR_USERS_CONFIRM=yes npx tsx scripts/clear-all-users.ts',
  )
  process.exit(1)
}

async function main() {
  const payload = await getPayload({ config })

  const before = await payload.count({ collection: 'users', overrideAccess: true })
  console.log(`Users before: ${before.totalDocs}`)

  const req = {
    payload,
    user: null,
    context: { disableRevalidate: true },
    headers: new Headers(),
  } as unknown as PayloadRequest

  await payload.db.deleteMany({ collection: 'users', req, where: {} })

  const after = await payload.count({ collection: 'users', overrideAccess: true })
  console.log(`Users after: ${after.totalDocs}`)
  console.log('Done. Open /admin and create the first admin user.')

  await payload.db.connection?.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
