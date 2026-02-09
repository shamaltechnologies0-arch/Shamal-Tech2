import type { GlobalConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { revalidateCareers } from './hooks/revalidateCareers'

export const CareersPageContent: GlobalConfig = {
  slug: 'careers-page-content',
  access: {
    read: anyone,
    update: anyone,
  },
  hooks: {
    afterChange: [revalidateCareers],
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
          defaultValue: 'Join Our Team',
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
          defaultValue: 'Careers',
        },
        {
          name: 'titleAr',
          type: 'text',
          label: 'Title (Arabic)',
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'Subtitle or description for the careers page',
          },
        },
        {
          name: 'descriptionAr',
          type: 'textarea',
          label: 'Description (Arabic)',
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
            description: 'SEO title for the careers page',
          },
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          admin: {
            description: 'SEO meta description for the careers page',
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

