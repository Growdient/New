'use client'

import { useRef, useCallback } from 'react'
import Image from 'next/image'
import s from './ProjectsReel.module.css'

/* ─────────────────────────────────────────────────────────────────────────────
   Static slide images — sourced directly from Webflow asset IDs on home DOM.
   These are curated project shots, NOT project index cards.
   ────────────────────────────────────────────────────────────────────────────── */
const BASE = 'https://s3.amazonaws.com/webflow-prod-assets/69273d885ceeda5caa00a47e'

const SLIDES = [
  { id: '6932c7acf26191a6a29c54e5', src: `${BASE}/6932c7acf26191a6a29c54e5_2.webp`,                        alt: 'Project slide' },
  { id: '6941aec49a124991f79687db', src: `${BASE}/6941aec49a124991f79687db_7.webp`,                        alt: 'Project slide' },
  { id: '692884cd694a5c8559b3cd39', src: `${BASE}/692884cd694a5c8559b3cd39_w1se_boxes_post.webp`,           alt: 'Project slide' },
  { id: '6937454daf210a3d28d21831', src: `${BASE}/6937454daf210a3d28d21831_Myself_Can_lemon_preview_2_01.webp`, alt: 'Project slide' },
  { id: '6937438a01f40b068296335a', src: `${BASE}/6937438a01f40b068296335a_0_0%20(14).webp`,               alt: 'Project slide' },
  { id: '693745a085d72f488a7ea18f', src: `${BASE}/693745a085d72f488a7ea18f_10.webp`,                       alt: 'Project slide' },
  { id: '6941af073462733d3832a27d', src: `${BASE}/6941af073462733d3832a27d_15.webp`,                       alt: 'Project slide' },
  { id: '6941af43ff2f2dce06f09ef4', src: `${BASE}/6941af43ff2f2dce06f09ef4_2.webp`,                       alt: 'Project slide' },
  { id: '6937462a797d31320900183e', src: `${BASE}/6937462a797d31320900183e_Group%202771326244.webp`,        alt: 'Project slide' },
  { id: '6941afbc4db30034b982a830', src: `${BASE}/6941afbc4db30034b982a830_omna1.webp`,                    alt: 'Project slide' },
  { id: '6932c7847a6955dd85c9691c', src: `${BASE}/6932c7847a6955dd85c9691c_2.avif`,                        alt: 'Project slide' },
]

function ReelTrack() {
  const doubled = [...SLIDES, ...SLIDES]

  return (
    <div className={s.track} aria-hidden="true">
      {doubled.map((slide, i) => (
        <div key={`${slide.id}-${i}`} className={s.card}>
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            sizes="500px"
            className={s.image}
            draggable={false}
          />
        </div>
      ))}
    </div>
  )
}

export default function ProjectsReel() {
  const animRef = useRef<HTMLDivElement>(null)

  const pause = useCallback(() => {
    if (animRef.current) animRef.current.style.animationPlayState = 'paused'
  }, [])

  const resume = useCallback(() => {
    if (animRef.current) animRef.current.style.animationPlayState = 'running'
  }, [])

  return (
    <section
      className={s.section}
      data-theme="light"
      data-section="projects-reel"
      aria-label="Projects reel"
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      <div className={s.inner}>
        <div ref={animRef} className={s.animation}>
          <ReelTrack />
        </div>
      </div>
    </section>
  )
}
