'use client'

import React, { useState, useMemo } from 'react'
import { Button } from '../ui/button'
import { X } from 'lucide-react'
import { cn } from '../../utilities/ui'

type Post = {
  id: string
  title: string
  categories?: Array<{ id?: string; title?: string; slug?: string } | string> | null
  [key: string]: any
}

interface PostsFilterProps {
  posts: Post[]
  onFilterChange: (filteredPosts: Post[]) => void
}

export function PostsFilter({ posts, onFilterChange }: PostsFilterProps) {
  // Extract unique categories from posts
  const categories = useMemo(() => {
    const categoryMap = new Map<string, { id: string; title: string; slug?: string }>()
    posts.forEach((post) => {
      if (post.categories && Array.isArray(post.categories)) {
        post.categories.forEach((cat) => {
          if (typeof cat === 'object' && cat.id && cat.title) {
            if (!categoryMap.has(cat.id)) {
              categoryMap.set(cat.id, {
                id: cat.id,
                title: cat.title,
                slug: cat.slug,
              })
            }
          }
        })
      }
    })
    return Array.from(categoryMap.values())
  }, [posts])

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Filter posts based on selected category
  const filteredPosts = useMemo(() => {
    if (!selectedCategory) {
      return posts
    }

    return posts.filter((post) => {
      if (!post.categories || !Array.isArray(post.categories)) return false
      return post.categories.some(
        (cat) =>
          (typeof cat === 'object' && cat.id === selectedCategory) ||
          cat === selectedCategory
      )
    })
  }, [posts, selectedCategory])

  // Notify parent of filtered posts
  React.useEffect(() => {
    onFilterChange(filteredPosts)
  }, [filteredPosts, onFilterChange])

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId)
  }

  const clearFilters = () => {
    setSelectedCategory(null)
  }

  if (categories.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap items-center gap-3 mb-8 p-4 rounded-xl border-2 border-logo-blue/20 bg-background/95 backdrop-blur-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-logo-navy mr-2">Category:</span>
        <Button
          variant={selectedCategory === null ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleCategoryChange(null)}
          className={cn(
            'text-sm font-medium transition-all',
            selectedCategory === null
              ? 'bg-logo-blue text-white hover:bg-logo-blue/90'
              : 'border-logo-blue/30 text-logo-navy hover:bg-logo-blue/10'
          )}
        >
          All
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleCategoryChange(category.id)}
            className={cn(
              'text-sm font-medium transition-all',
              selectedCategory === category.id
                ? 'bg-logo-blue text-white hover:bg-logo-blue/90'
                : 'border-logo-blue/30 text-logo-navy hover:bg-logo-blue/10'
            )}
          >
            {category.title}
          </Button>
        ))}
      </div>

      {selectedCategory && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="ml-auto text-sm text-logo-blue hover:text-logo-navy hover:bg-logo-blue/10"
        >
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      )}
    </div>
  )
}

