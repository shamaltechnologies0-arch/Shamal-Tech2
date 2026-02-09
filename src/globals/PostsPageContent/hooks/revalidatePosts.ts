import type { GlobalAfterChangeHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidatePosts: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!(context as { disableRevalidate?: boolean })?.disableRevalidate) {
    payload.logger.info(`Revalidating posts-page-content`)

    revalidateTag('global_posts-page-content')
    revalidatePath('/posts')
    revalidatePath('/posts/page/1')
  }

  return doc
}
