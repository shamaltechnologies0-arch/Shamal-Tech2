'use client'

import React from 'react'
import { useLanguage } from '../../providers/Language/LanguageContext'
import { getCommonTranslations } from '../../lib/translations/common'

const defaultCollectionLabels: Record<string, { plural: string; singular: string }> = {
  posts: {
    plural: 'Posts',
    singular: 'Post',
  },
}

export const PageRangeClient: React.FC<{
  className?: string
  collection?: keyof typeof defaultCollectionLabels
  collectionLabels?: {
    plural?: string
    singular?: string
  }
  currentPage?: number
  limit?: number
  totalDocs?: number
}> = (props) => {
  const { language } = useLanguage()
  const t = getCommonTranslations(language)
  const {
    className,
    collection,
    collectionLabels: collectionLabelsFromProps,
    currentPage,
    limit,
    totalDocs,
  } = props

  let indexStart = (currentPage ? currentPage - 1 : 1) * (limit || 1) + 1
  if (totalDocs && indexStart > totalDocs) indexStart = 0

  let indexEnd = (currentPage || 1) * (limit || 1)
  if (totalDocs && indexEnd > totalDocs) indexEnd = totalDocs

  const labels =
    collectionLabelsFromProps ||
    (collection ? defaultCollectionLabels[collection] : undefined) || { plural: t.posts, singular: t.post }

  const { plural, singular } = labels
  const label = totalDocs && totalDocs > 1 ? plural : singular
  const range = indexStart > 0 ? ` - ${indexEnd}` : ''

  return (
    <div className={[className, 'font-semibold'].filter(Boolean).join(' ')}>
      {(typeof totalDocs === 'undefined' || totalDocs === 0) && t.searchNoResults}
      {typeof totalDocs !== 'undefined' &&
        totalDocs > 0 &&
        t.showingXOfY
          .replace('{start}', String(indexStart))
          .replace('{range}', range)
          .replace('{total}', String(totalDocs))
          .replace('{label}', label)}
    </div>
  )
}
