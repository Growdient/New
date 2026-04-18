'use client'

import { useEffect, useRef, useState } from 'react'
import s from './index.module.css'

type CursorState = 'default' | 'hover_link' | 'hover_project' | 'hover_video' | 'hover_drag' | 'hidden'

const LERP_FACTOR = 0.12

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  const mouseX = useRef(0)
  const mouseY = useRef(0)
  const ringX  = useRef(0)
  const ringY  = useRef(0)
  const frameRef = useRef(0)

  const [state, setState] = useState<CursorState>('hidden')
  const stateRef = useRef<CursorState>('hidden')

  useEffect(() => {
    // Only on pointer:fine devices (desktop)
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    if (!mq.matches) return

    document.documentElement.classList.add('has-custom-cursor')

    const onMove = (e: MouseEvent) => {
      mouseX.current = e.clientX
      mouseY.current = e.clientY
      if (stateRef.current === 'hidden') {
        setState('default')
        stateRef.current = 'default'
        // Snap ring to cursor on first appearance
        ringX.current = e.clientX
        ringY.current = e.clientY
      }
    }

    const onLeave = () => {
      setState('hidden')
      stateRef.current = 'hidden'
    }

    const onEnter = () => {
      setState('default')
      stateRef.current = 'default'
    }

    const onPointerOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement
      const el = target.closest('[data-cursor]') as HTMLElement | null
      const type = el?.dataset.cursor ?? null

      let next: CursorState = 'default'
      if (type === 'project') next = 'hover_project'
      else if (type === 'video') next = 'hover_video'
      else if (type === 'drag') next = 'hover_drag'
      else if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button')
      ) {
        next = 'hover_link'
      }

      setState(next)
      stateRef.current = next
    }

    const loop = () => {
      const dot  = dotRef.current
      const ring = ringRef.current
      if (!dot || !ring) {
        frameRef.current = requestAnimationFrame(loop)
        return
      }

      ringX.current = lerp(ringX.current, mouseX.current, LERP_FACTOR)
      ringY.current = lerp(ringY.current, mouseY.current, LERP_FACTOR)

      dot.style.transform  = `translate(${mouseX.current}px, ${mouseY.current}px) translate(-50%, -50%)`
      ring.style.transform = `translate(${ringX.current}px, ${ringY.current}px) translate(-50%, -50%)`

      frameRef.current = requestAnimationFrame(loop)
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)
    document.addEventListener('pointerover', onPointerOver)

    frameRef.current = requestAnimationFrame(loop)

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      document.removeEventListener('pointerover', onPointerOver)
      cancelAnimationFrame(frameRef.current)
      document.documentElement.classList.remove('has-custom-cursor')
    }
  }, [])

  return (
    <div className={s.root} aria-hidden="true">
      <div
        ref={dotRef}
        className={`${s.dot} ${s[state]}`}
      />
      <div
        ref={ringRef}
        className={`${s.ring} ${s[state]}`}
      >
        <span ref={labelRef} className={s.label}>
          {state === 'hover_project' && 'View'}
          {state === 'hover_video'   && 'Play'}
          {state === 'hover_drag'    && 'Drag'}
        </span>
      </div>
    </div>
  )
}
