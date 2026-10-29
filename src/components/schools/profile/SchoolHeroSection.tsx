'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Phone,
  Video,
  Image as ImageIcon,
  Plus,
  Trash2,
  X,
  Check,
  Edit3,
  Sparkles,
  Lock,
  Layers,
  Heart
} from 'lucide-react';
import EditableText from '@/components/schools/template/EditableText';
import EditableIcon from '@/components/schools/template/EditableIcon';
import SectionVisibilityToggle from '@/components/schools/template/SectionVisibilityToggle';
import { useOptionalSchoolTemplate } from '@/components/schools/template/SchoolTemplateContext';
import { useAuth } from '@/contexts/AuthContext';

function getPersistentClientId(): string {
  if (typeof window === 'undefined') return '';
  try {
    let id = localStorage.getItem('cseel_client_uid');
    if (!id) {
      id = 'usr_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
      localStorage.setItem('cseel_client_uid', id);
    }
    return id;
  } catch {
    return 'guest_user';
  }
}

export interface HeroMediaItem {
  id: string;
  type: 'image' | 'video' | 'gif';
  url: string;
  title?: string;
}

export interface SchoolHeroSectionProps {
  displayName: string;
  displayBoard: string;
  displayUdise: string;
  isAdmissionsOpen: boolean;
  isLiveTemplate: boolean;
  isEditMode: boolean;
  templateData: any;
  totalStudents: number;
  totalTeachers: number;
  classroomsCount: number;
  schoolCategory: string;
  classFrom: string;
  classTo: string;
  imageUrl?: string;
  actualSchoolLogo?: string;
  flipbookSlides?: any[]; // Retained for backward-compatibility
  residentialSchool?: string;
  onApplyClick: () => void;
  onTourClick: () => void;
  onExploreClick: () => void;
  onTabSwitch: (tab: any) => void;
}

/**
 * Extracts standard YouTube embed URL for iframe
 */
function getYouTubeEmbed(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.includes('youtube.com/embed/')) return trimmed;
  const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (shortMatch && shortMatch[1]) return `https://www.youtube.com/embed/${shortMatch[1]}?autoplay=1&mute=1&loop=1&playlist=${shortMatch[1]}`;
  const watchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (watchMatch && watchMatch[1]) return `https://www.youtube.com/embed/${watchMatch[1]}?autoplay=1&mute=1&loop=1&playlist=${watchMatch[1]}`;
  const shortsMatch = trimmed.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
  if (shortsMatch && shortsMatch[1]) return `https://www.youtube.com/embed/${shortsMatch[1]}?autoplay=1&mute=1&loop=1&playlist=${shortsMatch[1]}`;
  return trimmed;
}

export default function SchoolHeroSection({
  displayName,
  displayBoard,
  displayUdise,
  isAdmissionsOpen,
  isLiveTemplate,
  isEditMode,
  templateData,
  totalStudents,
  totalTeachers,
  classroomsCount,
  schoolCategory,
  classFrom,
  classTo,
  imageUrl,
  actualSchoolLogo,
  residentialSchool,
  onApplyClick,
  onTourClick,
  onExploreClick,
  onTabSwitch,
}: SchoolHeroSectionProps) {
  const templateCtx = useOptionalSchoolTemplate();

  // Active media list from template or custom school imageUrl (No fake Unsplash demo photos)
  const rawSavedMedia: HeroMediaItem[] = templateData?.heroMediaItems || [];
  const customMediaItems: HeroMediaItem[] = rawSavedMedia.length > 0
    ? rawSavedMedia
    : (imageUrl && imageUrl.trim() !== '')
    ? [{ id: 'media-custom-1', type: 'image', url: imageUrl, title: displayName }]
    : [];

  const hasCustomMedia = customMediaItems.length > 0;
  const mediaItems: HeroMediaItem[] = hasCustomMedia ? customMediaItems.slice(0, 5) : [];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [editingMediaList, setEditingMediaList] = useState<HeroMediaItem[]>(mediaItems);

  // New Media Form state inside modal
  const [newMediaType, setNewMediaType] = useState<'image' | 'video' | 'gif'>('image');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newMediaTitle, setNewMediaTitle] = useState('');

  // Auto slide rotation every 5s if not video
  useEffect(() => {
    if (!isAutoPlay || mediaItems.length <= 1) return;
    const currentItem = mediaItems[activeIndex];
    // Give more time or pause if video
    if (currentItem?.type === 'video') return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % mediaItems.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlay, activeIndex, mediaItems.length, mediaItems]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev + 1) % mediaItems.length);
  };

  const { user } = useAuth();
  const effectiveUserId = user?.id || user?.email || (typeof window !== 'undefined' ? getPersistentClientId() : '');

  // School Like state and persistence
  const [likesCount, setLikesCount] = useState<number>(() => {
    return typeof templateData?.likesCount === 'number' ? templateData.likesCount : 0;
  });
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isLiking, setIsLiking] = useState<boolean>(false);

  useEffect(() => {
    if (!displayUdise) return;
    const uid = effectiveUserId;
    try {
      const localLiked = localStorage.getItem(`liked_school_${displayUdise}`) === 'true';
      if (localLiked) setIsLiked(true);
    } catch {}

    fetch(`/api/school-engagement?udiseCode=${encodeURIComponent(displayUdise)}&userId=${encodeURIComponent(uid)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          if (typeof data.likesCount === 'number') {
            setLikesCount(data.likesCount);
          }
          if (typeof data.userLiked === 'boolean') {
            setIsLiked(data.userLiked);
            try {
              localStorage.setItem(`liked_school_${displayUdise}`, data.userLiked ? 'true' : 'false');
            } catch {}
          }
        }
      })
      .catch(() => {});
  }, [displayUdise, effectiveUserId]);

  const handleToggleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!displayUdise || isLiking) return;
    setIsLiking(true);
    const nextLiked = !isLiked;
    setIsLiked(nextLiked);
    setLikesCount((prev) => Math.max(0, nextLiked ? prev + 1 : prev - 1));

    try {
      localStorage.setItem(`liked_school_${displayUdise}`, nextLiked ? 'true' : 'false');
      const res = await fetch('/api/school-engagement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'like',
          udiseCode: displayUdise,
          userId: effectiveUserId,
          liked: nextLiked,
        }),
      });
      const data = await res.json();
      if (data.success) {
        if (typeof data.likesCount === 'number') {
          setLikesCount(data.likesCount);
        }
        if (typeof data.userLiked === 'boolean') {
          setIsLiked(data.userLiked);
        }
      }
    } catch (err) {
      console.error('Failed to toggle like:', err);
    } finally {
      setIsLiking(false);
    }
  };

  const currentMedia = mediaItems[activeIndex] || mediaItems[0];
  const displayPhone = templateData?.phone || templateData?.generalPhone || 'Admission Helpline';

  // Save updated media list (max 5)
  const handleSaveMediaList = () => {
    if (templateCtx) {
      templateCtx.updateField('heroMediaItems' as any, editingMediaList.slice(0, 5));
    }
    setIsMediaModalOpen(false);
  };

  const handleAddNewMedia = () => {
    if (!newMediaUrl.trim()) return;
    if (editingMediaList.length >= 5) {
      alert('You can add a maximum of 5 media items (images, gifs, or videos) in the hero section.');
      return;
    }
    const newItem: HeroMediaItem = {
      id: `media-${Date.now()}`,
      type: newMediaType,
      url: newMediaUrl.trim(),
      title: newMediaTitle.trim() || `Media ${editingMediaList.length + 1}`
    };
    setEditingMediaList((prev) => [...prev, newItem].slice(0, 5));
    setNewMediaUrl('');
    setNewMediaTitle('');
  };

  const handleDeleteMedia = (id: string) => {
    setEditingMediaList((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <section id="home" className="relative overflow-hidden w-full bg-white border-b border-[#E8E9E9] py-4 sm:py-6 lg:py-8 min-h-auto lg:min-h-[calc(100vh-100px)] flex flex-col justify-center">
      
      {/* Subtle Educational Doodle / Sketch Background Overlay (Full Width) */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23006FCC' stroke-width='1.4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M15 35h20M25 25v20'/%3E%3Crect x='70' y='20' width='30' height='22' rx='4'/%3E%3Cpath d='M75 27h20M75 34h12'/%3E%3Ccircle cx='30' cy='85' r='14'/%3E%3Cpath d='M22 85h16M30 77v16'/%3E%3Cpath d='M75 90l15-20 15 20z'/%3E%3Cpath d='M50 15c4 4 10 4 14 0'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '120px 120px'
        }}
      />

      {/* Organic Curved Backdrop Accent on the Right (Stretches to Right Screen Edge) */}
      <div 
        className="absolute top-0 right-0 w-[85%] sm:w-[65%] lg:w-[50%] h-full pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle at 75% 45%, #E9F3FA 0%, #F0F6FA 45%, #FFFFFF 90%)',
          borderBottomLeftRadius: '320px',
          borderTopLeftRadius: '180px',
          opacity: 0.95
        }}
      />

      {/* Main Container Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex-1 flex flex-col justify-center">

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* TOP PILL BADGE (Replaces duplicate inner navbar)           */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <div className="flex items-center justify-between gap-2.5 pb-3 sm:pb-4 w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/95 border border-[#E8E9E9] shadow-2xs text-[#006FCC] text-xs font-semibold whitespace-nowrap shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#FBBC04] animate-pulse shrink-0" />
            <span className="text-slate-700 font-mono text-[11px] font-bold shrink-0">UDISE: {displayUdise || 'Verified'}</span>
          </div>

          {/* Quick Helpline on Top Right & Edit Mode Section Toggle */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* School Like Button */}
            <button
              type="button"
              onClick={handleToggleLike}
              disabled={isLiking}
              className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all shadow-2xs border cursor-pointer select-none active:scale-95 ${
                isLiked
                  ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-rose-100'
                  : 'bg-white/95 border-slate-200/90 text-slate-700 hover:text-rose-600 hover:bg-rose-50/50 hover:border-rose-200'
              }`}
              title={isLiked ? "Unlike school" : "Like this school"}
            >
              <Heart className={`w-3.5 h-3.5 transition-transform duration-200 shrink-0 ${isLiked ? "fill-rose-500 text-rose-500 scale-110" : "text-slate-400"}`} />
              <span className="shrink-0">{likesCount > 0 ? `${likesCount} ${likesCount === 1 ? 'Like' : 'Likes'}` : 'Like'}</span>
            </button>

            <SectionVisibilityToggle sectionId="hero" sectionTitle="Hero Section" />
            <div className="hidden sm:flex items-center gap-3">
              <a
                href={displayPhone.startsWith('+') || displayPhone.startsWith('0') ? `tel:${displayPhone}` : '#contact'}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#005689] hover:text-[#003c6e] transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-[#EDF5FA] flex items-center justify-center text-[#005689]">
                  <Phone className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span>{displayPhone}</span>
              </a>
            </div>
          </div>
        </div>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* MAIN HERO GRID: Typography Left • Circular Media Right     */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center py-2 sm:py-3">
            
            {/* Left Column: Heading, Subtitle & Pill Buttons */}
            <div className="lg:col-span-7 xl:col-span-6 text-left max-w-xl">
              
              {/* Main Headline (Scaled for balanced readability and eye comfort) */}
              <div className="mb-3.5 sm:mb-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight text-slate-950">
                  <EditableText
                    contentKey="hero_heading_line1"
                    value="Play, Learn and"
                    className="block text-slate-950"
                    showVerificationBadge={false}
                  />
                  <span className="text-[#005689] block mt-0.5">
                    <EditableText
                      contentKey="hero_heading_line2"
                      value="Grow, Together.."
                      className="inline text-[#006FCC] font-['Montserrat',sans-serif]"
                      showVerificationBadge={false}
                    />
                  </span>
                </h1>
              </div>

              {/* Subtitle Description */}
              <div className="mb-8 sm:mb-10 text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed font-normal">
                <EditableText
                  contentKey="hero_desc_main"
                  value={`Empowering young minds at ${displayName} through experiential inquiry, modern STEM laboratories, foundational values, and holistic character building.`}
                  multiline={true}
                  rows={3}
                  className="block text-slate-600"
                  showVerificationBadge={false}
                />
              </div>

              {/* Labster 14px CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                
                {/* Primary Button: Labster Royal Blue */}
                <button
                  type="button"
                  onClick={onApplyClick}
                  className="rounded-[14px] px-6 sm:px-8 py-3 sm:py-3.5 bg-[#006FCC] hover:bg-[#005399] text-white text-xs sm:text-sm font-bold font-['Montserrat',sans-serif] shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer inline-flex items-center gap-2 active:scale-[0.98]"
                >
                  <EditableText contentKey="hero_cta_enroll" value="Enroll Now" showVerificationBadge={false} />
                  
                </button>

                {/* Secondary Button: Labster Light Surface */}
                <button
                  type="button"
                  onClick={onTourClick}
                  className="rounded-[14px] px-6 sm:px-7 py-3 sm:py-3.5 bg-[#F7F8F8] hover:bg-[#EDF5FA] border border-[#E8E9E9] text-[#003C6E] hover:text-[#006FCC] text-xs sm:text-sm font-bold font-['Montserrat',sans-serif] hover:shadow-md transition-all duration-200 cursor-pointer inline-flex items-center gap-2 active:scale-[0.98]"
                >
                  <Play className="w-3.5 h-3.5 fill-[#006FCC] stroke-[#006FCC]" />
                  <EditableText contentKey="hero_cta_video_pill" value="Watch Video" showVerificationBadge={false} />
                </button>
              </div>

            </div>

            {/* Right Column: Iconic Circular Media Frame with Thick Ring Border */}
            <div className="lg:col-span-5 xl:col-span-6 flex items-center justify-center lg:justify-end relative">
              <div 
                className="relative group w-[260px] h-[260px] sm:w-[340px] sm:h-[340px] md:w-[380px] md:h-[380px] lg:w-[390px] lg:h-[390px] xl:w-[430px] xl:h-[430px] rounded-full shrink-0 select-none"
                onMouseEnter={() => setIsAutoPlay(false)}
                onMouseLeave={() => setIsAutoPlay(true)}
              >
                {/* Manage Media Floating Button - Positioned on Top of the Circular Frame in Edit Mode */}
                {isLiveTemplate && isEditMode && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingMediaList(mediaItems);
                      setIsMediaModalOpen(true);
                    }}
                    className="absolute -top-5 left-1/2 -translate-x-1/2 z-30 rounded-full px-4 sm:px-5 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 border-2 border-white shadow-xl font-black text-xs sm:text-sm inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap hover:scale-105 active:scale-95 transition-all"
                  >
                    <Edit3 className="w-4 h-4 text-slate-900" />
                    <span>Manage Media ({mediaItems.length}/5)</span>
                  </button>
                )}
                
                {/* Layer 1: Outer Soft Decorative Ring */}
                <div className="absolute -inset-3 sm:-inset-4 rounded-full border-2 border-dashed border-[#005689]/25 pointer-events-none animate-spin-slow opacity-60" style={{ animationDuration: '60s' }} />

                {/* Layer 2: Iconic Bold Ring Border (Matching Reference Image Frame) */}
                <div className={`absolute inset-0 rounded-full border-[8px] sm:border-[12px] lg:border-[16px] border-[#005689] shadow-2xl overflow-hidden z-10 flex flex-col items-center justify-center ${
                  hasCustomMedia ? 'bg-slate-900' : 'bg-gradient-to-br from-[#EDF5FA] via-[#F8FBFE] to-[#E2EFF8]'
                }`}>
                  
                  {hasCustomMedia ? (
                    <>
                      {/* Media Content (Image, GIF or Video) */}
                      {currentMedia?.type === 'video' ? (
                        currentMedia.url.includes('youtube.com') || currentMedia.url.includes('youtu.be') ? (
                          <iframe
                            className="w-full h-full object-cover border-0 scale-125"
                            src={getYouTubeEmbed(currentMedia.url)}
                            title={currentMedia.title || 'School Video'}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : (
                          <video
                            src={currentMedia.url}
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="w-full h-full object-cover"
                          />
                        )
                      ) : (
                        <img
                          src={currentMedia?.url}
                          alt={currentMedia?.title || displayName}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      )}

                      {/* Gradient bottom shade with Title Badge */}
                      <div className="absolute inset-x-0 bottom-0 pt-10 pb-3 sm:pb-5 px-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col items-center justify-end text-center pointer-events-none z-15">
                        <span className="text-[10.5px] sm:text-xs font-bold text-white tracking-wide drop-shadow-md break-words line-clamp-2 max-w-[78%] leading-snug">
                          {currentMedia?.title || displayName}
                        </span>
                        <span className="text-[8.5px] sm:text-[9.5px] text-amber-300 font-bold uppercase tracking-widest mt-0.5">
                          {currentMedia?.type === 'video' ? 'Video Tour' : currentMedia?.type === 'gif' ? 'Animated Showcase' : 'Campus View'} ({activeIndex + 1}/{mediaItems.length})
                        </span>
                      </div>

                      {/* Previous / Next Navigation Arrows on Circular Frame */}
                      {mediaItems.length > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={handlePrev}
                            aria-label="Previous Media"
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md flex items-center justify-center cursor-pointer opacity-80 group-hover:opacity-100 transition-all hover:scale-110 z-20"
                          >
                            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                          </button>

                          <button
                            type="button"
                            onClick={handleNext}
                            aria-label="Next Media"
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md flex items-center justify-center cursor-pointer opacity-80 group-hover:opacity-100 transition-all hover:scale-110 z-20"
                          >
                            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    /* ── EMPTY SVG PLACEHOLDER ── */
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 sm:p-8 text-center relative select-none">
                      {/* Subtle watermark background circles */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                        <div className="w-56 h-56 sm:w-72 sm:h-72 rounded-full border border-[#005689]" />
                        <div className="absolute w-40 h-40 sm:w-52 sm:h-52 rounded-full border border-dashed border-[#005689]" />
                      </div>

                      {/* Empty State Vector Illustration */}
                      <div className="relative z-10 flex flex-col items-center justify-center">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-[#D6EDFF] shadow-sm flex items-center justify-center text-[#005689] mb-3 group-hover:scale-105 transition-transform">
                          <svg
                            className="w-9 h-9 sm:w-11 sm:h-11"
                            viewBox="0 0 64 64"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            {/* Roof Pediment & Flag */}
                            <polygon points="32 8, 8 24, 56 24" fill="#005689" fillOpacity="0.12" />
                            <line x1="32" y1="8" x2="32" y2="3" />
                            <path d="M32 3 L39 5.5 L32 8 Z" fill="#005689" />
                            {/* Columns */}
                            <line x1="16" y1="24" x2="16" y2="48" />
                            <line x1="26" y1="24" x2="26" y2="48" />
                            <line x1="38" y1="24" x2="38" y2="48" />
                            <line x1="48" y1="24" x2="48" y2="48" />
                            {/* Steps */}
                            <line x1="8" y1="48" x2="56" y2="48" />
                            <line x1="5" y1="53" x2="59" y2="53" />
                            {/* Entrance */}
                            <path d="M29 48 V38 C29 36.3 30.3 35 32 35 C33.7 35 35 36.3 35 38 V48" fill="#005689" fillOpacity="0.25" />
                          </svg>
                        </div>

                        <span className="text-xs sm:text-sm font-black text-[#005689] tracking-wider uppercase">
                          Campus Photo
                        </span>
                        <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium max-w-[200px] leading-snug mt-1">
                          Official campus photo not yet uploaded
                        </p>

                        <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#D6EDFF] text-[9.5px] font-bold text-[#005689] shadow-2xs">
                          <Sparkles size={11} className="text-amber-500" />
                          <span>Awaiting Upload</span>
                        </div>

                        {/* Edit Mode Add Photo CTA */}
                        {isLiveTemplate && isEditMode && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingMediaList([]);
                              setIsMediaModalOpen(true);
                            }}
                            className="mt-3 px-3.5 py-1.5 bg-[#005689] hover:bg-[#003c6e] text-white text-[11px] font-bold rounded-full shadow-md transition-all cursor-pointer inline-flex items-center gap-1.5 active:scale-95"
                          >
                            <Plus size={12} />
                            <span>Add Photo</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Floating Media Indicator Dots at the Bottom */}
                {hasCustomMedia && mediaItems.length > 1 && (
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 bg-white/90 px-3 py-1 rounded-full shadow-xs border border-slate-200">
                    {mediaItems.map((item, idx) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveIndex(idx)}
                        aria-label={`Go to slide ${idx + 1}`}
                        className={`transition-all rounded-full cursor-pointer ${
                          activeIndex === idx
                            ? 'w-6 h-2 bg-[#005689]'
                            : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
                        }`}
                      />
                    ))}
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>



      {/* ═══════════════════════════════════════════════════════════ */}
      {/* MODAL: MANAGE HERO MEDIA (UP TO 5 IMAGES, GIFS, OR VIDEOS) */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {isMediaModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl relative border border-slate-100 max-h-[90vh] overflow-y-auto">
            
            <button
              type="button"
              onClick={() => setIsMediaModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 rounded-xl bg-sky-100 text-[#005689]">
                <Layers className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-950">Hero Section Media (Max 5)</h3>
                <p className="text-xs text-slate-500">Add or remove up to 5 photos, GIFs, or YouTube/MP4 videos for the hero carousel.</p>
              </div>
            </div>

            {/* Existing Media List */}
            <div className="mt-5 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Current Media Items ({editingMediaList.length}/5):
              </div>

              {editingMediaList.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  No media added yet. Add an image, GIF, or video below.
                </div>
              ) : (
                editingMediaList.map((item, idx) => (
                  <div key={item.id} className="flex items-center justify-between gap-3 p-2.5 rounded-xl border border-slate-200 bg-slate-50/50">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-6 h-6 rounded-full bg-[#005689] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <div className="w-12 h-12 rounded-lg bg-slate-200 overflow-hidden shrink-0">
                        {item.type === 'video' ? (
                          <div className="w-full h-full bg-slate-900 flex items-center justify-center text-white">
                            <Video className="w-5 h-5 text-sky-400" />
                          </div>
                        ) : (
                          <img src={item.url} alt={item.title || 'Preview'} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-slate-900 truncate">{item.title || 'Untitled'}</div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                          Type: <span className="text-[#005689]">{item.type}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteMedia(item.id)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer"
                      title="Delete Media"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Add New Media Form (If < 5) */}
            {editingMediaList.length < 5 && (
              <div className="mt-5 p-4 rounded-2xl border border-blue-100 bg-[#F0F7FC]">
                <div className="text-xs font-bold text-[#005689] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" />
                  Add New Media ({editingMediaList.length}/5)
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Media Type</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['image', 'gif', 'video'] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setNewMediaType(t)}
                          className={`py-1.5 px-3 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                            newMediaType === t
                              ? 'bg-[#005689] text-white shadow-xs'
                              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {newMediaType === 'video' ? 'Video URL (YouTube or MP4)' : `${newMediaType.toUpperCase()} URL`}
                    </label>
                    <input
                      type="url"
                      placeholder={newMediaType === 'video' ? 'https://www.youtube.com/watch?v=... or .mp4' : 'https://... image/gif URL'}
                      value={newMediaUrl}
                      onChange={(e) => setNewMediaUrl(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Title / Caption (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Science Discovery Lab"
                      value={newMediaTitle}
                      onChange={(e) => setNewMediaTitle(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleAddNewMedia}
                    disabled={!newMediaUrl.trim()}
                    className="w-full py-2.5 rounded-xl bg-[#005689] hover:bg-[#004168] disabled:bg-slate-300 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add To Hero ({editingMediaList.length + 1}/5)
                  </button>
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsMediaModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveMediaList}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#005689] hover:bg-[#003c6e] shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                Save Changes
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
