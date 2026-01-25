'use client'

import { cn } from '../../utilities/ui'
import React from 'react'

import { Card, CardPostData } from '../Card'
import { StaggerReveal } from '../../utilities/animations'

// Re-export CardPostData for convenience
export type { CardPostData }

export type Props = {
  posts: CardPostData[]
}

export const CollectionArchive: React.FC<Props> = (props) => {
  const { posts } = props

  return (
    <div className={cn('container')}>
      <div>
        <StaggerReveal direction="up" delay={0.2} stagger={0.1} duration={0.8}>
        <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-y-4 gap-x-4 lg:gap-y-8 lg:gap-x-8 xl:gap-x-8">
          {posts?.map((result, index) => {
            if (typeof result === 'object' && result !== null) {
              return (
                <div className="col-span-4" key={index}>
                  <Card className="h-full" doc={result} relationTo="posts" showCategories />
                </div>
              )
            }

            return null
          })}
        </div>
        </StaggerReveal>
      </div>
    </div>
  )
}
