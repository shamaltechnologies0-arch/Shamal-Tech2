'use client'

import { cn } from '../../../utilities/ui'
import React, { useEffect, useRef } from 'react'

import type { Props as MediaProps } from '../types'

import { getMediaUrl } from '../../../utilities/getMediaUrl'

export const VideoMedia: React.FC<MediaProps> = (props) => {
  const { onClick, resource, videoClassName } = props

  const videoRef = useRef<HTMLVideoElement>(null)
  // const [showFallback] = useState<boolean>()

  useEffect(() => {
    const { current: video } = videoRef
    if (video) {
      video.addEventListener('suspend', () => {
        // setShowFallback(true);
        // console.warn('Video was suspended, rendering fallback image.')
      })
    }
  }, [])

  if (resource && typeof resource === 'object') {
    const { filename, url } = resource
    const videoSrc = url ? getMediaUrl(url, resource.updatedAt) : filename ? getMediaUrl(`/media/${filename}`, resource.updatedAt) : null

    if (!videoSrc) return null

    return (
      <video
        autoPlay
        className={cn(videoClassName)}
        controls
        loop
        muted
        onClick={onClick}
        playsInline
        ref={videoRef}
      >
        <source src={videoSrc} type={resource.mimeType || 'video/mp4'} />
      </video>
    )
  }

  return null
}
