import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Post } from '../../../payload-types'

export const revalidatePost: CollectionAfterChangeHook<Post> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/posts/${doc.slug}`

      payload.logger.info(`Revalidating post at path: ${path}`)

      // Revalidate the specific post page
      revalidatePath(path)
      // Revalidate listing pages to show updated content
      revalidatePath('/posts')
      revalidatePath('/posts/page/1')
      revalidateTag('posts-sitemap')
    }

    // If the post was previously published, we need to revalidate the old path
    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const oldPath = `/posts/${previousDoc.slug}`

      payload.logger.info(`Revalidating old post at path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidateTag('posts-sitemap')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Post> = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    const path = `/posts/${doc?.slug}`

    payload.logger.info(`Revalidating deleted post at path: ${path}`)

    // Revalidate the specific post page
    revalidatePath(path)
    // Revalidate the posts listing page
    revalidatePath('/posts')
    revalidatePath('/posts/page/1')
    // Revalidate sitemap
    revalidateTag('posts-sitemap')
  }

  return doc
}
