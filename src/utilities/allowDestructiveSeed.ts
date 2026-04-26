/**
 * The template seed deletes every row in multiple collections (including services)
 * then inserts demo content. That must not run on production by accident.
 */
export function assertDestructiveSeedAllowed(context = 'destructive seed'): void {
  if (process.env.ALLOW_DANGEROUS_SEED === 'true') return
  if (process.env.NODE_ENV !== 'production') return
  throw new Error(
    `Refusing ${context}: this operation deletes CMS content. It is disabled when NODE_ENV=production. To run anyway (dangerous), set ALLOW_DANGEROUS_SEED=true.`,
  )
}

export function isDestructiveSeedUiShown(): boolean {
  if (process.env.NODE_ENV !== 'production') return true
  return process.env.NEXT_PUBLIC_SHOW_ADMIN_SEED_BUTTON === 'true'
}
