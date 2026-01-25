import type { CollectionConfig } from 'payload'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { slugField } from 'payload'

import { anyone } from '../../access/anyone'
import { adminOnly } from '../../access/adminOnly'
import { revalidatePortfolio } from './hooks/revalidatePortfolio'
import { getServerSideURL } from '../../utilities/getURL'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'

export const Portfolio: CollectionConfig = {
  slug: 'portfolio',
  access: {
    read: anyone,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  admin: {
    defaultColumns: ['title', 'client', 'sector', 'featured', 'updatedAt'],
    useAsTitle: 'title',
    livePreview: {
      url: ({ data }) => {
        const baseURL = getServerSideURL()
        const slug = typeof data?.slug === 'string' ? data.slug : ''
        if (!slug) return baseURL
        return `${baseURL}/portfolio/${slug}`
      },
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'portfolio',
        req,
      }),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'client',
              type: 'text',
              label: 'Client Name',
            },
            {
              name: 'sector',
              type: 'select',
              options: [
                {
                  label: 'Government',
                  value: 'government',
                },
                {
                  label: 'Transportation',
                  value: 'transportation',
                },
                {
                  label: 'Mining',
                  value: 'mining',
                },
                {
                  label: 'Construction',
                  value: 'construction',
                },
                {
                  label: 'Real Estate',
                  value: 'real-estate',
                },
                {
                  label: 'Education',
                  value: 'education',
                },
                {
                  label: 'Oil & Gas',
                  value: 'oil-gas',
                },
                {
                  label: 'Heritage',
                  value: 'heritage',
                },
                {
                  label: 'Marine',
                  value: 'marine',
                },
                {
                  label: 'Agriculture',
                  value: 'agriculture',
                },
                {
                  label: 'Utilities',
                  value: 'utilities',
                },
              ],
            },
            {
              name: 'services',
              type: 'relationship',
              relationTo: 'services',
              hasMany: true,
              label: 'Related Services',
            },
            {
              name: 'images',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              required: true,
            },
            {
              name: 'description',
              type: 'richText',
            },
            {
              name: 'useCases',
              type: 'array',
              label: 'Use Cases Addressed',
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
            {
              name: 'completionDate',
              type: 'date',
              label: 'Completion Date',
            },
            {
              name: 'featured',
              type: 'checkbox',
              defaultValue: false,
            },
          ],
        },
        {
          name: 'seo',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'seo.metaTitle',
              descriptionPath: 'seo.metaDescription',
              imagePath: 'seo.ogImage',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),
            MetaDescriptionField({}),
            {
              name: 'keywords',
              type: 'text',
              label: 'Keywords',
              access: {
                update: ({ req: { user } }) => {
                  if (!user) return false
                  return (
                    user.roles?.includes('admin') ||
                    user.roles?.includes('marketing') ||
                    false
                  )
                },
              },
            },
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'seo.metaTitle',
              descriptionPath: 'seo.metaDescription',
            }),
          ],
        },
      ],
    },
    slugField({ fieldToUse: 'title' }),
  ],
  hooks: {
    afterChange: [revalidatePortfolio],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
    },
    maxPerDoc: 50,
  },
}

