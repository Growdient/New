import Link from 'next/link'
import s from './Footer.module.css'

const NAV_LINKS = [
  { label: 'Work', href: '/projects' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
]

const SERVICE_LINKS = [
  { label: 'Brand Identity', href: '/projects' },
  { label: 'Web Design', href: '/projects' },
  { label: 'Web Development', href: '/projects' },
  { label: 'Motion Design', href: '/projects' },
]

const SOCIAL_LINKS = [
  { label: 'Behance', href: 'https://behance.net/growdient' },
  { label: 'Instagram', href: 'https://instagram.com/growdient' },
  { label: 'LinkedIn', href: 'https://linkedin.com/company/growdient' },
  { label: 'Awwwards', href: 'https://awwwards.com/growdient' },
]

const YEAR = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className={s.footer}>
      <div className={s.inner}>
        <div className={s.topRow}>
          <div className={s.brand}>
            <Link href="/" className={s.logoMark}>
              Growdient
            </Link>
            <p className={s.tagline}>
              Brand identity, UI/UX design and web development studio. Operating worldwide from Lisbon & Kyiv.
            </p>
          </div>

          <nav className={s.col} aria-label="Site navigation">
            <p className={s.colTitle}>Navigation</p>
            <ul className={s.colLinks}>
              {NAV_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className={s.colLink}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className={s.col}>
            <p className={s.colTitle}>Services</p>
            <ul className={s.colLinks}>
              {SERVICE_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className={s.colLink}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={s.col}>
            <p className={s.colTitle}>Follow</p>
            <ul className={s.colLinks}>
              {SOCIAL_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className={s.colLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={s.bottomRow}>
          <p className={s.copyright}>
            © {YEAR} Growdient Studio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
