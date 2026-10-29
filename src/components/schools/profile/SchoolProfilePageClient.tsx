'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Share2,
  Heart,
  Check,
  CheckCircle2,
  Navigation,
  Phone,
  Mail,
  MapPin,
  Star,
  Award,
  BookOpen,
  DollarSign,
  GraduationCap,
  Sparkles,
  MessageSquare,
  ShieldCheck,
  Building2,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Clock,
  Layers,
  Copy,
  Trophy
} from 'lucide-react';
import { SchoolRecord } from '@/data/schoolFinderData';
import { renderBoardLogo } from '../FacilityIcons';
import { getCleanSchoolName, formatCardLocation } from '../SchoolsDirectoryClient';
import ClaimSchoolModal from '../ClaimSchoolModal';
import { useAuth } from '@/contexts/AuthContext';

// Import Modular Profile Sections
import SchoolHeroSection from './SchoolHeroSection';
import SchoolAboutSection from './SchoolAboutSection';
import SchoolVisionMissionSection from './SchoolVisionMissionSection';
import SchoolPrincipalMessageSection from './SchoolPrincipalMessageSection';
import SchoolFeeSection from './SchoolFeeSection';
import SchoolBoardResultsSection from './SchoolBoardResultsSection';
import SchoolFacilitiesSection from './SchoolFacilitiesSection';
import SchoolReviewsSection from './SchoolReviewsSection';
import SchoolAddressMapSection from './SchoolAddressMapSection';
import SchoolContactDetailSection from './SchoolContactDetailSection';
import SchoolFaqSection from '@/components/schools/template/SchoolFaqSection';
import SchoolFooterSection from './SchoolFooterSection';
import { FACILITY_CATEGORIES } from '../FacilityData';

interface SchoolProfilePageClientProps {
  school: SchoolRecord;
}

export default function SchoolProfilePageClient({ school }: SchoolProfilePageClientProps) {
  const router = useRouter();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('overview');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);

  // Like State
  const [isLiked, setIsLiked] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      const stored = localStorage.getItem('cseel_liked_school_ids');
      if (stored) {
        const ids: string[] = JSON.parse(stored);
        return ids.includes(school.id);
      }
    } catch {}
    return false;
  });

  const [likesCount, setLikesCount] = useState<number>(() => {
    return (school as any).likes_count || (school as any).likesCount || 142;
  });

  const handleToggleLike = async () => {
    const nextLiked = !isLiked;
    setIsLiked(nextLiked);
    setLikesCount((prev) => Math.max(0, nextLiked ? prev + 1 : prev - 1));

    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('cseel_liked_school_ids');
        const ids: string[] = stored ? JSON.parse(stored) : [];
        const nextIds = nextLiked ? [...ids, school.id] : ids.filter((id) => id !== school.id);
        localStorage.setItem('cseel_liked_school_ids', JSON.stringify(nextIds));
      } catch {}
    }

    try {
      await fetch('/api/school-engagement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'like',
          schoolId: school.udise_code || school.school_id || school.id,
          liked: nextLiked,
        }),
      });
    } catch {}
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // School identity
  const cleanName = getCleanSchoolName(school.school_name || school.name);
  const slug = (school.school_name || school.name || 'school').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const locationText = formatCardLocation(school);
  const rawUdise = String(school.udise_code || school.udiseCode || school.id || '');
  const cleanUdise = rawUdise.split(',')[0].trim();
  const boardName = school.board_secondary_10th || school.board_higher_secondary_12th || school.board || 'CBSE';

  // Navigation scroll to section
  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  // Compile facilities for SchoolFacilitiesSection
  const effectiveFacilities = (school.facilities || []).map((name) => ({ name }));
  if (school.tinkering_lab_atl === 'Yes' || school.tinkering_lab_atl === true) {
    if (!effectiveFacilities.some((f) => f.name.includes('ATL'))) {
      effectiveFacilities.unshift({ name: 'ATL Tinkering Lab' });
    }
  }
  if (school.integrated_science_lab === 'Yes' || school.integrated_science_lab === true) {
    if (!effectiveFacilities.some((f) => f.name.includes('Science'))) {
      effectiveFacilities.push({ name: 'Composite Science Lab' });
    }
  }
  if (school.ict_lab === 'Yes' || school.ict_lab === true) {
    if (!effectiveFacilities.some((f) => f.name.includes('Computer'))) {
      effectiveFacilities.push({ name: 'Computer Lab' });
    }
  }
  if (school.playground === 'Yes' || school.playground === true) {
    if (!effectiveFacilities.some((f) => f.name.includes('Playground') || f.name.includes('Sports'))) {
      effectiveFacilities.push({ name: 'Playground / Outdoor Sports' });
    }
  }
  if (school.library === 'Yes' || school.library === true) {
    if (!effectiveFacilities.some((f) => f.name.includes('Library'))) {
      effectiveFacilities.push({ name: 'Library' });
    }
  }

  // Google Maps Direction Link
  const lat = school.latitude || school.lat || 28.6139;
  const lng = school.longitude || school.lng || 77.2090;
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  const estYear = school.established_year ? String(school.established_year) : '1995';
  const totalStudents = Number(school.total_students) || 1250;
  const totalTeachers = Number(school.total_teachers) || 54;
  const classroomsCount = Number(school.total_building_blocks) ? Number(school.total_building_blocks) * 12 : 36;
  const ratingValue = school.rating && Number(school.rating) > 0 ? Number(school.rating).toFixed(1) : '4.8';
  const reviewCount = school.reviews ? String(school.reviews) : '94';

  return (
    <div className="min-h-screen bg-[#F7F8F8] flex flex-col font-sans">
      {/* ── TOP BREADCRUMB & BACK ACTION BAR ── */}
      <nav aria-label="Breadcrumb" className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between gap-2">
          {/* Back button & Breadcrumb */}
          <div className="flex items-center gap-2 min-w-0">
            <Link
              href="/schools"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 px-2.5 py-1.5 rounded-lg border border-gray-200 transition shrink-0"
            >
              <ArrowLeft size={13} />
              <span>Back to Directory</span>
            </Link>

            <span className="text-gray-300 hidden sm:inline">/</span>

            <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 truncate">
              <Link href="/schools" className="hover:text-gray-900 transition">Schools</Link>
              {school.state_name && (
                <>
                  <ChevronRight size={11} className="text-gray-400" />
                  <span className="truncate">{school.state_name}</span>
                </>
              )}
              {school.district_name && (
                <>
                  <ChevronRight size={11} className="text-gray-400" />
                  <span className="truncate">{school.district_name}</span>
                </>
              )}
              <ChevronRight size={11} className="text-gray-400" />
              <span className="font-semibold text-gray-900 truncate">{cleanName}</span>
            </div>
          </div>

          {/* Action buttons on Top Bar */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Interactive Like Button */}
            <button
              type="button"
              onClick={handleToggleLike}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer border ${
                isLiked
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-rose-50 hover:text-rose-600'
              }`}
            >
              <Heart size={14} className={isLiked ? 'fill-rose-500 text-rose-500' : 'text-gray-400'} />
              <span>{likesCount}</span>
            </button>

            {/* Share Button */}
            <button
              type="button"
              onClick={handleCopyLink}
              className="p-1.5 rounded-full text-gray-600 hover:text-blue-600 hover:bg-blue-50 border border-gray-200 transition cursor-pointer"
              title="Share School Link"
            >
              {copiedLink ? <Check size={14} className="text-emerald-600" /> : <Share2 size={14} />}
            </button>

            {/* Claim Profile Button */}
            <button
              type="button"
              onClick={() => setIsClaimModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-[#EDF5FA] hover:bg-[#DDF0FC] border border-[#DDF0FC] text-[#006FCC] transition cursor-pointer"
            >
              <ShieldCheck size={13} />
              <span>Claim School</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ── 1. MODULAR HERO SECTION ── */}
      <SchoolHeroSection
        displayName={cleanName}
        displayBoard={boardName}
        displayUdise={cleanUdise}
        isAdmissionsOpen={true}
        isLiveTemplate={true}
        isEditMode={false}
        templateData={{}}
        totalStudents={totalStudents}
        totalTeachers={totalTeachers}
        classroomsCount={classroomsCount}
        schoolCategory={school.school_category || 'Secondary with Senior Secondary'}
        classFrom={school.class_from || 'Nursery'}
        classTo={school.class_to || 'Class 12th'}
        imageUrl={school.image || '/images/schools/hero-school-1.png'}
        actualSchoolLogo={undefined}
        residentialSchool={school.residential_school}
        onApplyClick={() => scrollToSection('fees')}
        onTourClick={() => scrollToSection('facilities')}
        onExploreClick={() => scrollToSection('about')}
        onTabSwitch={(tab) => scrollToSection(tab)}
      />

      {/* ── 2. STICKY CATEGORY NAVIGATION TABS ── */}
      <div className="sticky top-12 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto py-2.5 custom-scrollbar">
          {[
            { id: 'about', label: 'About School', icon: BookOpen },
            { id: 'fees', label: 'Fees & Admissions', icon: DollarSign },
            { id: 'results', label: 'Board Results', icon: Trophy },
            { id: 'facilities', label: 'Facilities & Labs', icon: Sparkles },
            { id: 'reviews', label: `Reviews (${reviewCount})`, icon: MessageSquare },
            { id: 'contact', label: 'Location & Contact', icon: MapPin },
            { id: 'faq', label: 'FAQs', icon: HelpCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => scrollToSection(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-[#006FCC] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                }`}
              >
                <Icon size={13} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 3. MAIN CONTENT CONTAINER ── */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* ── SECTION: ABOUT SCHOOL ── */}
        <section id="about" className="scroll-mt-28">
          <SchoolAboutSection
            displayName={cleanName}
            isLiveTemplate={true}
            isEditMode={false}
            templateData={{}}
            imageUrl={school.image || '/images/schools/hero-school-1.png'}
            displayEstablished={estYear}
            displayStudents={totalStudents.toLocaleString()}
            displayTeachers={totalTeachers.toString()}
            displayCampusArea="5.2 Acres Campus"
            onApplyClick={() => scrollToSection('fees')}
          />

          <div className="mt-8">
            <SchoolVisionMissionSection
              isLiveTemplate={true}
              isEditMode={false}
              templateData={{}}
            />
          </div>

          <div className="mt-8">
            <SchoolPrincipalMessageSection
              displayName={cleanName}
              displayPrincipal={school.headmaster_principal_name || 'Dr. Principal / Head of School'}
              displayUdise={cleanUdise}
              isLiveTemplate={true}
              isEditMode={false}
              templateData={{}}
            />
          </div>
        </section>

        {/* ── SECTION: FEES & ADMISSIONS (Requested by user) ── */}
        <section id="fees" className="scroll-mt-28">
          <SchoolFeeSection
            displayName={cleanName}
            displayBoard={boardName}
            displayUdise={cleanUdise}
            displayAddress={locationText}
            state={school.state_name}
            district={school.district_name}
            village={school.village_ward}
            pincode={school.pincode}
            classFrom={school.class_from}
            classTo={school.class_to}
            schoolCategory={school.school_category}
            totalStudents={totalStudents}
            totalTeachers={totalTeachers}
            isEditMode={false}
            templateData={{}}
            onApplyClick={() => alert(`Admissions Open for ${cleanName}! Official prospectus & registration forms available at the school admissions desk.`)}
            onContactClick={() => scrollToSection('contact')}
          />
        </section>

        {/* ── SECTION: BOARD EXAM RESULTS (Requested by user) ── */}
        <section id="results" className="scroll-mt-28">
          <SchoolBoardResultsSection
            classTo={school.class_to || 'Class 12th'}
            boardName={boardName}
            schoolName={cleanName}
            isEditMode={false}
          />
        </section>

        {/* ── SECTION: FACILITIES & STEM LABS ── */}
        <section id="facilities" className="scroll-mt-28">
          <SchoolFacilitiesSection
            isEditMode={false}
            effectiveFacilities={effectiveFacilities}
          />
        </section>

        {/* ── SECTION: REVIEWS, RATINGS & COMMENTS (Requested by user) ── */}
        <section id="reviews" className="scroll-mt-28">
          <SchoolReviewsSection
            displayName={cleanName}
            udiseCode={cleanUdise}
          />
        </section>

        {/* ── SECTION: ADDRESS, MAP & CONTACT DESKS ── */}
        <section id="contact" className="scroll-mt-28 space-y-8">
          <SchoolAddressMapSection
            displayName={cleanName}
            displayAddress={school.address || locationText}
            displayWebsiteUrl={school.website}
            lat={lat}
            lng={lng}
          />

          <SchoolContactDetailSection
            displayName={cleanName}
            isLiveTemplate={true}
            isEditMode={false}
            templateData={{}}
            displayGeneralPhone={school.phone || '+91 11 2345 6789'}
            displayGeneralEmail={school.email || `contact@${slug}.edu.in`}
            displayAdmissionsPhone={school.phone || '+91 11 2345 6780'}
            displayAdmissionsEmail={`admissions@${slug}.edu.in`}
            displayPrincipalPhone={school.phone || '+91 11 2345 6781'}
            displayPrincipalEmail={`principal@${slug}.edu.in`}
            displayCareersPhone={school.phone || '+91 11 2345 6782'}
            displayCareersEmail={`careers@${slug}.edu.in`}
          />
        </section>

        {/* ── SECTION: FAQS ── */}
        <section id="faq" className="scroll-mt-28">
          <SchoolFaqSection
            schoolName={cleanName}
            board={boardName}
            udiseCode={cleanUdise}
            address={school.address || locationText}
            state={school.state_name}
            district={school.district_name}
            village={school.village_ward}
            pincode={school.pincode}
            classFrom={school.class_from}
            classTo={school.class_to}
            schoolCategory={school.school_category}
            management={school.management_desc_state || school.management_type}
            medium={school.medium_of_instruction_1 || school.medium}
            genderType={school.school_type || school.gender}
            totalStudents={totalStudents}
            totalTeachers={totalTeachers}
            workingSmartBoards={4}
            computerIctLab={school.ict_lab ? 'Yes' : 'No'}
            atalStemLab={school.tinkering_lab_atl ? 'Yes' : 'No'}
            playgroundAvailable={school.playground ? 'Yes' : 'No'}
          />
        </section>
      </main>

      {/* ── FOOTER ── */}
      <SchoolFooterSection
        displayName={cleanName}
        templateData={{}}
        displayAddress={school.address || locationText}
        displayPhone={school.phone || '+91 11 2345 6789'}
        displayEmail={school.email || `contact@${slug}.edu.in`}
        onTabSwitch={(tab) => scrollToSection(tab)}
      />

      {/* ── CLAIM SCHOOL MODAL ── */}
      <ClaimSchoolModal
        isOpen={isClaimModalOpen}
        onClose={() => setIsClaimModalOpen(false)}
        schoolName={cleanName}
        udiseCode={cleanUdise}
        currentUser={user}
      />
    </div>
  );
}
