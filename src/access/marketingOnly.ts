import type { Access } from 'payload'

import type { User } from '../payload-types'

export const marketingOnly: Access<User> = ({ req: { user } }) => {
  return user?.roles?.includes('marketing') ?? false
}

