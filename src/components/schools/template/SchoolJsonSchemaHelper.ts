import {
  SchoolTemplateState,
  FlipbookSlideItem,
  FacilityCardItem,
  AdmissionCardItem,
  GalleryMediaItem,
  FeeTableState,
} from './SchoolTemplateContext';
import { FACILITY_CATEGORIES } from '../FacilityData';

/**
 * Strict character length limiter to prevent layout distortion/overflow.
 */
export function limitLength(val: any, maxChars: number): string {
  if (val === undefined || val === null) return '';
  const str = String(val).trim();
  return str.length > maxChars ? str.substring(0, maxChars) : str;
}

export const ALL_PREDEFINED_FACILITIES = FACILITY_CATEGORIES.flatMap((cat) =>
  cat.items.map((item) => {
    const key = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/(^_|_$)/g, '');
    return {
      id: key,
      key,
      name: item.name,
      category: cat.category,
      icon: item.icon,
      selected: false,
    };
  })
);

const PREDEFINED_FACILITY_MAP = new Map<string, { id: string; key: string; name: string; category: string; icon: string; selected: boolean }>();
ALL_PREDEFINED_FACILITIES.forEach((item) => {
  PREDEFINED_FACILITY_MAP.set(item.name.toLowerCase().trim(), item);
  PREDEFINED_FACILITY_MAP.set(item.key, item);
  PREDEFINED_FACILITY_MAP.set(item.id, item);
});

/**
 * Clean, structured Master Schema matching the EXACT 6 TABS of the School Profile:
 * 1. tab_1_home (Home Tab: Hero Attraction Metrics, Identity, PhotoBook, About, Principal)
 * 2. tab_2_academics (Academics Tab: Class range, curriculum features, streams)
 * 3. tab_3_facilities (Facilities Tab: 62 Predefined facilities selection with verified icons)
 * 4. tab_4_gallery (Campus Gallery Tab: Photo & video showcase)
 * 5. tab_5_admissions_fees (Admissions & Fees Tab: Fee table & admission guidelines)
 * 6. tab_6_contact (Contact Us Tab: Address, phone, email, website)
 */
export const BLANK_AI_SCHOOL_SCHEMA = {
  $schema_version: '3.0',
  schema_info: {
    description: 'CSEEL Interactive School Profile Master Blueprint (Organized Section-by-Section)',
    instructions: 'Har section school profile ke exact section se match karta hai. Sabhi 13 sections me school details fill karein.',
  },

  // ========================================================
  // SECTION 1: BASIC INSTITUTIONAL IDENTITY
  // ========================================================
  section_1_basic_info: {
    section_name: 'Basic Institutional Identity',
    school_name: '', // Max 65 chars (Government UDISE verified)
    udise_code: '', // Exactly 11 characters (Primary Key)
    board: '', // Max 50 chars
    medium: '', // Max 35 chars
    established_year: '', // Max 10 chars
    campus_area: '', // Max 20 chars (Leave empty if unverified)
    school_type: '', // Max 35 chars
    management: '', // Max 45 chars
    school_category: '', // Max 45 chars
    gender_type: '', // 'Co-Educational' | 'Boys' | 'Girls'
    affiliation_number: '', // Max 25 chars
    logo_url: '', // Official School Logo Icon Image URL (Displayed in Top Navbar & Branding)
    branding: {
      logo_url: '', // Official School Logo Icon Image URL
      logo_image_url: '',
      hero_banner_image: '',
    },
  },

  // ========================================================
  // SECTION 2: HERO FLOATING PRESTIGE ATTRACTION METRICS (4 CARDS)
  // ========================================================
  section_2_hero_prestige_metrics: {
    section_name: 'Hero Floating Attraction Metrics',
    metric_1_board_results: {
      value: 'CBSE', // Max 12 chars (e.g. 'CBSE' or '100%')
      label: 'Affiliated Board', // Max 25 chars
    },
    metric_2_student_teacher_ratio: {
      value: '1:15', // Max 12 chars (e.g. '1:15')
      label: 'Student-Teacher Ratio', // Max 25 chars
    },
    metric_3_classrooms_labs: {
      value: '55+', // Max 12 chars (e.g. '55+')
      label: 'Classrooms & Labs', // Max 25 chars
    },
    metric_4_class_range: {
      value: 'Class 1-12', // Max 14 chars (e.g. 'Class 1-12' or '40+ Awards')
      label: 'Class Range', // Max 25 chars
    },
  },

  // ========================================================
  // SECTION 3: 3D PHOTOBOOK CAROUSEL SHOWCASE SLIDES
  // ========================================================
  section_3_photobook_slides: {
    section_name: '3D PhotoBook Carousel Showcase',
    slides: [
      {
        slide_id: 'slide-1',
        title: 'Modern Academic Quadrangle', // Max 35 chars
        desc: 'Eco-friendly smart campus with state-of-the-art interactive digital infrastructure.', // Max 90 chars
        media_type: 'image', // 'image' | 'video'
        image_url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80',
        video_url: '',
        button_text: 'Explore Campus', // Max 18 chars
        action_tab: 'home',
      },
      {
        slide_id: 'slide-2',
        title: 'Atal Tinkering & Robotics Lab',
        desc: 'Hands-on experiential learning in AI, IoT sensors, robotics, and applied science.',
        media_type: 'image',
        image_url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80',
        video_url: '',
        button_text: 'View Facilities',
        action_tab: 'facilities',
      },
      {
        slide_id: 'slide-3',
        title: 'Athletics Ground & Sports Complex',
        desc: 'Olympic-standard turf, cricket academy, basketball arena, and yoga pavilion.',
        media_type: 'image',
        image_url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1200&q=80',
        video_url: '',
        button_text: 'Admissions Open',
        action_tab: 'admissions',
      },
    ],
  },

  // ========================================================
  // SECTION 4: PHYSICAL CAMPUS STATISTICS & SCALE
  // ========================================================
  section_4_statistics: {
    section_name: 'Physical Campus Statistics',
    total_students: 1450, // Total student strength
    total_teachers: 85, // Total faculty members
    classrooms_count: 55,
    working_smart_boards: 45,
    is_residential: false,
    has_hostel: false,
  },

  // ========================================================
  // SECTION 5: ABOUT SCHOOL, VISION & MISSION STATEMENTS
  // ========================================================
  section_5_about_and_vision: {
    section_name: 'About School, Vision & Mission',
    about_text: 'Delhi Public School Rewari is a premier CBSE-affiliated institution dedicated to academic brilliance, moral integrity, and experiential STEAM learning across a sprawling 14-acre green campus.', // Max 320 chars
    vision_text: 'Empowering independent thinkers and innovative leaders who champion human empathy, scientific temperament, and ethical responsibility in a dynamic global community.', // Max 180 chars
    mission_text: 'Fostering rigorous academic exploration through NEP 2020 experiential pedagogies, hands-on maker practicals, and inclusive athletic development.', // Max 180 chars
  },

  // ========================================================
  // SECTION 6: PRINCIPAL DESK & LEADERSHIP MESSAGE
  // ========================================================
  section_6_principal_desk: {
    section_name: "Principal's Desk & Leadership Message",
    principal_name: 'Dr. Sunita Sharma', // Max 40 chars
    principal_designation: 'Principal / Head of Institution', // Max 40 chars
    principal_message: 'At DPS Rewari, every student is encouraged to discover their innate curiosity and transform knowledge into meaningful real-world leadership.', // Max 250 chars
    principal_image_url: '/images/teachers/verified-teacher-avatar-placeholder.webp',
  },

  // ========================================================
  // SECTION: GOVERNING BODY & MANAGEMENT MESSAGE
  // ========================================================
  section_management_desk: {
    section_name: 'Governing Body & Management Message',
    management_name: 'Delhi Public School Society', // Max 50 chars
    management_designation: 'Governing Council / Managing Committee', // Max 45 chars
    management_message: 'Our mission as guardians of this institution is to ensure world-class infrastructure, compassionate pedagogical mentorship, and accessible education for every family.', // Max 280 chars
    management_logo: '', // Official seal/logo URL
  },

  // ========================================================
  // SECTION 7: ACADEMICS, CURRICULUM & STREAMS
  // ========================================================
  section_7_academics: {
    section_name: 'Curriculum, Streams & Special Programs',
    class_range: {
      class_from: 'Class 1st', // Max 20 chars
      class_to: 'Class 12th', // Max 20 chars
    },
    curriculum_features: [
      'CBSE Affiliated Curriculum with NEP 2020 Experiential STEM Pedagogy', // Max 70 chars
      'Advanced Science, Commerce, and Humanities Streams for Senior Secondary',
      'Dedicated Olympiad, NTSE, and JEE/NEET/CUET Foundation Masterclasses',
      'Interactive Smart Boards & 3D Virtual Lab Modules in all Classrooms',
      'Continuous Remedial Mentoring with 1:15 Student-Teacher Ratio',
    ],
    streams_offered: [
      'Science (Physics, Chemistry, Mathematics, Biology, Computer Science)',
      'Commerce (Accountancy, Business Studies, Economics, Applied Mathematics)',
      'Humanities / Arts (History, Political Science, Psychology, Sociology)',
    ],
  },

  // ========================================================
  // SECTION 8: FACILITIES & INFRASTRUCTURE (All Predefined Facilities Catalogue with Icons)
  // ========================================================
  section_8_facilities: {
    section_name: 'Facilities & Infrastructure',
    instructions: 'Har facility ka exact key, name, category, aur official icon link niche diya hai. School me jo-jo facility available hai, unhe "selected": true set karein.',
    total_facilities_count: ALL_PREDEFINED_FACILITIES.length,
    all_facilities: ALL_PREDEFINED_FACILITIES,
    selected_facility_names: [
      'Smart Classes',
      'Library',
      'Physics Lab',
      'Chemistry Lab',
      'Biology Lab',
      'Computer Lab',
      'Playground / Outdoor Sports',
      'CCTV Surveillance',
      'Drinking Water',
    ],
  },

  // ========================================================
  // SECTION 9: CAMPUS PHOTO & VIDEO GALLERY
  // ========================================================
  section_9_campus_gallery: {
    section_name: 'Campus Photo & Video Gallery',
    gallery_items: [
      {
        id: 'gal-1',
        title: 'Central Academic Campus', // Max 35 chars
        category: 'Campus', // 'Campus' | 'Labs' | 'Sports' | 'Events'
        type: 'image',
        url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80',
      },
      {
        id: 'gal-2',
        title: 'Robotics & STEM Tinkering Lab',
        category: 'Labs',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80',
      },
      {
        id: 'gal-3',
        title: 'Annual Athletic Meet',
        category: 'Sports',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1200&q=80',
      },
    ],
  },

  // ========================================================
  // SECTION 10: TRANSPARENT FEE STRUCTURE
  // ========================================================
  section_10_fee_structure: {
    section_name: 'Transparent Fee Structure Table',
    fee_table: {
      columns: ['Class Level', 'Quarterly Tuition', 'Annual Fee', 'Lab & Dev Fee', 'Total Annual (Est.)'],
      rows: [
        ['Primary (Class 1 to 5)', '₹12,500', '₹5,000', '₹3,500', '₹58,500'],
        ['Middle (Class 6 to 8)', '₹15,000', '₹6,000', '₹4,000', '₹70,000'],
        ['Secondary (Class 9 & 10)', '₹18,000', '₹7,500', '₹5,000', '₹84,500'],
        ['Senior Secondary (11 & 12)', '₹21,000', '₹9,000', '₹6,500', '₹99,500'],
      ],
    },
  },

  // ========================================================
  // SECTION 11: ADMISSIONS GUIDELINES & PROCESS
  // ========================================================
  section_11_admissions_guidelines: {
    section_name: 'Admissions Guidelines & Criteria',
    session: '2026-27',
    admission_status: 'Admissions Open',
    admissions_cards: [
      {
        id: 'adm-1',
        title: 'Primary Wing Fresh Admissions', // Max 35 chars
        criteria: 'Age 6+ as of March 31st per NEP 2020. Informal interaction with child and parents.', // Max 110 chars
        badge: 'Session 2026-27 Open', // Max 22 chars
        icon: 'Baby',
        points: ['Birth Certificate verification', 'Immunization record', 'Aadhaar Card of student & parents'],
      },
      {
        id: 'adm-2',
        title: 'Middle & Senior Lateral Admissions',
        criteria: 'Aptitude assessment in English, Mathematics and Science followed by counseling.',
        badge: 'Merit Scholarships',
        icon: 'GraduationCap',
        points: ['Previous academic transcripts', 'Transfer Certificate (TC)', 'Character Certificate'],
      },
    ],
  },

  // ========================================================
  // SECTION 12: FREQUENTLY ASKED QUESTIONS (FAQS)
  // ========================================================
  section_12_faqs: {
    section_name: 'Frequently Asked Questions (FAQs)',
    faq_items: [
      {
        id: 'faq-1',
        question: 'What is the admission procedure for the school?', // Max 120 chars
        answer: 'Parents can fill the online application or visit the campus admission desk. Shortlisted applicants undergo a friendly interaction followed by document submission.', // Max 350 chars
        category: 'Admissions',
      },
      {
        id: 'faq-2',
        question: 'Does the school provide transport facilities?',
        answer: 'Yes, modern GPS-tracked, CCTV-monitored buses with female attendants ply across all major city routes.',
        category: 'Facilities',
      },
      {
        id: 'faq-3',
        question: 'Can fees be paid in quarterly installments?',
        answer: 'Yes, tuition and activity fees can be paid in four convenient quarterly installments through net banking, debit/credit cards, or at the school counter.',
        category: 'Fees',
      },
      {
        id: 'faq-4',
        question: 'What sports coaching facilities are available on campus?',
        answer: 'The school features dedicated football, basketball, cricket nets, lawn tennis, badminton, and yoga sessions coached by certified NIS trainers.',
        category: 'Sports',
      },
    ],
  },

  // ========================================================
  // SECTION 13: OFFICIAL CONTACT CHANNELS & LOCATION
  // ========================================================
  section_13_contact_details: {
    section_name: 'Official Contact Channels & Location',
    address: 'DELHI PUBLIC SCHOOL REWARI VILL JAUNAWAS PO DUNGERWAS TEH REWARI DISTT REWARI STATE HARYANA', // Max 120 chars (UDISE Locked)
    village_or_locality: 'Jonawas', // Max 40 chars
    block_name: 'Rewari', // Max 40 chars
    district: 'REWARI', // Max 40 chars
    state: 'HARYANA', // Max 40 chars
    pincode: '123401', // Max 10 chars
    rural_urban: 'Rural',
    phone: '+91 1274 250100', // Max 25 chars
    email: 'info@dpsrewari.edu.in', // Max 50 chars
    website: 'https://www.dpsrewari.edu.in', // Max 70 chars
    visiting_hours: 'Monday to Saturday: 8:30 AM - 2:30 PM',
    // 4 Dedicated Inquiry Channels
    general_inquiry_phone: '+91 1274 250100',
    general_inquiry_email: 'info@dpsrewari.edu.in',
    admissions_inquiry_phone: '+91 1274 250101',
    admissions_inquiry_email: 'admissions@dpsrewari.edu.in',
    principal_office_phone: '+91 1274 250102',
    principal_office_email: 'principal@dpsrewari.edu.in',
    careers_inquiry_phone: '+91 1274 250103',
    careers_inquiry_email: 'careers@dpsrewari.edu.in',
    social_links: {
      facebook: 'https://facebook.com/dpsrewariofficial',
      instagram: 'https://instagram.com/dpsrewari',
      linkedin: 'https://linkedin.com/school/dpsrewari',
      youtube: 'https://youtube.com/@dpsrewariofficial',
    },
  },
};

/**
 * Categorized listing of all 69 Predefined Facilities to embed in AI prompts.
 */
export function getPredefinedFacilitiesPromptList(): string {
  return FACILITY_CATEGORIES.map((cat) => {
    const itemNames = cat.items.map((i) => `"${i.name}"`).join(', ');
    return `• ${cat.category} (${cat.items.length} options): [${itemNames}]`;
  }).join('\n');
}

/**
 * Strict Character Limit Specification & Source Rules for each individual section.
 */
export const SECTION_FIELD_SPECS: Record<
  string,
  {
    section_id: string;
    section_name: string;
    official_sources: string[];
    strict_rules: string[];
    field_limits: Record<string, { max_chars?: number; type: string; description: string; rule: string }>;
  }
> = {
  section_1_basic_info: {
    section_id: 'section_1_basic_info',
    section_name: 'Basic Institutional Identity',
    official_sources: [
      'Official School Website (About Us / Mandatory Public Disclosure Appendix IX)',
      'Official Government UDISE+ Portal (https://kys.udiseplus.gov.in)',
      'CBSE / ICSE / State Board Affiliation Register',
    ],
    strict_rules: [
      'School name must match official board affiliation/UDISE records.',
      'UDISE Code must be exactly 11 digits numeric.',
      'Never exceed character limits; UI card containers will overflow.',
    ],
    field_limits: {
      school_name: { max_chars: 65, type: 'string', description: 'Official School Name', rule: 'Max 65 chars (UPPERCASE or Title Case)' },
      udise_code: { max_chars: 11, type: 'string', description: 'Government UDISE Code', rule: 'Exactly 11 digits' },
      board: { max_chars: 50, type: 'string', description: 'Affiliation Board', rule: 'Max 50 chars (e.g. CBSE / ICSE / IB)' },
      affiliation_number: { max_chars: 25, type: 'string', description: 'Board Affiliation Number', rule: 'Max 25 chars' },
      medium: { max_chars: 35, type: 'string', description: 'Medium of Instruction', rule: 'Max 35 chars (e.g. English & Hindi Medium)' },
      established_year: { max_chars: 10, type: 'string', description: 'Year Established', rule: 'Max 10 chars (e.g. 2013)' },
      campus_area: { max_chars: 20, type: 'string', description: 'Total Campus Land Area', rule: 'Max 20 chars (e.g. 14 Acres)' },
      school_type: { max_chars: 35, type: 'string', description: 'Institution Type', rule: 'Max 35 chars (e.g. Private Unaided)' },
      management: { max_chars: 45, type: 'string', description: 'Society / Trust Management', rule: 'Max 45 chars' },
      school_category: { max_chars: 45, type: 'string', description: 'School Class Category', rule: 'Max 45 chars (e.g. Class 1 to 12th)' },
      gender_type: { max_chars: 25, type: 'string', description: 'Gender Admission Type', rule: 'Co-Educational | Boys | Girls' },
    },
  },
  section_2_hero_prestige_metrics: {
    section_id: 'section_2_hero_prestige_metrics',
    section_name: 'Hero Floating Attraction Metrics (4 Cards)',
    official_sources: ['School Website Home / Academics', 'Board Results Notification', 'UDISE+ Teacher Records'],
    strict_rules: ['Provide exactly 4 metrics for the 4 floating cards.', 'Keep value strictly under 12 characters.'],
    field_limits: {
      metric_1_board_results: { max_chars: 12, type: 'string', description: 'Affiliated Board / Pass %', rule: 'Max 12 chars (e.g. "CBSE" or "100%")' },
      metric_2_student_teacher_ratio: { max_chars: 12, type: 'string', description: 'Student-Teacher Ratio', rule: 'Max 12 chars (e.g. "1:15")' },
      metric_3_classrooms_labs: { max_chars: 12, type: 'string', description: 'Classrooms & Labs Count', rule: 'Max 12 chars (e.g. "55+")' },
      metric_4_class_range: { max_chars: 14, type: 'string', description: 'Class Range / Awards', rule: 'Max 14 chars (e.g. "Class 1-12")' },
    },
  },
  section_3_photobook_slides: {
    section_id: 'section_3_photobook_slides',
    section_name: '3D PhotoBook Carousel Showcase',
    official_sources: ['Official School Gallery / Campus Photos', 'School Facebook/Instagram official handles'],
    strict_rules: ['Between 3 to 6 slides maximum.', 'Slide title max 35 chars, description max 90 chars.'],
    field_limits: {
      title: { max_chars: 35, type: 'string', description: 'Slide Heading', rule: 'Max 35 chars' },
      desc: { max_chars: 90, type: 'string', description: 'Slide Subtitle / Highlight', rule: 'Max 90 chars' },
      button_text: { max_chars: 18, type: 'string', description: 'Action Button Label', rule: 'Max 18 chars' },
      image_url: { type: 'string', description: 'High-Res Landscape Photo URL', rule: 'Valid image URL' },
    },
  },
  section_4_statistics: {
    section_id: 'section_4_statistics',
    section_name: 'Physical Campus Statistics',
    official_sources: ['UDISE+ Portal Infrastructure Report', 'School Annual Report'],
    strict_rules: ['Use integers only.', 'Must be authentic campus figures.'],
    field_limits: {
      total_students: { type: 'number', description: 'Total Enrolled Students', rule: 'Positive integer' },
      total_teachers: { type: 'number', description: 'Total Teaching Faculty', rule: 'Positive integer' },
      classrooms_count: { type: 'number', description: 'Total Classrooms', rule: 'Positive integer' },
      working_smart_boards: { type: 'number', description: 'Digital Smart Boards Count', rule: 'Positive integer' },
    },
  },
  section_5_about_and_vision: {
    section_id: 'section_5_about_and_vision',
    section_name: 'About School, Vision & Mission',
    official_sources: ['Official School Website (About Us & Vision Pages)'],
    strict_rules: ['Strict character limits: About (300), Vision (180), Mission (180).'],
    field_limits: {
      about_text: { max_chars: 300, type: 'string', description: 'School Heritage Story', rule: 'Max 300 chars (2-3 concise sentences)' },
      vision_text: { max_chars: 180, type: 'string', description: 'Future Institutional Vision', rule: 'Max 180 chars' },
      mission_text: { max_chars: 180, type: 'string', description: 'Core Educational Mission', rule: 'Max 180 chars' },
    },
  },
  section_6_principal_desk: {
    section_id: 'section_6_principal_desk',
    section_name: "Principal's Desk & Leadership Message",
    official_sources: ['School Website (Principal Desk / Message)'],
    strict_rules: ['Principal message max 250 characters.', 'Name max 40 characters.'],
    field_limits: {
      principal_name: { max_chars: 40, type: 'string', description: 'Principal Full Name with Salutation', rule: 'Max 40 chars' },
      principal_designation: { max_chars: 40, type: 'string', description: 'Designation', rule: 'Max 40 chars (e.g. Principal / Head of School)' },
      principal_message: { max_chars: 250, type: 'string', description: 'Welcome / Leadership Quote', rule: 'Max 250 chars' },
      principal_image_url: { type: 'string', description: 'Portrait Photo URL', rule: 'Square/portrait aspect ratio' },
    },
  },
  section_management_desk: {
    section_id: 'section_management_desk',
    section_name: 'Governing Body & Management Message',
    official_sources: ['School Website (Management / Trust Page)'],
    strict_rules: ['Management message max 280 characters.'],
    field_limits: {
      management_name: { max_chars: 45, type: 'string', description: 'Registered Society/Trust Name', rule: 'Max 45 chars' },
      management_designation: { max_chars: 45, type: 'string', description: 'Governing Body Role', rule: 'Max 45 chars' },
      management_message: { max_chars: 280, type: 'string', description: 'Trustee / Society Message', rule: 'Max 280 chars' },
      management_logo: { type: 'string', description: 'Society Seal/Logo URL', rule: 'Valid image URL' },
    },
  },
  section_7_academics: {
    section_id: 'section_7_academics',
    section_name: 'Curriculum, Streams & Special Programs',
    official_sources: ['School Website (Academics / Curriculum)'],
    strict_rules: ['Curriculum bullet points max 70 chars each.', 'Streams offered max 80 chars each.'],
    field_limits: {
      class_from: { max_chars: 20, type: 'string', description: 'Starting Class Level', rule: 'Max 20 chars (e.g. Pre-Nursery or Class 1st)' },
      class_to: { max_chars: 20, type: 'string', description: 'Highest Class Level', rule: 'Max 20 chars (e.g. Class 12th)' },
      curriculum_features: { max_chars: 70, type: 'array of strings', description: '3-5 Pedagogical Highlights', rule: 'Each max 70 chars' },
      streams_offered: { max_chars: 80, type: 'array of strings', description: 'Senior Secondary Streams', rule: 'Each max 80 chars' },
    },
  },
  section_8_facilities: {
    section_id: 'section_8_facilities',
    section_name: 'Facilities & Infrastructure (69 Predefined Options)',
    official_sources: ['Official School Website Infrastructure Page', 'UDISE+ Physical Facilities Report'],
    strict_rules: ['Pick 12 to 25 items ONLY from the 69 predefined facility names list.', 'Do NOT invent new names.'],
    field_limits: {
      selected_facility_names: { type: 'array of strings', description: 'Verified Facilities Present', rule: 'Must match official 69 names verbatim' },
    },
  },
  section_9_campus_gallery: {
    section_id: 'section_9_campus_gallery',
    section_name: 'Campus Photo & Video Gallery',
    official_sources: ['Official School Website Gallery / Campus Infrastructure Media'],
    strict_rules: ['Title max 35 chars.', 'Category: Campus | Labs | Sports | Events.'],
    field_limits: {
      title: { max_chars: 35, type: 'string', description: 'Photo Caption', rule: 'Max 35 chars' },
      category: { max_chars: 20, type: 'string', description: 'Media Category', rule: 'Campus | Labs | Sports | Events' },
      url: { type: 'string', description: 'Image/Video URL', rule: 'Valid URL' },
    },
  },
  section_10_fee_structure: {
    section_id: 'section_10_fee_structure',
    section_name: 'Transparent Fee Structure Table',
    official_sources: ['School Website Fee Structure Page / CBSE Appendix IX PDF'],
    strict_rules: ['4 to 6 columns max.', 'Class row names and fee amounts formatted in INR (₹).'],
    field_limits: {
      columns: { max_chars: 25, type: 'array of strings', description: 'Table Headers', rule: 'Each header max 25 chars' },
      rows: { type: 'array of string arrays', description: 'Class-wise Fee Breakdown', rule: 'Values formatted with ₹ symbol' },
    },
  },
  section_11_admissions_guidelines: {
    section_id: 'section_11_admissions_guidelines',
    section_name: 'Admissions Guidelines & Criteria',
    official_sources: ['School Website Admissions Notice'],
    strict_rules: ['Track title max 35 chars, criteria max 110 chars, points max 35 chars.'],
    field_limits: {
      session: { max_chars: 15, type: 'string', description: 'Academic Session', rule: 'Max 15 chars (e.g. 2026-27)' },
      admission_status: { max_chars: 25, type: 'string', description: 'Status Badge', rule: 'Admissions Open | Admissions Closed' },
      title: { max_chars: 35, type: 'string', description: 'Track Heading', rule: 'Max 35 chars' },
      criteria: { max_chars: 110, type: 'string', description: 'Eligibility Requirement', rule: 'Max 110 chars' },
    },
  },
  section_12_faqs: {
    section_id: 'section_12_faqs',
    section_name: 'Frequently Asked Questions (FAQs)',
    official_sources: ['School Website FAQ / Helpdesk'],
    strict_rules: ['Question max 120 chars, Answer max 320 chars.'],
    field_limits: {
      question: { max_chars: 120, type: 'string', description: 'User Question', rule: 'Max 120 chars' },
      answer: { max_chars: 320, type: 'string', description: 'Factual Answer', rule: 'Max 320 chars' },
      category: { max_chars: 25, type: 'string', description: 'Category', rule: 'Admissions | Facilities | Fees | Sports' },
    },
  },
  section_13_contact_details: {
    section_id: 'section_13_contact_details',
    section_name: 'Official Contact Channels & Location',
    official_sources: ['Official School Contact Page', 'Government UDISE+ Registered Address'],
    strict_rules: ['Address max 120 chars.', 'Pincode must be exactly 6 digits.'],
    field_limits: {
      address: { max_chars: 120, type: 'string', description: 'Official Address', rule: 'Max 120 chars' },
      pincode: { max_chars: 6, type: 'string', description: 'Postal PIN Code', rule: 'Exactly 6 digits' },
      phone: { max_chars: 25, type: 'string', description: 'Primary Phone', rule: 'Max 25 chars' },
      email: { max_chars: 50, type: 'string', description: 'Official Email', rule: 'Max 50 chars' },
      website: { max_chars: 70, type: 'string', description: 'Official Website URL', rule: 'Max 70 chars' },
      campus_video_url: { max_chars: 150, type: 'string', description: 'Campus Walkthrough Video URL', rule: 'YouTube / MP4 URL' },
    },
  },
};

/**
 * Standard Prompt template to give to ChatGPT / Claude / Gemini / DeepSeek.
 * Can generate either the full 13-section prompt OR a focused section prompt.
 */
export function generateAiPromptForSchool(schoolNameOrDetails: string = '', sectionKey?: string): string {
  const facilitiesListText = getPredefinedFacilitiesPromptList();

  // If a specific section was requested, generate a laser-focused prompt for that section
  if (sectionKey && SECTION_FIELD_SPECS[sectionKey]) {
    const spec = SECTION_FIELD_SPECS[sectionKey];
    const sectionTemplate = (BLANK_AI_SCHOOL_SCHEMA as any)[sectionKey] || {};

    return `You are a Senior School Admissions Data Specialist for CSEEL (India's premier experiential school directory).

TASK:
Research and compile authentic data for ONE SPECIFIC SECTION: "${spec.section_name}" (${spec.section_id}) for:
SCHOOL: ${schoolNameOrDetails.trim() ? schoolNameOrDetails : '[PASTE SCHOOL NAME / UDISE HERE]'}

MANDATORY OFFICIAL SOURCES:
${spec.official_sources.map((s, i) => `${i + 1}. ${s}`).join('\n')}

STRICT RULES & CHARACTER LIMITS (NEVER EXCEED OR UI WILL BREAK):
${spec.strict_rules.map((r) => `• ${r}`).join('\n')}
Field Character Limits:
${Object.entries(spec.field_limits).map(([f, d]) => `• "${f}": ${d.rule} (${d.description})`).join('\n')}

RETURN FORMAT:
Return ONLY valid raw JSON for this section wrapped in a \`\`\`json code block:
\`\`\`json
${JSON.stringify({ [sectionKey]: sectionTemplate }, null, 2)}
\`\`\`
`;
  }

  // Otherwise generate the Master 13-Section Prompt
  const schemaString = JSON.stringify(BLANK_AI_SCHOOL_SCHEMA, null, 2);

  return `You are a Senior School Admissions & Institutional Profile Specialist for CSEEL (India's premier experiential school directory).

TASK:
Compile a 100% FACTUAL, OFFICIAL, and COMPACT School Profile JSON for the specified school across all 13 sections.

SCHOOL TO COMPILE:
${schoolNameOrDetails.trim() ? schoolNameOrDetails : '[PASTE SCHOOL NAME, LOCATION, WEBSITE, OR UDISE HERE]'}

MANDATORY DATA EXTRACTION HIERARCHY (SOURCE OF TRUTH):
1. PRIMARY SOURCE 1: Official School Website (About Us, Fee Structure PDF/Page, Principal Message, Mandatory Public Disclosure / CBSE Appendix IX).
2. PRIMARY SOURCE 2: Official Government UDISE+ Portal (https://kys.udiseplus.gov.in) for verified School Name, UDISE Code, Established Year, District, State, Pincode, and Management Type.
3. SECONDARY SOURCE: Verified Educational Aggregators (UniApply, Edustoke, SchoolMyKids, Google Maps Official Business Listing).

STRICT CHARACTER LIMITS (NEVER EXCEED, otherwise UI structure breaks):
• School Name: Max 65 chars (Government UDISE verified)
• About Text: Max 300 chars (concise 2-3 sentences)
• Vision & Mission: Max 180 chars each
• Principal Name & Designation: Max 40 chars each
• Principal Message & Management Message: Max 250-280 chars
• Hero Metric Values (4 Cards): Max 12 chars each (e.g. "CBSE", "1:15", "55+", "Class 1-12")
• Hero Metric Labels: Max 25 chars each
• PhotoBook Slide Titles: Max 35 chars | Descriptions: Max 90 chars
• Facility & Admission Titles: Max 35 chars

🏢 69 PREDEFINED FACILITIES SELECTION (CRITICAL):
For "section_8_facilities.selected_facility_names", you MUST pick 12 to 25 items ONLY from these exact 69 predefined facility names:
${facilitiesListText}
Do NOT invent new facility names. The system will automatically attach verified official icons!

--- EXACT VERIFIED JSON BLUEPRINT TO FILL ---
${schemaString}
`;
}

export interface ImportSummary {
  schoolName: string;
  board: string;
  district: string;
  state: string;
  slidesCount: number;
  facilitiesCount: number;
  galleryCount: number;
  feeRowsCount: number;
}

/**
 * Parses user-provided JSON (either tab-based schema, old section schema, or raw export)
 * and safely transforms it into a validated SchoolTemplateState with strict length truncation.
 */
export function parseSchoolJsonToState(
  rawInput: any,
  currentState?: SchoolTemplateState
): { success: boolean; state?: SchoolTemplateState; summary?: ImportSummary; error?: string } {
  try {
    let parsed: any = rawInput;
    if (typeof rawInput === 'string') {
      let cleaned = rawInput.trim();
      if (cleaned.startsWith('```json')) {
        cleaned = cleaned.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
      } else if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      parsed = JSON.parse(cleaned);
    }

    if (!parsed || typeof parsed !== 'object') {
      return { success: false, error: 'Invalid JSON: Expected an object at the root level.' };
    }

    const nextState: SchoolTemplateState = {
      ...(currentState || {}),
      contentOverrides: { ...(currentState?.contentOverrides || {}) },
    } as any;

    // ==========================================
    // TAB 1: HOME
    // ==========================================
    const tabHome = parsed.tab_1_home || parsed.tab_home || parsed.home || parsed;
    const basicInfo = tabHome?.school_basic_info || parsed.section_1_basic_info || parsed.basic_info || tabHome;

    if (basicInfo && typeof basicInfo === 'object') {
      if (basicInfo.school_name !== undefined) nextState.schoolName = limitLength(basicInfo.school_name, 70);
      else if (parsed.schoolName !== undefined) nextState.schoolName = limitLength(parsed.schoolName, 70);

      if (basicInfo.udise_code !== undefined) nextState.udiseCode = limitLength(basicInfo.udise_code, 15);
      else if (parsed.udiseCode !== undefined) nextState.udiseCode = limitLength(parsed.udiseCode, 15);

      if (basicInfo.board !== undefined) nextState.board = limitLength(basicInfo.board, 50);
      else if (parsed.board !== undefined) nextState.board = limitLength(parsed.board, 50);

      if (basicInfo.medium !== undefined) nextState.medium = limitLength(basicInfo.medium, 40);
      else if (parsed.medium !== undefined) nextState.medium = limitLength(parsed.medium, 40);

      if (basicInfo.principal_name !== undefined) nextState.principalName = limitLength(basicInfo.principal_name, 45);
      else if (parsed.principalName !== undefined) nextState.principalName = limitLength(parsed.principalName, 45);

      if (basicInfo.established_year !== undefined) nextState.establishedYear = limitLength(basicInfo.established_year, 12);
      else if (parsed.establishedYear !== undefined) nextState.establishedYear = limitLength(parsed.establishedYear, 12);

      if (basicInfo.campus_area !== undefined) nextState.campusArea = limitLength(basicInfo.campus_area, 25);
      else if (parsed.campusArea !== undefined) nextState.campusArea = limitLength(parsed.campusArea, 25);

      if (basicInfo.school_type !== undefined) nextState.schoolType = limitLength(basicInfo.school_type, 35);
      else if (parsed.schoolType !== undefined) nextState.schoolType = limitLength(parsed.schoolType, 35);

      if (basicInfo.management !== undefined) nextState.management = limitLength(basicInfo.management, 50);
      else if (parsed.management !== undefined) nextState.management = limitLength(parsed.management, 50);

      if (basicInfo.school_category !== undefined) nextState.schoolCategory = limitLength(basicInfo.school_category, 50);
      else if (parsed.schoolCategory !== undefined) nextState.schoolCategory = limitLength(parsed.schoolCategory, 50);

      if (basicInfo.gender_type !== undefined) nextState.genderType = limitLength(basicInfo.gender_type, 25);
      else if (parsed.genderType !== undefined) nextState.genderType = limitLength(parsed.genderType, 25);

      const aff = basicInfo.affiliation_number ?? basicInfo.affiliationNumber ?? parsed.affiliation_number ?? parsed.affiliationNumber ?? parsed.affiliation_no;
      if (aff !== undefined) nextState.affiliationNumber = limitLength(aff, 30);
    }

    // Hero Prestige Metrics (Attraction metrics for parents & students)
    const heroMetrics =
      tabHome?.hero_prestige_metrics ||
      tabHome?.prestige_metrics ||
      parsed.section_2_hero_prestige_metrics ||
      parsed.section_2_hero_metrics ||
      parsed.sections?.section_2_hero_prestige_metrics ||
      parsed.sections?.section_2_hero_metrics;
    if (heroMetrics && typeof heroMetrics === 'object') {
      const m1 = heroMetrics.metric_1_board_results || heroMetrics.metric_1_board || heroMetrics.metric_1;
      if (m1) {
        if (m1.value) nextState.contentOverrides!['hero_stat_val_1'] = limitLength(m1.value, 12);
        if (m1.label) nextState.contentOverrides!['hero_stat_lbl_1'] = limitLength(m1.label, 28);
      }
      const m2 = heroMetrics.metric_2_student_teacher_ratio || heroMetrics.metric_2_ratio || heroMetrics.metric_2;
      if (m2) {
        if (m2.value) nextState.contentOverrides!['hero_stat_val_2'] = limitLength(m2.value, 12);
        if (m2.label) nextState.contentOverrides!['hero_stat_lbl_2'] = limitLength(m2.label, 28);
      }
      const m3 = heroMetrics.metric_3_classrooms_labs || heroMetrics.metric_3_labs_studios || heroMetrics.metric_3;
      if (m3) {
        if (m3.value) nextState.contentOverrides!['hero_stat_val_3'] = limitLength(m3.value, 12);
        if (m3.label) nextState.contentOverrides!['hero_stat_lbl_3'] = limitLength(m3.label, 28);
      }
      const m4 = heroMetrics.metric_4_class_range || heroMetrics.metric_4_awards || heroMetrics.metric_4;
      if (m4) {
        if (m4.value) nextState.contentOverrides!['hero_stat_val_4'] = limitLength(m4.value, 12);
        if (m4.label) nextState.contentOverrides!['hero_stat_lbl_4'] = limitLength(m4.label, 28);
      }
      const m5 = heroMetrics.metric_5_parent_trust || heroMetrics.metric_5;
      if (m5) {
        if (m5.value) nextState.contentOverrides!['hero_stat_val_5'] = limitLength(m5.value, 12);
        if (m5.label) nextState.contentOverrides!['hero_stat_lbl_5'] = limitLength(m5.label, 28);
      }
    }

    // Branding
    const branding =
      tabHome?.branding ||
      parsed.section_1_basic_info?.branding ||
      parsed.sections?.section_1_basic_info?.branding ||
      parsed.section_4_about_vision?.branding ||
      parsed.branding ||
      tabHome;
    const logoCandidate =
      branding?.logo_image_url ||
      branding?.logo_image ||
      branding?.logo_url ||
      branding?.logo ||
      parsed.logoImage ||
      parsed.logo_image ||
      parsed.logo_url ||
      parsed.logo;
    if (logoCandidate) {
      nextState.logoImage = String(logoCandidate).trim();
      nextState.imageOverrides = {
        ...(nextState.imageOverrides || {}),
        school_logo: String(logoCandidate).trim(),
      };
    }

    const heroCandidate =
      branding?.hero_banner_image ||
      branding?.hero_image ||
      parsed.heroImage ||
      parsed.hero_image ||
      parsed.hero_banner_image;
    if (heroCandidate) {
      nextState.heroImage = String(heroCandidate).trim();
    }

    const imgOverrides = parsed.imageOverrides || parsed.image_overrides;
    if (imgOverrides && typeof imgOverrides === 'object') {
      nextState.imageOverrides = {
        ...(nextState.imageOverrides || {}),
        ...imgOverrides,
      };
    }


    // Physical Statistics (Section 4)
    const stats =
      tabHome?.statistics ||
      parsed.section_4_statistics ||
      parsed.sections?.section_4_statistics ||
      parsed.section_3_statistics ||
      parsed.key_statistics ||
      tabHome;
    if (stats && typeof stats === 'object') {
      if (stats.total_students !== undefined) nextState.totalStudents = Number(stats.total_students) || 0;
      else if (parsed.totalStudents !== undefined) nextState.totalStudents = Number(parsed.totalStudents) || 0;

      if (stats.total_boys !== undefined) nextState.totalBoys = Number(stats.total_boys) || 0;
      else if (parsed.totalBoys !== undefined) nextState.totalBoys = Number(parsed.totalBoys) || 0;

      if (stats.total_girls !== undefined) nextState.totalGirls = Number(stats.total_girls) || 0;
      else if (parsed.totalGirls !== undefined) nextState.totalGirls = Number(parsed.totalGirls) || 0;

      if (stats.total_teachers !== undefined) nextState.totalTeachers = Number(stats.total_teachers) || 0;
      else if (parsed.totalTeachers !== undefined) nextState.totalTeachers = Number(parsed.totalTeachers) || 0;

      if (stats.classrooms_count !== undefined) nextState.classroomsCount = Number(stats.classrooms_count) || 0;
      else if (parsed.classroomsCount !== undefined) nextState.classroomsCount = Number(parsed.classroomsCount) || 0;

      if (stats.working_smart_boards !== undefined) nextState.workingSmartBoards = Number(stats.working_smart_boards) || 0;
      else if (parsed.workingSmartBoards !== undefined) nextState.workingSmartBoards = Number(parsed.workingSmartBoards) || 0;

      if (stats.is_residential !== undefined) nextState.isResidential = Boolean(stats.is_residential);
      if (stats.has_hostel !== undefined) nextState.hasHostel = Boolean(stats.has_hostel);
    }

    // About, Vision & Mission (Section 5)
    const aboutObj =
      tabHome?.about_and_principles ||
      parsed.section_5_about_and_vision ||
      parsed.sections?.section_5_about_and_vision ||
      parsed.section_4_about_vision ||
      tabHome;
    if (aboutObj && typeof aboutObj === 'object') {
      if (aboutObj.about_text !== undefined) nextState.aboutText = limitLength(aboutObj.about_text, 350);
      else if (parsed.aboutText !== undefined) nextState.aboutText = limitLength(parsed.aboutText, 350);

      if (aboutObj.vision_text !== undefined) nextState.visionText = limitLength(aboutObj.vision_text, 200);
      else if (parsed.visionText !== undefined) nextState.visionText = limitLength(parsed.visionText, 200);

      if (aboutObj.mission_text !== undefined) nextState.missionText = limitLength(aboutObj.mission_text, 200);
      else if (parsed.missionText !== undefined) nextState.missionText = limitLength(parsed.missionText, 200);
    }

    // Principal's Desk (Section 6)
    const principalObj =
      tabHome?.principal_desk ||
      parsed.section_6_principal_desk ||
      parsed.sections?.section_6_principal_desk ||
      parsed.section_4_about_vision?.principal_desk ||
      tabHome;
    if (principalObj && typeof principalObj === 'object') {
      if (principalObj.principal_name) nextState.principalName = limitLength(principalObj.principal_name, 45);
      if (principalObj.principal_designation) {
        nextState.contentOverrides!['principal_designation'] = limitLength(principalObj.principal_designation, 45);
      }
      if (principalObj.principal_message) {
        const msg = limitLength(principalObj.principal_message, 280);
        nextState.contentOverrides!['principal_message'] = msg;
        nextState.contentOverrides!['principal_quote'] = msg;
        nextState.contentOverrides!['principal_body_1'] = msg;
      }
      const pImg = principalObj.principal_image_url || principalObj.principal_image;
      if (pImg) {
        nextState.imageOverrides = {
          ...(nextState.imageOverrides || {}),
          principal_photo: String(pImg).trim(),
        };
      }
    }

    // Management Desk & Trust Message
    const mgmtObj =
      tabHome?.management_desk ||
      parsed.section_management_desk ||
      parsed.section_management_message ||
      parsed.sections?.section_management_desk;
    if (mgmtObj && typeof mgmtObj === 'object') {
      if (mgmtObj.management_name || mgmtObj.management) {
        nextState.management = limitLength(mgmtObj.management_name || mgmtObj.management, 50);
      }
      if (mgmtObj.management_designation) {
        nextState.contentOverrides!['management_designation'] = limitLength(mgmtObj.management_designation, 50);
      }
      if (mgmtObj.management_message || mgmtObj.message) {
        const msg = limitLength(mgmtObj.management_message || mgmtObj.message, 280);
        nextState.contentOverrides!['management_quote'] = msg;
        nextState.contentOverrides!['management_body_1'] = msg;
      }
      const mLogo = mgmtObj.management_logo || mgmtObj.logo_url;
      if (mLogo) {
        nextState.imageOverrides = {
          ...(nextState.imageOverrides || {}),
          management_logo: String(mLogo).trim(),
        };
      }
    }

    // 3D Photo Book Slides (Section 3)
    const slidesList =
      tabHome?.photobook_3d_slides ||
      tabHome?.slides ||
      parsed.section_3_photobook_slides?.slides ||
      parsed.sections?.section_3_photobook_slides?.slides ||
      parsed.section_3_photobook_slides ||
      parsed.section_5_photobook_slides?.slides ||
      parsed.flipbookSlides ||
      parsed.flipbook_slides;
    if (Array.isArray(slidesList) && slidesList.length > 0) {
      nextState.flipbookSlides = slidesList.slice(0, 10).map((s: any, idx: number) => ({
        id: s.id || s.slide_id || `fb-${idx}`,
        title: limitLength(s.title || `Campus Highlight #${idx + 1}`, 40),
        desc: limitLength(s.desc || '', 100),
        mediaType: s.media_type === 'video' || s.mediaType === 'video' ? 'video' : 'image',
        image: String(s.image_url || s.image || '').trim(),
        videoUrl: String(s.video_url || s.videoUrl || '').trim(),
        buttonText: limitLength(s.button_text || s.buttonText || 'Explore Campus', 20),
        actionTab: String(s.action_tab || s.actionTab || 'facilities').trim(),
      }));
    }

    // ==========================================
    // SECTION 7 / TAB 2: ACADEMICS
    // ==========================================
    const tabAcademics =
      parsed.tab_2_academics ||
      parsed.tab_academics ||
      parsed.section_7_academics ||
      parsed.sections?.section_7_academics ||
      parsed.academics;
    if (tabAcademics && typeof tabAcademics === 'object') {
      const cr = tabAcademics.class_range || basicInfo;
      if (cr && typeof cr === 'object') {
        if (cr.class_from !== undefined) nextState.classFrom = limitLength(cr.class_from, 20);
        else if (cr.classFrom !== undefined) nextState.classFrom = limitLength(cr.classFrom, 20);

        if (cr.class_to !== undefined) nextState.classTo = limitLength(cr.class_to, 20);
        else if (cr.classTo !== undefined) nextState.classTo = limitLength(cr.classTo, 20);
      }

      const featList = tabAcademics.curriculum_features || tabAcademics.academic_features || parsed.includedAcademicFeatures;
      if (Array.isArray(featList) && featList.length > 0) {
        nextState.includedAcademicFeatures = featList.map((f: any) => limitLength(f, 80));
      }
    }

    // ==========================================
    // SECTION: BOARD EXAMINATION RESULTS
    // ==========================================
    const boardResultsObj =
      parsed.section_board_results ||
      parsed.board_results ||
      parsed.boardResults ||
      tabAcademics?.board_results ||
      parsed.sections?.section_board_results;

    if (boardResultsObj && typeof boardResultsObj === 'object') {
      const c10Raw = boardResultsObj.class10Results || boardResultsObj.class_10_results || [];
      const c12Raw = boardResultsObj.class12Results || boardResultsObj.class_12_results || [];

      const clean10 = Array.isArray(c10Raw)
        ? c10Raw.slice(0, 2).map((r: any) => {
            const total = Number(r.totalStudents ?? r.total_students ?? 0);
            const passed = Number(r.passedStudents ?? r.passed_students ?? 0);
            const passPct = total > 0 ? parseFloat(((passed / total) * 100).toFixed(1)) : (Number(r.passPercentage ?? r.pass_percentage ?? 0) || 0);
            return {
              year: limitLength(r.year || '2024-25', 15),
              totalStudents: total,
              passedStudents: Math.min(passed, total),
              passPercentage: passPct,
              maxScorePercent: Math.min(100, Math.max(0, parseFloat(Number(r.maxScorePercent ?? r.max_score_percent ?? 0).toFixed(1)))),
              above90PercentCount: Math.min(total, Math.max(0, Number(r.above90PercentCount ?? r.above_90_percent_count ?? r.above90Count ?? 0))),
            };
          })
        : [];

      const clean12 = Array.isArray(c12Raw)
        ? c12Raw.slice(0, 2).map((r: any) => {
            const total = Number(r.totalStudents ?? r.total_students ?? 0);
            const passed = Number(r.passedStudents ?? r.passed_students ?? 0);
            const passPct = total > 0 ? parseFloat(((passed / total) * 100).toFixed(1)) : (Number(r.passPercentage ?? r.pass_percentage ?? 0) || 0);
            const streamsRaw = Array.isArray(r.streams) ? r.streams : [];
            const cleanStreams = streamsRaw.map((s: any) => {
              const sTotal = Number(s.totalStudents ?? s.total_students ?? 0);
              const sPassed = Number(s.passedStudents ?? s.passed_students ?? 0);
              const sPassPct = sTotal > 0 ? parseFloat(((sPassed / sTotal) * 100).toFixed(1)) : (Number(s.passPercentage ?? s.pass_percentage ?? 0) || 0);
              return {
                streamName: limitLength(s.streamName || s.stream_name || 'Science', 30),
                totalStudents: sTotal,
                passedStudents: Math.min(sPassed, sTotal),
                passPercentage: sPassPct,
                maxScorePercent: Math.min(100, Math.max(0, parseFloat(Number(s.maxScorePercent ?? s.max_score_percent ?? 0).toFixed(1)))),
                above90PercentCount: Math.min(sTotal, Math.max(0, Number(s.above90PercentCount ?? s.above_90_percent_count ?? s.above90Count ?? 0))),
              };
            });

            return {
              year: limitLength(r.year || '2024-25', 15),
              totalStudents: total,
              passedStudents: Math.min(passed, total),
              passPercentage: passPct,
              maxScorePercent: Math.min(100, Math.max(0, parseFloat(Number(r.maxScorePercent ?? r.max_score_percent ?? 0).toFixed(1)))),
              above90PercentCount: Math.min(total, Math.max(0, Number(r.above90PercentCount ?? r.above_90_percent_count ?? r.above90Count ?? 0))),
              streams: cleanStreams,
            };
          })
        : [];

      nextState.boardResults = {
        class10Results: clean10,
        class12Results: clean12,
      };
    }


    // ==========================================
    // SECTION 8 / TAB 3: FACILITIES
    // ==========================================
    const tabFacilities =
      parsed.tab_3_facilities ||
      parsed.tab_facilities ||
      parsed.section_8_facilities ||
      parsed.sections?.section_8_facilities ||
      parsed.facilities ||
      parsed.section_6_facilities;
    const rawFacList =
      (Array.isArray(tabFacilities?.items)
        ? tabFacilities.items.filter((item: any) => item.selected === true || item.available === true)
        : null) ||
      (Array.isArray(tabFacilities?.all_facilities)
        ? tabFacilities.all_facilities.filter((item: any) => item.selected === true || item.available === true)
        : null) ||
      (Array.isArray(tabFacilities?.facilities_catalogue)
        ? tabFacilities.facilities_catalogue.filter((item: any) => item.selected === true || item.available === true)
        : null) ||
      tabFacilities?.selected_facility_names ||
      tabFacilities?.facilities_list ||
      tabFacilities?.facilities ||
      parsed.facilities;

    if (Array.isArray(rawFacList) && rawFacList.length > 0) {
      const normalizedFacilities: FacilityCardItem[] = [];

      rawFacList.forEach((f: any, idx: number) => {
        const rawName = typeof f === 'string' ? f : f?.name || f?.title || f?.key || f?.id || '';
        const cleanName = rawName.toLowerCase().trim();
        const matched =
          PREDEFINED_FACILITY_MAP.get(cleanName) ||
          PREDEFINED_FACILITY_MAP.get(cleanName.replace(/[^a-z0-9]/g, '_')) ||
          PREDEFINED_FACILITY_MAP.get(cleanName.replace(/_/g, ' '));

        if (matched) {
          // Exactly matched predefined facility
          normalizedFacilities.push({
            id: typeof f === 'object' && f.id ? f.id : `fac-${idx}`,
            title: matched.name,
            desc: typeof f === 'object' && f.desc ? limitLength(f.desc, 95) : '',
            badge: typeof f === 'object' && f.badge ? limitLength(f.badge, 25) : matched.category,
            icon: matched.icon || (typeof f === 'object' ? f.icon : undefined), // Verified predefined icon URL
            points: typeof f === 'object' && Array.isArray(f.points)
              ? f.points.slice(0, 3).map((p: any) => limitLength(p, 35))
              : [],
          });
        } else if (typeof f === 'object' && f.title) {
          // Fallback if not verbatim matched
          normalizedFacilities.push({
            id: f.id || `fac-${idx}`,
            title: limitLength(f.title, 40),
            desc: limitLength(f.desc || '', 95),
            badge: f.badge ? limitLength(f.badge, 25) : undefined,
            icon: f.icon || 'https://img.icons8.com/?size=128&id=12197&format=png',
            points: Array.isArray(f.points) ? f.points.slice(0, 3).map((p: any) => limitLength(p, 35)) : [],
          });
        }
      });

      if (normalizedFacilities.length > 0) {
        nextState.facilities = normalizedFacilities;
      }
    }

    // ==========================================
    // SECTION 9 / TAB 4: CAMPUS GALLERY
    // ==========================================
    const tabGallery =
      parsed.tab_4_gallery ||
      parsed.tab_gallery ||
      parsed.section_9_campus_gallery ||
      parsed.sections?.section_9_campus_gallery ||
      parsed.gallery ||
      parsed.section_11_gallery;
    const galList = tabGallery?.gallery_items || tabGallery?.media || parsed.galleryItems || parsed.gallery_items;
    if (Array.isArray(galList) && galList.length > 0) {
      nextState.galleryItems = galList.map((g: any, idx: number) => ({
        id: g.id || `gal-${idx}`,
        title: limitLength(g.title || `Campus Photo #${idx + 1}`, 40),
        category: limitLength(g.category || 'Campus', 20),
        type: g.type === 'video' ? 'video' : 'image',
        url: String(g.url || '').trim(),
      }));
    }

    // ==========================================
    // SECTION 10, 11, 12 / TAB 5: ADMISSIONS & FEES
    // ==========================================
    const tabAdmissions =
      parsed.tab_5_admissions_fees ||
      parsed.tab_admissions ||
      parsed.admissions ||
      parsed.section_8_admissions;

    const feeObj =
      tabAdmissions?.fee_structure_table ||
      parsed.section_10_fee_structure?.fee_table ||
      parsed.sections?.section_10_fee_structure?.fee_table ||
      parsed.section_10_fee_structure?.fee_structure_table ||
      parsed.section_10_fee_structure ||
      tabAdmissions?.fee_structure ||
      parsed.section_7_academics?.fee_structure ||
      parsed.feeTableData ||
      parsed.fee_table;
    if (feeObj && Array.isArray(feeObj.columns) && Array.isArray(feeObj.rows)) {
      nextState.feeTableData = {
        columns: feeObj.columns.map((c: any) => limitLength(c, 30)),
        rows: feeObj.rows.map((row: any) =>
          Array.isArray(row) ? row.map((cell: any) => limitLength(cell, 25)) : []
        ),
      };
    }

    const extraFeeObj = parsed.extraChargesTable || parsed.extra_charges_table;
    if (extraFeeObj && Array.isArray(extraFeeObj.columns) && Array.isArray(extraFeeObj.rows)) {
      (nextState as any).extraChargesTable = {
        columns: extraFeeObj.columns.map((c: any) => limitLength(c, 30)),
        rows: extraFeeObj.rows.map((row: any) =>
          Array.isArray(row) ? row.map((cell: any) => limitLength(cell, 25)) : []
        ),
      };
    }

    const feeLink = parsed.officialFeeUrl || parsed.official_fee_url;
    if (feeLink) {
      (nextState as any).officialFeeUrl = String(feeLink).trim();
    }

    const tabContact =
      parsed.tab_6_contact ||
      parsed.tab_contact ||
      parsed.section_13_contact_details ||
      parsed.sections?.section_13_contact_details ||
      parsed.section_13_contact ||
      parsed.contact ||
      parsed.section_2_location_contact ||
      parsed;

    const campusVid =
      parsed.section_13_contact_details?.campus_video_url ||
      parsed.section_13_contact_details?.campusVideoUrl ||
      tabContact?.campus_video_url ||
      tabContact?.campusVideoUrl ||
      parsed.campusVideoUrl ||
      parsed.campus_video_url;
    if (campusVid) {
      (nextState as any).campusVideoUrl = String(campusVid).trim();
      nextState.contentOverrides!['campus_video_url'] = String(campusVid).trim();
    }

    if (parsed.admissionsOpen !== undefined) {
      nextState.admissionsOpen = Boolean(parsed.admissionsOpen);
    } else if (parsed.admissions_open !== undefined) {
      nextState.admissionsOpen = Boolean(parsed.admissions_open);
    } else if (parsed.admission_open !== undefined) {
      nextState.admissionsOpen = Boolean(parsed.admission_open);
    } else if (tabAdmissions?.admissions_open !== undefined) {
      nextState.admissionsOpen = Boolean(tabAdmissions.admissions_open);
    } else if (tabAdmissions?.admissionsOpen !== undefined) {
      nextState.admissionsOpen = Boolean(tabAdmissions.admissionsOpen);
    }


    const admList =
      tabAdmissions?.admissions_guidelines ||
      tabAdmissions?.admissions_cards ||
      parsed.section_11_admissions_guidelines?.admissions_cards ||
      parsed.sections?.section_11_admissions_guidelines?.admissions_cards ||
      parsed.section_11_admissions_guidelines?.admissions ||
      parsed.section_11_admissions?.admissions_cards ||
      parsed.section_11_admissions ||
      tabAdmissions?.admissions ||
      parsed.admissions;
    if (Array.isArray(admList) && admList.length > 0) {
      nextState.admissions = admList.map((a: any, idx: number) => ({
        id: a.id || `adm-${idx}`,
        title: limitLength(a.title || `Admission Track #${idx + 1}`, 40),
        criteria: limitLength(a.criteria || '', 120),
        badge: a.badge ? limitLength(a.badge, 25) : undefined,
        icon: String(a.icon || 'GraduationCap').trim(),
        points: Array.isArray(a.points) ? a.points.slice(0, 3).map((p: any) => limitLength(p, 35)) : [],
      }));
    }

    const faqList =
      tabAdmissions?.faq_items ||
      tabAdmissions?.faqs ||
      parsed.section_12_faqs?.faq_items ||
      parsed.sections?.section_12_faqs?.faq_items ||
      parsed.section_12_faqs ||
      parsed.faqs ||
      parsed.faq_items;
    if (Array.isArray(faqList) && faqList.length > 0) {
      nextState.faqs = faqList.map((f: any, idx: number) => ({
        id: f.id || `faq-${idx + 1}`,
        q: limitLength(f.q || f.question || `Frequently Asked Question #${idx + 1}`, 120),
        a: limitLength(f.a || f.answer || '', 350),
        category: limitLength(f.category || 'Admissions', 25),
      }));
    }

    // ==========================================
    // SECTION 13 / TAB 6: CONTACT US
    // ==========================================
    if (tabContact && typeof tabContact === 'object') {
      if (tabContact.address !== undefined) nextState.address = limitLength(tabContact.address, 120);
      else if (parsed.address !== undefined) nextState.address = limitLength(parsed.address, 120);

      if (tabContact.village_or_locality !== undefined) nextState.village = limitLength(tabContact.village_or_locality, 40);
      else if (tabContact.village !== undefined) nextState.village = limitLength(tabContact.village, 40);
      else if (parsed.village !== undefined) nextState.village = limitLength(parsed.village, 40);

      if (tabContact.block_name !== undefined) nextState.blockName = limitLength(tabContact.block_name, 40);
      else if (tabContact.blockName !== undefined) nextState.blockName = limitLength(tabContact.blockName, 40);
      else if (parsed.blockName !== undefined) nextState.blockName = limitLength(parsed.blockName, 40);

      if (tabContact.district !== undefined) nextState.district = limitLength(tabContact.district, 40);
      else if (parsed.district !== undefined) nextState.district = limitLength(parsed.district, 40);

      if (tabContact.state !== undefined) nextState.state = limitLength(tabContact.state, 40);
      else if (parsed.state !== undefined) nextState.state = limitLength(parsed.state, 40);

      if (tabContact.pincode !== undefined) nextState.pincode = limitLength(tabContact.pincode, 10);
      else if (parsed.pincode !== undefined) nextState.pincode = limitLength(parsed.pincode, 10);

      if (tabContact.rural_urban !== undefined) nextState.ruralUrban = limitLength(tabContact.rural_urban, 15);
      else if (parsed.ruralUrban !== undefined) nextState.ruralUrban = limitLength(parsed.ruralUrban, 15);

      if (tabContact.phone !== undefined) nextState.phone = limitLength(tabContact.phone, 30);
      else if (parsed.phone !== undefined) nextState.phone = limitLength(parsed.phone, 30);

      if (tabContact.email !== undefined) nextState.email = limitLength(tabContact.email, 50);
      else if (parsed.email !== undefined) nextState.email = limitLength(parsed.email, 50);

      if (tabContact.website !== undefined) nextState.website = limitLength(tabContact.website, 70);
      else if (parsed.website !== undefined) nextState.website = limitLength(parsed.website, 70);

      // 4 Dedicated Inquiry Channels
      const gPhone = tabContact.general_inquiry_phone ?? tabContact.generalPhone ?? parsed.generalPhone;
      if (gPhone !== undefined) nextState.generalPhone = limitLength(gPhone, 30);
      const gEmail = tabContact.general_inquiry_email ?? tabContact.generalEmail ?? parsed.generalEmail;
      if (gEmail !== undefined) nextState.generalEmail = limitLength(gEmail, 50);

      const aPhone = tabContact.admissions_inquiry_phone ?? tabContact.admissionsPhone ?? parsed.admissionsPhone;
      if (aPhone !== undefined) nextState.admissionsPhone = limitLength(aPhone, 30);
      const aEmail = tabContact.admissions_inquiry_email ?? tabContact.admissionsEmail ?? parsed.admissionsEmail;
      if (aEmail !== undefined) nextState.admissionsEmail = limitLength(aEmail, 50);

      const pPhone = tabContact.principal_office_phone ?? tabContact.principalPhone ?? parsed.principalPhone;
      if (pPhone !== undefined) nextState.principalPhone = limitLength(pPhone, 30);
      const pEmail = tabContact.principal_office_email ?? tabContact.principalEmail ?? parsed.principalEmail;
      if (pEmail !== undefined) nextState.principalEmail = limitLength(pEmail, 50);

      const cPhone = tabContact.careers_inquiry_phone ?? tabContact.careersPhone ?? parsed.careersPhone;
      if (cPhone !== undefined) nextState.careersPhone = limitLength(cPhone, 30);
      const cEmail = tabContact.careers_inquiry_email ?? tabContact.careersEmail ?? parsed.careersEmail;
      if (cEmail !== undefined) nextState.careersEmail = limitLength(cEmail, 50);

      // Social Links (Facebook, Instagram, LinkedIn, YouTube)
      const soc = tabContact.social_links ?? tabContact.socialLinks ?? parsed.social_links ?? parsed.socialLinks;
      if (soc && typeof soc === 'object') {
        nextState.socialLinks = {
          facebook: soc.facebook ? limitLength(soc.facebook, 150) : undefined,
          instagram: soc.instagram ? limitLength(soc.instagram, 150) : undefined,
          linkedin: soc.linkedin ? limitLength(soc.linkedin, 150) : undefined,
          youtube: soc.youtube ? limitLength(soc.youtube, 150) : undefined,
          twitter: soc.twitter ? limitLength(soc.twitter, 150) : undefined,
        };
      }
    }

    const summary: ImportSummary = {
      schoolName: nextState.schoolName || 'Unnamed School',
      board: nextState.board || 'Not Specified',
      district: nextState.district || 'Not Specified',
      state: nextState.state || 'Not Specified',
      slidesCount: nextState.flipbookSlides?.length || 0,
      facilitiesCount: nextState.facilities?.length || 0,
      galleryCount: nextState.galleryItems?.length || 0,
      feeRowsCount: nextState.feeTableData?.rows?.length || 0,
    };

    return { success: true, state: nextState, summary };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to parse JSON file' };
  }
}

/**
 * Converts current state to clean structured export JSON matching the exact School Profile tabs.
 */
export function convertStateToStructuredJson(data: SchoolTemplateState): any {
  return {
    $schema_version: '2.5',
    export_metadata: {
      generated_at: new Date().toISOString(),
      school_name: data.schoolName,
      udise_code: data.udiseCode,
      platform: 'CSEEL Interactive School Directory',
    },
    tab_1_home: {
      tab_id: 'home',
      tab_title: 'Home',
      hero_prestige_metrics: {
        metric_1_board_results: {
          value: data.contentOverrides?.['hero_stat_val_1'] || data.board || 'Recognized',
          label: data.contentOverrides?.['hero_stat_lbl_1'] || (data.affiliationNumber ? `Affiliation: ${data.affiliationNumber}` : (data.board ? `${data.board} Curriculum` : 'Affiliated Board')),
        },
        metric_2_student_teacher_ratio: {
          value: data.contentOverrides?.['hero_stat_val_2'] || (data.totalStudents && data.totalTeachers && Number(data.totalStudents) > 0 && Number(data.totalTeachers) > 0 ? `1:${Math.round(Number(data.totalStudents) / Math.max(Number(data.totalTeachers), 1))}` : '—'),
          label: data.contentOverrides?.['hero_stat_lbl_2'] || 'Student-Teacher Ratio',
        },
        metric_3_labs_studios: {
          value: data.contentOverrides?.['hero_stat_val_3'] || (data.classroomsCount ? `${data.classroomsCount}` : '—'),
          label: data.contentOverrides?.['hero_stat_lbl_3'] || 'Classrooms & Labs',
        },
        metric_4_awards: {
          value: data.contentOverrides?.['hero_stat_val_4'] || (data.schoolCategory || (data.classFrom && data.classTo ? `${data.classFrom} to ${data.classTo}` : '—')),
          label: data.contentOverrides?.['hero_stat_lbl_4'] || 'Class Range',
        },
        metric_5_parent_trust: {
          value: data.contentOverrides?.['hero_stat_val_5'] || (data.udiseCode ? 'Verified' : 'Registered'),
          label: data.contentOverrides?.['hero_stat_lbl_5'] || (data.udiseCode ? `UDISE: ${data.udiseCode}` : 'UDISE Reg. School'),
        },
      },
      school_basic_info: {
        school_name: data.schoolName,
        udise_code: data.udiseCode,
        board: data.board,
        medium: data.medium,
        established_year: data.establishedYear,
        campus_area: data.campusArea,
        school_type: data.schoolType,
        management: data.management,
        school_category: data.schoolCategory,
        gender_type: data.genderType,
        affiliation_number: data.affiliationNumber,
        logo_url: data.logoImage || '',
      },
      branding: {
        logo_url: data.logoImage || '',
        logo_image_url: data.logoImage || '',
        hero_banner_image: data.heroImage || '',
      },
      statistics: {
        total_students: data.totalStudents,
        total_boys: data.totalBoys,
        total_girls: data.totalGirls,
        total_teachers: data.totalTeachers,
        classrooms_count: data.classroomsCount,
        working_smart_boards: data.workingSmartBoards,
        is_residential: data.isResidential,
        has_hostel: data.hasHostel,
      },
      about_and_principles: {
        about_text: data.aboutText,
        vision_text: data.visionText,
        mission_text: data.missionText,
      },
      principal_desk: {
        principal_name: data.principalName,
        principal_designation: 'Principal / Head of Institution',
      },
      photobook_3d_slides: (data.flipbookSlides || []).map((s) => ({
        slide_id: s.id,
        title: s.title,
        desc: s.desc,
        media_type: s.mediaType || 'image',
        image_url: s.image,
        video_url: s.videoUrl || '',
        button_text: s.buttonText || '',
        action_tab: s.actionTab || '',
      })),
    },
    tab_2_academics: {
      tab_id: 'academics',
      tab_title: 'Academics',
      class_range: {
        class_from: data.classFrom,
        class_to: data.classTo,
      },
      curriculum_features: data.includedAcademicFeatures,
      board_results: data.boardResults || {
        class10Results: [],
        class12Results: [],
      },
    },
    tab_3_facilities: {
      tab_id: 'facilities',
      tab_title: 'Facilities',
      selected_facility_names: (data.facilities || []).map((f) => f.title),
    },
    tab_4_gallery: {
      tab_id: 'gallery',
      tab_title: 'Campus Gallery',
      gallery_items: data.galleryItems,
    },
    tab_5_admissions_fees: {
      tab_id: 'admissions',
      tab_title: 'Admissions & Fees',
      admissions_open: data.admissionsOpen ?? false,
      fee_structure_table: data.feeTableData,
      admissions_guidelines: data.admissions,
      faq_items: (data.faqs || []).map((f) => ({
        id: f.id,
        question: f.q,
        answer: f.a,
        category: f.category || 'Admissions',
      })),
    },
    tab_6_contact: {
      tab_id: 'contact',
      tab_title: 'Contact Us',
      address: data.address,
      village_or_locality: data.village,
      block_name: data.blockName,
      district: data.district,
      state: data.state,
      pincode: data.pincode,
      rural_urban: data.ruralUrban,
      phone: data.phone,
      email: data.email,
      website: data.website,
      social_links: data.socialLinks || {},
    },
  };
}
