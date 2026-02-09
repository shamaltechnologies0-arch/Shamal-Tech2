'use client'

import { useState } from 'react'
import { CollectionArchive, CardPostData } from '../../../components/CollectionArchive'
import { PostsFilter } from '../../../components/filters/PostsFilter.client'
import { useLanguage } from '../../../providers/Language/LanguageContext'
import { getCommonTranslations } from '../../../lib/translations/common'

interface PostsClientProps {
  posts: CardPostData[]
}

export function PostsClient({ posts }: PostsClientProps) {
  const { language } = useLanguage()
  const t = getCommonTranslations(language)
  const [filteredPosts, setFilteredPosts] = useState<CardPostData[]>(posts)

  return (
    <div className="container mx-auto px-4 w-full">
      <PostsFilter posts={posts as any} onFilterChange={setFilteredPosts as any} />
      <CollectionArchive posts={filteredPosts} />
      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-logo-navy text-lg font-medium">
            {t.noPostsFound}
          </p>
        </div>
      )}
    </div>
  )
}

