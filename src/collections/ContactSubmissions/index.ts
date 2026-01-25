import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { adminOrMarketing } from '../../access/adminOrMarketing'

export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  access: {
    create: anyone,
    read: adminOrMarketing,
    update: adminOrMarketing,
    delete: adminOrMarketing,
  },
  admin: {
    defaultColumns: ['name', 'email', 'status', 'submittedAt'],
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'company',
      type: 'text',
    },
    {
      name: 'subject',
      type: 'text',
    },
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      label: 'Selected Services',
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
    },
    {
      name: 'submittedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          ({ operation, value }) => {
            if (operation === 'create' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        {
          label: 'New',
          value: 'new',
        },
        {
          label: 'Read',
          value: 'read',
        },
        {
          label: 'Replied',
          value: 'replied',
        },
        {
          label: 'Archived',
          value: 'archived',
        },
      ],
      defaultValue: 'new',
    },
  ],
  timestamps: true,
}

