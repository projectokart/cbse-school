import { schoolSearchSupabase, mapSupabaseToSchoolRecord } from './schoolSearchClient';
import { HierarchySeoQuery, nameToSlug } from '@/lib/schoolsHierarchySeoParser';
import { SchoolRecord } from '@/data/schoolFinderData';
import { PRECOMPUTED_STATE_DISTRICTS } from '@/data/schoolsLocationHierarchyData';

export interface HierarchyLocationItem {
  name: string;
  slug: string;
  schoolCount: number;
  type: 'state' | 'district' | 'block' | 'village';
  href: string;
  atlCount?: number;
}

export interface HierarchyPageData {
  query: HierarchySeoQuery;
  totalCount: number;
  schools: SchoolRecord[];
  subLocations: HierarchyLocationItem[];
  stats: {
    totalSchools: number;
    totalStudents: number;
    totalTeachers: number;
    atlCount: number;
    cbseCount: number;
  };
  currentPage: number;
  totalPages: number;
  limit: number;
}

// Memory Cache to prevent repeated DB hits
const HIERARCHY_CACHE = new Map<string, { data: HierarchyPageData; timestamp: number }>();
const CACHE_TTL_MS = 15 * 60 * 1000;

// Precomputed State Directory
export const ALL_INDIA_STATES_DATA: HierarchyLocationItem[] = [
  { name: 'Uttar Pradesh', slug: 'uttar-pradesh', schoolCount: 121945, type: 'state', href: '/school/india/uttar-pradesh' },
  { name: 'Rajasthan', slug: 'rajasthan', schoolCount: 37029, type: 'state', href: '/school/india/rajasthan' },
  { name: 'Madhya Pradesh', slug: 'madhya-pradesh', schoolCount: 28814, type: 'state', href: '/school/india/madhya-pradesh' },
  { name: 'Bihar', slug: 'bihar', schoolCount: 20291, type: 'state', href: '/school/india/bihar' },
  { name: 'Karnataka', slug: 'karnataka', schoolCount: 19660, type: 'state', href: '/school/india/karnataka' },
  { name: 'Maharashtra', slug: 'maharashtra', schoolCount: 18169, type: 'state', href: '/school/india/maharashtra' },
  { name: 'Andhra Pradesh', slug: 'andhra-pradesh', schoolCount: 15969, type: 'state', href: '/school/india/andhra-pradesh' },
  { name: 'Telangana', slug: 'telangana', schoolCount: 13726, type: 'state', href: '/school/india/telangana' },
  { name: 'Gujarat', slug: 'gujarat', schoolCount: 13085, type: 'state', href: '/school/india/gujarat' },
  { name: 'West Bengal', slug: 'west-bengal', schoolCount: 10953, type: 'state', href: '/school/india/west-bengal' },
  { name: 'Assam', slug: 'assam', schoolCount: 9297, type: 'state', href: '/school/india/assam' },
  { name: 'Haryana', slug: 'haryana', schoolCount: 9014, type: 'state', href: '/school/india/haryana' },
  { name: 'Chhattisgarh', slug: 'chhattisgarh', schoolCount: 8054, type: 'state', href: '/school/india/chhattisgarh' },
  { name: 'Punjab', slug: 'punjab', schoolCount: 7506, type: 'state', href: '/school/india/punjab' },
  { name: 'Jharkhand', slug: 'jharkhand', schoolCount: 7410, type: 'state', href: '/school/india/jharkhand' },
  { name: 'Odisha', slug: 'odisha', schoolCount: 7329, type: 'state', href: '/school/india/odisha' },
  { name: 'Uttarakhand', slug: 'uttarakhand', schoolCount: 6105, type: 'state', href: '/school/india/uttarakhand' },
  { name: 'Jammu & Kashmir', slug: 'jammu-and-kashmir', schoolCount: 5496, type: 'state', href: '/school/india/jammu-and-kashmir' },
  { name: 'Kerala', slug: 'kerala', schoolCount: 3783, type: 'state', href: '/school/india/kerala' },
  { name: 'Delhi', slug: 'delhi', schoolCount: 2757, type: 'state', href: '/school/india/delhi' },
  { name: 'Himachal Pradesh', slug: 'himachal-pradesh', schoolCount: 2590, type: 'state', href: '/school/india/himachal-pradesh' },
  { name: 'Meghalaya', slug: 'meghalaya', schoolCount: 2176, type: 'state', href: '/school/india/meghalaya' },
  { name: 'Manipur', slug: 'manipur', schoolCount: 1160, type: 'state', href: '/school/india/manipur' },
  { name: 'Mizoram', slug: 'mizoram', schoolCount: 1143, type: 'state', href: '/school/india/mizoram' },
  { name: 'Tripura', slug: 'tripura', schoolCount: 849, type: 'state', href: '/school/india/tripura' },
  { name: 'Nagaland', slug: 'nagaland', schoolCount: 818, type: 'state', href: '/school/india/nagaland' },
  { name: 'Arunachal Pradesh', slug: 'arunachal-pradesh', schoolCount: 620, type: 'state', href: '/school/india/arunachal-pradesh' },
  { name: 'Sikkim', slug: 'sikkim', schoolCount: 369, type: 'state', href: '/school/india/sikkim' },
  { name: 'Puducherry', slug: 'puducherry', schoolCount: 328, type: 'state', href: '/school/india/puducherry' },
  { name: 'Ladakh', slug: 'ladakh', schoolCount: 115, type: 'state', href: '/school/india/ladakh' },
  { name: 'Chandigarh', slug: 'chandigarh', schoolCount: 95, type: 'state', href: '/school/india/chandigarh' },
  { name: 'Andaman & Nicobar', slug: 'andaman-and-nicobar-islands', schoolCount: 71, type: 'state', href: '/school/india/andaman-and-nicobar-islands' },
  { name: 'Dadra & Nagar Haveli', slug: 'dadra-and-nagar-haveli', schoolCount: 64, type: 'state', href: '/school/india/dadra-and-nagar-haveli' }
];

function toFlexiblePattern(str: string): string {
  if (!str) return '%';
  const words = str
    .split(/[\s\-_\/,]+/)
    .map(w => w.trim())
    .filter(Boolean);
  if (words.length === 0) return '%';
  return `%${words.join('%')}%`;
}

export async function fetchHierarchyPageData(query: HierarchySeoQuery): Promise<HierarchyPageData> {
  const cacheKey = JSON.stringify({
    level: query.level,
    stateSlug: query.stateSlug,
    districtSlug: query.districtSlug,
    blockSlug: query.blockSlug,
    villageSlug: query.villageSlug,
    board: query.board,
    management: query.management,
    facility: query.facility,
    medium: query.medium,
    gender: query.gender,
    residential: query.residential,
    sortBy: query.sortBy,
    page: query.page,
    limit: query.limit
  });

  const cached = HIERARCHY_CACHE.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const page = Math.max(query.page || 1, 1);
  const limit = Math.min(query.limit || 24, 100);
  const offset = (page - 1) * limit;

  // 1. Level: Country (/school/india)
  if (query.level === 'country') {
    const result: HierarchyPageData = {
      query,
      totalCount: 388932,
      schools: [],
      subLocations: ALL_INDIA_STATES_DATA,
      stats: {
        totalSchools: 388932,
        totalStudents: 14500000,
        totalTeachers: 850000,
        atlCount: 17105,
        cbseCount: 20210
      },
      currentPage: 1,
      totalPages: 1,
      limit
    };
    HIERARCHY_CACHE.set(cacheKey, { data: result, timestamp: Date.now() });
    return result;
  }

  // 2. Level: State (/school/india/[state])
  if (query.level === 'state' && query.stateName) {
    const cleanSlug = (query.stateSlug || '').toLowerCase().trim();
    const precomputed = PRECOMPUTED_STATE_DISTRICTS[cleanSlug] ||
      Object.entries(PRECOMPUTED_STATE_DISTRICTS).find(([k]) => k === cleanSlug || cleanSlug.includes(k) || k.includes(cleanSlug))?.[1] ||
      null;

    let subLocations: HierarchyLocationItem[] = [];
    if (precomputed && precomputed.length > 0) {
      subLocations = precomputed.map(d => ({
        name: d.name,
        slug: d.slug,
        schoolCount: d.schoolCount,
        atlCount: d.atlCount,
        type: 'district' as const,
        href: `/school/india/${query.stateSlug}/${d.slug}`
      }));
    }

    const stateItem = ALL_INDIA_STATES_DATA.find(
      s => s.slug === cleanSlug || s.name.toLowerCase() === query.stateName?.toLowerCase()
    );
    const stateTotal = stateItem?.schoolCount || subLocations.reduce((a, b) => a + b.schoolCount, 0) || 5000;

    // Fast preview query of top 10 schools in state
    const { data: previewData } = await schoolSearchSupabase
      .from('udise_private_schools')
      .select('*')
      .ilike('state_name', toFlexiblePattern(query.stateName))
      .order('total_students', { ascending: false, nullsFirst: false })
      .range(0, 9);

    const schools: SchoolRecord[] = (previewData || []).map(r => mapSupabaseToSchoolRecord(r));
    const totalAtlInState = subLocations.reduce((a, b) => a + (b.atlCount || 0), 0) || Math.round(stateTotal * 0.04);

    const result: HierarchyPageData = {
      query,
      totalCount: stateTotal,
      schools,
      subLocations,
      stats: {
        totalSchools: stateTotal,
        totalStudents: stateTotal * 450,
        totalTeachers: stateTotal * 25,
        atlCount: totalAtlInState,
        cbseCount: Math.round(stateTotal * 0.15)
      },
      currentPage: page,
      totalPages: Math.max(Math.ceil(stateTotal / limit), 1),
      limit
    };

    HIERARCHY_CACHE.set(cacheKey, { data: result, timestamp: Date.now() });
    return result;
  }

  // 3. Level: District, Block, or Village
  let queryBuilder = schoolSearchSupabase
    .from('udise_private_schools')
    .select('*', { count: 'exact' });

  // Apply State Filter
  if (query.stateName) {
    queryBuilder = queryBuilder.ilike('state_name', toFlexiblePattern(query.stateName));
  }

  // Apply District Filter
  if (query.districtName) {
    queryBuilder = queryBuilder.ilike('district_name', toFlexiblePattern(query.districtName));
  }

  // Apply Block Filter
  if (query.blockName) {
    queryBuilder = queryBuilder.ilike('block_name', toFlexiblePattern(query.blockName));
  }

  // Apply Village Filter
  if (query.villageName) {
    queryBuilder = queryBuilder.ilike('village_ward_name', toFlexiblePattern(query.villageName));
  }

  // Apply Intent / Attribute Filters
  if (query.board) {
    queryBuilder = queryBuilder.ilike('board', `%${query.board}%`);
  }

  if (query.management) {
    queryBuilder = queryBuilder.ilike('management_desc', `%${query.management}%`);
  }

  if (query.schoolCategory) {
    queryBuilder = queryBuilder.ilike('school_category', `%${query.schoolCategory}%`);
  }

  if (query.gender) {
    queryBuilder = queryBuilder.ilike('gender_type', `%${query.gender}%`);
  }

  if (query.residential) {
    queryBuilder = queryBuilder.ilike('residential_type', `%${query.residential}%`);
  }

  if (query.medium) {
    queryBuilder = queryBuilder.ilike('instruction_medium', `%${query.medium}%`);
  }

  if (query.facility === 'atl') {
    queryBuilder = queryBuilder.eq('has_atl', true);
  } else if (query.facility === 'computer_lab') {
    queryBuilder = queryBuilder.eq('has_computer_lab', true);
  } else if (query.facility === 'science_lab') {
    queryBuilder = queryBuilder.eq('has_science_lab', true);
  } else if (query.facility === 'smart_class') {
    queryBuilder = queryBuilder.eq('has_smart_board', true);
  } else if (query.facility === 'sports') {
    queryBuilder = queryBuilder.eq('has_playground', true);
  }

  if (query.minStudents) {
    queryBuilder = queryBuilder.gte('total_students', query.minStudents);
  }

  // Sorting
  if (query.sortBy === 'rank' || query.sortBy === 'students') {
    queryBuilder = queryBuilder.order('total_students', { ascending: false, nullsFirst: false });
    queryBuilder = queryBuilder.order('total_teachers', { ascending: false, nullsFirst: false });
  } else if (query.sortBy === 'teachers') {
    queryBuilder = queryBuilder.order('total_teachers', { ascending: false, nullsFirst: false });
  } else {
    queryBuilder = queryBuilder.order('total_students', { ascending: false, nullsFirst: false });
  }

  // Apply pagination
  queryBuilder = queryBuilder.range(offset, offset + limit - 1);

  const { data: rows, count, error } = await queryBuilder;

  const schools: SchoolRecord[] = (rows || []).map(r => mapSupabaseToSchoolRecord(r));
  const totalCount = count || schools.length;

  // Extract Sublocations (Blocks if District, or Villages if Block)
  const subLocations: HierarchyLocationItem[] = [];

  if (query.level === 'district' && query.districtName) {
    // Fetch distinct blocks in district
    const { data: blockSample } = await schoolSearchSupabase
      .from('udise_private_schools')
      .select('block_name')
      .ilike('district_name', toFlexiblePattern(query.districtName))
      .limit(2000);

    const blockMap = new Map<string, number>();
    if (blockSample) {
      for (const b of blockSample) {
        if (b.block_name) {
          const bName = b.block_name.trim();
          blockMap.set(bName, (blockMap.get(bName) || 0) + 1);
        }
      }
    }

    Array.from(blockMap.entries()).forEach(([name, bCount]) => {
      subLocations.push({
        name: name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' '),
        slug: nameToSlug(name),
        schoolCount: bCount,
        type: 'block',
        href: `/school/india/${query.stateSlug}/${query.districtSlug}/${nameToSlug(name)}`
      });
    });
    subLocations.sort((a, b) => b.schoolCount - a.schoolCount);
  } else if (query.level === 'block' && query.blockName) {
    // Fetch distinct villages in block
    const { data: villageSample } = await schoolSearchSupabase
      .from('udise_private_schools')
      .select('village_ward_name')
      .ilike('block_name', toFlexiblePattern(query.blockName))
      .limit(1000);

    const vMap = new Map<string, number>();
    if (villageSample) {
      for (const v of villageSample) {
        if (v.village_ward_name) {
          const vName = v.village_ward_name.trim();
          vMap.set(vName, (vMap.get(vName) || 0) + 1);
        }
      }
    }

    Array.from(vMap.entries()).forEach(([name, vCount]) => {
      subLocations.push({
        name: name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' '),
        slug: nameToSlug(name),
        schoolCount: vCount,
        type: 'village',
        href: `/school/india/${query.stateSlug}/${query.districtSlug}/${query.blockSlug}/${nameToSlug(name)}`
      });
    });
    subLocations.sort((a, b) => b.schoolCount - a.schoolCount);
  }

  // Calculate stats from results
  let totalStudents = 0;
  let totalTeachers = 0;
  let atlCount = 0;
  let cbseCount = 0;

  for (const s of schools) {
    totalStudents += Number(s.total_students) || 0;
    totalTeachers += Number(s.total_teachers) || 0;
    if (s.tinkering_lab_atl === 'Yes' || s.tinkering_lab_atl === true) atlCount++;
    if (s.board?.toLowerCase().includes('cbse')) cbseCount++;
  }

  const result: HierarchyPageData = {
    query,
    totalCount,
    schools,
    subLocations,
    stats: {
      totalSchools: totalCount,
      totalStudents,
      totalTeachers,
      atlCount,
      cbseCount
    },
    currentPage: page,
    totalPages: Math.max(Math.ceil(totalCount / limit), 1),
    limit
  };

  HIERARCHY_CACHE.set(cacheKey, { data: result, timestamp: Date.now() });
  return result;
}
