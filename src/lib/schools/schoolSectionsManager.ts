import fs from 'fs';
import path from 'path';
import { schoolSearchSupabase } from '@/integrations/supabase/schoolSearchClient';
import {
  limitLength,
  ALL_PREDEFINED_FACILITIES,
} from '@/components/schools/template/SchoolJsonSchemaHelper';

const DATA_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'school_ai_sync_tokens.json');

export const SECTION_METADATA: Record<
  string,
  {
    id: string;
    name: string;
    description: string;
    aliases: string[];
    field_rules: Record<
      string,
      {
        type: string;
        max_chars?: number;
        min_chars?: number;
        max_items?: number;
        max_rows?: number;
        max_cols?: number;
        allowed_types?: string[];
        description: string;
        required?: boolean;
      }
    >;
  }
> = {
  basic_info: {
    id: 'basic_info',
    name: 'Basic Institutional Identity',
    description: 'School name, UDISE code, affiliated board, medium, established year, management, category, and branding.',
    aliases: ['section_1_basic_info', 'identity', 'basic', 'general'],
    field_rules: {
      school_name: { type: 'string', max_chars: 65, min_chars: 3, required: true, description: 'Official School Name' },
      udise_code: { type: 'string', max_chars: 11, min_chars: 11, required: true, description: '11-digit Government UDISE code' },
      board: { type: 'string', max_chars: 50, required: true, description: 'Affiliated educational board (CBSE/ICSE/State Board)' },
      medium: { type: 'string', max_chars: 35, description: 'Primary instruction medium' },
      established_year: { type: 'string', max_chars: 10, description: 'Year founded or established' },
      campus_area: { type: 'string', max_chars: 25, description: 'Total campus land area' },
      school_type: { type: 'string', max_chars: 40, description: 'Management type (Private, Govt, Aided)' },
      school_category: { type: 'string', max_chars: 45, description: 'Category (Primary, Secondary, Sr. Secondary)' },
      gender_type: { type: 'string', allowed_types: ['Co-Educational', 'Boys', 'Girls'], description: 'Student gender format' },
      affiliation_number: { type: 'string', max_chars: 30, description: 'Official board affiliation number' },
      'branding.logo_image_url': { type: 'image_url', max_chars: 500, description: 'School crest or logo URL' },
      'branding.hero_banner_image': { type: 'image_url', max_chars: 500, description: 'Wide hero background cover image URL' },
    },
  },
  hero: {
    id: 'hero',
    name: 'Hero Banner & Prestige Metrics',
    description: 'Hero cover image, admissions status, boarding/nature status, and floating attraction metrics.',
    aliases: ['section_2_hero_prestige_metrics', 'home', 'hero_section', 'hero_metrics', 'banner'],
    field_rules: {
      heading_line1: { type: 'string', max_chars: 45, description: 'Primary headline first line (e.g. Play, Learn and)' },
      heading_line2: { type: 'string', max_chars: 45, description: 'Primary headline colored line (e.g. Grow, Together..)' },
      tagline: { type: 'string', max_chars: 90, description: 'Eyebrow punchline or slogan' },
      description: { type: 'string', max_chars: 350, min_chars: 40, description: 'Introductory campus narrative paragraph' },
      admissions_open: { type: 'boolean', description: 'Whether fresh admissions are currently open' },
      boarding_status: { type: 'string', allowed_types: ['Day School', 'Residential School', 'Day Boarding'], description: 'Campus residential nature' },
      helpline_phone: { type: 'string', max_chars: 20, description: 'Top header quick admission helpline contact' },
      cta_enroll_text: { type: 'string', max_chars: 25, description: 'Primary action pill button text (Enroll Now)' },
      cta_video_text: { type: 'string', max_chars: 25, description: 'Secondary action pill button text (Watch Video)' },
      hero_media_items: { type: 'array', max_items: 5, allowed_types: ['image', 'video', 'gif'], description: 'Rotating circular showcase media items (Max 5 photos/videos)' },
      'prestige_metrics.metric_1_board_results': { type: 'string', max_chars: 14, description: 'Metric card 1 value (e.g. CBSE)' },
      'prestige_metrics.metric_2_student_teacher_ratio': { type: 'string', max_chars: 14, description: 'Metric card 2 value (e.g. 1:18)' },
      'prestige_metrics.metric_3_classrooms_labs': { type: 'string', max_chars: 14, description: 'Metric card 3 value (e.g. 24+)' },
      'prestige_metrics.metric_4_class_range': { type: 'string', max_chars: 14, description: 'Metric card 4 value (e.g. Class 1-12)' },
    },
  },
  stats: {
    id: 'stats',
    name: 'Physical Campus Statistics',
    description: 'Total students, boys/girls breakdown, teachers count, classrooms, smart boards, and STR ratio.',
    aliases: ['section_4_statistics', 'metrics', 'statistics', 'key_metrics'],
    field_rules: {
      total_students: { type: 'number', description: 'Total student strength enrolled' },
      total_teachers: { type: 'number', description: 'Total faculty teachers employed' },
      student_teacher_ratio: { type: 'string', max_chars: 10, description: 'Student-Teacher Ratio (STR)' },
      classrooms_count: { type: 'number', description: 'Total instructional classrooms available' },
      working_smart_boards: { type: 'number', description: 'Count of functional interactive smart boards' },
      campus_area: { type: 'string', max_chars: 25, description: 'Total campus land area' },
      board: { type: 'string', max_chars: 25, description: 'Indicator card 1: Affiliated Board' },
      school_nature: { type: 'string', max_chars: 25, description: 'Indicator card 2: Day / Residential status' },
      management_type: { type: 'string', max_chars: 30, description: 'Indicator card 3: Management Type' },
      medium: { type: 'string', max_chars: 25, description: 'Indicator card 4: Instruction Medium' },
      gender_type: { type: 'string', max_chars: 25, description: 'Indicator card 5: Student Gender' },
    },
  },
  about: {
    id: 'about',
    name: 'About School, Vision & Mission',
    description: 'Heritage description, educational philosophy, institutional vision, and core mission.',
    aliases: ['section_5_about_and_vision', 'vision', 'mission', 'heritage'],
    field_rules: {
      about_eyebrow: { type: 'string', max_chars: 35, description: 'Section top eyebrow badge' },
      about_heading_l1: { type: 'string', max_chars: 35, description: 'Main title line 1' },
      about_heading_l2: { type: 'string', max_chars: 35, description: 'Main title line 2' },
      about_text: { type: 'string', max_chars: 1200, min_chars: 50, description: 'Core narrative describing institutional pedagogy & history' },
      vision_text: { type: 'string', max_chars: 400, description: 'Long-term institutional vision' },
      mission_text: { type: 'string', max_chars: 400, description: 'Core academic and experiential mission' },
      about_badge_text: { type: 'string', max_chars: 30, description: 'Floating badge text on campus image' },
      about_campus_photo: { type: 'image_url', max_chars: 500, description: 'Arched architecture photo URL' },
      cta_text: { type: 'string', max_chars: 30, description: 'Story CTA button text' },
      heritage_years: { type: 'string', max_chars: 30, description: 'Years of academic legacy' },
    },
  },
  principal: {
    id: 'principal',
    name: "Principal's Desk & Leadership Message",
    description: 'Principal full name, designation, portrait photo, and official welcome message.',
    aliases: ['section_6_principal_desk', 'leadership', 'principal_desk', 'headmaster'],
    field_rules: {
      principal_eyebrow: { type: 'string', max_chars: 35, description: 'Top eyebrow text' },
      principal_heading_l1: { type: 'string', max_chars: 35, description: 'Heading line 1' },
      principal_heading_l2: { type: 'string', max_chars: 35, description: 'Heading line 2' },
      principal_name: { type: 'string', max_chars: 60, required: true, description: 'Full name of Principal / Head of School' },
      principal_designation: { type: 'string', max_chars: 50, description: 'Official designation title' },
      principal_quote: { type: 'string', max_chars: 250, description: 'Inspirational headline quote block' },
      principal_body_1: { type: 'string', max_chars: 600, description: 'Welcome narrative paragraph 1' },
      principal_body_2: { type: 'string', max_chars: 600, description: 'Welcome narrative paragraph 2' },
      principal_tagline: { type: 'string', max_chars: 40, description: 'Leadership commitment phrase' },
      principal_image_url: { type: 'image_url', max_chars: 500, description: 'Circular portrait photo URL' },
      principal_phone: { type: 'string', max_chars: 20, description: 'Direct office contact number' },
      principal_email: { type: 'string', max_chars: 60, description: 'Direct office email address' },
    },
  },
  management: {
    id: 'management',
    name: 'Governing Body & Management Message',
    description: 'Managing committee/society name, designation, official seal, and governance vision.',
    aliases: ['section_management_desk', 'governing_body', 'society', 'management_desk'],
    field_rules: {
      mgmt_eyebrow: { type: 'string', max_chars: 35, description: 'Top eyebrow text' },
      mgmt_heading_prefix: { type: 'string', max_chars: 25, description: 'Heading prefix' },
      mgmt_heading: { type: 'string', max_chars: 60, description: 'Management headline title' },
      management_name: { type: 'string', max_chars: 70, description: 'Chairperson or President full name' },
      management_society: { type: 'string', max_chars: 90, description: 'Registered Society or Trust name' },
      management_designation: { type: 'string', max_chars: 60, description: 'Official designation title' },
      management_quote: { type: 'string', max_chars: 250, description: 'Governing vision quote' },
      management_message_p1: { type: 'string', max_chars: 600, description: 'Management vision narrative paragraph 1' },
      management_message_p2: { type: 'string', max_chars: 600, description: 'Management vision narrative paragraph 2' },
      management_logo: { type: 'image_url', max_chars: 500, description: 'Trust emblem or official seal image URL' },
    },
  },
  academics: {
    id: 'academics',
    name: 'Curriculum, Streams & Special Programs',
    description: 'Class range, curriculum features, NEP 2020 pedagogical highlights, and senior secondary streams.',
    aliases: ['section_7_academics', 'curriculum', 'streams', 'classes'],
    field_rules: {
      class_from: { type: 'string', max_chars: 10, description: 'Starting class (e.g. Nursery, 1)' },
      class_to: { type: 'string', max_chars: 10, description: 'Final class (e.g. 10, 12)' },
      class_range: { type: 'string', max_chars: 35, description: 'Formatted class range string' },
      curriculum_features: { type: 'array', max_items: 8, description: 'Pedagogical highlights (Max 8 points, 100 chars each)' },
      stream_categories: { type: 'array', max_items: 6, description: 'Sr. Secondary academic streams with subject lists' },
    },
  },
  results: {
    id: 'results',
    name: 'Board Examination Results',
    description: 'Class 10th and 12th board results, pass percentages, toppers, and stream-wise distinctions.',
    aliases: ['board_results', 'exam_results', 'academic_results'],
    field_rules: {
      class10Results: { type: 'array', max_items: 5, description: 'Class 10th board results history (Max 5 academic years)' },
      class12Results: { type: 'array', max_items: 5, description: 'Class 12th board results history with streams (Max 5 academic years)' },
    },
  },
  facilities: {
    id: 'facilities',
    name: 'Facilities & Campus Infrastructure',
    description: 'Catalogue of 62+ verified facilities, science/computer/STEM labs, sports grounds, and safety infrastructure.',
    aliases: ['section_8_facilities', 'infrastructure', 'amenities', 'labs'],
    field_rules: {
      facilities_eyebrow: { type: 'string', max_chars: 35, description: 'Section top eyebrow' },
      facilities_heading: { type: 'string', max_chars: 50, description: 'Section headline' },
      facilities_list: { type: 'array', max_items: 62, description: 'Catalogue of 62 standardized facilities with selection status' },
      all_facilities_count: { type: 'number', description: 'Total standardized facilities supported (62)' },
    },
  },
  gallery: {
    id: 'gallery',
    name: 'Campus Photo & Video Gallery',
    description: 'Categorized campus photos (Campus, Labs, Sports, Events) and virtual walkthrough videos.',
    aliases: ['section_9_campus_gallery', 'campus_gallery', 'photos', 'videos'],
    field_rules: {
      gallery_eyebrow: { type: 'string', max_chars: 35, description: 'Section eyebrow' },
      gallery_heading: { type: 'string', max_chars: 60, description: 'Section title' },
      gallery_items: { type: 'array', max_items: 30, allowed_types: ['image', 'video'], description: 'Categorized campus gallery items (Max 30 items)' },
      categories: { type: 'array', allowed_types: ['All', 'Campus', 'Labs', 'Sports', 'Events', 'Classrooms'], description: 'Valid category filter tabs' },
      campus_video_url: { type: 'url', max_chars: 500, description: 'YouTube/MP4 campus walkthrough video URL' },
    },
  },
  fees: {
    id: 'fees',
    name: 'Transparent Fee Structure Table',
    description: 'Grade-wise tuition fees, annual charges, development fees, and scholarship criteria.',
    aliases: ['section_10_fee_structure', 'fee_structure', 'tuition'],
    field_rules: {
      annual_fee: { type: 'string', max_chars: 30, description: 'Estimated annual fee summary or range' },
      fee_table: { type: 'object', max_rows: 15, max_cols: 6, description: 'Class-wise composite tuition fee breakdown table' },
      extra_charges_table: { type: 'object', max_rows: 10, max_cols: 5, description: 'Admission & one-time caution fee breakdown table' },
      fee_terms_list: { type: 'array', max_items: 10, description: 'Fee policies & concessions list (Max 10 terms)' },
      admission_phone: { type: 'string', max_chars: 20, description: 'Fee desk inquiry telephone' },
      admission_email: { type: 'string', max_chars: 60, description: 'Fee desk inquiry email' },
    },
  },
  admissions: {
    id: 'admissions',
    name: 'Admissions Guidelines & Criteria',
    description: 'Current academic session, admission status, age eligibility, required documents, and process cards.',
    aliases: ['section_11_admissions_guidelines', 'admission_guidelines', 'process'],
    field_rules: {
      session: { type: 'string', max_chars: 15, description: 'Active academic session (e.g. 2026-27)' },
      admissions_open: { type: 'boolean', description: 'Whether online application is currently active' },
      admission_phone: { type: 'string', max_chars: 20, description: 'Admissions helpline contact' },
      admission_email: { type: 'string', max_chars: 60, description: 'Admissions desk email' },
      required_documents: { type: 'array', max_items: 10, description: 'Mandatory documentation checklist' },
      age_criteria: { type: 'string', max_chars: 120, description: 'Minimum age eligibility guideline' },
      admissions_cards: { type: 'array', max_items: 6, description: 'Stage-wise admission process cards (Max 6)' },
    },
  },
  faqs: {
    id: 'faqs',
    name: 'Frequently Asked Questions (FAQs)',
    description: 'Categorized parent inquiries and authentic answers covering admissions, transport, fees, and sports.',
    aliases: ['section_12_faqs', 'faq', 'frequently_asked_questions'],
    field_rules: {
      faq_items: { type: 'array', max_items: 25, description: 'List of frequently asked questions and answers (Max 25)' },
      'faq_item.question': { type: 'string', max_chars: 150, description: 'Question text' },
      'faq_item.answer': { type: 'string', max_chars: 600, description: 'Answer text' },
    },
  },
  contact: {
    id: 'contact',
    name: 'Official Contact Channels & Campus Location',
    description: 'Postal address, village/locality, block, district, PIN code, phones, emails, website, and social links.',
    aliases: ['section_13_contact_details', 'contact_details', 'location', 'address'],
    field_rules: {
      address: { type: 'string', max_chars: 200, required: true, description: 'Complete street and postal address' },
      pincode: { type: 'string', max_chars: 6, min_chars: 6, required: true, description: '6-digit Postal PIN code' },
      latitude: { type: 'number', description: 'GPS decimal latitude coordinate' },
      longitude: { type: 'number', description: 'GPS decimal longitude coordinate' },
      website: { type: 'url', max_chars: 150, description: 'Official institutional website URL' },
      campus_video_url: { type: 'url', max_chars: 500, description: 'Virtual walkthrough video URL' },
      social_links: { type: 'object', description: 'Social media profile links (Facebook, Instagram, YouTube)' },
      desks: { type: 'object', description: '4 Dedicated campus contact desks (general, admissions, principal, careers)' },
    },
  },
  careers: {
    id: 'careers',
    name: 'Careers & Faculty Recruitment',
    description: 'Official school website faculty vacancies (with published_date, vacancy_age, and is_new check), eligibility criteria, and HR contact.',
    aliases: ['section_14_careers', 'jobs', 'recruitment', 'vacancies'],
    field_rules: {
      heading: { type: 'string', max_chars: 100, description: 'Career section headline' },
      subheading: { type: 'string', max_chars: 250, description: 'Career section subheadline' },
      official_careers_page_url: { type: 'url', max_chars: 300, description: 'Official school website recruitment/vacancy page URL' },
      contact_email: { type: 'email', max_chars: 100, description: 'Careers HR email' },
      contact_phone: { type: 'string', max_chars: 25, description: 'Careers HR phone' },
      openings: {
        type: 'array',
        description: 'List of verified NEW job vacancies from the school official website (must include published_date, vacancy_age, vacancy_age_days, is_new: true, official_vacancy_url; otherwise empty array [])',
      },
    },
  },
};

/**
 * Normalizes any section alias to its canonical ID
 */
export function resolveSectionId(alias: string): string | null {
  if (!alias) return null;
  const clean = alias.trim().toLowerCase().replace(/[-]/g, '_');
  if (SECTION_METADATA[clean]) return clean;

  for (const [key, meta] of Object.entries(SECTION_METADATA)) {
    if (key === clean || meta.aliases.includes(clean)) {
      return key;
    }
  }
  return null;
}

/**
 * Reads local sync store from JSON file safely
 */
export function readSyncStore(): { tokens: Record<string, any> } {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const raw = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
      const store = JSON.parse(raw);
      if (store && typeof store.tokens === 'object') return store;
    }
  } catch (err) {
    console.warn('Error reading school_ai_sync_tokens.json:', err);
  }
  return { tokens: {} };
}

/**
 * Writes sync store to JSON file safely
 */
export function writeSyncStore(store: { tokens: Record<string, any> }) {
  try {
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing school_ai_sync_tokens.json:', err);
  }
}

/**
 * Finds token record for a school by UDISE code
 */
export function findSchoolTokenRecord(cleanUdise: string, store: { tokens: Record<string, any> }): { tokenKey: string; record: any } | null {
  const normTarget = cleanUdise.replace(/[^a-z0-9]/gi, '').toLowerCase();
  let bestMatch: { tokenKey: string; record: any } | null = null;

  for (const [tKey, rec] of Object.entries(store.tokens)) {
    const recSchoolId = (rec.schoolId || '').replace(/[^a-z0-9]/gi, '').toLowerCase();
    const recUdise = (rec.profileData?.udiseCode || '').replace(/[^a-z0-9]/gi, '').toLowerCase();

    if (recSchoolId === normTarget || recUdise === normTarget) {
      if (!bestMatch || (Number(rec.lastUpdatedAt || 0) >= Number(bestMatch.record.lastUpdatedAt || 0))) {
        bestMatch = { tokenKey: tKey, record: rec };
      }
    }
  }

  return bestMatch;
}

/**
 * Fetches base school row from Supabase udise_private_schools
 */
export async function fetchBaseSchoolRow(cleanUdise: string): Promise<any | null> {
  const { data, error } = await schoolSearchSupabase
    .from('udise_private_schools')
    .select('*')
    .eq('udise_code', cleanUdise)
    .single();

  if (error || !data) {
    // Try uppercase/lowercase match
    const { data: fallbackData } = await schoolSearchSupabase
      .from('udise_private_schools')
      .select('*')
      .ilike('udise_code', cleanUdise)
      .limit(1);

    if (fallbackData && fallbackData.length > 0) return fallbackData[0];
    return null;
  }
  return data;
}

/**
 * Compiles section-by-section data from DB record + synced profileData
 */
export function extractSectionsFromData(baseRow: any | null, profileData: any | null): Record<string, any> {
  const p = profileData || {};
  const b = baseRow || {};

  const cleanBoard = p.board || b.board_12th || b.board_10th || 'CBSE';
  const cleanMedium = p.medium || b.primary_medium || 'Hindi & English';
  const cleanResidential = p.residentialSchool || p.schoolFormat || b.residential_school || (p.isResidential ? 'Residential School' : 'Day School');
  const cleanSTR = (Number(b.total_students || p.totalStudents) && Number(b.total_teachers || p.totalTeachers))
    ? `1:${Math.round(Number(b.total_students || p.totalStudents) / Number(b.total_teachers || p.totalTeachers))}`
    : (p.contentOverrides?.['hero_stat_val_2'] || '1:20');

  const secVis = p.sectionVisibility || {};
  const isSectionVisible = (id: string) => secVis[id] !== false;

  return {
    basic_info: {
      isVisible: isSectionVisible('basic_info'),
      school_name: p.schoolName || b.school_name || '',
      udise_code: b.udise_code || p.udiseCode || '',
      board: cleanBoard,
      medium: cleanMedium,
      established_year: p.establishedYear || b.established_year || '',
      campus_area: p.campusArea || '',
      school_type: p.schoolType || b.management_desc || '',
      management: p.management || p.schoolType || b.management_desc || '',
      school_category: p.schoolCategory || b.school_category || '',
      gender_type: p.genderType || b.gender_type || 'Co-Educational',
      affiliation_number: p.affiliationNumber !== undefined ? p.affiliationNumber : (b.affiliation_number || ''),
      logo_image_url: p.logoImage || '',
      hero_banner_image: p.heroImage || b.image_url || '',
      branding: {
        logo_image_url: p.logoImage || '',
        hero_banner_image: p.heroImage || b.image_url || '',
      },
    },

    hero: {
      isVisible: isSectionVisible('hero'),
      school_name: p.schoolName || b.school_name || '',
      udise_code: b.udise_code || p.udiseCode || '',
      affiliated_board: cleanBoard,
      heading_line1: p.contentOverrides?.['hero_heading_line1'] || 'Play, Learn and',
      heading_line2: p.contentOverrides?.['hero_heading_line2'] || 'Grow, Together..',
      tagline: p.contentOverrides?.['hero_tagline'] || '',
      description: p.contentOverrides?.['hero_desc_main'] || '',
      admissions_open: p.admissionsOpen ?? true,
      boarding_status: cleanResidential,
      residential_school: cleanResidential,
      helpline_phone: p.phone || p.generalPhone || p.contact?.phone || b.phone || '',
      cta_enroll_text: p.contentOverrides?.['hero_cta_enroll'] || 'Enroll Now',
      cta_video_text: p.contentOverrides?.['hero_cta_video_pill'] || 'Watch Video',
      banner_image: p.heroImage || b.image_url || '',
      prestige_metrics: {
        metric_1_board_results: {
          value: p.contentOverrides?.['hero_stat_val_1'] || cleanBoard,
          label: p.contentOverrides?.['hero_stat_lbl_1'] || 'Affiliated Board',
        },
        metric_2_student_teacher_ratio: {
          value: p.contentOverrides?.['hero_stat_val_2'] || cleanSTR,
          label: p.contentOverrides?.['hero_stat_lbl_2'] || 'Student-Teacher Ratio',
        },
        metric_3_classrooms_labs: {
          value: p.contentOverrides?.['hero_stat_val_3'] || `${b.total_classrooms || p.classroomsCount || 20}+`,
          label: p.contentOverrides?.['hero_stat_lbl_3'] || 'Classrooms & Labs',
        },
        metric_4_class_range: {
          value: p.contentOverrides?.['hero_stat_val_4'] || (b.class_from ? `Class ${b.class_from}-${b.class_to}` : 'Class 1-12'),
          label: p.contentOverrides?.['hero_stat_lbl_4'] || 'Class Range',
        },
      },
      hero_media_items: (p.heroMediaItems && p.heroMediaItems.length > 0)
        ? p.heroMediaItems
        : (p.heroImage || b.image_url)
        ? [
            {
              id: 'media-1',
              type: 'image',
              url: p.heroImage || b.image_url,
              title: `${p.schoolName || b.school_name || 'School'} Campus`,
            },
          ]
        : [],
    },

    stats: {
      isVisible: isSectionVisible('stats'),
      total_students: Number(b.total_students || p.totalStudents) || 0,
      total_boys: Number(b.total_boys || p.totalBoys) || 0,
      total_girls: Number(b.total_girls || p.totalGirls) || 0,
      total_teachers: Number(b.total_teachers || p.totalTeachers) || 0,
      male_teachers: Number(b.male_teachers || p.maleTeachers) || 0,
      female_teachers: Number(b.female_teachers || p.femaleTeachers) || 0,
      classrooms_count: Number(b.total_classrooms || p.classroomsCount) || 0,
      working_smart_boards: Number(b.working_smart_boards || p.workingSmartBoards) || 0,
      student_teacher_ratio: cleanSTR,
      is_residential: cleanResidential.toLowerCase().includes('residential'),
      residential_school: cleanResidential,
      has_hostel: Boolean(p.hasHostel),
      campus_area: p.campusArea || '',
      board: p.contentOverrides?.['hero_stat_val_1'] || cleanBoard,
      school_nature: p.contentOverrides?.['hero_stat_val_nature'] || cleanResidential,
      management_type: p.contentOverrides?.['hero_stat_val_mgmt'] || p.management || b.management_desc || 'Government',
      medium: p.contentOverrides?.['hero_stat_val_med'] || cleanMedium,
      gender_type: p.contentOverrides?.['hero_stat_val_gender'] || p.genderType || b.gender_type || 'Co-Educational',
    },

    about: {
      isVisible: isSectionVisible('about'),
      about_eyebrow: p.contentOverrides?.['about_eyebrow'] || 'ABOUT OUR INSTITUTION',
      about_heading_l1: p.contentOverrides?.['about_heading_l1'] || 'More Than Just',
      about_heading_l2: p.contentOverrides?.['about_heading_l2'] || 'An Education..',
      about_text: p.aboutText || `${b.school_name || 'This school'} is a premier educational institution committed to fostering academic brilliance and moral integrity.`,
      vision_text: p.visionText || 'To nurture independent and visionary leaders through holistic and experiential learning.',
      mission_text: p.missionText || 'To deliver rigorous academic education, cultivate critical thinking, and support inclusive development.',
      about_badge_text: p.contentOverrides?.['about_badge_text'] || 'Excellence in Action',
      about_campus_photo: p.imageOverrides?.['about_campus_photo'] || b.image_url || '/images/categories/school.jpg',
      cta_text: p.contentOverrides?.['about_cta_btn'] || 'Discover Our Story',
      heritage_years: b.established_year ? `${new Date().getFullYear() - Number(b.established_year)}+ Years Legacy` : 'Established Legacy',
      established_year: b.established_year || p.establishedYear || '',
    },

    principal: {
      isVisible: isSectionVisible('principal'),
      principal_eyebrow: p.contentOverrides?.['principal_eyebrow'] || "FROM THE PRINCIPAL'S DESK",
      principal_heading_l1: p.contentOverrides?.['principal_heading_l1'] || 'Inspiring Leadership,',
      principal_heading_l2: p.contentOverrides?.['principal_heading_l2'] || 'Nurturing Excellence..',
      principal_name: p.principalName || b.principal_name || 'Principal / Headmaster',
      principal_designation: p.contentOverrides?.['principal_designation'] || 'Principal & Head of School',
      principal_quote: p.contentOverrides?.['principal_quote'] || 'True education is not merely the learning of facts, but the training of the mind to think critically, act ethically, and live compassionately.',
      principal_body_1: p.contentOverrides?.['principal_body_1'] || 'At our institution, we believe every child arrives with unique curiosity and innate genius. Our dedicated faculty works tirelessly to build a safe, stimulating environment where young scholars test boundaries, conduct hands-on experiments, and develop resilience.',
      principal_body_2: p.contentOverrides?.['principal_body_2'] || 'We partner closely with parents and the wider community to instill strong moral compasses alongside 21st-century technological fluency. Together, we are nurturing compassionate architects of tomorrow.',
      principal_tagline: p.contentOverrides?.['principal_tagline'] || 'Nurturing Global Visionaries',
      principal_image_url: p.imageOverrides?.['principal_photo'] || p.imageOverrides?.['principal_avatar'] || '/images/teachers/verified-teacher-avatar-placeholder.webp',
      principal_phone: p.principalPhone || b.phone || '',
      principal_email: p.principalEmail || b.email || '',
    },

    management: {
      isVisible: isSectionVisible('management'),
      mgmt_eyebrow: p.contentOverrides?.['mgmt_eyebrow'] || 'GOVERNING BODY & MANAGEMENT',
      mgmt_heading_prefix: p.contentOverrides?.['mgmt_heading_prefix'] || 'Message from',
      mgmt_heading: p.contentOverrides?.['mgmt_heading'] || 'School Management & Governing Trust',
      management_name: p.contentOverrides?.['mgmt_chairperson'] || b.management_desc || 'School Management Committee',
      management_society: p.contentOverrides?.['mgmt_society_name'] || b.management_desc || 'Educational Society / Trust',
      management_designation: p.contentOverrides?.['mgmt_designation'] || 'Governing Council / Managing Committee',
      management_quote: p.contentOverrides?.['mgmt_quote'] || 'Our vision is to provide state-of-the-art educational infrastructure and mentorship for every child.',
      management_message_p1: p.contentOverrides?.['mgmt_message_p1'] || 'Our vision is to provide state-of-the-art educational infrastructure and mentorship for every child.',
      management_message_p2: p.contentOverrides?.['mgmt_message_p2'] || 'We are dedicated to sustainable growth, innovation in pedagogy, and nurturing holistic student excellence.',
      management_logo: p.imageOverrides?.['mgmt_seal'] || '',
    },

    academics: {
      isVisible: isSectionVisible('academics'),
      class_from: b.class_from || p.classFrom || '1',
      class_to: b.class_to || p.classTo || '12',
      class_range: `Class ${b.class_from || p.classFrom || '1'} to Class ${b.class_to || p.classTo || '12'}`,
      curriculum_features: p.includedAcademicFeatures || [
        `${cleanBoard} Aligned Curriculum with NEP 2020 Pedagogical Framework`,
        'Interactive Smart Boards & Digital Learning Modules in Classrooms',
        'Continuous Remedial Mentoring with Dedicated Faculty Guidance',
        'Experiential STEM Practicals and Activity-Based Learning',
      ],
      stream_categories: p.academicStreams || [
        { name: 'Science (Medical)', subjects: ['Physics', 'Chemistry', 'Biology', 'English Core'] },
        { name: 'Science (Non-Medical)', subjects: ['Physics', 'Chemistry', 'Mathematics', 'Computer Science'] },
        { name: 'Commerce', subjects: ['Accountancy', 'Business Studies', 'Economics', 'Mathematics'] },
        { name: 'Humanities / Arts', subjects: ['History', 'Geography', 'Political Science', 'Psychology'] },
      ],
      streams_offered: [
        'Science (Physics, Chemistry, Mathematics, Biology, Computer Science)',
        'Commerce (Accountancy, Business Studies, Economics, Mathematics)',
        'Humanities / Arts (History, Political Science, Psychology, Sociology)',
      ],
    },

    results: {
      isVisible: isSectionVisible('results'),
      class10Results: p.boardResults?.class10Results || [
        {
          year: '2024-25',
          totalStudents: 85,
          passedStudents: 85,
          passPercentage: 100,
          maxScorePercent: 98.4,
          above90PercentCount: 28,
        },
      ],
      class12Results: p.boardResults?.class12Results || [
        {
          year: '2024-25',
          totalStudents: 74,
          passedStudents: 74,
          passPercentage: 100,
          maxScorePercent: 99.2,
          above90PercentCount: 31,
        },
      ],
    },

    facilities: {
      isVisible: isSectionVisible('facilities'),
      facilities_eyebrow: p.contentOverrides?.['facilities_eyebrow'] || 'OUR CAMPUS INFRASTRUCTURE',
      facilities_heading: p.contentOverrides?.['facilities_heading'] || 'Campus Facilities & Learning Infrastructure',
      selected_facility_names: (Array.isArray(p.facilities) && p.facilities.length > 0)
        ? p.facilities.filter((f: any) => f.selected !== false).map((f: any) => f.name)
        : (Array.isArray(p.selected_facility_names) ? p.selected_facility_names : [
            'Smart Classes',
            'Library',
            'Computer Lab',
            'Physics Lab',
            'Playground / Outdoor Sports',
            'Drinking Water',
          ]),
      all_facilities_count: ALL_PREDEFINED_FACILITIES.length,
      facilities_list: Array.isArray(p.facilities) ? p.facilities : ALL_PREDEFINED_FACILITIES.slice(0, 12),
    },

    gallery: {
      isVisible: isSectionVisible('gallery'),
      gallery_eyebrow: 'VISUAL CAMPUS TOUR',
      gallery_heading: 'Campus Gallery, Modern Architecture & Learning Spaces',
      gallery_items: p.galleryItems || [
        {
          id: 'gal-1',
          title: 'Campus Front View',
          category: 'Campus',
          type: 'image',
          url: b.image_url || '/images/categories/school.jpg',
        },
      ],
      categories: ['All', 'Campus', 'Labs', 'Sports', 'Events', 'Classrooms'],
      campus_video_url: p.campusVideoUrl || '',
    },

    fees: {
      isVisible: isSectionVisible('fees'),
      annual_fee: b.annual_fee || '₹15,000 - ₹35,000',
      fee_table: p.feeTableData || {
        columns: ['Class Level', 'Quarterly Tuition', 'Annual Fee', 'Total Estimated'],
        rows: [
          ['Primary (Class 1 to 5)', '₹4,500', '₹2,500', '₹20,500'],
          ['Middle (Class 6 to 8)', '₹6,000', '₹3,000', '₹27,000'],
          ['Secondary (Class 9 & 10)', '₹8,500', '₹4,000', '₹38,000'],
        ],
      },
      extra_charges_table: p.extraChargesTableData || {
        columns: ['Charge Category', 'Frequency', 'Applicable Amount', 'Remarks'],
        rows: [
          ['Admission Fee (One-time)', 'At Admission', '₹5,000', 'Non-refundable registration & documentation'],
          ['Security / Caution Deposit', 'At Admission', '₹3,000', 'Refundable upon issuance of School TC'],
          ['Annual Composite Charges', 'Annual', '₹4,500', 'Covers Lab Consumables, Library & ICT'],
        ],
      },
      fee_terms_list: p.feeTermsList || [
        { id: 'term-1', category: 'Due Date', title: 'Quarterly Remittance Due Date', description: 'School fees must be deposited on or before the 10th of every scheduled quarter.' },
        { id: 'term-2', category: 'Payment Modes', title: 'Accepted Digital & Bank Payment Modes', description: 'Payments are accepted via Online Portal, Net Banking, UPI, and Demand Drafts.' },
        { id: 'term-3', category: 'Refund & TC', title: 'Withdrawal & Caution Money Policy', description: 'A minimum of 30 days prior written notice is required for TC issuance.' },
        { id: 'term-4', category: 'Concessions', title: 'Sibling & Merit Concession Policy', description: '10% concession on tuition fees for younger siblings.' },
      ],
      admission_phone: p.admissionPhone || p.phone || '',
      admission_email: p.admissionEmail || p.email || '',
      official_fee_page_url: p.officialFeeUrl || p.fees?.official_fee_page_url || '',
    },

    admissions: {
      isVisible: isSectionVisible('admissions'),
      session: '2026-27',
      admission_status: p.admissionsOpen ? 'Admissions Open' : 'Open for Session 2026-27',
      admissions_open: p.admissionsOpen ?? true,
      admission_phone: p.admissionPhone || p.phone || '',
      admission_email: p.admissionEmail || p.email || '',
      official_admissions_page_url: p.officialAdmissionsUrl || p.admissions_page_url || '',
      required_documents: [
        'Official Birth Certificate copy',
        'Student & Parents Aadhaar Card copy',
        'Transfer Certificate (TC) from previous school',
        'Previous Academic Year Report Card / Marksheet',
        'Passport Size Photographs (4 Copies)',
      ],
      age_criteria: 'Minimum 6 years of age as on 31st March for Class 1 (as per NEP 2020)',
      admissions_cards: p.admissions || [
        {
          id: 'adm-1',
          title: 'Primary Fresh Admissions',
          criteria: 'Age 5+ as per NEP 2020. Interaction with child and parents.',
          badge: 'Session 2026-27 Open',
          icon: 'Baby',
          points: ['Birth Certificate', 'Aadhaar Card copy', 'Previous School TC (if applicable)'],
        },
      ],
    },

    faqs: {
      isVisible: isSectionVisible('faqs'),
      faq_items: p.faqs || [
        {
          id: 'faq-1',
          question: 'What is the admission procedure for this school?',
          answer: 'Parents can fill the online application or visit the campus admission desk. Shortlisted applicants undergo interaction followed by document submission.',
          category: 'Admissions',
        },
        {
          id: 'faq-2',
          question: 'Does the school provide transport facilities?',
          answer: 'Yes, modern GPS-tracked, CCTV-monitored buses cover major routes in the district.',
          category: 'Facilities',
        },
        {
          id: 'faq-3',
          question: 'Can fees be paid in installments?',
          answer: 'Yes, tuition fees can be paid in four convenient quarterly installments.',
          category: 'Fees',
        },
      ],
    },

    contact: {
      isVisible: isSectionVisible('contact'),
      address: b.address || p.address || '',
      village_or_locality: b.village_name || p.village || '',
      block_name: b.block_name || p.blockName || '',
      district: b.district_name || p.district || '',
      state: b.state_name || p.state || '',
      pincode: b.pincode || p.pincode || '',
      rural_urban: b.rural_urban || p.ruralUrban || 'Urban',
      latitude: Number(b.lat || b.latitude || p.latitude || 0),
      longitude: Number(b.lng || b.longitude || p.longitude || 0),
      phone: p.phone || b.phone || '',
      email: p.email || b.email || '',
      website: p.website || b.website || '',
      campus_video_url: p.campusVideoUrl || '',
      social_links: p.socialLinks || {
        facebook: '',
        instagram: '',
        youtube: '',
      },
      desks: {
        general_enquiry: {
          phone: p.generalPhone || p.phone || b.phone || '',
          email: p.generalEmail || p.email || b.email || '',
        },
        admissions_office: {
          phone: p.admissionPhone || p.phone || b.phone || '',
          email: p.admissionEmail || p.email || b.email || '',
        },
        principal_office: {
          phone: p.principalPhone || b.phone || '',
          email: p.principalEmail || b.email || '',
        },
        careers_desk: {
          phone: p.careersPhone || p.phone || '',
          email: p.careersEmail || p.email || '',
        },
      },
    },

    careers: {
      isVisible: isSectionVisible('careers'),
      heading: p.careers?.heading || 'Join Our Esteemed Teaching & Mentoring Faculty',
      subheading: p.careers?.subheading || 'We are looking for passionate educators, innovators, and mentors committed to nurturing the next generation of leaders.',
      official_careers_page_url: p.careers?.official_careers_page_url || p.officialCareersUrl || '',
      contact_email: p.careers?.contact_email || p.careersEmail || p.email || '',
      contact_phone: p.careers?.contact_phone || p.careersPhone || p.phone || '',
      openings: p.careers?.openings || [],
    },
  };
}

/**
 * Auto-provisions school in udise_private_schools and school_profiles from official UDISE government portal
 */
export async function ensureSchoolInDbAndStore(cleanUdise: string, initialPayload?: any): Promise<any> {
  const existing = await fetchBaseSchoolRow(cleanUdise);
  if (existing) return existing;

  let govtData: any = null;
  let statsData: any = null;
  let facilityData: any = null;
  let profileDataGov: any = null;

  try {
    const UDISE_HEADERS = {
      'x-app-signature': '9f2c7a4b8e1d6c3f5a9b0e2d4f6a7c8b',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36',
      'Accept': 'application/json',
    };
    const BASE_URL = 'https://kys.udiseplus.gov.in/web-app/api';

    const [byYearRes, statsRes, facRes, profRes] = await Promise.allSettled([
      fetch(`${BASE_URL}/school/by-year?udiseSchCode=${cleanUdise}&action=1`, { headers: UDISE_HEADERS }),
      fetch(`${BASE_URL}/school-statistics/enrolment-teacher?udiseSchCode=${cleanUdise}`, { headers: UDISE_HEADERS }),
      fetch(`${BASE_URL}/school/facility?udiseSchCode=${cleanUdise}`, { headers: UDISE_HEADERS }),
      fetch(`${BASE_URL}/school/profile?udiseSchCode=${cleanUdise}`, { headers: UDISE_HEADERS }),
    ]);

    if (byYearRes.status === 'fulfilled' && byYearRes.value.ok) {
      const j = await byYearRes.value.json().catch(() => null);
      govtData = Array.isArray(j?.data) ? j.data[0] : j?.data;
    }
    if (statsRes.status === 'fulfilled' && statsRes.value.ok) {
      const j = await statsRes.value.json().catch(() => null);
      statsData = j?.data;
    }
    if (facRes.status === 'fulfilled' && facRes.value.ok) {
      const j = await facRes.value.json().catch(() => null);
      facilityData = j?.data;
    }
    if (profRes.status === 'fulfilled' && profRes.value.ok) {
      const j = await profRes.value.json().catch(() => null);
      profileDataGov = j?.data;
    }
  } catch (e) {
    console.warn(`[ensureSchoolInDbAndStore] UDISE government fetch warning for ${cleanUdise}:`, e);
  }

  let rawName = govtData?.schoolName || profileDataGov?.schoolName || initialPayload?.school_name || `School ${cleanUdise}`;
  let rawAddr = govtData?.address || initialPayload?.address || '';

  const commaIdx = rawName.indexOf(',');
  if (commaIdx !== -1) {
    const candName = rawName.substring(0, commaIdx).trim();
    const candAddr = rawName.substring(commaIdx + 1).trim();
    if (/school|vidyalaya|academy|institute|convent|public|bal|senior/i.test(candName)) {
      rawName = candName;
      if (!rawAddr || rawAddr.length < candAddr.length) rawAddr = candAddr;
    }
  }

  const schoolSlug = `${rawName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${cleanUdise.toLowerCase()}`;
  const stateName = (govtData?.stateName || profileDataGov?.stateName || initialPayload?.state || 'DELHI').toUpperCase();
  const districtName = (govtData?.districtName || profileDataGov?.districtName || initialPayload?.district || 'EAST').toUpperCase();
  const pincode = String(govtData?.pincode || profileDataGov?.pincode || initialPayload?.pincode || '110092');
  const lat = Number(govtData?.latitude || initialPayload?.latitude || 28.6139);
  const lng = Number(govtData?.longitude || initialPayload?.longitude || 77.2090);

  const totalStudents = Number(statsData?.totalCount || govtData?.totalStudents || initialPayload?.total_students || 450);
  const totalBoys = Number(statsData?.totalBoy || Math.round(totalStudents * 0.52));
  const totalGirls = Number(statsData?.totalGirl || (totalStudents - totalBoys));
  const totalTeachers = Number(statsData?.totalTeacherReg || initialPayload?.total_teachers || Math.max(Math.round(totalStudents / 20), 12));
  const totalClassrooms = Number(facilityData?.clsrmsInst || initialPayload?.classrooms_count || Math.max(Math.round(totalStudents / 30), 15));
  const smartBoards = Number(facilityData?.digiBoardTot || facilityData?.digiBoardFun || initialPayload?.working_smart_boards || 4);

  let board = initialPayload?.board || 'CBSE';
  if (profileDataGov?.boardSecName && profileDataGov.boardSecName !== 'NA') {
    board = profileDataGov.boardSecName.replace(/^\d+-/, '');
  }

  const stateId = 17; // DELHI
  let districtId = 223; // EAST default
  try {
    const { data: dRow } = await schoolSearchSupabase
      .from('master_districts')
      .select('id')
      .eq('state_id', 17)
      .ilike('name', `%${districtName.trim()}%`)
      .limit(1)
      .maybeSingle();
    if (dRow?.id) districtId = dRow.id;
  } catch {}

  let boardId = 1; // CBSE
  if (/icse|cisce/i.test(board)) boardId = 2;
  else if (/ib/i.test(board)) boardId = 3;
  else if (/cambridge/i.test(board)) boardId = 4;
  else if (/state/i.test(board)) boardId = 5;

  const facIds: number[] = [1, 2, 5, 27, 38];
  if (facilityData?.tinkeringLabYn === 1 || facilityData?.tinkeringLabYnDesc?.toLowerCase().includes('yes')) facIds.push(29);
  if (facilityData?.integratedLabYn === 1 || facilityData?.integratedLabYnDesc?.toLowerCase().includes('yes')) facIds.push(25);
  if (facilityData?.drinkWaterYn === 1) facIds.push(57);
  if (facilityData?.medchkYn === 1) facIds.push(65);
  if (facilityData?.cctvYn === 1) facIds.push(58);
  if (facilityData?.fireSafetyYn === 1) facIds.push(60);
  if (facilityData?.physicsLabYn === 1) facIds.push(9);
  if (facilityData?.chemistryLabYn === 1) facIds.push(10);
  if (facilityData?.biologyLabYn === 1) facIds.push(11);

  const insertSchoolPayload = {
    udise_code: cleanUdise,
    school_name: rawName,
    school_slug: schoolSlug,
    school_id: cleanUdise,
    state_id: stateId,
    district_id: districtId,
    board_id: boardId,
    category_id: 1,
    school_format_id: 1,
    management_id: 1,
    school_type_id: 9,
    gender_type_id: 1,
    medium_id: 1,
    facility_ids: facIds,
    address: rawAddr || `${rawName}, ${districtName}, Delhi - ${pincode}`,
    village: govtData?.villageName || null,
    block_name: govtData?.blockName || null,
    pincode,
    latitude: lat,
    longitude: lng,
    phone: govtData?.phone || initialPayload?.phone || null,
    email: govtData?.email || initialPayload?.email || null,
    website: initialPayload?.website || null,
    principal_name: initialPayload?.principal_name || 'Principal',
    established_year: String(profileDataGov?.estdYear || initialPayload?.established_year || '2005'),
    total_students: totalStudents,
    total_teachers: totalTeachers,
    classrooms_count: totalClassrooms,
    rating: 4.5,
    admissions_open: true,
    is_verified: true,
    state_name: 'DELHI',
    district_name: districtName,
    board_10th: board,
    board_12th: board,
    management_desc: 'Private Unaided (Recognized)',
    school_category: 'Primary with Upper Primary, Secondary and Higher Secondary (1st-12th)',
    gender_type: 'Co-educational',
    primary_medium: 'English',
    residential_school: 'Day School',
    playground_available: 'Yes',
    library: 'Yes',
    computer_ict_lab: 'Yes',
    atal_stem_lab: facIds.includes(29) ? 'Yes' : 'No',
    integrated_science_lab: facIds.includes(25) ? 'Yes' : 'No',
    annual_fee: initialPayload?.annual_fee || 65000,
    image_url: initialPayload?.hero_banner_image || initialPayload?.image_url || ''
  };

  const { data: inserted, error: insErr } = await schoolSearchSupabase
    .from('udise_private_schools')
    .upsert(insertSchoolPayload, { onConflict: 'udise_code' })
    .select()
    .single();

  if (insErr) {
    console.error(`[ensureSchoolInDbAndStore] Insert error for ${cleanUdise}:`, insErr);
  }

  const defaultProfileData = {
    udiseCode: cleanUdise,
    schoolName: rawName,
    state: 'DELHI',
    district: districtName,
    pincode,
    address: rawAddr,
    board,
    medium: 'English',
    totalStudents,
    totalBoys,
    totalGirls,
    totalTeachers,
    classroomsCount: totalClassrooms,
    workingSmartBoards: smartBoards,
    admissionsOpen: true,
    establishedYear: String(profileDataGov?.estdYear || '2005'),
    facilities: ALL_PREDEFINED_FACILITIES.map(f => ({
      ...f,
      selected: facIds.includes(Number(f.id))
    })),
    aboutText: `${rawName} is a leading private educational institution situated in ${districtName}, Delhi, committed to holistic student development and academic excellence.`,
    visionText: `To nurture global citizens equipped with critical thinking, ethical integrity, and creative problem-solving skills.`,
    missionText: `Providing holistic NEP 2020 aligned experiential education with modern infrastructure and student-centric pedagogy.`
  };

  const basicInfoPayload = {
    school_name: rawName,
    udise_code: cleanUdise,
    board,
    medium: 'English',
    established_year: String(profileDataGov?.estdYear || '2005'),
    campus_area: '',
    school_type: 'Private',
    school_category: 'Senior Secondary',
    gender_type: 'Co-Educational'
  };

  const heroPayload = {
    heading_line1: 'Play, Learn and',
    heading_line2: 'Grow, Together..',
    tagline: 'Leading Campus of Excellence',
    description: `${rawName} is a leading educational institution situated in ${districtName}, Delhi, committed to holistic experiential education.`,
    admissions_open: true,
    boarding_status: 'Day School'
  };

  const statsPayload = {
    total_students: totalStudents,
    total_teachers: totalTeachers,
    classrooms_count: totalClassrooms,
    working_smart_boards: smartBoards
  };

  const aboutPayload = {
    about_text: defaultProfileData.aboutText,
    vision_text: defaultProfileData.visionText,
    mission_text: defaultProfileData.missionText
  };

  try {
    const { error: fullErr } = await schoolSearchSupabase
      .from('school_profiles')
      .upsert({
        udise_code: cleanUdise,
        basic_info: basicInfoPayload,
        hero: heroPayload,
        stats: statsPayload,
        about: aboutPayload,
        facilities: defaultProfileData.facilities,
        fees: {},
        admissions: { admissions_open: true },
        faqs: [],
        gallery: [],
        reviews: [],
        likes_count: 0,
        profile_data: defaultProfileData,
        section_visibility: {
          basic_info: true,
          hero: true,
          stats: true,
          about: true,
          principal: true,
          management: true,
          academics: true,
          results: true,
          facilities: true,
          gallery: true,
          fees: true,
          admissions: true,
          faqs: true,
          contact: true
        },
        updated_at: new Date().toISOString()
      }, { onConflict: 'udise_code' });

    if (fullErr) {
      await schoolSearchSupabase
        .from('school_profiles')
        .upsert({
          udise_code: cleanUdise,
          profile_data: defaultProfileData,
          section_visibility: {
            basic_info: true,
            hero: true,
            stats: true,
            about: true,
            principal: true,
            management: true,
            academics: true,
            results: true,
            facilities: true,
            gallery: true,
            fees: true,
            admissions: true,
            faqs: true,
            contact: true
          },
          updated_at: new Date().toISOString()
        }, { onConflict: 'udise_code' });
    }
  } catch (err) {
    console.warn('ensureSchoolInDbAndStore upsert warning:', err);
  }

  return inserted || insertSchoolPayload;
}

/**
 * Applies modifications for a specific section to profileData and Supabase
 * Strict Rule: Section structure is NEVER deleted.
 * DELETE mode clears the section's data.
 * Visibility (show/hide) controls whether the section appears on the page.
 */
export async function applySectionMutation({
  cleanUdise,
  sectionId,
  data,
  mode,
}: {
  cleanUdise: string;
  sectionId: string;
  data: any;
  mode: 'replace' | 'patch' | 'delete';
}): Promise<{
  success: boolean;
  sectionId: string;
  updatedSectionData: any;
  message: string;
  supabaseSynced: boolean;
}> {
  const store = readSyncStore();
  let tokenMatch = findSchoolTokenRecord(cleanUdise, store);
  let baseRow = await fetchBaseSchoolRow(cleanUdise);

  if (!baseRow) {
    baseRow = await ensureSchoolInDbAndStore(cleanUdise, data);
  }

  let supabaseProfData: Record<string, any> = {};
  try {
    const { data: profRow } = await schoolSearchSupabase
      .from('school_profiles')
      .select('profile_data, section_visibility')
      .eq('udise_code', cleanUdise)
      .maybeSingle();
    if (profRow?.profile_data) {
      supabaseProfData =
        typeof profRow.profile_data === 'string'
          ? JSON.parse(profRow.profile_data)
          : profRow.profile_data;
    }
  } catch {}

  const existingProfileData = {
    ...(tokenMatch?.record?.profileData || {}),
    ...supabaseProfData,
  };
  let currentSections = extractSectionsFromData(baseRow, existingProfileData);
  let targetSection = currentSections[sectionId];

  if (!targetSection) {
    throw new Error(`Invalid section ID: "${sectionId}".`);
  }

  // 1. Prepare mutations for profileData (token store & Supabase)
  const updatedProfileData: any = { ...existingProfileData };
  if (!updatedProfileData.contentOverrides) updatedProfileData.contentOverrides = {};
  if (!updatedProfileData.imageOverrides) updatedProfileData.imageOverrides = {};
  if (!updatedProfileData.sectionVisibility) updatedProfileData.sectionVisibility = {};

  // Supabase update payload for real DB columns
  const dbUpdatePayload: Record<string, any> = {};

  // 2. Process Section Visibility (Hide or Show)
  let visibilityAction: 'show' | 'hide' | null = null;
  if (data?.isVisible !== undefined) {
    updatedProfileData.sectionVisibility[sectionId] = Boolean(data.isVisible);
    visibilityAction = data.isVisible ? 'show' : 'hide';
  } else if (data?.visibility === 'hide' || data?.action === 'hide') {
    updatedProfileData.sectionVisibility[sectionId] = false;
    visibilityAction = 'hide';
  } else if (data?.visibility === 'show' || data?.action === 'show') {
    updatedProfileData.sectionVisibility[sectionId] = true;
    visibilityAction = 'show';
  }

  // 3. Process Section Data based on mode
  if (mode === 'delete' || data?.action === 'clear_data') {
    // ═════════════════════════════════════════════════════════════════
    // DELETE / CLEAR SECTION DATA (Section remains in existence!)
    // ═════════════════════════════════════════════════════════════════
    switch (sectionId) {
      case 'about':
        updatedProfileData.aboutText = '';
        updatedProfileData.visionText = '';
        updatedProfileData.missionText = '';
        break;
      case 'principal':
        delete updatedProfileData.contentOverrides['principal_message'];
        delete updatedProfileData.contentOverrides['principal_designation'];
        delete updatedProfileData.imageOverrides['principal_avatar'];
        delete updatedProfileData.principalPhone;
        delete updatedProfileData.principalEmail;
        break;
      case 'management':
        delete updatedProfileData.contentOverrides['mgmt_message'];
        delete updatedProfileData.contentOverrides['mgmt_chairperson'];
        delete updatedProfileData.contentOverrides['mgmt_designation'];
        delete updatedProfileData.imageOverrides['mgmt_seal'];
        break;
      case 'gallery':
        updatedProfileData.galleryItems = [];
        break;
      case 'fees':
        updatedProfileData.feeTableData = { columns: [], rows: [] };
        break;
      case 'admissions':
        updatedProfileData.admissions = [];
        break;
      case 'faqs':
        updatedProfileData.faqs = [];
        break;
      case 'academics':
        updatedProfileData.includedAcademicFeatures = [];
        break;
      case 'results':
        updatedProfileData.boardResults = { class10Results: [], class12Results: [] };
        break;
      case 'facilities':
        updatedProfileData.facilities = [];
        break;
      case 'hero':
        delete updatedProfileData.contentOverrides['hero_tagline'];
        delete updatedProfileData.contentOverrides['hero_stat_val_1'];
        delete updatedProfileData.contentOverrides['hero_stat_val_2'];
        delete updatedProfileData.contentOverrides['hero_stat_val_3'];
        delete updatedProfileData.contentOverrides['hero_stat_val_4'];
        updatedProfileData.heroMediaItems = [];
        break;
      case 'stats':
        delete updatedProfileData.contentOverrides['hero_stat_val_nature'];
        delete updatedProfileData.contentOverrides['hero_stat_val_mgmt'];
        break;
      case 'contact':
        delete updatedProfileData.campusVideoUrl;
        delete updatedProfileData.socialLinks;
        break;
      case 'basic_info':
        delete updatedProfileData.campusArea;
        delete updatedProfileData.affiliationNumber;
        break;
    }
  } else {
    // ═════════════════════════════════════════════════════════════════
    // WRITE OR UPDATE SECTION DATA
    // ═════════════════════════════════════════════════════════════════
    // Unwrap AI self-explanatory format if payload has `fields: { [key]: { value: ... } }`
    let normalizedInput: Record<string, any> = {};
    if (data && typeof data === 'object' && data.fields && typeof data.fields === 'object') {
      for (const [fKey, fObj] of Object.entries(data.fields)) {
        if (fObj && typeof fObj === 'object' && 'value' in (fObj as any)) {
          normalizedInput[fKey] = (fObj as any).value;
        } else {
          normalizedInput[fKey] = fObj;
        }
      }
    } else if (data && typeof data === 'object') {
      for (const [fKey, fVal] of Object.entries(data)) {
        if (fVal && typeof fVal === 'object' && !Array.isArray(fVal) && 'value' in (fVal as any) && ('ai_guide' in (fVal as any) || 'max_length' in (fVal as any))) {
          normalizedInput[fKey] = (fVal as any).value;
        } else {
          normalizedInput[fKey] = fVal;
        }
      }
    }

    const finalSectionData = mode === 'patch' ? { ...targetSection, ...normalizedInput } : normalizedInput;

    switch (sectionId) {
      case 'basic_info': {
        if (finalSectionData.school_name !== undefined && finalSectionData.school_name !== '') {
          updatedProfileData.schoolName = limitLength(finalSectionData.school_name, 80);
          dbUpdatePayload.school_name = updatedProfileData.schoolName;
        }
        if (finalSectionData.board !== undefined) {
          updatedProfileData.board = limitLength(finalSectionData.board, 50);
          dbUpdatePayload.board_10th = updatedProfileData.board;
          dbUpdatePayload.board_12th = updatedProfileData.board;
        }
        if (finalSectionData.medium !== undefined) {
          updatedProfileData.medium = limitLength(finalSectionData.medium, 40);
          dbUpdatePayload.primary_medium = updatedProfileData.medium;
        }
        if (finalSectionData.established_year !== undefined) {
          updatedProfileData.establishedYear = limitLength(finalSectionData.established_year, 10);
          const yr = parseInt(String(updatedProfileData.establishedYear).replace(/\D/g, ''), 10);
          if (!isNaN(yr) && yr > 1800) {
            dbUpdatePayload.established_year = yr;
          }
        }
        if (finalSectionData.affiliation_number !== undefined) {
          updatedProfileData.affiliationNumber = limitLength(finalSectionData.affiliation_number, 30);
          dbUpdatePayload.affiliation_number = updatedProfileData.affiliationNumber;
        }
        if (finalSectionData.campus_area !== undefined) {
          updatedProfileData.campusArea = limitLength(finalSectionData.campus_area, 50);
        }
        if (finalSectionData.school_type !== undefined) {
          updatedProfileData.schoolType = limitLength(finalSectionData.school_type, 50);
          updatedProfileData.management = updatedProfileData.schoolType;
          dbUpdatePayload.management_desc = updatedProfileData.schoolType;
        }
        if (finalSectionData.school_category !== undefined) {
          updatedProfileData.schoolCategory = limitLength(finalSectionData.school_category, 60);
          dbUpdatePayload.school_category = updatedProfileData.schoolCategory;
        }
        if (finalSectionData.gender_type !== undefined) {
          updatedProfileData.genderType = limitLength(finalSectionData.gender_type, 30);
          dbUpdatePayload.gender_type = updatedProfileData.genderType;
        }
        const heroBannerUrl = finalSectionData.hero_banner_image !== undefined
          ? finalSectionData.hero_banner_image
          : finalSectionData.branding?.hero_banner_image;
        if (heroBannerUrl !== undefined) {
          updatedProfileData.heroImage = heroBannerUrl;
          dbUpdatePayload.image_url = heroBannerUrl;
        }
        const logoUrl = finalSectionData.logo_image_url !== undefined
          ? finalSectionData.logo_image_url
          : finalSectionData.branding?.logo_image_url;
        if (logoUrl !== undefined) {
          updatedProfileData.logoImage = logoUrl;
          if (!dbUpdatePayload.image_url && logoUrl) {
            dbUpdatePayload.image_url = logoUrl;
          }
        }
        break;
      }

      case 'hero': {
        if (finalSectionData.banner_image) {
          updatedProfileData.heroImage = finalSectionData.banner_image;
          dbUpdatePayload.image_url = finalSectionData.banner_image;
        }
        if (finalSectionData.heading_line1 !== undefined) {
          updatedProfileData.contentOverrides['hero_heading_line1'] = limitLength(finalSectionData.heading_line1, 45);
        }
        if (finalSectionData.heading_line2 !== undefined) {
          updatedProfileData.contentOverrides['hero_heading_line2'] = limitLength(finalSectionData.heading_line2, 45);
        }
        if (finalSectionData.tagline !== undefined) {
          updatedProfileData.contentOverrides['hero_tagline'] = limitLength(finalSectionData.tagline, 90);
        }
        if (finalSectionData.description !== undefined) {
          updatedProfileData.contentOverrides['hero_desc_main'] = limitLength(finalSectionData.description, 350);
        }
        if (finalSectionData.cta_enroll_text !== undefined) {
          updatedProfileData.contentOverrides['hero_cta_enroll'] = limitLength(finalSectionData.cta_enroll_text, 25);
        }
        if (finalSectionData.cta_video_text !== undefined) {
          updatedProfileData.contentOverrides['hero_cta_video_pill'] = limitLength(finalSectionData.cta_video_text, 25);
        }
        if (finalSectionData.helpline_phone !== undefined) {
          updatedProfileData.phone = limitLength(finalSectionData.helpline_phone, 20);
          dbUpdatePayload.phone = updatedProfileData.phone;
        }
        if (finalSectionData.admissions_open !== undefined) {
          updatedProfileData.admissionsOpen = Boolean(finalSectionData.admissions_open);
        }
        if (finalSectionData.boarding_status || finalSectionData.residential_school) {
          const val = finalSectionData.boarding_status || finalSectionData.residential_school;
          updatedProfileData.residentialSchool = val;
          dbUpdatePayload.residential_school = val;
        }
        if (finalSectionData.prestige_metrics?.metric_1_board_results?.value) {
          updatedProfileData.contentOverrides['hero_stat_val_1'] = limitLength(finalSectionData.prestige_metrics.metric_1_board_results.value, 15);
        }
        if (finalSectionData.prestige_metrics?.metric_2_student_teacher_ratio?.value) {
          updatedProfileData.contentOverrides['hero_stat_val_2'] = limitLength(finalSectionData.prestige_metrics.metric_2_student_teacher_ratio.value, 15);
        }
        if (finalSectionData.prestige_metrics?.metric_3_classrooms_labs?.value) {
          updatedProfileData.contentOverrides['hero_stat_val_3'] = limitLength(finalSectionData.prestige_metrics.metric_3_classrooms_labs.value, 15);
        }
        if (finalSectionData.prestige_metrics?.metric_4_class_range?.value) {
          updatedProfileData.contentOverrides['hero_stat_val_4'] = limitLength(finalSectionData.prestige_metrics.metric_4_class_range.value, 18);
        }
        if (finalSectionData.hero_media_items) {
          updatedProfileData.heroMediaItems = finalSectionData.hero_media_items;
        }
        break;
      }

      case 'stats': {
        if (finalSectionData.total_students !== undefined) {
          const count = Number(finalSectionData.total_students) || 0;
          updatedProfileData.totalStudents = count;
          dbUpdatePayload.total_students = count;
        }
        if (finalSectionData.total_boys !== undefined) {
          const count = Number(finalSectionData.total_boys) || 0;
          updatedProfileData.totalBoys = count;
          dbUpdatePayload.total_boys = count;
        }
        if (finalSectionData.total_girls !== undefined) {
          const count = Number(finalSectionData.total_girls) || 0;
          updatedProfileData.totalGirls = count;
          dbUpdatePayload.total_girls = count;
        }
        if (finalSectionData.total_teachers !== undefined) {
          const count = Number(finalSectionData.total_teachers) || 0;
          updatedProfileData.totalTeachers = count;
          dbUpdatePayload.total_teachers = count;
        }
        if (finalSectionData.male_teachers !== undefined) {
          const count = Number(finalSectionData.male_teachers) || 0;
          updatedProfileData.maleTeachers = count;
          dbUpdatePayload.male_teachers = count;
        }
        if (finalSectionData.female_teachers !== undefined) {
          const count = Number(finalSectionData.female_teachers) || 0;
          updatedProfileData.femaleTeachers = count;
          dbUpdatePayload.female_teachers = count;
        }
        if (finalSectionData.classrooms_count !== undefined) {
          const count = Number(finalSectionData.classrooms_count) || 0;
          updatedProfileData.classroomsCount = count;
          dbUpdatePayload.classrooms_count = count;
          dbUpdatePayload.total_classrooms = count;
        }
        if (finalSectionData.working_smart_boards !== undefined) {
          const count = Number(finalSectionData.working_smart_boards) || 0;
          updatedProfileData.workingSmartBoards = count;
          dbUpdatePayload.working_smart_boards = count;
        }
        if (finalSectionData.student_teacher_ratio !== undefined) {
          updatedProfileData.contentOverrides['hero_stat_val_2'] = limitLength(finalSectionData.student_teacher_ratio, 15);
        }
        if (finalSectionData.campus_area !== undefined) {
          updatedProfileData.campusArea = limitLength(finalSectionData.campus_area, 50);
        }
        if (finalSectionData.residential_school !== undefined || finalSectionData.school_nature !== undefined) {
          const rVal = finalSectionData.residential_school || finalSectionData.school_nature;
          updatedProfileData.residentialSchool = rVal;
          updatedProfileData.contentOverrides['hero_stat_val_nature'] = limitLength(rVal, 30);
          dbUpdatePayload.residential_school = rVal;
        }
        if (finalSectionData.management_type !== undefined) {
          updatedProfileData.management = limitLength(finalSectionData.management_type, 50);
          updatedProfileData.contentOverrides['hero_stat_val_mgmt'] = limitLength(finalSectionData.management_type, 50);
        }
        if (finalSectionData.board !== undefined) {
          updatedProfileData.board = limitLength(finalSectionData.board, 50);
          updatedProfileData.contentOverrides['hero_stat_val_1'] = limitLength(finalSectionData.board, 50);
        }
        if (finalSectionData.medium !== undefined) {
          updatedProfileData.medium = limitLength(finalSectionData.medium, 40);
          updatedProfileData.contentOverrides['hero_stat_val_med'] = limitLength(finalSectionData.medium, 40);
        }
        if (finalSectionData.gender_type !== undefined) {
          updatedProfileData.genderType = limitLength(finalSectionData.gender_type, 30);
          updatedProfileData.contentOverrides['hero_stat_val_gender'] = limitLength(finalSectionData.gender_type, 30);
        }
        break;
      }

      case 'about': {
        if (finalSectionData.about_eyebrow !== undefined) updatedProfileData.contentOverrides['about_eyebrow'] = limitLength(finalSectionData.about_eyebrow, 35);
        if (finalSectionData.about_heading_l1 !== undefined) updatedProfileData.contentOverrides['about_heading_l1'] = limitLength(finalSectionData.about_heading_l1, 35);
        if (finalSectionData.about_heading_l2 !== undefined) updatedProfileData.contentOverrides['about_heading_l2'] = limitLength(finalSectionData.about_heading_l2, 35);
        if (finalSectionData.about_text !== undefined) updatedProfileData.aboutText = limitLength(finalSectionData.about_text, 1200);
        if (finalSectionData.vision_text !== undefined) updatedProfileData.visionText = limitLength(finalSectionData.vision_text, 400);
        if (finalSectionData.mission_text !== undefined) updatedProfileData.missionText = limitLength(finalSectionData.mission_text, 400);
        if (finalSectionData.about_badge_text !== undefined) updatedProfileData.contentOverrides['about_badge_text'] = limitLength(finalSectionData.about_badge_text, 30);
        if (finalSectionData.about_campus_photo !== undefined) updatedProfileData.imageOverrides['about_campus_photo'] = finalSectionData.about_campus_photo;
        if (finalSectionData.cta_text !== undefined) updatedProfileData.contentOverrides['about_cta_btn'] = limitLength(finalSectionData.cta_text, 30);
        if (finalSectionData.heritage_years !== undefined) updatedProfileData.contentOverrides['about_heritage_years'] = limitLength(finalSectionData.heritage_years, 30);
        break;
      }

      case 'principal': {
        if (finalSectionData.principal_eyebrow !== undefined) updatedProfileData.contentOverrides['principal_eyebrow'] = limitLength(finalSectionData.principal_eyebrow, 35);
        if (finalSectionData.principal_heading_l1 !== undefined) updatedProfileData.contentOverrides['principal_heading_l1'] = limitLength(finalSectionData.principal_heading_l1, 35);
        if (finalSectionData.principal_heading_l2 !== undefined) updatedProfileData.contentOverrides['principal_heading_l2'] = limitLength(finalSectionData.principal_heading_l2, 35);
        if (finalSectionData.principal_name !== undefined) {
          updatedProfileData.principalName = limitLength(finalSectionData.principal_name, 60);
          dbUpdatePayload.principal_name = updatedProfileData.principalName;
        }
        if (finalSectionData.principal_designation !== undefined) {
          updatedProfileData.contentOverrides['principal_designation'] = limitLength(finalSectionData.principal_designation, 50);
        }
        if (finalSectionData.principal_quote !== undefined) {
          updatedProfileData.contentOverrides['principal_quote'] = limitLength(finalSectionData.principal_quote, 250);
        }
        if (finalSectionData.principal_body_1 !== undefined) {
          updatedProfileData.contentOverrides['principal_body_1'] = limitLength(finalSectionData.principal_body_1, 600);
        }
        if (finalSectionData.principal_body_2 !== undefined) {
          updatedProfileData.contentOverrides['principal_body_2'] = limitLength(finalSectionData.principal_body_2, 600);
        }
        if (finalSectionData.principal_tagline !== undefined) {
          updatedProfileData.contentOverrides['principal_tagline'] = limitLength(finalSectionData.principal_tagline, 40);
        }
        if (finalSectionData.principal_image_url !== undefined) {
          updatedProfileData.imageOverrides['principal_photo'] = finalSectionData.principal_image_url;
          updatedProfileData.imageOverrides['principal_avatar'] = finalSectionData.principal_image_url;
        }
        if (finalSectionData.principal_phone !== undefined) {
          updatedProfileData.principalPhone = limitLength(finalSectionData.principal_phone, 20);
        }
        if (finalSectionData.principal_email !== undefined) {
          updatedProfileData.principalEmail = limitLength(finalSectionData.principal_email, 60);
        }
        break;
      }

      case 'management': {
        if (finalSectionData.mgmt_eyebrow !== undefined) updatedProfileData.contentOverrides['mgmt_eyebrow'] = limitLength(finalSectionData.mgmt_eyebrow, 35);
        if (finalSectionData.mgmt_heading_prefix !== undefined) updatedProfileData.contentOverrides['mgmt_heading_prefix'] = limitLength(finalSectionData.mgmt_heading_prefix, 25);
        if (finalSectionData.mgmt_heading !== undefined) updatedProfileData.contentOverrides['mgmt_heading'] = limitLength(finalSectionData.mgmt_heading, 60);
        if (finalSectionData.management_name !== undefined) {
          updatedProfileData.contentOverrides['mgmt_chairperson'] = limitLength(finalSectionData.management_name, 70);
        }
        if (finalSectionData.management_society !== undefined) {
          updatedProfileData.contentOverrides['mgmt_society_name'] = limitLength(finalSectionData.management_society, 90);
        }
        if (finalSectionData.management_designation !== undefined) {
          updatedProfileData.contentOverrides['mgmt_designation'] = limitLength(finalSectionData.management_designation, 60);
        }
        if (finalSectionData.management_quote !== undefined) {
          updatedProfileData.contentOverrides['mgmt_quote'] = limitLength(finalSectionData.management_quote, 250);
        }
        if (finalSectionData.management_message_p1 !== undefined) {
          updatedProfileData.contentOverrides['mgmt_message_p1'] = limitLength(finalSectionData.management_message_p1, 600);
        }
        if (finalSectionData.management_message_p2 !== undefined) {
          updatedProfileData.contentOverrides['mgmt_message_p2'] = limitLength(finalSectionData.management_message_p2, 600);
        }
        if (finalSectionData.management_logo !== undefined) {
          updatedProfileData.imageOverrides['mgmt_seal'] = finalSectionData.management_logo;
        }
        break;
      }

      case 'academics': {
        if (finalSectionData.curriculum_features && Array.isArray(finalSectionData.curriculum_features)) {
          updatedProfileData.includedAcademicFeatures = finalSectionData.curriculum_features.map((f: any) => limitLength(f, 100));
        }
        if (finalSectionData.stream_categories && Array.isArray(finalSectionData.stream_categories)) {
          updatedProfileData.academicStreams = finalSectionData.stream_categories;
        }
        if (finalSectionData.class_from !== undefined) {
          updatedProfileData.classFrom = String(finalSectionData.class_from);
          dbUpdatePayload.class_from = updatedProfileData.classFrom;
        }
        if (finalSectionData.class_to !== undefined) {
          updatedProfileData.classTo = String(finalSectionData.class_to);
          dbUpdatePayload.class_to = updatedProfileData.classTo;
        }
        break;
      }

      case 'results': {
        if (!updatedProfileData.boardResults) updatedProfileData.boardResults = {};
        if (finalSectionData.class10Results !== undefined) updatedProfileData.boardResults.class10Results = finalSectionData.class10Results;
        if (finalSectionData.class12Results !== undefined) updatedProfileData.boardResults.class12Results = finalSectionData.class12Results;
        break;
      }

      case 'facilities': {
        if (finalSectionData.facilities_eyebrow !== undefined) {
          updatedProfileData.contentOverrides['facilities_eyebrow'] = limitLength(finalSectionData.facilities_eyebrow, 35);
        }
        if (finalSectionData.facilities_heading !== undefined) {
          updatedProfileData.contentOverrides['facilities_heading'] = limitLength(finalSectionData.facilities_heading, 50);
        }
        if (Array.isArray(finalSectionData.selected_facility_names)) {
          const namesSet = new Set(finalSectionData.selected_facility_names.map((n: string) => n.toLowerCase().trim()));
          updatedProfileData.facilities = ALL_PREDEFINED_FACILITIES.map((f) => ({
            ...f,
            selected: namesSet.has(f.name.toLowerCase().trim()),
          }));
        } else if (Array.isArray(finalSectionData.facilities_list)) {
          updatedProfileData.facilities = finalSectionData.facilities_list;
        }
        break;
      }

      case 'gallery': {
        if (Array.isArray(finalSectionData.gallery_items)) {
          updatedProfileData.galleryItems = finalSectionData.gallery_items;
        }
        if (finalSectionData.campus_video_url !== undefined) {
          updatedProfileData.campusVideoUrl = finalSectionData.campus_video_url;
        }
        break;
      }

      case 'fees': {
        if (finalSectionData.fee_table) {
          updatedProfileData.feeTableData = finalSectionData.fee_table;
        }
        if (finalSectionData.extra_charges_table) {
          updatedProfileData.extraChargesTableData = finalSectionData.extra_charges_table;
        }
        if (Array.isArray(finalSectionData.fee_terms_list)) {
          updatedProfileData.feeTermsList = finalSectionData.fee_terms_list;
        }
        if (finalSectionData.annual_fee !== undefined) {
          updatedProfileData.annualFee = finalSectionData.annual_fee;
          const numericFee = parseInt(String(finalSectionData.annual_fee).replace(/[^\d]/g, ''), 10);
          if (!isNaN(numericFee) && numericFee > 0) {
            dbUpdatePayload.annual_fee = numericFee;
          }
        }
        if (finalSectionData.admission_phone !== undefined) {
          updatedProfileData.admissionPhone = finalSectionData.admission_phone;
        }
        if (finalSectionData.admission_email !== undefined) {
          updatedProfileData.admissionEmail = finalSectionData.admission_email;
        }
        if (finalSectionData.official_fee_page_url !== undefined) {
          updatedProfileData.officialFeeUrl = finalSectionData.official_fee_page_url;
        }
        break;
      }

      case 'admissions': {
        if (finalSectionData.admissions_open !== undefined) {
          updatedProfileData.admissionsOpen = Boolean(finalSectionData.admissions_open);
          dbUpdatePayload.admissions_open = Boolean(finalSectionData.admissions_open);
        }
        if (finalSectionData.admission_phone !== undefined) {
          updatedProfileData.admissionPhone = finalSectionData.admission_phone;
        }
        if (finalSectionData.admission_email !== undefined) {
          updatedProfileData.admissionEmail = finalSectionData.admission_email;
        }
        if (finalSectionData.official_admissions_page_url !== undefined) {
          updatedProfileData.officialAdmissionsUrl = finalSectionData.official_admissions_page_url;
        }
        if (Array.isArray(finalSectionData.admissions_cards)) {
          updatedProfileData.admissions = finalSectionData.admissions_cards;
        }
        break;
      }

      case 'faqs': {
        if (Array.isArray(finalSectionData.faq_items)) {
          updatedProfileData.faqs = finalSectionData.faq_items;
        }
        break;
      }

      case 'contact': {
        if (finalSectionData.phone !== undefined) {
          updatedProfileData.phone = limitLength(finalSectionData.phone, 25);
          dbUpdatePayload.phone = updatedProfileData.phone;
        }
        if (finalSectionData.email !== undefined) {
          updatedProfileData.email = limitLength(finalSectionData.email, 60);
          dbUpdatePayload.email = updatedProfileData.email;
        }
        if (finalSectionData.website !== undefined) {
          updatedProfileData.website = limitLength(finalSectionData.website, 90);
          dbUpdatePayload.website = updatedProfileData.website;
        }
        if (finalSectionData.campus_video_url !== undefined) {
          updatedProfileData.campusVideoUrl = finalSectionData.campus_video_url;
        }
        if (finalSectionData.social_links !== undefined) {
          updatedProfileData.socialLinks = finalSectionData.social_links;
        }
        if (finalSectionData.desks !== undefined) {
          if (finalSectionData.desks.general_enquiry?.phone !== undefined) updatedProfileData.generalPhone = finalSectionData.desks.general_enquiry.phone;
          if (finalSectionData.desks.general_enquiry?.email !== undefined) updatedProfileData.generalEmail = finalSectionData.desks.general_enquiry.email;
          if (finalSectionData.desks.admissions_office?.phone !== undefined) updatedProfileData.admissionPhone = finalSectionData.desks.admissions_office.phone;
          if (finalSectionData.desks.admissions_office?.email !== undefined) updatedProfileData.admissionEmail = finalSectionData.desks.admissions_office.email;
          if (finalSectionData.desks.principal_office?.phone !== undefined) updatedProfileData.principalPhone = finalSectionData.desks.principal_office.phone;
          if (finalSectionData.desks.principal_office?.email !== undefined) updatedProfileData.principalEmail = finalSectionData.desks.principal_office.email;
          if (finalSectionData.desks.careers_desk?.phone !== undefined) updatedProfileData.careersPhone = finalSectionData.desks.careers_desk.phone;
          if (finalSectionData.desks.careers_desk?.email !== undefined) updatedProfileData.careersEmail = finalSectionData.desks.careers_desk.email;
        }
        break;
      }

      case 'careers': {
        if (!updatedProfileData.careers) updatedProfileData.careers = {};
        if (finalSectionData.heading !== undefined) updatedProfileData.careers.heading = finalSectionData.heading;
        if (finalSectionData.subheading !== undefined) updatedProfileData.careers.subheading = finalSectionData.subheading;
        if (finalSectionData.official_careers_page_url !== undefined) {
          updatedProfileData.careers.official_careers_page_url = finalSectionData.official_careers_page_url;
          updatedProfileData.officialCareersUrl = finalSectionData.official_careers_page_url;
        }
        if (finalSectionData.contact_email !== undefined) updatedProfileData.careers.contact_email = finalSectionData.contact_email;
        if (finalSectionData.contact_phone !== undefined) updatedProfileData.careers.contact_phone = finalSectionData.contact_phone;
        if (Array.isArray(finalSectionData.openings)) updatedProfileData.careers.openings = finalSectionData.openings;
        break;
      }
    }
  }

  // 4. Save to local Token Store
  const tokenKey = tokenMatch?.tokenKey || `sync_${cleanUdise.toLowerCase()}`;
  const now = Date.now();
  store.tokens[tokenKey] = {
    token: tokenKey,
    schoolId: cleanUdise,
    schoolName: baseRow?.school_name || updatedProfileData.schoolName || 'School',
    createdAt: tokenMatch?.record?.createdAt || now,
    expiresAt: 0,
    isPermanent: true,
    lastUpdatedAt: now,
    lastUpdatedSource: `Section API [${sectionId} - ${mode.toUpperCase()}]`,
    profileData: updatedProfileData,
  };
  writeSyncStore(store);

  // 5. Update Supabase if any real DB columns changed
  let supabaseSynced = false;
  if (Object.keys(dbUpdatePayload).length > 0) {
    const { error: updErr } = await schoolSearchSupabase
      .from('udise_private_schools')
      .update(dbUpdatePayload)
      .eq('udise_code', cleanUdise);

    if (!updErr) {
      supabaseSynced = true;
    } else {
      console.warn('Supabase DB update warning:', updErr.message);
    }
  }

  // Return fresh compiled section data
  const refreshedSections = extractSectionsFromData(
    { ...baseRow, ...dbUpdatePayload },
    updatedProfileData
  );

  // Sync to school_profiles: Dedicated section column AND profile_data for full compatibility
  try {
    const sectionColData = refreshedSections[sectionId] || data;
    const upsertPayload: Record<string, any> = {
      udise_code: cleanUdise,
      [sectionId]: sectionColData,
      profile_data: updatedProfileData,
      section_visibility: updatedProfileData.sectionVisibility || {},
      updated_at: new Date().toISOString()
    };

    const { error: colErr } = await schoolSearchSupabase
      .from('school_profiles')
      .upsert(upsertPayload, { onConflict: 'udise_code' });

    if (!colErr) {
      supabaseSynced = true;
    } else {
      // Fallback if dedicated column does not exist yet in Supabase
      const { error: fbErr } = await schoolSearchSupabase
        .from('school_profiles')
        .upsert({
          udise_code: cleanUdise,
          profile_data: updatedProfileData,
          section_visibility: updatedProfileData.sectionVisibility || {},
          updated_at: new Date().toISOString()
        }, { onConflict: 'udise_code' });
      if (!fbErr) supabaseSynced = true;
    }
  } catch (profErr) {
    console.warn('Supabase school_profiles upsert warning:', profErr);
  }

  let finalMessage = `Section "${SECTION_METADATA[sectionId]?.name}" data successfully ${mode === 'patch' ? 'updated' : 'written'}.`;
  if (mode === 'delete' || data?.action === 'clear_data') {
    finalMessage = `Section "${SECTION_METADATA[sectionId]?.name}" data has been completely cleared/deleted. Section structure is preserved (use isVisible to hide/show).`;
  } else if (visibilityAction) {
    finalMessage = `Section "${SECTION_METADATA[sectionId]?.name}" visibility changed to ${visibilityAction.toUpperCase()}.`;
  }

  return {
    success: true,
    sectionId,
    updatedSectionData: refreshedSections[sectionId],
    message: finalMessage,
    supabaseSynced,
  };
}
