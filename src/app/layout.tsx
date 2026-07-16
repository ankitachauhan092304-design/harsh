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
  title: 'Whitestone Fincorp | Premium Loan Facilitator & Consultation Services',
  description: 'Whitestone Fincorp provides unsecured and secured loan facilitation, consultation, and comparing rates across India\'s top banking partners. Apply for Personal, Business, Home Loans, and LAP.',
  keywords: 'loan facilitation, loan consultation, personal loan, business loan, home loan, loan against property, credit score check, EMI calculator, fintech, Whitestone Fincorp',
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
  // Schema.org JSON-LD for local business/financial service
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FinancialService',
    'name': 'Whitestone Fincorp',
    'image': 'https://whitestonefincorp.com/og-image.jpg',
    '@id': 'https://whitestonefincorp.com/#corporate',
    'url': 'https://whitestonefincorp.com',
    'telephone': '+91-98249-75488',
    'priceRange': '$$',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': '207/21 WHITESTONE FINCORP, Opp. ADC Bank, RAKHIAL',
      'addressLocality': 'Ahmedabad',
      'postalCode': '380023',
      'addressCountry': 'IN',
    },
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
      'https://linkedin.com/company/whitestonefincorp'
    ]
  };

  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} ${dmsans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
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
