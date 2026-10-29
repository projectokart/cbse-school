// ─── SCHOOLS SEO & SEMANTIC SLUG PARSER (25 HIGH-INTENT DISTRICT MATRIX) ───
// Supports all 25 high-converting query patterns across India's 786 districts (~19,650 programmatic pages)

export interface DistrictCategoryDef {
  id: string;
  prefix: string;
  label: string;
  category: 'Base' | 'Top Intent' | 'Board' | 'Combo' | 'Management' | 'Central' | 'Facility' | 'Hostel' | 'Gender' | 'Medium';
  priority: 'P0' | 'P1' | 'P2';
  urlPattern: (districtSlug: string) => string;
}

export const DISTRICT_25_CATEGORIES: DistrictCategoryDef[] = [
  // 1. Base & Top Intent (P0)
  { id: 'base', prefix: 'schools-in', label: 'All Schools', category: 'Base', priority: 'P0', urlPattern: (d) => `/schools/schools-in-${d}` },
  { id: 'best', prefix: 'best-schools-in', label: 'Best Schools', category: 'Top Intent', priority: 'P0', urlPattern: (d) => `/schools/best-schools-in-${d}` },
  { id: 'top_cbse', prefix: 'top-cbse-schools-in', label: 'Top CBSE Schools', category: 'Top Intent', priority: 'P0', urlPattern: (d) => `/schools/top-cbse-schools-in-${d}` },
  { id: 'best_private', prefix: 'best-private-schools-in', label: 'Best Private Schools', category: 'Top Intent', priority: 'P0', urlPattern: (d) => `/schools/best-private-schools-in-${d}` },
  
  // 2. Boards (P0 & P1)
  { id: 'cbse', prefix: 'cbse-schools-in', label: 'CBSE Schools', category: 'Board', priority: 'P0', urlPattern: (d) => `/schools/cbse-schools-in-${d}` },
  { id: 'icse', prefix: 'icse-schools-in', label: 'ICSE Schools', category: 'Board', priority: 'P1', urlPattern: (d) => `/schools/icse-schools-in-${d}` },
  { id: 'state_board', prefix: 'state-board-schools-in', label: 'State Board Schools', category: 'Board', priority: 'P1', urlPattern: (d) => `/schools/state-board-schools-in-${d}` },
  { id: 'ib', prefix: 'ib-schools-in', label: 'IB & International', category: 'Board', priority: 'P2', urlPattern: (d) => `/schools/ib-schools-in-${d}` },

  // 3. Golden Combinations (P0)
  { id: 'private_cbse', prefix: 'private-cbse-schools-in', label: 'Private CBSE Schools', category: 'Combo', priority: 'P0', urlPattern: (d) => `/schools/private-cbse-schools-in-${d}` },
  { id: 'english_cbse', prefix: 'english-medium-cbse-schools-in', label: 'English Medium CBSE', category: 'Combo', priority: 'P0', urlPattern: (d) => `/schools/english-medium-cbse-schools-in-${d}` },

  // 4. School Levels / Types (P1 & P2)
  { id: 'higher_sec', prefix: 'higher-secondary-schools-in', label: 'Senior Secondary (11-12th)', category: 'Management', priority: 'P1', urlPattern: (d) => `/schools/higher-secondary-schools-in-${d}` },
  { id: 'secondary', prefix: 'secondary-schools-in', label: 'Secondary Schools (10th)', category: 'Management', priority: 'P1', urlPattern: (d) => `/schools/secondary-schools-in-${d}` },
  { id: 'primary', prefix: 'primary-schools-in', label: 'Primary Schools (1-5th)', category: 'Management', priority: 'P2', urlPattern: (d) => `/schools/primary-schools-in-${d}` },
  { id: 'k12', prefix: 'k12-schools-in', label: 'Complete K-12 Schools', category: 'Management', priority: 'P1', urlPattern: (d) => `/schools/k12-schools-in-${d}` },

  // 5. Facilities & STEM Labs (P1 & P2)
  { id: 'atl_lab', prefix: 'schools-with-atl-lab-in', label: 'Atal Tinkering Lab (ATL)', category: 'Facility', priority: 'P1', urlPattern: (d) => `/schools/schools-with-atl-lab-in-${d}` },
  { id: 'comp_lab', prefix: 'schools-with-computer-lab-in', label: 'Computer & ICT Labs', category: 'Facility', priority: 'P1', urlPattern: (d) => `/schools/schools-with-computer-lab-in-${d}` },
  { id: 'sci_lab', prefix: 'schools-with-science-labs-in', label: 'Science Laboratories', category: 'Facility', priority: 'P1', urlPattern: (d) => `/schools/schools-with-science-labs-in-${d}` },
  { id: 'smart_class', prefix: 'schools-with-smart-classes-in', label: 'Smart Digital Classrooms', category: 'Facility', priority: 'P2', urlPattern: (d) => `/schools/schools-with-smart-classes-in-${d}` },
  { id: 'sports', prefix: 'schools-with-sports-ground-in', label: 'Playground & Sports', category: 'Facility', priority: 'P2', urlPattern: (d) => `/schools/schools-with-sports-ground-in-${d}` },

  // 6. Gender & Residential Setup (P1 & P2)
  { id: 'day_school', prefix: 'day-schools-in', label: 'Day Schools', category: 'Hostel', priority: 'P1', urlPattern: (d) => `/schools/day-schools-in-${d}` },
  { id: 'boarding', prefix: 'boarding-schools-in', label: 'Boarding / Residential', category: 'Hostel', priority: 'P1', urlPattern: (d) => `/schools/boarding-schools-in-${d}` },
  { id: 'girls', prefix: 'girls-schools-in', label: 'Girls Only Schools', category: 'Gender', priority: 'P1', urlPattern: (d) => `/schools/girls-schools-in-${d}` },
  { id: 'boys', prefix: 'boys-schools-in', label: 'Boys Only Schools', category: 'Gender', priority: 'P2', urlPattern: (d) => `/schools/boys-schools-in-${d}` },
  { id: 'coed', prefix: 'co-ed-schools-in', label: 'Co-educational Schools', category: 'Gender', priority: 'P2', urlPattern: (d) => `/schools/co-ed-schools-in-${d}` },

  // 7. Medium of Instruction (P1 & P2)
  { id: 'english', prefix: 'english-medium-schools-in', label: 'English Medium Schools', category: 'Medium', priority: 'P1', urlPattern: (d) => `/schools/english-medium-schools-in-${d}` },
  { id: 'hindi', prefix: 'hindi-medium-schools-in', label: 'Hindi Medium Schools', category: 'Medium', priority: 'P2', urlPattern: (d) => `/schools/hindi-medium-schools-in-${d}` }
];

export interface SchoolSeoQuery {
  rawSlug: string;
  canonicalUrl: string;
  pageTitle: string;
  metaDescription: string;
  h1Heading: string;
  breadcrumbs: { label: string; href: string }[];
  
  // Location
  country: string;
  state?: string;
  district?: string;
  districtSlug?: string;
  block?: string;
  village?: string;
  pincode?: string;
  
  // Filters
  board?: string;
  management?: string;
  schoolCategory?: string;
  residential?: string;
  gender?: string;
  medium?: string;
  facility?: string;
  onlyPmShri?: boolean;
  minStudents?: number;
  searchQuery?: string;
  
  // Sort & Page
  sortBy: string;
  page: number;
  limit: number;
  
  // Companion 25-page cross links for District
  companionDistrictPages: { label: string; href: string; category: string; priority: string }[];
  
  // SEO FAQs
  faqs: { question: string; answerTemplate: string }[];
}

export const KNOWN_STATES: Record<string, string> = {
  'andhra-pradesh': 'Andhra Pradesh',
  'arunachal-pradesh': 'Arunachal Pradesh',
  'assam': 'Assam',
  'bihar': 'Bihar',
  'chhattisgarh': 'Chhattisgarh',
  'goa': 'Goa',
  'gujarat': 'Gujarat',
  'haryana': 'Haryana',
  'himachal-pradesh': 'Himachal Pradesh',
  'jharkhand': 'Jharkhand',
  'karnataka': 'Karnataka',
  'kerala': 'Kerala',
  'madhya-pradesh': 'Madhya Pradesh',
  'maharashtra': 'Maharashtra',
  'manipur': 'Manipur',
  'meghalaya': 'Meghalaya',
  'mizoram': 'Mizoram',
  'nagaland': 'Nagaland',
  'odisha': 'Odisha',
  'punjab': 'Punjab',
  'rajasthan': 'Rajasthan',
  'sikkim': 'Sikkim',
  'tamil-nadu': 'Tamil Nadu',
  'telangana': 'Telangana',
  'tripura': 'Tripura',
  'uttar-pradesh': 'Uttar Pradesh',
  'uttarakhand': 'Uttarakhand',
  'west-bengal': 'West Bengal',
  'delhi': 'Delhi',
  'chandigarh': 'Chandigarh',
  'jammu-and-kashmir': 'Jammu and Kashmir',
  'ladakh': 'Ladakh',
  'puducherry': 'Puducherry'
};

export const KNOWN_DISTRICTS: Record<string, { district: string; state: string }> = {
  'palwal': { district: 'Palwal', state: 'Haryana' },
  'faridabad': { district: 'Faridabad', state: 'Haryana' },
  'gurgaon': { district: 'Gurgaon', state: 'Haryana' },
  'gurugram': { district: 'Gurgaon', state: 'Haryana' },
  'rewari': { district: 'Rewari', state: 'Haryana' },
  'sonipat': { district: 'Sonipat', state: 'Haryana' },
  'panipat': { district: 'Panipat', state: 'Haryana' },
  'karnal': { district: 'Karnal', state: 'Haryana' },
  'rohtak': { district: 'Rohtak', state: 'Haryana' },
  'hisar': { district: 'Hisar', state: 'Haryana' },
  'nuh': { district: 'Nuh', state: 'Haryana' },
  'mewat': { district: 'Nuh', state: 'Haryana' },
  'jaipur': { district: 'Jaipur', state: 'Rajasthan' },
  'alwar': { district: 'Alwar', state: 'Rajasthan' },
  'jodhpur': { district: 'Jodhpur', state: 'Rajasthan' },
  'kota': { district: 'Kota', state: 'Rajasthan' },
  'udaipur': { district: 'Udaipur', state: 'Rajasthan' },
  'south-delhi': { district: 'South Delhi', state: 'Delhi' },
  'north-delhi': { district: 'North Delhi', state: 'Delhi' },
  'west-delhi': { district: 'West Delhi', state: 'Delhi' },
  'east-delhi': { district: 'East Delhi', state: 'Delhi' },
  'central-delhi': { district: 'Central Delhi', state: 'Delhi' },
  'noida': { district: 'Gautam Buddha Nagar', state: 'Uttar Pradesh' },
  'ghaziabad': { district: 'Ghaziabad', state: 'Uttar Pradesh' },
  'lucknow': { district: 'Lucknow', state: 'Uttar Pradesh' },
  'kanpur': { district: 'Kanpur Nagar', state: 'Uttar Pradesh' },
  'agra': { district: 'Agra', state: 'Uttar Pradesh' },
  'varanasi': { district: 'Varanasi', state: 'Uttar Pradesh' },
  'mumbai': { district: 'Mumbai', state: 'Maharashtra' },
  'pune': { district: 'Pune', state: 'Maharashtra' },
  'thane': { district: 'Thane', state: 'Maharashtra' },
  'nagpur': { district: 'Nagpur', state: 'Maharashtra' },
  'bengaluru': { district: 'Bengaluru Urban', state: 'Karnataka' },
  'bangalore': { district: 'Bengaluru Urban', state: 'Karnataka' },
  'hyderabad': { district: 'Hyderabad', state: 'Telangana' },
  'chennai': { district: 'Chennai', state: 'Tamil Nadu' },
  'kolkata': { district: 'Kolkata', state: 'West Bengal' },
  'patna': { district: 'Patna', state: 'Bihar' },
  'bhopal': { district: 'Bhopal', state: 'Madhya Pradesh' },
  'indore': { district: 'Indore', state: 'Madhya Pradesh' },
  'ahmedabad': { district: 'Ahmedabad', state: 'Gujarat' },
  'surat': { district: 'Surat', state: 'Gujarat' },
  'dehradun': { district: 'Dehradun', state: 'Uttarakhand' },
  'haridwar': { district: 'Haridwar', state: 'Uttarakhand' },
  'ludhiana': { district: 'Ludhiana', state: 'Punjab' },
  'amritsar': { district: 'Amritsar', state: 'Punjab' },
  'bhubaneswar': { district: 'Khordha', state: 'Odisha' },
  'ranchi': { district: 'Ranchi', state: 'Jharkhand' },
  'guwahati': { district: 'Kamrup Metropolitan', state: 'Assam' },
  'kochi': { district: 'Ernakulam', state: 'Kerala' }
};

function capitalize(str: string): string {
  return str
    .split(/[-_\s]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

export function parseSchoolsSeoQuery(
  slugSegments: string[] | undefined,
  searchParams?: Record<string, string | string[] | undefined>
): SchoolSeoQuery {
  const segments = (slugSegments || []).map((s) => s.toLowerCase().replace(/[^a-z0-9-]/g, '').trim()).filter(Boolean);
  const rawSlug = segments.join('/');

  const result: SchoolSeoQuery = {
    rawSlug,
    canonicalUrl: `https://www.cseel.org/schools${rawSlug ? '/' + rawSlug : ''}`,
    pageTitle: 'Top Schools in India (2026-27 Verified List & Fees) | CSEEL',
    metaDescription: 'Explore verified schools in India. Compare CBSE, ICSE, and State Board affiliations, fees, student strength, and Atal Tinkering Labs.',
    h1Heading: 'List of Schools in India',
    breadcrumbs: [{ label: 'Schools', href: '/schools' }],
    country: 'India',
    sortBy: 'students',
    page: 1,
    limit: 25,
    companionDistrictPages: [],
    faqs: []
  };

  // 1. Process URL Search Parameters
  if (searchParams) {
    if (typeof searchParams.q === 'string' && searchParams.q.trim()) result.searchQuery = searchParams.q.trim();
    if (typeof searchParams.search === 'string' && searchParams.search.trim()) result.searchQuery = searchParams.search.trim();
    if (typeof searchParams.state === 'string') result.state = searchParams.state;
    if (typeof searchParams.district === 'string') result.district = searchParams.district;
    if (typeof searchParams.block === 'string') result.block = searchParams.block;
    if (typeof searchParams.village === 'string') result.village = searchParams.village;
    if (typeof searchParams.pincode === 'string') result.pincode = searchParams.pincode;
    if (typeof searchParams.board === 'string') result.board = searchParams.board;
    if (typeof searchParams.management === 'string') result.management = searchParams.management;
    if (typeof searchParams.residential === 'string') result.residential = searchParams.residential;
    if (typeof searchParams.gender === 'string') result.gender = searchParams.gender;
    if (typeof searchParams.medium === 'string') result.medium = searchParams.medium;
    if (typeof searchParams.facility === 'string') result.facility = searchParams.facility;
    if (typeof searchParams.sort === 'string') result.sortBy = searchParams.sort;
    if (searchParams.page) result.page = Math.max(Number(searchParams.page) || 1, 1);
    if (searchParams.limit) result.limit = Math.min(Number(searchParams.limit) || 25, 25);
  }

  // 2. Parse High-Intent 25 Category Slug Patterns
  if (segments.length === 1) {
    const single = segments[0];

    // Check Pincode Pattern: "schools-in-110001" or "110001"
    const pinMatch = single.match(/(?:schools-in-)?(\d{6})/);
    if (pinMatch) {
      result.pincode = pinMatch[1];
    } else {
      // Check "[pattern]-in-[location]" matching our 25 Categories
      const inMatch = single.match(/^(.*?)-in-(.*)$/);
      if (inMatch) {
        const prefixPart = inMatch[1]; // e.g. "cbse-schools", "private-cbse-schools", "schools-with-atl-lab", "kvs-schools"
        const locationPart = inMatch[2]; // e.g. "palwal", "jaipur", "haryana", "121102"

        // Resolve Location
        const pinInLoc = locationPart.match(/^(\d{6})$/);
        if (pinInLoc) {
          result.pincode = pinInLoc[1];
        } else if (KNOWN_STATES[locationPart]) {
          result.state = KNOWN_STATES[locationPart];
        } else if (KNOWN_DISTRICTS[locationPart]) {
          result.district = KNOWN_DISTRICTS[locationPart].district;
          result.state = KNOWN_DISTRICTS[locationPart].state;
          result.districtSlug = locationPart;
        } else {
          result.district = capitalize(locationPart);
          result.districtSlug = locationPart;
        }

        // 1. Board Filters
        if (prefixPart === 'cbse-schools' || prefixPart === 'top-cbse-schools') {
          result.board = 'CBSE';
        } else if (prefixPart === 'icse-schools') {
          result.board = 'ICSE';
        } else if (prefixPart === 'state-board-schools') {
          result.board = 'State Board';
        } else if (prefixPart === 'ib-schools') {
          result.board = 'IB';
        }

        // 2. Golden Combinations & Best Intent
        if (prefixPart === 'private-cbse-schools') {
          result.board = 'CBSE';
          result.management = 'Private Unaided';
        } else if (prefixPart === 'english-medium-cbse-schools') {
          result.board = 'CBSE';
          result.medium = 'English';
        } else if (prefixPart === 'best-private-schools' || prefixPart === 'private-schools') {
          result.management = 'Private Unaided';
        }

        // 3. School Levels / Types
        if (prefixPart === 'higher-secondary-schools') {
          result.schoolCategory = 'Secondary with Higher Secondary';
        } else if (prefixPart === 'secondary-schools') {
          result.schoolCategory = 'Secondary';
        } else if (prefixPart === 'primary-schools') {
          result.schoolCategory = 'Primary';
        } else if (prefixPart === 'k12-schools') {
          result.schoolCategory = 'K-12';
        }

        // 4. Facilities & STEM Labs
        if (prefixPart === 'schools-with-atl-lab') {
          result.facility = 'Atal Tinkering Lab';
        } else if (prefixPart === 'schools-with-computer-lab') {
          result.facility = 'Computer Lab';
        } else if (prefixPart === 'schools-with-science-labs') {
          result.facility = 'Science Labs';
        } else if (prefixPart === 'schools-with-smart-classes') {
          result.facility = 'Smart Classes';
        } else if (prefixPart === 'schools-with-sports-ground') {
          result.facility = 'Sports Ground';
        }

        // 5. Gender & Residential
        if (prefixPart === 'boarding-schools') {
          result.residential = 'boarding';
        } else if (prefixPart === 'day-schools') {
          result.residential = 'day';
        } else if (prefixPart === 'girls-schools') {
          result.gender = 'Girls';
        } else if (prefixPart === 'boys-schools') {
          result.gender = 'Boys';
        } else if (prefixPart === 'co-ed-schools') {
          result.gender = 'Co-educational';
        }

        // 6. Medium
        if (prefixPart === 'english-medium-schools') {
          result.medium = 'English';
        } else if (prefixPart === 'hindi-medium-schools') {
          result.medium = 'Hindi';
        }
      } else if (KNOWN_STATES[single]) {
        result.state = KNOWN_STATES[single];
      } else if (KNOWN_DISTRICTS[single]) {
        result.district = KNOWN_DISTRICTS[single].district;
        result.state = KNOWN_DISTRICTS[single].state;
        result.districtSlug = single;
      }
    }
  } else if (segments.length >= 2) {
    if (KNOWN_STATES[segments[0]]) {
      result.state = KNOWN_STATES[segments[0]];
      result.district = capitalize(segments[1]);
      result.districtSlug = segments[1];

      if (segments.length >= 3) {
        const seg3 = segments[2];
        if (seg3.includes('cbse')) result.board = 'CBSE';
        else if (seg3.includes('icse')) result.board = 'ICSE';
        else if (seg3.includes('private')) result.management = 'Private Unaided';
        else if (seg3.includes('boarding') || seg3.includes('residential')) result.residential = 'boarding';
        else if (seg3.startsWith('block-')) result.block = capitalize(seg3.replace('block-', ''));
        else if (seg3.startsWith('village-')) result.village = capitalize(seg3.replace('village-', ''));
      }
    }
  }

  // 3. Location Label Construction
  let locName = 'India';
  if (result.village && result.district) locName = `${result.village}, ${result.district}`;
  else if (result.block && result.district) locName = `${result.block} Block, ${result.district}`;
  else if (result.district && result.state) locName = `${result.district}, ${result.state}`;
  else if (result.district) locName = `${result.district}`;
  else if (result.state) locName = `${result.state}`;
  else if (result.pincode) locName = `Pincode ${result.pincode}`;

  // Breadcrumbs
  if (result.state) {
    const stateSlug = Object.keys(KNOWN_STATES).find((k) => KNOWN_STATES[k].toLowerCase() === result.state?.toLowerCase()) || result.state.toLowerCase();
    result.breadcrumbs.push({ label: result.state, href: `/schools/${stateSlug}` });

    if (result.district) {
      result.breadcrumbs.push({ label: result.district, href: `/schools/schools-in-${result.districtSlug || result.district.toLowerCase()}` });
    }
  } else if (result.pincode) {
    result.breadcrumbs.push({ label: `PIN ${result.pincode}`, href: `/schools/schools-in-${result.pincode}` });
  }

  // 4. Generate Companion 25-Page Links for District
  if (result.district) {
    const dSlug = result.districtSlug || result.district.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    result.companionDistrictPages = DISTRICT_25_CATEGORIES.map((cat) => ({
      label: `${cat.label} in ${result.district}`,
      href: cat.urlPattern(dSlug),
      category: cat.category,
      priority: cat.priority
    }));
  }

  // 5. Filter Prefix & SEO Headings
  const filterTokens: string[] = [];
  if (result.gender === 'Girls') filterTokens.push('Girls');
  if (result.gender === 'Boys') filterTokens.push('Boys');
  if (result.gender === 'Co-educational') filterTokens.push('Co-ed');
  if (result.medium === 'English') filterTokens.push('English Medium');
  if (result.board) filterTokens.push(result.board);
  if (result.residential === 'boarding') filterTokens.push('Boarding & Residential');
  if (result.residential === 'partially_residential') filterTokens.push('Day-Boarding');
  if (result.management?.includes('Private')) filterTokens.push('Private');
  if (result.management?.includes('Government')) filterTokens.push('Government');
  if (result.management?.includes('PM SHRI')) filterTokens.push('PM SHRI');
  if (result.management?.includes('Kendriya')) filterTokens.push('Kendriya Vidyalaya (KVS)');
  if (result.management?.includes('Navodaya')) filterTokens.push('Jawahar Navodaya (JNV)');
  if (result.facility) filterTokens.push(`with ${result.facility}`);

  const filterString = filterTokens.length > 0 ? filterTokens.join(' ') + ' ' : '';

  result.h1Heading = `List of ${filterString}Schools in ${locName}`;
  result.pageTitle = `Best ${filterString}Schools in ${locName} (2026-27 Verified List & Fees) | CSEEL`;
  result.metaDescription = `Explore the best verified ${filterString}schools in ${locName}. Compare student enrollment, faculty count, annual fees, board affiliations, and STEM laboratory infrastructure.`;

  // Dynamic FAQs
  result.faqs = [
    {
      question: `How many ${result.board || 'registered'} schools are in ${locName}?`,
      answerTemplate: `There are {totalCount} verified schools in ${locName} according to the latest 2026-27 educational directory.`
    },
    {
      question: `Which schools have Atal Tinkering Labs (ATL) in ${locName}?`,
      answerTemplate: `Schools in ${locName} equipped with verified Atal Tinkering Labs (ATL) and robotics STEM kits are listed with verified badges.`
    },
    {
      question: `What is the average Student-Teacher Ratio in ${locName}?`,
      answerTemplate: `The average Student-Teacher Ratio (STR) across schools in ${locName} is approximately {avgRatio}, ensuring personal academic attention.`
    },
    {
      question: `Are there boarding or residential schools in ${locName}?`,
      answerTemplate: `Yes, our directory includes verified day schools, day-boarding, and fully residential institutions in ${locName}.`
    }
  ];

  return result;
}
