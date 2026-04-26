import type { CollectionConfig } from 'payload'

import { adminOnly } from '../../access/adminOnly'
import { noPublicAccess } from '../../access/noPublicAccess'
import { ANALYTICS_EVENT_TYPES } from '../../lib/analytics/eventTypes'

export const AnalyticsEvents: CollectionConfig = {
  slug: 'analytics-events',
  labels: { singular: 'Analytics Event', plural: 'Analytics Events' },
  admin: {
    group: 'System',
    defaultColumns: ['eventType', 'sessionId', 'pageUrl', 'source', 'createdAt'],
    description: 'Internal telemetry — written by /api/analytics/track. Super-admin dashboard reads aggregates.',
    hidden: true,
  },
  access: {
    read: adminOnly,
    create: noPublicAccess,
    update: adminOnly,
    delete: adminOnly,
  },
  fields: [
    {
      name: 'sessionId',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'userId',
      type: 'relationship',
      relationTo: 'users',
      required: false,
      index: true,
    },
    {
      name: 'eventType',
      type: 'select',
      required: true,
      index: true,
      options: ANALYTICS_EVENT_TYPES.map((v) => ({ label: v, value: v })),
    },
    {
      name: 'pageUrl',
      type: 'text',
      required: true,
    },
    {
      name: 'productId',
      type: 'relationship',
      relationTo: 'products',
      required: false,
      index: true,
    },
    {
      name: 'orderId',
      type: 'text',
      required: false,
    },
    {
      name: 'source',
      type: 'text',
      admin: { description: 'Traffic bucket (e.g. google_organic, direct)' },
      index: true,
    },
    {
      name: 'deviceType',
      type: 'select',
      options: [
        { label: 'Mobile', value: 'mobile' },
        { label: 'Tablet', value: 'tablet' },
        { label: 'Desktop', value: 'desktop' },
        { label: 'Unknown', value: 'unknown' },
      ],
      defaultValue: 'unknown',
      index: true,
    },
    {
      name: 'browser',
      type: 'text',
    },
    {
      name: 'country',
      type: 'text',
      index: true,
    },
    {
      name: 'city',
      type: 'text',
    },
    {
      name: 'ipAddress',
      type: 'text',
    },
    {
      name: 'searchKeyword',
      type: 'text',
    },
    {
      name: 'referrerUrl',
      type: 'text',
    },
    {
      name: 'metaData',
      type: 'json',
    },
  ],
  timestamps: true,
}
