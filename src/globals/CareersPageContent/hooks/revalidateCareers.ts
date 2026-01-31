import type { GlobalAfterChangeHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidateCareers: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating careers-page-content`)

    revalidateTag('global_careers-page-content')
    revalidatePath('/careers')
  }

  return doc
}
