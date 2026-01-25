import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

async function publishPortfolio() {
  try {
    console.log('Connecting to database...')
    const payload = await getPayload({ config })

    // Get all portfolio items
    const portfolio = await payload.find({
      collection: 'portfolio',
      limit: 100,
      depth: 0,
    })

    console.log(`Found ${portfolio.docs.length} portfolio items`)

    // Update each portfolio item to published status
    for (const item of portfolio.docs) {
      try {
        await payload.update({
          collection: 'portfolio',
          id: item.id,
          data: {
            _status: 'published',
          },
          context: {
            disableRevalidate: true,
          },
        })
        console.log(`✓ Published: ${item.title}`)
      } catch (error) {
        console.error(`✗ Failed to publish ${item.title}:`, error)
      }
    }

    console.log('✅ All portfolio items published!')
    await payload.db.connection?.close()
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

publishPortfolio()

