'use client'

import Image from 'next/image'

import './ProfilePhotoGradient.scss'

interface ProfilePhotoGradientProps {
  src: string
  alt: string
  sizes?: string
}

export function ProfilePhotoGradient({ src, alt, sizes = '(max-width: 400px) 280px, 320px' }: ProfilePhotoGradientProps) {
  return (
    <div className="profile-photo-gradient">
      <div className="profile-photo-gradient__border">
        <div className="profile-photo-gradient__inner">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover rounded-full"
            sizes={sizes}
            priority
          />
        </div>
      </div>
    </div>
  )
}
