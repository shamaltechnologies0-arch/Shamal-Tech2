import type { Access, FieldAccess } from 'payload'

import type { User } from '../payload-types'

export const adminOnly: Access<User> = ({ req: { user } }) => {
  return user?.roles?.includes('admin') ?? false
}

// Allow user creation only when no users exist yet (first-time setup),
// otherwise enforce normal admin-only behavior.
export const adminOnlyOrFirstUser: Access<User> = async ({ req }) => {
  if (req.user?.roles?.includes('admin')) {
    return true
  }

  const existingUsers = await req.payload.find({
    collection: 'users',
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })

  return existingUsers.totalDocs === 0
}

// Field-level access function (returns boolean only)
export const adminOnlyField: FieldAccess = ({ req: { user } }) => {
  return user?.roles?.includes('admin') ?? false
}

