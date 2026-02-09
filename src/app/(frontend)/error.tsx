'use client'

import React, { useEffect } from 'react'
import { Button } from '../../components/ui/button'
import { useLanguage } from '../../providers/Language/LanguageContext'
import { getCommonTranslations } from '../../lib/translations/common'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const { language } = useLanguage()
  const t = getCommonTranslations(language)

  useEffect(() => {
    console.error('Layout error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-6 bg-background">
      <h1 className="text-xl font-semibold text-foreground">{t.somethingWentWrong}</h1>
      <p className="text-muted-foreground text-center max-w-md">
        {t.errorPageDescription}
      </p>
      <Button onClick={reset} variant="default">
        {t.tryAgain}
      </Button>
      <Button
        onClick={() => window.location.reload()}
        variant="outline"
      >
        {t.refreshPage}
      </Button>
    </div>
  )
}
