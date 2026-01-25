import { getPayload } from 'payload'
import config from '@payload-config'
import { seed } from '../src/endpoints/seed/index.js'
import { shamalSeed } from '../src/endpoints/seed/shamal-seed.js'

async function runSeed() {
  const payload = await getPayload({ config })

  // Create a local request without authentication for seeding
  const req = {
    payload,
    user: null,
    context: {},
  } as any

  try {
    console.log('Starting database seed...')
    
    // Run the main seed function
    await seed({ payload, req })
    
    // Run the Shamal-specific seed if enabled
    if (process.env.SEED_DATABASE === 'true' || process.env.SEED_SHAMAL === 'true') {
      await shamalSeed({ payload, req })
    } else {
      // Always run shamal seed for initial setup
      await shamalSeed({ payload, req })
    }
    
    console.log('Database seeded successfully!')
    process.exit(0)
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  }
}

runSeed()

