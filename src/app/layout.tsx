import type { Metadata } from 'next';
import { Inter, Poppins, DM_Sans } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ConversionWidgets from '@/components/ConversionWidgets';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

const dmsans = DM_Sans({
  variable: '--font-dmsans',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Whitestone Fincorp | Premium Loan Facilitator & Financial Consultant Gujarat',
  description: 'Whitestone Fincorp is the leading loan advisor and financial consultant in Gujarat. We facilitate Personal, Business, Home, Project Loans, and LAP at premium rates.',
  keywords: 'Personal Loan Gujarat, Business Loan Gujarat, Home Loan Gujarat, Loan Against Property Gujarat, Project Loan Gujarat, Financial Consultant Gujarat, Loan Advisor Gujarat, Whitestone Fincorp',
  metadataBase: new URL('https://whitestonefincorp.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Whitestone Fincorp | Premium Loan Facilitator & Consultation Services',
    description: 'Secure personal, business, and home loans at optimized rates through our trusted banking and financial institution partners.',
    url: 'https://whitestonefincorp.com',
    siteName: 'Whitestone Fincorp',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Whitestone Fincorp Loan Consultation',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Whitestone Fincorp | Premium Loan Facilitator',
    description: 'Compare and apply for loans across top partner banks with ease.',
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Schema.org JSON-LD graph representing connected LocalBusiness, FinancialService, and Organization
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://whitestonefincorp.com/#organization',
        'name': 'Whitestone Fincorp',
        'url': 'https://whitestonefincorp.com',
        'logo': {
          '@type': 'ImageObject',
          'url': 'https://whitestonefincorp.com/logo.svg',
          'caption': 'Whitestone Fincorp Logo'
        },
        'sameAs': [
          'https://facebook.com/whitestonefincorp',
          'https://linkedin.com/company/whitestonefincorp',
          'https://twitter.com/whitestonefincorp',
          'https://instagram.com/whitestonefincorp'
        ]
      },
      {
        '@type': ['FinancialService', 'LocalBusiness'],
        '@id': 'https://whitestonefincorp.com/#corporate',
        'name': 'Whitestone Fincorp',
        'image': 'https://whitestonefincorp.com/og-image.jpg',
        'url': 'https://whitestonefincorp.com',
        'telephone': '+91-98249-75488',
        'email': 'info@whitestonefincorp.com',
        'priceRange': '$$',
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': '207/21 WHITESTONE FINCORP, Opp. ADC Bank, RAKHIAL',
          'addressLocality': 'Ahmedabad',
          'addressRegion': 'Gujarat',
          'postalCode': '380023',
          'addressCountry': 'IN'
        },
        'geo': {
          '@type': 'GeoCoordinates',
          'latitude': 23.0246,
          'longitude': 72.6175
        },
        'areaServed': {
          '@type': 'State',
          'name': 'Gujarat'
        },
        'hasMap': 'https://maps.google.com/?q=Whitestone+Fincorp+Opp.+ADC+Bank,+Rakhial,+Ahmedabad',
        'openingHoursSpecification': {
          '@type': 'OpeningHoursSpecification',
          'dayOfWeek': [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday'
          ],
          'opens': '10:00',
          'closes': '19:00'
        },
        'sameAs': [
          'https://facebook.com/whitestonefincorp',
          'https://linkedin.com/company/whitestonefincorp',
          'https://twitter.com/whitestonefincorp',
          'https://instagram.com/whitestonefincorp',
          'https://maps.google.com/?q=Whitestone+Fincorp+Opp.+ADC+Bank,+Rakhial,+Ahmedabad'
        ],
        'parentOrganization': {
          '@id': 'https://whitestonefincorp.com/#organization'
        }
      }
    ]
  };

  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} ${dmsans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <meta name="google-site-verification" content="placeholder_google_verification_code" />
        <meta name="msvalidate.01" content="placeholder_bing_verification_code" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-inter bg-slate-50 text-slate-800" suppressHydrationWarning>
        <Header />
        <main className="flex-grow pt-[84px] md:pt-[116px]">
          {children}
        </main>
        <Footer />
        <ConversionWidgets />
      </body>
    </html>
  );
}
