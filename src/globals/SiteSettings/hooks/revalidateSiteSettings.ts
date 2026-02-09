import type { GlobalAfterChangeHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidateSiteSettings: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating site-settings`)

    revalidateTag('global_site-settings')
    // Revalidate layout (footer) and pages that use site settings
    revalidatePath('/', 'layout')
    revalidatePath('/contact')
    revalidatePath('/about')
  }

  return doc
}
