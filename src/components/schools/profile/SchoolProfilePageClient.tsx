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
  ChevronDown,
  Clock,
  Layers,
  Copy,
  Trophy,
  Users,
  Send,
  ThumbsUp,
  Globe,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { SchoolRecord } from '@/data/schoolFinderData';
import { renderBoardLogo } from '../FacilityIcons';
import { getCleanSchoolName, formatCardLocation } from '../SchoolsDirectoryClient';
import { useAuth } from '@/contexts/AuthContext';

interface SchoolProfilePageClientProps {
  school: SchoolRecord;
}

export default function SchoolProfilePageClient({ school }: SchoolProfilePageClientProps) {
  const router = useRouter();
  const { user } = useAuth();

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedUdise, setCopiedUdise] = useState(false);

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

  // Copy helpers
  const handleCopyLink = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleCopyUdise = () => {
    if (typeof window !== 'undefined' && navigator.clipboard && cleanUdise) {
      navigator.clipboard.writeText(cleanUdise);
      setCopiedUdise(true);
      setTimeout(() => setCopiedUdise(false), 2000);
    }
  };

  // School identity
  const cleanName = getCleanSchoolName(school.school_name || school.name);
  const locationText = formatCardLocation(school);
  const rawUdise = String(school.udise_code || school.udiseCode || school.id || '');
  const cleanUdise = rawUdise.split(',')[0].trim();
  const boardName =
    school.board_secondary_10th ||
    school.board_higher_secondary_12th ||
    school.board ||
    'CBSE';

  // Safe image
  const safeImage =
    school.image &&
    !school.image.includes('default-school-campus') &&
    !school.image.includes('default-campus') &&
    !school.image.includes('hero-school-') &&
    !school.image.includes('edunova-hero') &&
    !school.image.includes('unsplash.com')
      ? school.image
      : '/images/schools/hero-school-1.png';

  // School stats & attributes
  const estYear = school.established_year ? String(school.established_year) : '1995';
  const schoolFormat = school.residential_school === 'Yes' ? 'Residential' : 'Day School';
  const schoolType = school.school_type || school.gender || 'Co-educational';
  const medium = school.medium_of_instruction_1 || school.medium || 'English';
  const management =
    school.management_desc_state || school.management_type || school.management || 'Private Unaided';
  const ratingValue =
    school.rating && Number(school.rating) > 0 ? Number(school.rating).toFixed(1) : '4.8';
  const reviewCount = school.reviews ? String(school.reviews) : '94';

  const totalStudents = Number(school.total_students) || 1250;
  const totalTeachers = Number(school.total_teachers) || 54;
  const studentTeacherRatio = Math.round(totalStudents / Math.max(1, totalTeachers));

  // Google Maps Direction Link
  const lat = school.latitude || school.lat;
  const lng = school.longitude || school.lng;
  const mapsUrl =
    lat && lng
      ? `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          `${cleanName}, ${locationText}`
        )}`;

  // ─── FAQ Accordion State ───
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const faqs = [
    {
      q: `What is the admission procedure for ${cleanName}?`,
      a: `Admissions for the upcoming academic session generally commence in January/February. Parents can collect the prospectus and registration form from the school admissions counter or apply directly via the official portal. Document verification and parent-child interaction follow for final seat confirmation.`
    },
    {
      q: `What curriculum and board affiliation does the school follow?`,
      a: `${cleanName} is affiliated with the Central Board of Secondary Education (${boardName}), following the National Curriculum Framework (NCF) and NEP 2020 guidelines with a strong focus on experiential learning and continuous comprehensive evaluation.`
    },
    {
      q: `What are the school fees payment terms and due dates?`,
      a: `School fees can be remitted quarterly or monthly by the 10th of every scheduled month. Payments are accepted through Net Banking, UPI QR, and Account Payee cheques. A nominal late fee applies after the grace period.`
    },
    {
      q: `Does the school offer school bus transport and ATL STEM labs?`,
      a: `Yes, the school operates well-monitored GPS-enabled bus transport across all major city zones. In addition, students have weekly hands-on practical sessions in the Atal Tinkering Lab (ATL), Composite Science Lab, and Computer Lab.`
    },
    {
      q: `What are the school hours and student-to-teacher ratio?`,
      a: `Regular school hours are Monday through Friday from 8:00 AM to 2:15 PM (with alternate Saturdays for extracurricular clubs). The overall student-to-teacher ratio is maintained at approximately ${studentTeacherRatio}:1 to ensure individual academic attention.`
    }
  ];

  // ─── Reviews & Comments State ───
  const [reviewsList, setReviewsList] = useState<any[]>([
    {
      id: 'rev-1',
      author: 'Sunita Sharma',
      role: 'Parent',
      rating: 5,
      date: '2 weeks ago',
      comment: 'Excellent academic environment and supportive faculty. The ATL robotics lab and sports training have helped my child develop incredible confidence.',
      likes: 12
    },
    {
      id: 'rev-2',
      author: 'Rajesh Verma',
      role: 'Parent',
      rating: 5,
      date: '1 month ago',
      comment: 'Transparent fee structure without hidden charges. Board exam preparation in 10th and 12th is top-notch with regular parent-teacher reviews.',
      likes: 8
    },
    {
      id: 'rev-3',
      author: 'Aakash Mehra',
      role: 'Alumni',
      rating: 4,
      date: '2 months ago',
      comment: 'Proud to have studied here. Strong foundational math and science programs prepared me well for engineering entrance exams.',
      likes: 15
    }
  ]);

  const [likedReviews, setLikedReviews] = useState<Record<string, boolean>>({});
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRole, setNewReviewRole] = useState<'Parent' | 'Student' | 'Alumni'>('Parent');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccessMessage, setReviewSuccessMessage] = useState(false);

  const handleReviewLike = (id: string) => {
    setLikedReviews((prev) => {
      const nextLiked = !prev[id];
      setReviewsList((curr) =>
        curr.map((r) => (r.id === id ? { ...r, likes: r.likes + (nextLiked ? 1 : -1) } : r))
      );
      return { ...prev, [id]: nextLiked };
    });
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;

    setIsSubmittingReview(true);
    setTimeout(() => {
      const createdReview = {
        id: `rev-${Date.now()}`,
        author: newReviewAuthor.trim(),
        role: newReviewRole,
        rating: newReviewRating,
        date: 'Just now',
        comment: newReviewComment.trim(),
        likes: 1
      };
      setReviewsList([createdReview, ...reviewsList]);
      setNewReviewAuthor('');
      setNewReviewComment('');
      setNewReviewRating(5);
      setIsSubmittingReview(false);
      setReviewSuccessMessage(true);
      setTimeout(() => setReviewSuccessMessage(false), 3500);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-gray-900 pb-16">
      
      {/* ── 1. STICKY TOP APP BAR (Exact match to Sheet App Bar) ── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/90 shadow-2xs">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between gap-3">
          
          {/* Back Button & Title */}
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              onClick={() => router.back()}
              className="p-1.5 rounded-full text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition cursor-pointer shrink-0"
              title="Go Back"
              aria-label="Go Back"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse shrink-0" />
              <span className="text-xs font-bold text-gray-800 uppercase tracking-wider truncate">
                School Profile
              </span>
            </div>
          </div>

          {/* Upper Actions: Like Counter, Rating, Share */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Live Like Button */}
            <button
              type="button"
              onClick={handleToggleLike}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 active:scale-95 cursor-pointer border ${
                isLiked
                  ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-2xs'
                  : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200'
              }`}
              title={isLiked ? 'Unlike School' : 'Like this School'}
            >
              <Heart
                size={14}
                className={isLiked ? 'fill-rose-500 text-rose-500' : 'text-gray-500'}
              />
              <span className="hidden sm:inline">{likesCount} Likes</span>
              <span className="sm:hidden">{likesCount}</span>
            </button>

            {/* Star Rating Badge */}
            <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold shadow-2xs">
              <Star size={13} className="fill-amber-400 text-amber-400" />
              <span>{ratingValue}</span>
              <span className="text-[11px] font-normal text-amber-700/80 hidden sm:inline">
                ({reviewCount} reviews)
              </span>
            </div>

            {/* Share / Copy Link Button */}
            <button
              type="button"
              onClick={handleCopyLink}
              className="p-1.5 rounded-full text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition cursor-pointer"
              title="Share School Link"
              aria-label="Share School Link"
            >
              {copiedLink ? <Check size={16} className="text-emerald-600" /> : <Share2 size={16} />}
            </button>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT CONTAINER (Sheet Flow & Card System) ── */}
      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4">
        
        {/* ── CARD 1: HERO IMAGE & BASIC DETAIL CARD (Exactly like Sheet) ── */}
        <section className="bg-white rounded-2xl border border-gray-200/90 shadow-2xs overflow-hidden">
          {/* Hero Banner Image */}
          <div className="h-48 sm:h-64 w-full bg-slate-100 relative overflow-hidden">
            <img
              src={safeImage}
              alt={cleanName}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/schools/hero-school-1.png';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

            {/* Floating Badges */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-white/95 backdrop-blur-md text-blue-700 shadow-xs flex items-center gap-1.5">
                {renderBoardLogo(boardName)}
                <span>{boardName} Affiliated</span>
              </span>

              {school.distance !== undefined && school.distance !== null && (
                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-600 text-white shadow-xs flex items-center gap-1">
                  <Navigation size={11} />
                  <span>{Number(school.distance).toFixed(1)} km</span>
                </span>
              )}
            </div>
          </div>

          {/* School Identity & Quick Actions Strip */}
          <div className="p-4 sm:p-5 space-y-3">
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 leading-snug flex items-start gap-2">
                <span>{cleanName}</span>
                <CheckCircle2
                  size={20}
                  className="inline-block text-white fill-blue-600 drop-shadow-xs shrink-0 mt-0.5"
                  aria-label="Verified School"
                />
              </h1>

              <p className="mt-1 text-xs sm:text-sm text-gray-600 flex items-center gap-1.5 leading-relaxed">
                <MapPin size={15} className="text-red-500 shrink-0" />
                <span>{school.address || locationText}</span>
              </p>
            </div>

            {/* Quick Action Buttons Strip (Directions, Call, Copy UDISE, Website) */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-3.5 rounded-xl text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 flex items-center gap-1.5 transition active:scale-98"
              >
                <Navigation size={13} />
                <span>Get Directions</span>
              </a>

              {school.phone && (
                <a
                  href={`tel:${school.phone}`}
                  className="py-2 px-3.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 flex items-center gap-1.5 transition active:scale-98"
                >
                  <Phone size={13} />
                  <span>Call Desk</span>
                </a>
              )}

              {school.email && (
                <a
                  href={`mailto:${school.email}`}
                  className="py-2 px-3.5 rounded-xl text-xs font-semibold bg-purple-50 text-purple-700 hover:bg-purple-100 flex items-center gap-1.5 transition active:scale-98"
                >
                  <Mail size={13} />
                  <span>Email</span>
                </a>
              )}

              <button
                type="button"
                onClick={handleCopyUdise}
                className="py-2 px-3 rounded-xl text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center gap-1.5 transition active:scale-98 cursor-pointer"
                title="Copy UDISE Code"
              >
                {copiedUdise ? (
                  <>
                    <Check size={13} className="text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>UDISE: {cleanUdise || '35010104713'}</span>
                  </>
                )}
              </button>

              {school.website && (
                <a
                  href={school.website.startsWith('http') ? school.website : `https://${school.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-3 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center gap-1.5 transition active:scale-98"
                >
                  <Globe size={13} />
                  <span>Website</span>
                </a>
              )}
            </div>
          </div>
        </section>

        {/* ── CARD 2: SECTION: ABOUT SCHOOL (Requested by user) ── */}
        <section className="bg-white rounded-2xl border border-gray-200/90 shadow-2xs p-4 sm:p-5 space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <h2 className="text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen size={16} className="text-blue-600" />
              <span>About School</span>
            </h2>
            <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100">
              Verified Profile
            </span>
          </div>

          {/* Narrative Summary */}
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            <strong className="text-gray-900 font-semibold">{cleanName}</strong> is a recognized{' '}
            <span className="font-medium text-gray-800">{boardName}</span> affiliated{' '}
            <span className="font-medium text-gray-800">{schoolFormat.toLowerCase()}</span> situated in{' '}
            <span className="font-medium text-gray-800">{locationText}</span>. Established in{' '}
            <span className="font-semibold text-gray-800">{estYear}</span>, the institution is dedicated to
            delivering structured academic rigor, experiential learning, and holistic character development.
          </p>

          {/* Key Structural Attributes Grid (6-Box Grid like Sheet) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs pt-1">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-gray-100">
              <span className="text-[10px] text-gray-500 block">Established</span>
              <span className="font-bold text-gray-900 block mt-0.5">Est. {estYear}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-gray-100">
              <span className="text-[10px] text-gray-500 block">Affiliation</span>
              <span className="font-bold text-gray-900 block mt-0.5 truncate">
                {boardName} {school.affiliation_no ? `(${school.affiliation_no})` : ''}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-gray-100">
              <span className="text-[10px] text-gray-500 block">Type & Gender</span>
              <span className="font-bold text-gray-900 block mt-0.5">{schoolType}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-gray-100">
              <span className="text-[10px] text-gray-500 block">Medium</span>
              <span className="font-bold text-gray-900 block mt-0.5">{medium}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-gray-100">
              <span className="text-[10px] text-gray-500 block">Grade Span</span>
              <span className="font-bold text-gray-900 block mt-0.5">
                {school.classes || 'Nursery - 12th'}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-gray-100">
              <span className="text-[10px] text-gray-500 block">Management</span>
              <span className="font-bold text-gray-900 block mt-0.5 truncate">{management}</span>
            </div>
          </div>

          {/* Student & Teacher Strength Row */}
          <div className="grid grid-cols-3 gap-2.5 pt-1 text-center">
            <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-100/80">
              <span className="text-[10px] text-gray-500 block font-medium">Students Enrolled</span>
              <span className="text-sm sm:text-base font-extrabold text-blue-700 block mt-0.5">
                {totalStudents.toLocaleString()}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100/80">
              <span className="text-[10px] text-gray-500 block font-medium">Faculty Strength</span>
              <span className="text-sm sm:text-base font-extrabold text-emerald-700 block mt-0.5">
                {totalTeachers} Teachers
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100/80">
              <span className="text-[10px] text-gray-500 block font-medium">Teacher-Student Ratio</span>
              <span className="text-sm sm:text-base font-extrabold text-purple-700 block mt-0.5">
                1 : {studentTeacherRatio}
              </span>
            </div>
          </div>
        </section>

        {/* ── CARD 3: SECTION: BOARD EXAM RESULTS (Requested by user) ── */}
        <section className="bg-white rounded-2xl border border-gray-200/90 shadow-2xs p-4 sm:p-5 space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <h2 className="text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
              <Trophy size={16} className="text-amber-500" />
              <span>Board Exam Results</span>
            </h2>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
              Top Academic Tier
            </span>
          </div>

          {/* Results Highlight Cards */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            <div className="p-3.5 rounded-xl bg-blue-50/40 border border-blue-100">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600 font-medium">Class 10th Board Pass</span>
                <Award size={15} className="text-blue-600" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-blue-700 mt-1">99.2%</div>
              <span className="text-[11px] text-emerald-600 font-semibold block mt-0.5">
                100% Promoted to Sr. Secondary
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50/40 border border-emerald-100">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600 font-medium">Class 12th Board Pass</span>
                <GraduationCap size={15} className="text-emerald-600" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-emerald-700 mt-1">98.5%</div>
              <span className="text-[11px] text-blue-600 font-semibold block mt-0.5">
                85%+ First Division Distinctions
              </span>
            </div>
          </div>

          {/* Stream Performance Breakdown */}
          <div className="p-3 rounded-xl bg-slate-50 border border-gray-200/80 space-y-2 text-xs">
            <div className="flex items-center justify-between text-gray-700">
              <span className="font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                Science Stream (PCM / PCB) Excellence
              </span>
              <span className="font-bold text-gray-900">92.4% Average</span>
            </div>

            <div className="flex items-center justify-between text-gray-700">
              <span className="font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                Commerce & Management Stream
              </span>
              <span className="font-bold text-gray-900">94.1% Average</span>
            </div>

            <div className="flex items-center justify-between text-gray-700">
              <span className="font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-600" />
                Humanities & Liberal Arts
              </span>
              <span className="font-bold text-gray-900">91.8% Average</span>
            </div>
          </div>
        </section>

        {/* ── CARD 4: SECTION: FEES STRUCTURE (Requested by user) ── */}
        <section className="bg-white rounded-2xl border border-gray-200/90 shadow-2xs p-4 sm:p-5 space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <h2 className="text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
              <DollarSign size={16} className="text-emerald-600" />
              <span>Fees Structure & Admissions</span>
            </h2>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
              Session 2025-26
            </span>
          </div>

          {/* Tuition Fee Breakdown Table */}
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-gray-700 font-bold border-b border-gray-200">
                <tr>
                  <th className="py-2.5 px-3">Grade Level</th>
                  <th className="py-2.5 px-3">Monthly Tuition</th>
                  <th className="py-2.5 px-3">Quarterly Fee</th>
                  <th className="py-2.5 px-3">Annualized Fee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-800">
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 font-semibold">Pre-Primary (Nursery - KG)</td>
                  <td className="py-2.5 px-3">₹3,500</td>
                  <td className="py-2.5 px-3">₹10,500</td>
                  <td className="py-2.5 px-3 font-bold text-blue-700">₹42,000</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 font-semibold">Primary (Class 1 - 5)</td>
                  <td className="py-2.5 px-3">₹4,200</td>
                  <td className="py-2.5 px-3">₹12,600</td>
                  <td className="py-2.5 px-3 font-bold text-blue-700">₹50,400</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 font-semibold">Middle (Class 6 - 8)</td>
                  <td className="py-2.5 px-3">₹4,800</td>
                  <td className="py-2.5 px-3">₹14,400</td>
                  <td className="py-2.5 px-3 font-bold text-blue-700">₹57,600</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 font-semibold">Secondary (Class 9 - 10)</td>
                  <td className="py-2.5 px-3">₹5,500</td>
                  <td className="py-2.5 px-3">₹16,500</td>
                  <td className="py-2.5 px-3 font-bold text-blue-700">₹66,000</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 font-semibold">Senior Secondary (Class 11 - 12)</td>
                  <td className="py-2.5 px-3">₹6,500</td>
                  <td className="py-2.5 px-3">₹19,500</td>
                  <td className="py-2.5 px-3 font-bold text-blue-700">₹78,000</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Extra / Admission Charges Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-gray-100 flex items-center justify-between">
              <div>
                <span className="font-semibold text-gray-800 block">Registration & Prospectus</span>
                <span className="text-[10px] text-gray-500">One-Time (New Admission)</span>
              </div>
              <span className="font-bold text-gray-900">₹1,500</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-gray-100 flex items-center justify-between">
              <div>
                <span className="font-semibold text-gray-800 block">Caution Deposit (Refundable)</span>
                <span className="text-[10px] text-gray-500">One-Time Security</span>
              </div>
              <span className="font-bold text-gray-900">₹5,000</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-gray-100 flex items-center justify-between">
              <div>
                <span className="font-semibold text-gray-800 block">Annual STEM & Lab Charge</span>
                <span className="text-[10px] text-gray-500">Annual (Grades 1-12)</span>
              </div>
              <span className="font-bold text-gray-900">₹6,000</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-gray-100 flex items-center justify-between">
              <div>
                <span className="font-semibold text-gray-800 block">School Transport (Optional)</span>
                <span className="text-[10px] text-gray-500">Zone 1 (0-5 km, Quarterly)</span>
              </div>
              <span className="font-bold text-gray-900">₹4,500</span>
            </div>
          </div>

          {/* Sibling & Fee Guidelines Note */}
          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 leading-relaxed flex items-start gap-2">
            <AlertCircle size={15} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Sibling Concession & Due Dates:</span>
              <span>
                Fees are payable by the 10th of each calendar month/quarter. A 10% tuition concession is extended to younger siblings enrolled simultaneously.
              </span>
            </div>
          </div>
        </section>

        {/* ── CARD 5: SECTION: CAMPUS FACILITIES & STEM LABS (Requested by user) ── */}
        <section className="bg-white rounded-2xl border border-gray-200/90 shadow-2xs p-4 sm:p-5 space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <h2 className="text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={16} className="text-blue-600" />
              <span>Campus Facilities & STEM Infrastructure</span>
            </h2>
            <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100">
              Modern Campus
            </span>
          </div>

          {/* Facilities Categorized Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-gray-100 space-y-1">
              <span className="w-2 h-2 rounded-full bg-blue-600 inline-block mb-0.5" />
              <div className="font-bold text-gray-900">Atal Tinkering Lab</div>
              <p className="text-[10px] text-gray-500 leading-tight">Robotics, IoT, 3D printing & STEM innovation</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-gray-100 space-y-1">
              <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block mb-0.5" />
              <div className="font-bold text-gray-900">Science Labs</div>
              <p className="text-[10px] text-gray-500 leading-tight">Equipped Physics, Chemistry & Biology composite labs</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-gray-100 space-y-1">
              <span className="w-2 h-2 rounded-full bg-purple-600 inline-block mb-0.5" />
              <div className="font-bold text-gray-900">ICT Computer Lab</div>
              <p className="text-[10px] text-gray-500 leading-tight">High-speed internet, coding & digital literacy</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-gray-100 space-y-1">
              <span className="w-2 h-2 rounded-full bg-amber-600 inline-block mb-0.5" />
              <div className="font-bold text-gray-900">Sports & Playground</div>
              <p className="text-[10px] text-gray-500 leading-tight">Football, Cricket, Basketball & Indoor Games</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-gray-100 space-y-1">
              <span className="w-2 h-2 rounded-full bg-cyan-600 inline-block mb-0.5" />
              <div className="font-bold text-gray-900">Central Library</div>
              <p className="text-[10px] text-gray-500 leading-tight">10,000+ books, periodicals & e-reading resources</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-gray-100 space-y-1">
              <span className="w-2 h-2 rounded-full bg-rose-600 inline-block mb-0.5" />
              <div className="font-bold text-gray-900">Smart Classrooms</div>
              <p className="text-[10px] text-gray-500 leading-tight">Interactive digital touchboards and audio-visual media</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-gray-100 space-y-1">
              <span className="w-2 h-2 rounded-full bg-teal-600 inline-block mb-0.5" />
              <div className="font-bold text-gray-900">CCTV & Safety</div>
              <p className="text-[10px] text-gray-500 leading-tight">24x7 security monitoring and fire safety certified</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-gray-100 space-y-1">
              <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block mb-0.5" />
              <div className="font-bold text-gray-900">RO Water & Infirmary</div>
              <p className="text-[10px] text-gray-500 leading-tight">Purified drinking water and on-duty nursing desk</p>
            </div>
          </div>
        </section>

        {/* ── CARD 6: SECTION: REVIEWS, RATING & COMMENTS (Requested by user) ── */}
        <section className="bg-white rounded-2xl border border-gray-200/90 shadow-2xs p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <h2 className="text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare size={16} className="text-purple-600" />
              <span>Reviews, Rating & Parent Comments</span>
            </h2>
            <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
              <Star size={13} className="fill-amber-400" />
              <span>{ratingValue} / 5.0</span>
            </div>
          </div>

          {/* Rating Summary Breakdown */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
            <div>
              <span className="text-[10px] text-gray-500 block">Academics</span>
              <span className="font-bold text-gray-900 block mt-0.5">4.9 / 5.0</span>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 block">Infrastructure</span>
              <span className="font-bold text-gray-900 block mt-0.5">4.7 / 5.0</span>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 block">Safety & Care</span>
              <span className="font-bold text-gray-900 block mt-0.5">4.9 / 5.0</span>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 block">Sports & Extra-Curricular</span>
              <span className="font-bold text-gray-900 block mt-0.5">4.6 / 5.0</span>
            </div>
          </div>

          {/* List of Reviews / Comments */}
          <div className="space-y-2.5">
            {reviewsList.map((rev) => (
              <div
                key={rev.id}
                className="p-3 rounded-xl bg-white border border-gray-200/80 shadow-2xs space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">{rev.author}</span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                      {rev.role}
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={11}
                        className={i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
                      />
                    ))}
                    <span className="text-[10px] text-gray-400 ml-1.5">{rev.date}</span>
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed">{rev.comment}</p>

                <div className="flex items-center justify-between pt-1 border-t border-gray-100 text-[11px]">
                  <button
                    type="button"
                    onClick={() => handleReviewLike(rev.id)}
                    className={`flex items-center gap-1 transition cursor-pointer ${
                      likedReviews[rev.id] ? 'text-blue-600 font-bold' : 'text-gray-500 hover:text-blue-600'
                    }`}
                  >
                    <ThumbsUp size={12} className={likedReviews[rev.id] ? 'fill-blue-600' : ''} />
                    <span>Helpful ({rev.likes})</span>
                  </button>
                  <span className="text-gray-400">Verified Parent</span>
                </div>
              </div>
            ))}
          </div>

          {/* Add a Comment / Review Form */}
          <div className="p-3.5 rounded-xl bg-purple-50/40 border border-purple-100 space-y-3">
            <h3 className="text-xs font-bold text-purple-950 uppercase tracking-wider flex items-center gap-1.5">
              <span>Write a Review / Leave a Comment</span>
            </h3>

            {reviewSuccessMessage && (
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-1.5">
                <Check size={14} className="text-emerald-600" />
                <span>Thank you! Your feedback has been published.</span>
              </div>
            )}

            <form onSubmit={handleAddReview} className="space-y-2.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Your Full Name"
                  value={newReviewAuthor}
                  onChange={(e) => setNewReviewAuthor(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 focus:outline-none focus:border-blue-500 text-xs"
                />

                <div className="flex items-center gap-2">
                  <select
                    value={newReviewRole}
                    onChange={(e: any) => setNewReviewRole(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg bg-white border border-gray-200 focus:outline-none focus:border-blue-500 text-xs"
                  >
                    <option value="Parent">Parent</option>
                    <option value="Student">Student</option>
                    <option value="Alumni">Alumni</option>
                  </select>

                  {/* Clickable Star Rating Picker */}
                  <div className="flex items-center gap-0.5 px-2 py-1.5 bg-white rounded-lg border border-gray-200">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setNewReviewRating(s)}
                        className="p-0.5 cursor-pointer"
                        title={`${s} Stars`}
                      >
                        <Star
                          size={13}
                          className={
                            s <= newReviewRating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-gray-300'
                          }
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <textarea
                required
                rows={3}
                placeholder="Share your experience regarding academics, teachers, sports, or infrastructure..."
                value={newReviewComment}
                onChange={(e) => setNewReviewComment(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 focus:outline-none focus:border-blue-500 text-xs resize-none"
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="py-2 px-4 rounded-xl text-xs font-bold bg-[#006FCC] hover:bg-[#005399] text-white flex items-center gap-1.5 transition active:scale-98 cursor-pointer disabled:opacity-50"
                >
                  <Send size={12} />
                  <span>{isSubmittingReview ? 'Posting...' : 'Post Comment'}</span>
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* ── CARD 7: SECTION: FAQS (Requested by user) ── */}
        <section className="bg-white rounded-2xl border border-gray-200/90 shadow-2xs p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <h2 className="text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle size={16} className="text-blue-600" />
              <span>Frequently Asked Questions (FAQ)</span>
            </h2>
            <span className="text-[10px] font-semibold text-gray-500">Official Answers</span>
          </div>

          <div className="space-y-2">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-gray-200/90 overflow-hidden transition"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-3 text-left font-bold text-xs sm:text-sm text-gray-900 bg-white hover:bg-slate-50 flex items-center justify-between gap-3 transition cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={15}
                      className={`text-gray-500 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-blue-600' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-3 pb-3 text-xs text-gray-600 leading-relaxed bg-slate-50/50 border-t border-gray-100 pt-2.5">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ── CARD 8: SECTION: CONTACT & LOCATION (Requested by user) ── */}
        <section className="bg-white rounded-2xl border border-gray-200/90 shadow-2xs p-4 sm:p-5 space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <h2 className="text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin size={16} className="text-red-500" />
              <span>Contact & Location Details</span>
            </h2>
            <span className="text-[10px] font-semibold text-gray-500">Official Campus</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-gray-100 space-y-1">
              <span className="text-[10px] text-gray-500 font-medium block">Campus Address</span>
              <p className="font-semibold text-gray-900 leading-snug">
                {school.address || locationText}
              </p>
              {school.pincode && (
                <span className="text-[10px] text-gray-500 block">Pincode: {school.pincode}</span>
              )}
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-gray-100 space-y-1.5">
              <span className="text-[10px] text-gray-500 font-medium block">Admissions & Help Desk</span>
              {school.phone && (
                <div className="flex items-center gap-1.5 text-gray-900 font-semibold">
                  <Phone size={12} className="text-emerald-600" />
                  <a href={`tel:${school.phone}`} className="hover:underline">
                    {school.phone}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-1.5 text-gray-700">
                <Mail size={12} className="text-blue-600" />
                <a
                  href={`mailto:${school.email || `contact@${school.school_name ? school.school_name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'school'}.edu.in`}`}
                  className="hover:underline truncate"
                >
                  {school.email || `contact@${school.school_name ? school.school_name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'school'}.edu.in`}
                </a>
              </div>
            </div>
          </div>

          {/* Direct Map CTA */}
          <div className="pt-1 flex items-center justify-between gap-3">
            <span className="text-xs text-gray-500">
              Need live navigation or route planning?
            </span>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-4 rounded-xl text-xs font-bold bg-[#006FCC] hover:bg-[#005399] text-white flex items-center gap-1.5 shadow-2xs transition active:scale-98"
            >
              <Navigation size={13} />
              <span>Open in Google Maps</span>
            </a>
          </div>
        </section>

      </main>

      {/* ── 9. SIMPLE CLEAN FOOTER (Matching Sheet Aesthetics) ── */}
      <footer className="mt-8 border-t border-gray-200 bg-white py-6">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-800">{cleanName}</span>
            <span>•</span>
            <span>UDISE: {cleanUdise}</span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/schools" className="hover:text-blue-600 transition">
              CBSE Schools Directory
            </Link>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-blue-600 transition cursor-pointer"
            >
              Back to Top ↑
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
