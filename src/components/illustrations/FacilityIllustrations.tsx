import React from 'react';

// 1. Science Labs Illustration
export function ScienceLabIllustration({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 150" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="sciBg" x1="0" y1="0" x2="240" y2="150" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EFF6FF" />
          <stop offset="1" stopColor="#DBEAFE" />
        </linearGradient>
        <linearGradient id="flaskLiquid" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#38BDF8" />
          <stop offset="1" stopColor="#1D4ED8" />
        </linearGradient>
        <linearGradient id="chemPurple" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#A855F7" />
          <stop offset="1" stopColor="#6B21A8" />
        </linearGradient>
      </defs>
      
      {/* Background Soft Bubble */}
      <rect width="240" height="150" rx="16" fill="url(#sciBg)" />
      <circle cx="120" cy="80" r="56" fill="#BFDBFE" fillOpacity="0.4" />

      {/* Lab Desk Surface */}
      <rect x="25" y="118" width="190" height="6" rx="3" fill="#94A3B8" />

      {/* Main Conical Flask */}
      <path d="M114 42H126V58L148 108C151 114 146 118 140 118H100C94 118 89 114 92 108L114 58V42Z" fill="white" stroke="#2563EB" strokeWidth="3" />
      <path d="M98 94L106 76H134L142 94C140 108 100 108 98 94Z" fill="url(#flaskLiquid)" fillOpacity="0.85" />
      <rect x="110" y="38" width="20" height="5" rx="2" fill="#1D4ED8" />
      
      {/* Floating Bubbles */}
      <circle cx="118" cy="82" r="3.5" fill="white" fillOpacity="0.8" />
      <circle cx="126" cy="92" r="2.5" fill="white" fillOpacity="0.8" />
      <circle cx="122" cy="68" r="3" fill="#38BDF8" />
      <circle cx="116" cy="54" r="2" fill="#38BDF8" />

      {/* Microscope on Right */}
      <g transform="translate(155, 60)">
        <path d="M12 12C12 26 22 36 34 36" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
        <rect x="26" y="52" width="24" height="6" rx="2" fill="#334155" />
        <line x1="38" y1="36" x2="38" y2="52" stroke="#334155" strokeWidth="4" />
        <rect x="8" y="2" width="10" height="24" rx="2" transform="rotate(-30 8 2)" fill="#3B82F6" stroke="#1E293B" strokeWidth="2" />
        <circle cx="34" cy="44" r="3" fill="#F59E0B" />
      </g>

      {/* Test Tube Stand on Left */}
      <g transform="translate(42, 70)">
        <rect x="6" y="42" width="36" height="6" rx="2" fill="#64748B" />
        <line x1="8" y1="18" x2="40" y2="18" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
        {/* Tube 1 */}
        <rect x="12" y="8" width="6" height="34" rx="3" fill="#EC4899" fillOpacity="0.8" stroke="#0F172A" strokeWidth="1.5" />
        {/* Tube 2 */}
        <rect x="22" y="14" width="6" height="28" rx="3" fill="#10B981" fillOpacity="0.8" stroke="#0F172A" strokeWidth="1.5" />
        {/* Tube 3 */}
        <rect x="32" y="10" width="6" height="32" rx="3" fill="#F59E0B" fillOpacity="0.8" stroke="#0F172A" strokeWidth="1.5" />
      </g>

      {/* Orbit & Sparkles */}
      <ellipse cx="65" cy="45" rx="16" ry="6" transform="rotate(-20 65 45)" stroke="#60A5FA" strokeWidth="1.5" strokeDasharray="3 3" />
      <circle cx="75" cy="42" r="2.5" fill="#2563EB" />
      <polygon points="185,40 187,45 192,46 188,49 189,54 185,51 181,54 182,49 178,46 183,45" fill="#FBBF24" />
    </svg>
  );
}

// 2. Computer Labs Illustration
export function ComputerLabIllustration({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 150" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="compBg" x1="0" y1="0" x2="240" y2="150" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ECFDF5" />
          <stop offset="1" stopColor="#D1FAE5" />
        </linearGradient>
        <linearGradient id="codeGrad" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#059669" />
          <stop offset="1" stopColor="#10B981" />
        </linearGradient>
      </defs>

      <rect width="240" height="150" rx="16" fill="url(#compBg)" />
      <circle cx="120" cy="75" r="55" fill="#A7F3D0" fillOpacity="0.4" />

      {/* Desk */}
      <rect x="30" y="120" width="180" height="6" rx="3" fill="#94A3B8" />

      {/* Monitor Display */}
      <g transform="translate(75, 34)">
        {/* Screen Bezel */}
        <rect x="0" y="0" width="90" height="64" rx="8" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
        {/* Screen Glass */}
        <rect x="4" y="4" width="82" height="56" rx="5" fill="#0F172A" />
        {/* Code Window Header */}
        <circle cx="10" cy="10" r="2" fill="#EF4444" />
        <circle cx="16" cy="10" r="2" fill="#F59E0B" />
        <circle cx="22" cy="10" r="2" fill="#10B981" />
        {/* Code Lines */}
        <rect x="10" y="18" width="28" height="3" rx="1.5" fill="#38BDF8" />
        <rect x="42" y="18" width="20" height="3" rx="1.5" fill="#F472B6" />
        <rect x="14" y="26" width="46" height="3" rx="1.5" fill="#34D399" />
        <rect x="14" y="34" width="34" height="3" rx="1.5" fill="#FBBF24" />
        <rect x="10" y="42" width="22" height="3" rx="1.5" fill="#A78BFA" />
        <rect x="36" y="42" width="30" height="3" rx="1.5" fill="#38BDF8" />
        {/* Monitor Stand */}
        <path d="M38 64H52L56 78H34L38 64Z" fill="#64748B" />
        <rect x="30" y="78" width="30" height="5" rx="2" fill="#334155" />
      </g>

      {/* Keyboard & Mouse */}
      <rect x="80" y="117" width="50" height="4" rx="2" fill="#64748B" />
      <rect x="138" y="117" width="8" height="4" rx="2" fill="#64748B" />

      {/* Server Tower / Tech Icon on Side */}
      <g transform="translate(175, 55)">
        <rect x="0" y="0" width="22" height="65" rx="4" fill="#334155" />
        <circle cx="11" cy="12" r="3" fill="#10B981" />
        <line x1="5" y1="24" x2="17" y2="24" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
        <line x1="5" y1="32" x2="17" y2="32" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
        <line x1="5" y1="40" x2="17" y2="40" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
        <circle cx="11" cy="54" r="2" fill="#38BDF8" />
      </g>

      {/* Binary / Network Cloud */}
      <g transform="translate(38, 50)" fill="#10B981" fillOpacity="0.8">
        <text x="0" y="10" fontSize="10" fontFamily="monospace" fontWeight="bold">01</text>
        <text x="8" y="24" fontSize="10" fontFamily="monospace" fontWeight="bold">10</text>
        <text x="0" y="38" fontSize="10" fontFamily="monospace" fontWeight="bold">11</text>
      </g>
    </svg>
  );
}

// 3. Robotics Lab Illustration
export function RoboticsLabIllustration({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 150" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="botBg" x1="0" y1="0" x2="240" y2="150" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFBEB" />
          <stop offset="1" stopColor="#FEF3C7" />
        </linearGradient>
      </defs>

      <rect width="240" height="150" rx="16" fill="url(#botBg)" />
      <circle cx="120" cy="75" r="54" fill="#FDE68A" fillOpacity="0.5" />

      {/* Ground Line */}
      <rect x="35" y="122" width="170" height="5" rx="2.5" fill="#CBD5E1" />

      {/* Friendly Robot */}
      <g transform="translate(90, 32)">
        {/* Antenna */}
        <line x1="30" y1="12" x2="30" y2="2" stroke="#D97706" strokeWidth="3" strokeLinecap="round" />
        <circle cx="30" cy="2" r="4" fill="#F59E0B" />

        {/* Head */}
        <rect x="10" y="12" width="40" height="32" rx="10" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2.5" />
        {/* Eyes (Glowing Screen) */}
        <rect x="16" y="20" width="28" height="14" rx="5" fill="#0F172A" />
        <circle cx="23" cy="27" r="3" fill="#38BDF8" />
        <circle cx="37" cy="27" r="3" fill="#38BDF8" />

        {/* Neck */}
        <rect x="25" y="44" width="10" height="5" fill="#94A3B8" />

        {/* Torso */}
        <rect x="8" y="49" width="44" height="38" rx="8" fill="#2563EB" stroke="#1D4ED8" strokeWidth="2.5" />
        {/* Chest Display (Battery & Dial) */}
        <rect x="16" y="56" width="28" height="16" rx="4" fill="#1E293B" />
        <rect x="20" y="60" width="8" height="8" rx="1" fill="#10B981" />
        <rect x="31" y="62" width="9" height="4" rx="1" fill="#F59E0B" />

        {/* Arms */}
        <path d="M8 56C0 60 0 74 6 80" stroke="#3B82F6" strokeWidth="4" strokeLinecap="round" />
        <path d="M52 56C60 60 62 70 56 78" stroke="#3B82F6" strokeWidth="4" strokeLinecap="round" />
        <circle cx="56" cy="78" r="3" fill="#F59E0B" />

        {/* Tread/Wheels */}
        <rect x="12" y="87" width="36" height="8" rx="4" fill="#334155" />
        <circle cx="17" cy="91" r="2.5" fill="#94A3B8" />
        <circle cx="30" cy="91" r="2.5" fill="#94A3B8" />
        <circle cx="43" cy="91" r="2.5" fill="#94A3B8" />
      </g>

      {/* Rotating Gears on Left */}
      <g transform="translate(48, 55)">
        <circle cx="12" cy="12" r="10" stroke="#F59E0B" strokeWidth="4" strokeDasharray="5 3" />
        <circle cx="12" cy="12" r="4" fill="#D97706" />
      </g>
      <g transform="translate(62, 75)">
        <circle cx="8" cy="8" r="6" stroke="#3B82F6" strokeWidth="3" strokeDasharray="3 2" />
        <circle cx="8" cy="8" r="2" fill="#1D4ED8" />
      </g>

      {/* Microcontroller Board on Right */}
      <g transform="translate(162, 60)">
        <rect x="0" y="0" width="30" height="40" rx="3" fill="#047857" />
        <rect x="6" y="8" width="18" height="12" fill="#064E3B" />
        <circle cx="15" cy="14" r="3" fill="#FBBF24" />
        <circle cx="6" cy="30" r="1.5" fill="#A7F3D0" />
        <circle cx="12" cy="30" r="1.5" fill="#A7F3D0" />
        <circle cx="18" cy="30" r="1.5" fill="#A7F3D0" />
        <circle cx="24" cy="30" r="1.5" fill="#A7F3D0" />
      </g>
    </svg>
  );
}

// 4. Library Illustration
export function LibraryIllustration({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 150" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="libBg" x1="0" y1="0" x2="240" y2="150" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EEF2FF" />
          <stop offset="1" stopColor="#E0E7FF" />
        </linearGradient>
      </defs>

      <rect width="240" height="150" rx="16" fill="url(#libBg)" />
      <circle cx="120" cy="75" r="54" fill="#C7D2FE" fillOpacity="0.4" />

      {/* Desk */}
      <rect x="30" y="118" width="180" height="6" rx="3" fill="#94A3B8" />

      {/* Bookshelf Backdrop */}
      <g transform="translate(42, 28)">
        <rect x="0" y="0" width="156" height="50" rx="4" fill="#818CF8" fillOpacity="0.2" stroke="#6366F1" strokeWidth="1.5" />
        {/* Books on shelf */}
        <rect x="10" y="10" width="8" height="40" rx="2" fill="#4F46E5" />
        <rect x="20" y="14" width="7" height="36" rx="2" fill="#EC4899" />
        <rect x="29" y="8" width="9" height="42" rx="2" fill="#10B981" />
        <rect x="40" y="16" width="6" height="34" rx="2" fill="#F59E0B" />
        <rect x="48" y="12" width="8" height="38" rx="2" fill="#3B82F6" />
        <rect x="58" y="18" width="7" height="32" rx="2" fill="#6366F1" />
        {/* Tilted book */}
        <rect x="68" y="12" width="7" height="38" rx="2" transform="rotate(15 68 12)" fill="#EF4444" />
        <rect x="100" y="10" width="8" height="40" rx="2" fill="#059669" />
        <rect x="110" y="15" width="7" height="35" rx="2" fill="#FBBF24" />
        <rect x="120" y="8" width="10" height="42" rx="2" fill="#2563EB" />
        <rect x="132" y="12" width="8" height="38" rx="2" fill="#8B5CF6" />
      </g>

      {/* Open Center Book */}
      <g transform="translate(85, 80)">
        <path d="M35 15C22 8 8 10 0 14V34C8 30 22 28 35 35C48 28 62 30 70 34V14C62 10 48 8 35 15Z" fill="white" stroke="#4F46E5" strokeWidth="2.5" />
        {/* Page lines */}
        <line x1="8" y1="18" x2="28" y2="16" stroke="#94A3B8" strokeWidth="1.5" />
        <line x1="8" y1="23" x2="26" y2="21" stroke="#94A3B8" strokeWidth="1.5" />
        <line x1="8" y1="28" x2="24" y2="26" stroke="#94A3B8" strokeWidth="1.5" />
        <line x1="42" y1="16" x2="62" y2="18" stroke="#94A3B8" strokeWidth="1.5" />
        <line x1="44" y1="21" x2="62" y2="23" stroke="#94A3B8" strokeWidth="1.5" />
        <line x1="46" y1="26" x2="62" y2="28" stroke="#94A3B8" strokeWidth="1.5" />
        {/* Spine */}
        <line x1="35" y1="15" x2="35" y2="35" stroke="#4338CA" strokeWidth="2" />
      </g>

      {/* Desk Lamp on Left */}
      <g transform="translate(50, 72)">
        <path d="M12 46H24M18 46V22L28 10" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
        <path d="M22 6L36 14L30 20Z" fill="#F59E0B" />
        <polygon points="34,16 52,38 32,38" fill="#FEF08A" fillOpacity="0.5" />
      </g>
    </svg>
  );
}

// 5. Smart Classrooms Illustration
export function SmartClassroomIllustration({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 150" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="smartBg" x1="0" y1="0" x2="240" y2="150" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F0F9FF" />
          <stop offset="1" stopColor="#E0F2FE" />
        </linearGradient>
      </defs>

      <rect width="240" height="150" rx="16" fill="url(#smartBg)" />
      <circle cx="120" cy="75" r="54" fill="#BAE6FD" fillOpacity="0.4" />

      {/* Interactive Display / Smart Board */}
      <g transform="translate(55, 26)">
        {/* Frame */}
        <rect x="0" y="0" width="130" height="84" rx="10" fill="#0F172A" stroke="#0284C7" strokeWidth="2.5" />
        {/* Screen */}
        <rect x="5" y="5" width="120" height="74" rx="7" fill="#0369A1" />
        
        {/* Math & Growth Charts on Screen */}
        <path d="M15 62L40 45L65 52L90 28L115 36" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="40" cy="45" r="3" fill="#FDE047" />
        <circle cx="65" cy="52" r="3" fill="#FDE047" />
        <circle cx="90" cy="28" r="3" fill="#FDE047" />
        <circle cx="115" cy="36" r="3" fill="#FDE047" />

        {/* Formula text */}
        <text x="15" y="24" fill="white" fontSize="11" fontFamily="sans-serif" fontWeight="bold">E = mc²</text>
        <text x="80" y="24" fill="#A5F3FC" fontSize="10" fontFamily="sans-serif">πr²</text>

        {/* Digital Pointer Stylus */}
        <line x1="88" y1="62" x2="108" y2="42" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
        <circle cx="108" cy="42" r="2.5" fill="#EF4444" />
      </g>

      {/* Floor Stand */}
      <path d="M105 110L90 128M135 110L150 128" stroke="#475569" strokeWidth="3.5" strokeLinecap="round" />
      <rect x="115" y="110" width="10" height="14" fill="#334155" />
      <rect x="80" y="128" width="80" height="4" rx="2" fill="#1E293B" />

      {/* Floating Wi-Fi & Education Sparkles */}
      <path d="M30 40C36 34 46 34 52 40" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
      <path d="M35 45C38 42 44 42 47 45" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
      <circle cx="41" cy="50" r="1.5" fill="#0284C7" />
    </svg>
  );
}

// 6. Sports Complex Illustration
export function SportsIllustration({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 150" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="sportsBg" x1="0" y1="0" x2="240" y2="150" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FAF5FF" />
          <stop offset="1" stopColor="#F3E8FF" />
        </linearGradient>
      </defs>

      <rect width="240" height="150" rx="16" fill="url(#sportsBg)" />
      <circle cx="120" cy="75" r="54" fill="#E9D5FF" fillOpacity="0.4" />

      {/* Running Track Curves */}
      <path d="M20 125C70 110 170 110 220 125" stroke="#D8B4FE" strokeWidth="4" strokeLinecap="round" />
      <path d="M30 133C75 120 165 120 210 133" stroke="#C084FC" strokeWidth="2.5" strokeDasharray="6 4" strokeLinecap="round" />

      {/* Champion Golden Trophy in Center */}
      <g transform="translate(100, 32)">
        <path d="M12 10H28V36C28 42 22 46 20 46C18 46 12 42 12 36V10Z" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
        {/* Handles */}
        <path d="M12 14C6 14 4 24 12 28" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M28 14C34 14 36 24 28 28" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" />
        {/* Stem & Base */}
        <rect x="18" y="46" width="4" height="14" fill="#B45309" />
        <rect x="10" y="60" width="20" height="8" rx="2" fill="#78350F" />
        <polygon points="20,18 22,23 27,24 23,27 24,32 20,29 16,32 17,27 13,24 18,23" fill="white" />
      </g>

      {/* Football (Soccer) */}
      <g transform="translate(54, 76)">
        <circle cx="20" cy="20" r="18" fill="white" stroke="#1E293B" strokeWidth="2" />
        <polygon points="20,13 26,17 24,24 16,24 14,17" fill="#1E293B" />
        <line x1="20" y1="13" x2="20" y2="2" stroke="#1E293B" strokeWidth="1.5" />
        <line x1="26" y1="17" x2="36" y2="12" stroke="#1E293B" strokeWidth="1.5" />
        <line x1="24" y1="24" x2="32" y2="32" stroke="#1E293B" strokeWidth="1.5" />
        <line x1="16" y1="24" x2="8" y2="32" stroke="#1E293B" strokeWidth="1.5" />
        <line x1="14" y1="17" x2="4" y2="12" stroke="#1E293B" strokeWidth="1.5" />
      </g>

      {/* Basketball */}
      <g transform="translate(150, 72)">
        <circle cx="18" cy="18" r="16" fill="#EA580C" stroke="#9A3412" strokeWidth="2" />
        <path d="M2 18H34" stroke="#7C2D12" strokeWidth="1.5" />
        <path d="M18 2V34" stroke="#7C2D12" strokeWidth="1.5" />
        <path d="M6 8C14 14 14 22 6 28" stroke="#7C2D12" strokeWidth="1.5" fill="none" />
        <path d="M30 8C22 14 22 22 30 28" stroke="#7C2D12" strokeWidth="1.5" fill="none" />
      </g>
    </svg>
  );
}

// 7. Art & Music Studio Illustration
export function ArtMusicIllustration({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 150" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="artBg" x1="0" y1="0" x2="240" y2="150" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FDF2F8" />
          <stop offset="1" stopColor="#FCE7F3" />
        </linearGradient>
      </defs>

      <rect width="240" height="150" rx="16" fill="url(#artBg)" />
      <circle cx="120" cy="75" r="54" fill="#FBCFE8" fillOpacity="0.4" />

      {/* Artist Easel on Left */}
      <g transform="translate(48, 28)">
        <line x1="25" y1="10" x2="10" y2="95" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
        <line x1="25" y1="10" x2="40" y2="95" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
        <line x1="25" y1="10" x2="25" y2="95" stroke="#92400E" strokeWidth="2" strokeLinecap="round" />
        <rect x="8" y="60" width="34" height="4" rx="2" fill="#78350F" />
        {/* Canvas */}
        <rect x="6" y="24" width="38" height="36" rx="3" fill="white" stroke="#EC4899" strokeWidth="2" />
        {/* Artwork on Canvas (Sun & Mountain) */}
        <circle cx="18" cy="36" r="4" fill="#FBBF24" />
        <polygon points="12,54 24,42 38,54" fill="#F472B6" />
      </g>

      {/* Paint Palette with Colors */}
      <g transform="translate(100, 68)">
        <path d="M26 12C36 12 44 20 44 30C44 38 38 42 32 42C28 42 26 40 24 40C22 40 20 42 16 42C8 42 2 36 2 28C2 18 12 12 26 12Z" fill="#FDE047" stroke="#CA8A04" strokeWidth="2" />
        <circle cx="14" cy="24" r="3" fill="#EF4444" />
        <circle cx="22" cy="20" r="3" fill="#3B82F6" />
        <circle cx="30" cy="22" r="3" fill="#10B981" />
        <circle cx="34" cy="30" r="3" fill="#A855F7" />
        {/* Thumb Hole */}
        <circle cx="18" cy="34" r="3" fill="#FDF2F8" stroke="#CA8A04" strokeWidth="1.5" />
      </g>

      {/* Acoustic Guitar / Music on Right */}
      <g transform="translate(155, 35)">
        {/* Neck */}
        <rect x="18" y="4" width="6" height="34" rx="2" fill="#B45309" stroke="#78350F" strokeWidth="1.5" />
        {/* Tuning pegs */}
        <circle cx="16" cy="8" r="1.5" fill="#FBBF24" />
        <circle cx="26" cy="8" r="1.5" fill="#FBBF24" />
        {/* Body (Figure-8) */}
        <ellipse cx="21" cy="50" rx="14" ry="12" fill="#D97706" stroke="#92400E" strokeWidth="2" />
        <ellipse cx="21" cy="72" rx="18" ry="16" fill="#D97706" stroke="#92400E" strokeWidth="2" />
        {/* Sound Hole */}
        <circle cx="21" cy="62" r="5" fill="#78350F" />
      </g>

      {/* Musical Notes Floating */}
      <g fill="#EC4899">
        <path d="M125 35V25L135 22V32" stroke="#EC4899" strokeWidth="2" strokeLinecap="round" />
        <circle cx="123" cy="36" r="3" fill="#EC4899" />
        <circle cx="133" cy="33" r="3" fill="#EC4899" />
        <circle cx="198" cy="35" r="2.5" fill="#EC4899" />
        <path d="M200 35V26" stroke="#EC4899" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

// 8. Auditorium Illustration
export function AuditoriumIllustration({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 150" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="audBg" x1="0" y1="0" x2="240" y2="150" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F5F3FF" />
          <stop offset="1" stopColor="#EDE9FE" />
        </linearGradient>
        <linearGradient id="stageSpot" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#FEF08A" stopOpacity="0.6" />
          <stop offset="1" stopColor="#FEF08A" stopOpacity="0.05" />
        </linearGradient>
      </defs>

      <rect width="240" height="150" rx="16" fill="url(#audBg)" />
      <circle cx="120" cy="75" r="54" fill="#DDD6FE" fillOpacity="0.4" />

      {/* Spotlight Beams */}
      <polygon points="40,15 90,110 150,110 200,15" fill="url(#stageSpot)" />

      {/* Red Velvet Stage Curtains */}
      <path d="M20 18C45 28 45 65 30 100H20V18Z" fill="#DC2626" />
      <path d="M220 18C195 28 195 65 210 100H220V18Z" fill="#DC2626" />
      <path d="M20 18C80 32 160 32 220 18V24C160 38 80 38 20 24V18Z" fill="#B91C1C" />

      {/* Stage Floor */}
      <path d="M40 102H200L220 124H20L40 102Z" fill="#78350F" stroke="#92400E" strokeWidth="2" />

      {/* Podium with Microphone in Center */}
      <g transform="translate(108, 68)">
        <polygon points="4,10 20,10 18,34 6,34" fill="#475569" stroke="#1E293B" strokeWidth="1.5" />
        <line x1="12" y1="10" x2="12" y2="2" stroke="#94A3B8" strokeWidth="2" />
        <circle cx="12" cy="1" r="2.5" fill="#EF4444" />
      </g>

      {/* Auditorium Seating Rows in Foreground */}
      <path d="M30 134C70 128 170 128 210 134" stroke="#7C3AED" strokeWidth="5" strokeLinecap="round" />
      <path d="M45 142C80 137 160 137 195 142" stroke="#6D28D9" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

// 9. Transport (School Bus) Illustration
export function TransportIllustration({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 150" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="busBg" x1="0" y1="0" x2="240" y2="150" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFBEB" />
          <stop offset="1" stopColor="#FEF3C7" />
        </linearGradient>
      </defs>

      <rect width="240" height="150" rx="16" fill="url(#busBg)" />
      <circle cx="120" cy="75" r="54" fill="#FDE68A" fillOpacity="0.4" />

      {/* Road */}
      <rect x="20" y="118" width="200" height="10" rx="5" fill="#64748B" />
      <line x1="40" y1="123" x2="60" y2="123" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <line x1="80" y1="123" x2="100" y2="123" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <line x1="120" y1="123" x2="140" y2="123" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <line x1="160" y1="123" x2="180" y2="123" stroke="white" strokeWidth="2" strokeLinecap="round" />

      {/* School Bus */}
      <g transform="translate(50, 48)">
        {/* Bus Body */}
        <path d="M10 24C10 16 16 10 24 10H116C124 10 130 16 130 24V58H10V24Z" fill="#FBBF24" stroke="#D97706" strokeWidth="2.5" />
        {/* Black Stripe */}
        <rect x="10" y="42" width="120" height="5" fill="#1E293B" />
        <text x="32" y="40" fill="#1E293B" fontSize="8" fontFamily="sans-serif" fontWeight="900" letterSpacing="2">SCHOOL BUS</text>

        {/* Windows */}
        <rect x="18" y="16" width="18" height="16" rx="3" fill="#38BDF8" stroke="#0284C7" strokeWidth="1.5" />
        <rect x="42" y="16" width="18" height="16" rx="3" fill="#38BDF8" stroke="#0284C7" strokeWidth="1.5" />
        <rect x="66" y="16" width="18" height="16" rx="3" fill="#38BDF8" stroke="#0284C7" strokeWidth="1.5" />
        <rect x="90" y="16" width="18" height="16" rx="3" fill="#38BDF8" stroke="#0284C7" strokeWidth="1.5" />
        {/* Driver Windshield */}
        <path d="M114 16H124C126 16 128 18 128 20V32H114V16Z" fill="#38BDF8" stroke="#0284C7" strokeWidth="1.5" />

        {/* Headlight & Taillight */}
        <rect x="128" y="48" width="3" height="6" rx="1" fill="#FEF08A" />
        <rect x="8" y="48" width="3" height="6" rx="1" fill="#EF4444" />

        {/* Wheels */}
        <circle cx="36" cy="58" r="10" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
        <circle cx="36" cy="58" r="4" fill="#94A3B8" />

        <circle cx="106" cy="58" r="10" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
        <circle cx="106" cy="58" r="4" fill="#94A3B8" />
      </g>

      {/* Floating GPS Location Pin */}
      <g transform="translate(178, 25)">
        <path d="M12 2C6.5 2 2 6.5 2 12C2 19 12 28 12 28C12 28 22 19 22 12C22 6.5 17.5 2 12 2Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />
        <circle cx="12" cy="11" r="3.5" fill="white" />
      </g>
    </svg>
  );
}

// 10. Medical Infirmary Illustration
export function MedicalRoomIllustration({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 150" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="medBg" x1="0" y1="0" x2="240" y2="150" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F0FDFA" />
          <stop offset="1" stopColor="#CCFBF1" />
        </linearGradient>
      </defs>

      <rect width="240" height="150" rx="16" fill="url(#medBg)" />
      <circle cx="120" cy="75" r="54" fill="#99F6E4" fillOpacity="0.4" />

      {/* Desk */}
      <rect x="30" y="118" width="180" height="6" rx="3" fill="#94A3B8" />

      {/* First Aid Emergency Kit Box in Center */}
      <g transform="translate(90, 48)">
        <rect x="0" y="14" width="60" height="46" rx="8" fill="white" stroke="#0D9488" strokeWidth="2.5" />
        {/* Handle */}
        <path d="M20 14V8C20 5.5 22 4 25 4H35C38 4 40 5.5 40 8V14" stroke="#0D9488" strokeWidth="2.5" fill="none" />
        {/* Red Medical Cross */}
        <rect x="26" y="24" width="8" height="26" rx="2" fill="#EF4444" />
        <rect x="17" y="33" width="26" height="8" rx="2" fill="#EF4444" />
      </g>

      {/* Coiled Stethoscope on Left */}
      <g transform="translate(45, 62)">
        <path d="M12 10V28C12 38 28 38 28 28V10" stroke="#0F766E" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M20 38V48C20 54 30 54 30 48" stroke="#0F766E" strokeWidth="3" strokeLinecap="round" fill="none" />
        <circle cx="30" cy="46" r="4" fill="#14B8A6" stroke="#0F766E" strokeWidth="1.5" />
        <circle cx="12" cy="8" r="2.5" fill="#334155" />
        <circle cx="28" cy="8" r="2.5" fill="#334155" />
      </g>

      {/* Heartbeat ECG Wave & Thermometer on Right */}
      <g transform="translate(162, 50)">
        {/* ECG pulse line */}
        <path d="M0 35H12L16 22L22 46L28 30L34 38H48" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Capsule pill */}
        <g transform="translate(18, 6) rotate(35)">
          <rect x="0" y="0" width="10" height="18" rx="5" fill="#3B82F6" />
          <rect x="0" y="9" width="10" height="9" rx="5" fill="#F43F5E" />
        </g>
      </g>
    </svg>
  );
}

// 11. Principal's Desk & Educator Illustration
export function PrincipalDeskIllustration({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 280" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="prinBg" x1="0" y1="0" x2="240" y2="280" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F8FAFC" />
          <stop offset="1" stopColor="#E0E7FF" />
        </linearGradient>
      </defs>
      <rect width="240" height="280" rx="16" fill="url(#prinBg)" />
      
      {/* Background Bookshelf Pattern */}
      <rect x="20" y="30" width="200" height="12" rx="3" fill="#CBD5E1" />
      <rect x="30" y="16" width="12" height="14" rx="2" fill="#3B82F6" />
      <rect x="46" y="12" width="10" height="18" rx="2" fill="#10B981" />
      <rect x="60" y="18" width="14" height="12" rx="2" fill="#F59E0B" />
      <rect x="170" y="14" width="16" height="16" rx="2" fill="#8B5CF6" />
      <rect x="190" y="10" width="12" height="20" rx="2" fill="#EC4899" />

      {/* Graduation Cap / Academic Honor in background */}
      <g transform="translate(95, 45)">
        <polygon points="25,5 50,15 25,25 0,15" fill="#1E293B" />
        <rect x="12" y="20" width="26" height="10" rx="2" fill="#334155" />
        <line x1="50" y1="15" x2="52" y2="28" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
        <circle cx="52" cy="29" r="2" fill="#F59E0B" />
      </g>

      {/* Distinguished Educator Avatar Silhouette */}
      <g transform="translate(60, 90)">
        <circle cx="60" cy="40" r="32" fill="#BFDBFE" />
        {/* Head */}
        <circle cx="60" cy="40" r="24" fill="#3B82F6" />
        {/* Glasses */}
        <circle cx="53" cy="38" r="6" stroke="white" strokeWidth="2" fill="none" />
        <circle cx="67" cy="38" r="6" stroke="white" strokeWidth="2" fill="none" />
        <line x1="59" y1="38" x2="61" y2="38" stroke="white" strokeWidth="2" />
        {/* Smile */}
        <path d="M55 48Q60 52 65 48" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
        {/* Blazer & Collar */}
        <path d="M20 110C20 85 40 76 60 76C80 76 100 85 100 110V120H20V110Z" fill="#1E3A8A" />
        <polygon points="60,76 50,96 60,116 70,96" fill="#F8FAFC" />
        <polygon points="60,86 56,110 60,116 64,110" fill="#EF4444" />
      </g>

      {/* Desk with Nameplate */}
      <rect x="25" y="210" width="190" height="12" rx="3" fill="#94A3B8" />
      <g transform="translate(80, 222)">
        <polygon points="10,0 70,0 75,20 5,20" fill="#D97706" />
        <rect x="14" y="4" width="52" height="12" rx="1" fill="#FEF3C7" />
        <text x="20" y="13" fill="#92400E" fontSize="6.5" fontFamily="sans-serif" fontWeight="bold">PRINCIPAL</text>
      </g>
    </svg>
  );
}

// 12. School Campus & Building Illustration
export function SchoolCampusIllustration({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#E0F2FE" />
          <stop offset="1" stopColor="#BAE6FD" />
        </linearGradient>
      </defs>
      <rect width="400" height="240" rx="16" fill="url(#skyGrad)" />
      
      {/* Sun & Clouds */}
      <circle cx="340" cy="50" r="28" fill="#FDE047" fillOpacity="0.8" />
      <ellipse cx="80" cy="45" rx="30" ry="14" fill="white" fillOpacity="0.9" />
      <ellipse cx="105" cy="40" rx="20" ry="12" fill="white" fillOpacity="0.9" />

      {/* Green Ground / Lawn */}
      <rect x="0" y="190" width="400" height="50" fill="#22C55E" />
      <ellipse cx="200" cy="205" rx="220" ry="30" fill="#16A34A" />

      {/* Main School Building */}
      <g transform="translate(80, 70)">
        {/* Central Tower */}
        <rect x="80" y="10" width="80" height="120" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
        {/* Triangular Pediment */}
        <polygon points="120, -15 70, 15 170, 15" fill="#1E3A8A" />
        {/* Clock */}
        <circle cx="120" cy="35" r="14" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
        <line x1="120" y1="35" x2="120" y2="27" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
        <line x1="120" y1="35" x2="126" y2="35" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
        {/* School Entrance Doors */}
        <rect x="105" y="95" width="30" height="35" rx="4" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" />
        <line x1="120" y1="95" x2="120" y2="130" stroke="white" strokeWidth="2" />

        {/* Left Wing */}
        <rect x="0" y="40" width="80" height="90" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
        {/* Left Wing Windows */}
        <rect x="12" y="55" width="18" height="20" rx="3" fill="#60A5FA" />
        <rect x="45" y="55" width="18" height="20" rx="3" fill="#60A5FA" />
        <rect x="12" y="90" width="18" height="20" rx="3" fill="#60A5FA" />
        <rect x="45" y="90" width="18" height="20" rx="3" fill="#60A5FA" />

        {/* Right Wing */}
        <rect x="160" y="40" width="80" height="90" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
        {/* Right Wing Windows */}
        <rect x="175" y="55" width="18" height="20" rx="3" fill="#60A5FA" />
        <rect x="208" y="55" width="18" height="20" rx="3" fill="#60A5FA" />
        <rect x="175" y="90" width="18" height="20" rx="3" fill="#60A5FA" />
        <rect x="208" y="90" width="18" height="20" rx="3" fill="#60A5FA" />

        {/* Indian Flag on roof */}
        <line x1="120" y1="-15" x2="120" y2="-45" stroke="#64748B" strokeWidth="3" />
        <rect x="120" y="-45" width="22" height="6" fill="#F97316" />
        <rect x="120" y="-39" width="22" height="6" fill="#FFFFFF" />
        <circle cx="131" cy="-36" r="2.5" fill="#1D4ED8" />
        <rect x="120" y="-33" width="22" height="6" fill="#16A34A" />
      </g>
    </svg>
  );
}

