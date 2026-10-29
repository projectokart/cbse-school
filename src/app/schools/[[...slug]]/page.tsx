import type { Metadata } from 'next';
import { parseSchoolsSeoQuery } from '@/lib/schoolsSeoParser';
import { fetchSchoolsForDirectory } from '@/integrations/supabase/schoolsDirectoryDb';
import SchoolsDirectoryClient from '@/components/schools/SchoolsDirectoryClient';

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
