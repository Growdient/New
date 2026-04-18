import type { Metadata } from 'next'
import ContactHero from '@/components/sections/ContactHero'

export const metadata: Metadata = {
  title: 'Contact — Growdient Studio',
  description:
    'We don\'t just reply to emails, we start conversations that shape ideas. Get in touch with Growdient Studio — Lisbon and Kyiv.',
  alternates: { canonical: 'https://growdient.com/contact' },
}

export default function ContactPage() {
  return (
    <main>
      <ContactHero />
    </main>
  )
}
