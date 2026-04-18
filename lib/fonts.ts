import localFont from 'next/font/local'

export const fontRaveoDisplay = localFont({
  src: [
    {
      path: '../public/fonts/RaveoDisplay-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
  ],
  variable: '--font-raveo-display',
  display: 'swap',
  preload: true,
})

export const font42DotSans = localFont({
  src: [
    {
      path: '../public/fonts/42dotsans-light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/fonts/42dotsans-regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/42dotsans-medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/42dotsans-bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/42dotsans-extrabold.ttf',
      weight: '800',
      style: 'normal',
    },
  ],
  variable: '--font-42dotsans',
  display: 'swap',
  preload: true,
})

export const fontInstrumentSerif = localFont({
  src: [
    {
      path: '../public/fonts/InstrumentSerif-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/InstrumentSerif-Italic.ttf',
      weight: '400',
      style: 'italic',
    },
  ],
  variable: '--font-instrument-serif',
  display: 'swap',
  preload: true,
})

export const fontGeistMono = localFont({
  src: [
    {
      path: '../public/fonts/GeistMono-VariableFont_wght.ttf',
      weight: '100 900',
      style: 'normal',
    },
  ],
  variable: '--font-geist-mono',
  display: 'swap',
  preload: false,
})

export const fontInter = localFont({
  src: [
    {
      path: '../public/fonts/inter-regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/inter-500.woff2',
      weight: '500',
      style: 'normal',
    },
  ],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
})
