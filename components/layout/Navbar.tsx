'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import s from './Navbar.module.css'

export default function Navbar() {
  const checkRef = useRef<HTMLInputElement>(null)

  // Body scroll lock synced to checkbox state
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    document.body.style.overflow = e.target.checked ? 'hidden' : ''
  }

  const closeMenu = () => {
    if (checkRef.current) checkRef.current.checked = false
    document.body.style.overflow = ''
  }

  useEffect(() => {
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <>
      {/* Visually hidden checkbox — the sole toggle mechanism.
          <label htmlFor> below triggers it natively: no JS needed,
          no pointer-events chain, nothing can block it on iOS. */}
      <input
        ref={checkRef}
        type="checkbox"
        id="nav-menu-toggle"
        className={s.navToggle}
        onChange={handleChange}
        aria-hidden="true"
        tabIndex={-1}
      />

      <header className={s.navbar}>
        <div className={s.inner}>
          <div className={s.pill}>

            <label
              htmlFor="nav-menu-toggle"
              className={s.hamburger}
              aria-label="Toggle menu"
            >
              <span className={s.bar} />
              <span className={s.bar} />
            </label>

            <Link href="/" className={s.logo} onClick={closeMenu} aria-label="Growdient">
              <Image
                src="/growdient-logo.svg"
                alt="Growdient"
                width={108}
                height={13}
                priority
                className={s.logoSvg}
              />
            </Link>

            <Link href="/contact" className={s.ctaButton}>
              Let&apos;s work
            </Link>
          </div>
        </div>
      </header>

      <div className={s.mobileMenu} aria-hidden="true">
        <nav className={s.mobileNavLinks}>
          <Link href="/projects" className={s.mobileNavLink} onClick={closeMenu}>Work</Link>
          <Link href="/about"    className={s.mobileNavLink} onClick={closeMenu}>About</Link>
          <Link href="/blog"     className={s.mobileNavLink} onClick={closeMenu}>Blog</Link>
          <Link href="/contact"  className={s.mobileNavLink} onClick={closeMenu}>Contact</Link>
        </nav>
        <p className={s.mobileFooter}>Kyiv · Lisbon</p>
      </div>
    </>
  )
}
