import type { Access } from 'payload'

import type { User } from '../payload-types'

export const designerOnly: Access<User> = ({ req: { user } }) => {
  return user?.roles?.includes('designer') ?? false
}

