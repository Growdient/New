'use client'

import { useEffect, useRef } from 'react'
import s from './index.module.css'

export default function GrainOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef(0)
  const tickRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Touch devices: canvas is visually hidden via CSS and the rAF loop
    // generates 300K+ random pixels on the main thread every frame —
    // blocking scroll even when grain is invisible.
    if (window.matchMedia('(pointer: coarse)').matches) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0
    let imageData: ImageData | null = null

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
      imageData = ctx.createImageData(width, height)
    }

    const draw = () => {
      if (!imageData) return
      const data = imageData.data
      for (let i = 0; i < data.length; i += 4) {
        const v = (Math.random() * 255) | 0
        data[i]     = v
        data[i + 1] = v
        data[i + 2] = v
        data[i + 3] = 255
      }
      ctx.putImageData(imageData, 0, 0)
    }

    const loop = () => {
      tickRef.current++
      // Redraw every 2 frames — balance between smoothness and CPU cost
      if (tickRef.current % 2 === 0) draw()
      frameRef.current = requestAnimationFrame(loop)
    }

    resize()
    window.addEventListener('resize', resize, { passive: true })
    frameRef.current = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className={s.grain} aria-hidden="true" />
}
