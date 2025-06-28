import type { Metadata } from "next";
import "./globals.css";

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
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
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
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
} 