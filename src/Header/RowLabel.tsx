'use client'
import { Header } from '../payload-types'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

export const RowLabel: React.FC<RowLabelProps> = () => {
  // Always call the hook unconditionally (React rules require unconditional hook calls)
  const hookResult = useRowLabel<NonNullable<Header['navItems']>[number]>()
  
  // If data is not available (e.g., not in admin context), return fallback
  if (!hookResult || !hookResult.data) {
    return <div>Row</div>
  }
  
  const data = hookResult

  // If data is not available (e.g., not in admin context), return fallback
  if (!data || !data.data) {
    return <div>Row</div>
  }

  const label = data.data.link?.label
    ? `Nav item ${data.rowNumber !== undefined ? data.rowNumber + 1 : ''}: ${data.data.link.label}`
    : 'Row'

  return <div>{label}</div>
}
