import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { adminOrMarketing } from '../../access/adminOrMarketing'

export const NewsletterSubscriptions: CollectionConfig = {
  slug: 'newsletter-subscriptions',
  access: {
    create: anyone,
    read: adminOrMarketing,
    update: adminOrMarketing,
    delete: adminOrMarketing,
  },
  admin: {
    defaultColumns: ['email', 'status', 'subscribedAt', 'source'],
    useAsTitle: 'email',
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'subscribedAt',
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
          label: 'Active',
          value: 'active',
        },
        {
          label: 'Unsubscribed',
          value: 'unsubscribed',
        },
      ],
      defaultValue: 'active',
    },
    {
      name: 'source',
      type: 'text',
      label: 'Subscription Source',
    },
  ],
  timestamps: true,
}

