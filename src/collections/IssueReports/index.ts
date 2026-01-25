import type { CollectionConfig } from 'payload'

import { adminOnly } from '../../access/adminOnly'
import { authenticated } from '../../access/authenticated'

export const IssueReports: CollectionConfig = {
  slug: 'issue-reports',
  access: {
    create: authenticated, // Any authenticated user can create reports
    read: adminOnly, // Only admins can read reports
    update: adminOnly, // Only admins can update reports
    delete: adminOnly, // Only admins can delete reports
  },
  admin: {
    defaultColumns: ['title', 'userName', 'userEmail', 'status', 'createdAt'],
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: false,
      admin: {
        readOnly: true,
      },
      hooks: {
        beforeValidate: [
          ({ data }) => {
            if (!data) return 'Issue Report'
            if (!data.title && data.description) {
              // Auto-generate title from description (first 50 chars)
              const generatedTitle = data.description.substring(0, 50).trim() + (data.description.length > 50 ? '...' : '')
              return generatedTitle
            }
            return data.title || 'Issue Report'
          },
        ],
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'screenshot',
      type: 'upload',
      relationTo: 'media',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'userId',
      type: 'text',
      required: true,
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'userName',
      type: 'text',
      required: true,
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'userEmail',
      type: 'email',
      required: true,
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        {
          label: 'Pending',
          value: 'pending',
        },
        {
          label: 'In Progress',
          value: 'in-progress',
        },
        {
          label: 'Resolved',
          value: 'resolved',
        },
        {
          label: 'Closed',
          value: 'closed',
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'adminNotes',
      type: 'textarea',
      label: 'Admin Notes',
      admin: {
        position: 'sidebar',
        condition: (data) => {
          // Only show to admins (handled by access control)
          // data can be undefined during initial render
          return data !== undefined
        },
      },
    },
  ],
  timestamps: true,
}

