import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

function revalidateSeoKeywordCache(
  payload: { logger: { info: (message: string) => void } },
  context: { disableRevalidate?: unknown } | undefined,
) {
  if (context?.disableRevalidate) return

  payload.logger.info('Revalidating seo-keywords')
  revalidateTag('collection_seo-keywords')
  revalidateTag('global_seo-settings')
  revalidatePath('/', 'layout')
}

export const revalidateSEOKeywords: CollectionAfterChangeHook = ({
  doc,
  req: { payload, context },
}) => {
  revalidateSeoKeywordCache(payload, context)
  return doc
}

export const revalidateSEOKeywordsDelete: CollectionAfterDeleteHook = ({
  doc,
  req: { payload, context },
}) => {
  revalidateSeoKeywordCache(payload, context)
  return doc
}
