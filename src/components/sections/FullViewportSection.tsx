import React from 'react'
import { cn } from '../../utilities/ui'

interface FullViewportSectionProps {
  children: React.ReactNode
  className?: string
  id?: string
}

export const FullViewportSection: React.FC<FullViewportSectionProps> = ({
  children,
  className,
  id,
}) => {
  return (
    <section
      id={id}
      className={cn('min-h-screen flex items-center justify-center relative', className)}
    >
      {children}
    </section>
  )
}

