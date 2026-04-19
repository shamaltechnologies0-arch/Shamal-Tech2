'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'

import type { CourseClientPayload } from '@/lib/training/course-access'
import { cn } from '@/utilities/ui'

/**
 * Course viewer: loads server-resolved Vimeo embed URLs (no raw private ids for trial).
 */
export function TrainingCourseClient() {
  const params = useParams()
  const courseId = String(params?.id || '')
  const router = useRouter()
  const [data, setData] = useState<CourseClientPayload | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [watched, setWatched] = useState<Set<string>>(new Set())
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!courseId) return
    fetch(`/api/training/courses/${courseId}`, { credentials: 'include' })
      .then(async (res) => {
        if (res.status === 401) {
          router.push('/training/login')
          return
        }
        if (!res.ok) {
          setError('Could not load course')
          return
        }
        const json = (await res.json()) as CourseClientPayload
        setData(json)
        setWatched(new Set(json.watchedVideoIds || []))
      })
      .catch(() => setError('Network error'))
  }, [courseId, router])

  const totalVideos = useMemo(() => {
    if (!data) return 0
    return data.modules.reduce((n, m) => n + m.videos.length, 0)
  }, [data])

  const progressPercent = useMemo(() => {
    if (!totalVideos) return 0
    return Math.round((watched.size / totalVideos) * 100)
  }, [watched.size, totalVideos])

  const syncProgress = useCallback(
    async (nextWatched: Set<string>) => {
      if (!courseId || !data) return
      const pct = totalVideos ? Math.round((nextWatched.size / totalVideos) * 100) : 0
      setSaving(true)
      try {
        await fetch('/api/training/progress', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            courseId,
            progress: pct,
            watchedVideoIds: [...nextWatched],
            completed: pct >= 100,
          }),
        })
      } finally {
        setSaving(false)
      }
    },
    [courseId, data, totalVideos],
  )

  const markWatched = (videoId: string) => {
    const next = new Set(watched)
    next.add(videoId)
    setWatched(next)
    void syncProgress(next)
  }

  const captureLead = async () => {
    await fetch('/api/training/lead', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId, action: 'buy_course' }),
    })
    router.push('/training/checkout')
  }

  if (error) {
    return <p className="text-destructive">{error}</p>
  }
  if (!data) {
    return <p className="text-muted-foreground">Loading course…</p>
  }

  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-rajdhani)] text-3xl font-bold text-foreground md:text-4xl">
            {data.course.title}
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">{data.course.description}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-sm">
          <div className="font-medium text-foreground">Your progress</div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-secondary transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="mt-1 text-muted-foreground">
            {progressPercent}% complete {saving ? '· saving…' : ''}
          </div>
        </div>
      </header>

      <div className="relative aspect-[21/9] w-full max-w-4xl overflow-hidden rounded-2xl border border-border bg-muted">
        <Image
          src={data.course.thumbnail}
          alt=""
          fill
          className="object-contain p-8"
          sizes="(max-width: 896px) 100vw, 896px"
          priority
        />
      </div>

      {data.modules.map((mod) => (
        <section key={mod.id} className="space-y-4">
          <h2 className="font-[family-name:var(--font-rajdhani)] text-xl font-semibold text-foreground">
            {mod.title}
          </h2>
          {mod.description ? <p className="text-sm text-muted-foreground">{mod.description}</p> : null}
          <div className="space-y-8">
            {mod.videos.map((v) => (
              <div
                key={v.id}
                className="rounded-2xl border border-border bg-card p-4 shadow-sm"
              >
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-medium text-foreground">{v.title}</h3>
                  {v.durationMin ? (
                    <span className="text-xs text-muted-foreground">{v.durationMin} min</span>
                  ) : null}
                </div>
                {v.embedUrl ? (
                  <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
                    <iframe
                      title={v.title}
                      src={v.embedUrl}
                      className="h-full w-full"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div
                    className={cn(
                      'flex aspect-video w-full flex-col items-center justify-center gap-4 rounded-xl bg-muted p-6 text-center',
                    )}
                  >
                    <p className="text-sm text-muted-foreground">
                      This lesson is included in the full course.
                    </p>
                    <button
                      type="button"
                      onClick={captureLead}
                      className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
                    >
                      Unlock full course
                    </button>
                  </div>
                )}
                {v.embedUrl ? (
                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={() => markWatched(v.id)}
                      disabled={watched.has(v.id)}
                      className={cn(
                        'text-sm font-medium',
                        watched.has(v.id)
                          ? 'text-muted-foreground'
                          : 'text-secondary hover:underline',
                      )}
                    >
                      {watched.has(v.id) ? 'Watched ✓' : 'Mark as watched'}
                    </button>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ))}

      <div className="rounded-2xl border border-dashed border-border bg-muted/40 p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Need full access to every module and private briefings? Complete checkout to unlock everything.
        </p>
        <Link
          href="/training/checkout"
          className="mt-3 inline-block rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
        >
          Go to checkout
        </Link>
      </div>
    </div>
  )
}
