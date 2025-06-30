import type { Metadata } from "next";
import "./globals.css";
import PWAWrapper from "@/components/PWAWrapper";

export const metadata: Metadata = {
  title: "Dail it - Simple Business Phone System",
  description: "Transform your business communications with Dail it's simple, powerful phone system. Get professional features, DailQ AI automation, and seamless integrations.",
  keywords: "business phone system, VoIP, DailQ AI, call center, unified messaging, business communications, phone service",
  authors: [{ name: "Dail it" }],
  creator: "Dail it",
  publisher: "Dail it",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { url: '/icon.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/icon.svg',
    apple: [
      { url: '/icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  openGraph: {
    title: "Dail it - Simple Business Phone System",
    description: "Transform your business communications with Dail it's simple, powerful phone system.",
    url: "https://dailit.com",
    siteName: "Dail it",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Dail it - Simple Business Phone System",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dail it - Simple Business Phone System",
    description: "Transform your business communications with Dail it's simple, powerful phone system.",
    images: ["/og-image.png"],
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
  verification: {
    google: 'your-google-verification-code',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Dail it',
    startupImage: '/icon.png',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'Dail it',
    'msapplication-TileColor': '#101828',
    'msapplication-config': '/browserconfig.xml',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cal+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <meta name="theme-color" content="#101828" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Dail it" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="Dail it" />
        <meta name="msapplication-TileColor" content="#101828" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className="antialiased">
        <PWAWrapper>
          {children}
        </PWAWrapper>
      </body>
    </html>
  );
} 