import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  // Primary SEO Meta Tags
  title: 'Daanistan - Free Notes & Past Papers Class 9, 10, 11, 12 | FBISE, KPK & Punjab Board',
  description: 'Download free educational notes, past papers, solved exercises & study materials for Class 9th, 10th, 11th & 12th. Complete resources for FBISE, KPK Board, Punjab Board students. Get exam preparation materials, chapter-wise notes, and previous year papers.',
  
  // Keywords for Search Engines
  keywords: [
    'Daanistan',
    'free notes class 9',
    'free notes class 10', 
    'free notes class 11',
    'free notes class 12',
    'FBISE notes',
    'KPK board notes',
    'Punjab board notes',
    'past papers Pakistan',
    'matric notes',
    'inter notes',
    'FSc notes',
    'SSC notes',
    'HSSC notes',
    'chapter wise notes',
    'solved past papers',
    'exam preparation Pakistan',
    'study material Pakistan',
    'educational notes Pakistan',
    'board exam notes',
    'Federal Board notes',
    'Peshawar board notes',
    'Lahore board notes',
    'free study resources Pakistan'
  ].join(', '),
  
  // Author and Publisher
  authors: [{ name: 'Daanistan Education' }],
  creator: 'Daanistan',
  publisher: 'Daanistan',
  
  // Verification
  verification: {
    google: 'hw_SUpIYqf9iSRoPQHRsrDy8jOtlMWar1OSxiItQK3o',
  },
  
  // Open Graph Meta Tags (for Facebook, LinkedIn, etc.)
  openGraph: {
    type: 'website',
    locale: 'en_PK',
    url: 'https://daanistan.com',
    siteName: 'Daanistan',
    title: 'Daanistan - Free Educational Notes & Past Papers for All Pakistan Boards',
    description: 'Download free notes and past papers for Class 9-12. Complete study materials for FBISE, KPK Board & Punjab Board students.',
    images: [
      {
        url: 'https://daanistan.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Daanistan - Your Learning Companion',
      }
    ],
  },
  
  // Twitter Card Meta Tags
  twitter: {
    card: 'summary_large_image',
    site: '@daanistan',
    creator: '@daanistan',
    title: 'Daanistan - Free Notes & Past Papers for Pakistani Students',
    description: 'Complete study materials for Class 9, 10, 11, 12 | FBISE, KPK & Punjab Boards',
    images: ['https://daanistan.com/twitter-image.jpg'],
  },
  
  // Robots Meta Tag
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
  
  // Canonical URL
  alternates: {
    canonical: 'https://daanistan.com',
  },
  
  // Additional Meta Tags
  category: 'Education',
  classification: 'Educational Resources',
  
  // App-specific metadata
  applicationName: 'Daanistan',
  
  // Viewport
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  
  // Theme Color
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fbbf24' },
    { media: '(prefers-color-scheme: dark)', color: '#1f2937' }
  ],
  
  // Manifest
  manifest: '/manifest.json',
  
  // Icons
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  
  // Other metadata
  other: {
    'geo.region': 'PK',
    'geo.placename': 'Pakistan',
    'language': 'English',
    'coverage': 'Pakistan',
    'distribution': 'global',
    'rating': 'general',
    'revisit-after': '7 days',
  }
}

// JSON-LD Structured Data for Rich Snippets
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'Daanistan',
  description: 'Free educational notes and past papers for Pakistani students',
  url: 'https://daanistan.com',
  logo: 'https://daanistan.com/logo.png',
  sameAs: [
    'https://facebook.com/daanistan',
    'https://instagram.com/daanistan',
    'https://twitter.com/daanistan',
    'https://youtube.com/daanistan',
    'https://linkedin.com/company/daanistan'
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Service',
    areaServed: 'PK',
    availableLanguage: ['English', 'Urdu']
  },
  areaServed: {
    '@type': 'Country',
    name: 'Pakistan'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-PK">
      <body className={inter.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  )
}