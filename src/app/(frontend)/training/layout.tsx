import type { Metadata } from 'next'
import React from 'react'

import { localizedPageMetadata } from '../../../lib/seo/localizedMetadata'

export async function generateMetadata(): Promise<Metadata> {
  return localizedPageMetadata({
    en: {
      title: 'Training | Shamal Technologies',
      description:
        'Professional drone and UAS training from Shamal Technologies — structured courses, progress tracking, and completion certificates.',
    },
    ar: {
      title: 'التدريب | شمل للتقنيات',
      description:
        'تدريب مهني على الطائرات بدون طيار من شمل للتقنيات — دورات منظمة، متابعة التقدم، وشهادات إتمام.',
    },
  })
}

/**
 * Layout shell for the /training product surface (content width; main site header from root layout).
 */
export default function TrainingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[75vh] bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">{children}</div>
    </div>
  )
}
