import type { Access, FieldAccess } from 'payload'

import type { User } from '../payload-types'

export const adminOrSales: Access<User> = ({ req: { user } }) => {
  if (!user) return false
  return user.roles?.includes('admin') || user.roles?.includes('sales') || false
}

// Field-level access function (returns boolean only)
export const adminOrSalesField: FieldAccess = ({ req: { user } }) => {
  if (!user) return false
  return user.roles?.includes('admin') || user.roles?.includes('sales') || false
}

