'use client'

import { usePathname } from 'next/navigation'

import { ProfileHeader } from '../ProfileHeader'

interface ConditionalLayoutProps {
  children: React.ReactNode
  fullHeader: React.ReactNode
  footer: React.ReactNode
  chatbot?: React.ReactNode
}

export function ConditionalLayout({ children, fullHeader, footer, chatbot }: ConditionalLayoutProps) {
  const pathname = usePathname()
  const isProfilePage = pathname?.startsWith('/profile/')

  return (
    <>
      {isProfilePage ? <ProfileHeader /> : fullHeader}
      {children}
      {!isProfilePage && footer}
      {!isProfilePage && chatbot}
    </>
  )
}
