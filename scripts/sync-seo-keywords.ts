import 'dotenv/config'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { PayloadRequest } from 'payload'

type KeywordCategory = 'primary' | 'secondary' | 'long-tail' | 'service-specific' | 'sector-specific'

const sectionToCategory: Array<{ match: string; category: KeywordCategory; priority: number }> = [
  { match: '🔹 Core Brand Keywords', category: 'primary', priority: 10 },
  { match: '🔹 Primary Service Keywords', category: 'primary', priority: 10 },
  { match: '🔹 Industry-Specific Keywords', category: 'sector-specific', priority: 9 },
  { match: '🔹 Advanced & Technical Keywords', category: 'secondary', priority: 8 },
  { match: '🔹 Trust & Compliance Keywords', category: 'secondary', priority: 8 },
  { match: '🔹 Suggested SEO', category: 'secondary', priority: 8 },
  { match: '🔹 Advanced Drone & Inspection', category: 'service-specific', priority: 9 },
  { match: '🔹 Geospatial, GIS & Mapping', category: 'service-specific', priority: 9 },
  { match: '🔹 Satellite Imagery & Remote Data', category: 'service-specific', priority: 9 },
  { match: '🔹 Construction, BIM & Mega Projects', category: 'service-specific', priority: 9 },
  { match: '🔹 AI, Analytics & Smart Solutions', category: 'service-specific', priority: 9 },
  { match: '🔹 Environment, Sustainability & ESG', category: 'sector-specific', priority: 9 },
  { match: '🔹 Security, Surveillance & Autonomous Systems', category: 'service-specific', priority: 9 },
  { match: '🔹 Marine, Bathymetry & Underwater', category: 'service-specific', priority: 9 },
  { match: '🔹 Authority & Trust-Building', category: 'secondary', priority: 8 },
]

const exactCategoryLabels: Record<string, KeywordCategory> = {
  'Primary Keyword': 'primary',
  'Secondary Keywords': 'secondary',
  'Long-Tail Keywords': 'long-tail',
  'Long-Tail Keywords:': 'long-tail',
}

const skipExact = new Set([
  'SEO Key Words',
  'Use these across homepage, meta titles, and About pages.',
  'These attract decision-makers actively looking for solutions.',
  'Target these on service landing pages.',
  'These position Shamal as a technology leader.',
  'Boost credibility and conversion.',
  'Use these together in pages/blogs for stronger ranking:',
  'High demand + strong conversion intent.',
  'Core authority positioning.',
  'Excellent for government & mega-project traffic.',
  'Perfect for NEOM, ROSHN, PIF-type clients.',
  'Positions Shamal as future-focused.',
  'Very strong for government, ESG, Vision 2030.',
  'High-value niche keywords.',
  'Low competition, high specialization.',
  'Important for rankings + credibility.',
  'Construction & Infrastructure',
  'Oil & Gas',
  'Government & Smart Cities',
  'Environment & Agriculture',
  'Drone Inspection Services',
  'Aerial & Land Surveying',
  'Construction Monitoring',
  'GIS & Remote Sensing',
  'Satellite Imagery Solutions',
  'Environmental Monitoring',
  'Oil & Gas Solutions',
  'Traffic Count & Analysis',
  'Security & Surveillance',
  'Marine & Underwater Survey',
])

function normalize(line: string): string {
  return line
    .replace(/[“”]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function looksLikeKeyword(line: string): boolean {
  if (!line) return false
  if (skipExact.has(line)) return false
  if (line.startsWith('🔹')) return false
  if (exactCategoryLabels[line]) return false
  if (line.length < 5) return false
  if (!/[A-Za-z0-9]/.test(line)) return false
  return true
}

async function syncKeywords() {
  const payload = await getPayload({ config })
  const req = {
    payload,
    user: null,
    context: { disableRevalidate: true },
    headers: new Headers(),
  } as unknown as PayloadRequest

  const keywordsPath = join(process.cwd(), 'public', 'keywords.txt')
  const raw = readFileSync(keywordsPath, 'utf8')
  const lines = raw.split('\n').map((line) => normalize(line)).filter(Boolean)

  let currentCategory: KeywordCategory = 'secondary'
  let currentPriority = 8
  const collected = new Map<string, { category: KeywordCategory; priority: number }>()

  for (const line of lines) {
    const matchedSection = sectionToCategory.find((entry) => line.includes(entry.match))
    if (matchedSection) {
      currentCategory = matchedSection.category
      currentPriority = matchedSection.priority
      continue
    }

    if (exactCategoryLabels[line]) {
      currentCategory = exactCategoryLabels[line]
      currentPriority = currentCategory === 'primary' ? 10 : currentCategory === 'long-tail' ? 7 : 8
      continue
    }

    if (!looksLikeKeyword(line)) continue
    if (!collected.has(line)) {
      collected.set(line, { category: currentCategory, priority: currentPriority })
    }
  }

  let created = 0
  let updated = 0

  for (const [keyword, meta] of collected.entries()) {
    const existing = await payload.find({
      collection: 'seo-keywords',
      where: { keyword: { equals: keyword } },
      limit: 1,
      req,
    })

    if (existing.docs.length === 0) {
      await payload.create({
        collection: 'seo-keywords',
        data: {
          keyword,
          category: meta.category,
          priority: meta.priority,
          active: true,
        },
        req,
      })
      created++
    } else {
      await payload.update({
        collection: 'seo-keywords',
        id: existing.docs[0].id,
        data: {
          category: meta.category,
          priority: meta.priority,
          active: true,
        },
        req,
      })
      updated++
    }
  }

  const allKeywords = [...collected.keys()]
  const primaryKeywords = [...collected.entries()]
    .filter(([, meta]) => meta.category === 'primary')
    .map(([keyword]) => keyword)
  const secondaryKeywords = [...collected.entries()]
    .filter(([, meta]) => meta.category === 'secondary' || meta.category === 'service-specific' || meta.category === 'sector-specific')
    .map(([keyword]) => keyword)
  const longTailKeywords = [...collected.entries()]
    .filter(([, meta]) => meta.category === 'long-tail')
    .map(([keyword]) => keyword)

  const settings = await payload.findGlobal({ slug: 'seo-settings', req })
  const unique = (items: string[]) => [...new Set(items)]

  await payload.updateGlobal({
    slug: 'seo-settings',
    data: {
      primaryKeywords: unique([...(settings.primaryKeywords || []), ...primaryKeywords]),
      secondaryKeywords: unique([...(settings.secondaryKeywords || []), ...secondaryKeywords]),
      longTailKeywords: unique([...(settings.longTailKeywords || []), ...longTailKeywords]),
      serviceKeywords: {
        ...(settings.serviceKeywords || {}),
        _allFromKeywordsTxt: allKeywords,
      },
      metaDescriptionTemplate:
        settings.metaDescriptionTemplate ||
        'Shamal Technologies - {title}. Professional drone and geospatial solutions in Saudi Arabia.',
    },
    req,
  })

  const finalCount = await payload.find({
    collection: 'seo-keywords',
    limit: 0,
    req,
  })

  console.log(`Synced keywords from ${keywordsPath}`)
  console.log(`Created: ${created}`)
  console.log(`Updated: ${updated}`)
  console.log(`Total parsed from file: ${collected.size}`)
  console.log(`Total now in seo-keywords: ${finalCount.totalDocs}`)

  await payload.db.connection?.close()
}

syncKeywords().catch((error) => {
  console.error('Failed to sync SEO keywords:', error)
  process.exit(1)
})
