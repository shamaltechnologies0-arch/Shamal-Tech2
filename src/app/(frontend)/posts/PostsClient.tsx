'use client'

import { useState } from 'react'
import { CollectionArchive, CardPostData } from '../../../components/CollectionArchive'
import { PostsFilter } from '../../../components/filters/PostsFilter.client'

interface PostsClientProps {
  posts: CardPostData[]
}

export function PostsClient({ posts }: PostsClientProps) {
  const [filteredPosts, setFilteredPosts] = useState<CardPostData[]>(posts)

  return (
    <div className="container mx-auto px-4 w-full">
      <PostsFilter posts={posts as any} onFilterChange={setFilteredPosts as any} />
      <CollectionArchive posts={filteredPosts} />
      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-logo-navy text-lg font-medium">
            No posts found. Try adjusting your filters.
          </p>
        </div>
      )}
    </div>
  )
}

