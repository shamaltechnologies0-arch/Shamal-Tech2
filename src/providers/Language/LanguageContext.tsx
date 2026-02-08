'use client'

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'

type Language = 'en' | 'ar'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextType | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')

  useEffect(() => {
    const saved = (typeof window !== 'undefined' && window.localStorage.getItem('language')) || 'en'
    setLanguageState((saved === 'ar' ? 'ar' : 'en') as Language)
  }, [])

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('language', lang)
      document.documentElement.setAttribute('lang', lang)
      document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr')
    }
  }, [])

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    return { language: 'en' as Language, setLanguage: () => {} }
  }
  return ctx
}
