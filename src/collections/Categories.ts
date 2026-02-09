import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { slugField } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    create: anyone,
    delete: anyone,
    read: anyone,
    update: anyone,
  },
  admin: {
    useAsTitle: 'title',
  },
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
      admin: {
        description: 'Arabic title displayed when Arabic language is selected',
      },
    },
    slugField({
      position: undefined,
    }),
  ],
}
