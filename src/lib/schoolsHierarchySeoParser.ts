import { KNOWN_STATES, DistrictCategoryDef, DISTRICT_25_CATEGORIES } from './schoolsSeoParser';

export interface HierarchySeoQuery {
  level: 'country' | 'state' | 'district' | 'block' | 'village' | 'profile';
  rawSegments: string[];
  canonicalUrl: string;
  pageTitle: string;
  metaDescription: string;
  h1Heading: string;
  breadcrumbs: { label: string; href: string }[];
  
  // Location hierarchy
  country: string;
  stateSlug?: string;
  stateName?: string;
  districtSlug?: string;
  districtName?: string;
  blockSlug?: string;
  blockName?: string;
  villageSlug?: string;
  villageName?: string;
  schoolSlug?: string;

  // Active SEO Intent Filter (if applicable)
  isIntentPage: boolean;
  intentCategory?: string;
  intentLabel?: string;
  
  // Filter values
  board?: string;
  management?: string;
  schoolCategory?: string;
  residential?: string;
  gender?: string;
  medium?: string;
  facility?: string;
  minStudents?: number;
  
  // Sorting & Pagination
  sortBy: string;
  page: number;
  limit: number;

  // Cross links & FAQs
  companionIntentPages: { label: string; href: string; category: string; priority: string }[];
  faqs: { question: string; answer: string }[];
  schemaJsonLd: Record<string, any>[];
}

// Format slug into clean display name (e.g. 'uttar-pradesh' -> 'Uttar Pradesh', 'kotputli-behror' -> 'Kotputli Behror')
export function slugToTitleCase(slug: string): string {
  if (!slug) return '';
  return slug
    .split('-')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// Format name into URL slug (e.g. 'Uttar Pradesh' -> 'uttar-pradesh')
export function nameToSlug(name: string): string {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-');
}

// Intent Slug Mapping (Recognizes both exact slug e.g. 'best-schools' and suffixed e.g. 'best-schools-in-lucknow')
interface IntentRule {
  key: string;
  label: string;
  category: string;
  priority: string;
  regex: RegExp;
  apply: (query: Partial<HierarchySeoQuery>) => void;
}

const INTENT_RULES: IntentRule[] = [
  {
    key: 'best',
    label: 'Best Rated Schools',
    category: 'Top Intent',
    priority: 'P0',
    regex: /^best-schools(-in-.*)?$/,
    apply: (q) => { q.sortBy = 'rank'; }
  },
  {
    key: 'top_cbse',
    label: 'Top CBSE Schools',
    category: 'Top Intent',
    priority: 'P0',
    regex: /^top-cbse-schools(-in-.*)?$/,
    apply: (q) => { q.board = 'CBSE'; q.sortBy = 'rank'; }
  },
  {
    key: 'best_private',
    label: 'Best Private Schools',
    category: 'Top Intent',
    priority: 'P0',
    regex: /^best-private-schools(-in-.*)?$/,
    apply: (q) => { q.management = 'Private Unaided'; q.sortBy = 'rank'; }
  },
  {
    key: 'cbse',
    label: 'CBSE Affiliated Schools',
    category: 'Board',
    priority: 'P0',
    regex: /^cbse-schools(-in-.*)?$/,
    apply: (q) => { q.board = 'CBSE'; }
  },
  {
    key: 'icse',
    label: 'ICSE Board Schools',
    category: 'Board',
    priority: 'P1',
    regex: /^icse-schools(-in-.*)?$/,
    apply: (q) => { q.board = 'ICSE'; }
  },
  {
    key: 'state_board',
    label: 'State Board Schools',
    category: 'Board',
    priority: 'P1',
    regex: /^state-board-schools(-in-.*)?$/,
    apply: (q) => { q.board = 'State Board'; }
  },
  {
    key: 'ib',
    label: 'International & IB Schools',
    category: 'Board',
    priority: 'P2',
    regex: /^(ib|international)-schools(-in-.*)?$/,
    apply: (q) => { q.board = 'International / IB'; }
  },
  {
    key: 'private_cbse',
    label: 'Private CBSE Schools',
    category: 'Combo',
    priority: 'P0',
    regex: /^private-cbse-schools(-in-.*)?$/,
    apply: (q) => { q.board = 'CBSE'; q.management = 'Private Unaided'; }
  },
  {
    key: 'english_cbse',
    label: 'English Medium CBSE Schools',
    category: 'Combo',
    priority: 'P0',
    regex: /^english-medium-cbse-schools(-in-.*)?$/,
    apply: (q) => { q.board = 'CBSE'; q.medium = 'English'; }
  },
  {
    key: 'higher_sec',
    label: 'Senior Secondary Schools (11-12th)',
    category: 'Type',
    priority: 'P1',
    regex: /^higher-secondary-schools(-in-.*)?$/,
    apply: (q) => { q.schoolCategory = 'Secondary with Higher Secondary'; }
  },
  {
    key: 'secondary',
    label: 'Secondary Schools (10th)',
    category: 'Type',
    priority: 'P1',
    regex: /^secondary-schools(-in-.*)?$/,
    apply: (q) => { q.schoolCategory = 'Pr. Up Pr. and Secondary Only'; }
  },
  {
    key: 'primary',
    label: 'Primary Schools (1-5th)',
    category: 'Type',
    priority: 'P2',
    regex: /^primary-schools(-in-.*)?$/,
    apply: (q) => { q.schoolCategory = 'Primary with Upper Primary'; }
  },
  {
    key: 'k12',
    label: 'Complete K-12 Schools',
    category: 'Type',
    priority: 'P1',
    regex: /^k12-schools(-in-.*)?$/,
    apply: (q) => { q.schoolCategory = 'Pr. with Up.Pr. Sec. and H.Sec.'; }
  },
  {
    key: 'atl_lab',
    label: 'Schools with Atal Tinkering Lab (ATL)',
    category: 'Facility',
    priority: 'P1',
    regex: /^schools-with-atl-lab(-in-.*)?$/,
    apply: (q) => { q.facility = 'atl'; }
  },
  {
    key: 'comp_lab',
    label: 'Schools with Computer Lab & ICT',
    category: 'Facility',
    priority: 'P1',
    regex: /^schools-with-computer-lab(-in-.*)?$/,
    apply: (q) => { q.facility = 'computer_lab'; }
  },
  {
    key: 'sci_lab',
    label: 'Schools with Science Labs',
    category: 'Facility',
    priority: 'P1',
    regex: /^schools-with-science-labs(-in-.*)?$/,
    apply: (q) => { q.facility = 'science_lab'; }
  },
  {
    key: 'smart_class',
    label: 'Schools with Smart Digital Classrooms',
    category: 'Facility',
    priority: 'P2',
    regex: /^schools-with-smart-classes(-in-.*)?$/,
    apply: (q) => { q.facility = 'smart_class'; }
  },
  {
    key: 'sports',
    label: 'Schools with Sports Ground & Playground',
    category: 'Facility',
    priority: 'P2',
    regex: /^schools-with-sports-ground(-in-.*)?$/,
    apply: (q) => { q.facility = 'sports'; }
  },
  {
    key: 'day_school',
    label: 'Day Schools',
    category: 'Hostel',
    priority: 'P1',
    regex: /^day-schools(-in-.*)?$/,
    apply: (q) => { q.residential = 'Day School'; }
  },
  {
    key: 'boarding',
    label: 'Boarding & Residential Schools',
    category: 'Hostel',
    priority: 'P1',
    regex: /^boarding-schools(-in-.*)?$/,
    apply: (q) => { q.residential = 'Boarding / Residential'; }
  },
  {
    key: 'girls',
    label: 'Girls Only Schools',
    category: 'Gender',
    priority: 'P1',
    regex: /^girls-schools(-in-.*)?$/,
    apply: (q) => { q.gender = '2-Girls'; }
  },
  {
    key: 'boys',
    label: 'Boys Only Schools',
    category: 'Gender',
    priority: 'P2',
    regex: /^boys-schools(-in-.*)?$/,
    apply: (q) => { q.gender = '1-Boys'; }
  },
  {
    key: 'coed',
    label: 'Co-educational Schools',
    category: 'Gender',
    priority: 'P2',
    regex: /^co-ed-schools(-in-.*)?$/,
    apply: (q) => { q.gender = '3-Co-educational'; }
  },
  {
    key: 'english',
    label: 'English Medium Schools',
    category: 'Medium',
    priority: 'P1',
    regex: /^english-medium-schools(-in-.*)?$/,
    apply: (q) => { q.medium = 'English'; }
  },
  {
    key: 'hindi',
    label: 'Hindi Medium Schools',
    category: 'Medium',
    priority: 'P2',
    regex: /^hindi-medium-schools(-in-.*)?$/,
    apply: (q) => { q.medium = 'Hindi'; }
  },
  {
    key: 'over_1000',
    label: 'Large Schools (1000+ Students)',
    category: 'Top Intent',
    priority: 'P2',
    regex: /^schools-with-over-1000-students(-in-.*)?$/,
    apply: (q) => { q.minStudents = 1000; q.sortBy = 'students'; }
  },
  {
    key: 'madrasa',
    label: 'Recognized Madrasa Schools',
    category: 'Management',
    priority: 'P2',
    regex: /^madrasa-schools(-in-.*)?$/,
    apply: (q) => { q.management = 'Madrasa'; }
  }
];

function matchIntent(slug: string): IntentRule | null {
  if (!slug) return null;
  const clean = slug.toLowerCase().trim();
  for (const rule of INTENT_RULES) {
    if (rule.regex.test(clean)) {
      return rule;
    }
  }
  return null;
}

export function parseHierarchySeoQuery(
  rawSegments: string[],
  searchParams?: Record<string, string | string[] | undefined>
): HierarchySeoQuery {
  // Filter out empty segments & normalise 'india' prefix if passed
  let segments = (rawSegments || []).map(s => s.toLowerCase().trim()).filter(Boolean);
  if (segments[0] === 'india') {
    segments = segments.slice(1);
  }

  const page = Math.max(Number(searchParams?.page) || 1, 1);
  const limit = Math.min(Number(searchParams?.limit) || 24, 100);
  const querySort = (typeof searchParams?.sort === 'string' ? searchParams.sort : '') || 'default';

  // Base Query Skeleton
  const query: HierarchySeoQuery = {
    level: 'country',
    rawSegments,
    canonicalUrl: 'https://www.cseel.org/school/india',
    pageTitle: 'Schools in India - Complete All-State Directory & STEM Education Hub | CSEEL',
    metaDescription: 'Explore over 3.8 Lakh verified schools across 32 States & UTs in India. Search by Board (CBSE, ICSE, State), Facilities (ATL Labs, Science Labs), and Location.',
    h1Heading: 'Schools in India',
    breadcrumbs: [{ label: 'Home', href: '/' }, { label: 'Schools in India', href: '/school/india' }],
    country: 'India',
    isIntentPage: false,
    sortBy: querySort,
    page,
    limit,
    companionIntentPages: [],
    faqs: [],
    schemaJsonLd: []
  };

  // 1. Level: Country (/school/india)
  if (segments.length === 0) {
    query.level = 'country';
    query.canonicalUrl = 'https://www.cseel.org/school/india';
    query.pageTitle = 'Schools in India (2026 Directory) - 32 States, 780+ Districts & STEM Labs | CSEEL';
    query.metaDescription = 'Find the complete directory of 3,88,932+ verified schools across 32 States & UTs in India. Compare CBSE, ICSE, State Board, ATL Labs, teacher ratios & student strength.';
    query.h1Heading = 'Explore Schools Across India';
    query.faqs = [
      {
        question: 'How many schools are registered in the CSEEL India Directory?',
        answer: 'The CSEEL National Schools Directory catalogs over 3,88,932 verified schools across 32 States & Union Territories with comprehensive details on Affiliation, STEM Labs, Atal Tinkering Labs (ATL), and student enrollment.'
      },
      {
        question: 'How can I find schools in my state or district?',
        answer: 'Select your state from the interactive state grid above, and then drill down to your district and education block to explore schools near you.'
      },
      {
        question: 'What types of school boards are supported?',
        answer: 'The directory provides detailed filters for CBSE (Central Board of Secondary Education), ICSE (Council for the Indian School Certificate Examinations), State Boards, and International Baccalaureate (IB) / Cambridge schools.'
      }
    ];
    return generateStructuredData(query);
  }

  // 2. Level: State (/school/india/[state])
  const stateSlug = segments[0];
  const stateName = KNOWN_STATES[stateSlug] || slugToTitleCase(stateSlug);
  query.stateSlug = stateSlug;
  query.stateName = stateName;
  query.breadcrumbs.push({ label: stateName, href: `/school/india/${stateSlug}` });

  if (segments.length === 1) {
    query.level = 'state';
    query.canonicalUrl = `https://www.cseel.org/school/india/${stateSlug}`;
    query.pageTitle = `Schools in ${stateName} - District-wise School Directory & STEM Labs | CSEEL`;
    query.metaDescription = `Comprehensive directory of private and recognized schools in ${stateName}. View district-wise school counts, CBSE affiliations, Atal Tinkering Labs (ATL), and student-teacher ratios.`;
    query.h1Heading = `Schools in ${stateName}`;
    query.faqs = [
      {
        question: `How many schools are indexed in ${stateName}?`,
        answer: `CSEEL indexes thousands of verified private and affiliated schools across all administrative districts of ${stateName}, complete with infrastructure details, faculty strength, and STEM labs.`
      },
      {
        question: `How do I view schools in a specific district of ${stateName}?`,
        answer: `Click on any district card or list item above to view all schools registered in that district, or use the high-intent filter options like CBSE, ICSE, and English Medium.`
      }
    ];
    return generateStructuredData(query);
  }

  // 3. Level: District or District Intent (/school/india/[state]/[district] or [state]/[district]/[intent])
  const districtSlug = segments[1];
  const districtName = slugToTitleCase(districtSlug);
  query.districtSlug = districtSlug;
  query.districtName = districtName;
  query.breadcrumbs.push({ label: districtName, href: `/school/india/${stateSlug}/${districtSlug}` });

  // Generate 24 Companion High-Intent Links for this District
  query.companionIntentPages = DISTRICT_25_CATEGORIES.map(cat => ({
    label: `${cat.label} in ${districtName}`,
    href: `/school/india/${stateSlug}/${districtSlug}/${cat.prefix}-${districtSlug}`,
    category: cat.category,
    priority: cat.priority
  }));

  if (segments.length === 2) {
    // Standard Base District Page
    query.level = 'district';
    query.canonicalUrl = `https://www.cseel.org/school/india/${stateSlug}/${districtSlug}`;
    query.pageTitle = `Schools in ${districtName}, ${stateName} (2026 Directory) | Best, CBSE & Fees - CSEEL`;
    query.metaDescription = `Explore all schools in ${districtName}, ${stateName}. Compare CBSE, ICSE, State Board schools, view block lists, Atal Tinkering Labs (ATL), and student enrollment.`;
    query.h1Heading = `Schools in ${districtName}, ${stateName}`;
    query.faqs = generateDistrictFaqs(districtName, stateName);
    return generateStructuredData(query);
  }

  // Check segment 3: Is it an Intent on District, or is it a Block?
  const seg3 = segments[2];
  const intentSeg3 = matchIntent(seg3);

  if (intentSeg3) {
    // Segment 3 is an Intent applied to District! e.g. /school/india/uttar-pradesh/lucknow/cbse-schools-in-lucknow
    query.level = 'district';
    query.isIntentPage = true;
    query.intentCategory = intentSeg3.key;
    query.intentLabel = intentSeg3.label;
    intentSeg3.apply(query);

    query.canonicalUrl = `https://www.cseel.org/school/india/${stateSlug}/${districtSlug}/${seg3}`;
    query.pageTitle = `${intentSeg3.label} in ${districtName}, ${stateName} (2026) | CSEEL Directory`;
    query.metaDescription = `Find the best ${intentSeg3.label.toLowerCase()} in ${districtName}, ${stateName}. Verified list with student strength, teacher ratios, labs, and address details.`;
    query.h1Heading = `${intentSeg3.label} in ${districtName}, ${stateName}`;
    query.breadcrumbs.push({ label: intentSeg3.label, href: query.canonicalUrl });
    query.faqs = generateDistrictIntentFaqs(districtName, stateName, intentSeg3.label);
    return generateStructuredData(query);
  }

  // Segment 3 is a Block! e.g. /school/india/uttar-pradesh/lucknow/alambagh
  const blockSlug = seg3;
  const blockName = slugToTitleCase(blockSlug);
  query.blockSlug = blockSlug;
  query.blockName = blockName;
  query.breadcrumbs.push({ label: blockName, href: `/school/india/${stateSlug}/${districtSlug}/${blockSlug}` });

  if (segments.length === 3) {
    query.level = 'block';
    query.canonicalUrl = `https://www.cseel.org/school/india/${stateSlug}/${districtSlug}/${blockSlug}`;
    query.pageTitle = `Schools in ${blockName}, ${districtName} (${stateName}) - Complete List | CSEEL`;
    query.metaDescription = `List of verified schools in ${blockName} block, ${districtName}. View villages/wards, CBSE affiliations, STEM facilities, and contact details.`;
    query.h1Heading = `Schools in ${blockName}, ${districtName}`;
    query.faqs = generateBlockFaqs(blockName, districtName, stateName);
    return generateStructuredData(query);
  }

  // Check segment 4: Is it an Intent on Block, or is it a Village?
  const seg4 = segments[3];
  const intentSeg4 = matchIntent(seg4);

  if (intentSeg4) {
    // Segment 4 is an Intent applied to Block! e.g. /school/india/uttar-pradesh/lucknow/alambagh/english-medium-schools-in-alambagh
    query.level = 'block';
    query.isIntentPage = true;
    query.intentCategory = intentSeg4.key;
    query.intentLabel = intentSeg4.label;
    intentSeg4.apply(query);

    query.canonicalUrl = `https://www.cseel.org/school/india/${stateSlug}/${districtSlug}/${blockSlug}/${seg4}`;
    query.pageTitle = `${intentSeg4.label} in ${blockName}, ${districtName} | CSEEL Directory`;
    query.metaDescription = `Top ${intentSeg4.label.toLowerCase()} in ${blockName} block, ${districtName}, ${stateName}. Compare facilities, student counts, and admission details.`;
    query.h1Heading = `${intentSeg4.label} in ${blockName}, ${districtName}`;
    query.breadcrumbs.push({ label: intentSeg4.label, href: query.canonicalUrl });
    query.faqs = generateBlockFaqs(blockName, districtName, stateName);
    return generateStructuredData(query);
  }

  // Segment 4 is a Village/Ward! e.g. /school/india/uttar-pradesh/lucknow/alambagh/singhar-nagar
  const villageSlug = seg4;
  const villageName = slugToTitleCase(villageSlug);
  query.villageSlug = villageSlug;
  query.villageName = villageName;
  query.breadcrumbs.push({ label: villageName, href: `/school/india/${stateSlug}/${districtSlug}/${blockSlug}/${villageSlug}` });

  if (segments.length === 4) {
    query.level = 'village';
    query.canonicalUrl = `https://www.cseel.org/school/india/${stateSlug}/${districtSlug}/${blockSlug}/${villageSlug}`;
    query.pageTitle = `Schools in ${villageName}, ${blockName} (${districtName}) | CSEEL`;
    query.metaDescription = `Complete list of schools located in ${villageName}, ${blockName} block, ${districtName}, ${stateName}.`;
    query.h1Heading = `Schools in ${villageName}, ${blockName}`;
    return generateStructuredData(query);
  }

  // Segment 5: School Profile! e.g. /school/india/rajasthan/jaipur/sanganer/mansarovar/8122604214
  const schoolSlug = segments[4];
  query.level = 'profile';
  query.schoolSlug = schoolSlug;
  query.canonicalUrl = `https://www.cseel.org/school/india/${stateSlug}/${districtSlug}/${blockSlug}/${villageSlug}/${schoolSlug}`;
  query.pageTitle = `School Profile in ${villageName}, ${districtName} | CSEEL`;
  query.metaDescription = `View complete profile, affiliation, teacher strength, and STEM labs for school in ${villageName}, ${districtName}.`;
  query.h1Heading = `School Profile`;
  query.breadcrumbs.push({ label: 'Profile', href: query.canonicalUrl });

  return generateStructuredData(query);
}

// ─── FAQ GENERATORS ───
function generateDistrictFaqs(district: string, state: string) {
  return [
    {
      question: `How many schools are located in ${district}, ${state}?`,
      answer: `There are hundreds of recognized private and affiliated schools in ${district}, providing diverse curriculum options including CBSE, ICSE, and State Board.`
    },
    {
      question: `Which are the best CBSE schools in ${district}?`,
      answer: `Top CBSE schools in ${district} feature established infrastructure, modern Science and Atal Tinkering Labs (ATL), high student enrollment, and strong student-teacher ratios.`
    },
    {
      question: `How can I find schools in a specific education block of ${district}?`,
      answer: `Use the education block filter chips above to navigate into blocks like Sanganer, Alambagh, or central wards of ${district}.`
    }
  ];
}

function generateDistrictIntentFaqs(district: string, state: string, intentLabel: string) {
  return [
    {
      question: `Where can I find verified ${intentLabel.toLowerCase()} in ${district}?`,
      answer: `CSEEL provides an audited list of ${intentLabel.toLowerCase()} in ${district}, ${state}, complete with affiliation records, student strength, and laboratory facilities.`
    },
    {
      question: `Are these schools recognized under UDISE+ and education boards?`,
      answer: `Yes, all listed institutes in ${district} are verified private and recognized schools indexed with valid UDISE codes and affiliation standards.`
    }
  ];
}

function generateBlockFaqs(block: string, district: string, state: string) {
  return [
    {
      question: `What schools are available in ${block} block, ${district}?`,
      answer: `The ${block} block hosts primary, secondary, and senior secondary schools catering to local residential wards and villages with full academic infrastructure.`
    },
    {
      question: `Can I filter schools by medium in ${block}?`,
      answer: `Yes, you can browse English Medium, Hindi Medium, and regional language schools in ${block} using the directory filters.`
    }
  ];
}

// ─── JSON-LD STRUCTURED DATA GENERATOR ───
function generateStructuredData(query: HierarchySeoQuery): HierarchySeoQuery {
  const schemas: Record<string, any>[] = [];

  // 1. BreadcrumbList Schema
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': query.breadcrumbs.map((crumb, idx) => ({
      '@type': 'ListItem',
      'position': idx + 1,
      'name': crumb.label,
      'item': `https://www.cseel.org${crumb.href}`
    }))
  });

  // 2. FAQPage Schema
  if (query.faqs && query.faqs.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': query.faqs.map(faq => ({
        '@type': 'Question',
        'name': faq.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faq.answer
        }
      }))
    });
  }

  // 3. WebSite / CollectionPage Schema
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    'name': query.pageTitle,
    'description': query.metaDescription,
    'url': query.canonicalUrl,
    'publisher': {
      '@type': 'Organization',
      'name': 'CSEEL STEM Education Network',
      'url': 'https://www.cseel.org'
    }
  });

  query.schemaJsonLd = schemas;
  return query;
}
