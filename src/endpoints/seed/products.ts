import type { Payload, PayloadRequest } from 'payload'

export const productsData = [
  // Drones
  {
    name: 'DJI Dock 2',
    category: 'drones',
    categoryTag: 'Autonomous Docking',
    description: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Next-generation autonomous drone docking station with advanced weather resistance and remote operation capabilities.',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
    keyFeatures: [
      { feature: 'Autonomous operation' },
      { feature: 'Weather resistant' },
      { feature: 'Remote monitoring' },
      { feature: 'Scheduled missions' },
    ],
    ctaText: 'Request Quote',
    featured: true,
  },
  {
    name: 'DJI Dock 3',
    category: 'drones',
    categoryTag: 'Autonomous Docking',
    description: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Latest autonomous docking solution with enhanced reliability and extended operational capabilities for enterprise deployment.',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
    keyFeatures: [
      { feature: 'Enhanced reliability' },
      { feature: 'Extended range' },
      { feature: 'Cloud integration' },
      { feature: 'Multi-mission support' },
    ],
    ctaText: 'Request Quote',
    featured: true,
  },
  {
    name: 'DJI M350',
    category: 'drones',
    categoryTag: 'Enterprise Drones',
    description: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Professional flagship drone with advanced AI capabilities, multiple payload support, and superior flight performance for industrial applications.',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
    keyFeatures: [
      { feature: '55-min flight time' },
      { feature: 'RTK positioning' },
      { feature: 'IP55 weather rating' },
      { feature: '6-directional sensing' },
    ],
    ctaText: 'Request Quote',
    featured: true,
  },
  {
    name: 'DJI FlyCart 30',
    category: 'drones',
    categoryTag: 'Cargo Drones',
    description: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Heavy-duty cargo delivery drone with impressive payload capacity and long-range capabilities for logistics operations.',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
    keyFeatures: [
      { feature: '30kg payload' },
      { feature: 'Long range delivery' },
      { feature: 'Precision landing' },
      { feature: 'Weather resistant' },
    ],
    ctaText: 'Request Quote',
    featured: false,
  },
  {
    name: 'DJI M30T',
    category: 'drones',
    categoryTag: 'Thermal Drones',
    description: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Versatile enterprise drone with integrated thermal imaging, zoom camera, and laser rangefinder in a compact, portable design.',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
    keyFeatures: [
      { feature: 'Thermal camera' },
      { feature: 'Zoom camera' },
      { feature: 'Laser rangefinder' },
      { feature: 'Portable design' },
    ],
    ctaText: 'Request Quote',
    featured: false,
  },
  {
    name: 'DJI Mavic Enterprise',
    category: 'drones',
    categoryTag: 'Compact Drones',
    description: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Portable enterprise solution combining compact design with professional features for rapid deployment in the field.',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
    keyFeatures: [
      { feature: 'Portable design' },
      { feature: 'Quick deployment' },
      { feature: 'Advanced sensors' },
      { feature: 'Long flight time' },
    ],
    ctaText: 'Request Quote',
    featured: false,
  },
  {
    name: 'DJI Matrice 4 Series',
    category: 'drones',
    categoryTag: 'Enterprise Drones',
    description: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Next-generation professional drone platform with cutting-edge technology and enhanced payload capabilities.',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
    keyFeatures: [
      { feature: 'Advanced AI' },
      { feature: 'Multiple payloads' },
      { feature: 'Enhanced stability' },
      { feature: 'Professional grade' },
    ],
    ctaText: 'Request Quote',
    featured: false,
  },
  {
    name: 'DJI Matrice 400',
    category: 'drones',
    categoryTag: 'Heavy-Lift Drones',
    description: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'High-performance heavy-lift platform designed for demanding industrial missions requiring maximum payload capacity.',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
    keyFeatures: [
      { feature: 'Heavy payload' },
      { feature: 'Extended flight time' },
      { feature: 'Professional reliability' },
      { feature: 'Modular design' },
    ],
    ctaText: 'Request Quote',
    featured: false,
  },
  // Payloads
  {
    name: 'DJI Zenmuse L3',
    category: 'payloads',
    categoryTag: 'LiDAR Sensor',
    description: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Advanced LiDAR sensor for precise 3D mapping and surveying applications.',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
    keyFeatures: [
      { feature: 'High precision LiDAR' },
      { feature: '3D mapping' },
      { feature: 'Survey grade accuracy' },
      { feature: 'Long range scanning' },
    ],
    ctaText: 'Request Quote',
    featured: true,
  },
  {
    name: 'DJI Zenmuse S1',
    category: 'payloads',
    categoryTag: 'Survey Sensor',
    description: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Professional survey sensor designed for accurate geospatial data collection.',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
    keyFeatures: [
      { feature: 'Survey accuracy' },
      { feature: 'Geospatial data' },
      { feature: 'Professional grade' },
      { feature: 'High resolution' },
    ],
    ctaText: 'Request Quote',
    featured: false,
  },
  {
    name: 'DJI Zenmuse V1',
    category: 'payloads',
    categoryTag: 'Visual Sensor',
    description: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'High-resolution visual sensor for detailed inspection and mapping applications.',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
    keyFeatures: [
      { feature: 'High resolution' },
      { feature: 'Visual inspection' },
      { feature: 'Detailed mapping' },
      { feature: 'Professional quality' },
    ],
    ctaText: 'Request Quote',
    featured: false,
  },
  {
    name: 'DJI Zenmuse H30',
    category: 'payloads',
    categoryTag: 'Hybrid Sensor',
    description: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Multi-sensor payload combining thermal, visual, and zoom capabilities for comprehensive inspection.',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
    keyFeatures: [
      { feature: 'Thermal imaging' },
      { feature: 'Visual camera' },
      { feature: 'Zoom capability' },
      { feature: 'Multi-sensor' },
    ],
    ctaText: 'Request Quote',
    featured: true,
  },
  {
    name: 'Hovermap',
    category: 'payloads',
    categoryTag: 'Mapping System',
    description: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Advanced mapping and navigation system for autonomous drone operations in complex environments.',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
    keyFeatures: [
      { feature: 'Autonomous navigation' },
      { feature: 'Complex environments' },
      { feature: '3D mapping' },
      { feature: 'Real-time processing' },
    ],
    ctaText: 'Request Quote',
    featured: false,
  },
  // Other
  {
    name: 'Satellite Imagery Services',
    category: 'other',
    categoryTag: 'Satellite Solutions',
    description: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Comprehensive satellite imagery solutions for large-scale mapping, monitoring, and analysis projects.',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
    keyFeatures: [
      { feature: 'Large-scale coverage' },
      { feature: 'High resolution imagery' },
      { feature: 'Multi-temporal analysis' },
      { feature: 'Custom solutions' },
    ],
    ctaText: 'Request Quote',
    featured: true,
  },
]

export async function seedProducts({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> {
  payload.logger.info('— Seeding Products...')

  // Get a media item for product images (use first available or create a placeholder)
  const mediaItems = await payload.find({
    collection: 'media',
    limit: 1,
  })
  const defaultImageId = mediaItems.docs[0]?.id

  for (const productData of productsData) {
    const existing = await payload.find({
      collection: 'products',
      where: {
        slug: {
          equals: productData.name.toLowerCase().replace(/\s+/g, '-'),
        },
      },
      limit: 1,
    })

    if (existing.docs.length === 0) {
      const productDoc = await payload.create({
        collection: 'products',
        data: {
          name: productData.name,
          category: productData.category as 'drones' | 'payloads' | 'other',
          categoryTag: productData.categoryTag,
          description: productData.description as any,
          keyFeatures: productData.keyFeatures,
          images: defaultImageId ? [defaultImageId] : undefined,
          featured: productData.featured,
          ctaText: productData.ctaText,
          seo: {
            title: `${productData.name} | Shamal Technologies`,
            description: `Professional ${productData.name} for sale or lease. ${productData.categoryTag} solutions in Saudi Arabia.`,
            keywords: `${productData.name}, ${productData.categoryTag}, drone equipment, Saudi Arabia`,
          },
        } as any,
        draft: false,
        context: {
          disableRevalidate: true,
        },
        req,
      })
      
      // Publish the document if it was created as draft
      if (productDoc._status !== 'published') {
        await payload.update({
          collection: 'products',
          id: productDoc.id,
          data: {
            _status: 'published',
          },
          context: {
            disableRevalidate: true,
          },
          req,
        })
      }
      payload.logger.info(`✓ Created product: ${productData.name}`)
    } else {
      payload.logger.info(`✓ Product already exists: ${productData.name}`)
    }
  }

  payload.logger.info('✓ Products seeding completed!')
}

