import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Service } from '../../../payload-types'

export const revalidateService: CollectionAfterChangeHook<Service> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/services/${doc.slug}`
      payload.logger.info(`Revalidating service at path: ${path}`)
      // Revalidate the specific service page
      revalidatePath(path)
      // Revalidate listing page to show updated content
      revalidatePath('/services')
      // Revalidate homepage carousel (services appear there too)
      revalidatePath('/')
      revalidateTag('services-sitemap')
    }

    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const oldPath = `/services/${previousDoc.slug}`
      payload.logger.info(`Revalidating old service at path: ${oldPath}`)
      revalidatePath(oldPath)
      // Revalidate homepage carousel when service is unpublished
      revalidatePath('/')
      revalidateTag('services-sitemap')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Service> = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    const path = `/services/${doc?.slug}`
    payload.logger.info(`Revalidating deleted service at path: ${path}`)
    // Revalidate the specific service page
    revalidatePath(path)
    // Revalidate listing page to remove deleted content
    revalidatePath('/services')
    // Revalidate homepage carousel to remove deleted service
    revalidatePath('/')
    revalidateTag('services-sitemap')
  }
  return doc
}

