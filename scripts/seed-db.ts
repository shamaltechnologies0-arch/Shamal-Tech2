import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'
import { seed } from '../src/endpoints/seed/index.js'
import type { PayloadRequest } from 'payload'

async function runSeed() {
  try {
    console.log('Initializing Payload...')
    const payload = await getPayload({ config })

    // Create a minimal request object for seeding
    const req = {
      payload,
      user: null,
      context: {
        disableRevalidate: true,
      },
      headers: new Headers(),
    } as unknown as PayloadRequest

    console.log('Starting database seed...')
    
    // Run the main seed function (which includes shamal-seed)
    await seed({ payload, req })
    
    console.log('✅ Database seeded successfully!')
    await payload.db.connection?.close()
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

runSeed()

