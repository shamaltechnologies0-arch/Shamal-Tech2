import type { Access, FieldAccess } from 'payload'

import type { User } from '../payload-types'

export const adminOrMarketing: Access<User> = ({ req: { user } }) => {
  if (!user) return false
  return user.roles?.includes('admin') || user.roles?.includes('marketing') || false
}

// Field-level access function (returns boolean only)
export const adminOrMarketingField: FieldAccess = ({ req: { user } }) => {
  if (!user) return false
  return user.roles?.includes('admin') || user.roles?.includes('marketing') || false
}
