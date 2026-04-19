import Link from 'next/link'
import React from 'react'

/**
 * Training landing — primary CTAs for preview vs. purchase.
 */
export default function TrainingHomePage() {
  return (
    <div className="space-y-12">
      <section className="rounded-3xl border border-border bg-gradient-to-br from-card to-muted/40 p-8 md:p-12">
        <p className="text-sm font-medium uppercase tracking-wider text-secondary">Shamal Training</p>
        <h1 className="mt-3 font-[family-name:var(--font-rajdhani)] text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Drone operations training built for enterprise teams
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Start with a free preview, then unlock the full curriculum with secure video delivery, progress tracking,
          and automation hooks for your CRM.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/training/register"
            className="inline-flex rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-95"
          >
            Start free preview
          </Link>
          <Link
            href="/training/login"
            className="inline-flex rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground"
          >
            Sign in
          </Link>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {[
          {
            title: 'Trial access',
            body: 'Review the course outline and watch 1–2 preview modules before you buy.',
          },
          {
            title: 'Paid unlock',
            body: 'Full modules with Vimeo-backed playback and progress synced to ClickUp + n8n.',
          },
          {
            title: 'Admin & CRM',
            body: 'Dashboards for users, payments, and leads — wired to webhooks your automation owns.',
          },
        ].map((c) => (
          <div key={c.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="font-[family-name:var(--font-rajdhani)] text-lg font-semibold text-foreground">
              {c.title}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{c.body}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
