import type { GlobalAfterChangeHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidateAbout: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating about-page-content`)

    revalidateTag('global_about-page-content')
    revalidatePath('/about')
    // Also revalidate homepage since it uses client logos from about content
    revalidatePath('/')
  }

  return doc
}

