'use client'

import React from 'react'
import RichText from '../../../../components/RichText'
import { useLanguage } from '../../../../providers/Language/LanguageContext'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

type PostContentClientProps = {
  content?: DefaultTypedEditorState | null
  contentAr?: DefaultTypedEditorState | null
  className?: string
}

function hasRichTextContent(data: unknown): boolean {
  if (!data || typeof data !== 'object') return false
  const root = (data as { root?: { children?: unknown[] } }).root
  return Array.isArray(root?.children) && root.children.length > 0
}

/**
 * Renders post body content in the correct language (English or Arabic).
 * Uses contentAr when language is Arabic and Arabic content exists.
 */
export const PostContentClient: React.FC<PostContentClientProps> = ({
  content,
  contentAr,
  className = 'max-w-[48rem] mx-auto',
}) => {
  const { language } = useLanguage()
  const data =
    language === 'ar' && hasRichTextContent(contentAr)
      ? (contentAr as DefaultTypedEditorState)
      : (content as DefaultTypedEditorState)

  if (!data) return null

  return <RichText className={className} data={data} enableGutter={false} />
}
