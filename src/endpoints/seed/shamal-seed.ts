import type { Payload, PayloadRequest } from 'payload'
import { syncSeoKeywordsFromPublicFile } from '../../lib/seo/syncKeywordsFromPublicTxt'
import { seedProducts } from './products'

export const shamalSeed = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info('Seeding Shamal Technologies database...')

  // Check if admin user exists
  const existingAdmin = await payload.find({
    collection: 'users',
    where: {
      email: {
        equals: process.env.SEED_ADMIN_EMAIL || 'admin@shamal.sa',
      },
    },
    limit: 1,
  })

  let adminUser
  if (existingAdmin.docs.length === 0) {
    payload.logger.info('— Creating admin user...')
    adminUser = await payload.create({
      collection: 'users',
      data: {
        name: 'Admin',
        email: process.env.SEED_ADMIN_EMAIL || 'admin@shamal.sa',
        password: process.env.SEED_ADMIN_PASSWORD || 'change-me-in-production',
        roles: ['admin'],
      },
      req,
    })
    payload.logger.info(`✓ Created admin user: ${adminUser.email}`)
  } else {
    adminUser = existingAdmin.docs[0]
    payload.logger.info(`✓ Admin user already exists: ${adminUser.email}`)
  }

  // Seed Services
  payload.logger.info('— Seeding Services...')
  const serviceNames = [
    'Aerial Survey',
    'Construction Monitoring',
    'Asset Inspection',
    'Bathymetric & Underwater Survey',
    'GIS & Remote Sensing',
    'Environmental Monitoring',
    'SCAN/CAD to BIM',
    'Mining & Exploration',
    'Security Surveillance',
    'AI Application Development',
    'Agriculture Monitoring',
    'Special Projects',
    'Traffic Count & Traffice Analysis',
  ]

  const serviceSlugs = [
    'aerial-survey',
    'construction-monitoring',
    'asset-inspection',
    'bathymetric-underwater-survey',
    'gis-remote-sensing',
    'environmental-monitoring',
    'scan-cad-to-bim',
    'mining-exploration',
    'security-surveillance',
    'ai-application-development',
    'agriculture-monitoring',
    'special-projects',
    'traffic-count-traffice-analysis',
  ]

  const services = []
  for (let i = 0; i < serviceNames.length; i++) {
    const existing = await payload.find({
      collection: 'services',
      where: {
        slug: {
          equals: serviceSlugs[i],
        },
      },
      limit: 1,
    })

    if (existing.docs.length === 0) {
      // Get a media item for hero image (use first available or create a placeholder)
      const mediaItems = await payload.find({
        collection: 'media',
        limit: 1,
      })
      const heroImageId = mediaItems.docs[0]?.id

      const service = await payload.create({
        collection: 'services',
        data: {
          _status: 'published',
          title: serviceNames[i],
          slug: serviceSlugs[i],
          heroImage: heroImageId || undefined,
          heroTitle: `${serviceNames[i]} - Professional Drone Services`,
          heroDescription: `Expert ${serviceNames[i]} services in Saudi Arabia.`,
          benefits: [
            {
              title: 'Expert Team',
              description: 'Certified professionals with years of experience',
            },
            {
              title: 'Latest Technology',
              description: 'State-of-the-art equipment and software',
            },
          ],
          applications: [
            {
              title: 'Industry Applications',
              description: 'Wide range of industry applications',
            },
          ],
          technologies: [
            {
              name: 'Advanced Drones',
              description: 'Latest drone technology',
            },
          ],
          faqs: [
            {
              question: `What is ${serviceNames[i]}?`,
              answer: {
                root: {
                  type: 'root',
                  children: [
                    {
                      type: 'paragraph',
                      children: [
                        {
                          type: 'text',
                          text: `${serviceNames[i]} is a specialized service we offer.`,
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
            },
          ],
          ctaTitle: 'Get Started Today',
          ctaDescription: 'Contact us to learn more about our services',
          ctaButtonText: 'Contact Us',
          seo: {
            title: `${serviceNames[i]} | Shamal Technologies`,
            description: `Professional ${serviceNames[i]} services in Saudi Arabia.`,
            keywords: `${serviceNames[i]}, drone services, Saudi Arabia`,
          },
        },
        context: {
          disableRevalidate: true,
        },
        req,
      })
      services.push(service)
      payload.logger.info(`✓ Created service: ${serviceNames[i]}`)
    } else {
      services.push(existing.docs[0])
      payload.logger.info(`✓ Service already exists: ${serviceNames[i]}`)
    }
  }

  // Seed Sectors Content
  payload.logger.info('— Seeding Sectors Content...')
  const sectorDefinitions = [
    {
      name: 'Government',
      slug: 'government',
      description:
        'Supporting public sector initiatives with aerial mapping, infrastructure monitoring, and data-driven planning insights.',
    },
    {
      name: 'Transportation',
      slug: 'transportation',
      description:
        'Improving transport planning and operations through corridor surveys, traffic intelligence, and asset condition monitoring.',
    },
    {
      name: 'Mining',
      slug: 'mining',
      description:
        'Enabling safer and more efficient mining with volumetric analysis, site inspections, and terrain intelligence.',
    },
    {
      name: 'Construction',
      slug: 'construction',
      description:
        'Helping project teams track progress, reduce risk, and make faster decisions with reliable site data.',
    },
    {
      name: 'Real Estate',
      slug: 'real-estate',
      description:
        'Providing high-quality visual and spatial data for property development, marketing, and portfolio management.',
    },
    {
      name: 'Education',
      slug: 'education',
      description:
        'Supporting academic institutions with smart campus mapping, facility assessments, and technology-enabled learning projects.',
    },
    {
      name: 'Oil & Gas',
      slug: 'oil-gas',
      description:
        'Enhancing operational safety and reliability with remote inspections, pipeline monitoring, and geospatial analytics.',
    },
    {
      name: 'Heritage',
      slug: 'heritage',
      description:
        'Preserving cultural and historical assets through non-intrusive documentation, 3D modeling, and condition tracking.',
    },
    {
      name: 'Marine',
      slug: 'marine',
      description:
        'Delivering coastal and offshore insights for ports, shoreline assets, and marine infrastructure management.',
    },
    {
      name: 'Agriculture & Environment',
      slug: 'agriculture',
      description:
        'Supporting sustainable land use with crop intelligence, environmental monitoring, and resource optimization.',
    },
    {
      name: 'Utilities',
      slug: 'utilities',
      description:
        'Improving utility network reliability through efficient inspections, vegetation risk detection, and asset mapping.',
    },
    {
      name: 'Application Development',
      slug: 'application-development',
      description:
        'Building tailored digital applications that transform geospatial and operational data into actionable workflows.',
    },
  ]

  const sectorsData = sectorDefinitions.map(({ name, slug, description }) => ({
    name,
    slug,
    description,
    useCases: [
      {
        title: 'Sector-Specific Applications',
        description: `Tailored solutions for ${name} sector needs`,
      },
    ],
    solutionsDelivered: [
      {
        title: 'Custom Solutions',
        description: `Specialized solutions for ${name} sector`,
      },
    ],
  }))

  const existingSectors = await payload.findGlobal({
    slug: 'sectors-content',
  })

  const existingSectorsList = existingSectors?.sectors || []
  const existingSectorsBySlug = new Map(
    existingSectorsList.map((sector) => [sector.slug?.toLowerCase().trim() || '', sector])
  )

  // Keep existing records intact; only prefill missing sectors and empty text fields.
  const mergedSectorsData = sectorDefinitions.map(({ name, slug, description }) => {
    const existing = existingSectorsBySlug.get(slug)
    if (!existing) {
      return sectorsData.find((sector) => sector.slug === slug)!
    }

    return {
      ...existing,
      name: existing.name?.trim() ? existing.name : name,
      slug: existing.slug?.trim() ? existing.slug : slug,
      description: existing.description?.trim() ? existing.description : description,
      useCases: existing.useCases?.length
        ? existing.useCases
        : [
            {
              title: 'Sector-Specific Applications',
              description: `Tailored solutions for ${name} sector needs`,
            },
          ],
      solutionsDelivered: existing.solutionsDelivered?.length
        ? existing.solutionsDelivered
        : [
            {
              title: 'Custom Solutions',
              description: `Specialized solutions for ${name} sector`,
            },
          ],
    }
  })

  const needsSectorsPrefill =
    !existingSectors ||
    !existingSectors.sectors ||
    existingSectors.sectors.length === 0 ||
    mergedSectorsData.length !== existingSectorsList.length ||
    mergedSectorsData.some((sector, index) => {
      const current = existingSectorsList[index]
      return (
        !current ||
        !current.name?.trim() ||
        !current.slug?.trim() ||
        !current.description?.trim()
      )
    })

  if (needsSectorsPrefill) {
    await payload.updateGlobal({
      slug: 'sectors-content',
      data: {
        sectors: mergedSectorsData,
      },
      context: {
        disableRevalidate: true,
      },
      req,
    })
    payload.logger.info('✓ Prefilled Sectors Content')
  } else {
    payload.logger.info('✓ Sectors Content already complete')
  }

  // Seed Site Settings
  payload.logger.info('— Seeding Site Settings...')
  const existingSiteSettings = await payload.findGlobal({
    slug: 'site-settings',
  })

  if (!existingSiteSettings || !existingSiteSettings.siteName) {
    await payload.updateGlobal({
      slug: 'site-settings',
      data: {
        siteName: 'Shamal Technologies',
        siteDescription:
          'Pioneering provider of drone and geospatial solutions in Saudi Arabia. Expert drone survey and geospatial services.',
        contactInfo: {
          phone: '+966 (0) 53 030 1370',
          email: 'hello@shamal.sa',
          address:
            '11th floor, Office no:1109, The Headquarters Business Park, Jeddah 23511',
          mapEmbedUrl:
            'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3709.576529544237!2d39.10571367472985!3d21.60244686782873!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15c3db0078a8628d%3A0x76e949674d3f8aa4!2sShamal%20Technologies!5e0!3m2!1sen!2ssa!4v1765110005511!5m2!1sen!2ssa',
          mapLink: 'https://maps.app.goo.gl/19WL7fCtwww1KBRz6',
        },
        socialMedia: {
          linkedin: 'https://www.linkedin.com/company/shamal-technologies',
          facebook: 'https://www.facebook.com/shamaltechnologies',
          youtube: 'https://www.youtube.com/@shamaltechnologies',
          instagram: 'https://www.instagram.com/shamaltechnologies',
          twitter: 'https://x.com/shamaltechnologies',
        },
      },
      context: {
        disableRevalidate: true,
      },
      req,
    })
    payload.logger.info('✓ Seeded Site Settings')
  } else {
    payload.logger.info('✓ Site Settings already exists')
    // Add social media URLs if missing (enables footer icons)
    const hasSocialUrls = existingSiteSettings.socialMedia && Object.values(existingSiteSettings.socialMedia || {}).some(Boolean)
    if (!hasSocialUrls) {
      await payload.updateGlobal({
        slug: 'site-settings',
        data: {
          socialMedia: {
            linkedin: 'https://www.linkedin.com/company/shamal-technologies',
            facebook: 'https://www.facebook.com/shamaltechnologies',
            youtube: 'https://www.youtube.com/@shamaltechnologies',
            instagram: 'https://www.instagram.com/shamaltechnologies',
            twitter: 'https://x.com/shamaltechnologies',
          },
        },
        context: { disableRevalidate: true },
        req,
      })
      payload.logger.info('✓ Added social media URLs to Site Settings')
    }
  }

  // Seed Homepage Content
  payload.logger.info('— Seeding Homepage Content...')
  const existingHomepage = await payload.findGlobal({
    slug: 'homepage-content',
  })

  const needsHomepageUpdate =
    !existingHomepage ||
    !existingHomepage.hero ||
    !existingHomepage.hero?.title ||
    existingHomepage.hero?.title === ''

  if (needsHomepageUpdate) {
    const homepageData: any = {
      hero: {
        title: 'Shamal Technologies',
        subtitle:
          'Pioneering provider of drone and geospatial solutions in Saudi Arabia',
        ctaText: 'Get Started',
      },
        impactStats: {
          badge: 'Our Impact',
          badgeAr: 'تأثيرنا',
          heading: 'Delivering Excellence Across Industries',
          headingAr: 'تقديم التميز عبر الصناعات',
          stats: [
            { value: 100, suffix: '+', label: 'Projects Completed', labelAr: 'مشاريع منجزة' },
            { value: 80, suffix: '+', label: 'Expert Team', labelAr: 'فريق خبراء' },
            { value: 11, label: 'Sectors Served', labelAr: 'قطاعات نخدمها' },
            { value: 90, suffix: '%', label: 'Client Satisfaction', labelAr: 'رضا العملاء' },
          ],
        },
        servicesOverview: {
          title: 'Our Services',
          description: 'Comprehensive drone and geospatial solutions for your needs',
        },
        sectors: {
          title: 'SECTORS WE SERVE',
          description: 'We serve multiple sectors with specialized solutions',
        },
        aboutPreview: {
          title: 'About Shamal Technologies',
          description:
            'Combining cutting-edge technology with deep industry expertise',
          ctaText: 'Learn More',
        },
        blogPreview: {
          title: 'Latest Insights',
          description: 'Stay updated with our latest news and insights',
          ctaText: 'Read Blog',
        },
        contactCTA: {
          badge: 'Get In Touch',
          badgeAr: 'تواصل معنا',
          title: 'Get In Touch',
          titleAr: 'تواصل معنا',
          description: 'Contact us to discuss your project needs',
          descriptionAr: 'تواصل معنا لمناقشة احتياجات مشروعك',
          ctaText: 'Contact Us Today',
          ctaTextAr: 'تواصل معنا اليوم',
          secondaryCtaText: 'Explore Services',
          secondaryCtaTextAr: 'استكشف خدماتنا',
        },
    }

    await payload.updateGlobal({
      slug: 'homepage-content',
      data: homepageData,
      context: {
        disableRevalidate: true,
      },
      req,
    })
    payload.logger.info('✓ Seeded Homepage Content')
  } else {
    payload.logger.info('✓ Homepage Content already exists')
  }

  // Seed About Page Content
  payload.logger.info('— Seeding About Page Content...')
  const existingAbout = await payload.findGlobal({
    slug: 'about-page-content',
  })

  const needsAboutUpdate =
    !existingAbout ||
    !existingAbout.hero ||
    !existingAbout.hero?.title ||
    existingAbout.hero?.title === ''

  if (needsAboutUpdate) {
    const aboutData: any = {
      hero: {
        title: 'About Shamal Technologies',
        description:
          'Shamal Technologies is a pioneering provider of drone and geospatial solutions in Saudi Arabia. We combine cutting-edge technology with deep industry expertise to deliver unparalleled insights for projects across construction, infrastructure, mining, agriculture, and environmental sectors.',
      },
        vision: {
          title: 'Our Vision',
          content: 'To be the leading provider of drone and geospatial solutions in Saudi Arabia.',
        },
        mission: {
          title: 'Our Mission',
          content:
            'To deliver exceptional geospatial intelligence through innovative technology and expert service.',
        },
        certifications: [],
        achievements: [],
        timeline: [],
        leadership: [],
        clients: [],
        strengths: [],
    }

    await payload.updateGlobal({
      slug: 'about-page-content',
      data: aboutData,
      context: {
        disableRevalidate: true,
      },
      req,
    })
    payload.logger.info('✓ Seeded About Page Content')
  } else {
    payload.logger.info('✓ About Page Content already exists')
  }

  // SEO: single source of truth is public/keywords.txt (collection + globals, replaces stale defaults)
  payload.logger.info('— Syncing SEO from public/keywords.txt…')
  const seoSync = await syncSeoKeywordsFromPublicFile({ payload, req })
  payload.logger.info(
    `✓ SEO synced: parsed=${seoSync.parsedCount}, seo-keywords +${seoSync.collectionCreated}/~${seoSync.collectionUpdated}, primary=${seoSync.primaryKeywordsCount} secondary=${seoSync.secondaryKeywordsCount} longTail=${seoSync.longTailKeywordsCount}`,
  )

  // Seed Products
  await seedProducts({ payload, req })

  payload.logger.info('✓ Shamal Technologies database seeding completed!')
}

