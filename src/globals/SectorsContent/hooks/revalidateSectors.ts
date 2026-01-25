import type { GlobalAfterChangeHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidateSectors: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating sectors-content`)

    revalidateTag('global_sectors-content')
    // Also revalidate homepage since it uses sectors
    revalidateTag('global_homepage-content')
    revalidatePath('/')
  }

  return doc
}

