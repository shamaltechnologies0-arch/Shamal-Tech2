import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

import { SERVICE_CONTENT, toServiceDocument } from '../src/endpoints/seed/service-content'

async function updateServiceContent() {
  const payload = await getPayload({ config })

  const services = await payload.find({
    collection: 'services',
    limit: 100,
    depth: 0,
    pagination: false,
  })

  console.log(`Found ${services.docs.length} services`)
  const found = new Set<string>()

  for (const service of services.docs) {
    const slug = service.slug || ''
    found.add(slug)
    const content = toServiceDocument(slug)

    if (!content) {
      console.log(`skip (no profile copy): ${slug} — ${service.title}`)
      continue
    }

    const image =
      service.seo && typeof service.seo === 'object' && service.seo.image ? service.seo.image : undefined

    await payload.update({
      collection: 'services',
      id: service.id,
      draft: false,
      context: {
        disableRevalidate: true,
      },
      data: {
        ...content,
        _status: 'published',
        seo: {
          ...content.seo,
          ...(image ? { image } : {}),
        },
      },
    })

    console.log(`updated: ${slug}`)
  }

  for (const slug of Object.keys(SERVICE_CONTENT)) {
    if (!found.has(slug)) console.log(`missing in database: ${slug}`)
  }

  const check = await payload.find({
    collection: 'services',
    where: { slug: { equals: 'special-projects' } },
    limit: 1,
    depth: 0,
    draft: false,
  })
  const special = check.docs[0]
  console.log('special-projects hero:', special?.heroDescription)
  console.log('special-projects benefits:', special?.benefits?.length)
  console.log('special-projects overview:', Boolean(special?.overview))
  const traffic = await payload.find({
    collection: 'services',
    where: { slug: { equals: 'traffic-count-traffic-analysis' } },
    limit: 1,
    depth: 0,
    draft: false,
  })
  console.log('traffic hero:', traffic.docs[0]?.heroDescription)
  console.log('traffic benefits:', traffic.docs[0]?.benefits?.length)

  await payload.db.connection?.close()
  process.exit(0)
}

updateServiceContent().catch((error) => {
  console.error(error)
  process.exit(1)
})
