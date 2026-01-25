import React, { Fragment } from 'react'

import type { Props } from './types'

import { ImageMedia } from './ImageMedia'
import { VideoMedia } from './VideoMedia'

export const Media: React.FC<Props> = (props) => {
  const { className, htmlElement = 'div', resource } = props

  // Check if resource is a video by mimeType or filename extension
  const isVideo =
    typeof resource === 'object' &&
    resource !== null &&
    (resource?.mimeType?.includes('video') ||
      (resource?.filename && /\.(mp4|webm|ogg|mov|avi|wmv|flv|mkv)$/i.test(resource.filename)))
  
  const Tag = htmlElement || Fragment

  return (
    <Tag
      {...(htmlElement !== null
        ? {
            className,
          }
        : {})}
    >
      {isVideo ? <VideoMedia {...props} /> : <ImageMedia {...props} />}
    </Tag>
  )
}
