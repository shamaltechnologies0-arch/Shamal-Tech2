import type { GlobalConfig } from 'payload'

import { anyone } from '../../access/anyone'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: anyone,
    update: anyone,
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      defaultValue: 'Shamal Technologies',
      required: true,
    },
    {
      name: 'siteDescription',
      type: 'textarea',
      label: 'Site Meta Description',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Site Logo',
    },
    {
      name: 'favicon',
      type: 'upload',
      relationTo: 'media',
      label: 'Favicon',
    },
    {
      name: 'contactInfo',
      type: 'group',
      label: 'Contact Information',
      fields: [
        {
          name: 'phone',
          type: 'text',
          defaultValue: '+966 (0) 53 030 1370',
        },
        {
          name: 'email',
          type: 'email',
          defaultValue: 'hello@shamal.sa',
        },
        {
          name: 'address',
          type: 'textarea',
          defaultValue:
            '11th floor, Office no:1109, The Headquarters Business Park, Jeddah 23511',
        },
        {
          name: 'mapEmbedUrl',
          type: 'text',
          label: 'Google Maps Embed URL',
          defaultValue:
            'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3709.576529544237!2d39.10571367472985!3d21.60244686782873!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15c3db0078a8628d%3A0x76e949674d3f8aa4!2sShamal%20Technologies!5e0!3m2!1sen!2ssa!4v1765110005511!5m2!1sen!2ssa',
        },
        {
          name: 'mapLink',
          type: 'text',
          label: 'Google Maps Link',
          defaultValue: 'https://maps.app.goo.gl/19WL7fCtwww1KBRz6',
        },
      ],
    },
    {
      name: 'socialMedia',
      type: 'group',
      label: 'Social Media Links',
      fields: [
        {
          name: 'facebook',
          type: 'text',
          label: 'Facebook URL',
        },
        {
          name: 'twitter',
          type: 'text',
          label: 'Twitter/X URL',
        },
        {
          name: 'linkedin',
          type: 'text',
          label: 'LinkedIn URL',
        },
        {
          name: 'instagram',
          type: 'text',
          label: 'Instagram URL',
        },
        {
          name: 'youtube',
          type: 'text',
          label: 'YouTube URL',
        },
        {
          name: 'tiktok',
          type: 'text',
          label: 'TikTok URL',
        },
        {
          name: 'snapchat',
          type: 'text',
          label: 'Snapchat URL',
        },
      ],
    },
    {
      name: 'footerContent',
      type: 'richText',
      label: 'Footer Content',
    },
  ],
}

