import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { pushToClickUp } from './hooks/pushToClickUp'

export const Leads: CollectionConfig = {
  slug: 'leads',
  access: {
    create: anyone,
    read: anyone,
    update: anyone,
    delete: anyone,
  },
  admin: {
    defaultColumns: ['name', 'email', 'status', 'assignedTo', 'leadOrigin', 'pushedToClickUp', 'createdAt'],
    useAsTitle: 'name',
    group: 'CRM',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Full name of the lead',
      },
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      admin: {
        description: 'Email address of the lead',
      },
    },
    {
      name: 'phone',
      type: 'text',
      admin: {
        description: 'Phone number of the lead',
      },
    },
    {
      name: 'company',
      type: 'text',
      admin: {
        description: 'Company name',
      },
    },
    {
      name: 'subject',
      type: 'text',
      admin: {
        description: 'Subject of inquiry',
      },
    },
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      admin: {
        description: 'Services the lead is interested in',
      },
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Initial message from the lead',
      },
    },
    {
      name: 'leadOrigin',
      type: 'select',
      options: [
        { label: 'Website', value: 'website' },
        { label: 'Admin', value: 'admin' },
      ],
      defaultValue: 'admin',
      required: true,
      admin: {
        description: 'Where was this lead created? Website form triggers ClickUp sync.',
      },
    },
    {
      name: 'source',
      type: 'select',
      options: [
        {
          label: 'Contact Form',
          value: 'contact-form',
        },
        {
          label: 'Phone',
          value: 'phone',
        },
        {
          label: 'Email',
          value: 'email',
        },
        {
          label: 'Referral',
          value: 'referral',
        },
        {
          label: 'Social Media',
          value: 'social-media',
        },
        {
          label: 'Other',
          value: 'other',
        },
      ],
      defaultValue: 'contact-form',
      admin: {
        description: 'How did this lead find us?',
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
          label: 'Contacted',
          value: 'contacted',
        },
        {
          label: 'Qualified',
          value: 'qualified',
        },
        {
          label: 'Proposal Sent',
          value: 'proposal-sent',
        },
        {
          label: 'Negotiating',
          value: 'negotiating',
        },
        {
          label: 'Won',
          value: 'won',
        },
        {
          label: 'Lost',
          value: 'lost',
        },
        {
          label: 'Archived',
          value: 'archived',
        },
      ],
      defaultValue: 'new',
      admin: {
        description: 'Current status of the lead',
      },
    },
    {
      name: 'priority',
      type: 'select',
      options: [
        {
          label: 'Low',
          value: 'low',
        },
        {
          label: 'Medium',
          value: 'medium',
        },
        {
          label: 'High',
          value: 'high',
        },
        {
          label: 'Urgent',
          value: 'urgent',
        },
      ],
      defaultValue: 'medium',
      admin: {
        description: 'Priority level of the lead',
      },
    },
    {
      name: 'assignedTo',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        description: 'User responsible for following up with this lead',
      },
    },
    {
      name: 'estimatedValue',
      type: 'number',
      admin: {
        description: 'Estimated value of this lead in SAR',
        step: 1000,
      },
    },
    {
      name: 'followUps',
      type: 'array',
      admin: {
        description: 'Follow-up activities and notes',
      },
      fields: [
        {
          name: 'date',
          type: 'date',
          required: true,
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
            description: 'Date and time of the follow-up',
          },
        },
        {
          name: 'type',
          type: 'select',
          required: true,
          options: [
            {
              label: 'Call',
              value: 'call',
            },
            {
              label: 'Email',
              value: 'email',
            },
            {
              label: 'Meeting',
              value: 'meeting',
            },
            {
              label: 'Proposal',
              value: 'proposal',
            },
            {
              label: 'Other',
              value: 'other',
            },
          ],
          admin: {
            description: 'Type of follow-up activity',
          },
        },
        {
          name: 'notes',
          type: 'textarea',
          required: true,
          admin: {
            description: 'Notes about this follow-up',
          },
        },
        {
          name: 'completed',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Mark as completed',
          },
        },
        {
          name: 'completedBy',
          type: 'relationship',
          relationTo: 'users',
          admin: {
            condition: (data) => data?.completed === true,
            description: 'User who completed this follow-up',
          },
        },
      ],
    },
    {
      name: 'nextFollowUpDate',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: 'Scheduled date for next follow-up',
      },
    },
    {
      name: 'tags',
      type: 'text',
      hasMany: true,
      admin: {
        description: 'Tags for categorizing leads',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Internal notes about this lead',
      },
    },
    {
      name: 'emailSent',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Whether the initial response email was sent',
        readOnly: true,
      },
    },
    {
      name: 'emailSentAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        readOnly: true,
        description: 'When the initial response email was sent',
      },
    },
    // --- ClickUp integration (read-only, set by hook) ---
    {
      name: 'pushedToClickUp',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Whether this lead was synced to ClickUp Sales Pipeline',
        readOnly: true,
      },
    },
    {
      name: 'clickupTaskId',
      type: 'text',
      admin: {
        description: 'ClickUp task ID (set automatically for website leads)',
        readOnly: true,
      },
    },
    {
      name: 'clickupTaskUrl',
      type: 'text',
      admin: {
        description: 'Link to the ClickUp task',
        readOnly: true,
      },
    },
    {
      name: 'submittedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        readOnly: true,
        description: 'When the lead was first submitted',
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
  ],
  timestamps: true,
  hooks: {
    afterChange: [pushToClickUp],
  },
}

