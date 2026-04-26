export type Preset = 'today' | 'yesterday' | '7d' | '30d' | '90d' | 'custom'

export function parseRange(searchParams: URLSearchParams): { from: string; to: string; preset: Preset } {
  const preset = (searchParams.get('preset') || 'today') as Preset
  const customFrom = searchParams.get('from')
  const customTo = searchParams.get('to')
  const now = new Date()

  const endOfDay = (d: Date) => {
    const x = new Date(d)
    x.setUTCHours(23, 59, 59, 999)
    return x
  }
  const startOfDay = (d: Date) => {
    const x = new Date(d)
    x.setUTCHours(0, 0, 0, 0)
    return x
  }

  if (preset === 'custom' && customFrom && customTo) {
    return {
      from: new Date(customFrom).toISOString(),
      to: endOfDay(new Date(customTo)).toISOString(),
      preset: 'custom',
    }
  }

  if (preset === 'yesterday') {
    const y = new Date(now)
    y.setUTCDate(y.getUTCDate() - 1)
    return {
      from: startOfDay(y).toISOString(),
      to: endOfDay(y).toISOString(),
      preset: 'yesterday',
    }
  }

  if (preset === '7d') {
    const from = new Date(now)
    from.setUTCDate(from.getUTCDate() - 6)
    return { from: startOfDay(from).toISOString(), to: endOfDay(now).toISOString(), preset: '7d' }
  }

  if (preset === '30d') {
    const from = new Date(now)
    from.setUTCDate(from.getUTCDate() - 29)
    return { from: startOfDay(from).toISOString(), to: endOfDay(now).toISOString(), preset: '30d' }
  }

  if (preset === '90d') {
    const from = new Date(now)
    from.setUTCDate(from.getUTCDate() - 89)
    return { from: startOfDay(from).toISOString(), to: endOfDay(now).toISOString(), preset: '90d' }
  }

  // today (default)
  return {
    from: startOfDay(now).toISOString(),
    to: endOfDay(now).toISOString(),
    preset: 'today',
  }
}

export function utcDayBounds(d: Date): { from: string; to: string } {
  const from = new Date(d)
  from.setUTCHours(0, 0, 0, 0)
  const to = new Date(d)
  to.setUTCHours(23, 59, 59, 999)
  return { from: from.toISOString(), to: to.toISOString() }
}

export function rollingFrom(days: number): { from: string; to: string } {
  const end = new Date()
  const from = new Date(end)
  from.setUTCDate(from.getUTCDate() - (days - 1))
  from.setUTCHours(0, 0, 0, 0)
  const to = new Date(end)
  to.setUTCHours(23, 59, 59, 999)
  return { from: from.toISOString(), to: to.toISOString() }
}
