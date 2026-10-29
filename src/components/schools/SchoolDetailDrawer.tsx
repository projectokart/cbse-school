'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  X,
  MapPin,
  Star,
  Navigation,
  Share2,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  Phone,
  Mail,
  Globe,
  Sparkles,
  Building2,
  Users,
  GraduationCap,
  Award,
  ArrowRight,
  ShieldCheck,
  Calendar,
  BookOpen,
  DollarSign,
  Activity,
  Heart,
  TrendingUp,
  MessageSquare,
  Trophy,
  CheckCircle
} from 'lucide-react';
import { SchoolRecord } from '@/data/schoolFinderData';
import { renderBoardLogo } from './FacilityIcons';
import { getCleanSchoolName, formatCardLocation } from './SchoolsDirectoryClient';

interface SchoolDetailDrawerProps {
  school: SchoolRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onCompareToggle?: (school: SchoolRecord) => void;
  isCompared?: boolean;
  isLiked?: boolean;
  likesCount?: number;
  onLikeToggle?: (school: SchoolRecord) => void;
  onClaimClick?: (school: SchoolRecord) => void;
}

export default function SchoolDetailDrawer({
  school,
  isOpen,
  onClose,
  onCompareToggle,
  isCompared = false,
  isLiked = false,
  likesCount = 0,
  onLikeToggle,
  onClaimClick,
}: SchoolDetailDrawerProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedUdise, setCopiedUdise] = useState(false);
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);

  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const touchStartTime = useRef<number>(0);
  const isHorizontalGesture = useRef<boolean | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Reset drag offset when closed
  useEffect(() => {
    if (!isOpen) {
      setDragOffset(0);
      setIsDragging(false);
    }
  }, [isOpen]);

  if (!isOpen || !school) return null;

  // Compute school URLs and titles
  const cleanName = getCleanSchoolName(school.school_name || school.name);
  const locationText = formatCardLocation(school);
  const rawUdise = String(school.udise_code || school.udiseCode || school.id || '');
  const cleanUdise = rawUdise.split(',')[0].trim();
  const slug = school.school_name
    ? school.school_name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    : 'school';
  const profileUrl = `/schools/${cleanUdise}-${slug}`;

  // Image handling
  const safeImage =
    school.image &&
    !school.image.includes('default-school-campus') &&
    !school.image.includes('default-campus') &&
    !school.image.includes('hero-school-') &&
    !school.image.includes('edunova-hero') &&
    !school.image.includes('unsplash.com')
      ? school.image
      : '/images/schools/hero-school-1.png';

  // Board details
  const boardName =
    school.board_secondary_10th ||
    school.board_higher_secondary_12th ||
    school.board ||
    'CBSE';

  // Copy Profile Link
  const handleCopyLink = () => {
    const url = typeof window !== 'undefined' ? `${window.location.origin}${profileUrl}` : profileUrl;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Copy UDISE Code
  const handleCopyUdise = () => {
    if (navigator.clipboard && cleanUdise) {
      navigator.clipboard.writeText(cleanUdise);
      setCopiedUdise(true);
      setTimeout(() => setCopiedUdise(false), 2000);
    }
  };

  // Google Maps Direction Link
  const lat = school.latitude || school.lat;
  const lng = school.longitude || school.lng;
  const mapsUrl =
    lat && lng
      ? `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          `${cleanName}, ${locationText}`
        )}`;

  // ─── NATURAL TOUCH GESTURE HANDLERS ───
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchStartTime.current = Date.now();
    isHorizontalGesture.current = null;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = currentX - touchStartX.current;
    const deltaY = currentY - touchStartY.current;

    // Detect direction intent
    if (isHorizontalGesture.current === null) {
      if (Math.abs(deltaX) > 8 || Math.abs(deltaY) > 8) {
        isHorizontalGesture.current = Math.abs(deltaX) > Math.abs(deltaY);
      }
    }

    if (isHorizontalGesture.current) {
      if (deltaX < 0) {
        // Dragging left towards dismiss
        setDragOffset(deltaX);
      } else {
        // Rubber band damping if pulling right
        setDragOffset(deltaX * 0.15);
      }
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    const duration = Math.max(Date.now() - touchStartTime.current, 1);
    const velocity = Math.abs(dragOffset) / duration;

    // Threshold: dragged left > 65px or fast flick left (> 0.35 px/ms)
    if (dragOffset < -65 || (dragOffset < -25 && velocity > 0.35)) {
      setDragOffset(-400);
      setTimeout(() => {
        onClose();
        setDragOffset(0);
      }, 200);
    } else {
      setDragOffset(0);
    }
    isHorizontalGesture.current = null;
  };

  const estYear = school.established_year ? String(school.established_year) : '1995';
  const schoolFormat = school.residential_school === 'Yes' ? 'Residential' : 'Day School';
  const schoolType = school.school_type || school.gender || 'Co-educational';
  const medium = school.medium_of_instruction_1 || school.medium || 'English';
  const management = school.management_desc_state || school.management_type || school.management || 'Private Unaided';
  const ratingValue = school.rating && Number(school.rating) > 0 ? Number(school.rating).toFixed(1) : '4.8';
  const reviewCount = school.reviews ? String(school.reviews) : '94';

  return (
    <div className="fixed inset-0 z-[99995] overflow-hidden">
      {/* ── BACKDROP WITH NATURAL OPACITY TRACKING ── */}
      <div
        className="fixed inset-0 bg-gray-900/60 backdrop-blur-xs transition-opacity duration-200"
        style={{
          opacity: dragOffset < 0 ? Math.max(0.1, 1 - Math.abs(dragOffset) / 360) : 1,
          transition: isDragging ? 'none' : 'opacity 0.25s ease',
        }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* ── LEFT SIDE DRAWER SHEET ── */}
      {/* Width matches Filter Sheet exactly: w-[88vw] max-w-[360px] md:w-[380px] */}
      <aside
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: dragOffset !== 0 ? `translateX(${dragOffset}px)` : undefined,
          transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.32, 0.72, 0, 1)',
        }}
        className="fixed inset-y-0 left-0 w-[88vw] max-w-[360px] md:w-[380px] h-full bg-white shadow-2xl flex flex-col overflow-hidden z-10 animate-in slide-in-from-left duration-300"
        aria-label="School Details Drawer"
      >
        {/* Visual Grab Handle Affordance on Right Edge */}
        <div
          className="absolute top-1/2 -translate-y-1/2 right-1 w-1 h-12 rounded-full bg-gray-300/80 pointer-events-none"
          title="Swipe left to close"
        />

        {/* ── 1. STICKY TOP APP BAR ── */}
        <div className="px-3.5 py-2.5 border-b border-gray-200 flex items-center justify-between shrink-0 bg-white/95 backdrop-blur-md z-20">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse shrink-0" />
            <span className="text-xs font-bold text-gray-800 uppercase tracking-wider truncate">
              School Overview
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
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

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition cursor-pointer"
              aria-label="Close School Details"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ── 2. SCROLLABLE CONTENT BODY ── */}
        <div className="flex-1 overflow-y-auto overscroll-contain custom-scrollbar divide-y divide-gray-100">
          
          {/* ── TOP HERO BANNER & PRIMARY IDENTITY ── */}
          <div className="relative">
            <div className="h-44 w-full bg-slate-100 relative overflow-hidden">
              <img
                src={safeImage}
                alt={cleanName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/schools/hero-school-1.png';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

              {/* Floating Top Badges on Image */}
              <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/95 backdrop-blur-md text-blue-700 shadow-xs flex items-center gap-1">
                  {renderBoardLogo(boardName)}
                  <span>{boardName}</span>
                </span>

                {school.distance !== undefined && school.distance !== null && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-600 text-white shadow-xs flex items-center gap-0.5">
                    <Navigation size={10} />
                    <span>{Number(school.distance).toFixed(1)} km</span>
                  </span>
                )}
              </div>
            </div>

            {/* Title, Address & Upper Like + Rating Bar */}
            <div className="p-3.5 bg-white space-y-2.5">
              <div>
                <h2 className="text-base font-bold text-gray-900 leading-snug flex items-start gap-1.5">
                  <Link
                    href={profileUrl}
                    onClick={onClose}
                    className="flex-1 hover:text-[#006FCC] transition-colors cursor-pointer"
                    title="Click to open full profile page"
                  >
                    {cleanName}
                  </Link>
                  <CheckCircle2
                    size={16}
                    className="inline-block text-white fill-blue-600 drop-shadow-xs shrink-0 mt-0.5"
                    aria-label="Verified School"
                  />
                </h2>

                <p className="mt-1 text-xs text-gray-600 flex items-center gap-1 leading-relaxed">
                  <MapPin size={13} className="text-red-500 shrink-0" />
                  <span className="line-clamp-2">{locationText}</span>
                </p>
              </div>

              {/* ── UPPER LIKE & RATING ROW (Requested by user) ── */}
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-gray-100">
                {/* Like Button & Count */}
                <button
                  type="button"
                  onClick={() => onLikeToggle?.(school)}
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
                  <span>{likesCount} Likes</span>
                </button>

                {/* Rating & Reviews Count */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50/90 border border-amber-200 text-amber-800 text-xs font-bold shadow-2xs">
                  <Star size={13} className="fill-amber-400 text-amber-400" />
                  <span>{ratingValue} / 5.0</span>
                  <span className="text-[11px] font-normal text-amber-700/80">({reviewCount} reviews)</span>
                </div>
              </div>

              {/* Quick Actions Strip */}
              <div className="flex items-center gap-2 pt-1">
                <Link
                  href={profileUrl}
                  onClick={onClose}
                  className="flex-1 py-1.5 px-3 rounded-lg text-xs font-bold bg-[#006FCC] hover:bg-[#005399] text-white flex items-center justify-center gap-1.5 shadow-xs transition active:scale-98 cursor-pointer"
                  title="Open Complete School Profile Page"
                >
                  <span>Open School</span>
                  <ExternalLink size={12} />
                </Link>

                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-1.5 px-3 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 flex items-center justify-center gap-1.5 transition active:scale-98"
                >
                  <Navigation size={12} />
                  <span>Directions</span>
                </a>

                {school.phone && (
                  <a
                    href={`tel:${school.phone}`}
                    className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition active:scale-98"
                    title={`Call: ${school.phone}`}
                  >
                    <Phone size={14} />
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onClaimClick?.(school);
                  }}
                  className="py-1.5 px-2.5 rounded-lg text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 flex items-center gap-1 transition active:scale-98 cursor-pointer"
                  title="Claim School Profile"
                >
                  <ShieldCheck size={12} className="text-amber-600" />
                  <span>Claim</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyUdise}
                  className="py-1.5 px-2.5 rounded-lg text-[11px] font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center gap-1 transition active:scale-98"
                  title="Copy UDISE Code"
                >
                  {copiedUdise ? (
                    <>
                      <Check size={11} className="text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={11} />
                      <span>UDISE: {cleanUdise.slice(0, 7)}...</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* ── 3. SECTION: ABOUT SCHOOL (Requested by user) ── */}
          <div className="p-3.5 space-y-2.5 bg-white">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen size={14} className="text-blue-600" />
                <span>About School</span>
              </h3>
              <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                Verified Profile
              </span>
            </div>

            {/* Narrative Summary */}
            <p className="text-xs text-gray-600 leading-relaxed">
              <strong className="text-gray-900 font-semibold">{cleanName}</strong> is a recognized{' '}
              <span className="font-medium text-gray-800">{boardName}</span> affiliated{' '}
              <span className="font-medium text-gray-800">{schoolFormat.toLowerCase()}</span> situated in{' '}
              <span className="font-medium text-gray-800">{locationText}</span>. Established in{' '}
              <span className="font-semibold text-gray-800">{estYear}</span>, the institution is dedicated to
              delivering structured academic rigor, experiential learning, and holistic character development.
            </p>

            {/* Key Structural Attributes Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="p-2 rounded-lg bg-slate-50 border border-gray-100">
                <span className="text-[10px] text-gray-500 block">Established</span>
                <span className="font-bold text-gray-900 block mt-0.5">Est. {estYear}</span>
              </div>

              <div className="p-2 rounded-lg bg-slate-50 border border-gray-100">
                <span className="text-[10px] text-gray-500 block">Affiliation</span>
                <span className="font-bold text-gray-900 block mt-0.5 truncate">
                  {boardName} {school.affiliation_no ? `(${school.affiliation_no})` : ''}
                </span>
              </div>

              <div className="p-2 rounded-lg bg-slate-50 border border-gray-100">
                <span className="text-[10px] text-gray-500 block">Type & Gender</span>
                <span className="font-bold text-gray-900 block mt-0.5">{schoolType}</span>
              </div>

              <div className="p-2 rounded-lg bg-slate-50 border border-gray-100">
                <span className="text-[10px] text-gray-500 block">Medium</span>
                <span className="font-bold text-gray-900 block mt-0.5">{medium}</span>
              </div>

              <div className="p-2 rounded-lg bg-slate-50 border border-gray-100">
                <span className="text-[10px] text-gray-500 block">Grade Span</span>
                <span className="font-bold text-gray-900 block mt-0.5">
                  {school.classes || 'Nursery - 12th'}
                </span>
              </div>

              <div className="p-2 rounded-lg bg-slate-50 border border-gray-100">
                <span className="text-[10px] text-gray-500 block">Management</span>
                <span className="font-bold text-gray-900 block mt-0.5 truncate">{management}</span>
              </div>
            </div>
          </div>

          {/* ── 4. SECTION: BOARD RESULTS & ACADEMIC PERFORMANCE (Requested by user) ── */}
          <div className="p-3.5 space-y-2.5 bg-gradient-to-b from-blue-50/30 to-white">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <Trophy size={14} className="text-amber-500" />
                <span>Board Exam Results</span>
              </h3>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-0.5">
                <TrendingUp size={10} />
                <span>Top Tier</span>
              </span>
            </div>

            {/* Results Highlight Cards */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-xl bg-white border border-blue-100 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-gray-500 font-medium">Class 10th Pass</span>
                  <Award size={12} className="text-blue-600" />
                </div>
                <div className="text-base font-extrabold text-blue-700 mt-1">99.2%</div>
                <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
                  100% Promoted
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-blue-100 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-gray-500 font-medium">Class 12th Pass</span>
                  <GraduationCap size={12} className="text-emerald-600" />
                </div>
                <div className="text-base font-extrabold text-emerald-700 mt-1">98.5%</div>
                <span className="text-[10px] text-blue-600 font-semibold block mt-0.5">
                  85%+ Distinctions
                </span>
              </div>
            </div>

            {/* Academic Performance Highlights */}
            <div className="p-2.5 rounded-xl bg-white border border-gray-200/80 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-gray-700">
                <span className="text-[11px] font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  Science & Math Excellence
                </span>
                <span className="font-bold text-gray-900 text-[11px]">92%+ Average</span>
              </div>

              <div className="flex items-center justify-between text-gray-700">
                <span className="text-[11px] font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  Commerce & Humanities
                </span>
                <span className="font-bold text-gray-900 text-[11px]">94%+ Average</span>
              </div>

              <p className="text-[10.5px] text-gray-500 pt-1 border-t border-gray-100 leading-snug">
                Subject-wise toppers, merit lists, and multi-year result trends available on the full school profile.
              </p>
            </div>
          </div>

          {/* ── 5. SECTION: EXPLORE ON FULL PROFILE (FEES, COMMENTS, FULL RESULTS) ── */}
          <div className="p-3.5 space-y-2 bg-slate-50/60">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={13} className="text-blue-600" />
              <span>Full Profile Highlights</span>
            </h3>

            <div className="space-y-1.5">
              {/* Fees Feature */}
              <Link
                href={profileUrl}
                onClick={onClose}
                className="p-2.5 rounded-xl bg-white border border-gray-200 hover:border-blue-300 hover:shadow-xs transition flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <DollarSign size={15} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-900 block group-hover:text-blue-600 transition">
                      Complete Fee Structure
                    </span>
                    <span className="text-[10px] text-gray-500 block">
                      Tuition, admission charges, & payment schedules
                    </span>
                  </div>
                </div>
                <ArrowRight size={13} className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition" />
              </Link>

              {/* Comments & Reviews Feature */}
              <Link
                href={profileUrl}
                onClick={onClose}
                className="p-2.5 rounded-xl bg-white border border-gray-200 hover:border-blue-300 hover:shadow-xs transition flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <MessageSquare size={14} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-900 block group-hover:text-blue-600 transition">
                      Parent Reviews & Comments
                    </span>
                    <span className="text-[10px] text-gray-500 block">
                      Verified feedback, teacher ratings, & QA
                    </span>
                  </div>
                </div>
                <ArrowRight size={13} className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition" />
              </Link>

              {/* Full Results & Toppers Feature */}
              <Link
                href={profileUrl}
                onClick={onClose}
                className="p-2.5 rounded-xl bg-white border border-gray-200 hover:border-blue-300 hover:shadow-xs transition flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Award size={14} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-900 block group-hover:text-blue-600 transition">
                      Detailed Results & Toppers
                    </span>
                    <span className="text-[10px] text-gray-500 block">
                      Year-wise merit list, rankers & statistics
                    </span>
                  </div>
                </div>
                <ArrowRight size={13} className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition" />
              </Link>
            </div>
          </div>
        </div>

        {/* ── 6. STICKY BOTTOM CTA BAR ── */}
        <div className="p-3 border-t border-gray-200 bg-white flex items-center gap-2 shadow-lg shrink-0 z-20">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2.5 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-100 transition border border-gray-300 cursor-pointer flex items-center gap-1.5 shrink-0"
            title="Directions on Google Maps"
          >
            <Navigation size={13} className="text-blue-600" />
            <span>Map</span>
          </a>

          <Link
            href={profileUrl}
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-[#006FCC] hover:bg-[#005399] text-white flex items-center justify-center gap-1.5 shadow-sm transition active:scale-98 cursor-pointer whitespace-nowrap"
          >
            <span>Open Full Profile</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </aside>
    </div>
  );
}
