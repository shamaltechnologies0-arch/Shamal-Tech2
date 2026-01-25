import type { Access, FieldAccess } from 'payload'

import type { User } from '../payload-types'

export const adminOnly: Access<User> = ({ req: { user } }) => {
  return user?.roles?.includes('admin') ?? false
}

// Field-level access function (returns boolean only)
export const adminOnlyField: FieldAccess = ({ req: { user } }) => {
  return user?.roles?.includes('admin') ?? false
}

