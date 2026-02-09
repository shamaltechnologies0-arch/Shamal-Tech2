import type { GlobalConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { revalidateProducts } from './hooks/revalidateProducts'

export const ProductsPageContent: GlobalConfig = {
  slug: 'products-page-content',
  access: {
    read: anyone,
    update: anyone,
  },
  hooks: {
    afterChange: [revalidateProducts],
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      label: 'Hero Section',
      fields: [
        {
          name: 'badge',
          type: 'text',
          label: 'Badge',
          defaultValue: 'Products',
          admin: {
            description: 'Small label above the title',
          },
        },
        {
          name: 'badgeAr',
          type: 'text',
          label: 'Badge (Arabic)',
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          defaultValue: 'Our Products',
        },
        {
          name: 'titleAr',
          type: 'text',
          label: 'Title (Arabic)',
        },
        {
          name: 'subtitle',
          type: 'textarea',
          label: 'Subtitle',
          admin: {
            description: 'Subtitle or description for the products page',
          },
        },
        {
          name: 'subtitleAr',
          type: 'textarea',
          label: 'Subtitle (Arabic)',
        },
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Background Image',
        },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO Settings',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          admin: {
            description: 'SEO title for the products page',
          },
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          admin: {
            description: 'SEO meta description for the products page',
          },
        },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Open Graph Image',
          admin: {
            description: 'Social sharing image (1200x630px recommended)',
          },
        },
      ],
    },
  ],
}

