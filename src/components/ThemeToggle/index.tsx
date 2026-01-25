'use client'

import React, { useState, useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'
import { cn } from '../../utilities/ui'
import { useTheme } from '../../providers/Theme'

export const ThemeToggle: React.FC<{ className?: string }> = ({ className }) => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Fix hydration mismatch by only using theme after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  // Default to light mode for SSR/hydration consistency
  const isDark = mounted ? theme === 'dark' : false

  const handleToggle = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  // Render consistent markup during SSR and initial render
  return (
    <button
      type="button"
      onClick={handleToggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleToggle()
        }
      }}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      dir="ltr"
      className={cn(
        'relative inline-flex h-8 w-14 sm:h-9 sm:w-16 items-center rounded-full transition-all duration-250 ease-in-out',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'cursor-pointer hover:scale-105 active:scale-95',
        // Light mode: warm amber/yellow background with soft shadow
        !isDark &&
          'bg-gradient-to-br from-amber-100 via-amber-50 to-yellow-50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),0_2px_8px_rgba(251,191,36,0.2)]',
        // Dark mode: dark slate background with soft shadow
        isDark &&
          'bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3),0_2px_8px_rgba(0,0,0,0.4)]',
        className
      )}
    >
      {/* Sliding knob with neumorphic effect */}
      <span
        className={cn(
          'absolute h-6 w-6 sm:h-7 sm:w-7 rounded-full transition-all duration-250 ease-in-out',
          'flex items-center justify-center',
          'shadow-[0_2px_4px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.8)]',
          // Light mode: knob on the left with sun icon
          !isDark && 'left-1 translate-x-0 bg-white',
          // Dark mode: knob on the right with moon icon
          isDark && 'left-full -translate-x-7 sm:-translate-x-8 bg-slate-200'
        )}
      >
        {/* Icon inside knob */}
        {isDark ? (
          <Moon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-700 transition-transform duration-250" />
        ) : (
          <Sun className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-500 transition-transform duration-250" />
        )}
      </span>

      {/* Background icons positioned on both sides - hidden when knob overlaps */}
      <div className="flex w-full items-center justify-between px-2 sm:px-2.5 pointer-events-none">
        <Sun
          className={cn(
            'h-3.5 w-3.5 sm:h-4 sm:w-4 transition-all duration-250',
            !isDark
              ? 'opacity-0' // Hide when knob is over it (light mode)
              : 'opacity-20 text-amber-400 scale-100' // Show muted when dark mode
          )}
        />
        <Moon
          className={cn(
            'h-3.5 w-3.5 sm:h-4 sm:w-4 transition-all duration-250',
            isDark
              ? 'opacity-0' // Hide when knob is over it (dark mode)
              : 'opacity-20 text-slate-400 scale-100' // Show muted when light mode
          )}
        />
      </div>
    </button>
  )
}

