import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { adminOnly } from '../../access/adminOnly'

export const ChatSummaries: CollectionConfig = {
  slug: 'chat-summaries',
  access: {
    read: adminOnly,
    create: anyone, // Allow chatbot to create summaries
    update: adminOnly,
    delete: adminOnly,
  },
  admin: {
    defaultColumns: ['userName', 'userEmail', 'selectedItem', 'createdAt'],
    useAsTitle: 'userName',
  },
  fields: [
    {
      name: 'userName',
      type: 'text',
      label: 'User Name',
    },
    {
      name: 'userEmail',
      type: 'email',
      label: 'User Email',
    },
    {
      name: 'selectedItem',
      type: 'text',
      label: 'Selected Item (Service/Product/Blog/Career)',
    },
    {
      name: 'itemType',
      type: 'select',
      label: 'Item Type',
      options: [
        { label: 'Service', value: 'service' },
        { label: 'Product', value: 'product' },
        { label: 'Blog', value: 'blog' },
        { label: 'Career', value: 'career' },
        { label: 'Support', value: 'support' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'conversation',
      type: 'array',
      label: 'Conversation',
      fields: [
        {
          name: 'role',
          type: 'select',
          required: true,
          options: [
            { label: 'User', value: 'user' },
            { label: 'Assistant', value: 'assistant' },
          ],
        },
        {
          name: 'content',
          type: 'textarea',
          required: true,
        },
        {
          name: 'timestamp',
          type: 'date',
          required: true,
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
      ],
    },
    {
      name: 'keyQuestions',
      type: 'array',
      label: 'Key Questions',
      fields: [
        {
          name: 'question',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'finalOutcome',
      type: 'textarea',
      label: 'Final Outcome / Intent',
    },
    {
      name: 'emailSent',
      type: 'checkbox',
      label: 'Email Sent to hello@shamal.sa',
      defaultValue: false,
    },
    {
      name: 'emailSentAt',
      type: 'date',
      label: 'Email Sent At',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
  ],
  timestamps: true,
}

