/**
 * ClickUp REST client for training users, progress, and payments (tasks + list custom fields).
 * Create three Lists in ClickUp and add matching custom field names (see .env.example).
 */

import type { TrainingRole } from './types'
import { getClickupTrainingConfig } from './env'

const API = 'https://api.clickup.com/api/v2'

const FIELD = {
  email: process.env.TRAINING_CLICKUP_FIELD_EMAIL || 'Email',
  name: process.env.TRAINING_CLICKUP_FIELD_NAME || 'Name',
  phone: process.env.TRAINING_CLICKUP_FIELD_PHONE || 'Phone',
  role: process.env.TRAINING_CLICKUP_FIELD_ROLE || 'Role',
  passwordHash: process.env.TRAINING_CLICKUP_FIELD_PASSWORD_HASH || 'Password_Hash',
  warmLead: process.env.TRAINING_CLICKUP_FIELD_WARM_LEAD || 'Warm_Lead',
  userEmail: process.env.TRAINING_CLICKUP_FIELD_PROGRESS_EMAIL || 'user_email',
  courseId: process.env.TRAINING_CLICKUP_FIELD_COURSE_ID || 'course_id',
  progressPercent: process.env.TRAINING_CLICKUP_FIELD_PROGRESS_PERCENT || 'progress_percent',
  completed: process.env.TRAINING_CLICKUP_FIELD_COMPLETED || 'completed',
  lastActivity: process.env.TRAINING_CLICKUP_FIELD_LAST_ACTIVITY || 'last_activity',
  watchedVideos: process.env.TRAINING_CLICKUP_FIELD_WATCHED_VIDEOS || 'watched_videos',
  amount: process.env.TRAINING_CLICKUP_FIELD_AMOUNT || 'amount',
  currency: process.env.TRAINING_CLICKUP_FIELD_CURRENCY || 'currency',
  stripeSession: process.env.TRAINING_CLICKUP_FIELD_STRIPE_SESSION || 'stripe_session_id',
}

export type TrainingRecord<T extends Record<string, unknown> = Record<string, unknown>> = {
  id: string
  createdTime: string
  fields: T
}

type CfMeta = {
  id: string
  name: string
  type: string
  type_config?: {
    options?: Array<{ id: string; name: string; orderindex?: number }>
  }
}

type ClickupTask = {
  id: string
  name: string
  date_created: string
  custom_fields?: Array<{ id: string; name: string; type: string; value?: unknown }>
}

const fieldMetaCache = new Map<string, Map<string, CfMeta>>()

async function clickupFetch(path: string, init: RequestInit & { token: string }) {
  const { token, ...rest } = init
  const res = await fetch(path.startsWith('http') ? path : `${API}${path.startsWith('/') ? '' : '/'}${path}`, {
    ...rest,
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
      ...rest.headers,
    },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`ClickUp ${res.status}: ${text}`)
  }
  return res.json() as Promise<unknown>
}

function createdTimeFromTask(t: ClickupTask): string {
  const raw = t.date_created
  const n = Number(raw)
  if (!Number.isNaN(n) && String(raw).match(/^\d+$/)) {
    return new Date(n).toISOString()
  }
  const d = Date.parse(String(raw))
  return Number.isNaN(d) ? new Date().toISOString() : new Date(d).toISOString()
}

function readCfValue(value: unknown): unknown {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const o = value as Record<string, unknown>
    if (typeof o.name === 'string') return o.name
    if (typeof o.username === 'string') return o.username
  }
  return value
}

function taskToFields(task: ClickupTask): Record<string, unknown> {
  const fields: Record<string, unknown> = {}
  for (const cf of task.custom_fields ?? []) {
    fields[cf.name] = readCfValue(cf.value)
  }
  return fields
}

function taskToRecord<T extends Record<string, unknown>>(task: ClickupTask): TrainingRecord<T> {
  return {
    id: task.id,
    createdTime: createdTimeFromTask(task),
    fields: taskToFields(task) as T,
  }
}

async function getFieldMetaByName(listId: string): Promise<Map<string, CfMeta>> {
  const cached = fieldMetaCache.get(listId)
  if (cached) return cached
  const cfg = getClickupTrainingConfig()
  if (!cfg) throw new Error('ClickUp training is not configured')
  const data = (await clickupFetch(`/list/${listId}/field`, { method: 'GET', token: cfg.token })) as {
    fields?: CfMeta[]
  }
  const map = new Map<string, CfMeta>()
  for (const f of data.fields ?? []) {
    map.set(f.name, f)
  }
  fieldMetaCache.set(listId, map)
  return map
}

function formatValueForClickUp(meta: CfMeta | undefined, value: unknown): unknown {
  if (value === undefined) return undefined
  const t = meta?.type ?? ''
  if (t === 'checkbox') return Boolean(value)
  if (t === 'number' || t === 'currency') {
    return typeof value === 'number' ? value : Number(value)
  }
  if (t === 'drop_down') {
    if (typeof value === 'number') return value
    const raw = String(value).trim()
    const options = meta?.type_config?.options ?? []
    const match = options.find((o) => {
      const name = String(o.name ?? '').trim().toLowerCase()
      const id = String(o.id ?? '').trim()
      const order = String(o.orderindex ?? '')
      return name === raw.toLowerCase() || id === raw || order === raw
    })
    if (match?.id) return match.id
    const asNum = Number(raw)
    return Number.isNaN(asNum) ? raw : asNum
  }
  if (t === 'date') {
    if (typeof value === 'string') {
      const ms = Date.parse(value)
      return Number.isNaN(ms) ? value : ms
    }
    return value
  }
  if (t === 'emoji' || t === 'manual_progress' || t === 'labels') {
    return value
  }
  return value === null ? null : String(value)
}

async function buildCustomFieldsArray(
  listId: string,
  entries: Partial<Record<string, string | number | boolean | null>>,
  options?: { optionalFieldNames?: Set<string> },
): Promise<Array<{ id: string; value: unknown }>> {
  const metaByName = await getFieldMetaByName(listId)
  const out: Array<{ id: string; value: unknown }> = []
  const optionalFieldNames = options?.optionalFieldNames ?? new Set<string>()
  for (const [name, raw] of Object.entries(entries)) {
    if (raw === undefined) continue
    const meta = metaByName.get(name)
    if (!meta) {
      if (optionalFieldNames.has(name)) {
        continue
      }
      throw new Error(
        `ClickUp list ${listId} has no custom field named "${name}". Add it in ClickUp or set TRAINING_CLICKUP_FIELD_* to match your field labels.`,
      )
    }
    const v = formatValueForClickUp(meta, raw)
    if (v !== undefined) {
      out.push({ id: meta.id, value: v })
    }
  }
  return out
}

async function fetchAllTasks(listId: string, maxRecords: number): Promise<ClickupTask[]> {
  const cfg = getClickupTrainingConfig()
  if (!cfg) return []
  const out: ClickupTask[] = []
  let page = 0
  while (out.length < maxRecords) {
    const limit = Math.min(100, maxRecords - out.length)
    const path = `/list/${listId}/task?page=${page}&include_closed=true&subtasks=true&limit=${limit}`
    const data = (await clickupFetch(path, { method: 'GET', token: cfg.token })) as {
      tasks?: ClickupTask[]
      last_page?: boolean
    }
    const batch = data.tasks ?? []
    out.push(...batch)
    if (data.last_page || batch.length === 0) break
    page += 1
  }
  return out.slice(0, maxRecords)
}

/** Custom field names come from FIELD / env; values are string or boolean flags. */
export type TrainingUserFields = Record<string, string | boolean | undefined>

export async function findUserByEmail(email: string): Promise<TrainingRecord<TrainingUserFields> | null> {
  const cfg = getClickupTrainingConfig()
  if (!cfg) return null
  const needle = email.toLowerCase()
  const tasks = await fetchAllTasks(cfg.usersList, 500)
  for (const t of tasks) {
    const fields = taskToFields(t)
    const em = String(fields[FIELD.email] ?? '')
      .trim()
      .toLowerCase()
    if (em === needle) {
      return taskToRecord<TrainingUserFields>(t)
    }
  }
  return null
}

export async function createUser(input: {
  email: string
  name: string
  phone?: string
  passwordHash: string
  role: TrainingRole
}): Promise<TrainingRecord<TrainingUserFields>> {
  const cfg = getClickupTrainingConfig()
  if (!cfg) throw new Error('ClickUp training is not configured')

  const entries: Partial<Record<string, string | number | boolean | null>> = {
    [FIELD.email]: input.email,
    [FIELD.name]: input.name,
    [FIELD.passwordHash]: input.passwordHash,
    [FIELD.role]: input.role,
    [FIELD.warmLead]: false,
  }
  if (input.phone) entries[FIELD.phone] = input.phone

  const custom_fields = await buildCustomFieldsArray(cfg.usersList, entries, {
    optionalFieldNames: new Set([FIELD.phone, FIELD.warmLead]),
  })
  const data = (await clickupFetch(`/list/${cfg.usersList}/task`, {
    method: 'POST',
    token: cfg.token,
    body: JSON.stringify({
      name: `${input.name} (${input.email})`,
      notify_all: false,
      custom_fields,
    }),
  })) as ClickupTask

  return taskToRecord<TrainingUserFields>(data)
}

export async function updateUser(
  recordId: string,
  fields: Partial<Record<string, string | number | boolean>>,
): Promise<void> {
  const cfg = getClickupTrainingConfig()
  if (!cfg) throw new Error('ClickUp training is not configured')
  const custom_fields = await buildCustomFieldsArray(cfg.usersList, fields)
  if (custom_fields.length === 0) return
  await clickupFetch(`/task/${recordId}`, {
    method: 'PUT',
    token: cfg.token,
    body: JSON.stringify({ custom_fields }),
  })
}

export async function listUsers(maxRecords = 200): Promise<TrainingRecord<TrainingUserFields>[]> {
  const cfg = getClickupTrainingConfig()
  if (!cfg) return []
  const tasks = await fetchAllTasks(cfg.usersList, maxRecords)
  return tasks.map((t) => taskToRecord<TrainingUserFields>(t))
}

export async function getProgressForCourse(
  email: string,
  courseId: string,
): Promise<{ progressPercent: number; watchedIds: string[]; completed: boolean } | null> {
  const cfg = getClickupTrainingConfig()
  if (!cfg) return null
  const needle = email.toLowerCase()
  const cid = courseId.trim()
  const tasks = await fetchAllTasks(cfg.progressList, 500)
  for (const t of tasks) {
    const f = taskToFields(t)
    const ue = String(f[FIELD.userEmail] ?? '')
      .trim()
      .toLowerCase()
    const c = String(f[FIELD.courseId] ?? '').trim()
    if (ue === needle && c === cid) {
      const rawWatched = f[FIELD.watchedVideos]
      let watchedIds: string[] = []
      if (typeof rawWatched === 'string' && rawWatched.trim()) {
        try {
          watchedIds = JSON.parse(rawWatched) as string[]
        } catch {
          watchedIds = []
        }
      }
      return {
        progressPercent: Number(f[FIELD.progressPercent] ?? 0),
        watchedIds,
        completed: Boolean(f[FIELD.completed]),
      }
    }
  }
  return null
}

export async function upsertProgress(input: {
  email: string
  courseId: string
  progressPercent: number
  completed: boolean
  watchedVideoIds?: string[]
}): Promise<void> {
  const cfg = getClickupTrainingConfig()
  if (!cfg) throw new Error('ClickUp training is not configured')

  const needle = input.email.toLowerCase()
  const cid = input.courseId.trim()
  const tasks = await fetchAllTasks(cfg.progressList, 500)
  let existing: ClickupTask | undefined
  for (const t of tasks) {
    const f = taskToFields(t)
    const ue = String(f[FIELD.userEmail] ?? '')
      .trim()
      .toLowerCase()
    const c = String(f[FIELD.courseId] ?? '').trim()
    if (ue === needle && c === cid) {
      existing = t
      break
    }
  }

  const entries: Partial<Record<string, string | number | boolean | null>> = {
    [FIELD.userEmail]: input.email,
    [FIELD.courseId]: input.courseId,
    [FIELD.progressPercent]: input.progressPercent,
    [FIELD.completed]: input.completed,
    [FIELD.lastActivity]: new Date().toISOString(),
  }
  if (input.watchedVideoIds?.length) {
    entries[FIELD.watchedVideos] = JSON.stringify(input.watchedVideoIds)
  }

  const custom_fields = await buildCustomFieldsArray(cfg.progressList, entries)

  if (existing) {
    await clickupFetch(`/task/${existing.id}`, {
      method: 'PUT',
      token: cfg.token,
      body: JSON.stringify({ custom_fields }),
    })
  } else {
    await clickupFetch(`/list/${cfg.progressList}/task`, {
      method: 'POST',
      token: cfg.token,
      body: JSON.stringify({
        name: `Progress: ${input.email} / ${input.courseId}`,
        notify_all: false,
        custom_fields,
      }),
    })
  }
}

export async function createPaymentRecord(input: {
  email: string
  amount: number
  currency: string
  stripeSessionId: string
}): Promise<void> {
  const cfg = getClickupTrainingConfig()
  if (!cfg) throw new Error('ClickUp training is not configured')
  const createdField = process.env.TRAINING_CLICKUP_FIELD_PAYMENT_CREATED || 'created_at'
  const entries: Partial<Record<string, string | number | boolean | null>> = {
    [FIELD.userEmail]: input.email,
    [FIELD.amount]: input.amount,
    [FIELD.currency]: input.currency,
    [FIELD.stripeSession]: input.stripeSessionId,
    [createdField]: new Date().toISOString(),
  }
  const custom_fields = await buildCustomFieldsArray(cfg.paymentsList, entries)
  await clickupFetch(`/list/${cfg.paymentsList}/task`, {
    method: 'POST',
    token: cfg.token,
    body: JSON.stringify({
      name: `Payment ${input.currency} ${input.amount} — ${input.email}`,
      notify_all: false,
      custom_fields,
    }),
  })
}

export async function listPayments(maxRecords = 200): Promise<TrainingRecord[]> {
  const cfg = getClickupTrainingConfig()
  if (!cfg) return []
  const tasks = await fetchAllTasks(cfg.paymentsList, maxRecords)
  return tasks.map((t) => taskToRecord(t))
}

export async function listProgress(maxRecords = 200): Promise<TrainingRecord[]> {
  const cfg = getClickupTrainingConfig()
  if (!cfg) return []
  const tasks = await fetchAllTasks(cfg.progressList, maxRecords)
  return tasks.map((t) => taskToRecord(t))
}

export { FIELD as TRAINING_CLICKUP_FIELDS }
