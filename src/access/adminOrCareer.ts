import type { Access } from 'payload'

import type { User } from '../payload-types'

export const adminOrCareer: Access<User> = ({ req: { user } }) => {
  if (!user) return false
  return user.roles?.includes('admin') || user.roles?.includes('career') || false
}

