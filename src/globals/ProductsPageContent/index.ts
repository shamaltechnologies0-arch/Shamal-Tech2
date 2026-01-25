import type { GlobalConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { adminOrDesigner } from '../../access/adminOrDesigner'
import { revalidateProducts } from './hooks/revalidateProducts'

export const ProductsPageContent: GlobalConfig = {
  slug: 'products-page-content',
  access: {
    read: anyone,
    update: adminOrDesigner,
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
          name: 'title',
          type: 'text',
          required: true,
          defaultValue: 'Our Products',
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

