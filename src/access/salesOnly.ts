import type { Access } from 'payload'

import type { User } from '../payload-types'

export const salesOnly: Access<User> = ({ req: { user } }) => {
  return user?.roles?.includes('sales') ?? false
}

