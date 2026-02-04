'use client'

import Link from 'next/link'

import { Logo } from '../Logo/Logo'

export function ProfileHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-center px-4">
        <Link href="/" className="flex items-center">
          <Logo loading="eager" priority="high" variant="primary" className="h-10 md:h-12 w-auto" />
        </Link>
      </div>
    </header>
  )
}
