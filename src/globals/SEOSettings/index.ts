import type { GlobalConfig } from 'payload'

import { anyone } from '../../access/anyone'

import { revalidateSEOSettings } from './hooks/revalidateSEOSettings'

export const SEOSettings: GlobalConfig = {
  slug: 'seo-settings',
  access: {
    read: anyone,
    update: anyone,
  },
  hooks: {
    afterChange: [revalidateSEOSettings],
  },
  admin: {
    description:
      'Keywords saved here are applied to every public page (meta keywords, Open Graph, and JSON-LD). Save this global after edits so the live site cache refreshes.',
  },
  fields: [
    {
      name: 'primaryKeywords',
      type: 'text',
      hasMany: true,
      label: 'Primary SEO Keywords',
      admin: {
        description: 'These phrases are injected into every public page meta tag after you save.',
      },
      defaultValue: [
        'DJI Products',
        'Drone company',
        'drone company in saudi',
        'Authorized DJI Drones Seller',
        'Authorized DJI Products Seller',
        'drone survey Saudi Arabia',
        'geospatial solutions KSA',
        'drone services Jeddah',
      ],
    },
    {
      name: 'secondaryKeywords',
      type: 'text',
      hasMany: true,
      label: 'Secondary SEO Keywords',
    },
    {
      name: 'longTailKeywords',
      type: 'text',
      hasMany: true,
      label: 'Long-tail Keywords',
    },
    {
      name: 'arabicPrimaryKeywords',
      type: 'text',
      hasMany: true,
      label: 'Arabic Primary SEO Keywords',
      admin: {
        description: 'كلمات مفتاحية عربية رئيسية — للبحث باللغة العربية في السعودية',
      },
    },
    {
      name: 'arabicSecondaryKeywords',
      type: 'text',
      hasMany: true,
      label: 'Arabic Secondary SEO Keywords',
    },
    {
      name: 'arabicLongTailKeywords',
      type: 'text',
      hasMany: true,
      label: 'Arabic Long-tail Keywords',
    },
    {
      name: 'serviceKeywords',
      type: 'json',
      label: 'Service-specific Keywords Mapping',
    },
    {
      name: 'sectorKeywords',
      type: 'json',
      label: 'Sector-specific Keywords Mapping',
    },
    {
      name: 'metaDescriptionTemplate',
      type: 'textarea',
      label: 'Meta Description Template',
    },
    {
      name: 'metaDescriptionTemplateAr',
      type: 'textarea',
      label: 'Meta Description Template (Arabic)',
      admin: {
        description: 'قالب وصف الميتا بالعربية',
      },
    },
    {
      name: 'ogImageDefault',
      type: 'upload',
      relationTo: 'media',
      label: 'Default Open Graph Image',
    },
    {
      name: 'twitterCardDefault',
      type: 'upload',
      relationTo: 'media',
      label: 'Default Twitter Card Image',
    },
  ],
}

