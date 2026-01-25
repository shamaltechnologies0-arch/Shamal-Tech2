/**
 * Maps service titles/slugs to their corresponding image paths
 * Falls back to placeholder if no image is found
 */
export function getServiceImagePath(serviceTitle: string | null | undefined): string {
  if (!serviceTitle) return '/placeholder-service.jpg'

  // Normalize service title for matching
  const normalizedTitle = serviceTitle.toLowerCase().trim()

  // Map service titles to their image paths
  const serviceImageMap: Record<string, string> = {
    'aerial survey': '/Service Images/Aerial Survey/aerial-survey-service-in-saudi-arabia.png',
    'agriculture monitoring': '/Service Images/Agriculture Monitoring/agriculture-monitoring-service-in-saudi-arabia.png',
    'ai application development': '/Service Images/AI Application Development/ai-application-development-in-saudi-arabia.png',
    'asset inspection': '/Service Images/Asset Inspection/asset-inspection-using-drone-in-saudi-arabia.png',
    'bathymetric & underwater survey': '/Service Images/Bathymetric & Underwater Survey/bathymetric-and-underwater-survey-in-saudi-arabia.png',
    'bathymetric and underwater survey': '/Service Images/Bathymetric & Underwater Survey/bathymetric-and-underwater-survey-in-saudi-arabia.png',
    'construction monitoring': '/Service Images/Construction Monitoring/construction-monitoring-survey-in-saudi-arabia.png',
    'environmental monitoring': '/Service Images/Environmental Monitoring/environmental-monitoring-survey-in-saudi-arabia.png',
    'gis & remote sensing': '/Service Images/GIS & Remote Sensing/gis-and-remote-sensing-service-in-saudi-arabia.png',
    'gis and remote sensing': '/Service Images/GIS & Remote Sensing/gis-and-remote-sensing-service-in-saudi-arabia.png',
    'mining & exploration': '/Service Images/Mining & Exploration/mining-exploration-using-drone-in-saudi-arabia.png',
    'mining and exploration': '/Service Images/Mining & Exploration/mining-exploration-using-drone-in-saudi-arabia.png',
    'scan cad to bim': '/Service Images/SCAN  CAD to BIM/scan-or-cad-to-bim-service-in-saudi-arabia.png',
    'scan/cad to bim': '/Service Images/SCAN  CAD to BIM/scan-or-cad-to-bim-service-in-saudi-arabia.png',
    'security surveillance': '/Service Images/Security Surveillance/security-surveillance-using-drone-in-saudi-arabia.png',
    'special projects': '/Service Images/Special Projects/special-projects-using-drones-in-saudi-arabia.png',
  }

  // Try exact match first
  if (serviceImageMap[normalizedTitle]) {
    return serviceImageMap[normalizedTitle]
  }

  // Try partial match (in case title has additional text)
  for (const [key, value] of Object.entries(serviceImageMap)) {
    if (normalizedTitle.includes(key) || key.includes(normalizedTitle)) {
      return value
    }
  }

  return '/placeholder-service.jpg'
}

/**
 * Get service image path by slug
 */
export function getServiceImagePathBySlug(slug: string | null | undefined): string {
  if (!slug) return '/placeholder-service.jpg'

  const slugToImageMap: Record<string, string> = {
    'aerial-survey': '/Service Images/Aerial Survey/aerial-survey-service-in-saudi-arabia.png',
    'agriculture-monitoring': '/Service Images/Agriculture Monitoring/agriculture-monitoring-service-in-saudi-arabia.png',
    'ai-application-development': '/Service Images/AI Application Development/ai-application-development-in-saudi-arabia.png',
    'asset-inspection': '/Service Images/Asset Inspection/asset-inspection-using-drone-in-saudi-arabia.png',
    'bathymetric-underwater-survey': '/Service Images/Bathymetric & Underwater Survey/bathymetric-and-underwater-survey-in-saudi-arabia.png',
    'construction-monitoring': '/Service Images/Construction Monitoring/construction-monitoring-survey-in-saudi-arabia.png',
    'environmental-monitoring': '/Service Images/Environmental Monitoring/environmental-monitoring-survey-in-saudi-arabia.png',
    'gis-remote-sensing': '/Service Images/GIS & Remote Sensing/gis-and-remote-sensing-service-in-saudi-arabia.png',
    'mining-exploration': '/Service Images/Mining & Exploration/mining-exploration-using-drone-in-saudi-arabia.png',
    'scan-cad-to-bim': '/Service Images/SCAN  CAD to BIM/scan-or-cad-to-bim-service-in-saudi-arabia.png',
    'security-surveillance': '/Service Images/Security Surveillance/security-surveillance-using-drone-in-saudi-arabia.png',
    'special-projects': '/Service Images/Special Projects/special-projects-using-drones-in-saudi-arabia.png',
  }

  return slugToImageMap[slug.toLowerCase()] || '/placeholder-service.jpg'
}

