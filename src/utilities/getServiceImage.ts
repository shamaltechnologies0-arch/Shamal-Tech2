export const SERVICE_IMAGE_MAP: Record<string, string> = {
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
  'traffic-count-traffice-analysis': '/Service Images/Traffic Count & Traffic Analysis/traffice-count-and-traffic-analysis-inspection-in-saudi-arabia.png',
  'traffic-count-traffic-analysis': '/Service Images/Traffic Count & Traffic Analysis/traffice-count-and-traffic-analysis-inspection-in-saudi-arabia.png',
  'traffic-count-and-traffic-analysis': '/Service Images/Traffic Count & Traffic Analysis/traffice-count-and-traffic-analysis-inspection-in-saudi-arabia.png',
}

export function getServiceImagePathBySlug(slug: string | null | undefined): string {
  return SERVICE_IMAGE_MAP[(slug || '').toLowerCase()] || '/default.jpg'
}

