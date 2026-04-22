import type { Payload, PayloadRequest } from 'payload'
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

  // Seed SEO Keywords
  payload.logger.info('— Seeding SEO Keywords...')
  const coreBrandKeywords = [
    'Shamal Technologies',
    'Shamal Technologies Saudi Arabia',
    'Saudi Geospatial Data Company',
    'Geospatial Solutions Saudi Arabia',
    'Smart Data Solutions KSA',
    'Vision 2030 Technology Partner',
  ]
  const primaryServiceKeywords = [
    'Drone Surveying Services Saudi Arabia',
    'Aerial Survey Company KSA',
    'Geospatial Data Services Saudi Arabia',
    'GIS and Remote Sensing Saudi Arabia',
    'Satellite Imagery Services KSA',
    'LiDAR Survey Saudi Arabia',
    'AI Data Analytics Saudi Arabia',
    'Digital Twin Solutions Saudi Arabia',
  ]
  const industrySpecificKeywords = [
    'Construction Monitoring Drones Saudi Arabia',
    'BIM and GIS Integration KSA',
    'Construction Progress Monitoring Saudi Arabia',
    'Oil and Gas Drone Inspection Saudi Arabia',
    'Asset Integrity Inspection KSA',
    'Thermal Inspection Oil and Gas Saudi Arabia',
    'OGI Methane Monitoring Saudi Arabia',
    'Smart City Geospatial Solutions Saudi Arabia',
    'Government GIS Services KSA',
    'Urban Planning Satellite Imagery Saudi Arabia',
    'Environmental Monitoring Drones Saudi Arabia',
    'Mangrove Monitoring Saudi Arabia',
    'NDVI Analysis Saudi Arabia',
    'Precision Agriculture Drones KSA',
  ]
  const advancedTechnicalKeywords = [
    'Tri-Stereo Satellite Imagery Saudi Arabia',
    'Drone-in-a-Box Security Solutions KSA',
    'Autonomous Drone Surveillance Saudi Arabia',
    'Bathymetric Survey Saudi Arabia',
    'Underwater Drone Inspection KSA',
    'AI Traffic Analysis Saudi Arabia',
  ]
  const trustAndComplianceKeywords = [
    'GACA Approved Drone Company',
    'ISO 9001 Certified Drone Services',
    'ISO 14001 Environmental Monitoring KSA',
    'ISO 45001 Industrial Inspection Saudi Arabia',
  ]
  const powerKeywordClusters = [
    'Drone + Inspection + Saudi Arabia',
    'Geospatial + Data + KSA',
    'Satellite Imagery + Construction + Saudi Arabia',
    'AI + Analytics + Infrastructure + KSA',
  ]
  const advancedDroneInspectionClusters = [
    'Drone Inspection + Oil & Gas + Saudi Arabia',
    'Industrial Drone Inspection + KSA',
    'Thermal Drone Inspection + Saudi Arabia',
    'Infrastructure Inspection + Drones + KSA',
    'Power Line Inspection + Drones + Saudi Arabia',
    'Confined Space Inspection + Drones + KSA',
  ]
  const geospatialGisMappingClusters = [
    'Geospatial Intelligence + Saudi Arabia',
    'GIS Mapping Services + KSA',
    'Remote Sensing Solutions + Saudi Arabia',
    '3D Mapping + Geospatial Data + KSA',
    'Digital Mapping Services + Saudi Arabia',
    'Topographic Survey + Saudi Arabia',
  ]
  const satelliteImageryRemoteDataClusters = [
    'High-Resolution Satellite Imagery + Saudi Arabia',
    'Stereo Satellite Imagery + KSA',
    'Tri-Stereo Mapping + Saudi Arabia',
    'Satellite Monitoring + Infrastructure + KSA',
    'Urban Planning Satellite Data + Saudi Arabia',
    'Land Use Mapping + Satellite Imagery + KSA',
  ]
  const constructionBimMegaProjectsClusters = [
    'Construction Progress Monitoring + Drones + Saudi Arabia',
    'BIM Integration + Drone Data + KSA',
    'Digital Construction Monitoring + Saudi Arabia',
    '3D Site Monitoring + Construction + KSA',
    'Aerial Survey + Construction Projects + Saudi Arabia',
  ]
  const aiAnalyticsSmartSolutionsClusters = [
    'AI Geospatial Analytics + Saudi Arabia',
    'AI Traffic Analysis + KSA',
    'Computer Vision + Drone Data + Saudi Arabia',
    'AI-Based Infrastructure Monitoring + KSA',
    'Data-Driven Decision Making + Geospatial + KSA',
  ]
  const environmentSustainabilityEsgClusters = [
    'Environmental Monitoring + Drones + Saudi Arabia',
    'ESG Monitoring Solutions + KSA',
    'Mangrove Monitoring + Saudi Arabia',
    'Climate & Environmental Data + Geospatial + KSA',
    'Sustainability Monitoring + Satellite Data + Saudi Arabia',
  ]
  const securitySurveillanceAutonomousClusters = [
    'Drone Security Surveillance + Saudi Arabia',
    'Autonomous Drone Monitoring + KSA',
    'Drone-in-a-Box Security + Saudi Arabia',
    'Perimeter Security Drones + KSA',
    'Critical Infrastructure Surveillance + Drones + Saudi Arabia',
  ]
  const marineBathymetryUnderwaterClusters = [
    'Bathymetric Survey + Saudi Arabia',
    'Underwater Drone Inspection + KSA',
    'Marine Survey Services + Saudi Arabia',
    'Coastal Monitoring + Drones + KSA',
    'Port & Jetty Inspection + Drones + Saudi Arabia',
  ]
  const authorityTrustBuildingClusters = [
    'GACA Certified Drone Operator + Saudi Arabia',
    'ISO Certified Drone Services + KSA',
    'Saudi-Owned Technology Company + Vision 2030',
    'Government Approved Drone Services + Saudi Arabia',
  ]
  const servicePrimaryKeywords = [
    'Drone Inspection Services Saudi Arabia',
    'Aerial Survey Services Saudi Arabia',
    'Construction Monitoring Drones Saudi Arabia',
    'GIS and Remote Sensing Services Saudi Arabia',
    'Satellite Imagery Services Saudi Arabia',
    'Oil and Gas Drone Services Saudi Arabia',
    'Traffic Count and Analysis Saudi Arabia',
    'Drone Security Surveillance Saudi Arabia',
    'Bathymetric Survey Saudi Arabia',
  ]
  const serviceSecondaryKeywords = [
    'Industrial Drone Inspection KSA',
    'Oil and Gas Drone Inspection Saudi Arabia',
    'Infrastructure Inspection Drones',
    'Thermal Drone Inspection KSA',
    'Drone Surveying Company KSA',
    'Topographic Survey Saudi Arabia',
    'LiDAR Survey Services KSA',
    '3D Mapping Services Saudi Arabia',
    'Construction Progress Monitoring KSA',
    'Drone Monitoring for Mega Projects',
    'BIM and GIS Integration Saudi Arabia',
    'Digital Construction Monitoring',
    'Geospatial Data Services KSA',
    'Remote Sensing Solutions Saudi Arabia',
    'Spatial Data Analytics KSA',
    'GIS Mapping Company Saudi Arabia',
    'High Resolution Satellite Imagery KSA',
    'Stereo Satellite Imagery Saudi Arabia',
    'Tri-Stereo Mapping Services',
    'Satellite Monitoring for Construction',
    'Environmental Survey Services KSA',
    'Mangrove Monitoring Saudi Arabia',
    'NDVI Analysis Drones KSA',
    'ESG Monitoring Solutions',
    'Asset Integrity Inspection KSA',
    'Thermal Inspection Oil and Gas',
    'OGI Methane Monitoring Saudi Arabia',
    'Industrial Inspection Drones',
    'AI Traffic Analysis KSA',
    'Traffic Monitoring Drones',
    'Smart Traffic Solutions Saudi Arabia',
    'Urban Traffic Data Analytics',
    'Autonomous Drone Monitoring KSA',
    'Drone-in-a-Box Security Solutions',
    'Perimeter Security Drones',
    'AI Surveillance Systems Saudi Arabia',
    'Underwater Drone Inspection KSA',
    'Marine Survey Services Saudi Arabia',
    'Coastal Monitoring Drones',
    'Port Inspection Drones',
  ]
  const serviceLongTailKeywords = [
    'GACA certified drone inspection company',
    'Confined space drone inspection Saudi Arabia',
    'Power line and tower inspection drones',
    'High accuracy drone surveys for construction',
    'LiDAR point cloud mapping Saudi Arabia',
    'NEOM construction drone monitoring',
    'Aerial construction progress reporting',
    'Government GIS services Saudi Arabia',
    'Enterprise geospatial intelligence KSA',
    'Satellite imagery for urban planning KSA',
    'PIF and government satellite data services',
    'Environmental compliance monitoring Saudi Arabia',
    'Wildlife and vegetation monitoring drones',
    'Drone inspection for refineries Saudi Arabia',
    'GACA approved oil and gas drone company',
    'Traffic studies for municipalities Saudi Arabia',
    'AI-based vehicle classification KSA',
    'Critical infrastructure drone surveillance',
    'Industrial site security drones KSA',
    'Jetty and bridge underwater inspection',
    'Marine infrastructure monitoring Saudi Arabia',
  ]

  const keywordCatalog = new Map<
    string,
    {
      category: 'primary' | 'secondary' | 'long-tail' | 'service-specific' | 'sector-specific'
      priority: number
    }
  >()

  const addKeywords = (
    keywords: string[],
    category: 'primary' | 'secondary' | 'long-tail' | 'service-specific' | 'sector-specific',
    priority: number,
  ) => {
    for (const keyword of keywords) {
      const normalizedKeyword = keyword.trim()
      if (!normalizedKeyword || keywordCatalog.has(normalizedKeyword)) continue
      keywordCatalog.set(normalizedKeyword, { category, priority })
    }
  }

  addKeywords([...coreBrandKeywords, ...primaryServiceKeywords, ...servicePrimaryKeywords], 'primary', 10)
  addKeywords(
    [
      ...advancedTechnicalKeywords,
      ...trustAndComplianceKeywords,
      ...powerKeywordClusters,
      ...advancedDroneInspectionClusters,
      ...geospatialGisMappingClusters,
      ...satelliteImageryRemoteDataClusters,
      ...constructionBimMegaProjectsClusters,
      ...aiAnalyticsSmartSolutionsClusters,
      ...environmentSustainabilityEsgClusters,
      ...securitySurveillanceAutonomousClusters,
      ...marineBathymetryUnderwaterClusters,
      ...authorityTrustBuildingClusters,
      ...serviceSecondaryKeywords,
    ],
    'secondary',
    8,
  )
  addKeywords(serviceLongTailKeywords, 'long-tail', 7)
  addKeywords(
    [
      ...servicePrimaryKeywords,
      ...serviceSecondaryKeywords,
      ...serviceLongTailKeywords,
      'Drone Inspection Services',
    ],
    'service-specific',
    9,
  )
  addKeywords(
    [
      ...industrySpecificKeywords,
      ...constructionBimMegaProjectsClusters,
      ...environmentSustainabilityEsgClusters,
    ],
    'sector-specific',
    9,
  )

  for (const [keyword, details] of keywordCatalog.entries()) {
    const existing = await payload.find({
      collection: 'seo-keywords',
      where: {
        keyword: {
          equals: keyword,
        },
      },
      limit: 1,
    })

    if (existing.docs.length === 0) {
      await payload.create({
        collection: 'seo-keywords',
        data: {
          keyword,
          category: details.category,
          priority: details.priority,
          active: true,
        },
        context: {
          disableRevalidate: true,
        },
        req,
      })
      payload.logger.info(`✓ Created SEO keyword: ${keyword}`)
    }
  }

  // Seed SEO Settings
  payload.logger.info('— Seeding SEO Settings...')
  const existingSEOSettings = await payload.findGlobal({
    slug: 'seo-settings',
  })

  const seoPrimaryKeywords = [...coreBrandKeywords, ...primaryServiceKeywords, ...servicePrimaryKeywords]
  const seoSecondaryKeywords = [
    ...industrySpecificKeywords,
    ...advancedTechnicalKeywords,
    ...trustAndComplianceKeywords,
    ...powerKeywordClusters,
    ...advancedDroneInspectionClusters,
    ...geospatialGisMappingClusters,
    ...satelliteImageryRemoteDataClusters,
    ...constructionBimMegaProjectsClusters,
    ...aiAnalyticsSmartSolutionsClusters,
    ...environmentSustainabilityEsgClusters,
    ...securitySurveillanceAutonomousClusters,
    ...marineBathymetryUnderwaterClusters,
    ...authorityTrustBuildingClusters,
    ...serviceSecondaryKeywords,
  ]
  const seoLongTailKeywords = serviceLongTailKeywords
  const seoServiceKeywords = {
    droneInspection: {
      primary: 'Drone Inspection Services Saudi Arabia',
      secondary: [
        'Industrial Drone Inspection KSA',
        'Oil and Gas Drone Inspection Saudi Arabia',
        'Infrastructure Inspection Drones',
        'Thermal Drone Inspection KSA',
      ],
      longTail: [
        'GACA certified drone inspection company',
        'Confined space drone inspection Saudi Arabia',
        'Power line and tower inspection drones',
      ],
    },
    aerialLandSurveying: {
      primary: 'Aerial Survey Services Saudi Arabia',
      secondary: [
        'Drone Surveying Company KSA',
        'Topographic Survey Saudi Arabia',
        'LiDAR Survey Services KSA',
        '3D Mapping Services Saudi Arabia',
      ],
      longTail: ['High accuracy drone surveys for construction', 'LiDAR point cloud mapping Saudi Arabia'],
    },
    constructionMonitoring: {
      primary: 'Construction Monitoring Drones Saudi Arabia',
      secondary: [
        'Construction Progress Monitoring KSA',
        'Drone Monitoring for Mega Projects',
        'BIM and GIS Integration Saudi Arabia',
        'Digital Construction Monitoring',
      ],
      longTail: ['NEOM construction drone monitoring', 'Aerial construction progress reporting'],
    },
    gisRemoteSensing: {
      primary: 'GIS and Remote Sensing Services Saudi Arabia',
      secondary: [
        'Geospatial Data Services KSA',
        'Remote Sensing Solutions Saudi Arabia',
        'Spatial Data Analytics KSA',
        'GIS Mapping Company Saudi Arabia',
      ],
      longTail: ['Government GIS services Saudi Arabia', 'Enterprise geospatial intelligence KSA'],
    },
    satelliteImagerySolutions: {
      primary: 'Satellite Imagery Services Saudi Arabia',
      secondary: [
        'High Resolution Satellite Imagery KSA',
        'Stereo Satellite Imagery Saudi Arabia',
        'Tri-Stereo Mapping Services',
        'Satellite Monitoring for Construction',
      ],
      longTail: ['Satellite imagery for urban planning KSA', 'PIF and government satellite data services'],
    },
    environmentalMonitoring: {
      primary: 'Environmental Monitoring Drones Saudi Arabia',
      secondary: [
        'Environmental Survey Services KSA',
        'Mangrove Monitoring Saudi Arabia',
        'NDVI Analysis Drones KSA',
        'ESG Monitoring Solutions',
      ],
      longTail: [
        'Environmental compliance monitoring Saudi Arabia',
        'Wildlife and vegetation monitoring drones',
      ],
    },
    oilGasSolutions: {
      primary: 'Oil and Gas Drone Services Saudi Arabia',
      secondary: [
        'Asset Integrity Inspection KSA',
        'Thermal Inspection Oil and Gas',
        'OGI Methane Monitoring Saudi Arabia',
        'Industrial Inspection Drones',
      ],
      longTail: ['Drone inspection for refineries Saudi Arabia', 'GACA approved oil and gas drone company'],
    },
    trafficCountAnalysis: {
      primary: 'Traffic Count and Analysis Saudi Arabia',
      secondary: [
        'AI Traffic Analysis KSA',
        'Traffic Monitoring Drones',
        'Smart Traffic Solutions Saudi Arabia',
        'Urban Traffic Data Analytics',
      ],
      longTail: ['Traffic studies for municipalities Saudi Arabia', 'AI-based vehicle classification KSA'],
    },
    securitySurveillance: {
      primary: 'Drone Security Surveillance Saudi Arabia',
      secondary: [
        'Autonomous Drone Monitoring KSA',
        'Drone-in-a-Box Security Solutions',
        'Perimeter Security Drones',
        'AI Surveillance Systems Saudi Arabia',
      ],
      longTail: ['Critical infrastructure drone surveillance', 'Industrial site security drones KSA'],
    },
    marineUnderwaterSurvey: {
      primary: 'Bathymetric Survey Saudi Arabia',
      secondary: [
        'Underwater Drone Inspection KSA',
        'Marine Survey Services Saudi Arabia',
        'Coastal Monitoring Drones',
        'Port Inspection Drones',
      ],
      longTail: ['Jetty and bridge underwater inspection', 'Marine infrastructure monitoring Saudi Arabia'],
    },
  }
  const seoSectorKeywords = {
    constructionInfrastructure: [
      'Construction Monitoring Drones Saudi Arabia',
      'BIM and GIS Integration KSA',
      'Construction Progress Monitoring Saudi Arabia',
    ],
    oilAndGas: [
      'Oil and Gas Drone Inspection Saudi Arabia',
      'Asset Integrity Inspection KSA',
      'Thermal Inspection Oil and Gas Saudi Arabia',
      'OGI Methane Monitoring Saudi Arabia',
    ],
    governmentSmartCities: [
      'Smart City Geospatial Solutions Saudi Arabia',
      'Government GIS Services KSA',
      'Urban Planning Satellite Imagery Saudi Arabia',
    ],
    environmentAgriculture: [
      'Environmental Monitoring Drones Saudi Arabia',
      'Mangrove Monitoring Saudi Arabia',
      'NDVI Analysis Saudi Arabia',
      'Precision Agriculture Drones KSA',
    ],
  }

  const unique = (values: string[]) => [...new Set(values)]

  await payload.updateGlobal({
    slug: 'seo-settings',
    data: {
      primaryKeywords: unique([...(existingSEOSettings?.primaryKeywords || []), ...seoPrimaryKeywords]),
      secondaryKeywords: unique([...(existingSEOSettings?.secondaryKeywords || []), ...seoSecondaryKeywords]),
      longTailKeywords: unique([...(existingSEOSettings?.longTailKeywords || []), ...seoLongTailKeywords]),
      serviceKeywords: {
        ...(existingSEOSettings?.serviceKeywords || {}),
        ...seoServiceKeywords,
      },
      sectorKeywords: {
        ...(existingSEOSettings?.sectorKeywords || {}),
        ...seoSectorKeywords,
      },
      metaDescriptionTemplate:
        existingSEOSettings?.metaDescriptionTemplate ||
        'Shamal Technologies - {title}. Professional drone and geospatial solutions in Saudi Arabia.',
    },
    context: {
      disableRevalidate: true,
    },
    req,
  })
  payload.logger.info('✓ SEO Settings seeded/merged with full keyword catalog')

  // Seed Products
  await seedProducts({ payload, req })

  payload.logger.info('✓ Shamal Technologies database seeding completed!')
}

