import type { GlobalAfterChangeHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidatePosts: GlobalAfterChangeHook = async ({ doc, req: { payload, context } }) => {
  if (!(context as { disableRevalidate?: boolean })?.disableRevalidate) {
    payload.logger.info(`Revalidating posts-page-content`)

    revalidateTag('global_posts-page-content')
    revalidatePath('/posts')
    revalidatePath('/posts/page/1')

    const posts = await payload.find({
      collection: 'posts',
      depth: 0,
      draft: false,
      limit: 500,
      overrideAccess: true,
      pagination: false,
      select: { slug: true },
      where: {
        _status: {
          equals: 'published',
        },
      },
    })

    for (const post of posts.docs) {
      if (post.slug) revalidatePath(`/posts/${post.slug}`)
    }
  }

  return doc
}
