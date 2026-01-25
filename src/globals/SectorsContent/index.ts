import type { GlobalConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { revalidateSectors } from './hooks/revalidateSectors'

export const SectorsContent: GlobalConfig = {
  slug: 'sectors-content',
  access: {
    read: anyone,
    update: anyone,
  },
  hooks: {
    afterChange: [revalidateSectors],
  },
  fields: [
    {
      name: 'sectors',
      type: 'array',
      label: 'Sectors',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Sector Name',
        },
        {
          name: 'slug',
          type: 'text',
          required: true,
          label: 'URL-friendly Identifier',
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Small Image',
        },
        {
          name: 'ctaPortfolio',
          type: 'text',
          label: 'Portfolio CTA Link',
          admin: {
            description: 'Link to portfolio page or section',
          },
        },
        {
          name: 'ctaBlog',
          type: 'text',
          label: 'Blog CTA Link',
          admin: {
            description: 'Link to blog page or section',
          },
        },
        {
          name: 'ctaContact',
          type: 'text',
          label: 'Contact CTA Link',
          admin: {
            description: 'Link to contact page or section',
          },
        },
        {
          name: 'useCases',
          type: 'array',
          label: 'Use Cases',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'description',
              type: 'textarea',
            },
          ],
        },
        {
          name: 'solutionsDelivered',
          type: 'array',
          label: 'Solutions Delivered',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'description',
              type: 'textarea',
            },
          ],
        },
      ],
    },
  ],
}

