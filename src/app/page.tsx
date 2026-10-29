import type { Metadata } from 'next';
import { parseSchoolsSeoQuery } from '@/lib/schoolsSeoParser';
import { fetchSchoolsForDirectory } from '@/integrations/supabase/schoolsDirectoryDb';
import SchoolsDirectoryClient from '@/components/schools/SchoolsDirectoryClient';

export const revalidate = 60;

export async function generateMetadata({
  searchParams
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>> | Record<string, string | string[] | undefined>;
}): Promise<Metadata> {
  const resolvedSearchParams = searchParams ? await Promise.resolve(searchParams) : {};
  const parsed = parseSchoolsSeoQuery([], resolvedSearchParams);

  return {
    title: parsed.pageTitle || 'CBSE Schools in India | Search 33,000+ Verified Private & Public Schools',
    description: parsed.metaDescription || 'Search, compare, and explore 33,000+ CBSE, ICSE, and top private schools across India with verified facilities, student-teacher ratios, fees, and admission details.',
    alternates: {
      canonical: 'https://school.cseel.org',
    },
    openGraph: {
      title: 'CBSE Schools Directory — CSEEL',
      description: 'Find top CBSE schools in India. Detailed verified infrastructure, fee estimates, board results, and direct campus connect.',
      url: 'https://school.cseel.org',
      siteName: 'CSEEL CBSE Schools Directory',
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'CBSE Schools Directory — CSEEL',
      description: 'Explore 33,000+ CBSE schools across India.',
      creator: '@cseel_org',
    },
  };
}

export default async function HomePage({
  searchParams
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>> | Record<string, string | string[] | undefined>;
}) {
  const resolvedSearchParams = searchParams ? await Promise.resolve(searchParams) : {};
  const parsedQuery = parseSchoolsSeoQuery([], resolvedSearchParams);
  const directoryData = await fetchSchoolsForDirectory(parsedQuery);

  const jsonLdGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://school.cseel.org/#website',
        name: 'CSEEL CBSE Schools Directory',
        url: 'https://school.cseel.org',
        description: '33,000+ verified CBSE schools directory with infrastructure, ratings, and admission details.',
      },
      {
        '@type': 'CollectionPage',
        '@id': 'https://school.cseel.org/#page',
        name: parsedQuery.pageTitle,
        description: parsedQuery.metaDescription,
        url: 'https://school.cseel.org',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
      />
      <SchoolsDirectoryClient initialData={directoryData} query={parsedQuery} />
    </>
  );
}
