# Contact Form → PayloadCMS → ClickUp Architecture

## A) Architecture Plan

### Data Flow (Simple)

```
Website Contact Form (POST /api/contact)
    │
    ▼
PayloadCMS payload.create({ collection: 'leads', data: { ..., leadOrigin: 'website' } })
    │
    ├──► MongoDB: Lead saved (ALWAYS succeeds first)
    │
    └──► afterChange hook (async, non-blocking)
            │
            ├── IF operation !== 'create'     → EXIT (admin edits never trigger)
            ├── IF leadOrigin !== 'website'  → EXIT (admin-created leads skip)
            ├── IF pushedToClickUp === true   → EXIT (idempotent, no duplicates)
            │
            └──► ClickUp API: POST /api/v2/list/{list_id}/task
                    │
                    ├── Success → payload.update(lead, { pushedToClickUp, clickupTaskId, clickupTaskUrl })
                    └── Failure → Log error, return. Lead stays in Payload only.
```

### Why This Approach Is Safe and Scalable

| Concern | How It's Addressed |
|--------|--------------------|
| **Lead creation never fails** | ClickUp logic runs in `afterChange` (post-save). Lead is already in MongoDB before any API call. |
| **ClickUp failures are isolated** | `createClickUpTask` catches all errors, logs them, returns `null`. Hook never throws. |
| **No duplicate tasks** | `pushedToClickUp` guard + we only run on `create`. Once pushed, we never call ClickUp again. |
| **Admin edits don't trigger sync** | We check `operation === 'create'`. Updates (admin edits) exit immediately. |
| **Scalable** | Single async hook, no queues. For high volume, add a job queue later without changing the model. |

---

## B) Leads Collection Changes

### New Fields

| Field | Type | Purpose |
|-------|------|---------|
| `leadOrigin` | select: `website` \| `admin` | Distinguishes website form vs admin-created. Only `website` triggers ClickUp. |
| `pushedToClickUp` | boolean | Idempotency flag. Prevents duplicate tasks. |
| `clickupTaskId` | text | ClickUp task ID (read-only in admin). |
| `clickupTaskUrl` | text | Link to task (read-only in admin). |

All ClickUp fields (`pushedToClickUp`, `clickupTaskId`, `clickupTaskUrl`) are **read-only** in the Payload admin.

---

## C) afterChange Hook Logic

**File:** `src/collections/Leads/hooks/pushToClickUp.ts`

**Conditions (all must pass):**

1. `operation === 'create'` — only on new leads
2. `leadOrigin === 'website'` — only website form submissions
3. `pushedToClickUp !== true` — idempotency

**Behavior:**

- Calls `createClickUpTask()` with task name and description
- On success: updates lead with `pushedToClickUp`, `clickupTaskId`, `clickupTaskUrl`
- On failure: logs error, returns. Never throws.

---

## D) ClickUp Task Format

**Task name:** `{Company} – {Full Name} – {Service}`

- Company: from lead, or `—` if empty
- Full Name: from lead
- Service: resolved from `services` relationship, or `General` if none

**Task description (Markdown):**

```
**Name:** ...
**Email:** ...
**Phone:** ...
**Company:** ...
**Service:** ...
**Message:**
...
```

---

## E) Best Practices

### Infinite Loop Prevention

- The hook only acts when `operation === 'create'`
- Our `payload.update()` triggers `afterChange` with `operation === 'update'`
- On update, we exit at the first check → no loop

### Duplicate Prevention

- `pushedToClickUp` is checked before calling ClickUp
- After a successful push, we set `pushedToClickUp: true`
- Re-runs (e.g. retries) skip because `pushedToClickUp` is already true

### Extensibility

| Extension | Approach |
|----------|----------|
| **WhatsApp** | Add another `afterChange` hook (or extend this one) that sends a WhatsApp message when `leadOrigin === 'website'`. Same pattern: never throw, log failures. |
| **Automation** | Add a cron job that finds leads with `pushedToClickUp === false` and `leadOrigin === 'website'` to retry failed ClickUp syncs. |
| **n8n reintroduction** | Expose a webhook endpoint that n8n calls. The webhook can read from MongoDB (Payload API) and push to ClickUp. Keep the hook for direct sync; n8n becomes an optional layer. |

---

## Environment Variables

```env
CLICKUP_API_TOKEN=pk_...
CLICKUP_LIST_ID=...
```

Ensure these are set in production. If missing, the hook logs an error and skips (lead creation still succeeds).
