import type { Access } from 'payload'

import type { User } from '../payload-types'

export const careerOnly: Access<User> = ({ req: { user } }) => {
  return user?.roles?.includes('career') ?? false
}

