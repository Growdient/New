'use client'

/**
 * GROWDIENT IX3 — GSAP Animation Engine
 *
 * Direct port of Webflow IX3 animation data extracted from:
 * cdn.prod.website-files.com/…/webflow.schunk.a697ed20fd2657f6.js
 *
 * Ease index map (from IX3 source):
 * 0=none  1=power1.in  2=power1.out  3=power1.inOut
 * 4=power2.in  5=power2.out  6=power2.inOut
 * 7=power3.in  8=power3.out  9=power3.inOut
 * 10=power4.in  11=power4.out  12=power4.inOut
 * 13=back.in  14=back.out  15=back.inOut
 * 16=bounce.in  17=bounce.out  18=bounce.inOut
 * 19=circ.in  20=circ.out  21=circ.inOut
 * 22=elastic.in  23=elastic.out  24=elastic.inOut
 * 25=expo.in  26=expo.out  27=expo.inOut
 * 28=sine.in  29=sine.out  30=sine.inOut
 *
 * HTML attributes used as animation targets (must match Webflow markup):
 *   [text-left]        — slides in from right on load
 *   [text-right]       — slides in from left on load
 *   [text="reveal"]    — char-by-char scroll reveal
 *   [animate="opacity"]— opacity reveal on scroll (inside .wrap-home-about)
 *   [animate="link"]   — hover: chars shift up
 *   [button]           — hover: split-text button effect
 *   [button-text]      — child of [button]: the text chars layer
 *   [button-bg]        — child of [button]: bg element
 *   [button-icon-right]— child of [button]: right icon
 *   [button-icon-left] — child of [button]: left icon
 *   [cms-overlay]      — child of .card-project: hover overlay
 *   [cms-image]        — child of .card-project: hover image scale
 */

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

// ─── Helpers ──────────────────────────────────────────────────────────────────

function q(selector: string): Element[] {
  return Array.from(document.querySelectorAll(selector))
}

function qs(selector: string): Element | null {
  return document.querySelector(selector)
}

function isMobile(): boolean {
  return window.matchMedia('(pointer: coarse)').matches
}

// AbortController для снятия всех event listener при destroy
let _controller: AbortController | null = null

// Tracks all SplitText instances created by IX3 so we can revert them on destroy
const _splits: SplitText[] = []

// ─── PAGE LOAD animations ─────────────────────────────────────────────────────

/**
 * t-aa2b9bf8: triggered by wf:load
 * .video-home-hero  scale 0.95→1, 0.75s, sine.out
 * .nav-wrap-animation  y -100%→0%, delay 0.25s, power1.out
 */
function initPageLoad() {
  const tl = gsap.timeline()

  const heroVideo = q('.video-home-hero')
  if (heroVideo.length) {
    tl.from('.video-home-hero', {
      scale: 0.95,
      duration: 0.75,
      ease: 'sine.out',
    })
  }

  const navWrap = q('.nav-wrap-animation')
  if (navWrap.length) {
    tl.from(
      '.nav-wrap-animation',
      {
        y: '-100%',
        ease: 'power1.out',
      },
      0.25
    )
  }
}

/**
 * t-b4215414: triggered by wf:load
 * .image-wrap-about-hero.background children  scale 0→1, 0.75s, sine.in, stagger
 * [text-left]  x 100px→0, power2.in
 * [text-right]  x -100px→0, power2.in
 */
function initHeroEntrance() {
  const bgChildren = q('.image-wrap-about-hero.background > *')
  if (bgChildren.length) {
    gsap.from(bgChildren, {
      scale: 0,
      duration: 0.75,
      ease: 'sine.in',
      stagger: { each: 0.1 },
    })
  }

  const textLeft = q('[text-left]')
  if (textLeft.length) {
    gsap.from(textLeft, {
      x: '100px',
      ease: 'power2.in',
      clearProps: 'x',
    })
  }

  const textRight = q('[text-right]')
  if (textRight.length) {
    gsap.from(textRight, {
      x: '-100px',
      ease: 'power2.in',
      clearProps: 'x',
    })
  }
}

/**
 * t-c6d0eaca: wf:load — marquee right (loop)
 * .marquee-text.right  x -50%→50%, 15s, repeat -1, linear
 *
 * t-ab2dbf6f: wf:load — marquee left (loop)
 * .marquee-text.left  x 0%→-100%, 15s, repeat -1, linear
 *
 * t-bb37efa6: wf:load — marquee images (loop)
 * .marquee-images  x 0%→-100%, 15s, repeat -1, linear
 */
function initMarquees() {
  const marqueeRight = q('.marquee-text.right')
  if (marqueeRight.length) {
    gsap.fromTo(
      marqueeRight,
      { x: '-50%' },
      { x: '50%', duration: 15, repeat: -1, ease: 'none' }
    )
  }

  const marqueeLeft = q('.marquee-text.left')
  if (marqueeLeft.length) {
    gsap.fromTo(
      marqueeLeft,
      { x: '0%' },
      { x: '-100%', duration: 15, repeat: -1, ease: 'none' }
    )
  }

  const marqueeImages = q('.marquee-images')
  if (marqueeImages.length) {
    gsap.fromTo(
      marqueeImages,
      { x: '0%' },
      { x: '-100%', duration: 15, repeat: -1, ease: 'none' }
    )
  }
}

// ─── SCROLL animations ────────────────────────────────────────────────────────

/**
 * t-b3c72abb / i-6f899059:
 * scroll trigger: [text="reveal"], start "top 80%", no scrub, play once
 * splitText chars: y 100%→0px, opacity 0→100%, 0.6s, stagger amount 0.5, power1.inOut
 */
function initTextReveal() {
  const mobile = isMobile()
  q('[text="reveal"]').forEach((el) => {
    if (mobile) {
      gsap.killTweensOf(el)
      gsap.set(el, { clearProps: 'y,opacity' })
      gsap.from(el, {
        y: 20, opacity: 0, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
      })
      return
    }
    const split = new SplitText(el, { type: 'chars' })
    _splits.push(split)
    gsap.from(split.chars, {
      y: '100%', opacity: 0, duration: 0.6,
      stagger: { amount: 0.5 }, ease: 'power1.inOut',
      scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom top', toggleActions: 'play none none none' },
      onComplete: () => {
        split.revert()
        const i = _splits.indexOf(split)
        if (i !== -1) _splits.splice(i, 1)
      },
    })
  })
}

/**
 * t-71596591 / i-bc381795:
 * scroll trigger: .text-track-about, scrub 0.8, top bottom → bottom center
 * splitText chars: opacity 32%→100%, 0.25s, stagger each 0.1, linear
 */
function initTextTrackAbout() {
  const mobile = isMobile()
  q('.text-track-about').forEach((el) => {
    if (mobile) {
      gsap.set(el, { clearProps: 'opacity' })
      gsap.fromTo(el, { opacity: 0.4 }, {
        opacity: 1, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
      })
      return
    }
    const split = new SplitText(el, { type: 'chars' })
    _splits.push(split)
    gsap.fromTo(split.chars, { opacity: 0.32 }, {
      opacity: 1, duration: 0.25, stagger: { each: 0.1 }, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom center', scrub: 0.8 },
    })
  })
}

/**
 * t-a26d0276 / i-f0201c7a:
 * scroll trigger: .track-hero, scrub 0.8, top bottom → bottom bottom
 * .image-wrap-about-hero.background: width/height 0→100%
 * [text-left]: x current→-50vw
 * [text-right]: x current→50vw
 * .overlay-about-image: opacity current→100%, position 0.2
 */
function initTrackHeroParallax() {
  const trigger = qs('.track-hero')
  if (!trigger) return

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger,
      start: 'top bottom',
      end: 'bottom bottom',
      scrub: 0.8,
    },
  })

  const bg = q('.image-wrap-about-hero.background')
  if (bg.length) {
    tl.fromTo(bg, { width: '0%', height: '0%' }, { width: '100%', height: '100%', duration: 0.25, ease: 'none' }, 0)
  }

  const textLeft = q('[text-left]')
  if (textLeft.length) {
    tl.to(textLeft, { x: '-50vw', duration: 0.1, ease: 'none' }, 0)
  }

  const textRight = q('[text-right]')
  if (textRight.length) {
    tl.to(textRight, { x: '50vw', duration: 0.1, ease: 'none' }, 0)
  }

  const overlay = q('.overlay-about-image')
  if (overlay.length) {
    tl.to(overlay, { opacity: 1, duration: 0.25, ease: 'none' }, 0.2)
  }
}

/**
 * t-c0c0bfdb / i-fc78167b:
 * scroll trigger: .wrap-home-about, scrub 0.8, top bottom → bottom center
 * descendants [animate="opacity"]: splitText chars, opacity 32%→100%, stagger each 0.1, linear
 */
function initWrapHomeAbout() {
  const mobile = isMobile()
  q('.wrap-home-about').forEach((section) => {
    const targets = Array.from(section.querySelectorAll('[animate="opacity"]'))
    if (!targets.length) return

    targets.forEach((el) => {
      if (mobile) {
        gsap.set(el, { clearProps: 'opacity' })
        gsap.fromTo(el, { opacity: 0.4 }, {
          opacity: 1, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
        })
        return
      }
      const split = new SplitText(el, { type: 'chars' })
      _splits.push(split)
      gsap.fromTo(split.chars, { opacity: 0.32 }, {
        opacity: 1, duration: 0.25, stagger: { each: 0.1 }, ease: 'none',
        scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom center', scrub: 0.8 },
      })
    })
  })
}

// ─── HOVER animations ─────────────────────────────────────────────────────────

/**
 * t-cbbbc56a / i-0daf594b:
 * hover .link-contact → .overlay-contact opacity →100% 0.2s linear
 *                      → .line-contact-link width →100% 0.4s power1.inOut
 * reverse at speed 1.5
 */
function initContactLinkHover(signal: AbortSignal) {
  q('.link-contact').forEach((link) => {
    const overlay = link.querySelector('.overlay-contact')
    const line = link.querySelector('.line-contact-link')

    const tl = gsap.timeline({ paused: true })
    if (overlay) tl.to(overlay, { opacity: 1, duration: 0.2, ease: 'none' }, 0)
    if (line) tl.to(line, { width: '100%', duration: 0.4, ease: 'power1.inOut' }, 0)

    link.addEventListener('mouseenter', () => tl.play(), { signal })
    link.addEventListener('mouseleave', () => tl.reverse().timeScale(1.5), { signal })
  })
}

/**
 * t-8b0b4c90 / i-591de808:
 * hover .card-project → [cms-overlay] opacity 0→100% 0.3s sine.inOut
 *                     → [cms-image] scale 1→1.1 0.4s sine.inOut
 */
function initProjectCardHover(signal: AbortSignal) {
  q('.card-project').forEach((card) => {
    const overlay = card.querySelector('[cms-overlay]')
    const image = card.querySelector('[cms-image]')

    const tl = gsap.timeline({ paused: true })
    if (overlay) tl.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'sine.inOut' }, 0)
    if (image) tl.fromTo(image, { scale: 1 }, { scale: 1.1, duration: 0.4, ease: 'sine.inOut' }, 0)

    card.addEventListener('mouseenter', () => tl.play(), { signal })
    card.addEventListener('mouseleave', () => tl.reverse(), { signal })
  })
}

/**
 * t-bcb55b6b / i-7b621c8f:
 * hover .nav-link → siblings opacity 100%→32% 0.4s power2.inOut
 * reverse at speed 3
 */
function initNavLinkHover(signal: AbortSignal) {
  const navLinks = q('.nav-link')
  navLinks.forEach((link) => {
    link.addEventListener('mouseenter', () => {
      const siblings = navLinks.filter((l) => l !== link)
      gsap.to(siblings, { opacity: 0.32, duration: 0.4, ease: 'power2.inOut' })
    }, { signal })
    link.addEventListener('mouseleave', () => {
      gsap.to(navLinks, { opacity: 1, duration: 0.4 / 3, ease: 'power2.inOut' })
    }, { signal })
  })
}

/**
 * t-54d9f922 / i-6a8fdf73:
 * click .menu-button (odd=open, even=close, speed 2x reverse)
 * .nav-menu: opacity →100%, display block, 0.2s power1.in
 * .menu-divider: width 0→100%, stagger each 0.1, power1.inOut
 * .nav-link: y 100%→0%, stagger each 0.1, power1.inOut, splitText words mask
 */
function initMenuToggle() {
  const btn = qs('.menu-button')
  const menu = qs('.nav-menu')
  if (!btn || !menu) return

  const dividers = q('.menu-divider')
  const navLinks = q('.nav-link')

  // SplitText with word masking for nav links
  const splits = navLinks.map((el) =>
    new SplitText(el, { type: 'words', mask: 'words' })
  )
  const wordEls = splits.flatMap((s) => s.words)

  const tl = gsap.timeline({ paused: true })
  tl.set(menu, { display: 'block' })
  tl.to(menu, { opacity: 1, duration: 0.2, ease: 'power1.in' }, 0)
  tl.fromTo(dividers, { width: '0%' }, { width: '100%', stagger: { each: 0.1 }, ease: 'power1.inOut' }, 0)
  tl.fromTo(wordEls, { y: '100%' }, { y: '0%', stagger: { each: 0.1 }, ease: 'power1.inOut' }, 0)

  let open = false
  btn.addEventListener('click', () => {
    if (!open) {
      tl.timeScale(1).play()
    } else {
      tl.timeScale(2).reverse()
    }
    open = !open
  }, { signal: _controller?.signal })
}

/**
 * t-f1ebb27d / i-6dd96aa6:
 * hover .footer-middle-link → .overlay-hover-footer opacity 0→100% display flex 0.25s power1.inOut
 *                           → .line-footer-link width 100%→0% 0.25s power1.inOut
 */
function initFooterLinkHover(signal: AbortSignal) {
  q('.footer-middle-link').forEach((link) => {
    const overlay = link.querySelector('.overlay-hover-footer')
    const line = link.querySelector('.line-footer-link')

    const tl = gsap.timeline({ paused: true })
    if (overlay) {
      tl.set(overlay, { display: 'flex' })
      tl.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power1.inOut' }, 0)
    }
    if (line) tl.fromTo(line, { width: '100%' }, { width: '0%', duration: 0.25, ease: 'power1.inOut' }, 0)

    link.addEventListener('mouseenter', () => tl.play(), { signal })
    link.addEventListener('mouseleave', () => tl.reverse(), { signal })
  })
}

/**
 * t-d8ea3a7e / i-7f94f464:
 * hover [button] → [button-text] y →-1.5em, 0.635s, stagger amount 0.1, power4.inOut, splitText chars
 *               → [button-bg] scale →0.95, sine.inOut
 *               → [button-icon-right] x →100%, 0.635s, sine.inOut
 *               → [button-icon-left] x →-100%, 0.635s, sine.inOut
 */
function initButtonHover(signal: AbortSignal) {
  q('[button]').forEach((btn) => {
    const textEl = btn.querySelector('[button-text]')
    const bg = btn.querySelector('[button-bg]')
    const iconRight = btn.querySelector('[button-icon-right]')
    const iconLeft = btn.querySelector('[button-icon-left]')

    let split: SplitText | null = null
    if (textEl) {
      split = new SplitText(textEl, { type: 'chars' })
    }

    const tl = gsap.timeline({ paused: true })

    if (split?.chars.length) {
      tl.to(split.chars, {
        y: '-1.5em',
        duration: 0.635,
        stagger: { amount: 0.1 },
        ease: 'power4.inOut',
      }, 0)
    }
    if (bg) tl.to(bg, { scale: 0.95, ease: 'sine.inOut' }, 0)
    if (iconRight) tl.to(iconRight, { x: '100%', duration: 0.635, ease: 'sine.inOut' }, 0)
    if (iconLeft) tl.to(iconLeft, { x: '-100%', duration: 0.635, ease: 'sine.inOut' }, 0)

    btn.addEventListener('mouseenter', () => tl.play(), { signal })
    btn.addEventListener('mouseleave', () => tl.reverse(), { signal })
  })
}

/**
 * t-cc8b87ca / i-b59a4c15:
 * hover [animate="link"] → splitText chars y →-1.25em, 0.45s, stagger amount 0.45, power2.inOut
 */
function initAnimateLinkHover(signal: AbortSignal) {
  q('[animate="link"]').forEach((el) => {
    const split = new SplitText(el, { type: 'chars' })

    const tl = gsap.timeline({ paused: true })
    tl.to(split.chars, {
      y: '-1.25em',
      duration: 0.45,
      stagger: { amount: 0.45 },
      ease: 'power2.inOut',
    })

    el.addEventListener('mouseenter', () => tl.play(), { signal })
    el.addEventListener('mouseleave', () => tl.reverse(), { signal })
  })
}

// ─── MAIN SETUP ───────────────────────────────────────────────────────────────

/**
 * Call once after DOM is ready (e.g. in a useEffect or 'DOMContentLoaded').
 * Pass a Lenis instance if available for ScrollTrigger integration.
 */
export function setupIX3Animations(lenis?: { on: (event: string, cb: (e: { actualDelta: number }) => void) => void }) {
  // Abort any previous listeners before re-setup
  _controller?.abort()
  _controller = new AbortController()
  const { signal } = _controller

  // Connect Lenis → ScrollTrigger
  if (lenis) {
    lenis.on('scroll', (e: { actualDelta: number }) => {
      ScrollTrigger.update()
    })
  }

  // Page load
  initPageLoad()
  initHeroEntrance()
  initMarquees()

  // Scroll
  initTextReveal()
  initTextTrackAbout()
  initTrackHeroParallax()
  initWrapHomeAbout()

  // Hover / interaction
  initContactLinkHover(signal)
  initProjectCardHover(signal)
  initNavLinkHover(signal)
  initMenuToggle()
  initFooterLinkHover(signal)
  initButtonHover(signal)
  initAnimateLinkHover(signal)

  // Refresh all scroll triggers after setup
  ScrollTrigger.refresh()
}

/**
 * Kill all animations and ScrollTriggers (call on route change / unmount).
 */
export function destroyIX3Animations() {
  _controller?.abort()
  _controller = null

  // Revert any active SplitText splits so elements return to original HTML.
  // This prevents double-splitting and stale char inline styles on re-init.
  _splits.forEach((s) => {
    try { s.revert() } catch (_) { /* element may already be gone */ }
  })
  _splits.length = 0

  ScrollTrigger.getAll().forEach((t) => t.kill())

  // normalizeScroll creates an internal ScrollTrigger — it was just killed above.
  // Re-enable immediately so scrub animations created by the next page work on iOS.
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    ScrollTrigger.normalizeScroll(true)
  }
}
