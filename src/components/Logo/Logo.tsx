import clsx from 'clsx'
import Image from 'next/image'
import React from 'react'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
  variant?: 'white' | 'primary'
}

export const Logo = (props: Props) => {
  const { loading: loadingFromProps, priority: priorityFromProps, className, variant = 'primary' } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  const logoSrc = variant === 'white' ? '/logo-white.svg' : '/logo-primary.svg'

  return (
    <Image
      alt="Shamal Technologies Logo"
      width={362}
      height={68}
      loading={loading}
      priority={priority === 'high'}
      decoding="async"
      className={clsx('h-auto w-auto max-w-[280px] md:max-w-[362px]', className)}
      src={logoSrc}
    />
  )
}
