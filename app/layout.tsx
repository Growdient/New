import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { fontRaveoDisplay, fontInstrumentSerif, fontGeistMono, fontInter } from '@/lib/fonts'
import SiteShell from '@/components/layout/SiteShell'
import '@/styles/globals.css'

const GA_ID = 'G-LE145KW7TX'

export const metadata: Metadata = {
  metadataBase: new URL('https://growdient.com'),
  title: {
    default: 'Growdient Studio — Brand Identity, UI/UX, Web Development',
    template: '%s — Growdient Studio',
  },
  description:
    'Growdient is a design studio turning brand identity design and web development into value. Operating worldwide from Lisbon & Kyiv.',
  keywords: ['branding', 'UI/UX design', 'web development', 'brand identity', 'design studio'],
  authors: [{ name: 'Growdient Studio' }],
  creator: 'Growdient Studio',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://growdient.com',
    siteName: 'Growdient Studio',
    title: 'Growdient Studio — Brand Identity, UI/UX, Web Development',
    description:
      'Growdient is a design studio turning brand identity design and web development into value.',
    images: [
      {
        url: '/assets/OG.jpg',
        width: 1200,
        height: 630,
        alt: 'Growdient Studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Growdient Studio',
    description: 'Brand Identity, UI/UX, Web Development',
    images: ['/assets/OG.jpg'],
  },
  verification: {
    google: 'Uoh2xXX3za982jd4Vub9PUPtz-avZt28cbOmt70j4fg',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport: Viewport = {
  themeColor: '#0C0C0C',
  width: 'device-width',
  initialScale: 1,
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={[
        fontRaveoDisplay.variable,
        fontInstrumentSerif.variable,
        fontGeistMono.variable,
        fontInter.variable,
      ].join(' ')}
    >
      <body>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  )
}
