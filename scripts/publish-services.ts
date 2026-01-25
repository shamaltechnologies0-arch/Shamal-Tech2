import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

async function publishServices() {
  try {
    console.log('Connecting to database...')
    const payload = await getPayload({ config })

    // Get all services
    const services = await payload.find({
      collection: 'services',
      limit: 100,
      depth: 0,
    })

    console.log(`Found ${services.docs.length} services`)

    // Update each service to published status
    for (const service of services.docs) {
      try {
        await payload.update({
          collection: 'services',
          id: service.id,
          data: {
            _status: 'published',
          },
          context: {
            disableRevalidate: true,
          },
        })
        console.log(`✓ Published: ${service.title}`)
      } catch (error) {
        console.error(`✗ Failed to publish ${service.title}:`, error)
      }
    }

    console.log('✅ All services published!')
    await payload.db.connection?.close()
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

publishServices()

