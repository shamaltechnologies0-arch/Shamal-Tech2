'use client'

import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import { useTrainingUser } from '@/hooks/useTrainingUser'

type Overview = {
  users: {
    id: string
    email: string
    name: string
    role: string
    warmLead: boolean
    createdTime: string
  }[]
  allUserCount: number
  payments: { id: string; fields: Record<string, unknown>; createdTime: string }[]
  progress: { id: string; fields: Record<string, unknown>; createdTime: string }[]
  filter: string
}

/**
 * Admin dashboard — ClickUp-backed lists with filters (trial / paid / leads).
 */
export default function TrainingAdminPage() {
  const router = useRouter()
  const { user, loading } = useTrainingUser()
  const [filter, setFilter] = useState<'all' | 'trial' | 'paid' | 'leads'>('all')
  const [data, setData] = useState<Overview | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/training/login')
    }
  }, [loading, user, router])

  useEffect(() => {
    if (!user || user.role !== 'admin') return
    fetch(`/api/training/admin/overview?filter=${filter}`, { credentials: 'include' })
      .then(async (res) => {
        if (res.status === 403) {
          setError('Admin only')
          return
        }
        if (!res.ok) {
          setError('Failed to load')
          return
        }
        setData(await res.json())
      })
      .catch(() => setError('Failed to load'))
  }, [user, filter])

  if (loading || !user) {
    return <p className="text-muted-foreground">Loading…</p>
  }
  if (user.role !== 'admin') {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <p className="text-foreground">You don’t have access to this area.</p>
      </div>
    )
  }
  if (error) {
    return <p className="text-destructive">{error}</p>
  }
  if (!data) {
    return <p className="text-muted-foreground">Loading admin data…</p>
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-[family-name:var(--font-rajdhani)] text-3xl font-bold text-foreground">Admin</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Users, payments, and progress rows from ClickUp ({data.allUserCount} total accounts).
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {(['all', 'trial', 'paid', 'leads'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                filter === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <section>
        <h2 className="font-semibold text-foreground">Users</h2>
        <div className="mt-3 overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Role</th>
                <th className="px-3 py-2">Warm lead</th>
                <th className="px-3 py-2">Created</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map((u) => (
                <tr key={u.id} className="border-t border-border">
                  <td className="px-3 py-2 text-foreground">{u.name}</td>
                  <td className="px-3 py-2">{u.email}</td>
                  <td className="px-3 py-2 capitalize">{u.role}</td>
                  <td className="px-3 py-2">{u.warmLead ? 'yes' : '—'}</td>
                  <td className="px-3 py-2 text-muted-foreground">
                    {new Date(u.createdTime).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="font-semibold text-foreground">Payments</h2>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          {data.payments.length === 0 ? (
            <li>No payment rows yet.</li>
          ) : (
            data.payments.map((p) => (
              <li key={p.id} className="rounded-lg border border-border bg-card px-3 py-2 font-mono text-xs">
                {JSON.stringify(p.fields)}
              </li>
            ))
          )}
        </ul>
      </section>

      <section>
        <h2 className="font-semibold text-foreground">Progress rows</h2>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          {data.progress.length === 0 ? (
            <li>No progress rows yet.</li>
          ) : (
            data.progress.map((p) => (
              <li key={p.id} className="rounded-lg border border-border bg-card px-3 py-2 font-mono text-xs">
                {JSON.stringify(p.fields)}
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  )
}
