import type { Metadata, Viewport } from 'next';
import { AuthProvider } from '@/contexts/AuthContext';
import SchoolHeader from '@/components/layout/SchoolHeader';
import SchoolFooter from '@/components/layout/SchoolFooter';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#005689',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://school.cseel.org'),
  title: {
    default: 'CBSE Schools in India | 33,000+ Verified Private & Public Schools',
    template: '%s | CBSE Schools Directory',
  },
  description:
    'Search, explore, and compare 33,000+ CBSE schools across India. Verified UDISE+ infrastructure, student-teacher ratios, smart labs, fees, and direct admission inquiries.',
  keywords: [
    'CBSE Schools',
    'CBSE Schools in India',
    'Best CBSE Schools Delhi NCR',
    'CBSE School Admissions 2026-27',
    'CBSE Affiliated Schools List',
    'UDISE School Directory',
    'CSEEL School Directory',
  ],
  authors: [{ name: 'CSEEL Education Directory', url: 'https://school.cseel.org' }],
  creator: 'CSEEL',
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/images/cseel-logo.svg',
    apple: '/images/cseel-logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&family=Roboto:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-900">
        <AuthProvider>
          <SchoolHeader />
          <main className="flex-1 w-full">
            {children}
          </main>
          <SchoolFooter />
        </AuthProvider>
      </body>
    </html>
  );
}
