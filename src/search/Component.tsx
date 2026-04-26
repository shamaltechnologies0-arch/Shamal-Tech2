'use client'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import React, { useState, useEffect } from 'react'
import { useDebounce } from '../utilities/useDebounce'
import { useRouter } from 'next/navigation'

import { trackPublicEvent } from '@/lib/analytics/client'

export const Search: React.FC = () => {
  const [value, setValue] = useState('')
  const router = useRouter()

  const debouncedValue = useDebounce(value)

  useEffect(() => {
    router.push(`/search${debouncedValue ? `?q=${debouncedValue}` : ''}`)
  }, [debouncedValue, router])

  useEffect(() => {
    const q = debouncedValue.trim()
    if (q.length < 2) return
    trackPublicEvent({
      eventType: 'SEARCH_USED',
      pageUrl: `/search?q=${encodeURIComponent(q)}`,
      searchKeyword: q,
    })
  }, [debouncedValue])

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
        }}
      >
        <Label htmlFor="search" className="sr-only">
          Search
        </Label>
        <Input
          id="search"
          onChange={(event) => {
            setValue(event.target.value)
          }}
          placeholder="Search"
        />
        <button type="submit" className="sr-only">
          submit
        </button>
      </form>
    </div>
  )
}
