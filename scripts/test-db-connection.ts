import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

async function testConnection() {
  try {
    console.log('Testing MongoDB connection...')
    console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set')
    console.log('DATABASE_URI:', process.env.DATABASE_URI ? 'Set' : 'Not set')

    const payload = await getPayload({ config })

    const result = await payload.find({
      collection: 'users',
      limit: 1,
    })

    console.log('✅ Database connection successful!')
    console.log(`Found ${result.totalDocs} user(s) in database`)

    await payload.db.connection?.close()
    process.exit(0)
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
    }
    process.exit(1)
  }
}

testConnection()
