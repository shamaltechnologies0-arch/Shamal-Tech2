import type { Metadata } from 'next'

import { cn } from '../../utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { Rajdhani, Inter } from 'next/font/google'
import React from 'react'

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-rajdhani',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
})

import { AdminBar } from '../../components/AdminBar'
import { Footer } from '../../Footer/Component'
import { Header } from '../../Header/Component'
import { Providers } from '../../providers'
import { InitTheme } from '../../providers/Theme/InitTheme'
import { InitLanguage } from '../../providers/Language/InitLanguage'
import { mergeOpenGraph } from '../../utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'
import { Chatbot } from '../../components/Chatbot'
import { getCachedGlobal } from '../../utilities/getGlobals'

import './globals.css'
import { getServerSideURL } from '../../utilities/getURL'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <html className={cn(GeistSans.variable, GeistMono.variable, rajdhani.variable, inter.variable)} lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        <InitLanguage />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

          <Header />
          {children}
          <Footer />
          <Chatbot />
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}
