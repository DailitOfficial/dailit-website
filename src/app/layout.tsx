import type { Metadata, Viewport } from 'next'
import '@/app/globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://dailit.com'),
  title: 'Dail it - Simple Business Communication Platform',
  description: 'Transform your business communications with Dail it. Professional phone systems, call centers, and AI-powered features made simple and affordable for businesses of all sizes.',
  keywords: [
    'business communication platform',
    'business phone system',
    'DailQ AI',
    'business communications',
    'call center software',
    'VoIP solutions',
    'unified communications',
    'small business phone',
    'startup communication',
    'affordable phone system'
  ],
  authors: [{ name: 'Dail it' }],
  creator: 'Dail it',
  publisher: 'Dail it',
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://dailit.com',
    title: 'Dail it - Simple Business Communication Platform',
    description: 'Transform your business communications with Dail it. Professional phone systems, call centers, and AI-powered features made simple and affordable.',
    siteName: 'Dail it',
    images: [
      {
        url: '/ai.png',
        width: 1200,
        height: 630,
        alt: 'Dail it - Business Communication Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dail it - Simple Business Communication Platform',
    description: 'Transform your business communications with Dail it. Professional phone systems, call centers, and AI-powered features made simple and affordable.',
    images: ['/ai.png'],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="antialiased" suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  )
} 