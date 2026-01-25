'use client'

import React from 'react'

import type { Header as HeaderType } from '../../payload-types'

import { CMSLink } from '../../components/Link'
import Link from 'next/link'
import { Menu } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '../../components/ui/sheet'
import { cn } from '../../utilities/ui'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from '../../components/ThemeToggle'
import { LanguageToggle } from '../../components/LanguageToggle'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  // Dynamic navigation items (excluding Posts and Contact as they're managed via CMS)
  const dynamicNavItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Products', href: '/products' },
    { label: 'Careers', href: '/careers' },
  ]

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname?.startsWith(href)
  }

  const NavLink = ({ href, label }: { href: string; label: string }) => (
    <Link
      href={href}
      className={cn(
        'text-sm font-medium transition-colors hover:text-primary',
        isActive(href)
          ? 'text-primary border-b-2 border-primary pb-1'
          : 'text-muted-foreground'
      )}
    >
      {label}
    </Link>
  )

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-8">
        {dynamicNavItems.map((item) => (
          <NavLink key={item.href} href={item.href} label={item.label} />
        ))}
        {navItems.map(({ link }, i) => {
          if (link?.type === 'reference' || link?.type === 'custom') {
            return (
              <CMSLink
                key={`cms-${i}`}
                {...link}
                appearance="link"
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  'text-muted-foreground'
                )}
              />
            )
          }
          return null
        })}
        
        {/* Theme Toggle */}
        <div className="ml-4">
          <ThemeToggle />
        </div>

        {/* Language Toggle */}
        <div className="ml-2">
          <LanguageToggle />
        </div>
      </nav>

      {/* Mobile Navigation */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <nav className="flex flex-col gap-6 mt-8">
            {dynamicNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'text-lg font-medium transition-colors',
                  isActive(item.href)
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-primary'
                )}
              >
                {item.label}
              </Link>
            ))}
            {navItems.map(({ link }, i) => {
              if (link?.type === 'reference' || link?.type === 'custom') {
                return (
                  <CMSLink
                    key={`cms-mobile-${i}`}
                    {...link}
                    appearance="link"
                    className="text-lg font-medium text-muted-foreground hover:text-primary"
                  />
                )
              }
              return null
            })}
            
            {/* Theme Toggle - Mobile */}
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-medium">Theme</span>
                <ThemeToggle />
              </div>
            </div>

            {/* Language Toggle - Mobile */}
            <div className="pt-2 border-t">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium">Language</span>
                <LanguageToggle />
              </div>
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </>
  )
}
