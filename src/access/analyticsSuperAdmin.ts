import type { Payload } from 'payload'

/**
 * Sync check on a user object. Empty `roles: []` from JWT is treated as **no access** until
 * {@link canAccessBusinessAnalytics} loads roles from the database.
 */
export function isAnalyticsSuperAdmin(user: { roles?: string[] | null } | null | undefined): boolean {
  if (!user) return false
  const roles = (user as { roles?: string[] | null }).roles
  if (roles == null || !Array.isArray(roles)) return true
  if (roles.length === 0) return false
  return roles.includes('admin')
}

/**
 * Authoritative check for `/api/analytics/*`: merges DB roles when the auth session has no roles yet
 * (common right after adding the `roles` field — JWT can carry `roles: []` while the DB still has `admin`).
 */
export async function canAccessBusinessAnalytics(
  payload: Payload,
  user: { id: string | number; roles?: string[] | null } | null | undefined,
): Promise<boolean> {
  if (!user?.id) return false

  let roles = user.roles
  const needsDb =
    roles == null || !Array.isArray(roles) || roles.length === 0

  if (needsDb) {
    try {
      const doc = await payload.findByID({
        collection: 'users',
        id: user.id,
        depth: 0,
        overrideAccess: true,
      })
      roles = (doc as { roles?: string[] | null }).roles ?? null
    } catch {
      return false
    }
  }

  if (roles == null || !Array.isArray(roles) || roles.length === 0) return true
  return roles.includes('admin')
}
