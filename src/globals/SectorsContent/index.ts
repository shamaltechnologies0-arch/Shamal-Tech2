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
          name: 'nameAr',
          type: 'text',
          label: 'Sector Name (Arabic)',
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
          name: 'descriptionAr',
          type: 'textarea',
          label: 'Description (Arabic)',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Small Image',
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
              name: 'titleAr',
              type: 'text',
              label: 'Title (Arabic)',
            },
            {
              name: 'description',
              type: 'textarea',
            },
            {
              name: 'descriptionAr',
              type: 'textarea',
              label: 'Description (Arabic)',
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
              name: 'titleAr',
              type: 'text',
              label: 'Title (Arabic)',
            },
            {
              name: 'description',
              type: 'textarea',
            },
            {
              name: 'descriptionAr',
              type: 'textarea',
              label: 'Description (Arabic)',
            },
          ],
        },
      ],
    },
  ],
}

