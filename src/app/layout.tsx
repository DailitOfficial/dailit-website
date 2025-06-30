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
    ],
    shortcut: '/icon.svg',
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
    statusBarStyle: 'default',
    title: 'Dail it',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
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
        <meta name="theme-color" content="#101828" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Dail it" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="Dail it" />
        <meta name="msapplication-TileColor" content="#101828" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className="antialiased">
        <PWAWrapper>
          {children}
        </PWAWrapper>
      </body>
    </html>
  );
} 