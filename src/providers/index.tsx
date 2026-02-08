import React from 'react'

import { HeaderThemeProvider } from './HeaderTheme'
import { LanguageProvider } from './Language/LanguageContext'
import { ThemeProvider } from './Theme'
import { SmoothScrollProvider } from './SmoothScroll'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <HeaderThemeProvider>
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </HeaderThemeProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}
