import type { GlobalConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { revalidatePosts } from './hooks/revalidatePosts'

export const PostsPageContent: GlobalConfig = {
  slug: 'posts-page-content',
  access: {
    read: anyone,
    update: anyone,
  },
  hooks: {
    afterChange: [revalidatePosts],
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      label: 'Hero Section',
      fields: [
        {
          name: 'badge',
          type: 'text',
          label: 'Badge',
          defaultValue: 'Insights',
          admin: {
            description: 'Small label above the title',
          },
        },
        {
          name: 'badgeAr',
          type: 'text',
          label: 'Badge (Arabic)',
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          defaultValue: 'Blog Posts',
        },
        {
          name: 'titleAr',
          type: 'text',
          label: 'Title (Arabic)',
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'Subtitle or description for the blog posts page',
          },
        },
        {
          name: 'descriptionAr',
          type: 'textarea',
          label: 'Description (Arabic)',
        },
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Background Image',
        },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO Settings',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          admin: {
            description: 'SEO title for the blog posts page',
          },
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          admin: {
            description: 'SEO meta description for the blog posts page',
          },
        },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Open Graph Image',
          admin: {
            description: 'Social sharing image (1200x630px recommended)',
          },
        },
      ],
    },
  ],
}

