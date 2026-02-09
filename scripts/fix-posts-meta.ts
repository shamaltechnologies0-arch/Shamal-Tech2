/**
 * One-time migration: ensures all posts and their versions have meta: {} to prevent
 * "Cannot read properties of undefined (reading 'title')" when saving/editing in CMS.
 *
 * Run: pnpm run fix:posts-meta
 */
import 'dotenv/config'
import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI
if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI')
  process.exit(1)
}

async function fixPostsMeta() {
  await mongoose.connect(MONGODB_URI!)
  const db = mongoose.connection.db
  if (!db) {
    console.error('No database connection')
    process.exit(1)
  }

  let totalFixed = 0

  // Fix payload_posts collection
  const posts = db.collection('payload_posts')
  const postsResult = await posts.updateMany(
    { $or: [{ meta: { $exists: false } }, { meta: null }] },
    { $set: { meta: {} } }
  )
  totalFixed += postsResult.modifiedCount
  if (postsResult.modifiedCount > 0) {
    console.log(`Fixed ${postsResult.modifiedCount} posts in payload_posts`)
  }

  // Fix payload_versions collection (drafts/versions for posts)
  const versions = db.collection('payload_versions')
  const versionsResult = await versions.updateMany(
    {
      $or: [
        { 'version.meta': { $exists: false } },
        { 'version.meta': null },
      ],
    },
    { $set: { 'version.meta': {} } }
  )
  totalFixed += versionsResult.modifiedCount
  if (versionsResult.modifiedCount > 0) {
    console.log(`Fixed ${versionsResult.modifiedCount} versions in payload_versions`)
  }

  console.log(`Done. Total documents fixed: ${totalFixed}`)
  await mongoose.disconnect()
}

fixPostsMeta().catch((err) => {
  console.error(err)
  process.exit(1)
})
