import { headers } from 'next/headers'
import React from 'react'

import { Footer } from '../../Footer/Component'
import { Header } from '../../Header/Component'
import { Chatbot } from '../Chatbot/ChatbotDynamic'
import { PromoPopup } from '../PromoPopup'
import { ProfileHeader } from '../ProfileHeader'
import { stripLocalePrefix } from '../../lib/i18n/locale'

function getLayoutFlags(pathname: string) {
  const isMinimalLayout = pathname.startsWith('/profile/') || pathname.startsWith('/employee/')
  return {
    isMinimalLayout,
    hideFooter: isMinimalLayout,
    hideChatbot: isMinimalLayout || pathname.startsWith('/training'),
    hidePromoPopup: isMinimalLayout,
  }
}

/**
 * Renders site chrome only when needed. Avoids Header/Footer CMS fetches on
 * routes that hide them (employee cards, etc.).
 */
export async function LayoutChrome({ children }: { children: React.ReactNode }) {
  const headerStore = await headers()
  const pathname = stripLocalePrefix(
    headerStore.get('x-internal-pathname') || headerStore.get('x-pathname') || '',
  )
  const { isMinimalLayout, hideFooter, hideChatbot, hidePromoPopup } = getLayoutFlags(pathname)

  return (
    <>
      {isMinimalLayout ? <ProfileHeader /> : <Header />}
      {children}
      {!hideFooter ? <Footer /> : null}
      {!hideChatbot ? <Chatbot /> : null}
      {!hidePromoPopup ? <PromoPopup /> : null}
    </>
  )
}
