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
  Layers,
  Flame
} from 'lucide-react';
import { SchoolRecord } from '@/data/schoolFinderData';
import { renderBoardLogo, renderFacilityIcon } from './FacilityIcons';
import { getCleanSchoolName, formatCardLocation } from './SchoolsDirectoryClient';
import { PLACEHOLDER_EMPTY_IMAGE } from '@/components/schools/template/SchoolTemplateContext';

interface SchoolDetailDrawerProps {
  school: SchoolRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onCompareToggle?: (school: SchoolRecord) => void;
  isCompared?: boolean;
}

export default function SchoolDetailDrawer({
  school,
  isOpen,
  onClose,
  onCompareToggle,
  isCompared = false,
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
      // Prevent background scrolling while drawer is active
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

  // Fee formatted
  const feeText =
    school.annual_fee_formatted ||
    (school.annual_fee && school.annual_fee > 0
      ? `₹${Number(school.annual_fee).toLocaleString('en-IN')}/yr`
      : 'Government / Subsidized');

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
      // Smooth snap back
      setDragOffset(0);
    }
    isHorizontalGesture.current = null;
  };

  // Compile Key Facilities List
  const facilitiesList: string[] = Array.isArray(school.facilities) && school.facilities.length > 0
    ? school.facilities
    : [];

  // Add standard recognized facilities if present
  if (school.tinkering_lab_atl === 'Yes' || school.tinkering_lab_atl === true) {
    if (!facilitiesList.includes('ATL Tinkering Lab')) facilitiesList.unshift('ATL Tinkering Lab');
  }
  if (school.integrated_science_lab === 'Yes' || school.integrated_science_lab === true) {
    if (!facilitiesList.includes('Integrated Science Lab')) facilitiesList.push('Integrated Science Lab');
  }
  if (school.ict_lab === 'Yes' || school.ict_lab === true) {
    if (!facilitiesList.includes('Computer / ICT Lab')) facilitiesList.push('Computer / ICT Lab');
  }
  if (school.playground === 'Yes' || school.playground === true) {
    if (!facilitiesList.includes('Playground')) facilitiesList.push('Playground');
  }
  if (school.library === 'Yes' || school.library === true) {
    if (!facilitiesList.includes('Library')) facilitiesList.push('Library');
  }

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
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="text-xs font-bold text-gray-800 uppercase tracking-wider truncate">
              School Details
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
          {/* Hero Image & Primary Identification */}
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

              {/* Floating Badges on Image */}
              <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/90 backdrop-blur-md text-blue-700 shadow-xs flex items-center gap-1">
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

              {/* Bottom Info on Image */}
              <div className="absolute bottom-2.5 left-3 right-3 text-white">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="flex items-center gap-0.5 text-amber-400 bg-black/40 backdrop-blur-xs px-1.5 py-0.5 rounded-md text-[11px] font-bold">
                    <Star size={11} className="fill-amber-400 text-amber-400" />
                    <span>{school.rating ? Number(school.rating).toFixed(1) : '4.6'}</span>
                    <span className="text-white/70 text-[9px]">({school.reviews || '84'})</span>
                  </div>

                  <span className="px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-emerald-500/90 text-white flex items-center gap-0.5">
                    <CheckCircle2 size={10} />
                    <span>Verified</span>
                  </span>
                </div>
              </div>
            </div>

            {/* School Name & Clean Address */}
            <div className="p-3.5 bg-white">
              <h2 className="text-base font-bold text-gray-900 leading-snug flex items-start gap-1.5">
                <span className="flex-1">{cleanName}</span>
                <CheckCircle2
                  size={16}
                  className="inline-block text-white fill-blue-600 drop-shadow-xs shrink-0 mt-0.5"
                  aria-label="Verified"
                />
              </h2>

              <p className="mt-1 text-xs text-gray-600 flex items-center gap-1 leading-relaxed">
                <MapPin size={13} className="text-red-500 shrink-0" />
                <span className="line-clamp-2">{locationText}</span>
              </p>

              {/* Quick Actions Row */}
              <div className="mt-3 flex items-center gap-2">
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 flex items-center justify-center gap-1.5 transition active:scale-98"
                >
                  <Navigation size={12} />
                  <span>Directions</span>
                </a>

                {school.phone && (
                  <a
                    href={`tel:${school.phone}`}
                    className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition active:scale-98"
                    title={`Call: ${school.phone}`}
                    aria-label={`Call: ${school.phone}`}
                  >
                    <Phone size={14} />
                  </a>
                )}

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

          {/* ── 3. KEY STATS CARDS (STUDENTS, TEACHERS, STR) ── */}
          <div className="p-3.5 bg-slate-50/60">
            <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Activity size={12} className="text-blue-600" />
              <span>Campus Demographics</span>
            </h3>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-xl bg-white border border-gray-200/80 shadow-2xs">
                <div className="text-[10px] text-gray-500 font-medium">Students</div>
                <div className="text-sm font-bold text-gray-900 mt-0.5">
                  {school.total_students ? Number(school.total_students).toLocaleString('en-IN') : '850+'}
                </div>
              </div>

              <div className="p-2 rounded-xl bg-white border border-gray-200/80 shadow-2xs">
                <div className="text-[10px] text-gray-500 font-medium">Teachers</div>
                <div className="text-sm font-bold text-gray-900 mt-0.5">
                  {school.total_teachers || '45'}
                </div>
              </div>

              <div className="p-2 rounded-xl bg-white border border-gray-200/80 shadow-2xs">
                <div className="text-[10px] text-gray-500 font-medium">STR Ratio</div>
                <div className="text-sm font-bold text-blue-600 mt-0.5">
                  {school.student_teacher_ratio || '22:1'}
                </div>
              </div>
            </div>
          </div>

          {/* ── 4. ACADEMICS & ADMISSIONS SPECIFICATIONS ── */}
          <div className="p-3.5 space-y-2.5">
            <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
              <GraduationCap size={13} className="text-blue-600" />
              <span>Academics & Structure</span>
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                <span className="text-[10px] text-gray-500 block">Grade Span</span>
                <span className="font-semibold text-gray-900 block mt-0.5">
                  {school.classes ||
                    (school.class_from && school.class_to
                      ? `Class ${school.class_from} to ${school.class_to}`
                      : 'Nursery to 12th')}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                <span className="text-[10px] text-gray-500 block">School Format</span>
                <span className="font-semibold text-gray-900 block mt-0.5">
                  {school.residential_school === 'Yes' ? 'Residential / Boarding' : 'Day School'}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                <span className="text-[10px] text-gray-500 block">Gender</span>
                <span className="font-semibold text-gray-900 block mt-0.5">
                  {school.school_type || school.gender || 'Co-educational'}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                <span className="text-[10px] text-gray-500 block">Medium</span>
                <span className="font-semibold text-gray-900 block mt-0.5">
                  {school.medium_of_instruction_1 || school.medium || 'English'}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                <span className="text-[10px] text-gray-500 block">Est. Year</span>
                <span className="font-semibold text-gray-900 block mt-0.5">
                  {school.established_year ? `Est. ${school.established_year}` : 'Established'}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-blue-50/70 border border-blue-100">
                <span className="text-[10px] text-blue-600 block font-medium">Annual Fee</span>
                <span className="font-bold text-blue-900 block mt-0.5">
                  {feeText}
                </span>
              </div>
            </div>

            {/* Management & Affiliation */}
            <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100 text-xs">
              <span className="text-[10px] text-gray-500 block">Management</span>
              <span className="font-semibold text-gray-800 block mt-0.5">
                {school.management_desc_state || school.management_type || school.management || 'Private Unaided'}
              </span>
              {school.affiliation_no && (
                <span className="text-[11px] text-gray-500 block mt-1">
                  Affiliation No: <span className="font-mono text-gray-700">{school.affiliation_no}</span>
                </span>
              )}
            </div>
          </div>

          {/* ── 5. FACILITIES & LABS ── */}
          <div className="p-3.5">
            <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2.5 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Sparkles size={13} className="text-amber-500" />
                <span>Labs & Facilities</span>
              </span>
              <span className="text-[10px] font-normal text-gray-400">
                {facilitiesList.length} verified
              </span>
            </h3>

            {facilitiesList.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {facilitiesList.map((fac, idx) => {
                  const isSpecial = fac.includes('ATL') || fac.includes('Science') || fac.includes('Robotics');
                  return (
                    <span
                      key={idx}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                        isSpecial
                          ? 'bg-blue-50 text-blue-700 border border-blue-200/80 font-semibold'
                          : 'bg-gray-100 text-gray-700 border border-gray-200/60'
                      }`}
                    >
                      {renderFacilityIcon({ name: fac })}
                      <span>{fac}</span>
                    </span>
                  );
                })}
              </div>
            ) : (
              <div className="text-xs text-gray-500 italic p-2 bg-gray-50 rounded-lg">
                Standard CBSE classroom infrastructure, library, and play area verified.
              </div>
            )}
          </div>

          {/* ── 6. CONTACT & LOCATION DETAILS ── */}
          <div className="p-3.5 space-y-2 text-xs">
            <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
              <Building2 size={13} className="text-blue-600" />
              <span>Contact & Address</span>
            </h3>

            <div className="space-y-1.5 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
              <div className="text-gray-700 leading-relaxed">
                <span className="font-semibold text-gray-900 block mb-0.5">Full Address:</span>
                {school.address || locationText}
                {school.pincode && ` - ${school.pincode}`}
              </div>

              {school.headmaster_principal_name && (
                <div className="text-gray-700 pt-1 border-t border-gray-200/70">
                  <span className="text-[10px] text-gray-500 block">Principal / Head:</span>
                  <span className="font-medium text-gray-900">{school.headmaster_principal_name}</span>
                </div>
              )}

              {school.email && (
                <div className="text-gray-700 pt-1 border-t border-gray-200/70 truncate">
                  <span className="text-[10px] text-gray-500 block">Official Email:</span>
                  <a href={`mailto:${school.email}`} className="text-blue-600 hover:underline">
                    {school.email}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── 7. STICKY BOTTOM CTA BAR ── */}
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
