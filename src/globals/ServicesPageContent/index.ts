import type { GlobalConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { revalidateServices } from './hooks/revalidateServices'

export const ServicesPageContent: GlobalConfig = {
  slug: 'services-page-content',
  access: {
    read: anyone,
    update: anyone,
  },
  hooks: {
    afterChange: [revalidateServices],
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
          defaultValue: 'Our Services',
        },
        {
          name: 'subtitle',
          type: 'textarea',
          label: 'Subtitle',
          admin: {
            description: 'Subtitle or description for the services page',
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
            description: 'SEO title for the services page',
          },
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          admin: {
            description: 'SEO meta description for the services page',
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

