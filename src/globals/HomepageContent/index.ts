import type { GlobalConfig } from 'payload'

import {
  HeadingFeature,
  UnorderedListFeature,
  OrderedListFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { anyone } from '../../access/anyone'
import { revalidateHomepage } from './hooks/revalidateHomepage'

export const HomepageContent: GlobalConfig = {
  slug: 'homepage-content',
  access: {
    read: anyone,
    update: anyone,
  },
  hooks: {
    afterChange: [revalidateHomepage],
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
          name: 'titleAr',
          type: 'text',
          label: 'Title (Arabic)',
        },
        {
          name: 'subtitle',
          type: 'textarea',
        },
        {
          name: 'subtitleAr',
          type: 'textarea',
          label: 'Subtitle (Arabic)',
        },
        {
          name: 'ctaText',
          type: 'text',
          label: 'CTA Button Text',
          defaultValue: 'Get Started',
        },
        {
          name: 'ctaTextAr',
          type: 'text',
          label: 'CTA Button Text (Arabic)',
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
      name: 'impactStats',
      type: 'group',
      label: 'Impact / Stats Section',
      admin: {
        description: 'KPI statistics displayed in the "Our Impact" section (e.g. Projects Completed, Client Satisfaction). Drag to reorder.',
      },
      fields: [
        {
          name: 'badge',
          type: 'text',
          label: 'Badge Text',
          defaultValue: 'Our Impact',
          admin: {
            description: 'Small label above the heading (e.g. "Our Impact")',
          },
        },
        {
          name: 'badgeAr',
          type: 'text',
          label: 'Badge Text (Arabic)',
        },
        {
          name: 'heading',
          type: 'text',
          label: 'Section Heading',
          defaultValue: 'Delivering Excellence Across Industries',
          admin: {
            description: 'Main heading for the stats section',
          },
        },
        {
          name: 'headingAr',
          type: 'text',
          label: 'Section Heading (Arabic)',
        },
        {
          name: 'stats',
          type: 'array',
          label: 'Statistics',
          required: true,
          minRows: 1,
          admin: {
            description: 'Add statistics. Each has a numeric value, optional suffix (%, +), and label. Drag to reorder.',
          },
          fields: [
            {
              name: 'value',
              type: 'number',
              required: true,
              label: 'Number Value',
              admin: {
                description: 'The numeric value to display (e.g. 100, 80, 11)',
              },
            },
            {
              name: 'suffix',
              type: 'select',
              label: 'Suffix',
              defaultValue: '',
              admin: {
                description: 'Optional suffix after the number (e.g. % for percentage, + for "more than")',
              },
              options: [
                { label: 'None', value: '' },
                { label: 'Percent (%)', value: '%' },
                { label: 'Plus (+)', value: '+' },
              ],
            },
            {
              name: 'prefix',
              type: 'select',
              label: 'Prefix',
              defaultValue: '',
              admin: {
                description: 'Optional prefix before the number (e.g. + for "+80")',
              },
              options: [
                { label: 'None', value: '' },
                { label: 'Plus (+)', value: '+' },
              ],
            },
            {
              name: 'label',
              type: 'text',
              required: true,
              label: 'Label',
              admin: {
                description: 'Description below the number (e.g. "Projects Completed", "Client Satisfaction")',
              },
            },
            {
              name: 'labelAr',
              type: 'text',
              label: 'Label (Arabic)',
            },
          ],
        },
      ],
    },
    {
      name: 'servicesOverview',
      type: 'group',
      label: 'Services Overview Section',
      fields: [
        {
          name: 'title',
          type: 'text',
          defaultValue: 'Our Services',
        },
        {
          name: 'titleAr',
          type: 'text',
          label: 'Title (Arabic)',
        },
        {
          name: 'description',
          type: 'textarea',
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
      name: 'sectors',
      type: 'group',
      label: 'Sectors We Serve Section',
      fields: [
        {
          name: 'badge',
          type: 'text',
          label: 'Badge Text',
          defaultValue: 'Industries',
          admin: {
            description: 'Small label above the section title (e.g. "Industries")',
          },
        },
        {
          name: 'badgeAr',
          type: 'text',
          label: 'Badge Text (Arabic)',
        },
        {
          name: 'title',
          type: 'text',
          defaultValue: 'SECTORS WE SERVE',
        },
        {
          name: 'titleAr',
          type: 'text',
          label: 'Title (Arabic)',
        },
        {
          name: 'description',
          type: 'textarea',
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
        {
          name: 'selectedSectors',
          type: 'array',
          label: 'Selected Sectors (Drag to reorder)',
          admin: {
            description: 'Select and reorder sectors to display on the homepage. Drag items to change the sequence. If empty, all sectors will be displayed in their default order.',
            components: {
              RowLabel: '/globals/HomepageContent/RowLabel#RowLabel',
            },
          },
          minRows: 0,
          fields: [
            {
              name: 'sectorSlug',
              type: 'select',
              required: true,
              label: 'Sector',
              admin: {
                description: 'Select a sector to display. The order in this list determines the display order on the homepage.',
              },
              options: [
                { label: 'Government', value: 'government' },
                { label: 'Transportation', value: 'transportation' },
                { label: 'Mining', value: 'mining' },
                { label: 'Construction', value: 'construction' },
                { label: 'Real Estate', value: 'real-estate' },
                { label: 'Education', value: 'education' },
                { label: 'Oil & Gas', value: 'oil-gas' },
                { label: 'Heritage', value: 'heritage' },
                { label: 'Marine', value: 'marine' },
                { label: 'Agriculture', value: 'agriculture' },
                { label: 'Utilities', value: 'utilities' },
                { label: 'Environment', value: 'environment' }, 
                { label: 'Application Development', value: 'application-development' },
                { label: 'App Development', value: 'app-development' },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'aboutPreview',
      dbName: 'about_prev',
      type: 'group',
      label: 'About Preview Section',
      fields: [
        {
          name: 'badge',
          type: 'text',
          label: 'Badge Text',
          defaultValue: 'Who We Are?',
        },
        {
          name: 'badgeAr',
          type: 'text',
          label: 'Badge Text (Arabic)',
        },
        {
          name: 'title',
          type: 'text',
          label: 'Section Heading',
          required: true,
        },
        {
          name: 'titleAr',
          type: 'text',
          label: 'Section Heading (Arabic)',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
          admin: {
            description: 'Description text displayed below the heading',
          },
        },
        {
          name: 'descriptionAr',
          type: 'textarea',
          label: 'Description (Arabic)',
        },
        {
          name: 'imageColumn',
          type: 'upload',
          relationTo: 'media',
          label: 'Image Column',
          admin: {
            description: 'Image or video to display in the left column below the description',
          },
        },
        {
          name: 'textColumn',
          type: 'richText',
          label: 'Text Column',
          editor: lexicalEditor({
            features: ({ rootFeatures }) => {
              return [
                ...rootFeatures,
                HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }),
                UnorderedListFeature(),
                OrderedListFeature(),
              ]
            },
          }),
          admin: {
            description: 'Rich text content to display in the right column below the description. Use headings, paragraphs, and bullet lists.',
          },
        },
        {
          name: 'textColumnAr',
          type: 'richText',
          label: 'Text Column (Arabic)',
          editor: lexicalEditor({
            features: ({ rootFeatures }) => {
              return [
                ...rootFeatures,
                HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }),
                UnorderedListFeature(),
                OrderedListFeature(),
              ]
            },
          }),
        },
        {
          name: 'enableTwoColumn',
          type: 'checkbox',
          label: 'Enable Two Column Layout',
          defaultValue: false,
          admin: {
            description: 'Enable to show image/video on left and text on right below the description',
          },
        },
        {
          name: 'leftColumnMedia',
          type: 'upload',
          relationTo: 'media',
          label: 'Left Column - Image/Video',
          admin: {
            condition: (data) => data.enableTwoColumn === true,
            description: 'Image or video to display on the left side',
          },
        },
        {
          name: 'rightColumnTextBlocks',
          dbName: 'right_col_blocks',
          type: 'array',
          label: 'Right Column - Text Content Blocks',
          admin: {
            condition: (data) => data.enableTwoColumn === true,
            description: 'Add text blocks with different types (heading, bullets, paragraph)',
          },
          fields: [
            {
              name: 'textType',
              dbName: 'text_type',
              type: 'select',
              label: 'Text Type',
              required: true,
              options: [
                {
                  label: 'Heading',
                  value: 'heading',
                },
                {
                  label: 'Paragraph',
                  value: 'paragraph',
                },
                {
                  label: 'Bullets',
                  value: 'bullets',
                },
              ],
              defaultValue: 'paragraph',
            },
            {
              name: 'heading',
              type: 'text',
              label: 'Heading Text',
              admin: {
                condition: (data, siblingData) => siblingData?.textType === 'heading',
              },
            },
            {
              name: 'headingAr',
              type: 'text',
              label: 'Heading Text (Arabic)',
              admin: {
                condition: (data, siblingData) => siblingData?.textType === 'heading',
              },
            },
            {
              name: 'headingLevel',
              dbName: 'heading_level',
              type: 'select',
              label: 'Heading Level',
              admin: {
                condition: (data, siblingData) => siblingData?.textType === 'heading',
              },
              options: [
                {
                  label: 'H2',
                  value: 'h2',
                },
                {
                  label: 'H3',
                  value: 'h3',
                },
                {
                  label: 'H4',
                  value: 'h4',
                },
              ],
              defaultValue: 'h3',
            },
            {
              name: 'paragraph',
              type: 'textarea',
              label: 'Paragraph Text',
              admin: {
                condition: (data, siblingData) => siblingData?.textType === 'paragraph',
              },
            },
            {
              name: 'paragraphAr',
              type: 'textarea',
              label: 'Paragraph Text (Arabic)',
              admin: {
                condition: (data, siblingData) => siblingData?.textType === 'paragraph',
              },
            },
            {
              name: 'bullets',
              type: 'array',
              label: 'Bullet Points',
              admin: {
                condition: (data, siblingData) => siblingData?.textType === 'bullets',
              },
              fields: [
                {
                  name: 'text',
                  type: 'text',
                  required: true,
                  label: 'Bullet Point',
                },
                {
                  name: 'textAr',
                  type: 'text',
                  label: 'Bullet Point (Arabic)',
                },
              ],
            },
          ],
        },
        {
          name: 'ctaText',
          type: 'text',
          label: 'CTA Button Text',
          defaultValue: 'Learn More',
        },
        {
          name: 'ctaTextAr',
          type: 'text',
          label: 'CTA Button Text (Arabic)',
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
      name: 'blogPreview',
      type: 'group',
      label: 'Blog Preview Section',
      fields: [
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'titleAr',
          type: 'text',
          label: 'Title (Arabic)',
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'descriptionAr',
          type: 'textarea',
          label: 'Description (Arabic)',
        },
        {
          name: 'ctaText',
          type: 'text',
          label: 'CTA Button Text',
          defaultValue: 'Read Blog',
        },
        {
          name: 'ctaTextAr',
          type: 'text',
          label: 'CTA Button Text (Arabic)',
        },
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Background Image',
        },
        {
          name: 'featuredPosts',
          type: 'array',
          label: 'Featured Blog Posts',
          admin: {
            description: 'Select specific blog posts to display on homepage. If empty, latest posts will be shown.',
          },
          fields: [
            {
              name: 'post',
              type: 'relationship',
              relationTo: 'posts',
              required: true,
              label: 'Blog Post',
            },
            {
              name: 'customImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Custom Image (Optional)',
              admin: {
                description: 'Override the post featured image with a custom image for homepage display',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'contactCTA',
      type: 'group',
      label: 'Contact CTA Section',
      fields: [
        {
          name: 'badge',
          type: 'text',
          label: 'Badge Text',
          defaultValue: 'Get In Touch',
          admin: {
            description: 'Small label above the heading',
          },
        },
        {
          name: 'badgeAr',
          type: 'text',
          label: 'Badge Text (Arabic)',
        },
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'titleAr',
          type: 'text',
          label: 'Title (Arabic)',
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'descriptionAr',
          type: 'textarea',
          label: 'Description (Arabic)',
        },
        {
          name: 'ctaText',
          type: 'text',
          label: 'Primary Button Text',
          defaultValue: 'Contact Us Today',
          admin: {
            description: 'Main CTA button (e.g. "Contact Us Today")',
          },
        },
        {
          name: 'ctaTextAr',
          type: 'text',
          label: 'Primary Button Text (Arabic)',
        },
        {
          name: 'secondaryCtaText',
          type: 'text',
          label: 'Secondary Button Text',
          defaultValue: 'Explore Services',
        },
        {
          name: 'secondaryCtaTextAr',
          type: 'text',
          label: 'Secondary Button Text (Arabic)',
        },
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Background Image',
        },
      ],
    },
  ],
}

