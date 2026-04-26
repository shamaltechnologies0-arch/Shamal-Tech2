import type { Access } from 'payload'

/** Block unauthenticated Payload REST/GraphQL creates; server routes use overrideAccess. */
export const noPublicAccess: Access = () => false
