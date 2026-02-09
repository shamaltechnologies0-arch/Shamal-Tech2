import type { GlobalConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { revalidateContact } from './hooks/revalidateContact'

export const ContactPageContent: GlobalConfig = {
  slug: 'contact-page-content',
  access: {
    read: anyone,
    update: anyone,
  },
  hooks: {
    afterChange: [revalidateContact],
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
          defaultValue: 'Get In Touch',
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
          defaultValue: 'Contact Us',
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
            description: 'Subtitle or description for the contact page',
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
            description: 'SEO title for the contact page',
          },
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          admin: {
            description: 'SEO meta description for the contact page',
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

