import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Portfolio as PortfolioType } from '../../../payload-types'

export const revalidatePortfolio: CollectionAfterChangeHook<PortfolioType> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/portfolio/${doc.slug}`
      payload.logger.info(`Revalidating portfolio at path: ${path}`)
      // Revalidate the specific portfolio page
      revalidatePath(path)
      // Revalidate listing page to show updated content
      revalidatePath('/portfolio')
      revalidateTag('portfolio-sitemap')
    }

    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const oldPath = `/portfolio/${previousDoc.slug}`
      payload.logger.info(`Revalidating old portfolio at path: ${oldPath}`)
      revalidatePath(oldPath)
      revalidateTag('portfolio-sitemap')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<PortfolioType> = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    const path = `/portfolio/${doc?.slug}`
    payload.logger.info(`Revalidating deleted portfolio at path: ${path}`)
    // Revalidate the specific portfolio page
    revalidatePath(path)
    // Revalidate listing page to remove deleted content
    revalidatePath('/portfolio')
    revalidateTag('portfolio-sitemap')
  }
  return doc
}

