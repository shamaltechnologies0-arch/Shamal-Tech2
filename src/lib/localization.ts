/**
 * Utility for localizing content based on language selection.
 * Returns Arabic content when language is 'ar' and Arabic content exists;
 * otherwise returns English content.
 */

export type SupportedLanguage = 'en' | 'ar'

/**
 * Returns the appropriate localized string based on language.
 * Falls back to English if Arabic is requested but not available.
 */
export function getLocalizedValue(
  en: string | null | undefined,
  ar: string | null | undefined,
  lang: SupportedLanguage
): string {
  if (lang === 'ar' && ar != null && ar.trim() !== '') {
    return ar.trim()
  }
  return (en ?? '').trim() || (ar ?? '').trim() || ''
}
