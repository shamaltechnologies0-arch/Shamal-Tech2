/**
 * Set a new password for a Payload admin user (local or any env with MONGODB_URI).
 * Does not read or “recover” the old password — hashes are one-way.
 *
 * Usage:
 *   NEW_PASSWORD='YourNewStrongPass' npx tsx scripts/reset-admin-password.ts s.ehsan@shamal.sa
 */
import 'dotenv/config'
import { getPayload } from 'payload'

import config from '@payload-config'

const email = process.argv[2]?.toLowerCase().trim()
const password = process.env.NEW_PASSWORD?.trim()

if (!email || !password) {
  console.error('Usage: NEW_PASSWORD=\'…\' npx tsx scripts/reset-admin-password.ts user@example.com')
  process.exit(1)
}

if (password.length < 8) {
  console.error('Password must be at least 8 characters.')
  process.exit(1)
}

async function main() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
    overrideAccess: true,
  })
  if (!docs[0]) {
    console.error(`No user found with email: ${email}`)
    process.exit(1)
  }

  await payload.update({
    collection: 'users',
    id: docs[0].id,
    data: { password },
    overrideAccess: true,
  })

  console.log(`Password updated for ${email}. You can log in to /admin with the new password.`)
  await payload.db.connection?.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
