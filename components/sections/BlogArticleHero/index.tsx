'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import type { ImageAsset } from '@/lib/data/types'
import s from './BlogArticleHero.module.css'

interface Props {
  title: string
  coverImage?: ImageAsset
  mobileImage?: ImageAsset
}

export default function BlogArticleHero({ title, coverImage, mobileImage }: Props) {
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const stId = 'hero-cover-parallax'
    const img = imageRef.current
    if (img && img.parentElement) {
      gsap.to(img, {
        yPercent: 18,
        ease: 'none',
        scrollTrigger: {
          id: stId,
          trigger: img.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })
    }

    return () => {
      ScrollTrigger.getById(stId)?.kill()
    }
  }, [])

  if (!coverImage) return null

  return (
    <header className={s.hero}>
      <div className={s.coverOuter}>
        <div ref={imageRef} className={s.coverInner}>
          <Image
            src={coverImage.url}
            alt={coverImage.alt ?? title}
            fill
            sizes="100vw"
            priority
            className={`${s.coverImage} ${mobileImage ? s.imageDesktop : ''}`}
          />
          {mobileImage && (
            <Image
              src={mobileImage.url}
              alt={mobileImage.alt ?? title}
              fill
              sizes="100vw"
              priority
              className={`${s.coverImage} ${s.imageMobile}`}
            />
          )}
        </div>
      </div>
    </header>
  )
}
