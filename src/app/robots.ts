import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/api/',
        '/_next/',
        '/downloads/',
      ],
    },
    sitemap: 'https://dailit.com/sitemap.xml',
    host: 'https://dailit.com',
  }
} 
 
 
 
 