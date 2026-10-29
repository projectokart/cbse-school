'use client';

import React from 'react';
import { Sparkles, BookOpen, FlaskConical, Trophy, ShieldCheck, Building2, Palette } from 'lucide-react';

export function renderBoardLogo(boardName: string) {
  const name = boardName.toLowerCase().trim();

  // 1. CBSE (Official Central Board of Secondary Education Emblem)
  if (name.includes('cbse')) {
    return (
      <img
        src="/images/boards/cbse.png"
        alt="CBSE Logo"
        className="w-5 h-5 object-contain shrink-0 rounded-full"
        onError={(e) => {
          // Fallback SVG if image is unavailable
          e.currentTarget.style.display = 'none';
        }}
      />
    );
  }

  // 2. ICSE / CISCE (Council for the Indian School Certificate Examinations)
  if (name.includes('icse') || name.includes('cisce')) {
    return (
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="15" fill="#0D3B66" stroke="#D4AF37" strokeWidth="1.2" />
        <circle cx="16" cy="16" r="12" stroke="#F4D06F" strokeWidth="0.8" strokeDasharray="1.5 1" />
        <path d="M10 20C10 20 13 18.5 16 19.5C19 18.5 22 20 22 20V12C22 12 19 10.5 16 11.5C13 10.5 10 12 10 12V20Z" fill="#FFFFFF" stroke="#D4AF37" strokeWidth="0.8" />
        <line x1="16" y1="11.5" x2="16" y2="19.5" stroke="#0D3B66" strokeWidth="0.8" />
        <path d="M16 6.5C15 8 16 9.5 16 10.5C16 9.5 17 8 16 6.5Z" fill="#E63946" />
        <circle cx="16" cy="10.5" r="1" fill="#F4A261" />
        <path d="M7 23C11 25.5 21 25.5 25 23L23.5 26.5C19.5 28.5 12.5 28.5 8.5 26.5L7 23Z" fill="#D4AF37" />
        <text x="16" y="25.8" textAnchor="middle" fontSize="3.5" fontWeight="900" fill="#0D3B66" fontFamily="Arial, sans-serif">CISCE</text>
      </svg>
    );
  }

  // 3. IB (International Baccalaureate)
  if (name.includes('ib') || name.includes('baccalaureate')) {
    return (
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="15" fill="#002E6D" />
        <ellipse cx="16" cy="16" rx="7" ry="14" stroke="#4A90E2" strokeWidth="0.8" />
        <line x1="2" y1="16" x2="30" y2="16" stroke="#4A90E2" strokeWidth="0.8" />
        <ellipse cx="16" cy="16" rx="13" ry="6" stroke="#4A90E2" strokeWidth="0.8" />
        <circle cx="16" cy="16" r="11" fill="#FFFFFF" fillOpacity="0.95" />
        <circle cx="11.5" cy="10" r="1.5" fill="#002E6D" />
        <rect x="10.2" y="12.5" width="2.6" height="8.5" rx="1.3" fill="#002E6D" />
        <path d="M16 8.5V21H18.5V17.5C19.2 18.5 20.4 19 21.8 19C24.3 19 26 17 26 14.5C26 12 24.3 10 21.8 10C20.4 10 19.2 10.5 18.5 11.5V8.5H16ZM21 12.3C22.3 12.3 23.3 13.3 23.3 14.5C23.3 15.7 22.3 16.7 21 16.7C19.7 16.7 18.7 15.7 18.7 14.5C18.7 13.3 19.7 12.3 21 12.3Z" fill="#002E6D" />
      </svg>
    );
  }

  // 4. Cambridge / IGCSE (University of Cambridge Coat of Arms)
  if (name.includes('cambridge') || name.includes('igcse')) {
    return (
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 32 32" fill="none">
        <path d="M6 4H26V18C26 24 16 29 16 29C16 29 6 24 6 18V4Z" fill="#A81C24" stroke="#7A1118" strokeWidth="1" />
        <rect x="14" y="4" width="4" height="24" fill="#FFFFFF" />
        <rect x="6" y="11" width="20" height="4" fill="#FFFFFF" />
        <rect x="13" y="10" width="6" height="6" rx="0.5" fill="#1E293B" stroke="#D4AF37" strokeWidth="0.6" />
        <line x1="16" y1="10" x2="16" y2="16" stroke="#D4AF37" strokeWidth="0.6" />
        <circle cx="10" cy="8" r="1.5" fill="#F59E0B" />
        <circle cx="22" cy="8" r="1.5" fill="#F59E0B" />
        <circle cx="10" cy="18" r="1.5" fill="#F59E0B" />
        <circle cx="22" cy="18" r="1.5" fill="#F59E0B" />
      </svg>
    );
  }

  // 5. State Board (State Department Education Crest)
  if (name.includes('state')) {
    return (
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="15" fill="#065F46" stroke="#D97706" strokeWidth="1.2" />
        <circle cx="16" cy="16" r="12" stroke="#FDE68A" strokeWidth="0.8" strokeDasharray="1.5 1" />
        <path d="M13 13C13 10 14.5 8 16 8C17.5 8 19 10 19 13V15H13V13Z" fill="#FBBF24" />
        <rect x="12" y="15" width="8" height="2" fill="#D97706" />
        <circle cx="16" cy="16" r="1" fill="#FFFFFF" />
        <path d="M10 23C10 23 13 21 16 22C19 21 22 23 22 23V19C22 19 19 17 16 18C13 17 10 19 10 19V23Z" fill="#FFFFFF" stroke="#D97706" strokeWidth="0.6" />
        <line x1="16" y1="18" x2="16" y2="22" stroke="#065F46" strokeWidth="0.6" />
      </svg>
    );
  }

  return <BookOpen size={16} className="text-[#0D4979]" />;
}

export function renderCategoryHeaderIcon(category: string, fallbackUrl?: string) {
  const cat = category.toLowerCase();

  if (cat.includes('academic')) {
    return (
      <div className="w-5 h-5 rounded-lg bg-blue-100 flex items-center justify-center shrink-0 text-blue-600 shadow-2xs">
        <BookOpen size={13} className="stroke-[2.3]" />
      </div>
    );
  }

  if (cat.includes('lab')) {
    return (
      <div className="w-5 h-5 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-600 shadow-2xs">
        <FlaskConical size={13} className="stroke-[2.3]" />
      </div>
    );
  }

  if (cat.includes('sports') || cat.includes('fitness')) {
    return (
      <div className="w-5 h-5 rounded-lg bg-amber-100 flex items-center justify-center shrink-0 text-amber-600 shadow-2xs">
        <Trophy size={13} className="stroke-[2.3]" />
      </div>
    );
  }

  if (cat.includes('safety') || cat.includes('security')) {
    return (
      <div className="w-5 h-5 rounded-lg bg-red-100 flex items-center justify-center shrink-0 text-red-600 shadow-2xs">
        <ShieldCheck size={13} className="stroke-[2.3]" />
      </div>
    );
  }

  if (cat.includes('infrastructure') || cat.includes('boarding')) {
    return (
      <div className="w-5 h-5 rounded-lg bg-purple-100 flex items-center justify-center shrink-0 text-purple-600 shadow-2xs">
        <Building2 size={13} className="stroke-[2.3]" />
      </div>
    );
  }

  if (cat.includes('extracurricular')) {
    return (
      <div className="w-5 h-5 rounded-lg bg-rose-100 flex items-center justify-center shrink-0 text-rose-600 shadow-2xs">
        <Palette size={13} className="stroke-[2.3]" />
      </div>
    );
  }

  if (fallbackUrl) {
    return (
      <img
        src={fallbackUrl}
        alt={category}
        className="w-4 h-4 object-contain shrink-0"
        onError={(e) => { e.currentTarget.style.display = 'none'; }}
      />
    );
  }

  return <Sparkles size={14} className="text-blue-500 shrink-0" />;
}

export function renderFacilityIcon(item: { name: string; icon?: string }) {
  const name = item.name.toLowerCase().trim();

  // ═══════════════════════════════════════════════════════════
  // 1. LAB FACILITIES
  // ═══════════════════════════════════════════════════════════

  // Physics Lab: Atom with orbiting electrons and nucleus core
  if (name.includes('physics')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="2.5" fill="#2563EB" />
        <circle cx="11.2" cy="11.2" r="0.9" fill="#93C5FD" />
        <ellipse cx="12" cy="12" rx="9.5" ry="3.6" stroke="#3B82F6" strokeWidth="1.3" />
        <circle cx="21" cy="12" r="1.2" fill="#1D4ED8" />
        <ellipse cx="12" cy="12" rx="9.5" ry="3.6" stroke="#0D9488" strokeWidth="1.3" transform="rotate(60 12 12)" />
        <circle cx="16.5" cy="4" r="1.2" fill="#0F766E" />
        <ellipse cx="12" cy="12" rx="9.5" ry="3.6" stroke="#8B5CF6" strokeWidth="1.3" transform="rotate(120 12 12)" />
        <circle cx="7.5" cy="4" r="1.2" fill="#6D28D9" />
      </svg>
    );
  }

  // Chemistry Lab: Conical Flask with bubbling liquid
  if (name.includes('chemistry')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <path d="M10 2H14V6.5L19.5 17.5C20.2 19 19.1 21 17.4 21H6.6C4.9 21 3.8 19 4.5 17.5L10 6.5V2Z" stroke="#0284C7" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M6.2 17.5L8.2 13.5C10.5 14.5 13.5 12.5 15.8 13.5L17.8 17.5C18.2 18.5 17.6 19.5 16.5 19.5H7.5C6.4 19.5 5.8 18.5 6.2 17.5Z" fill="#38BDF8" fillOpacity="0.75" />
        <line x1="9" y1="2" x2="15" y2="2" stroke="#0284C7" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="10" cy="16" r="0.9" fill="#0284C7" />
        <circle cx="14" cy="15" r="1.1" fill="#0284C7" />
        <circle cx="12" cy="10" r="0.7" fill="#38BDF8" />
      </svg>
    );
  }

  // Biology Lab: Microscope with Bio Leaf
  if (name.includes('biology')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <path d="M3 21H13" stroke="#047857" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M7 21V18C7 16 9 15 10.5 15" stroke="#047857" strokeWidth="1.4" />
        <line x1="5" y1="14" x2="11" y2="14" stroke="#065F46" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M8.5 4L12.5 11" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
        <path d="M7 3L10 4.5" stroke="#047857" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="10" cy="12" r="1.1" fill="#047857" />
        <path d="M14 20C14 20 16 14.5 21 12.5C21.5 17.5 18 20.5 14 20Z" fill="#10B981" stroke="#047857" strokeWidth="1.1" />
        <path d="M15 19C17 17 19.2 14.8 21 12.5" stroke="#064E3B" strokeWidth="0.9" strokeLinecap="round" />
      </svg>
    );
  }

  // Composite Lab: Microscope + Horseshoe Magnet + Flask all in one
  if (name === 'composite lab') {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <path d="M15.5 3V6.5C15.5 7.8 16.8 8.8 18.2 8.8C19.6 8.8 21 7.8 21 6.5V3" stroke="#DC2626" strokeWidth="1.4" strokeLinecap="round" />
        <rect x="14.8" y="2" width="1.4" height="2" fill="#9CA3AF" />
        <rect x="20.2" y="2" width="1.4" height="2" fill="#9CA3AF" />
        <path d="M2 20H8" stroke="#2563EB" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M5 20V15" stroke="#2563EB" strokeWidth="1.4" />
        <line x1="3" y1="13" x2="8" y2="13" stroke="#1D4ED8" strokeWidth="1.4" />
        <path d="M6 5L9 10" stroke="#3B82F6" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M15 13.5L13.2 18C12.8 19 13.5 20.5 14.8 20.5H19.8C21.1 20.5 21.8 19 21.4 18L19.5 13.5V12.5H15V13.5Z" stroke="#D97706" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M14 18.5L14.7 16.5C16.2 17.2 18 16.5 19.5 16.5L20.2 18.5C20.5 19.2 20 20 19.2 20H14.8C14.1 20 13.7 19.2 14 18.5Z" fill="#FBBF24" />
      </svg>
    );
  }

  // Composite Skill Lab: Innovation Gear & Lightbulb
  if (name.includes('composite skill lab')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <path d="M12 15C10.34 15 9 13.66 9 12C9 10.34 10.34 9 12 9C13.66 9 15 10.34 15 12C15 13.66 13.66 15 12 15Z" stroke="#4F46E5" strokeWidth="1.4" />
        <path d="M12 2V4M12 20V22M4 12H2M22 12H20M5.64 5.64L7.05 7.05M16.95 16.95L18.36 18.36M5.64 18.36L7.05 16.95M16.95 7.05L18.36 5.64" stroke="#6366F1" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 7C10 7 9.5 8.5 9.5 9.5C9.5 10.8 10.5 11.5 10.5 12.5H13.5C13.5 11.5 14.5 10.8 14.5 9.5C14.5 8.5 14 7 12 7Z" fill="#F59E0B" />
        <rect x="11" y="13" width="2" height="1.5" fill="#D97706" />
      </svg>
    );
  }

  // Experiential Science Lab: Scientist in lab coat with goggles experimenting
  if (name.includes('experiential science lab')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <circle cx="8.5" cy="5.5" r="2.8" stroke="#0369A1" strokeWidth="1.3" fill="#E0F2FE" />
        <rect x="6.5" y="4.5" width="4" height="1.8" rx="0.7" fill="#0284C7" />
        <path d="M3.5 19C3.5 14 5.5 11 8.5 11C10 11 11.2 11.8 12 13" stroke="#0369A1" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M8.5 11V19" stroke="#0284C7" strokeWidth="1.1" strokeDasharray="1 1" />
        <path d="M11.5 13.5L14.5 14.5" stroke="#0369A1" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M15.5 12L18 17C18.4 18 17.6 19 16.5 19H13.5C12.4 19 11.6 18 12 17L14.5 12V10.5H15.5V12Z" stroke="#7C3AED" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M12.8 17.5L13.6 15.5C15 16 16.5 15.5 17.2 15.5L17.8 17.5C18 18.2 17.5 18.8 16.8 18.8H13.4C12.8 18.8 12.5 18.2 12.8 17.5Z" fill="#A78BFA" />
        <path d="M15 8.5C14.5 7.5 16 7 15.5 6" stroke="#9333EA" strokeWidth="1.1" strokeLinecap="round" />
        <circle cx="17.5" cy="9" r="0.7" fill="#F59E0B" />
        <circle cx="13" cy="8.5" r="0.6" fill="#10B981" />
      </svg>
    );
  }

  // ATL Tinkering Lab: Arduino Uno Board
  if (name.includes('atl tinkering lab') || name.includes('atal tinkering')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="3" width="20" height="18" rx="2" fill="#00979D" stroke="#006468" strokeWidth="1.1" />
        <rect x="1" y="5" width="3.5" height="4" rx="0.5" fill="#E2E8F0" stroke="#64748B" strokeWidth="0.7" />
        <rect x="1" y="14" width="3.5" height="5" rx="0.5" fill="#1E293B" />
        <rect x="9" y="11" width="10" height="5" rx="0.5" fill="#0F172A" />
        <line x1="10.5" y1="10.5" x2="10.5" y2="11" stroke="#CBD5E1" strokeWidth="0.7" />
        <line x1="12.5" y1="10.5" x2="12.5" y2="11" stroke="#CBD5E1" strokeWidth="0.7" />
        <line x1="14.5" y1="10.5" x2="14.5" y2="11" stroke="#CBD5E1" strokeWidth="0.7" />
        <line x1="16.5" y1="10.5" x2="16.5" y2="11" stroke="#CBD5E1" strokeWidth="0.7" />
        <line x1="10.5" y1="16" x2="10.5" y2="16.5" stroke="#CBD5E1" strokeWidth="0.7" />
        <line x1="12.5" y1="16" x2="12.5" y2="16.5" stroke="#CBD5E1" strokeWidth="0.7" />
        <line x1="14.5" y1="16" x2="14.5" y2="16.5" stroke="#CBD5E1" strokeWidth="0.7" />
        <line x1="16.5" y1="16" x2="16.5" y2="16.5" stroke="#CBD5E1" strokeWidth="0.7" />
        <rect x="8" y="4" width="12" height="2" fill="#334155" />
        <rect x="8" y="18" width="12" height="2" fill="#334155" />
        <circle cx="6.5" cy="6" r="0.9" fill="#EF4444" />
        <circle cx="11" cy="7.5" r="0.9" stroke="#FFFFFF" strokeWidth="0.5" />
        <circle cx="13" cy="7.5" r="0.9" stroke="#FFFFFF" strokeWidth="0.5" />
      </svg>
    );
  }

  // Computer Lab
  if (name.includes('computer lab')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="12" rx="1.5" stroke="#2563EB" strokeWidth="1.5" fill="#EFF6FF" />
        <line x1="12" y1="16" x2="12" y2="19" stroke="#2563EB" strokeWidth="1.5" />
        <line x1="8" y1="19" x2="16" y2="19" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="6" y="7" width="12" height="6" rx="0.5" fill="#3B82F6" />
      </svg>
    );
  }

  // Robotics Lab
  if (name.includes('robotics lab')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <rect x="5" y="7" width="14" height="12" rx="2" stroke="#6366F1" strokeWidth="1.5" fill="#EEF2FF" />
        <circle cx="9" cy="11" r="1.5" fill="#4F46E5" />
        <circle cx="15" cy="11" r="1.5" fill="#4F46E5" />
        <line x1="9" y1="15" x2="15" y2="15" stroke="#4F46E5" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="12" y1="3" x2="12" y2="7" stroke="#6366F1" strokeWidth="1.5" />
        <circle cx="12" cy="3" r="1" fill="#EF4444" />
        <line x1="2" y1="12" x2="5" y2="12" stroke="#6366F1" strokeWidth="1.5" />
        <line x1="19" y1="12" x2="22" y2="12" stroke="#6366F1" strokeWidth="1.5" />
      </svg>
    );
  }

  // Math Lab
  if (name.includes('math lab')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="3" stroke="#F59E0B" strokeWidth="1.3" fill="#FFFBEB" />
        <path d="M6 7H11M7.5 7V11M9.5 7V11" stroke="#D97706" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M14 9H18M16 7V11" stroke="#D97706" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M6 16H10" stroke="#D97706" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="8" cy="14" r="0.6" fill="#D97706" />
        <circle cx="8" cy="18" r="0.6" fill="#D97706" />
        <path d="M13 17L14.5 19L18 14" stroke="#D97706" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // Language Lab
  if (name.includes('language lab')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <path d="M4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12" stroke="#0891B2" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="3" y="11" width="3" height="6" rx="1" fill="#0891B2" />
        <rect x="18" y="11" width="3" height="6" rx="1" fill="#0891B2" />
        <path d="M18 15C18 18 15.5 19.5 12 19.5" stroke="#0891B2" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="12" cy="19.5" r="1" fill="#0891B2" />
      </svg>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // 2. ACADEMIC
  // ═══════════════════════════════════════════════════════════

  // Smart Classes
  if (name.includes('smart class')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="3" width="20" height="14" rx="2" stroke="#2563EB" strokeWidth="1.5" fill="#EFF6FF" />
        <path d="M7 17L5 21M17 17L19 21M9 21H15" stroke="#2563EB" strokeWidth="1.4" strokeLinecap="round" />
        <polygon points="10,7 15,10 10,13" fill="#3B82F6" />
        <circle cx="18" cy="6" r="1" fill="#10B981" />
      </svg>
    );
  }

  // E-Library
  if (name.includes('e-library') || name.includes('elibrary')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="2" width="16" height="20" rx="2" stroke="#7C3AED" strokeWidth="1.4" fill="#F5F3FF" />
        <path d="M8 7H16M8 11H14M8 15H12" stroke="#8B5CF6" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M15 13L17 15L15 17" stroke="#7C3AED" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="19" r="1" fill="#7C3AED" />
      </svg>
    );
  }

  // Library
  if (name.includes('library')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <path d="M4 19.5V4.5C4 3.67 4.67 3 5.5 3H8.5C9.33 3 10 3.67 10 4.5V19.5" stroke="#B45309" strokeWidth="1.4" fill="#FEF3C7" />
        <path d="M10 19.5V6.5C10 5.67 10.67 5 11.5 5H14.5C15.33 5 16 5.67 16 6.5V19.5" stroke="#047857" strokeWidth="1.4" fill="#D1FAE5" />
        <path d="M16 19.5L18.5 7.5C18.7 6.7 19.5 6.2 20.3 6.4L21 6.6V19.5" stroke="#1D4ED8" strokeWidth="1.4" fill="#DBEAFE" />
        <line x1="2" y1="20" x2="22" y2="20" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  // VR/AR Learning
  if (name.includes('vr') || name.includes('ar learning')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="7" width="20" height="10" rx="3" stroke="#9333EA" strokeWidth="1.4" fill="#FAF5FF" />
        <circle cx="8" cy="12" r="2.5" stroke="#7E22CE" strokeWidth="1.3" fill="#C084FC" />
        <circle cx="16" cy="12" r="2.5" stroke="#7E22CE" strokeWidth="1.3" fill="#C084FC" />
        <path d="M11 12H13" stroke="#9333EA" strokeWidth="1.5" />
        <path d="M2 11H1M22 11H23M5 7L7 4M19 7L17 4" stroke="#9333EA" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    );
  }

  // AV / Media Room
  if (name.includes('av') || name.includes('media room')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="13" rx="2" stroke="#EA580C" strokeWidth="1.4" fill="#FFF7ED" />
        <polygon points="10,6.5 15,9.5 10,12.5" fill="#F97316" />
        <path d="M8 20L12 16L16 20" stroke="#EA580C" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="5" y1="20" x2="19" y2="20" stroke="#EA580C" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }

  // Competitive Exam Coaching
  if (name.includes('exam coaching') || name.includes('competitive exam')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="#DC2626" strokeWidth="1.4" fill="#FEF2F2" />
        <circle cx="12" cy="12" r="5.5" stroke="#EA580C" strokeWidth="1.3" />
        <circle cx="12" cy="12" r="2" fill="#DC2626" />
        <path d="M19 5L22 2M18 2H22V6" stroke="#DC2626" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // Student Exchange Program
  if (name.includes('student exchange')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="8.5" stroke="#0284C7" strokeWidth="1.3" fill="#F0F9FF" />
        <ellipse cx="12" cy="12" rx="4" ry="8.5" stroke="#0284C7" strokeWidth="1.1" />
        <line x1="3.5" y1="12" x2="20.5" y2="12" stroke="#0284C7" strokeWidth="1.1" />
        <path d="M17 4L21 4L21 8M21 4L15 10" stroke="#F59E0B" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // Career Counseling / Pastoral Care
  if (name.includes('counseling') || name.includes('pastoral care')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="7" r="3.5" stroke="#0D9488" strokeWidth="1.4" fill="#CCFBF1" />
        <path d="M5 20C5 16 8 13.5 12 13.5C16 13.5 19 16 19 20" stroke="#0D9488" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M17 8C17 8 19 6 20.5 7.5C22 9 20 11 20 11L17 14L14 11C14 11 12 9 13.5 7.5C15 6 17 8 17 8Z" fill="#F43F5E" />
      </svg>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // 3. SPORTS & FITNESS
  // ═══════════════════════════════════════════════════════════

  // Playground / Outdoor Sports
  if (name.includes('playground') || name.includes('outdoor sports')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <path d="M2 19C5 17 9 17 12 19C15 21 19 21 22 19" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="7" y="9" width="10" height="7" stroke="#15803D" strokeWidth="1.3" fill="#DCFCE7" />
        <circle cx="18" cy="6" r="2.5" fill="#EAB308" />
        <line x1="12" y1="9" x2="12" y2="16" stroke="#15803D" strokeWidth="1" strokeDasharray="1 1" />
      </svg>
    );
  }

  // Indoor Games
  if (name.includes('indoor games')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="3" stroke="#4B5563" strokeWidth="1.4" fill="#F3F4F6" />
        <circle cx="7.5" cy="7.5" r="1.5" fill="#DC2626" />
        <circle cx="16.5" cy="7.5" r="1.5" fill="#2563EB" />
        <circle cx="12" cy="12" r="1.5" fill="#1F2937" />
        <circle cx="7.5" cy="16.5" r="1.5" fill="#2563EB" />
        <circle cx="16.5" cy="16.5" r="1.5" fill="#DC2626" />
      </svg>
    );
  }

  // Swimming Pool
  if (name.includes('swimming')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <circle cx="16" cy="5" r="2" fill="#0284C7" />
        <path d="M12 9L15 7L18 8L20 6" stroke="#0284C7" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M2 14C5 12.5 8 15.5 11 14C14 12.5 17 15.5 22 14" stroke="#0284C7" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M2 18C5 16.5 8 19.5 11 18C14 16.5 17 19.5 22 18" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  // Basketball Court
  if (name.includes('basketball')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="#EA580C" strokeWidth="1.4" fill="#FFEDD5" />
        <line x1="3" y1="12" x2="21" y2="12" stroke="#C2410C" strokeWidth="1.2" />
        <line x1="12" y1="3" x2="12" y2="21" stroke="#C2410C" strokeWidth="1.2" />
        <path d="M6 5.5C8.5 7.5 8.5 16.5 6 18.5" stroke="#C2410C" strokeWidth="1.2" />
        <path d="M18 5.5C15.5 7.5 15.5 16.5 18 18.5" stroke="#C2410C" strokeWidth="1.2" />
      </svg>
    );
  }

  // Football Ground
  if (name.includes('football')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="#1F2937" strokeWidth="1.4" fill="#FFFFFF" />
        <polygon points="12,7 15,9 14,12.5 10,12.5 9,9" fill="#1F2937" />
        <line x1="12" y1="7" x2="12" y2="3" stroke="#1F2937" strokeWidth="1.2" />
        <line x1="15" y1="9" x2="19" y2="7.5" stroke="#1F2937" strokeWidth="1.2" />
        <line x1="14" y1="12.5" x2="17" y2="16" stroke="#1F2937" strokeWidth="1.2" />
        <line x1="10" y1="12.5" x2="7" y2="16" stroke="#1F2937" strokeWidth="1.2" />
        <line x1="9" y1="9" x2="5" y2="7.5" stroke="#1F2937" strokeWidth="1.2" />
      </svg>
    );
  }

  // Cricket Pitch
  if (name.includes('cricket')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <rect x="5" y="3" width="3" height="12" rx="1" transform="rotate(35 5 3)" fill="#D97706" stroke="#92400E" strokeWidth="1" />
        <line x1="12" y1="13" x2="16" y2="19" stroke="#78350F" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="17" cy="7" r="3" fill="#DC2626" />
        <path d="M15.5 5.5C16.5 6.5 17.5 7.5 18.5 8.5" stroke="#FFFFFF" strokeWidth="0.8" strokeDasharray="1 1" />
      </svg>
    );
  }

  // Tennis Court
  if (name.includes('tennis')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <ellipse cx="15" cy="9" rx="6" ry="7" stroke="#2563EB" strokeWidth="1.4" fill="#DBEAFE" />
        <line x1="11" y1="14" x2="4" y2="21" stroke="#1D4ED8" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="11" y1="6" x2="19" y2="12" stroke="#60A5FA" strokeWidth="0.8" />
        <line x1="11" y1="12" x2="19" y2="6" stroke="#60A5FA" strokeWidth="0.8" />
        <circle cx="6" cy="7" r="2.5" fill="#84CC16" />
      </svg>
    );
  }

  // Badminton & Volleyball Court
  if (name.includes('badminton') || name.includes('volleyball')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="18" r="2.5" fill="#DC2626" />
        <path d="M9.5 16L6 6H18L14.5 16" stroke="#0284C7" strokeWidth="1.3" fill="#E0F2FE" />
        <line x1="8" y1="10" x2="16" y2="10" stroke="#0284C7" strokeWidth="1" />
        <line x1="7" y1="13" x2="17" y2="13" stroke="#0284C7" strokeWidth="1" />
      </svg>
    );
  }

  // Table Tennis & Squash
  if (name.includes('table tennis') || name.includes('squash')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <circle cx="13" cy="9" r="6" stroke="#DC2626" strokeWidth="1.3" fill="#EF4444" />
        <line x1="9" y1="13" x2="4" y2="20" stroke="#92400E" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="19" cy="16" r="2" fill="#F3F4F6" stroke="#9CA3AF" strokeWidth="0.8" />
      </svg>
    );
  }

  // Gymnasium
  if (name.includes('gym') || name.includes('gymnasium')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <line x1="5" y1="12" x2="19" y2="12" stroke="#4B5563" strokeWidth="2.5" strokeLinecap="round" />
        <rect x="3" y="8" width="3" height="8" rx="1" fill="#1F2937" />
        <rect x="6" y="9.5" width="2" height="5" rx="0.5" fill="#374151" />
        <rect x="18" y="8" width="3" height="8" rx="1" fill="#1F2937" />
        <rect x="16" y="9.5" width="2" height="5" rx="0.5" fill="#374151" />
      </svg>
    );
  }

  // Skating Rink
  if (name.includes('skating')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <path d="M4 14H18C19 14 20 13 20 11V8C20 6.5 18.5 5 17 5H13L9 11H4C3 11 2 12 2 13V14" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1.2" />
        <circle cx="6" cy="18" r="2" fill="#F59E0B" stroke="#D97706" strokeWidth="1" />
        <circle cx="11" cy="18" r="2" fill="#F59E0B" stroke="#D97706" strokeWidth="1" />
        <circle cx="16" cy="18" r="2" fill="#F59E0B" stroke="#D97706" strokeWidth="1" />
      </svg>
    );
  }

  // Yoga Center
  if (name.includes('yoga')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="5" r="2" fill="#059669" />
        <path d="M12 8V14M12 14L8 18M12 14L16 18M6 11L12 9L18 11" stroke="#059669" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 19C8 17 16 17 19 19" stroke="#10B981" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }

  // Martial Arts (Karate / Taekwondo)
  if (name.includes('martial') || name.includes('karate') || name.includes('taekwondo')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <circle cx="10" cy="5" r="2" fill="#DC2626" />
        <path d="M8 8L11 11L18 7" stroke="#DC2626" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11 11V15L15 20M11 15L7 19" stroke="#1F2937" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="7.5" y="12" width="7" height="2" rx="0.5" fill="#111827" />
      </svg>
    );
  }

  // Running Track / Athletics
  if (name.includes('running') || name.includes('athletics')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="13" r="8" stroke="#D97706" strokeWidth="1.4" fill="#FFFBEB" />
        <line x1="12" y1="13" x2="15" y2="10" stroke="#DC2626" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="12" y1="13" x2="12" y2="8" stroke="#1F2937" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M10 2H14M12 2V5" stroke="#D97706" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }

  // Horse Riding / Equestrian
  if (name.includes('horse') || name.includes('equestrian')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <path d="M18 4C16 3 13 4 12 7L10 9L6 9C5 11 6 13 8 13L9 16L7 20H10L12 16L14 13L17 11C19 10 20 7 18 4Z" fill="#78350F" stroke="#451A03" strokeWidth="1.2" />
        <circle cx="15" cy="6" r="0.8" fill="#FFFFFF" />
      </svg>
    );
  }

  // Shooting & Archery / Golf
  if (name.includes('shooting') || name.includes('archery') || name.includes('golf')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <path d="M6 3C12 3 16 7 16 12C16 17 12 21 6 21" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="6" y1="3" x2="6" y2="21" stroke="#047857" strokeWidth="1.2" />
        <line x1="3" y1="12" x2="19" y2="12" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" />
        <polyline points="15,9 19,12 15,15" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // 4. SAFETY & SECURITY
  // ═══════════════════════════════════════════════════════════

  // CCTV Surveillance
  if (name.includes('cctv')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <path d="M4 8L16 5L19 12L7 15L4 8Z" fill="#E2E8F0" stroke="#334155" strokeWidth="1.3" />
        <rect x="2" y="14" width="4" height="6" fill="#64748B" />
        <line x1="4" y1="14" x2="7" y2="11" stroke="#334155" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="18" cy="8.5" r="1.5" fill="#EF4444" />
      </svg>
    );
  }

  // GPS Bus Tracking App
  if (name.includes('gps') || name.includes('bus tracking')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="6" width="14" height="11" rx="2" fill="#FBBF24" stroke="#D97706" strokeWidth="1.2" />
        <rect x="5" y="8" width="10" height="4" rx="0.5" fill="#1E293B" />
        <circle cx="6.5" cy="17" r="1.5" fill="#1E293B" />
        <circle cx="13.5" cy="17" r="1.5" fill="#1E293B" />
        <path d="M19 4C21 6 21 9 19 11M21 2C24 5 24 11 21 14" stroke="#0284C7" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }

  // Student Tracking App
  if (name.includes('student tracking')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <rect x="5" y="2" width="14" height="20" rx="2" stroke="#2563EB" strokeWidth="1.4" fill="#EFF6FF" />
        <circle cx="12" cy="9" r="2.5" fill="#3B82F6" />
        <path d="M9 15C9 13.5 10.3 12.5 12 12.5C13.7 12.5 15 13.5 15 15" stroke="#3B82F6" strokeWidth="1.3" />
        <circle cx="12" cy="18.5" r="1" fill="#10B981" />
      </svg>
    );
  }

  // Medical Room / Clinic
  if (name.includes('medical') || name.includes('clinic')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="5" width="18" height="14" rx="2" stroke="#DC2626" strokeWidth="1.4" fill="#FEF2F2" />
        <path d="M10 2H14V5H10V2Z" stroke="#DC2626" strokeWidth="1.2" fill="#FCA5A5" />
        <rect x="10.5" y="8" width="3" height="8" fill="#DC2626" />
        <rect x="8" y="10.5" width="8" height="3" fill="#DC2626" />
      </svg>
    );
  }

  // Fire Safety Extinguishers
  if (name.includes('fire')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <rect x="8" y="7" width="8" height="14" rx="3" fill="#DC2626" stroke="#991B1B" strokeWidth="1.2" />
        <path d="M10 7V4H14V7" stroke="#374151" strokeWidth="1.3" />
        <path d="M14 5H18V10" stroke="#374151" strokeWidth="1.3" strokeLinecap="round" />
        <rect x="10" y="10" width="4" height="2" fill="#FDE047" />
      </svg>
    );
  }

  // Disabled Friendly (Ramps & Washrooms)
  if (name.includes('disabled') || name.includes('ramp')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="5" r="1.8" fill="#2563EB" />
        <path d="M11 8V13L15 13M11 13L8 18" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="10" cy="14" r="4.5" stroke="#2563EB" strokeWidth="1.4" />
      </svg>
    );
  }

  // RO Drinking Water
  if (name.includes('drinking water') || name.includes('ro drinking')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <path d="M12 3C12 3 6 10 6 14.5C6 18 8.7 21 12 21C15.3 21 18 18 18 14.5C18 10 12 3 12 3Z" fill="#38BDF8" stroke="#0284C7" strokeWidth="1.3" />
        <path d="M9.5 14C9.5 12 11 10.5 12.5 10" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // 5. INFRASTRUCTURE & BOARDING
  // ═══════════════════════════════════════════════════════════

  // AC Classrooms
  if (name.includes('ac class')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="9" rx="1.5" stroke="#0284C7" strokeWidth="1.4" fill="#F0F9FF" />
        <line x1="6" y1="10" x2="18" y2="10" stroke="#0284C7" strokeWidth="1" />
        <path d="M6 16C7 18 9 19 12 19C15 19 17 18 18 16" stroke="#38BDF8" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M9 15L7 17M15 15L17 17M12 14V17" stroke="#38BDF8" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    );
  }

  // Wi-Fi Campus
  if (name.includes('wi-fi') || name.includes('wifi')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <path d="M3 8C8 3.5 16 3.5 21 8" stroke="#2563EB" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M6.5 12C9.5 8.5 14.5 8.5 17.5 12" stroke="#3B82F6" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M9.5 16C11 14.5 13 14.5 14.5 16" stroke="#60A5FA" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="12" cy="19" r="1.5" fill="#1D4ED8" />
      </svg>
    );
  }

  // Transport Facility (School Bus)
  if (name.includes('transport') || name.includes('school bus')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <path d="M3 6C3 4.9 3.9 4 5 4H17C18.7 4 20.2 5.2 20.8 6.8L22 10V16C22 16.6 21.6 17 21 17H20V18C20 19.1 19.1 20 18 20C16.9 20 16 19.1 16 18V17H8V18C8 19.1 7.1 20 6 20C4.9 20 4 19.1 4 18V17H3C2.4 17 2 16.6 2 16V6C2 6 2.5 6 3 6Z" fill="#FBBF24" stroke="#D97706" strokeWidth="1.2" />
        <rect x="5" y="7" width="13" height="4" rx="0.5" fill="#1E293B" />
        <circle cx="6" cy="18" r="1.5" fill="#1E293B" />
        <circle cx="18" cy="18" r="1.5" fill="#1E293B" />
      </svg>
    );
  }

  // Boys Hostel
  if (name.includes('boys hostel')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="#2563EB" strokeWidth="1.3" fill="#EFF6FF" />
        <circle cx="12" cy="8" r="2.5" fill="#3B82F6" />
        <path d="M8 15C8 13 9.8 11.5 12 11.5C14.2 11.5 16 13 16 15V17H8V15Z" fill="#2563EB" />
        <line x1="5" y1="18" x2="19" y2="18" stroke="#1D4ED8" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }

  // Girls Hostel
  if (name.includes('girls hostel')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="#EC4899" strokeWidth="1.3" fill="#FDF2F8" />
        <circle cx="12" cy="8" r="2.5" fill="#F472B6" />
        <path d="M8 15C8 13 9.8 11.5 12 11.5C14.2 11.5 16 13 16 15V17H8V15Z" fill="#EC4899" />
        <line x1="5" y1="18" x2="19" y2="18" stroke="#DB2777" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }

  // Day Care / Creche
  if (name.includes('day care') || name.includes('creche')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <path d="M4 14C4 9.5 7.5 6 12 6C16.5 6 20 9.5 20 14V16H4V14Z" stroke="#F59E0B" strokeWidth="1.3" fill="#FEF3C7" />
        <circle cx="12" cy="11" r="2.5" fill="#FBBF24" />
        <path d="M3 19C7 17 17 17 21 19" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  // Cafeteria / Canteen
  if (name.includes('cafeteria') || name.includes('canteen')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <path d="M6 3V10M4 3V7C4 8 5 9 6 9M8 3V7C8 8 7 9 6 9M6 10V21" stroke="#EA580C" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M15 3V21M15 3C17 3 19 5 19 8V12H15" stroke="#EA580C" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // Mid-Day Meals / Dining
  if (name.includes('mid-day') || name.includes('dining') || name.includes('meals')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <path d="M3 15C3 10 7 6 12 6C17 6 21 10 21 15H3Z" stroke="#D97706" strokeWidth="1.4" fill="#FEF3C7" />
        <line x1="2" y1="17" x2="22" y2="17" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="12" cy="4" r="1.5" fill="#D97706" />
      </svg>
    );
  }

  // Auditorium
  if (name.includes('auditorium')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <path d="M3 4H21V18H3V4Z" stroke="#7C3AED" strokeWidth="1.3" fill="#F5F3FF" />
        <path d="M3 4L8 14H16L21 4" stroke="#7C3AED" strokeWidth="1.3" fill="#DDD6FE" />
        <polygon points="12,7 14,11 10,11" fill="#F59E0B" />
        <line x1="5" y1="18" x2="19" y2="18" stroke="#6D28D9" strokeWidth="1.8" />
      </svg>
    );
  }

  // Activity Rooms
  if (name.includes('activity room')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="8" height="8" rx="1.5" fill="#3B82F6" />
        <rect x="13" y="3" width="8" height="8" rx="1.5" fill="#EF4444" />
        <rect x="3" y="13" width="8" height="8" rx="1.5" fill="#10B981" />
        <rect x="13" y="13" width="8" height="8" rx="1.5" fill="#F59E0B" />
      </svg>
    );
  }

  // Elevators / Lifts
  if (name.includes('elevator') || name.includes('lift')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="3" width="16" height="18" rx="2" stroke="#4B5563" strokeWidth="1.4" fill="#F3F4F6" />
        <polygon points="9,10 12,6 15,10" fill="#2563EB" />
        <polygon points="9,14 12,18 15,14" fill="#DC2626" />
        <line x1="12" y1="3" x2="12" y2="21" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="2 2" />
      </svg>
    );
  }

  // Solar Power & Rain Water Harvesting
  if (name.includes('solar') || name.includes('rain water')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <circle cx="6" cy="6" r="3" fill="#F59E0B" />
        <rect x="8" y="10" width="13" height="10" rx="1" transform="skewX(-15)" stroke="#0284C7" strokeWidth="1.2" fill="#E0F2FE" />
        <line x1="14.5" y1="10" x2="14.5" y2="20" stroke="#0284C7" strokeWidth="1" />
        <line x1="8" y1="15" x2="21" y2="15" stroke="#0284C7" strokeWidth="1" />
      </svg>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // 6. EXTRACURRICULAR
  // ═══════════════════════════════════════════════════════════

  // Art & Craft Room
  if (name.includes('art') || name.includes('craft')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <path d="M12 3C6.5 3 2 7.5 2 13C2 17.5 5.5 21 10 21C11.5 21 12 20 12 19C12 18 13 17 14 17H16C19.3 17 22 14.3 22 11C22 6.5 17.5 3 12 3Z" stroke="#D97706" strokeWidth="1.3" fill="#FEF3C7" />
        <circle cx="6.5" cy="11.5" r="1.5" fill="#EF4444" />
        <circle cx="10" cy="7.5" r="1.5" fill="#3B82F6" />
        <circle cx="15" cy="8" r="1.5" fill="#10B981" />
        <circle cx="18" cy="12" r="1.5" fill="#8B5CF6" />
      </svg>
    );
  }

  // Dance Room
  if (name.includes('dance')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <circle cx="15" cy="4" r="2" fill="#EC4899" />
        <path d="M12 9L15 6L18 8M10 13L13 10L16 12M13 10V15L9 21M13 15L17 20" stroke="#EC4899" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 6C5 6 7 4 9 7" stroke="#F472B6" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    );
  }

  // Music Room
  if (name.includes('music')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <circle cx="7" cy="18" r="3" fill="#8B5CF6" />
        <circle cx="17" cy="15" r="3" fill="#8B5CF6" />
        <path d="M10 18V6L20 3V15" stroke="#7C3AED" strokeWidth="1.5" />
        <line x1="10" y1="9" x2="20" y2="6" stroke="#7C3AED" strokeWidth="1.8" />
      </svg>
    );
  }

  // Drama Theatre
  if (name.includes('drama') || name.includes('theatre')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <path d="M3 5C3 3.5 5 2 8 2C11 2 13 3.5 13 5V11C13 13.5 11 15 8 15C5 15 3 13.5 3 11V5Z" stroke="#D97706" strokeWidth="1.3" fill="#FEF3C7" />
        <circle cx="6" cy="6.5" r="1" fill="#78350F" />
        <circle cx="10" cy="6.5" r="1" fill="#78350F" />
        <path d="M6 10.5C7 12 9 12 10 10.5" stroke="#78350F" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M13 9C13 7.5 15 6 18 6C21 6 23 7.5 23 9V15C23 17.5 21 19 18 19C15 19 13 17.5 13 15V9Z" stroke="#7C3AED" strokeWidth="1.3" fill="#EDE9FE" />
        <path d="M16 15C17 13.5 19 13.5 20 15" stroke="#4C1D95" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    );
  }

  // Debate & Public Speaking Club
  if (name.includes('debate') || name.includes('public speaking')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <rect x="6" y="11" width="12" height="10" rx="1" fill="#D97706" stroke="#92400E" strokeWidth="1.2" />
        <circle cx="12" cy="5" r="2.5" stroke="#2563EB" strokeWidth="1.3" fill="#DBEAFE" />
        <line x1="12" y1="7.5" x2="12" y2="11" stroke="#2563EB" strokeWidth="1.5" />
        <path d="M18 4C19.5 5.5 19.5 7.5 18 9" stroke="#0284C7" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    );
  }

  // Eco Club & Gardening
  if (name.includes('eco') || name.includes('gardening')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <path d="M12 21V11" stroke="#15803D" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M12 15C12 15 8 13 8 9C8 5 12 4 12 4C12 4 16 5 16 9C16 13 12 15 12 15Z" fill="#22C55E" stroke="#16A34A" strokeWidth="1.2" />
        <path d="M7 21H17" stroke="#78350F" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  // Educational Tours & Excursions
  if (name.includes('tour') || name.includes('excursion')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <rect x="6" y="8" width="12" height="13" rx="2" stroke="#EA580C" strokeWidth="1.3" fill="#FFEDD5" />
        <path d="M9 8V5C9 4 10 3 12 3C14 3 15 4 15 5V8" stroke="#EA580C" strokeWidth="1.3" />
        <line x1="6" y1="13" x2="18" y2="13" stroke="#C2410C" strokeWidth="1.2" />
        <circle cx="12" cy="17" r="1.5" fill="#EA580C" />
      </svg>
    );
  }

  // Photography & Media Club
  if (name.includes('photography') || name.includes('media club')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <path d="M4 7H7L9 4H15L17 7H20C21.1 7 22 7.9 22 9V19C22 20.1 21.1 21 20 21H4C2.9 21 2 20.1 2 19V9C2 7.9 2.9 7 4 7Z" stroke="#374151" strokeWidth="1.3" fill="#F3F4F6" />
        <circle cx="12" cy="14" r="4" stroke="#2563EB" strokeWidth="1.4" fill="#DBEAFE" />
        <circle cx="12" cy="14" r="1.5" fill="#1D4ED8" />
      </svg>
    );
  }

  // NCC
  if (name === 'ncc') {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L4 5V12C4 17 7.5 21 12 22C16.5 21 20 17 20 12V5L12 2Z" fill="#DC2626" stroke="#991B1B" strokeWidth="1.2" />
        <path d="M12 2L4 5V12C4 17 7.5 21 12 22V2Z" fill="#1D4ED8" />
        <polygon points="12,7 13.5,10.5 17,11 14.5,13.5 15,17 12,15 9,17 9.5,13.5 7,11 10.5,10.5" fill="#FDE047" />
      </svg>
    );
  }

  // Scouts & Guides
  if (name.includes('scout') || name.includes('guide')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <path d="M12 3C12 3 9 7 9 10C9 12 10.5 13.5 12 14C13.5 13.5 15 12 15 10C15 7 12 3 12 3Z" fill="#8B5CF6" stroke="#6D28D9" strokeWidth="1" />
        <path d="M7 10C7 10 5 11 5 13C5 15 8 16 9 14" stroke="#6D28D9" strokeWidth="1.2" fill="#C4B5FD" />
        <path d="M17 10C17 10 19 11 19 13C19 15 16 16 15 14" stroke="#6D28D9" strokeWidth="1.2" fill="#C4B5FD" />
        <rect x="10" y="15" width="4" height="6" rx="1" fill="#F59E0B" />
      </svg>
    );
  }

  // Student Council & Hobby Clubs
  if (name.includes('student council') || name.includes('hobby')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="9" r="6" stroke="#D97706" strokeWidth="1.3" fill="#FEF3C7" />
        <polygon points="12,5 13.5,7.5 16,8 14,10 14.5,12.5 12,11 9.5,12.5 10,10 8,8 10.5,7.5" fill="#F59E0B" />
        <polygon points="9,14 7,22 12,19 17,22 15,14" fill="#DC2626" />
      </svg>
    );
  }

  // Alumni Association
  if (name.includes('alumni')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <polygon points="12,3 2,8 12,13 22,8" fill="#1E293B" stroke="#0F172A" strokeWidth="1.2" />
        <path d="M6 10.5V16C6 18.5 8.7 20.5 12 20.5C15.3 20.5 18 18.5 18 16V10.5" stroke="#1E293B" strokeWidth="1.3" />
        <line x1="22" y1="8" x2="22" y2="15" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="22" cy="15.5" r="1" fill="#F59E0B" />
      </svg>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // FALLBACK
  // ═══════════════════════════════════════════════════════════
  if (item.icon) {
    return (
      <img
        src={item.icon}
        alt={item.name}
        className="w-4 h-4 object-contain shrink-0"
        onError={(e) => { e.currentTarget.style.display = 'none'; }}
      />
    );
  }

  return <Sparkles size={15} className="text-blue-600 shrink-0" />;
}

export function renderClassIcon(className: string) {
  const name = className.toLowerCase().trim().replace(/ /g, '');

  // Playgroup / Pre-Nursery: Blocks / Toys
  if (name.includes('playgroup') || name.includes('prenursery') || name.includes('pre-nursery')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <rect x="5" y="11" width="6" height="6" rx="1" fill="#F59E0B" stroke="#D97706" strokeWidth="1.2" />
        <rect x="13" y="11" width="6" height="6" rx="1" fill="#3B82F6" stroke="#2563EB" strokeWidth="1.2" />
        <rect x="9" y="3" width="6" height="6" rx="1" fill="#EF4444" stroke="#DC2626" strokeWidth="1.2" />
        <text x="12" y="7.5" textAnchor="middle" fontSize="4" fill="#FFFFFF" fontWeight="bold">A</text>
        <text x="8" y="15.5" textAnchor="middle" fontSize="4" fill="#FFFFFF" fontWeight="bold">B</text>
        <text x="16" y="15.5" textAnchor="middle" fontSize="4" fill="#FFFFFF" fontWeight="bold">C</text>
      </svg>
    );
  }

  // Nursery / LKG / UKG: Abacus / Early Learning
  if (name.includes('nursery') || name.includes('lkg') || name.includes('ukg')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="4" width="16" height="16" rx="2" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
        <line x1="6" y1="8" x2="18" y2="8" stroke="#92400E" strokeWidth="1" />
        <line x1="6" y1="12" x2="18" y2="12" stroke="#92400E" strokeWidth="1" />
        <line x1="6" y1="16" x2="18" y2="16" stroke="#92400E" strokeWidth="1" />
        <circle cx="8" cy="8" r="1.5" fill="#EF4444" />
        <circle cx="12" cy="8" r="1.5" fill="#3B82F6" />
        <circle cx="10" cy="12" r="1.5" fill="#10B981" />
        <circle cx="14" cy="12" r="1.5" fill="#F59E0B" />
        <circle cx="8" cy="16" r="1.5" fill="#8B5CF6" />
        <circle cx="16" cy="16" r="1.5" fill="#EC4899" />
      </svg>
    );
  }

    // Numbered Classes (1-12)
  const numMatch = name.match(/\d+/);
  if (numMatch) {
    const num = numMatch[0];
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="4" fill="#EDF5FA" stroke="#005689" strokeWidth="1.5" />
        <path d="M3 8H21" stroke="#005689" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="7" cy="5.5" r="1" fill="#005689" />
        <circle cx="12" cy="5.5" r="1" fill="#005689" />
        <circle cx="17" cy="5.5" r="1" fill="#005689" />
        <text x="12" y="18" textAnchor="middle" fontSize="10" fill="#005689" fontWeight="900" fontFamily="sans-serif">{num}</text>
      </svg>
    );
  }

  return <BookOpen size={14} className="text-[#0D4979]" />;
}

export function renderSchoolTypeIcon(typeName: string) {
  const name = typeName.toLowerCase().trim();

  // Private Unaided
  if (name.includes('private')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="4" width="16" height="16" rx="2" fill="#F3F4F6" stroke="#4B5563" strokeWidth="1.5" />
        <rect x="8" y="8" width="3" height="3" fill="#60A5FA" />
        <rect x="13" y="8" width="3" height="3" fill="#60A5FA" />
        <rect x="8" y="13" width="3" height="3" fill="#60A5FA" />
        <rect x="13" y="13" width="3" height="3" fill="#60A5FA" />
        <path d="M10 20V17H14V20" fill="#4B5563" />
      </svg>
    );
  }

  // Government
  if (name === 'government' || name.includes('public')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <path d="M2 20H22M4 20V10M20 20V10" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 3L2 10H22L12 3Z" fill="#10B981" stroke="#047857" strokeWidth="1.2" />
        <rect x="9" y="13" width="6" height="7" fill="#047857" />
        <rect x="6" y="13" width="2" height="7" fill="#6EE7B7" />
        <rect x="16" y="13" width="2" height="7" fill="#6EE7B7" />
      </svg>
    );
  }

  // Government Aided
  if (name.includes('aided')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <path d="M12 3L3 9V21H21V9L12 3Z" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M9 21V14H15V21" fill="#D97706" />
        <rect x="7" y="11" width="3" height="2" fill="#60A5FA" />
        <rect x="14" y="11" width="3" height="2" fill="#60A5FA" />
        <circle cx="12" cy="7" r="1.5" fill="#F59E0B" />
      </svg>
    );
  }

  // International
  if (name.includes('international')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.5" />
        <ellipse cx="12" cy="12" rx="4" ry="9" stroke="#0284C7" strokeWidth="1.2" />
        <line x1="3" y1="12" x2="21" y2="12" stroke="#0284C7" strokeWidth="1.2" />
        <line x1="5" y1="7" x2="19" y2="7" stroke="#0284C7" strokeWidth="1" strokeDasharray="2 2" />
        <line x1="5" y1="17" x2="19" y2="17" stroke="#0284C7" strokeWidth="1" strokeDasharray="2 2" />
      </svg>
    );
  }

  return <Building2 size={14} className="text-[#0D4979]" />;
}

export function renderSpecialCategoryIcon(categoryName: string) {
  const name = categoryName.toLowerCase().trim();

  // Sainik School (Shield / Swords)
  if (name.includes('sainik')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L4 5V11C4 16.5 7.5 20.5 12 22C16.5 20.5 20 16.5 20 11V5L12 2Z" fill="#DC2626" stroke="#991B1B" strokeWidth="1.2" />
        <path d="M12 2L4 5V11C4 16.5 7.5 20.5 12 22V2Z" fill="#1D4ED8" />
        <polygon points="12,6 13.5,9.5 17,10 14.5,12.5 15,16 12,14 9,16 9.5,12.5 7,10 10.5,9.5" fill="#FDE047" />
      </svg>
    );
  }

  // Kendriya Vidyalaya (KVS - Rising Sun / Book)
  if (name.includes('kendriya') || name.includes('kvs')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" fill="#0D4979" stroke="#EAB308" strokeWidth="1.2" />
        <path d="M12 17C14.5 17 16.5 15 16.5 12.5C16.5 10 12 5 12 5C12 5 7.5 10 7.5 12.5C7.5 15 9.5 17 12 17Z" fill="#EAB308" />
        <path d="M10.5 11C10.5 10 12 8 12 8C12 8 13.5 10 13.5 11C13.5 12 12.5 13 12 13C11.5 13 10.5 12 10.5 11Z" fill="#FFFFFF" />
        <path d="M7 16L17 16" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M8 18L16 18" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  // Navodaya Vidyalaya (JNV - Flame/Book/Leaves)
  if (name.includes('navodaya') || name.includes('jnv')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" fill="#1E40AF" />
        <path d="M12 17C12 17 7 14 7 10C7 7 12 4 12 4C12 4 17 7 17 10C17 14 12 17 12 17Z" fill="#FFFFFF" />
        <path d="M12 15C12 15 9 12 9 9C9 7 12 5 12 5C12 5 15 7 15 9C15 12 12 15 12 15Z" fill="#EF4444" />
        <circle cx="12" cy="10" r="1.5" fill="#F59E0B" />
      </svg>
    );
  }

  // Army Public School (APS - Swords)
  if (name.includes('army') || name.includes('aps')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" fill="#166534" stroke="#FDE047" strokeWidth="1.2" />
        <line x1="7" y1="7" x2="17" y2="17" stroke="#FDE047" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="17" y1="7" x2="7" y2="17" stroke="#FDE047" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="12" cy="12" r="2.5" fill="#DC2626" />
        <circle cx="12" cy="12" r="1" fill="#FDE047" />
      </svg>
    );
  }

  // Eklavya Model (EMRS - Tribal/Bow)
  if (name.includes('eklavya') || name.includes('emrs')) {
    return (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" fill="#F59E0B" />
        <path d="M15 6C17 9 17 15 15 18M12 6C14 9 14 15 12 18M9 6C11 9 11 15 9 18" stroke="#78350F" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="5" y1="12" x2="19" y2="12" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />
        <polygon points="19,12 16,10 16,14" fill="#78350F" />
      </svg>
    );
  }

  return <ShieldCheck size={14} className="text-[#0D4979]" />;
}

