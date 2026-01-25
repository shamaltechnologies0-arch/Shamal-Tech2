'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Badge } from '../../../components/ui/badge'
import { ArrowRight } from 'lucide-react'
import { PortfolioFilter } from '../../../components/filters/PortfolioFilter.client'
import { StaggerReveal } from '../../../utilities/animations'
import type { Media } from '../../../payload-types'

type PortfolioItem = {
  id: string
  title: string
  slug: string
  sector?: string | null
  client?: string | null
  featured?: boolean | null
  completionDate?: string | Date | null
  images?: Array<{ url?: string | null } | string | Media> | null
  [key: string]: any
}

interface PortfolioClientProps {
  items: PortfolioItem[]
}

export function PortfolioClient({ items }: PortfolioClientProps) {
  const [filteredItems, setFilteredItems] = useState<PortfolioItem[]>(items)

  return (
    <>
      <PortfolioFilter items={items} onFilterChange={(filtered) => setFilteredItems(filtered)} />
      <StaggerReveal direction="up" delay={0.3} stagger={0.1} duration={0.8}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-logo-blue/20 hover:border-logo-blue/50 bg-background/95 backdrop-blur-sm"
            >
              <Link href={`/portfolio/${item.slug}`} className="block">
                {item.images &&
                  Array.isArray(item.images) &&
                  item.images[0] &&
                  typeof item.images[0] === 'object' &&
                  'url' in item.images[0] && (
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={item.images[0].url as string}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                      {item.featured && (
                        <Badge
                          className="absolute top-4 right-4 bg-logo-blue text-white"
                          variant="default"
                        >
                          Featured
                        </Badge>
                      )}
                    </div>
                  )}
                <CardHeader>
                  <CardTitle className="text-2xl font-display font-bold text-logo-navy group-hover:text-logo-blue transition-colors">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {item.client && (
                    <CardDescription className="mb-2 text-base text-logo-blue font-medium">
                      <strong className="text-logo-navy">Client:</strong> {item.client}
                    </CardDescription>
                  )}
                  {item.sector && (
                    <CardDescription className="mb-2 text-base text-logo-blue font-medium">
                      <strong className="text-logo-navy">Sector:</strong> {item.sector}
                    </CardDescription>
                  )}
                  {item.completionDate && (
                    <CardDescription className="text-sm mb-4 text-logo-gray font-medium">
                      Completed: {new Date(item.completionDate as string).toLocaleDateString()}
                    </CardDescription>
                  )}
                  <div className="flex items-center text-logo-navy text-sm font-semibold group-hover:text-logo-blue transition-colors">
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </StaggerReveal>
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <Card className="max-w-2xl mx-auto border-2 border-logo-blue/30 shadow-xl bg-background/95 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-display font-bold text-logo-navy">
                No Projects Found
              </CardTitle>
              <CardDescription className="text-base text-logo-blue font-medium">
                Try adjusting your filters to see more results.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      )}
    </>
  )
}

