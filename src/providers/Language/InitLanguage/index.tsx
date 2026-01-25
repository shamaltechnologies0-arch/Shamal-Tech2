import Script from 'next/script'
import React from 'react'

export const InitLanguage: React.FC = () => {
  return (
    // eslint-disable-next-line @next/next/no-before-interactive-script-outside-document
    <Script
      dangerouslySetInnerHTML={{
        __html: `
  (function () {
    var languageToSet = 'en'
    var directionToSet = 'ltr'
    var preference = window.localStorage.getItem('language')

    if (preference === 'ar') {
      languageToSet = 'ar'
      directionToSet = 'rtl'
    } else {
      languageToSet = 'en'
      directionToSet = 'ltr'
    }

    document.documentElement.setAttribute('lang', languageToSet)
    document.documentElement.setAttribute('dir', directionToSet)
  })();
  `,
      }}
      id="language-script"
      strategy="beforeInteractive"
    />
  )
}


