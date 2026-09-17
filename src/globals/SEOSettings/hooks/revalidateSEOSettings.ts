import type { GlobalAfterChangeHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidateSEOSettings: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating seo-settings`)

    revalidateTag('global_seo-settings')
    revalidateTag('collection_seo-keywords')
    revalidatePath('/', 'layout')
  }

  return doc
}
