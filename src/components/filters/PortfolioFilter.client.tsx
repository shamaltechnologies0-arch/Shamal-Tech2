'use client'

import React, { useState, useMemo } from 'react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { X } from 'lucide-react'
import { cn } from '../../utilities/ui'
import type { Media } from '../../payload-types'

type PortfolioItem = {
  id: string
  title: string
  slug: string
  sector?: string | null
  client?: string | null
  featured?: boolean | null
  images?: Array<{ url?: string | null } | string | Media> | null
  [key: string]: any
}

interface PortfolioFilterProps {
  items: PortfolioItem[]
  onFilterChange: (filteredItems: PortfolioItem[]) => void
}

export function PortfolioFilter({ items, onFilterChange }: PortfolioFilterProps) {
  // Extract unique sectors from items
  const sectors = useMemo(() => {
    const sectorSet = new Set<string>()
    items.forEach((item) => {
      if (item.sector && typeof item.sector === 'string') {
        sectorSet.add(item.sector)
      }
    })
    return Array.from(sectorSet).sort()
  }, [items])

  const [selectedSector, setSelectedSector] = useState<string | null>(null)
  const [showFeatured, setShowFeatured] = useState<boolean | null>(null)

  // Filter items based on selected filters
  const filteredItems = useMemo(() => {
    let filtered = [...items]

    if (selectedSector) {
      filtered = filtered.filter((item) => item.sector === selectedSector)
    }

    if (showFeatured !== null) {
      filtered = filtered.filter((item) => (item.featured === true) === showFeatured)
    }

    return filtered
  }, [items, selectedSector, showFeatured])

  // Notify parent of filtered items
  React.useEffect(() => {
    onFilterChange(filteredItems)
  }, [filteredItems, onFilterChange])

  const handleSectorChange = (sector: string | null) => {
    setSelectedSector(sector === selectedSector ? null : sector)
  }

  const handleFeaturedToggle = () => {
    setShowFeatured(showFeatured === true ? null : true)
  }

  const clearFilters = () => {
    setSelectedSector(null)
    setShowFeatured(null)
  }

  const hasActiveFilters = selectedSector !== null || showFeatured !== null

  return (
    <div className="flex flex-wrap items-center gap-3 mb-12 p-4 rounded-xl border-2 border-logo-blue/20 bg-background/95 backdrop-blur-sm">
      {/* Sector Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-logo-navy mr-2">Sector:</span>
        <Button
          variant={selectedSector === null ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleSectorChange(null)}
          className={cn(
            'text-sm font-medium transition-all',
            selectedSector === null
              ? 'bg-logo-blue text-white hover:bg-logo-blue/90'
              : 'border-logo-blue/30 text-logo-navy hover:bg-logo-blue/10'
          )}
        >
          All
        </Button>
        {sectors.map((sector) => (
          <Button
            key={sector}
            variant={selectedSector === sector ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleSectorChange(sector)}
            className={cn(
              'text-sm font-medium transition-all',
              selectedSector === sector
                ? 'bg-logo-blue text-white hover:bg-logo-blue/90'
                : 'border-logo-blue/30 text-logo-navy hover:bg-logo-blue/10'
            )}
          >
            {sector}
            {filteredItems.filter((item) => item.sector === sector).length > 0 && (
              <Badge variant="secondary" className="ml-2 bg-white/20 text-xs">
                {filteredItems.filter((item) => item.sector === sector).length}
              </Badge>
            )}
          </Button>
        ))}
      </div>

      {/* Featured Filter */}
      <div className="flex items-center gap-2 ml-auto">
        <Button
          variant={showFeatured === true ? 'default' : 'outline'}
          size="sm"
          onClick={handleFeaturedToggle}
          className={cn(
            'text-sm font-medium transition-all',
            showFeatured === true
              ? 'bg-logo-blue text-white hover:bg-logo-blue/90'
              : 'border-logo-blue/30 text-logo-navy hover:bg-logo-blue/10'
          )}
        >
          Featured Only
        </Button>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-sm text-logo-blue hover:text-logo-navy hover:bg-logo-blue/10"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>
    </div>
  )
}

