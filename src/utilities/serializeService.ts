import type { Service } from '../payload-types'

/**
 * Serializes a service object to ensure it's safe to pass to client components
 * Removes any non-serializable data and keeps only necessary fields
 */
export function serializeService(service: Service): {
  id: string
  title: string | null
  titleAr?: string | null
  slug: string | null
  heroDescription: string | null
  heroDescriptionAr?: string | null
  heroImage: {
    url?: string
    id?: string
  } | null
} {
  return {
    id: String(service.id || ''),
    title: service.title || null,
    titleAr: (service as { titleAr?: string | null }).titleAr ?? null,
    slug: service.slug || null,
    heroDescription: service.heroDescription ?? null,
    heroDescriptionAr: (service as { heroDescriptionAr?: string | null }).heroDescriptionAr ?? null,
    heroImage: (() => {
      if (!service.heroImage) return null
      
      if (typeof service.heroImage === 'object' && service.heroImage !== null) {
        // Extract only serializable properties
        const image: { url?: string; id?: string } = {}
        
        if ('url' in service.heroImage && service.heroImage.url) {
          image.url = String(service.heroImage.url)
        }
        
        if ('id' in service.heroImage && service.heroImage.id) {
          image.id = String(service.heroImage.id)
        }
        
        return Object.keys(image).length > 0 ? image : null
      }
      
      return null
    })(),
  }
}

/**
 * Serializes an array of services
 */
export function serializeServices(services: Service[]) {
  return services.map(serializeService)
}

