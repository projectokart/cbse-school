export interface SchoolIconOption {
  id: string;
  name: string;
  category: 'Labs & Tech' | 'Academics & Arts' | 'Sports & Fitness' | 'Campus Safety & Security' | 'Campus Infrastructure';
  iconName: string;
  color: string;
}

export interface SchoolIllustrationOption {
  id: string;
  title: string;
  category: string;
  previewName: string;
}

export interface CuratedPhotoOption {
  id: string;
  title: string;
  category: 'Campus' | 'Labs' | 'Sports' | 'Classroom' | 'Transport' | 'Events';
  url: string;
}

export const SCHOOL_ICONS_COLLECTION: SchoolIconOption[] = [
  // ─── 1. Labs, STEM & Technology ───
  { id: 'chemistry', name: 'Chemistry Laboratory (Beakers & Reagents)', category: 'Labs & Tech', iconName: 'TestTubes', color: '#0284C7' },
  { id: 'physics', name: 'Physics Laboratory & Quantum Optics', category: 'Labs & Tech', iconName: 'Atom', color: '#7C3AED' },
  { id: 'biology', name: 'Biology & Life Sciences (Microscope & Specimens)', category: 'Labs & Tech', iconName: 'Microscope', color: '#16A34A' },
  { id: 'atl', name: 'Atal Tinkering Lab (ATL Maker Space)', category: 'Labs & Tech', iconName: 'Cpu', color: '#EA580C' },
  { id: 'steam', name: 'STEAM Integrated Innovation Lab', category: 'Labs & Tech', iconName: 'Compass', color: '#0D9488' },
  { id: 'ai-robotics', name: 'AI, Machine Learning & Robotics Lab', category: 'Labs & Tech', iconName: 'Bot', color: '#6366F1' },
  { id: 'design-thinking', name: 'Design Thinking & Prototyping Studio', category: 'Labs & Tech', iconName: 'Layers', color: '#E11D48' },
  { id: 'experiential', name: 'Experiential Practical Learning Lab', category: 'Labs & Tech', iconName: 'Lightbulb', color: '#F59E0B' },
  { id: 'computer', name: 'Computer Coding & Cyber Security Lab', category: 'Labs & Tech', iconName: 'Monitor', color: '#2563EB' },
  { id: 'smart-class', name: 'Interactive 4K Smart Digital Classrooms', category: 'Labs & Tech', iconName: 'Tv', color: '#059669' },
  { id: 'math-lab', name: 'Mathematics Practical & Vedic Math Lab', category: 'Labs & Tech', iconName: 'Binary', color: '#8B5CF6' },
  { id: 'astronomy', name: 'Astronomy & Space Observatory Hub', category: 'Labs & Tech', iconName: 'Sparkles', color: '#4F46E5' },

  // ─── 2. Academics, Arts & Languages ───
  { id: 'library', name: 'Central Library & Digital OPAC Archive', category: 'Academics & Arts', iconName: 'BookOpen', color: '#0D9488' },
  { id: 'art-craft', name: 'Fine Arts, Sculpture & Pottery Studio', category: 'Academics & Arts', iconName: 'Palette', color: '#EC4899' },
  { id: 'music', name: 'Music Academy (Vocal & Instruments)', category: 'Academics & Arts', iconName: 'Music', color: '#F43F5E' },
  { id: 'language', name: 'Language Fluency & Phonetics Lab', category: 'Academics & Arts', iconName: 'MessageSquare', color: '#0284C7' },
  { id: 'auditorium', name: 'Centrally Air-Conditioned Grand Auditorium', category: 'Academics & Arts', iconName: 'Building2', color: '#3B82F6' },
  { id: 'olympiad', name: 'Excellence, Competitive Exams & Olympiads', category: 'Academics & Arts', iconName: 'Award', color: '#CA8A04' },
  { id: 'grad-wing', name: 'Senior Secondary & Career Guidance Cell', category: 'Academics & Arts', iconName: 'GraduationCap', color: '#6366F1' },

  // ─── 3. All Sports, Athletics & Fitness (Big School Sports) ───
  { id: 'horse-riding', name: 'Horse Riding & Equestrian Riding Club', category: 'Sports & Fitness', iconName: 'Footprints', color: '#D97706' },
  { id: 'swimming', name: 'Heated Half-Olympic Swimming Pool & Diving', category: 'Sports & Fitness', iconName: 'Waves', color: '#0284C7' },
  { id: 'golf', name: 'Mini Golf Putting Green & Driving Range', category: 'Sports & Fitness', iconName: 'Target', color: '#059669' },
  { id: 'football', name: 'FIFA Standard Grass Football Turf Ground', category: 'Sports & Fitness', iconName: 'Trophy', color: '#16A34A' },
  { id: 'cricket', name: 'Cricket Academy with Automated Bowling Machine', category: 'Sports & Fitness', iconName: 'Award', color: '#EA580C' },
  { id: 'table-tennis', name: 'Indoor Table Tennis Arena & Drills', category: 'Sports & Fitness', iconName: 'Activity', color: '#2563EB' },
  { id: 'lawn-tennis', name: 'Floodlit Synthetic Lawn Tennis Courts', category: 'Sports & Fitness', iconName: 'Volleyball', color: '#4F46E5' },
  { id: 'badminton', name: 'Indoor Wooden Floor Badminton Courts', category: 'Sports & Fitness', iconName: 'Sparkles', color: '#0D9488' },
  { id: 'basketball', name: 'Championship Floodlit Basketball Arena', category: 'Sports & Fitness', iconName: 'Volleyball', color: '#EA580C' },
  { id: 'volleyball', name: 'Inter-House Volleyball Sand & Court Arena', category: 'Sports & Fitness', iconName: 'Volleyball', color: '#D97706' },
  { id: 'roller-skating', name: 'Speed Roller Skating Ring & Arena', category: 'Sports & Fitness', iconName: 'Bike', color: '#7C3AED' },
  { id: 'archery-shooting', name: 'Precision Rifle Shooting & Archery Range', category: 'Sports & Fitness', iconName: 'Crosshair', color: '#DC2626' },
  { id: 'martial-arts', name: 'Martial Arts, Karate & Taekwondo Dojo', category: 'Sports & Fitness', iconName: 'Swords', color: '#E11D48' },
  { id: 'gymnastics', name: 'Indoor Gymnastics & Floor Exercise Arena', category: 'Sports & Fitness', iconName: 'Activity', color: '#F43F5E' },
  { id: 'yoga-wellness', name: 'Spiritual Yoga Pavilion & Meditation Hall', category: 'Sports & Fitness', iconName: 'Heart', color: '#DB2777' },
  { id: 'chess-mind', name: 'Mind Sports, Chess & Scrabble Studio', category: 'Sports & Fitness', iconName: 'Gamepad2', color: '#6366F1' },
  { id: 'athletics-track', name: '400m All-Weather Synthetic Athletics Track', category: 'Sports & Fitness', iconName: 'Medal', color: '#CA8A04' },
  { id: 'gym-fitness', name: 'Multi-Gym & Student Fitness Center', category: 'Sports & Fitness', iconName: 'Dumbbell', color: '#374151' },

  // ─── 4. Campus Safety & Security ───
  { id: 'cctv-safety', name: 'Campus Safety & 360° CCTV Surveillance', category: 'Campus Safety & Security', iconName: 'Cctv', color: '#10B981' },
  { id: 'fire-safety', name: 'Automated Fire Alarms & Extinguishers', category: 'Campus Safety & Security', iconName: 'FireExtinguisher', color: '#EF4444' },
  { id: 'security-guards', name: '24/7 Security Guards & RFID Entry Turnstiles', category: 'Campus Safety & Security', iconName: 'ShieldCheck', color: '#059669' },
  { id: 'emergency-siren', name: 'Emergency Evacuation & Alarm Siren', category: 'Campus Safety & Security', iconName: 'Siren', color: '#DC2626' },
  { id: 'infirmary-doc', name: 'Full-Time Doctor & Emergency Medical Room', category: 'Campus Safety & Security', iconName: 'Hospital', color: '#E11D48' },
  { id: 'first-aid', name: 'Paramedic First Aid & Nursing Care', category: 'Campus Safety & Security', iconName: 'Stethoscope', color: '#0284C7' },
  { id: 'lifeguard-safety', name: 'Certified Lifeguards & Water Rescue Equipment', category: 'Campus Safety & Security', iconName: 'LifeBuoy', color: '#0EA5E9' },
  { id: 'visitor-pass', name: 'Digital Visitor Pass & Barcoded Gates', category: 'Campus Safety & Security', iconName: 'Lock', color: '#4F46E5' },
  { id: 'child-safety', name: 'POCSO Compliant Child Safety & Protection Cell', category: 'Campus Safety & Security', iconName: 'Shield', color: '#059669' },

  // ─── 5. Campus Infrastructure & Facilities ───
  { id: 'auditorium-hall', name: '1200-Seater Acoustically Treated Auditorium', category: 'Campus Infrastructure', iconName: 'Building2', color: '#3B82F6' },
  { id: 'amphitheater', name: 'Open-Air Amphitheater for Events', category: 'Campus Infrastructure', iconName: 'Landmark', color: '#6366F1' },
  { id: 'admin-block', name: 'Central Academic & Administrative Portico', category: 'Campus Infrastructure', iconName: 'Building', color: '#005689' },
  { id: 'hostel', name: 'Air-Conditioned Boys & Girls Hostel', category: 'Campus Infrastructure', iconName: 'Home', color: '#4338CA' },
  { id: 'canteen', name: 'Hygienic Dining Hall & Food Canteen', category: 'Campus Infrastructure', iconName: 'Utensils', color: '#F97316' },
  { id: 'bus-gps', name: 'GPS Fleet Buses with Real-Time Tracking', category: 'Campus Infrastructure', iconName: 'Bus', color: '#EAB308' },
  { id: 'solar-campus', name: '100KW Rooftop Solar Power Plant', category: 'Campus Infrastructure', iconName: 'Sun', color: '#F59E0B' },
  { id: 'green-campus', name: 'Eco-Friendly Botanical & Herbal Garden', category: 'Campus Infrastructure', iconName: 'Trees', color: '#15803D' },
  { id: 'wifi-campus', name: 'High-Speed Optical Fiber Wi-Fi Campus', category: 'Campus Infrastructure', iconName: 'Wifi', color: '#0284C7' },
  { id: 'ro-water', name: 'Multi-Stage RO Purified Chilled Drinking Water', category: 'Campus Infrastructure', iconName: 'Droplet', color: '#06B6D4' },
];

export const SCHOOL_ILLUSTRATIONS_COLLECTION: SchoolIllustrationOption[] = [
  { id: 'science-lab', title: 'Experiential Science Laboratory', category: 'Labs', previewName: 'ScienceLabIllustration' },
  { id: 'computer-lab', title: 'High-Tech Computer Lab', category: 'Labs', previewName: 'ComputerLabIllustration' },
  { id: 'robotics-lab', title: 'Robotics & STEM Tinkering Station', category: 'Labs', previewName: 'RoboticsLabIllustration' },
  { id: 'library', title: 'Modern Library & Digital Archives', category: 'Academics', previewName: 'LibraryIllustration' },
  { id: 'smart-class', title: 'Smart Classroom & Interactive Panels', category: 'Academics', previewName: 'SmartClassroomIllustration' },
  { id: 'sports', title: 'Outdoor Sports & Athletics Grounds', category: 'Sports', previewName: 'SportsIllustration' },
  { id: 'art-music', title: 'Art, Music & Creative Studio', category: 'Arts', previewName: 'ArtMusicIllustration' },
  { id: 'auditorium', title: 'Centrally Air-Conditioned Auditorium', category: 'Events', previewName: 'AuditoriumIllustration' },
  { id: 'transport', title: 'Safe Fleet Transport & Bus Facility', category: 'Transport', previewName: 'TransportIllustration' },
  { id: 'medical', title: 'Full-Time Doctor & Medical Infirmary', category: 'Health', previewName: 'MedicalRoomIllustration' },
  { id: 'campus', title: 'Green Eco-Friendly School Campus', category: 'Campus', previewName: 'SchoolCampusIllustration' },
  { id: 'principal', title: 'Principal & Leadership Desk', category: 'Admin', previewName: 'PrincipalDeskIllustration' },
];

export const CURATED_SCHOOL_PHOTOS: CuratedPhotoOption[] = [
  {
    id: 'campus-1',
    title: 'Modern Academic Building',
    category: 'Campus',
    url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'campus-2',
    title: 'Heritage School Portico',
    category: 'Campus',
    url: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'campus-3',
    title: 'Lush Green School Quadrangle',
    category: 'Campus',
    url: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'lab-1',
    title: 'Advanced Science Laboratory Bench',
    category: 'Labs',
    url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'lab-2',
    title: 'Robotics & STEM Tinkering Hub',
    category: 'Labs',
    url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'lab-3',
    title: 'Computer Workstations Lab',
    category: 'Labs',
    url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'class-1',
    title: 'Active Interactive Classroom',
    category: 'Classroom',
    url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'sports-1',
    title: 'Sports Field & Athletics Track',
    category: 'Sports',
    url: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'transport-1',
    title: 'School Transport Fleet',
    category: 'Transport',
    url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'events-1',
    title: 'Annual Day Celebrations & Stage',
    category: 'Events',
    url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80'
  }
];
