'use client'

import { useLanguage } from '../../providers/Language/LanguageContext'
import { getLocalizedValue } from '../../lib/localization'

interface LocalizedContentProps {
  en: string | null | undefined
  ar: string | null | undefined
  fallback?: string
  children?: (content: string) => React.ReactNode
}

/**
 * Renders the appropriate localized string based on current language.
 * Use as a wrapper or with render prop.
 */
export function LocalizedContent({ en, ar, fallback = '', children }: LocalizedContentProps) {
  const { language } = useLanguage()
  const content = getLocalizedValue(en, ar, language) || fallback

  if (children) {
    return <>{children(content)}</>
  }

  return <>{content}</>
}
