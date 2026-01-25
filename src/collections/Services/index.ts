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
import { adminOrDesigner } from '../../access/adminOrDesigner'
import { revalidateService } from './hooks/revalidateService'
import { getServerSideURL } from '../../utilities/getURL'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'

export const Services: CollectionConfig = {
  slug: 'services',
  access: {
    read: anyone,
    create: adminOrDesigner,
    update: adminOrDesigner,
    delete: adminOrDesigner,
  },
  admin: {
    defaultColumns: ['title', 'order', 'slug', 'updatedAt'],
    useAsTitle: 'title',
    defaultSort: 'order', // Sort by order in admin panel
    livePreview: {
      url: ({ data }) => {
        const baseURL = getServerSideURL()
        const slug = typeof data?.slug === 'string' ? data.slug : ''
        if (!slug) return baseURL
        return `${baseURL}/services/${slug}`
      },
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'services',
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
      name: 'order',
      type: 'number',
      label: 'Display Order',
      admin: {
        description: 'Controls the order/position of this service on the homepage carousel and services page. Lower numbers appear first. If not set, services are sorted by creation date.',
        position: 'sidebar',
      },
      defaultValue: 999, // Default to end of list
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              required: false,
            },
            {
              name: 'heroTitle',
              type: 'text',
              required: true,
            },
            {
              name: 'heroDescription',
              type: 'textarea',
            },
            {
              name: 'benefits',
              type: 'array',
              label: 'Service Benefits',
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
                {
                  name: 'icon',
                  type: 'upload',
                  relationTo: 'media',
                },
              ],
            },
            {
              name: 'applications',
              type: 'array',
              label: 'Applications / Use Cases',
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
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                },
              ],
            },
            {
              name: 'technologies',
              type: 'array',
              label: 'Technologies Used',
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                },
                {
                  name: 'icon',
                  type: 'upload',
                  relationTo: 'media',
                },
              ],
            },
            {
              name: 'portfolioExamples',
              type: 'relationship',
              relationTo: 'portfolio',
              hasMany: true,
              label: 'Portfolio Examples',
            },
            {
              name: 'faqs',
              type: 'array',
              label: 'Frequently Asked Questions',
              fields: [
                {
                  name: 'question',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'answer',
                  type: 'richText',
                  required: true,
                },
              ],
            },
            {
              name: 'ctaTitle',
              type: 'text',
              label: 'CTA Section Title',
            },
            {
              name: 'ctaDescription',
              type: 'textarea',
              label: 'CTA Section Description',
            },
            {
              name: 'ctaButtonText',
              type: 'text',
              label: 'CTA Button Text',
              defaultValue: 'Contact Us',
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
                    user.roles?.includes('designer') ||
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
    afterChange: [revalidateService],
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

