'use client'
import { cn } from '../../utilities/ui'
import useClickableCard from '../../utilities/useClickableCard'
import Link from 'next/link'
import React, { Fragment } from 'react'

import type { Post } from '../../payload-types'

import { Media } from '../Media'
import { Card as ShadcnCard, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'

export type CardPostData = Pick<Post, 'slug' | 'categories' | 'meta' | 'title'>

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardPostData
  relationTo?: 'posts'
  showCategories?: boolean
  title?: string
}> = (props) => {
  const { card, link } = useClickableCard({})
  const { className, doc, relationTo, showCategories, title: titleFromProps } = props

  const { slug, categories, meta, title } = doc || {}
  const { description, image: metaImage } = meta || {}

  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s/g, ' ') // replace non-breaking space with white space
  const href = `/${relationTo}/${slug}`

  return (
    <ShadcnCard
      className={cn('hover:cursor-pointer hover:shadow-lg transition-shadow', className)}
      ref={card.ref as React.Ref<HTMLDivElement>}
    >
      <div className="relative w-full">
        {!metaImage && <div className="h-48 bg-muted flex items-center justify-center">No image</div>}
        {metaImage && typeof metaImage !== 'string' && <Media resource={metaImage} size="33vw" />}
      </div>
      <CardHeader>
        {showCategories && hasCategories && (
          <div className="flex flex-wrap gap-2 mb-2">
                {categories?.map((category, index) => {
                  if (typeof category === 'object') {
                    const { title: titleFromCategory } = category
                    const categoryTitle = titleFromCategory || 'Untitled category'
                    return (
                  <Badge key={index} variant="secondary" className="uppercase text-xs">
                        {categoryTitle}
                  </Badge>
                    )
                  }
                  return null
                })}
          </div>
        )}
        {titleToUse && (
          <CardTitle>
            <Link className="hover:underline" href={href} ref={link.ref}>
                {titleToUse}
              </Link>
          </CardTitle>
        )}
      </CardHeader>
      {description && (
        <CardContent>
          <CardDescription>{sanitizedDescription}</CardDescription>
        </CardContent>
      )}
    </ShadcnCard>
  )
}
