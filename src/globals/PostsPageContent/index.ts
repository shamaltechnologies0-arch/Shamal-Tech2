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
    {
      name: 'cta',
      type: 'group',
      label: 'Blog Call to Action',
      admin: {
        description:
          'Shown at the end of every blog post. Update this section once to change the call to action on all posts.',
      },
      fields: [
        {
          name: 'badge',
          type: 'text',
          label: 'Badge',
          defaultValue: 'Work With Us',
        },
        {
          name: 'badgeAr',
          type: 'text',
          label: 'Badge (Arabic)',
          defaultValue: 'اعمل معنا',
        },
        {
          name: 'title',
          type: 'text',
          label: 'Title',
          defaultValue: 'Plan a Compliant Drone Survey',
        },
        {
          name: 'titleAr',
          type: 'text',
          label: 'Title (Arabic)',
          defaultValue: 'خطّط لمسح جوي متوافق مع الأنظمة',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
          defaultValue:
            'Shamal Technologies supports construction, engineering, and mining teams with GACA-aligned aerial mapping, LiDAR, and geospatial data across Saudi Arabia.',
        },
        {
          name: 'descriptionAr',
          type: 'textarea',
          label: 'Description (Arabic)',
          defaultValue:
            'تدعم شمل للتقنيات فرق الإنشاءات والهندسة والتعدين بالمسح الجوي وخرائط الليدار والبيانات الجيومكانية المتوافقة مع متطلبات الهيئة العامة للطيران المدني في المملكة العربية السعودية.',
        },
        {
          name: 'buttonLabel',
          type: 'text',
          label: 'Button Label',
          defaultValue: 'Talk to Our Team',
        },
        {
          name: 'buttonLabelAr',
          type: 'text',
          label: 'Button Label (Arabic)',
          defaultValue: 'تواصل مع فريقنا',
        },
        {
          name: 'buttonHref',
          type: 'text',
          label: 'Button Link',
          defaultValue: '/contact',
          admin: {
            description: 'Internal path such as /contact, or a full URL.',
          },
        },
      ],
    },
  ],
}

