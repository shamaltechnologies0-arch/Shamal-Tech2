import type { Access, FieldAccess } from 'payload'

import type { User } from '../payload-types'

export const authenticated: Access<User> = ({ req: { user } }) => {
  return Boolean(user)
}

// Field-level access function (returns boolean only)
export const authenticatedField: FieldAccess = ({ req: { user } }) => {
  return Boolean(user)
}

// Admin access function (returns boolean only, no query constraints allowed)
export const authenticatedAdmin: ({ req }: { req: { user?: User | null } }) => boolean = ({ req: { user } }) => {
  return Boolean(user)
}
