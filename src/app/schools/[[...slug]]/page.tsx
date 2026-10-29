import type { Metadata } from 'next';
import { parseSchoolsSeoQuery } from '@/lib/schoolsSeoParser';
import { fetchSchoolsForDirectory, getSchoolBySlugOrUdise } from '@/integrations/supabase/schoolsDirectoryDb';
import dynamic from 'next/dynamic';

const SchoolsDirectoryClient = dynamic(
  () => import('@/components/schools/SchoolsDirectoryClient'),
  { ssr: false }
);
const SchoolProfilePageClient = dynamic(
  () => import('@/components/schools/profile/SchoolProfilePageClient'),
  { ssr: false }
);

export const revalidate = 60;

export async function generateMetadata({
  params,
  searchParams
}: {
  params?: Promise<{ slug?: string[] }> | { slug?: string[] };
  searchParams?: Promise<Record<string, string | string[] | undefined>> | Record<string, string | string[] | undefined>;
}): Promise<Metadata> {
  const resolvedParams = params ? await Promise.resolve(params) : {};
  const resolvedSearchParams = searchParams ? await Promise.resolve(searchParams) : {};
  const segments = resolvedParams?.slug || [];

  // Check if this is an individual school profile
  if (segments.length >= 1) {
    const lastSegment = segments[segments.length - 1];
    const school = getSchoolBySlugOrUdise(lastSegment) || (segments.length > 1 ? getSchoolBySlugOrUdise(segments[0]) : null);
    if (school) {
      const name = school.school_name || school.name || 'School';
      const city = school.district_name || school.city || '';
      const state = school.state_name || school.state || '';
      const board = school.board || 'CBSE';
      return {
        title: `${name}, ${city} - Fees, Admissions, Board Results & Reviews | CSEEL`,
        description: `Complete verified profile of ${name}, ${city}, ${state}. Check ${board} affiliation, annual fee structure, 10th & 12th board results, ATL lab facilities, and parent reviews.`,
        alternates: {
          canonical: `https://www.cseel.org/schools/${segments.join('/')}`,
        },
        openGraph: {
          title: `${name} (${board}) - Fees, Results & Reviews`,
          description: `Explore ${name} in ${city}, ${state}. Verified fees, board results, facilities, and admissions open.`,
          url: `https://www.cseel.org/schools/${segments.join('/')}`,
          siteName: 'CSEEL',
          images: [{ url: school.image || 'https://www.cseel.org/images/cseel-schools-preview.jpg' }],
        },
      };
    }
  }

  const parsed = parseSchoolsSeoQuery(segments, resolvedSearchParams);

  return {
    title: parsed.pageTitle,
    description: parsed.metaDescription,
    alternates: {
      canonical: parsed.canonicalUrl
    },
    openGraph: {
      title: parsed.pageTitle,
      description: parsed.metaDescription,
      url: parsed.canonicalUrl,
      siteName: 'CSEEL - Center for Scientific Exploration & Experiential Learning',
      locale: 'en_IN',
      type: 'website',
      images: [
        {
          url: 'https://www.cseel.org/images/cseel-schools-preview.jpg',
          width: 1200,
          height: 630,
          alt: parsed.pageTitle,
          type: 'image/jpeg',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: parsed.pageTitle,
      description: parsed.metaDescription,
      images: ['https://www.cseel.org/images/cseel-schools-preview.jpg'],
      creator: '@cseel_org',
      site: '@cseel_org',
    },
  };
}

export default async function SchoolsDirectoryPage({
  params,
  searchParams
}: {
  params?: Promise<{ slug?: string[] }> | { slug?: string[] };
  searchParams?: Promise<Record<string, string | string[] | undefined>> | Record<string, string | string[] | undefined>;
}) {
  const resolvedParams = params ? await Promise.resolve(params) : {};
  const resolvedSearchParams = searchParams ? await Promise.resolve(searchParams) : {};
  const segments = resolvedParams?.slug || [];

  // 1. If slug points to an individual school profile, render dedicated SchoolProfilePageClient
  if (segments.length >= 1) {
    const lastSegment = segments[segments.length - 1];
    const matchedSchool = getSchoolBySlugOrUdise(lastSegment) || (segments.length > 1 ? getSchoolBySlugOrUdise(segments[0]) : null);
    if (matchedSchool) {
      return <SchoolProfilePageClient school={matchedSchool} />;
    }
  }

  // 2. Otherwise render the Directory & Map Search Page
  const parsedQuery = parseSchoolsSeoQuery(segments, resolvedSearchParams);
  const directoryData = await fetchSchoolsForDirectory(parsedQuery);

  // Hyper-Local Schema.org Graph for Schools Directory
  const jsonLdGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${parsedQuery.canonicalUrl}#page`,
        name: parsedQuery.pageTitle,
        description: parsedQuery.metaDescription,
        url: parsedQuery.canonicalUrl,
        isPartOf: {
          '@type': 'WebSite',
          '@id': 'https://www.cseel.org/#website',
          name: 'CSEEL',
          url: 'https://www.cseel.org',
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${parsedQuery.canonicalUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://www.cseel.org',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Schools Directory',
            item: 'https://www.cseel.org/schools',
          },
          ...(parsedQuery.state ? [{
            '@type': 'ListItem',
            position: 3,
            name: parsedQuery.state,
            item: `https://www.cseel.org/schools/${parsedQuery.state.toLowerCase().replace(/\s+/g, '-')}`,
          }] : []),
        ],
      },
      {
        '@type': 'ItemList',
        '@id': `${parsedQuery.canonicalUrl}#itemlist`,
        name: parsedQuery.pageTitle,
        numberOfItems: directoryData.totalCount,
        itemListElement: directoryData.schools.slice(0, 15).map((school, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          item: {
            '@type': ['School', 'EducationalOrganization', 'LocalBusiness'],
            name: school.school_name || school.name,
            address: {
              '@type': 'PostalAddress',
              streetAddress: school.address || '',
              addressLocality: school.district_name || school.city || '',
              addressRegion: school.state_name || school.state || '',
              postalCode: school.pincode || undefined,
              addressCountry: 'IN',
            },
            ...(school.latitude && school.longitude ? {
              geo: {
                '@type': 'GeoCoordinates',
                latitude: school.latitude,
                longitude: school.longitude,
              }
            } : {}),
            telephone: school.phone || undefined,
            url: school.website || `https://www.cseel.org/schools`,
            ...(school.rating ? {
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: String(school.rating),
                reviewCount: '1',
              }
            } : {}),
          },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
      />
      <SchoolsDirectoryClient initialData={directoryData} />
    </>
  );
}
