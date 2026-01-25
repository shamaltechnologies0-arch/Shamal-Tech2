import type { GlobalConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { adminOnly } from '../../access/adminOnly'
import { revalidateAbout } from './hooks/revalidateAbout'

export const AboutPageContent: GlobalConfig = {
  slug: 'about-page-content',
  access: {
    read: anyone,
    update: adminOnly,
  },
  hooks: {
    afterChange: [revalidateAbout],
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      label: 'Hero Section',
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
          admin: {
            description: 'Upload an image for the hero background. If no image is uploaded, the video will be used as fallback.',
          },
        },
        {
          name: 'video',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Upload a video for the hero background. Video will be used if no image is uploaded. Recommended: MP4 format, optimized for web.',
            condition: (data) => !data.image, // Only show if no image is set
          },
        },
      ],
    },
    {
      name: 'vision',
      type: 'group',
      label: 'Vision Section',
      fields: [
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'content',
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
      name: 'mission',
      type: 'group',
      label: 'Mission Section',
      fields: [
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'content',
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
      name: 'whyChooseUs',
      type: 'group',
      label: 'Why Choose Us Section',
      fields: [
        {
          name: 'title',
          type: 'text',
          defaultValue: 'Why Choose Us',
        },
        {
          name: 'subtitle',
          type: 'text',
        },
        {
          name: 'items',
          type: 'array',
          label: 'Items',
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
              name: 'content',
              type: 'textarea',
              admin: {
                description: 'Alternative to description field',
              },
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Image displayed in the sticky right column (desktop)',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'certifications',
      type: 'array',
      label: 'Certifications',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'description',
          type: 'textarea',
        },
      ],
    },
    {
      name: 'achievements',
      type: 'array',
      label: 'Achievements/Milestones',
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
      name: 'timeline',
      type: 'array',
      label: 'Company Timeline',
      fields: [
        {
          name: 'year',
          type: 'number',
          required: true,
        },
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
      name: 'leadership',
      type: 'array',
      label: 'Leadership Team',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'position',
          type: 'text',
          required: true,
        },
        {
          name: 'bio',
          type: 'textarea',
          admin: {
            description: 'Bio content should not exceed 700 characters. Characters remaining will be shown as you type.',
            rows: 4,
          },
          validate: (value: string | null | undefined) => {
            if (value && value.length > 700) {
              return `Bio content cannot exceed 700 characters. Current length: ${value.length} characters. Please reduce by ${value.length - 700} characters.`
            }
            return true
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'clients',
      type: 'array',
      label: 'Clients',
      minRows: 0,
      admin: {
        description: 'Client logos displayed in the infinite logo section on the homepage and about page. Only images are needed. You can add unlimited client logos.',
      },
      fields: [
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'testimonials',
      type: 'array',
      label: 'Testimonials',
      admin: {
        description: 'Client testimonials with name, image, and review text.',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Client Name',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Client Image',
        },
        {
          name: 'review',
          type: 'textarea',
          required: true,
          label: 'Testimonial Review',
          admin: {
            rows: 4,
          },
        },
      ],
    },
    {
      name: 'strengths',
      type: 'array',
      label: 'Company Strengths',
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
  ],
}

