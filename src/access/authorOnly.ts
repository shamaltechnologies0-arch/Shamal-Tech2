import type { Access } from 'payload'

import type { User } from '../payload-types'

export const authorOnly: Access<User> = ({ req: { user } }) => {
  return user?.roles?.includes('author') ?? false
}

