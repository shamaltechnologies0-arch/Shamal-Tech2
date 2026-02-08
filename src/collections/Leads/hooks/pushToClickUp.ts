/**
 * Leads afterChange hook: Push website-originated leads to ClickUp.
 *
 * SAFETY GUARANTEES:
 * - Runs ONLY on operation === 'create' (admin edits never trigger)
 * - Runs ONLY if leadOrigin === 'website' (admin-created leads are skipped)
 * - Skips if pushedToClickUp === true (idempotent, no duplicates)
 * - NEVER throws - ClickUp failures are logged but never block lead creation
 *
 * LOOP PREVENTION:
 * - Our payload.update() triggers afterChange with operation === 'update'
 * - We only act when operation === 'create', so we exit immediately on update
 */

import type { CollectionAfterChangeHook } from 'payload'
import { createClickUpTask } from '../../../lib/clickup/createTask'

export const pushToClickUp: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
}) => {
  // 1. Only run on create - admin edits never trigger ClickUp sync
  if (operation !== 'create') {
    return doc
  }

  // 2. Only push leads from website form - admin-created leads stay in Payload only
  if (doc.leadOrigin !== 'website') {
    return doc
  }

  // 3. Idempotency - skip if already pushed (safety for retries)
  if (doc.pushedToClickUp === true) {
    return doc
  }

  // 4. Resolve service names for task title and description
  let serviceNames: string[] = []
  if (doc.services && Array.isArray(doc.services) && doc.services.length > 0) {
    for (const s of doc.services) {
      if (typeof s === 'object' && s !== null && 'title' in s) {
        serviceNames.push((s as { title: string }).title)
      } else if (typeof s === 'string') {
        try {
          const service = await req.payload.findByID({
            collection: 'services',
            id: s,
            depth: 0,
          })
          serviceNames.push(service.title)
        } catch {
          serviceNames.push('Unknown')
        }
      }
    }
  }
  const serviceLabel = serviceNames.length > 0 ? serviceNames.join(', ') : 'General'

  // 5. Build task name: {Company} – {Full Name} – {Service}
  const company = doc.company?.trim() || '—'
  const name = doc.name?.trim() || 'Unknown'
  const taskName = `${company} – ${name} – ${serviceLabel}`

  // 6. Build task description
  const description = [
    `**Name:** ${doc.name || '—'}`,
    `**Email:** ${doc.email || '—'}`,
    `**Phone:** ${doc.phone || '—'}`,
    `**Company:** ${doc.company || '—'}`,
    `**Service:** ${serviceLabel}`,
    `**Message:**\n${doc.message || '—'}`,
  ].join('\n')

  // 7. Create ClickUp task - never throws
  const result = await createClickUpTask({ name: taskName, description })

  if (!result) {
    // Logged in createClickUpTask - lead stays in Payload, no retry here
    return doc
  }

  // 8. Persist ClickUp task ID and URL back to lead (triggers afterChange with operation='update' - we skip)
  try {
    await req.payload.update({
      collection: 'leads',
      id: doc.id,
      data: {
        pushedToClickUp: true,
        clickupTaskId: result.id,
        clickupTaskUrl: result.url,
      },
      context: {
        disableRevalidate: true,
      },
    })
  } catch (err) {
    console.error('[Leads] Failed to update lead with ClickUp task ID:', err)
    // Lead exists, task exists in ClickUp - manual reconciliation possible
  }

  return doc
}
