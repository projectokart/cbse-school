'use client';

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import {
  MapPin, Filter, ChevronRight, ChevronLeft, ChevronDown, Search, CheckCircle2,
  Compass, Star, Scale, ArrowLeftRight, Languages, Heart, Share2, X, Check, Building2, Users, Award, Layout,
  HelpCircle, Home, Map, Navigation, BookOpen, Briefcase, Shield, FileText, Building,
  Landmark, Castle, Hotel, Banknote, GraduationCap, FlaskConical, Monitor, Tv, Library,
  Wrench, Bot, Mic, Calculator, Glasses, Laptop, Trees, Gamepad2, Waves, Activity,
  Trophy, Target, CircleDashed, Dumbbell, HeartHandshake, Swords, Footprints, Cctv, Wind,
  Wifi, Bus, Bed, Utensils, Cross, Accessibility, Sun, Droplet, Palette, Music,
  Clapperboard, Medal, Leaf, Camera, UsersRound, Tent, ArrowUpDown, SlidersHorizontal,
  LayoutGrid, List, Columns3, Columns2, Lock, ShieldAlert, ShieldCheck, LogIn, Key, AlertCircle,
  RefreshCw, Loader2, Globe, ArrowRight, PlusCircle, Minus, Maximize2, Minimize2, ChevronUp, Menu, MoreVertical, Plus
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { SchoolsDirectoryResult } from '@/integrations/supabase/schoolsDirectoryDb';
import { SchoolRecord } from '@/data/schoolFinderData';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { renderFacilityIcon, renderCategoryHeaderIcon, renderBoardLogo, renderClassIcon, renderSchoolTypeIcon, renderSpecialCategoryIcon } from './FacilityIcons';
import AddSchoolModal from './AddSchoolModal';
import ClaimSchoolModal from './ClaimSchoolModal';
import SchoolFilterSheet from './SchoolFilterSheet';
import { PLACEHOLDER_EMPTY_IMAGE } from '@/components/schools/template/SchoolTemplateContext';

const getSafeSchoolImage = (img?: string) => {
  if (
    !img ||
    img.includes('default-school-campus') ||
    img.includes('default-campus') ||
    img.includes('hero-school-') ||
    img.includes('edunova-hero') ||
    img.includes('unsplash.com')
  ) {
    return PLACEHOLDER_EMPTY_IMAGE;
  }
  return img;
};

const SchoolFinderMap = dynamic(() => import('@/components/school-finder/SchoolFinderMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] flex items-center justify-center bg-slate-50 rounded-3xl border border-slate-200">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="w-8 h-8 animate-spin text-[#005689]" />
        <span className="text-xs font-bold text-slate-600">Loading Interactive Map...</span>
      </div>
    </div>
  ),
});

// Google Material Symbols 'balance' icon (matches official Google Material Symbols vector & two-pan balance)
const GoogleBalanceIcon = ({ size = 14, className = "" }: { size?: number; className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 -960 960 960" 
    fill="currentColor" 
    className={className}
    aria-hidden="true"
  >
    <path d="m260-520 74-148q-23-6-46-8.5T240-679q-25 0-48.5 3t-47.5 9l76 147Zm220 360v-80h-80v-80h80v-434q-32-9-58-29.5T380-800q0-42 29-71t71-29q42 0 71 29t29 71q0 31-26 51.5T476-720v434h84v80h-80v80h-80Zm-280-80q-42 0-71-29t-29-71q0-28 14-52t38-36l108-212h160l108 212q24 12 38 36t14 52q0 42-29 71t-71 29H200Zm480 0q-42 0-71-29t-29-71q0-28 14-52t38-36l108-212h160l108 212q24 12 38 36t14 52q0 42-29 71t-71 29H680Z"/>
  </svg>
);

// Toggle for Compare Button (Default false/hidden as requested; logic & Google balance icon preserved)
const SHOW_COMPARE_BUTTON = false;

interface Props {
  initialData: SchoolsDirectoryResult;
}

const HERO_IMAGES = [
  '/images/schools/hero-school-1.png',
  '/images/schools/hero-school-2.jpg',
  '/images/schools/hero-school-3.jpg',
  '/images/schools/hero-school-4.png',
];

const POPULAR_CITIES = [
  { name: 'Delhi', query: 'Delhi', icon: 'https://img.icons8.com/color/48/india-gate.png' },
  { name: 'Gurugram', query: 'Gurugram', icon: 'https://img.icons8.com/color/48/skyscrapers.png' },
  { name: 'Noida', query: 'Noida', icon: 'https://img.icons8.com/color/48/city-buildings.png' },
  { name: 'Faridabad', query: 'Faridabad', icon: 'https://img.icons8.com/color/48/company.png' },
  { name: 'Ghaziabad', query: 'Ghaziabad', icon: 'https://img.icons8.com/color/48/apartment.png' },
  { name: 'Agra', query: 'Agra', icon: 'https://img.icons8.com/color/48/taj-mahal.png' },
  { name: 'Meerut', query: 'Meerut', icon: 'https://img.icons8.com/color/48/marker.png' },
  { name: 'Jaipur', query: 'Jaipur', icon: 'https://img.icons8.com/color/48/hawa-mahal.png' },
  { name: 'Chandigarh', query: 'Chandigarh', icon: 'https://img.icons8.com/color/48/city.png' },
  { name: 'Lucknow', query: 'Lucknow', icon: 'https://img.icons8.com/color/48/landmark.png' },
];

const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'Delhi': { lat: 28.6139, lng: 77.2090 },
  'Delhi NCR': { lat: 28.6139, lng: 77.2090 },
  'Gurugram': { lat: 28.4595, lng: 77.0266 },
  'Gurgaon': { lat: 28.4595, lng: 77.0266 },
  'Noida': { lat: 28.5355, lng: 77.3910 },
  'Faridabad': { lat: 28.4089, lng: 77.3178 },
  'Ghaziabad': { lat: 28.6692, lng: 77.4538 },
  'Agra': { lat: 27.1767, lng: 78.0081 },
  'Meerut': { lat: 28.9845, lng: 77.7064 },
  'Jaipur': { lat: 26.9124, lng: 75.7873 },
  'Chandigarh': { lat: 30.7333, lng: 76.7794 },
  'Lucknow': { lat: 26.8467, lng: 80.9462 },
};

import { FACILITY_CATEGORIES } from './FacilityData';

// Helper to extract clean school name (everything before the first comma)
export function getCleanSchoolName(rawName: string | null | undefined): string {
  if (!rawName) return 'School';
  const trimmed = String(rawName).trim();
  if (trimmed.includes(',')) {
    return trimmed.split(',')[0].trim() || trimmed;
  }
  return trimmed;
}

// Helper to format clean card location (Locality, District, State)
export function formatCardLocation(school: SchoolRecord): string {
  let loc = (school.village_ward || school.locality || '').trim();
  if (
    !loc ||
    loc.toLowerCase() === 'main ward' ||
    loc.toLowerCase() === 'main' ||
    loc.toLowerCase() === 'null'
  ) {
    const raw = (school as any).raw_school_name || school.school_name || '';
    if (raw.includes(',')) {
      loc = raw.split(',').slice(1).join(', ').trim();
    } else {
      loc = '';
    }
  }

  const dist = (school.district_name || school.city || '').trim();
  const st = (school.state_name || school.state || '').trim();

  let cleanDist = dist
    ? dist.toLowerCase().split(/\s+/).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    : '';
  let cleanState = st
    ? st.toLowerCase().split(/\s+/).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    : '';

  if (cleanDist.toLowerCase() === 'east' && cleanState.toLowerCase().includes('delhi')) {
    cleanDist = 'East Delhi';
  } else if (cleanDist.toLowerCase() === 'west' && cleanState.toLowerCase().includes('delhi')) {
    cleanDist = 'West Delhi';
  } else if (cleanDist.toLowerCase() === 'north' && cleanState.toLowerCase().includes('delhi')) {
    cleanDist = 'North Delhi';
  } else if (cleanDist.toLowerCase() === 'south' && cleanState.toLowerCase().includes('delhi')) {
    cleanDist = 'South Delhi';
  } else if (cleanDist.toLowerCase() === 'central' && cleanState.toLowerCase().includes('delhi')) {
    cleanDist = 'Central Delhi';
  }

  const parts: string[] = [];
  if (loc) {
    const cleanLoc = loc
      .replace(new RegExp(`,?\\s*${cleanState}$`, 'i'), '')
      .replace(new RegExp(`,?\\s*${cleanDist}$`, 'i'), '')
      .trim();
    if (cleanLoc && cleanLoc.toLowerCase() !== cleanDist.toLowerCase()) {
      parts.push(cleanLoc);
    }
  }

  if (cleanDist) parts.push(cleanDist);
  if (cleanState && cleanState.toLowerCase() !== cleanDist.toLowerCase()) {
    parts.push(cleanState);
  }

  return parts.join(', ') || (cleanDist ? `${cleanDist}, ${cleanState}` : 'East Delhi, Delhi');
}

export default function SchoolsDirectoryClient({ initialData }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const query = initialData.query;

  const [searchTerm, setSearchTerm] = useState('');
  const [searchMode, setSearchMode] = useState<'text' | 'near_me'>('text');
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileCityDropdownOpen, setIsMobileCityDropdownOpen] = useState(false);
  
  const [isBoardDropdownOpen, setIsBoardDropdownOpen] = useState(false);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const [selectedBoard, setSelectedBoard] = useState(query.board || 'all');
  const [selectedResidential, setSelectedResidential] = useState(query.residential || 'all');
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [selectedSchoolTypes, setSelectedSchoolTypes] = useState<string[]>([]);
  const [selectedSpecialCategories, setSelectedSpecialCategories] = useState<string[]>([]);
  const [onlyAtl, setOnlyAtl] = useState(query.facility?.includes('Atal Tinkering') || false);
  const [sortBy, setSortBy] = useState(query.sortBy || 'popularity_desc');
  const [feeMax, setFeeMax] = useState(1000000);
  const [studentMax, setStudentMax] = useState(5000);
  const [isStateModalOpen, setIsStateModalOpen] = useState(false);
  const [selectedStateBoard, setSelectedStateBoard] = useState<string | null>(null);
  const [stateSearchQuery, setStateSearchQuery] = useState('');

  // Interactive state
  const [likedSchoolIds, setLikedSchoolIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem('cseel_liked_school_ids');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [likesCounts, setLikesCounts] = useState<Record<string, number>>({});
  const [compareList, setCompareList] = useState<SchoolRecord[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [copiedToastId, setCopiedToastId] = useState<string | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  
  // View mode supports 2 Cols, 3 Cols, Compact, and Map
  // Initialized synchronously from URL param or localStorage to eliminate flash/layout shift on refresh
  const [viewMode, setViewMode] = useState<'grid' | 'grid3' | 'compact' | 'map'>(() => {
    if (typeof window !== 'undefined') {
      try {
        const paramView = new URLSearchParams(window.location.search).get('view');
        if (paramView === 'map' || paramView === 'grid' || paramView === 'grid3' || paramView === 'compact') {
          return paramView as 'grid' | 'grid3' | 'compact' | 'map';
        }
        const savedMode = localStorage.getItem('cseel_school_view_mode') as 'grid' | 'grid3' | 'compact' | 'map' | null;
        if (savedMode === 'map' || savedMode === 'grid' || savedMode === 'grid3' || savedMode === 'compact') {
          return savedMode;
        }
      } catch {
        // Ignore storage errors in restricted contexts
      }
    }
    return 'compact';
  });

  // Map state
  const [mapSelectedSchool, setMapSelectedSchool] = useState<SchoolRecord | null>(null);
  const [googleMapModalSchool, setGoogleMapModalSchool] = useState<SchoolRecord | null>(null);
  const modalMapContainerRef = useRef<HTMLDivElement | null>(null);
  const modalMapInstanceRef = useRef<any>(null);

  // Initialize interactive Leaflet map inside preview modal (never blocked by X-Frame-Options)
  useEffect(() => {
    if (!googleMapModalSchool || !modalMapContainerRef.current) return;

    const lat = Number(googleMapModalSchool.lat) || 28.4595;
    const lng = Number(googleMapModalSchool.lng) || 77.0266;

    let isMounted = true;

    import('leaflet').then((leafletModule) => {
      if (!isMounted || !modalMapContainerRef.current) return;
      const L = (leafletModule as any).default || leafletModule;

      if (modalMapInstanceRef.current) {
        modalMapInstanceRef.current.remove();
        modalMapInstanceRef.current = null;
      }

      const map = L.map(modalMapContainerRef.current, {
        center: [lat, lng],
        zoom: 15,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Custom pulsing pin
      const customPin = L.divIcon({
        className: 'custom-school-map-pin',
        html: `
          <div style="position: relative; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; width: 38px; height: 38px; border-radius: 50%; background: rgba(0, 111, 204, 0.25); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="position: absolute; width: 28px; height: 28px; border-radius: 50%; background: #005689; border: 2.5px solid #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
          </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 19],
        popupAnchor: [0, -16],
      });

      const marker = L.marker([lat, lng], { icon: customPin }).addTo(map);
      marker.bindPopup(`
        <div style="font-family: system-ui, sans-serif; min-width: 180px; padding: 4px;">
          <b style="color: #003c6e; font-size: 13px;">${getCleanSchoolName(googleMapModalSchool.school_name || googleMapModalSchool.name)}</b>
          <div style="font-size: 11px; color: #64748b; margin-top: 2px;">${formatCardLocation(googleMapModalSchool)}</div>
          <div style="font-size: 11px; color: #059669; font-weight: bold; margin-top: 4px;">★ Verified Campus</div>
        </div>
      `).openPopup();

      modalMapInstanceRef.current = map;
      setTimeout(() => map.invalidateSize(), 150);
    }).catch((err) => console.warn('Modal map leaflet load error:', err));

    return () => {
      isMounted = false;
      if (modalMapInstanceRef.current) {
        modalMapInstanceRef.current.remove();
        modalMapInstanceRef.current = null;
      }
    };
  }, [googleMapModalSchool]);

  const [mapRadiusKm, setMapRadiusKm] = useState<number>(5);
  const [searchCenter, setSearchCenter] = useState<{ lat: number; lng: number }>({ lat: 28.1846, lng: 77.4105 }); // Default to detected live area (Palwal/Delhi NCR)
  const [mapFocus, setMapFocus] = useState<{ lat: number; lng: number; zoom?: number; timestamp: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Map display, drawer and pagination states
  const [mapDisplayMode, setMapDisplayMode] = useState<'page' | 'accumulate' | 'all_dots'>('page');
  const [accumulatedSchools, setAccumulatedSchools] = useState<SchoolRecord[]>([]);
  const [allSchoolsMapPoints, setAllSchoolsMapPoints] = useState<SchoolRecord[]>([]);
  const [isMapSheetMinimized, setIsMapSheetMinimized] = useState<boolean>(false);
  const [isMapSheetWide, setIsMapSheetWide] = useState<boolean>(false);
  const [isMapSheetHidden, setIsMapSheetHidden] = useState<boolean>(false);
  const [isMapFullscreen, setIsMapFullscreen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [mobileSheetState, setMobileSheetState] = useState<'peek' | 'half' | 'full'>('half');
  const [mapListSearch, setMapListSearch] = useState<string>('');

  const [navBottomOffset, setNavBottomOffset] = useState<number>(99);

  // Dynamically calculate navbar bottom so sidebar is always strictly attached without hiding under navbar
  useEffect(() => {
    const updateOffset = () => {
      if (isFullscreen || isMapFullscreen) {
        setNavBottomOffset(0);
        return;
      }
      const navbar = document.getElementById('site-navbar');
      if (navbar) {
        const rect = navbar.getBoundingClientRect();
        setNavBottomOffset(Math.max(0, Math.round(rect.bottom)));
      } else {
        setNavBottomOffset(99);
      }
    };

    updateOffset();
    window.addEventListener('scroll', updateOffset, { passive: true });
    window.addEventListener('resize', updateOffset, { passive: true });
    return () => {
      window.removeEventListener('scroll', updateOffset);
      window.removeEventListener('resize', updateOffset);
    };
  }, [isFullscreen, isMapFullscreen]);

  // Handle ESC key to exit fullscreen mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullscreen || isMapFullscreen) {
          setIsFullscreen(false);
          setIsMapFullscreen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, isMapFullscreen]);

  // ── Page-Based Pagination (Strictly Max 25 Schools Per Page) & Map +25 Point Accumulation ──
  const [allLoadedSchools, setAllLoadedSchools] = useState<SchoolRecord[]>((initialData.schools || []).slice(0, 25));
  const [currentPage, setCurrentPage] = useState<number>(initialData.currentPage || 1);
  const [totalPages, setTotalPages] = useState<number>(
    initialData.totalPages || Math.max(1, Math.ceil((initialData.totalCount || 0) / 25))
  );
  const [mapLoadedPage, setMapLoadedPage] = useState<number>(initialData.currentPage || 1);
  const [totalSchoolsCount, setTotalSchoolsCount] = useState<number>(initialData.totalCount || 0);
  const [hasMoreSchools, setHasMoreSchools] = useState<boolean>(
    (initialData.currentPage || 1) < (initialData.totalPages || Math.max(1, Math.ceil((initialData.totalCount || 0) / 25)))
  );
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  // Sync with initialData whenever user triggers a backend filter or SSR navigation
  useEffect(() => {
    const pageSchools = (initialData.schools || []).slice(0, 25);
    const calcTotalPages = initialData.totalPages || Math.max(1, Math.ceil((initialData.totalCount || 0) / 25));
    const curPage = initialData.currentPage || 1;
    setAllLoadedSchools(pageSchools);
    setCurrentPage(curPage);
    setTotalPages(calcTotalPages);
    setMapLoadedPage(curPage);
    setTotalSchoolsCount(initialData.totalCount || 0);
    setHasMoreSchools(curPage < calcTotalPages);
    setAccumulatedSchools(pageSchools);
  }, [initialData.schools, initialData.currentPage, initialData.totalCount, initialData.totalPages]);

  // Load next 25 points for Map View accumulation (+25 points per click)
  const loadNextBatch = useCallback(async () => {
    if (isLoadingMore || !hasMoreSchools) return;
    setIsLoadingMore(true);
    try {
      const nextPage = mapLoadedPage + 1;
      const params = new URLSearchParams(searchParams ? searchParams.toString() : '');
      params.set('page', String(nextPage));
      params.set('limit', '25');
      const res = await fetch(`/api/schools-directory?${params.toString()}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.schools)) {
        const batch25 = data.schools.slice(0, 25);
        setMapDisplayMode('accumulate');
        setAccumulatedSchools((prev) => {
          const base = prev.length > 0 ? prev : allLoadedSchools;
          const existingKeys = new Set(base.map((s) => String(s.udise_code || s.school_id || s.id)));
          const uniqueNew = batch25.filter((s: any) => !existingKeys.has(String(s.udise_code || s.school_id || s.id)));
          return [...base, ...uniqueNew];
        });
        setMapLoadedPage(nextPage);
        const calcTotal = data.totalPages || Math.max(1, Math.ceil((data.totalCount || totalSchoolsCount) / 25));
        setHasMoreSchools(nextPage < calcTotal);
        if (data.totalCount) setTotalSchoolsCount(data.totalCount);
        if (data.totalPages) setTotalPages(data.totalPages);
      }
    } catch (err) {
      console.warn('Failed to load next 25 map points:', err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMoreSchools, mapLoadedPage, searchParams, allLoadedSchools, totalSchoolsCount]);

  // Fetch all schools map points once when user activates all_dots mode
  useEffect(() => {
    if (mapDisplayMode === 'all_dots' && allSchoolsMapPoints.length === 0) {
      fetch('/api/schools-map-points')
        .then((res) => res.json())
        .then((json) => {
          if (json.success && json.points) {
            setAllSchoolsMapPoints(json.points);
          }
        })
        .catch((err) => console.warn('Failed to load all school map points:', err));
    }
  }, [mapDisplayMode, allSchoolsMapPoints.length]);

  // Auto-detect user's high-precision live GPS location on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          if (latitude && longitude) {
            setSearchCenter({ lat: latitude, lng: longitude });
            setMapFocus({ lat: latitude, lng: longitude, zoom: 14, timestamp: Date.now() });
          }
        },
        () => {
          // Fallback to first school coords only if user denies location permission
          const firstWithCoords = initialData.schools.find(s => s.lat && s.lng && !isNaN(s.lat) && !isNaN(s.lng) && s.lat > 5);
          if (firstWithCoords && firstWithCoords.lat && firstWithCoords.lng) {
            setSearchCenter({ lat: firstWithCoords.lat, lng: firstWithCoords.lng });
          }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  }, []);

  // Memoized GPS callbacks to ensure child Map doesn't drop persistent layers
  const handleLocationChange = useCallback((lat: number, lng: number) => {
    setSearchCenter({ lat, lng });
  }, []);

  const handleLocateMe = useCallback(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setSearchCenter({ lat: latitude, lng: longitude });
          setMapFocus({ lat: latitude, lng: longitude, zoom: 15, timestamp: Date.now() });
          setIsLocating(false);
        },
        (err) => {
          console.warn('GPS location error:', err);
          setIsLocating(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 12000,
          maximumAge: 0,
        }
      );
    }
  }, []);

  // ── Access Control: Logged-in users immediately get verified access ───────
  const { user, loading: authLoading, isVerified, signInWithGoogle, verifyUser } = useAuth();
  const [googleLoading, setGoogleLoading] = useState(false);

  // Admin detection (super_admin / admin login session - only when ?admin=true or explicitly activated)
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return new URLSearchParams(window.location.search).get('admin') === 'true';
    } catch {
      return false;
    }
  });

  // Admin switch: is school listing enabled?
  const [isListingEnabledByAdmin, setIsListingEnabledByAdmin] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    try {
      const stored = localStorage.getItem('cseel_schools_listing_enabled');
      return stored !== null ? stored === 'true' : true;
    } catch {
      return true;
    }
  });

  // Simulation mode for admin testing: 'normal' | 'simulate_public' | 'simulate_unverified'
  const [adminSimulateMode, setAdminSimulateMode] = useState<'normal' | 'simulate_public' | 'simulate_unverified'>('normal');

  const effectiveUser = adminSimulateMode === 'simulate_public' ? null : user;
  
  // Logged-in users (Google / Email) are immediately verified unless admin simulates otherwise
  const effectiveIsVerified = adminSimulateMode === 'simulate_unverified'
    ? false
    : Boolean(effectiveUser);
  const effectiveListingEnabled = isListingEnabledByAdmin;

  // Access rules: Open directory browsing for parents and students by default
  const isGuest = adminSimulateMode === 'simulate_public';
  const isListingDisabled = !authLoading && Boolean(effectiveUser) && !effectiveListingEnabled;
  const isUserUnverified = adminSimulateMode === 'simulate_unverified';
  const canViewSchools = !isGuest && !isListingDisabled && !isUserUnverified;

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await signInWithGoogle('/schools');
      if (error) {
        alert(error.message || 'Google sign-in failed');
        setGoogleLoading(false);
      }
    } catch (err: any) {
      alert(err?.message || 'Google sign-in failed');
      setGoogleLoading(false);
    }
  };

  // Persist viewMode in localStorage across page refreshes
  useEffect(() => {
    try {
      const savedMode = localStorage.getItem('cseel_school_view_mode') as 'grid' | 'grid3' | 'compact' | 'map' | null;
      if (savedMode && (savedMode === 'grid' || savedMode === 'grid3' || savedMode === 'compact' || savedMode === 'map')) {
        setViewMode(savedMode);
      }
    } catch {
      // Ignore storage errors in SSR or restricted environments
    }
  }, []);

  const handleViewModeChange = (mode: 'grid' | 'grid3' | 'compact' | 'map') => {
    setViewMode(mode);
    try {
      localStorage.setItem('cseel_school_view_mode', mode);
    } catch {
      // Ignore storage errors
    }
  };
  
  // Dynamic counts for filters
  const boardCounts = useMemo(() => {
    const counts = { 'CBSE': 0, 'ICSE': 0, 'State Board': 0 };
    initialData.schools.forEach(s => {
      const boardStr = (s.board || s.board_secondary_10th || '').toUpperCase();
      if (boardStr.includes('CBSE')) counts['CBSE']++;
      if (boardStr.includes('ICSE')) counts['ICSE']++;
      if (boardStr.includes('STATE')) counts['State Board']++;
    });
    return counts;
  }, [initialData.schools]);

  const formatCounts = useMemo(() => {
    const counts = { boarding: 0, day: 0 };
    initialData.schools.forEach(s => {
      const typeStr = (s.school_category || '').toLowerCase();
      if (typeStr.includes('boarding') || typeStr.includes('residential')) counts.boarding++;
      else counts.day++;
    });
    return counts;
  }, [initialData.schools]);
  
  // Modal States for Add School & Claim School
  const [isAddSchoolModalOpen, setIsAddSchoolModalOpen] = useState(false);
  const [isAddSchoolExpanded, setIsAddSchoolExpanded] = useState(false);
  const [claimModalData, setClaimModalData] = useState<{
    isOpen: boolean;
    schoolName: string;
    udiseCode: string;
  }>({
    isOpen: false,
    schoolName: '',
    udiseCode: '',
  });
  
  // Add School / Profile Button Handler
  const handleAddSchoolClick = () => {
    setIsAddSchoolModalOpen(true);
  };

  // Hero Carousel & Minimized state
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [isHeroMinimized, setIsHeroMinimized] = useState(false);

  // Filter Sidebar Minimized state (Desktop) - Closed / Minimized by default
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

// Haversine Distance Calculation (Km)
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 99999;
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

  // Database-driven cities & localities with live school counts
  const dbCitiesList = useMemo(() => {
    const normalizeQuery = (raw: string) => {
      const q = raw.toLowerCase().trim();
      if (q === 'delhi ncr' || q === 'new delhi' || q === 'ncr') return 'delhi';
      if (q === 'gurgaon') return 'gurugram';
      return q;
    };

    const matchesCity = (s: SchoolRecord, cityQuery: string) => {
      const q = normalizeQuery(cityQuery);
      const haystack = [
        s.school_name || s.name || '',
        s.address || '',
        s.locality || '',
        s.village_ward || '',
        s.block_name || '',
        s.district_name || s.city || '',
        s.state_name || s.state || '',
        formatCardLocation(s),
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    };

    return POPULAR_CITIES.map((c) => {
      const count = allLoadedSchools.filter((s) => matchesCity(s, c.query || c.name)).length;
      return {
        ...c,
        count,
      };
    });
  }, [allLoadedSchools]);

  const displayedSchools = useMemo(() => {
    // 1. Calculate distance from searchCenter for every loaded school in local memory
    let list = allLoadedSchools.map((s) => {
      const schoolLat = s.lat || s.latitude;
      const schoolLng = s.lng || s.longitude;
      const dist =
        schoolLat && schoolLng && searchCenter.lat && searchCenter.lng
          ? calculateDistanceKm(searchCenter.lat, searchCenter.lng, schoolLat, schoolLng)
          : undefined;
      return {
        ...s,
        lat: schoolLat,
        lng: schoolLng,
        distance: dist,
      };
    });

    // 2. Text Search Filtering (In-Memory across all loaded schools, normalizing Delhi NCR -> Delhi)
    if (searchTerm.trim() && searchMode === 'text') {
      const rawQ = searchTerm.toLowerCase().trim();
      let q = rawQ;
      if (rawQ === 'delhi ncr' || rawQ === 'new delhi' || rawQ === 'ncr') {
        q = 'delhi';
      } else if (rawQ === 'east delhi') {
        q = 'east';
      }

      list = list.filter((s) => {
        const haystack = [
          s.school_name || s.name || '',
          s.address || '',
          s.locality || '',
          s.village_ward || '',
          s.block_name || '',
          s.district_name || s.city || '',
          s.state_name || s.state || '',
          s.pincode || '',
          s.udise_code || '',
          s.board || s.board_secondary_10th || '',
          formatCardLocation(s),
        ]
          .join(' ')
          .toLowerCase();
        return haystack.includes(q) || haystack.includes(rawQ);
      });
    } else if (searchMode === 'near_me' || viewMode === 'map') {
      // 3. Near Me or Map View: Filter by Radius & sort by closest distance
      const inRadius = list.filter((s) => s.distance !== undefined && s.distance <= mapRadiusKm);
      if (inRadius.length > 0) {
        list = inRadius.sort((a, b) => (a.distance || 0) - (b.distance || 0));
      } else {
        list = list.sort((a, b) => (a.distance ?? 9999) - (b.distance ?? 9999));
      }
    }

    // 4. Curriculum Board Filtering
    if (selectedBoard && selectedBoard !== 'all') {
      const boardQ = selectedBoard.toLowerCase();
      list = list.filter((s) => {
        const b = `${s.board || ''} ${s.board_secondary_10th || ''} ${s.board_higher_secondary_12th || ''}`.toLowerCase();
        if (boardQ === 'state board') {
          const matchesStateBoard = b.includes('state') || b.includes('hbse') || b.includes('upmsp') || b.includes('dbse');
          if (selectedStateBoard) {
            const st = (s.state_name || s.state || '').toLowerCase();
            return matchesStateBoard && st.includes(selectedStateBoard.toLowerCase());
          }
          return matchesStateBoard;
        }
        if (boardQ.includes('cambridge') || boardQ.includes('igcse')) {
          return b.includes('cambridge') || b.includes('igcse') || b.includes('caie');
        }
        return b.includes(boardQ);
      });
    }

    // 5. Class Filter
    if (selectedClasses.length > 0) {
      const classLabelToNum = (label: string): number => {
        const l = label.toLowerCase();
        if (l.includes('play') || l.includes('pre') || l.includes('nursery') || l.includes('lkg') || l.includes('ukg')) return 0;
        const m = l.match(/\d+/);
        return m ? parseInt(m[0], 10) : 1;
      };

      list = list.filter((s) => {
        const fromNum = parseInt(String(s.class_from ?? '1'), 10);
        const toNum = parseInt(String(s.class_to ?? '12'), 10);
        const classesStr = (s.classes || s.school_category || '').toLowerCase();
        const minClass = isNaN(fromNum) ? 0 : fromNum;
        const maxClass = isNaN(toNum) ? 12 : toNum;

        return selectedClasses.some((clsLabel) => {
          const targetNum = classLabelToNum(clsLabel);
          if (targetNum === 0) {
            return minClass <= 1 || classesStr.includes('nursery') || classesStr.includes('primary') || classesStr.includes('pr.');
          }
          return targetNum >= minClass && targetNum <= maxClass;
        });
      });
    }

    // 6. School Type Filter (Private Unaided, Government, Government Aided, International)
    if (selectedSchoolTypes.length > 0) {
      list = list.filter((s) => {
        const mgmt = `${s.management || ''} ${s.management_type || ''} ${s.school_type || ''} ${s.school_category || ''} ${s.school_name || ''}`.toLowerCase();
        return selectedSchoolTypes.some((t) => {
          const tl = t.toLowerCase();
          if (tl === 'private unaided') return mgmt.includes('private') || mgmt.includes('unaided') || mgmt.includes('recognized');
          if (tl === 'government aided') return mgmt.includes('aided') && !mgmt.includes('unaided');
          if (tl === 'government') return (mgmt.includes('government') || mgmt.includes('dept. of education') || mgmt.includes('mcd') || mgmt.includes('ndmc')) && !mgmt.includes('unaided');
          if (tl === 'international') return mgmt.includes('international') || mgmt.includes('global') || mgmt.includes('ib') || mgmt.includes('cambridge');
          return mgmt.includes(tl);
        });
      });
    }

    // 7. Special Categories Filter (Sainik, KVS, JNV, APS, EMRS)
    if (selectedSpecialCategories.length > 0) {
      list = list.filter((s) => {
        const info = `${s.school_name || ''} ${s.name || ''} ${s.management || ''} ${s.school_category || ''}`.toLowerCase();
        return selectedSpecialCategories.some((cat) => {
          const cl = cat.toLowerCase();
          if (cl.includes('sainik')) return info.includes('sainik');
          if (cl.includes('kendriya') || cl.includes('kvs')) return info.includes('kendriya') || info.includes('kv ');
          if (cl.includes('navodaya') || cl.includes('jnv')) return info.includes('navodaya') || info.includes('jnv');
          if (cl.includes('army')) return info.includes('army');
          if (cl.includes('eklavya') || cl.includes('emrs')) return info.includes('eklavya') || info.includes('emrs');
          return info.includes(cl);
        });
      });
    }

    // 8. Annual Fees Range Filter
    if (feeMax < 1000000) {
      list = list.filter((s) => {
        const fee = Number(s.annual_fee || 0);
        return fee <= feeMax;
      });
    }

    // 9. Student Strength Filter
    if (studentMax < 5000) {
      list = list.filter((s) => {
        const stu = Number(s.total_students || (s as any).students || 0);
        return stu <= studentMax;
      });
    }

    // 10. Facilities Filtering (In-Memory across all loaded schools)
    if (selectedFacilities.length > 0) {
      list = list.filter((s) => {
        const facs = (s.facilities || []).map((f: string) => f.toLowerCase());
        return selectedFacilities.every((selected) => {
          const sel = selected.toLowerCase();
          return facs.some((f: string) => f.includes(sel) || sel.includes(f));
        });
      });
    }

    // 11. Strict deduplication to ensure zero duplicate cards
    const seenCards = new Set<string>();
    const uniqueList: typeof list = [];
    for (const item of list) {
      const codeKey = (item.udise_code || item.school_id || item.id || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
      if (codeKey) {
        if (seenCards.has(codeKey)) continue;
        seenCards.add(codeKey);
        uniqueList.push(item);
      } else {
        const nameKey = (item.school_name || item.name || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
        const distKey = (item.district_name || item.city || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
        const compositeKey = nameKey ? `${nameKey}_${distKey}` : '';
        if (compositeKey && seenCards.has(compositeKey)) continue;
        if (compositeKey) seenCards.add(compositeKey);
        uniqueList.push(item);
      }
    }

    // 12. Comprehensive Sorting (Popularity Asc/Desc, Distance Nearest/Farthest, Student Strength, Name A-Z/Z-A, Faculty)
    const getPopularityScore = (s: SchoolRecord) => {
      const ratingScore = (Number(s.rating) || 0) * 1000;
      const likesScore = (likesCounts[s.id] ?? ((s as any).likes_count || (s as any).likesCount || 0)) * 100;
      const reviewsScore = (Number((s as any).reviews_count || s.reviews) || 0) * 10;
      const studentsScore = (Number(s.total_students || (s as any).students) || 0) * 0.1;
      const hasRealImg = s.image && !s.image.includes('default-school') ? 250 : 0;
      return ratingScore + likesScore + reviewsScore + studentsScore + hasRealImg;
    };

    if (searchMode !== 'near_me') {
      uniqueList.sort((a, b) => {
        switch (sortBy) {
          case 'popularity_desc':
            return getPopularityScore(b) - getPopularityScore(a);
          case 'popularity_asc':
            return getPopularityScore(a) - getPopularityScore(b);
          case 'distance_asc':
            return (a.distance ?? 99999) - (b.distance ?? 99999);
          case 'distance_desc':
            return (b.distance ?? 0) - (a.distance ?? 0);
          case 'name':
          case 'name_asc':
            return getCleanSchoolName(a.school_name || a.name).localeCompare(getCleanSchoolName(b.school_name || b.name));
          case 'name_desc':
            return getCleanSchoolName(b.school_name || b.name).localeCompare(getCleanSchoolName(a.school_name || a.name));
          case 'students':
          case 'students_desc':
            return (Number(b.total_students || (b as any).students) || 0) - (Number(a.total_students || (a as any).students) || 0);
          case 'students_asc':
            return (Number(a.total_students || (a as any).students) || 0) - (Number(b.total_students || (b as any).students) || 0);
          case 'teachers':
            return (Number(b.total_teachers) || 0) - (Number(a.total_teachers) || 0);
          default:
            return getPopularityScore(b) - getPopularityScore(a);
        }
      });
    }

    return uniqueList;
  }, [
    allLoadedSchools,
    searchTerm,
    searchMode,
    searchCenter.lat,
    searchCenter.lng,
    mapRadiusKm,
    viewMode,
    selectedBoard,
    selectedStateBoard,
    selectedClasses,
    selectedSchoolTypes,
    selectedSpecialCategories,
    feeMax,
    studentMax,
    selectedFacilities,
    sortBy,
    likesCounts,
  ]);

  const schoolsForMap = useMemo(() => {
    if (mapDisplayMode === 'accumulate') {
      return accumulatedSchools.length > 0 ? accumulatedSchools : displayedSchools;
    }
    return displayedSchools;
  }, [mapDisplayMode, accumulatedSchools, displayedSchools]);

  const mapFilteredSchools = useMemo(() => {
    const baseList = mapDisplayMode === 'accumulate' ? schoolsForMap : displayedSchools;
    if (!mapListSearch.trim()) return baseList;
    const q = mapListSearch.toLowerCase().trim();
    return baseList.filter((s) =>
      (s.school_name || s.name || '').toLowerCase().includes(q) ||
      (s.village_ward || '').toLowerCase().includes(q) ||
      (s.district_name || '').toLowerCase().includes(q) ||
      (s.board || '').toLowerCase().includes(q) ||
      (s.udise_code || '').includes(q)
    );
  }, [displayedSchools, schoolsForMap, mapDisplayMode, mapListSearch]);

  const handleSelectSchoolFromList = (school: SchoolRecord, fromMapMarker = false) => {
    setMapSelectedSchool(school);
    const lat = school.lat || school.latitude;
    const lng = school.lng || school.longitude;
    if (lat && lng) {
      setMapFocus({ lat, lng, zoom: 15, timestamp: Date.now() });
    }
    if (fromMapMarker && mobileSheetState === 'peek') {
      setMobileSheetState('half');
    }
  };

  const toggleFacility = (facilityName: string) => {
    setSelectedFacilities((prev) =>
      prev.includes(facilityName)
        ? prev.filter((f) => f !== facilityName)
        : [...prev, facilityName]
    );
  };

  const handleFilterChange = (newParams: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : '');
    Object.entries(newParams).forEach(([k, v]) => {
      if (v && v !== 'all') {
        params.set(k, v);
      } else {
        params.delete(k);
      }
    });
    params.set('page', '1');
    params.set('limit', '25');
    const target = pathname ? `${pathname}?${params.toString()}` : `?${params.toString()}`;
    router.push(target);
  };

  const handleLimitChange = (_newLimit: number) => {
    // Strictly max 25 schools per page from backend
    handleFilterChange({ limit: '25' });
  };

  const handleResetAll = useCallback(() => {
    setSelectedBoard('all');
    setSelectedStateBoard(null);
    setSelectedResidential('all');
    setSelectedFacilities([]);
    setSelectedClasses([]);
    setSelectedSchoolTypes([]);
    setSelectedSpecialCategories([]);
    setSelectedLocation(null);
    setFeeMax(1000000);
    setStudentMax(5000);
    setOnlyAtl(false);
    setSearchTerm('');
    setSearchMode('text');
    setMapRadiusKm(10);
    setSortBy('popularity_desc');
    handleFilterChange({
      board: undefined,
      residential: undefined,
      facility: undefined,
      q: undefined,
      search: undefined,
      district: undefined,
      state: undefined,
      sort: undefined,
    });
  }, [handleFilterChange]);

  const handleSelectCity = useCallback((city: { name: string; query?: string }) => {
    setSelectedLocation(city.name);
    setIsLocationDropdownOpen(false);
    setIsMobileCityDropdownOpen(false);
    const qStr = city.query || city.name;
    setSearchTerm(qStr);
    setSearchMode('text');
    const coords = CITY_COORDINATES[city.name];
    if (coords) {
      setSearchCenter(coords);
      setMapFocus({ lat: coords.lat, lng: coords.lng, zoom: 13, timestamp: Date.now() });
    }
    handleFilterChange({ q: qStr });
  }, [handleFilterChange]);

  const handleResetToAllCities = useCallback(() => {
    setSelectedLocation(null);
    setIsLocationDropdownOpen(false);
    setIsMobileCityDropdownOpen(false);
    setSearchTerm('');
    setSearchMode('text');
    const firstSchool = initialData.schools?.find((s) => (s.lat || s.latitude) && (s.lng || s.longitude));
    if (firstSchool) {
      const sLat = firstSchool.lat || firstSchool.latitude;
      const sLng = firstSchool.lng || firstSchool.longitude;
      setSearchCenter({ lat: sLat, lng: sLng });
      setMapFocus({ lat: sLat, lng: sLng, zoom: 12, timestamp: Date.now() });
    } else {
      setSearchCenter({ lat: 28.1846, lng: 77.4105 });
    }
    handleFilterChange({ q: undefined, search: undefined, city: undefined, district: undefined });
  }, [handleFilterChange, initialData.schools]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedBoard && selectedBoard !== 'all') count++;
    if (selectedStateBoard) count++;
    if (selectedResidential && selectedResidential !== 'all') count++;
    if (selectedClasses.length > 0) count += selectedClasses.length;
    if (selectedSchoolTypes.length > 0) count += selectedSchoolTypes.length;
    if (selectedSpecialCategories.length > 0) count += selectedSpecialCategories.length;
    if (selectedFacilities.length > 0) count += selectedFacilities.length;
    if (feeMax < 1000000) count++;
    if (studentMax < 5000) count++;
    if (selectedLocation) count++;
    if (onlyAtl) count++;
    if (mapRadiusKm < 10) count++;
    return count;
  }, [
    selectedBoard, selectedStateBoard, selectedResidential, selectedClasses,
    selectedSchoolTypes, selectedSpecialCategories, selectedFacilities, feeMax,
    studentMax, selectedLocation, onlyAtl, mapRadiusKm
  ]);

  const handlePageChange = useCallback(async (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage || isLoadingMore) return;
    setIsLoadingMore(true);
    setCurrentPage(newPage);
    try {
      const params = new URLSearchParams(searchParams ? searchParams.toString() : '');
      if (selectedBoard && selectedBoard !== 'all') params.set('board', selectedBoard);
      if (selectedResidential && selectedResidential !== 'all') params.set('residential', selectedResidential);
      if (selectedLocation) params.set('district', selectedLocation);
      if (searchTerm.trim() && searchMode === 'text') params.set('q', searchTerm.trim());
      if (sortBy && sortBy !== 'popularity_desc') params.set('sort', sortBy);
      params.set('page', String(newPage));
      params.set('limit', '25');
      const res = await fetch(`/api/schools-directory?${params.toString()}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.schools)) {
        const pageBatch = data.schools.slice(0, 25);
        setAllLoadedSchools(pageBatch);
        const resolvedPage = Number(data.currentPage) || newPage;
        const resolvedTotalCount = typeof data.totalCount === 'number' ? data.totalCount : totalSchoolsCount;
        const resolvedTotalPages = Number(data.totalPages) || Math.max(1, Math.ceil(resolvedTotalCount / 25));
        setCurrentPage(resolvedPage);
        setTotalPages(resolvedTotalPages);
        setTotalSchoolsCount(resolvedTotalCount);
        setHasMoreSchools(resolvedPage < resolvedTotalPages);
        setAccumulatedSchools((prev) => {
          const existingKeys = new Set(prev.map((s) => String(s.udise_code || s.school_id || s.id)));
          const uniqueNew = pageBatch.filter((s: any) => !existingKeys.has(String(s.udise_code || s.school_id || s.id)));
          return [...prev, ...uniqueNew];
        });
      }
      const target = pathname ? `${pathname}?${params.toString()}` : `?${params.toString()}`;
      router.push(target, { scroll: false });
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      console.warn('Error changing page:', err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [totalPages, currentPage, isLoadingMore, searchParams, pathname, router, totalSchoolsCount, selectedBoard, selectedResidential, selectedLocation, searchTerm, searchMode, sortBy]);

  // Smart page numbers array for pagination
  const paginationPages = useMemo(() => {
    const total = Math.max(1, totalPages);
    const current = Math.min(Math.max(1, currentPage), total);
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    if (current <= 4) {
      return [1, 2, 3, 4, 5, '...', total];
    }
    if (current >= total - 3) {
      return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
    }
    return [1, '...', current - 1, current, current + 1, '...', total];
  }, [totalPages, currentPage]);

  // Reusable Top & Bottom Pagination Bar (Labster Design System)
  const renderPaginationBar = (position: 'top' | 'bottom') => {
    const pageCount = displayedSchools.length;
    const startItem = totalSchoolsCount === 0 || pageCount === 0 ? 0 : (currentPage - 1) * 25 + 1;
    const endItem = totalSchoolsCount === 0 || pageCount === 0 ? 0 : Math.min((currentPage - 1) * 25 + pageCount, totalSchoolsCount);

    return (
      <div
        className={`w-full bg-white rounded-2xl border border-[#E8E9E9] px-3.5 py-2.5 sm:px-5 sm:py-3 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 ${
          position === 'top' ? 'mb-4' : 'mt-8'
        }`}
      >
        {/* Left: Showing X-Y of Z Schools */}
        <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-[10px] bg-[#EDF5FA] text-[#006FCC] font-bold text-[11px] border border-[#DDF0FC]">
            Page {currentPage} of {totalPages}
          </span>
          <span>
            Showing <strong className="text-[#1B1F23] font-bold">{startItem}–{endItem}</strong> of{' '}
            <strong className="text-[#1B1F23] font-bold">{totalSchoolsCount}</strong> Schools
          </span>
          <span className="hidden md:inline text-[11px] text-slate-500 font-medium">
            (25 / page)
          </span>
          {isLoadingMore && (
            <Loader2 size={14} className="animate-spin text-[#006FCC] ml-1" />
          )}
        </div>

        {/* Right: Prev + Page Numbers + Next (Labster 14px CTA Buttons) */}
        <div className="flex items-center gap-1.5 flex-wrap justify-center">
          <button
            type="button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1 || isLoadingMore}
            className="inline-flex items-center gap-1 h-9 px-3.5 rounded-[14px] border border-[#E8E9E9] bg-[#F7F8F8] hover:bg-[#EDF5FA] text-[#003C6E] hover:text-[#006FCC] text-xs font-bold font-['Montserrat',sans-serif] transition-all duration-200 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            title="Previous Page (25 Schools)"
          >
            <ChevronLeft size={14} />
            <span>Prev</span>
          </button>

          {paginationPages.map((p, idx) =>
            p === '...' ? (
              <span key={`dots-${position}-${idx}`} className="px-1.5 text-xs text-slate-400 font-bold">
                ...
              </span>
            ) : (
              <button
                key={`page-${position}-${p}`}
                type="button"
                onClick={() => handlePageChange(Number(p))}
                disabled={isLoadingMore}
                className={`min-w-[36px] h-9 px-3 rounded-[14px] text-xs font-bold font-['Montserrat',sans-serif] transition-all duration-200 active:scale-[0.98] cursor-pointer flex items-center justify-center ${
                  currentPage === Number(p)
                    ? 'bg-[#006FCC] hover:bg-[#005399] text-white shadow-xs border border-[#006FCC]'
                    : 'bg-white hover:bg-[#F7F8F8] text-[#1B1F23] hover:text-[#006FCC] border border-[#E8E9E9]'
                }`}
                title={`Go to Page ${p}`}
              >
                {p}
              </button>
            )
          )}

          <button
            type="button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages || isLoadingMore}
            className="inline-flex items-center gap-1 h-9 px-3.5 rounded-[14px] border border-[#E8E9E9] bg-[#F7F8F8] hover:bg-[#EDF5FA] text-[#003C6E] hover:text-[#006FCC] text-xs font-bold font-['Montserrat',sans-serif] transition-all duration-200 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            title="Next Page (25 Schools)"
          >
            <span>Next</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    );
  };

  const handleToggleLike = async (id: string, e: React.MouseEvent, udiseCode?: string) => {
    e.stopPropagation();
    const isCurrentlyLiked = likedSchoolIds.includes(id);
    const nextLiked = !isCurrentlyLiked;

    setLikedSchoolIds((prev) => {
      const nextList = nextLiked ? [...prev, id] : prev.filter((item) => item !== id);
      try {
        localStorage.setItem('cseel_liked_school_ids', JSON.stringify(nextList));
        if (udiseCode) {
          localStorage.setItem(`liked_school_${udiseCode}`, nextLiked ? 'true' : 'false');
        }
      } catch {}
      return nextList;
    });

    setLikesCounts((prev) => {
      const current = prev[id] ?? 0;
      return {
        ...prev,
        [id]: Math.max(0, nextLiked ? current + 1 : current - 1),
      };
    });

    const targetUdise = udiseCode || id;
    try {
      const res = await fetch('/api/school-engagement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'like',
          udiseCode: targetUdise,
          liked: nextLiked,
        }),
      });
      const data = await res.json();
      if (data.success && typeof data.likesCount === 'number') {
        setLikesCounts((prev) => ({
          ...prev,
          [id]: data.likesCount,
        }));
      }
    } catch (err) {
      console.warn('Failed to toggle like:', err);
    }
  };

  const handleToggleCompare = (school: SchoolRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompareList((prev) => {
      const exists = prev.some((s) => s.id === school.id);
      if (exists) return prev.filter((s) => s.id !== school.id);
      if (prev.length >= 4) {
        alert('You can compare up to 4 schools at a time.');
        return prev;
      }
      return [...prev, school];
    });
  };

  const handleShareSchool = (school: SchoolRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = typeof window !== 'undefined' ? window.location.origin + getSchoolUrl(school) : '';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedToastId(school.id);
      setTimeout(() => setCopiedToastId(null), 2500);
    }
  };

  const getSchoolUrl = (s: SchoolRecord) => {
    const rawUdise = String(s.udise_code || s.udiseCode || s.id || '');
    let derivedState = s.state_name || s.state || '';
    let derivedDistrict = s.district_name || s.city || '';
    if (!derivedState && rawUdise.startsWith('07')) {
      derivedState = 'Delhi';
      derivedDistrict = derivedDistrict || (rawUdise.startsWith('0704') ? 'East Delhi' : (rawUdise.startsWith('0705') ? 'Central Delhi' : 'Delhi'));
    } else if (!derivedState && rawUdise.startsWith('06')) {
      derivedState = 'Haryana';
      derivedDistrict = derivedDistrict || 'Gurugram';
    }
    const stateSlug = (derivedState || 'delhi').toLowerCase().replace(/\s+/g, '-');
    const districtSlug = (derivedDistrict || 'delhi').toLowerCase().replace(/\s+/g, '-');
    const villageSlug = (s.village_ward || s.locality || 'main').toLowerCase().replace(/\s+/g, '-');
    return `/school/${stateSlug}/${districtSlug}/${villageSlug}/${s.udise_code || s.id}`;
  };

  const openGoogleMaps = (school: SchoolRecord, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setGoogleMapModalSchool(school);
  };

  const handleNearMeSearch = () => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude, accuracy } = pos.coords;
          setSearchCenter({ lat: latitude, lng: longitude });
          setMapFocus({ lat: latitude, lng: longitude, zoom: 14, timestamp: Date.now() });
          setViewMode('map');
          setSearchMode('near_me');
        },
        (err) => {
          console.warn('Geolocation error:', err);
          alert('Please allow Location Access in your browser settings to search schools with high GPS accuracy.');
        },
        {
          enableHighAccuracy: true, // Forces Hardware GPS & Wi-Fi Triangulation (10m accuracy, NO coarse ISP fallback)
          timeout: 15000,
          maximumAge: 0,            // Never use stale cached position
        }
      );
    } else {
      alert('High precision Geolocation is not supported by your browser.');
    }
  };

  const topSchools = useMemo(() => {
    return [...initialData.schools]
      .sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0))
      .slice(0, 8);
  }, [initialData.schools]);



  // Helper to format classes in clean numeric format (e.g. 'Class 1st-12th', 'Class Nursery-12th')
  const formatCompactClasses = (classesVal?: string): string => {
    const raw = (classesVal || '').trim();
    if (!raw) return 'Class 1st-12th';
    const lower = raw.toLowerCase();

    let res = '1st-12th';
    // Already standard numeric like "1st - 12th", "1 - 10th", "1st - 10th", "Nursery - 12th"
    if (/^\d+(?:st|nd|rd|th)?\s*[-–]\s*\d+(?:st|nd|rd|th)?$/i.test(raw)) {
      res = raw.replace(/\s*[-–]\s*/, '-');
    } else if (/^(?:nursery|play|kg|pre-nursery|pre-school|prep)\s*[-–]\s*\d+(?:st|nd|rd|th)?$/i.test(raw)) {
      res = raw.replace(/\s*[-–]\s*/, '-');
    } else if (lower.includes('pre') || lower.includes('nurs') || lower.includes('kg') || lower.includes('play')) {
      if (lower.includes('12') || lower.includes('senior') || lower.includes('sr.')) res = 'Nursery-12th';
      else if (lower.includes('10') || lower.includes('sec')) res = 'Nursery-10th';
      else if (lower.includes('8') || lower.includes('middle')) res = 'Nursery-8th';
      else if (lower.includes('5') || lower.includes('primary')) res = 'Nursery-5th';
      else res = 'Nursery-12th';
    } else if (lower.includes('primary') || lower.includes('class 1') || lower.includes('1st')) {
      if (lower.includes('senior') || lower.includes('12') || lower.includes('sr.')) res = '1st-12th';
      else if (lower.includes('second') || lower.includes('10')) res = '1st-10th';
      else if (lower.includes('middle') || lower.includes('8')) res = '1st-8th';
      else if (lower.includes('5')) res = '1st-5th';
      else res = '1st-10th';
    } else if (lower.includes('middle') || lower.includes('class 6') || lower.includes('6th')) {
      if (lower.includes('senior') || lower.includes('12')) res = '6th-12th';
      else res = '6th-10th';
    } else {
      const numbers = raw.match(/\d+/g);
      if (numbers && numbers.length >= 2) {
        res = `${numbers[0]}th-${numbers[1]}th`;
      } else if (numbers && numbers.length === 1) {
        res = `Up to ${numbers[0]}th`;
      } else {
        res = '1st-12th';
      }
    }

    if (res.toLowerCase().startsWith('class')) {
      return res;
    }
    return `Class ${res}`;
  };

  // Helper to render school title with perfectly baseline-aligned verified badge (no word drop/bend)
  const renderSchoolTitleWithVerified = (name: string, isVerified: boolean = true) => {
    const clean = getCleanSchoolName(name);
    if (!clean) return null;

    return (
      <span className="inline">
        {clean}
        {isVerified && (
          <span title="CSEEL Verified School" className="inline-flex items-center">
            <CheckCircle2
              size={14}
              className="inline-block align-baseline ml-1 text-white fill-blue-600 drop-shadow-xs -translate-y-[1px] shrink-0"
              aria-label="CSEEL Verified School"
            />
          </span>
        )}
      </span>
    );
  };

  const renderSchoolCard = (school: SchoolRecord, idx: number) => {
    const profileUrl = getSchoolUrl(school);
    const isCompared = compareList.some((c) => c.id === school.id);
    const isLiked = likedSchoolIds.includes(school.id);
    const cardLikesCount = likesCounts[school.id] ?? ((school as any).likes_count || (school as any).likesCount || 0);
    const rawWebsite = (school as any).website || school.website || '';
    const hasWebsite = Boolean(rawWebsite && rawWebsite.trim() !== '' && rawWebsite !== '#' && !rawWebsite.includes('example.com'));
    const cleanWebsiteUrl = hasWebsite ? (rawWebsite.startsWith('http') ? rawWebsite : `https://${rawWebsite}`) : '';
    
    // Labster Design System School Card
    return (
      <div key={school.id || idx} className="bg-white rounded-2xl overflow-hidden border border-[#E8E9E9] shadow-xs hover:shadow-md hover:border-[#006FCC]/40 transition-all duration-300 group flex flex-col w-full max-w-full box-border">
        {/* Card Image Header - Compact with sleek single row overlay */}
        <div className="relative h-40 sm:h-44 w-full bg-slate-50 overflow-hidden">
          <img
            src={getSafeSchoolImage(school.image || (school as any).image_url)}
            alt={school.school_name || school.name || 'School Banner'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { e.currentTarget.src = PLACEHOLDER_EMPTY_IMAGE; }}
          />
          
          {/* Top Single Row Toolbar with Informative Hover Tooltips */}
          <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none">
            {/* Rating Pill on Left */}
            {school.rating && Number(school.rating) > 0 ? (
              <div className="bg-black/75 backdrop-blur-md text-white px-2 py-0.5 rounded-[8px] text-[11px] font-bold shadow-xs flex items-center gap-1 pointer-events-auto">
                <Star size={11} className="fill-amber-400 text-amber-400" />
                <span>{school.rating}</span>
              </div>
            ) : <div />}

            {/* Action Buttons in a Single Crisp Glass Strip on Right */}
            <div className="flex items-center gap-1 bg-black/45 backdrop-blur-md p-1 rounded-full border border-white/20 shadow-xs pointer-events-auto">
              {/* Official Website */}
              <div className="relative group/tip">
                {hasWebsite ? (
                  <a
                    href={cleanWebsiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white/90 hover:text-white hover:bg-white/25 transition cursor-pointer"
                  >
                    <Globe size={13} />
                  </a>
                ) : (
                  <button
                    disabled
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white/40 opacity-40 cursor-not-allowed pointer-events-none"
                  >
                    <Globe size={13} />
                  </button>
                )}
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-0.5 bg-gray-900/95 text-white text-[10px] font-medium rounded whitespace-nowrap opacity-0 group-hover/tip:opacity-100 pointer-events-none transition-opacity shadow-md z-30">
                  {hasWebsite ? 'Official Website' : 'Website Not Available'}
                </span>
              </div>

              {/* Compare Button - Google Material Symbols Balance Icon (Temporarily Hidden) */}
              {SHOW_COMPARE_BUTTON && (
                <div className="relative group/tip">
                  <button
                    type="button"
                    onClick={(e) => handleToggleCompare(school, e)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition cursor-pointer ${
                      isCompared ? 'bg-blue-600 text-white' : 'text-white/90 hover:text-white hover:bg-white/25'
                    }`}
                    aria-label="Compare School"
                  >
                    <GoogleBalanceIcon size={14} />
                  </button>
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-0.5 bg-gray-900/95 text-white text-[10px] font-medium rounded whitespace-nowrap opacity-0 group-hover/tip:opacity-100 pointer-events-none transition-opacity shadow-md z-30">
                    {isCompared ? 'Remove from Comparison' : 'Compare School'}
                  </span>
                </div>
              )}

              {/* Share */}
              <div className="relative group/tip">
                <button
                  type="button"
                  onClick={(e) => handleShareSchool(school, e)}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white/90 hover:text-white hover:bg-white/25 transition cursor-pointer"
                >
                  <Share2 size={13} />
                </button>
                {copiedToastId === school.id ? (
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-bold rounded shadow-md z-30 whitespace-nowrap">
                    Link Copied!
                  </span>
                ) : (
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-0.5 bg-gray-900/95 text-white text-[10px] font-medium rounded whitespace-nowrap opacity-0 group-hover/tip:opacity-100 pointer-events-none transition-opacity shadow-md z-30">
                    Share School
                  </span>
                )}
              </div>

              {/* Like / Wishlist */}
              <div className="relative group/tip">
                <button
                  type="button"
                  onClick={(e) => handleToggleLike(school.id, e, school.udise_code || school.school_id)}
                  className={`h-7 px-2 rounded-full flex items-center gap-1 transition cursor-pointer text-xs font-semibold ${
                    isLiked
                      ? 'bg-rose-500 text-white shadow-xs'
                      : 'bg-black/35 text-white hover:bg-black/55 hover:text-white'
                  }`}
                >
                  <Heart size={13} className={isLiked ? "fill-white text-white" : "text-white/90"} />
                  {cardLikesCount > 0 && <span className="text-[11px] font-bold">{cardLikesCount}</span>}
                </button>
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-0.5 bg-gray-900/95 text-white text-[10px] font-medium rounded whitespace-nowrap opacity-0 group-hover/tip:opacity-100 pointer-events-none transition-opacity shadow-md z-30">
                  {isLiked ? 'Liked' : 'Like School'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card Body - Crisp Google Places Local Listing Typography */}
        <div className="p-3.5 sm:p-4 flex-1 flex flex-col min-w-0 overflow-hidden">
          <div className="mb-1.5 min-w-0">
            <h2 
              className="font-['Montserrat',sans-serif] font-bold text-[14.5px] sm:text-[15.5px] leading-snug tracking-tight line-clamp-2 break-words cursor-pointer text-[#003C6E] hover:text-[#006FCC] transition-colors"
              style={{ fontSize: '15px', color: '#003C6E', lineHeight: '1.3' }}
            >
              <Link href={profileUrl} className="hover:text-[#006FCC] hover:underline transition-colors inline break-words">
                {renderSchoolTitleWithVerified(school.school_name || school.name || 'School')}
              </Link>
            </h2>
          </div>
          
          {/* Rating - Only display if real rating exists */}
          {school.rating && Number(school.rating) > 0 ? (
            <div className="flex items-center gap-1 mb-2">
              <span className="text-[13px] font-bold text-gray-800">{school.rating}</span>
              <div className="flex text-amber-400">
                <Star size={12} className="fill-amber-400" />
              </div>
              {school.reviews && Number(school.reviews) > 0 ? (
                <span className="text-xs text-gray-500 ml-1">({school.reviews})</span>
              ) : null}
            </div>
          ) : null}
          
          {/* Address & Meta */}
          <div className="text-[12.5px] text-gray-600 flex items-start justify-between gap-1.5 mb-2.5 leading-snug min-w-0">
            <div className="flex items-start gap-1.5 min-w-0 flex-1">
              <MapPin size={14} className="text-red-500 shrink-0 mt-0.5" />
              <span className="break-words line-clamp-2 min-w-0">{formatCardLocation(school)}</span>
            </div>
            {school.distance !== undefined && school.distance > 0 && (
              <span className="shrink-0 bg-black/60 backdrop-blur-md border border-white/10 text-emerald-300 px-2 py-0.5 rounded text-[11px] font-bold shadow-sm whitespace-nowrap ml-1">
                {school.distance} km
              </span>
            )}
          </div>

          {/* Admissions Open Tag — Controlled by school profile toggle (default off/hidden) */}
          {Boolean((school as any).admissions_open || (school as any).is_admissions_open) && (
            <div className="mb-2.5">
              <span className="inline-flex items-center gap-1.5 bg-[#e6f4ea] text-[#137333] border border-[#ceead6] px-2 py-0.5 rounded-md text-[10.5px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#137333] animate-pulse" />
                Admissions Open
              </span>
            </div>
          )}

          {/* Experiential Science Lab Badge */}
          {school.facilities?.includes('Experiential Science Lab') && (
            <div className="mb-2.5">
              <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-md text-[10px] font-bold">
                <FlaskConical size={11} className="text-[#005689]" />
                Experiential Science Lab
              </span>
            </div>
          )}

          {/* Features Grid - Standard Educational Icons */}
          <div className="grid grid-cols-2 gap-y-2 gap-x-2 text-[11.5px] text-gray-700 mb-3.5 bg-slate-50/90 p-2.5 rounded-xl border border-slate-200/70 min-w-0 overflow-hidden">
            {/* 1. Board with Official Logo Badge */}
            <div className="flex items-center gap-1.5 min-w-0 overflow-hidden" title={`Board: ${school.board || school.board_secondary_10th || 'CBSE'}`}>
              <div className="w-4 h-4 flex items-center justify-center shrink-0">
                {renderBoardLogo(school.board || school.board_secondary_10th || 'CBSE')}
              </div>
              <span className="font-semibold text-slate-800 truncate">{school.board || school.board_secondary_10th || 'CBSE'}</span>
            </div>

            {/* 2. Classes / Grade Range */}
            <div className="flex items-center gap-1.5 min-w-0 overflow-hidden" title={`Classes: ${formatCompactClasses(school.classes || (school as any).class_range)}`}>
              <GraduationCap size={13} className="text-purple-600 shrink-0" />
              <span className="font-semibold text-slate-800 truncate">{formatCompactClasses(school.classes || (school as any).class_range)}</span>
            </div>

            {/* 3. Medium of Instruction (Languages icon, NOT building) */}
            <div className="flex items-center gap-1.5 min-w-0 overflow-hidden" title={`Medium: ${school.medium || school.medium_of_instruction_1 || 'English Medium'}`}>
              <Languages size={13} className="text-indigo-600 shrink-0" />
              <span className="font-medium text-slate-700 truncate">{school.medium || school.medium_of_instruction_1 || 'English Medium'}</span>
            </div>

            {/* 4. Format / Type */}
            <div className="flex items-center gap-1.5 min-w-0 overflow-hidden" title={`Type: ${school.school_type || school.gender || 'Co-ed Day'}`}>
              <Building2 size={13} className="text-emerald-600 shrink-0" />
              <span className="font-medium text-slate-700 truncate">{school.school_type || school.gender || 'Co-ed Day'}</span>
            </div>
          </div>

          {/* Card Actions - Labster 14px CTA Buttons */}
          <div className="mt-auto pt-3 border-t border-[#E8E9E9] flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => openGoogleMaps(school, e)}
              className="h-9 px-3 rounded-[14px] border border-[#E8E9E9] bg-[#F7F8F8] hover:bg-[#EDF5FA] hover:border-[#006FCC]/30 text-[#003C6E] hover:text-[#006FCC] text-xs font-bold font-['Montserrat',sans-serif] inline-flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-[0.98] cursor-pointer group whitespace-nowrap min-w-0 flex-1"
              title="Open location on Google Maps (Popup Window)"
            >
              <svg className="w-3.5 h-3.5 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                <circle cx="12" cy="9" r="2.8" fill="#FFFFFF"/>
              </svg>
              <span className="truncate">Map</span>
            </button>
            
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setClaimModalData({
                  isOpen: true,
                  schoolName: school.school_name || school.name || 'School Profile',
                  udiseCode: school.udise_code || school.id || '',
                });
              }}
              className="h-9 px-3 rounded-[14px] bg-[#EDF5FA] hover:bg-[#DDF0FC] border border-[#DDF0FC] text-[#006FCC] text-xs font-bold font-['Montserrat',sans-serif] inline-flex items-center justify-center gap-1 transition-all duration-200 active:scale-[0.98] whitespace-nowrap min-w-0 cursor-pointer shrink-0"
              title="Claim this school profile to edit details & admissions"
            >
              <ShieldCheck size={13} className="text-[#006FCC] shrink-0" />
              <span className="truncate">Claim</span>
            </button>
            
            <Link
              href={profileUrl}
              className="h-9 px-3.5 rounded-[14px] bg-[#006FCC] hover:bg-[#005399] text-white text-xs font-bold font-['Montserrat',sans-serif] inline-flex items-center justify-center gap-1 shadow-xs hover:shadow transition-all duration-200 active:scale-[0.98] whitespace-nowrap min-w-0 flex-1"
            >
              <span className="truncate">View</span>
              <ArrowRight size={13} className="shrink-0" />
            </Link>
          </div>
        </div>
      </div>
    );
  };

  const renderCompactSchoolRow = (school: SchoolRecord, idx: number) => {
    const profileUrl = getSchoolUrl(school);
    const isCompared = compareList.some((c) => c.id === school.id);
    const isLiked = likedSchoolIds.includes(school.id);
    const cardLikesCount = likesCounts[school.id] ?? ((school as any).likes_count || (school as any).likesCount || 0);
    const rawWebsite = (school as any).website || school.website || '';
    const hasWebsite = Boolean(rawWebsite && rawWebsite.trim() !== '' && rawWebsite !== '#' && !rawWebsite.includes('example.com'));
    const cleanWebsiteUrl = hasWebsite ? (rawWebsite.startsWith('http') ? rawWebsite : `https://${rawWebsite}`) : '';
    const boardName = school.board || school.board_secondary_10th || 'CBSE';
    const locationStr = formatCardLocation(school);

    return (
      <div 
        key={school.id || idx} 
        className="bg-white rounded-2xl border border-[#E8E9E9] hover:border-[#006FCC]/40 hover:shadow-md transition-all duration-300 p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-4 group relative overflow-hidden w-full max-w-full box-border"
      >
        {/* Top/Main block: Thumbnail + Info */}
        <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
          {/* Thumbnail with Rating and Distance at Bottom */}
          <div className="relative w-20 h-20 min-w-[80px] max-w-[80px] sm:w-28 sm:h-24 sm:min-w-[112px] sm:max-w-[112px] rounded-[12px] bg-slate-50 border border-slate-100 overflow-hidden shrink-0 shadow-xs">
            <img
              src={getSafeSchoolImage(school.image || (school as any).image_url)}
              alt={school.school_name || school.name || 'School'}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => { e.currentTarget.src = PLACEHOLDER_EMPTY_IMAGE; }}
            />
            {/* Bottom Row: Rating and Distance side-by-side with minimal padding & margin */}
            {((school.rating && Number(school.rating) > 0) || (school.distance !== undefined && school.distance > 0)) && (
              <div className="absolute bottom-1 inset-x-1 flex items-center justify-between gap-0.5 pointer-events-none z-10">
                {school.rating && Number(school.rating) > 0 ? (
                  <div className="bg-black/80 backdrop-blur-xs text-white px-1 py-0.5 rounded text-[8.5px] font-bold flex items-center gap-0.5 leading-none shrink-0 shadow-xs border border-white/10">
                    <Star size={7.5} className="fill-amber-400 text-amber-400 shrink-0" />
                    <span>{school.rating}</span>
                  </div>
                ) : <span />}
                {school.distance !== undefined && school.distance > 0 && (
                  <div className="bg-black/80 backdrop-blur-xs text-emerald-300 px-1 py-0.5 rounded text-[8px] font-bold leading-none shrink-0 shadow-xs border border-white/10 whitespace-nowrap">
                    <span>{school.distance < 1 ? `${Math.round(school.distance * 1000)}m` : `${Number(school.distance.toFixed(1))}km`}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Info Details */}
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            {/* Title & Iconic Verified Badge + Board */}
            <div className="flex items-start sm:items-center gap-1.5 mb-1 flex-wrap min-w-0">
              <Link 
                href={profileUrl} 
                className="font-['Montserrat',sans-serif] font-bold text-sm sm:text-base text-[#003C6E] leading-snug hover:text-[#006FCC] transition-colors inline break-words line-clamp-2"
                title={school.school_name || school.name}
              >
                {renderSchoolTitleWithVerified(school.school_name || school.name || 'School')}
              </Link>
              <span className="inline-flex text-[9.5px] sm:text-[11px] font-bold text-[#006FCC] bg-[#EDF5FA] px-2 py-0.5 rounded-[8px] border border-[#DDF0FC] shrink-0 align-middle">
                {boardName}
              </span>
            </div>

            {/* Location: Full Address (no truncation) */}
            <div className="flex items-start gap-1 text-[11px] sm:text-xs text-[#444746] mb-1.5 leading-snug">
              <MapPin size={12} className="text-red-500 shrink-0 mt-0.5" />
              <span className="break-words">{locationStr}</span>
            </div>

            {/* Quick Info Tags — Compact Numbers (e.g. Class 1st-12th) & Admissions Open (Toggle-controlled) */}
            <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
              <span className="text-[10px] sm:text-xs text-[#444746] bg-[#eef3fc] px-2 py-0.5 rounded-[8px] font-semibold">
                {formatCompactClasses(school.classes || (school as any).class_range)}
              </span>
              {/* Admissions Open Tag — Controlled by school profile toggle (default off/hidden) */}
              {Boolean((school as any).admissions_open || (school as any).is_admissions_open) && (
                <span className="text-[10px] sm:text-xs text-[#137333] bg-[#e6f4ea] border border-[#ceead6] px-2 py-0.5 rounded-[8px] font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#137333] animate-pulse" />
                  <span>Admissions Open</span>
                </span>
              )}
              {school.facilities?.includes('Experiential Science Lab') && (
                <span className="text-[10px] sm:text-xs text-[#0b57d0] bg-[#e8f0fe] border border-[#c2e7ff] px-2 py-0.5 rounded-[8px] font-medium hidden lg:inline-flex items-center gap-1">
                  <FlaskConical size={10} /> Experiential Lab
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons: Uniform M3 Pill & Icon Buttons */}
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-end gap-1 sm:gap-1.5 shrink-0 pt-2 sm:pt-0 border-t border-gray-100 sm:border-0 sm:pl-2 min-w-0">
          {/* Secondary Actions group */}
          <div className="flex items-center gap-1">
            {/* Website Icon Button */}
            {hasWebsite ? (
              <a
                href={cleanWebsiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="h-8 w-8 flex items-center justify-center rounded-full text-[#0b57d0] hover:bg-[#0b57d0]/[0.08] border border-[#c4c7c5] transition-all duration-200 active:scale-[0.98] cursor-pointer shrink-0"
                title="Visit Official School Website"
              >
                <Globe size={13} />
              </a>
            ) : (
              <button
                disabled
                className="h-8 w-8 flex items-center justify-center rounded-full text-gray-400 bg-gray-50 border border-gray-200 opacity-40 cursor-not-allowed select-none pointer-events-none shrink-0"
                title="Website Not Available"
              >
                <Globe size={13} />
              </button>
            )}

            {/* Google Maps Pin Icon Button */}
            <button
              type="button"
              onClick={(e) => openGoogleMaps(school, e)}
              className="h-8 w-8 flex items-center justify-center rounded-full text-[#444746] hover:bg-[#0b57d0]/[0.08] border border-[#c4c7c5] transition-all duration-200 active:scale-[0.98] cursor-pointer shrink-0"
              title="Open location on Google Maps"
            >
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                <circle cx="12" cy="9" r="2.8" fill="#FFFFFF"/>
              </svg>
            </button>

            {/* Compare Button — Google Material Symbols Balance Icon (Temporarily Hidden) */}
            {SHOW_COMPARE_BUTTON && (
              <button
                type="button"
                onClick={(e) => handleToggleCompare(school, e)}
                className={`h-8 w-8 flex items-center justify-center rounded-full text-xs transition-all duration-200 active:scale-[0.98] cursor-pointer border ${
                  isCompared ? 'bg-[#c2e7ff] text-[#001d35] border-transparent' : 'text-[#444746] hover:text-[#0b57d0] hover:bg-[#0b57d0]/[0.08] border-[#c4c7c5]'
                }`}
                title="Compare School"
              >
                <GoogleBalanceIcon size={14} />
              </button>
            )}

            {/* Share Button */}
            <button
              type="button"
              onClick={(e) => handleShareSchool(school, e)}
              className="h-8 w-8 flex items-center justify-center rounded-full text-xs text-[#444746] hover:text-[#1f1f1f] hover:bg-[#1f1f1f]/[0.08] border border-[#c4c7c5] transition-all duration-200 active:scale-[0.98] relative cursor-pointer shrink-0"
              title="Share Profile"
            >
              <Share2 size={13} />
              {copiedToastId === school.id && (
                <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-0.5 rounded shadow-lg whitespace-nowrap z-30">
                  Copied!
                </span>
              )}
            </button>

            {/* Like / Save Button */}
            <button
              type="button"
              onClick={(e) => handleToggleLike(school.id, e, school.udise_code || school.school_id)}
              className={`h-8 px-2 flex items-center gap-1 rounded-full text-xs font-semibold transition-all duration-200 active:scale-[0.98] cursor-pointer border shrink-0 ${
                isLiked ? 'text-rose-600 bg-rose-50 border-rose-200' : 'text-[#444746] hover:text-rose-500 hover:bg-rose-50 border-[#c4c7c5]'
              }`}
              title={isLiked ? "Liked" : "Like School"}
            >
              <Heart size={13} className={isLiked ? "fill-rose-500" : ""} />
              {cardLikesCount > 0 && <span className="text-[10px] font-bold">{cardLikesCount}</span>}
            </button>
          </div>
          
          {/* Claim School CTA */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setClaimModalData({
                isOpen: true,
                schoolName: school.school_name || school.name || 'School Profile',
                udiseCode: school.udise_code || school.id || '',
              });
            }}
            className="h-8 px-2.5 rounded-[12px] bg-[#EDF5FA] hover:bg-[#DDF0FC] border border-[#DDF0FC] text-[#006FCC] text-xs font-bold font-['Montserrat',sans-serif] transition-all duration-200 active:scale-[0.98] shrink-0 inline-flex items-center justify-center gap-1 cursor-pointer"
            title="Claim this school profile"
          >
            <ShieldCheck size={13} className="text-[#006FCC]" />
            <span className="text-[11px]">Claim</span>
          </button>
          
          {/* View CTA */}
          <Link
            href={profileUrl}
            className="h-8 px-3.5 rounded-[12px] bg-[#006FCC] hover:bg-[#005399] text-white text-xs font-bold font-['Montserrat',sans-serif] transition-all duration-200 active:scale-[0.98] shrink-0 inline-flex items-center justify-center shadow-xs whitespace-nowrap"
          >
            <span>View</span>
          </Link>
        </div>
      </div>
    );
  };

  const renderMapSchoolCard = (school: SchoolRecord, idx: number) => {
    const isSelected = mapSelectedSchool?.id === school.id || mapSelectedSchool?.udise_code === school.udise_code;
    const profileUrl = getSchoolUrl(school);

    return (
      <div
        key={`map-card-${school.id || school.udise_code || idx}`}
        onClick={() => handleSelectSchoolFromList(school)}
        className={`p-2.5 rounded-2xl border transition-all duration-200 cursor-pointer flex gap-2.5 text-left group ${
          isSelected
            ? 'bg-[#EDF5FA] border-[#006FCC] shadow-xs ring-2 ring-[#006FCC]/20'
            : 'bg-white border-[#E8E9E9] hover:border-[#006FCC]/50 hover:bg-[#F7F8F8] shadow-2xs'
        }`}
      >
        {/* Compact Thumbnail (w-12 h-12) */}
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-[10px] overflow-hidden bg-slate-50 border border-slate-100 shrink-0 relative">
          <img
            src={getSafeSchoolImage(school.image || (school as any).image_url)}
            alt={school.school_name || 'School'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => { e.currentTarget.src = PLACEHOLDER_EMPTY_IMAGE; }}
          />
          {school.rating && Number(school.rating) > 0 ? (
            <div className="absolute bottom-0.5 left-0.5 bg-black/75 backdrop-blur-xs text-amber-300 text-[9px] font-bold px-1 rounded flex items-center gap-0.5 leading-tight">
              <span>★</span>
              <span>{school.rating}</span>
            </div>
          ) : null}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <div>
            <div className="flex items-center justify-between gap-1">
              <h4 className="text-[12.5px] font-bold text-[#003C6E] truncate group-hover:text-[#006FCC] leading-tight font-['Montserrat',sans-serif]">
                {getCleanSchoolName(school.school_name || school.name)}
              </h4>
              {school.distance !== undefined && (
                <span className="text-[9.5px] font-bold text-[#006FCC] bg-[#EDF5FA] px-1.5 py-0.2 rounded-full shrink-0">
                  {school.distance} km
                </span>
              )}
            </div>

            <p className="text-[10.5px] text-slate-500 truncate mt-0.5 leading-tight">
              {formatCardLocation(school)}
            </p>

            <div className="flex items-center gap-1 mt-1 flex-wrap">
              {school.board && (
                <span className="text-[9.5px] font-bold text-[#006FCC] bg-[#EDF5FA] px-1.5 py-0.2 rounded-[6px]">
                  {school.board}
                </span>
              )}
              {school.management && (
                <span className="text-[9.5px] font-medium text-[#137333] bg-[#E6F4EA] px-1.5 py-0.2 rounded-[6px] truncate max-w-[130px]">
                  {school.management}
                </span>
              )}
            </div>
          </div>

          {/* Action Row — Labster 10px Buttons */}
          <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-[#E8E9E9] gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleSelectSchoolFromList(school);
                if (mobileSheetState === 'full') {
                  setMobileSheetState('half');
                }
              }}
              className="h-6 px-2.5 rounded-[10px] bg-[#EDF5FA] text-[#006FCC] hover:bg-[#DDF0FC] text-[10.5px] font-bold flex items-center gap-1 cursor-pointer transition-all duration-200 active:scale-[0.98]"
            >
              <Navigation size={10} />
              <span>Fly to Pin</span>
            </button>

            <Link
              href={profileUrl}
              onClick={(e) => e.stopPropagation()}
              className="h-6 px-3 rounded-[10px] bg-[#006FCC] text-white hover:bg-[#005399] text-[10.5px] font-bold flex items-center gap-1 transition-all duration-200 active:scale-[0.98]"
            >
              <span>Profile</span>
              <ArrowRight size={10} />
            </Link>
          </div>
        </div>
      </div>
    );
  };

  const renderTopSchoolCard = (school: SchoolRecord, idx: number) => {
    const profileUrl = getSchoolUrl(school);
    const isCompared = compareList.some((c) => c.id === school.id);
    const isLiked = likedSchoolIds.includes(school.id);
    const cardLikesCount = likesCounts[school.id] ?? ((school as any).likes_count || (school as any).likesCount || 0);
    const rawWebsite = (school as any).website || school.website || '';
    const hasWebsite = Boolean(rawWebsite && rawWebsite.trim() !== '' && rawWebsite !== '#' && !rawWebsite.includes('example.com'));
    const cleanWebsiteUrl = hasWebsite ? (rawWebsite.startsWith('http') ? rawWebsite : `https://${rawWebsite}`) : '';
    const boardName = school.board || school.board_secondary_10th || 'CBSE';
    const locationStr = formatCardLocation(school);

    return (
      <div 
        key={`top-${school.id || idx}`}
        className="w-[260px] sm:w-[280px] shrink-0 snap-start bg-white rounded-2xl overflow-hidden border border-[#E8E9E9] hover:border-[#006FCC]/40 hover:shadow-md transition-all duration-300 group flex flex-col"
      >
        {/* Compact Image */}
        <div className="relative h-36 w-full bg-slate-50 overflow-hidden shrink-0">
          <img
            src={getSafeSchoolImage(school.image || (school as any).image_url)}
            alt={school.school_name || school.name || 'School'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { e.currentTarget.src = PLACEHOLDER_EMPTY_IMAGE; }}
          />

          {/* Top Rating Badge */}
          {school.rating && Number(school.rating) > 0 ? (
            <div className="absolute top-2.5 left-2.5 bg-black/75 text-white px-2 py-0.5 rounded-[8px] text-xs font-bold flex items-center gap-1">
              <Star size={11} className="fill-amber-400 text-amber-400" />
              <span>{school.rating}</span>
            </div>
          ) : null}

          {/* Action buttons */}
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
            {hasWebsite ? (
              <a
                href={cleanWebsiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md bg-white/90 text-[#0b57d0] hover:bg-white transition shadow-xs"
                title="Official Website"
              >
                <Globe size={12} />
              </a>
            ) : (
              <button
                disabled
                className="w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md bg-white/50 text-gray-400 opacity-40 cursor-not-allowed pointer-events-none"
                title="Website Not Available"
              >
                <Globe size={12} />
              </button>
            )}
            {/* Compare Button — Google Material Symbols Balance Icon (Temporarily Hidden) */}
            {SHOW_COMPARE_BUTTON && (
              <button
                onClick={(e) => handleToggleCompare(school, e)}
                className={`w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md transition ${
                  isCompared ? 'bg-[#0b57d0] text-white' : 'bg-white/80 text-gray-700 hover:bg-white'
                }`}
                title="Compare"
              >
                <GoogleBalanceIcon size={12} />
              </button>
            )}
            <button
              type="button"
              onClick={(e) => handleToggleLike(school.id, e, school.udise_code || school.school_id)}
              className={`h-7 px-2 rounded-full flex items-center gap-1 backdrop-blur-md text-xs font-semibold transition cursor-pointer ${
                isLiked ? 'bg-rose-500 text-white' : 'bg-white/80 text-gray-700 hover:bg-white hover:text-rose-500'
              }`}
              title={isLiked ? "Liked" : "Like School"}
            >
              <Heart size={12} className={isLiked ? "fill-white text-white" : ""} />
              {cardLikesCount > 0 && <span className="text-[10px] font-bold">{cardLikesCount}</span>}
            </button>
          </div>

          {/* Admission Pill — Controlled by school profile toggle (default off/hidden) */}
          {Boolean((school as any).admissions_open || (school as any).is_admissions_open) && (
            <div className="absolute bottom-2 left-2.5 bg-emerald-600/95 text-white px-2 py-0.5 rounded-[8px] text-[10px] font-bold flex items-center gap-1 shadow-sm">
              <CheckCircle2 size={10} /> Admissions Open
            </div>
          )}
        </div>

        {/* Compact Card Body */}
        <div className="p-3.5 flex-1 flex flex-col justify-between">
          <div>
            <h2 className="font-['Montserrat',sans-serif] font-bold text-[14px] leading-snug mb-1 line-clamp-1 cursor-pointer text-[#003C6E] hover:text-[#006FCC] transition-colors" style={{ fontSize: '14.5px', color: '#003C6E' }}>
              <Link href={profileUrl} className="hover:text-[#006FCC] hover:underline transition-colors inline">
                {renderSchoolTitleWithVerified(school.school_name || school.name || 'School')}
              </Link>
            </h2>

            <div className="text-[11px] text-slate-600 flex items-start gap-1 mb-2.5 leading-snug">
              <MapPin size={11} className="text-red-500 shrink-0 mt-0.5" />
              <span className="break-words">{locationStr}</span>
            </div>

            {/* Quick Pills */}
            <div className="flex items-center gap-1.5 flex-wrap mb-3">
              <span className="text-[10px] font-bold text-[#006FCC] bg-[#EDF5FA] px-2 py-0.5 rounded-[8px] border border-[#DDF0FC]">
                {boardName}
              </span>
              <span className="text-[10px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-[8px]">
                {formatCompactClasses(school.classes || (school as any).class_range)}
              </span>
            </div>
          </div>

          {/* Bottom CTA - Labster 12px Buttons */}
          <div className="pt-2.5 border-t border-[#E8E9E9] grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={(e) => openGoogleMaps(school, e)}
              className="h-8 px-2.5 rounded-[12px] border border-[#E8E9E9] bg-[#F7F8F8] hover:bg-[#EDF5FA] text-[#003C6E] hover:text-[#006FCC] text-xs font-bold font-['Montserrat',sans-serif] inline-flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-[0.98] cursor-pointer group whitespace-nowrap min-w-0"
              title="Open location on Google Maps (Popup)"
            >
              <svg className="w-3.5 h-3.5 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                <circle cx="12" cy="9" r="2.8" fill="#FFFFFF"/>
              </svg>
              <span className="truncate">Map</span>
            </button>
            <Link
              href={profileUrl}
              className="h-8 px-3 rounded-[12px] bg-[#006FCC] hover:bg-[#005399] text-white text-xs font-bold font-['Montserrat',sans-serif] inline-flex items-center justify-center gap-1 shadow-xs hover:shadow transition-all duration-200 active:scale-[0.98] whitespace-nowrap min-w-0"
            >
              <span className="truncate">View</span>
              <ArrowRight size={12} className="shrink-0" />
            </Link>
          </div>
        </div>
      </div>
    );
  };

  // Unified Search Bar Helper (Official M3 Pill Search Bar across Full Hero and Compact Minimized Header)
  const renderSearchBar = (isCompact: boolean) => (
    <div className={`w-full ${isCompact ? 'max-w-2xl' : 'max-w-3xl'} flex flex-row items-center bg-white rounded-full ${isCompact ? 'shadow-xs px-1.5 py-0.5 border border-[#c4c7c5]' : 'shadow-[0_4px_20px_rgba(0,0,0,0.2)] p-1.5 sm:p-2 border border-white/60'} divide-x divide-[#c4c7c5]/60 transition-all duration-200 focus-within:ring-2 focus-within:ring-[#0b57d0]`}>
      {/* City Selector */}
      <div className="relative shrink-0 z-50">
        <button
          type="button"
          onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
          className={`flex items-center justify-between gap-1 px-2.5 py-1.5 transition-all duration-200 group rounded-full hover:bg-[#1f1f1f]/[0.06] active:scale-[0.98] cursor-pointer ${isCompact ? 'text-xs w-[120px] sm:w-[135px]' : 'text-sm w-[135px] sm:w-[165px]'}`}
        >
          <div className="flex items-center gap-1.5 overflow-hidden">
            <div className="p-1 rounded-full bg-[#e8f0fe] text-[#0b57d0] group-hover:scale-105 transition-transform shrink-0">
              <MapPin size={isCompact ? 12 : 15} />
            </div>
            <span className="text-[11px] sm:text-xs font-semibold text-[#1f1f1f] truncate block">
              {selectedLocation || 'Select City'}
            </span>
          </div>
          <ChevronDown size={11} className={`text-[#444746] transition-transform shrink-0 ${isLocationDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* City Dropdown Menu (Floats over all lower content) */}
        {isLocationDropdownOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsLocationDropdownOpen(false)} />
            <div className="absolute top-full left-0 mt-2 w-[280px] sm:w-[340px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.25)] border border-[#E8E9E9] z-50 overflow-hidden text-left animate-in fade-in zoom-in-95 duration-150">
              <div className="p-3 border-b border-[#E8E9E9] bg-[#F7F8F8] flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#003C6E] uppercase tracking-wider font-['Montserrat',sans-serif]">Popular Cities</span>
                {selectedLocation && (
                  <button
                    type="button"
                    onClick={handleResetToAllCities}
                    className="text-[11px] text-[#006FCC] hover:underline font-bold cursor-pointer"
                  >
                    Clear Location
                  </button>
                )}
              </div>
              <div className="p-2.5 grid grid-cols-2 gap-1.5 max-h-64 overflow-y-auto custom-scrollbar">
                {dbCitiesList.map((city) => (
                  <button
                    key={city.name}
                    type="button"
                    onClick={() => handleSelectCity(city)}
                    className={`flex items-center justify-between gap-1.5 px-3 py-2 rounded-[12px] text-xs transition-all duration-200 text-left cursor-pointer active:scale-[0.98] ${
                      selectedLocation === city.name
                        ? 'bg-[#EDF5FA] text-[#006FCC] font-bold border border-[#DDF0FC]'
                        : 'text-[#1B1F23] hover:bg-[#F7F8F8] font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={city.icon}
                        alt={city.name}
                        className="w-4 h-4 object-contain shrink-0"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://img.icons8.com/color/48/marker.png'; }}
                      />
                      <span className="truncate whitespace-nowrap">{city.name}</span>
                    </div>
                    {city.count > 0 && (
                      <span className="text-[10px] font-bold text-[#006FCC] bg-[#EDF5FA] px-1.5 py-0.2 rounded-full shrink-0">
                        {city.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <div className="p-2.5 border-t border-[#E8E9E9] bg-slate-50">
                <button
                  type="button"
                  onClick={handleResetToAllCities}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-[#006FCC] hover:bg-[#EDF5FA] active:bg-[#DDF0FC] rounded-[12px] transition-colors cursor-pointer font-['Montserrat',sans-serif]"
                >
                  <div className="flex items-center gap-1.5">
                    <Globe size={14} className="text-[#006FCC] shrink-0" />
                    <span>View All Cities (All Schools)</span>
                  </div>
                  <span className="text-[10px] font-bold bg-[#EDF5FA] text-[#006FCC] border border-[#DDF0FC] px-2 py-0.5 rounded-full">
                    {allLoadedSchools.length} Schools
                  </span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Search Input & Icon-Only Action Buttons (Search + Near Me GPS) */}
      <div className="flex flex-1 items-center justify-between bg-transparent pl-2.5 pr-1 py-0.5 min-w-0 gap-1.5">
        <div className="flex-1 flex items-center min-w-0">
          <input
            type="text"
            placeholder={isCompact ? "Search school, city, UDISE..." : "Search school, city, UDISE..."}
            value={searchMode === 'near_me' ? '' : searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setSearchMode('text'); }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleFilterChange({ q: searchTerm.trim() || undefined });
              }
            }}
            disabled={searchMode === 'near_me'}
            className="bg-transparent w-full focus:outline-none text-xs sm:text-sm text-[#1f1f1f] placeholder-[#444746]/70 font-medium min-w-0"
          />
          {searchTerm.trim() && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                handleFilterChange({ q: undefined });
              }}
              className="w-7 h-7 rounded-full hover:bg-[#1f1f1f]/[0.08] text-[#444746] hover:text-[#1f1f1f] flex items-center justify-center shrink-0 cursor-pointer transition-colors"
              title="Clear search"
              aria-label="Clear search"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Official M3 Pill Action Buttons: Search + Near Me GPS */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => handleFilterChange({ q: searchTerm.trim() || undefined })}
            className={`${isCompact ? 'w-8 h-8' : 'w-9 h-9'} rounded-full bg-[#0b57d0] hover:bg-[#0842a0] text-white flex items-center justify-center shrink-0 transition-all duration-200 shadow-xs cursor-pointer active:scale-[0.98]`}
            title="Search schools"
            aria-label="Search schools"
          >
            <Search size={isCompact ? 14 : 15} />
          </button>

          <button
            type="button"
            onClick={() => { setSearchMode('near_me'); handleNearMeSearch(); }}
            className={`${isCompact ? 'h-8 px-2.5' : 'h-9 px-3.5'} rounded-full inline-flex items-center justify-center gap-1 text-xs font-semibold shrink-0 transition-all duration-200 cursor-pointer active:scale-[0.98] ${
              searchMode === 'near_me'
                ? 'bg-[#137333] text-white shadow-xs'
                : 'bg-[#c2e7ff] text-[#001d35] hover:bg-[#b1defc]'
            }`}
            title="Near Me (GPS Location Search)"
            aria-label="Search schools near your location"
          >
            <Navigation size={isCompact ? 12 : 13} />
            <span className={isCompact ? "hidden lg:inline" : "hidden sm:inline"}>Near Me</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-gray-50 text-slate-900 font-sans flex flex-col">
      {/* ── JSON-LD Structured Data ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: query.pageTitle,
            numberOfItems: initialData.totalCount,
            itemListElement: (initialData?.schools || []).slice(0, 10).map((s, idx) => ({
              '@type': 'ListItem',
              position: idx + 1,
              name: s.school_name || s.name,
              url: `https://www.cseel.org${getSchoolUrl(s)}`
            }))
          })
        }}
      />

      {/* ── Dynamic Sidebar Attachment & Fullscreen Styles ── */}
      <style
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: `
        @media (min-width: 768px) {
          .directory-sidebar-fixed {
            top: ${navBottomOffset}px !important;
            height: calc(100vh - ${navBottomOffset}px) !important;
            max-height: calc(100vh - ${navBottomOffset}px) !important;
          }
        }
        @media (max-width: 767px) {
          ${viewMode === 'map' ? `
            html, body {
              overflow: hidden !important;
              height: 100% !important;
              height: 100dvh !important;
              max-height: 100dvh !important;
              position: fixed !important;
              width: 100% !important;
              overscroll-behavior: none !important;
              touch-action: none !important;
            }
            #site-topbar,
            .site-topbar,
            #site-navbar,
            .site-navbar,
            #universal-admin-bar,
            .universal-admin-bar,
            header,
            footer,
            .site-footer,
            .announcement-bar,
            [id*="admin-bar"],
            .offer-popup-banner {
              display: none !important;
            }
          ` : ''}
        }
        ${(isFullscreen || isMapFullscreen) ? `
          #site-topbar,
          .site-topbar,
          #site-navbar,
          .site-navbar,
          #universal-admin-bar,
          .universal-admin-bar,
          header,
          .announcement-bar,
          [id*="admin-bar"] {
            display: none !important;
          }
          aside {
            top: 0px !important;
            height: 100vh !important;
            max-height: 100vh !important;
          }
        ` : ''}
      `}} />

      {/* Floating Exit Fullscreen Button - Placed in top middle/center */}
      {(isFullscreen || isMapFullscreen) && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[99999] animate-in fade-in slide-in-from-top-2 duration-200">
          <button
            type="button"
            onClick={() => {
              setIsFullscreen(false);
              setIsMapFullscreen(false);
            }}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-900/90 hover:bg-slate-900 text-white shadow-2xl backdrop-blur-md border border-white/20 hover:scale-105 active:scale-95 transition cursor-pointer"
            title="Exit Fullscreen"
            aria-label="Exit Fullscreen"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* ── Top Nav / Breadcrumbs ── */}


      {/* ── Hero Section (Carousel & Search) with Minimise Feature ── */}
      {/* ── Hero Section (Carousel & Search) with Minimise Feature ── */}
      {!isHeroMinimized && (
        <div className={`relative z-40 min-h-[360px] sm:min-h-[400px] w-full bg-slate-950 flex flex-col items-center justify-center transition-all duration-300 ${
          viewMode === 'map' ? 'hidden md:flex' : ''
        }`}>
          {/* Carousel Background Images with Clean 45% Dark Overlay (Clipped neatly with inner overflow-hidden) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {HERO_IMAGES.map((img, idx) => (
              <div
                key={img}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  idx === currentHeroIndex ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img src={img} alt="School Campus" className="w-full h-full object-cover" />
                <div
                  className="absolute inset-0"
                  style={{ backgroundColor: 'rgba(0, 0, 0, 0.45)' }}
                />
              </div>
            ))}
          </div>

          {/* Top Controls: Compact Minimise & Add School (Top Right Corner) */}
          <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-4 z-30 flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleAddSchoolClick}
              className="hidden sm:inline-flex items-center gap-1 h-7 px-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-amber-300 hover:text-white text-[11px] font-semibold transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <PlusCircle size={11} className="text-amber-300" />
              <span>Add School</span>
            </button>

            <button
              type="button"
              onClick={() => setIsHeroMinimized(true)}
              className="inline-flex items-center gap-1 h-7 px-2.5 rounded-full bg-black/45 hover:bg-black/75 backdrop-blur-md border border-white/20 text-white/85 hover:text-white text-[11px] font-semibold transition-all cursor-pointer shadow-xs active:scale-95 group"
              title="Minimise Banner"
            >
              <Minimize2 size={11} className="text-cyan-300 group-hover:scale-110 transition-transform" />
              <span>Minimise</span>
            </button>
          </div>

          {/* Hero Content Overlay */}
          <div className="relative z-30 w-full max-w-4xl px-4 py-8 flex flex-col items-center text-center">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-3 drop-shadow-md">
              Find the Best Schools for Your Child
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-slate-200/90 max-w-2xl mb-6 drop-shadow leading-relaxed">
              Explore verified schools with comprehensive insights on STEM labs, facilities, admissions, fees, and academic boards across India.
            </p>

            {/* Centered Hero Search Bar */}
            <div className="w-full max-w-3xl flex justify-center relative z-40">
              {renderSearchBar(false)}
            </div>

            {/* Carousel Slide Indicators */}
            <div className="flex items-center gap-1.5 mt-5">
              {HERO_IMAGES.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={() => setCurrentHeroIndex(dotIdx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    dotIdx === currentHeroIndex ? 'w-6 bg-cyan-400' : 'w-1.5 bg-white/40 hover:bg-white/70'
                  }`}
                  title={`Slide ${dotIdx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}


      {/* ── Admin Access & Directory Governance Control Bar ── */}
      {isAdmin && (
        <div className={`max-w-screen-2xl mx-auto w-full px-4 md:px-6 lg:px-8 pt-4 ${
          viewMode === 'map' ? 'hidden md:block' : ''
        }`}>
          <div className="bg-slate-900 text-white p-3.5 sm:p-4 rounded-2xl shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-400">Admin Control Portal</span>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono">School Directory Governance</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Control public visibility, user verification and directory status</p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap text-xs">
              {/* Toggle Directory Listing Status */}
              <button
                type="button"
                onClick={() => {
                  const nextVal = !isListingEnabledByAdmin;
                  setIsListingEnabledByAdmin(nextVal);
                  try {
                    localStorage.setItem('cseel_schools_listing_enabled', String(nextVal));
                  } catch {}
                }}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                  isListingEnabledByAdmin
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                }`}
                title="Admin switch: Toggle school list display"
              >
                <span>Directory Display:</span>
                <span className="font-black underline">{isListingEnabledByAdmin ? 'ENABLED' : 'DISABLED (Verification Notice)'}</span>
              </button>

              {/* Verify Current Account Shortcut */}
              {user && (
                <button
                  type="button"
                  onClick={() => {
                    verifyUser(user.email || user.id);
                    alert(`Account ${user.email} verified successfully!`);
                  }}
                  className="px-3 py-1.5 rounded-xl font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40 hover:bg-blue-500/30 transition-all cursor-pointer"
                  title="Mark current account as verified"
                >
                  <CheckCircle2 size={13} className="inline mr-1" />
                  <span>Verify My Account</span>
                </button>
              )}

              {/* Simulation Mode Switcher */}
              <div className="flex items-center bg-slate-800 rounded-xl p-0.5 border border-slate-700">
                <button
                  type="button"
                  onClick={() => setAdminSimulateMode('normal')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                    adminSimulateMode === 'normal' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Admin View
                </button>
                <button
                  type="button"
                  onClick={() => setAdminSimulateMode('simulate_unverified')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                    adminSimulateMode === 'simulate_unverified' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Test Unverified
                </button>
                <button
                  type="button"
                  onClick={() => setAdminSimulateMode('simulate_public')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                    adminSimulateMode === 'simulate_public' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Test Public Guest
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Layout: Admin Dashboard Style (Sidebar + Content) ── */}
      <div className={`w-full flex flex-col md:flex-row gap-3 sm:gap-4 px-3 sm:px-4 md:pl-0 md:pr-4 lg:pr-5 pt-2 sm:pt-3 md:pt-0 pb-4 sm:pb-6 flex-1 ${
        viewMode === 'map' ? 'p-0 md:pl-0 md:pr-4 lg:pr-5 md:pb-6' : ''
      }`}>
        {/* ── 1. Modern Mobile Filter Sheet (Drawer / Bottom Sheet on < 768px) ── */}
        <SchoolFilterSheet
          mode="sheet"
          isOpen={isMobileFilterOpen}
          onClose={() => setIsMobileFilterOpen(false)}
          totalSchoolsCount={totalSchoolsCount}
          displayedCount={displayedSchools.length}
          selectedBoard={selectedBoard}
          setSelectedBoard={setSelectedBoard}
          selectedStateBoard={selectedStateBoard}
          setSelectedStateBoard={setSelectedStateBoard}
          setIsStateModalOpen={setIsStateModalOpen}
          selectedResidential={selectedResidential}
          setSelectedResidential={setSelectedResidential}
          selectedFacilities={selectedFacilities}
          toggleFacility={toggleFacility}
          setSelectedFacilities={setSelectedFacilities}
          selectedClasses={selectedClasses}
          setSelectedClasses={setSelectedClasses}
          selectedSchoolTypes={selectedSchoolTypes}
          setSelectedSchoolTypes={setSelectedSchoolTypes}
          selectedSpecialCategories={selectedSpecialCategories}
          setSelectedSpecialCategories={setSelectedSpecialCategories}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          feeMax={feeMax}
          setFeeMax={setFeeMax}
          studentMax={studentMax}
          setStudentMax={setStudentMax}
          onlyAtl={onlyAtl}
          setOnlyAtl={setOnlyAtl}
          mapRadiusKm={mapRadiusKm}
          setMapRadiusKm={setMapRadiusKm}
          sortBy={sortBy}
          setSortBy={setSortBy}
          setSearchMode={setSearchMode}
          setSearchTerm={setSearchTerm}
          handleFilterChange={handleFilterChange}
          onResetAll={handleResetAll}
        />

        {/* ── 2. Minimized Desktop Sidebar Strip (Shown when minimized, matching user image) ── */}
        {isSidebarMinimized && (
          <aside className="hidden md:flex flex-col w-12 shrink-0 md:fixed md:left-0 md:z-30 directory-sidebar-fixed rounded-none transition-all duration-300">
            <div className="bg-white rounded-none border-r border-b border-gray-200/90 shadow-xs h-full py-2.5 px-1.5 flex flex-col items-center justify-between">
              {/* Top: Expand Chevron Button */}
              <div className="flex flex-col items-center gap-3 w-full">
                <button
                  type="button"
                  onClick={() => setIsSidebarMinimized(false)}
                  className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition shadow-2xs group relative cursor-pointer"
                  title="Expand Filters"
                >
                  <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                </button>

                <div className="w-6 h-px bg-gray-200 my-1" />

                {/* Category Icons with Chevrons (matching user image) */}
                <div className="flex flex-col items-center gap-3 w-full">
                  <button
                    type="button"
                    onClick={() => setIsSidebarMinimized(false)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-gray-100 transition-colors relative group cursor-pointer"
                    title="Board Filter (Click to Expand)"
                  >
                    <Award size={16} />
                    <ChevronRight size={12} className="absolute -right-1 text-gray-400 group-hover:text-blue-600" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsSidebarMinimized(false)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-gray-100 transition-colors relative group cursor-pointer"
                    title="Class Filter (Click to Expand)"
                  >
                    <GraduationCap size={16} />
                    <ChevronRight size={12} className="absolute -right-1 text-gray-400 group-hover:text-blue-600" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsSidebarMinimized(false)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-gray-100 transition-colors relative group cursor-pointer"
                    title="School Format (Click to Expand)"
                  >
                    <Building2 size={16} />
                    <ChevronRight size={12} className="absolute -right-1 text-gray-400 group-hover:text-blue-600" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsSidebarMinimized(false)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-gray-100 transition-colors relative group cursor-pointer"
                    title="Facilities Filter (Click to Expand)"
                  >
                    <FlaskConical size={16} />
                    <ChevronRight size={12} className="absolute -right-1 text-gray-400 group-hover:text-blue-600" />
                  </button>
                </div>
              </div>

              {/* Bottom: Vertical Text */}
              <div className="[writing-mode:vertical-rl] rotate-180 text-[10px] font-bold text-gray-400 tracking-wider flex items-center gap-1.5 pb-2">
                <SlidersHorizontal size={11} className="rotate-90 text-blue-600" />
                <span>FILTERS</span>
              </div>
            </div>
          </aside>
        )}

        {/* ── 3. Desktop Filter Sidebar Mode (>= 768px Full Sidebar) ── */}
        <SchoolFilterSheet
          mode="sidebar"
          totalSchoolsCount={totalSchoolsCount}
          displayedCount={displayedSchools.length}
          selectedBoard={selectedBoard}
          setSelectedBoard={setSelectedBoard}
          selectedStateBoard={selectedStateBoard}
          setSelectedStateBoard={setSelectedStateBoard}
          setIsStateModalOpen={setIsStateModalOpen}
          selectedResidential={selectedResidential}
          setSelectedResidential={setSelectedResidential}
          selectedFacilities={selectedFacilities}
          toggleFacility={toggleFacility}
          setSelectedFacilities={setSelectedFacilities}
          selectedClasses={selectedClasses}
          setSelectedClasses={setSelectedClasses}
          selectedSchoolTypes={selectedSchoolTypes}
          setSelectedSchoolTypes={setSelectedSchoolTypes}
          selectedSpecialCategories={selectedSpecialCategories}
          setSelectedSpecialCategories={setSelectedSpecialCategories}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          feeMax={feeMax}
          setFeeMax={setFeeMax}
          studentMax={studentMax}
          setStudentMax={setStudentMax}
          onlyAtl={onlyAtl}
          setOnlyAtl={setOnlyAtl}
          mapRadiusKm={mapRadiusKm}
          setMapRadiusKm={setMapRadiusKm}
          sortBy={sortBy}
          setSortBy={setSortBy}
          setSearchMode={setSearchMode}
          setSearchTerm={setSearchTerm}
          handleFilterChange={handleFilterChange}
          onResetAll={handleResetAll}
          isSidebarMinimized={isSidebarMinimized}
          setIsSidebarMinimized={setIsSidebarMinimized}
        />

        {/* Content Area - Offset by fixed sidebar width so cards never overlap and screen scrolls smoothly */}
        <main className={`flex-1 min-w-0 flex flex-col gap-4 transition-all duration-300 ${
          isSidebarMinimized ? 'md:ml-16' : 'md:ml-[272px] lg:ml-[304px]'
        }`}>
          
          {/* Active Status & View Switcher Bar (Hidden when Map is in Fullscreen Expand Mode) */}
          {!(isMapFullscreen && viewMode === 'map') && (
            <div className={`relative z-30 transition-all ${
              viewMode === 'map'
                ? 'fixed top-2.5 inset-x-2.5 z-40 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/90 p-1.5 md:relative md:top-auto md:inset-x-auto md:z-30 md:bg-white md:rounded-t-none md:rounded-b-xl md:border-gray-200 md:shadow-xs md:p-2.5 flex flex-col gap-1.5'
                : 'bg-white p-2 sm:p-2.5 rounded-t-none rounded-b-xl border border-gray-200 shadow-xs flex flex-col gap-1.5 relative z-30'
            }`}>
              {/* ─── MOBILE VIEW (< 768px): Maximum Space Search Input with City Icon, Filter & Menu Icons ─── */}
              <div className="md:hidden flex flex-col gap-1 w-full">
                <div className="flex items-center gap-1 w-full">
                  {/* Unified Search Input Bar - takes maximum width */}
                  <div className="relative flex-1 flex items-center bg-gray-100/90 rounded-xl px-2 py-1.5 border border-gray-200 focus-within:bg-white focus-within:border-blue-500 transition-all min-w-0">
                    {/* Select City Icon & Trigger */}
                    <button
                      type="button"
                      onClick={() => setIsMobileCityDropdownOpen(!isMobileCityDropdownOpen)}
                      className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition shrink-0 pr-1.5 border-r border-gray-300 cursor-pointer"
                      title={selectedLocation ? `Selected City: ${selectedLocation}` : "Select City"}
                    >
                      <MapPin size={15} className={selectedLocation ? 'text-blue-600' : 'text-gray-500'} />
                      {selectedLocation && (
                        <span className="text-[11px] font-bold text-blue-600 max-w-[60px] truncate">
                          {selectedLocation}
                        </span>
                      )}
                      <ChevronDown size={11} className={`text-gray-400 transition-transform ${isMobileCityDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Search Text Input */}
                    <input
                      type="text"
                      placeholder={selectedLocation ? `Search in ${selectedLocation}...` : "Search school, city, UDISE..."}
                      value={searchMode === 'near_me' ? '' : searchTerm}
                      onChange={(e) => { setSearchTerm(e.target.value); setSearchMode('text'); }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleFilterChange({ q: searchTerm.trim() || undefined });
                        }
                      }}
                      className="flex-1 bg-transparent px-2 py-0.5 text-xs text-gray-800 placeholder-gray-400 font-medium focus:outline-none min-w-0"
                    />

                    {/* Clear Text Icon */}
                    {searchTerm.trim() && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchTerm('');
                          handleFilterChange({ q: undefined });
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600 shrink-0 cursor-pointer"
                        title="Clear search"
                      >
                        <X size={12} />
                      </button>
                    )}

                    {/* Search Icon (Clickable Icon - No Bulky Button) */}
                    <button
                      type="button"
                      onClick={() => handleFilterChange({ q: searchTerm.trim() || undefined })}
                      className="p-1 text-blue-600 hover:text-blue-700 active:scale-90 transition shrink-0 cursor-pointer"
                      title="Search"
                    >
                      <Search size={16} />
                    </button>

                    {/* City Dropdown Menu for Mobile */}
                    {isMobileCityDropdownOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setIsMobileCityDropdownOpen(false)} 
                        />
                        <div className="absolute top-full left-0 mt-1.5 w-[280px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden text-left animate-in fade-in duration-150">
                          <div className="p-2.5 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Popular Cities</span>
                            {selectedLocation && (
                              <button
                                type="button"
                                onClick={handleResetToAllCities}
                                className="text-[11px] text-blue-600 font-bold hover:underline cursor-pointer"
                              >
                                Clear City
                              </button>
                            )}
                          </div>
                          <div className="p-2 grid grid-cols-2 gap-1.5 max-h-56 overflow-y-auto custom-scrollbar">
                            {dbCitiesList.map((city) => (
                              <button
                                key={city.name}
                                type="button"
                                onClick={() => handleSelectCity(city)}
                                className={`flex items-center justify-between gap-1.5 p-1.5 rounded-xl text-xs text-left transition cursor-pointer ${
                                  selectedLocation === city.name
                                    ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                                    : 'text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                <div className="flex items-center gap-1.5 min-w-0">
                                  <img
                                    src={city.icon}
                                    alt=""
                                    className="w-4 h-4 object-contain shrink-0"
                                    onError={(e) => { (e.target as any).style.display = 'none'; }}
                                  />
                                  <span className="truncate">{city.name}</span>
                                </div>
                                {city.count > 0 && (
                                  <span className="text-[9.5px] font-bold text-blue-600 bg-blue-50 px-1 rounded">
                                    {city.count}
                                  </span>
                                )}
                              </button>
                            ))}
                          </div>
                          <div className="p-2 border-t border-gray-100 bg-gray-50">
                            <button
                              type="button"
                              onClick={handleResetToAllCities}
                              className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-semibold text-[#0b57d0] hover:bg-[#0b57d0]/[0.08] rounded-xl transition-colors cursor-pointer"
                            >
                              <div className="flex items-center gap-1.5">
                                <Globe size={13} className="text-[#0b57d0] shrink-0" />
                                <span>View All Cities</span>
                              </div>
                              <span className="text-[10px] font-bold bg-[#c2e7ff] text-[#001d35] px-1.5 py-0.5 rounded-full">
                                {allLoadedSchools.length} Schools
                              </span>
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Filter Icon & Trigger (Modern Badge Indicator) */}
                  <button
                    type="button"
                    onClick={() => setIsMobileFilterOpen(true)}
                    className="relative p-2 text-gray-700 hover:text-[#005689] active:scale-90 transition shrink-0 cursor-pointer rounded-xl bg-gray-100/90 hover:bg-blue-50 border border-gray-200"
                    title="Open Filters"
                  >
                    <Filter size={17} className={activeFiltersCount > 0 ? 'text-[#005689]' : 'text-gray-600'} />
                    {activeFiltersCount > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] rounded-full bg-[#005689] text-white text-[10px] font-black flex items-center justify-center px-1 shadow-xs border-2 border-white">
                        {activeFiltersCount}
                      </span>
                    )}
                  </button>

                  {/* Menu Icon & Top-Right Dropdown Popover */}
                  <div className="relative shrink-0">
                    <button
                      type="button"
                      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                      className={`p-1.5 rounded-lg transition shrink-0 cursor-pointer ${
                        isMobileMenuOpen ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 active:scale-90'
                      }`}
                      title="Directory Options"
                    >
                      <MoreVertical size={20} />
                    </button>

                    {/* Google-Inspired Top-Right Compact Popover */}
                    {isMobileMenuOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setIsMobileMenuOpen(false)} 
                        />
                        <div className="absolute top-full right-0 mt-1.5 w-48 bg-white rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.18)] border border-gray-100 py-1 z-50 text-left animate-in fade-in zoom-in-95 duration-150 divide-y divide-gray-100">
                          {/* Group 1: View Modes (Icon on left, small name on right) */}
                          <div className="p-1 space-y-0.5">
                            <div className="px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-gray-400">
                              View Layout
                            </div>

                            <button
                              type="button"
                              onClick={() => { handleViewModeChange('grid'); setIsMobileMenuOpen(false); }}
                              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                                viewMode === 'grid'
                                  ? 'bg-blue-50 text-blue-700 font-bold'
                                  : 'text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              <span className="flex items-center gap-2">
                                <LayoutGrid size={14} className={viewMode === 'grid' ? 'text-blue-600' : 'text-gray-400'} />
                                <span className="text-[11.5px]">2-Col Grid</span>
                              </span>
                              {viewMode === 'grid' && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                            </button>

                            <button
                              type="button"
                              onClick={() => { handleViewModeChange('grid3'); setIsMobileMenuOpen(false); }}
                              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                                viewMode === 'grid3'
                                  ? 'bg-blue-50 text-blue-700 font-bold'
                                  : 'text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              <span className="flex items-center gap-2">
                                <Columns3 size={14} className={viewMode === 'grid3' ? 'text-blue-600' : 'text-gray-400'} />
                                <span className="text-[11.5px]">3-Col Grid</span>
                              </span>
                              {viewMode === 'grid3' && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                            </button>

                            <button
                              type="button"
                              onClick={() => { handleViewModeChange('compact'); setIsMobileMenuOpen(false); }}
                              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                                viewMode === 'compact'
                                  ? 'bg-blue-50 text-blue-700 font-bold'
                                  : 'text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              <span className="flex items-center gap-2">
                                <List size={14} className={viewMode === 'compact' ? 'text-blue-600' : 'text-gray-400'} />
                                <span className="text-[11.5px]">Compact List</span>
                              </span>
                              {viewMode === 'compact' && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                            </button>

                            <button
                              type="button"
                              onClick={() => { handleViewModeChange('map'); setIsMobileMenuOpen(false); }}
                              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                                viewMode === 'map'
                                  ? 'bg-blue-600 text-white font-bold'
                                  : 'text-blue-700 hover:bg-blue-50'
                              }`}
                            >
                              <span className="flex items-center gap-2">
                                <Map size={14} />
                                <span className="text-[11.5px]">Map View</span>
                              </span>
                              {viewMode === 'map' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </button>
                          </div>

                          {/* Group 2: Actions (Icon on left, small name on right) */}
                          <div className="p-1 space-y-0.5">
                            <div className="px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-gray-400">
                              Actions
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                setSearchMode('near_me');
                                handleNearMeSearch();
                                setIsMobileMenuOpen(false);
                              }}
                              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-[11.5px] font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                            >
                              <MapPin size={14} className="text-emerald-600 shrink-0" />
                              <span>Near Me (GPS)</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                const next = !isFullscreen;
                                setIsFullscreen(next);
                                if (viewMode === 'map') setIsMapFullscreen(next);
                                setIsMobileMenuOpen(false);
                              }}
                              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-[11.5px] font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                            >
                              {isFullscreen ? (
                                <Minimize2 size={14} className="text-blue-600 shrink-0" />
                              ) : (
                                <Maximize2 size={14} className="text-gray-500 shrink-0" />
                              )}
                              <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setIsHeroMinimized(!isHeroMinimized);
                                setIsMobileMenuOpen(false);
                              }}
                              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-[11.5px] font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                            >
                              <Layout size={14} className="text-gray-500 shrink-0" />
                              <span>{isHeroMinimized ? 'Show Banner' : 'Hide Banner'}</span>
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Mobile Subline: Count & Quick Sort (Hidden in Map Mode) */}
                {viewMode !== 'map' && (
                  <div className="flex items-center justify-between text-[11px] text-gray-500 px-0.5 gap-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span>
                        <strong className="text-gray-900">
                          {totalSchoolsCount === 0 || displayedSchools.length === 0
                            ? '0'
                            : `${(currentPage - 1) * 25 + 1}–${Math.min((currentPage - 1) * 25 + displayedSchools.length, totalSchoolsCount)}`}
                        </strong> of <strong className="text-gray-900">{totalSchoolsCount}</strong> Schools
                      </span>
                      {selectedLocation && (
                        <span className="inline-flex items-center gap-0.5 text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded font-medium text-[10px]">
                          <MapPin size={9} />
                          {selectedLocation}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* ─── DESKTOP VIEW (>= 768px): Fully Responsive Layout (Zero Overlap on any screen width) ─── */}
              <div className="hidden md:flex flex-col xl:flex-row xl:items-center justify-between gap-2.5 w-full min-w-0">
                {/* Left/Top Group: Results count & View Mode Switcher + Banner Toggle */}
                <div className="flex items-center justify-between xl:justify-start gap-2.5 shrink-0 flex-wrap">
                  <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
                    {/* Result count */}
                    <h2 className="text-xs sm:text-[13px] font-bold text-gray-800 whitespace-nowrap mr-0.5">
                      {totalSchoolsCount === 0 || displayedSchools.length === 0
                        ? '0 Schools'
                        : `${(currentPage - 1) * 25 + 1}–${Math.min((currentPage - 1) * 25 + displayedSchools.length, totalSchoolsCount)} of ${totalSchoolsCount} Schools`}
                    </h2>
                    
                    {/* View Mode Switcher (Pure Iconic Form with Rich Hover Tooltips) */}
                    <div className="flex items-center bg-gray-100 p-0.5 rounded-lg border border-gray-200/70 shrink-0 gap-0.5">
                      {/* Standard Grid / 2 Cards per row */}
                      <div className="relative group/view">
                        <button
                          type="button"
                          onClick={() => handleViewModeChange('grid')}
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-md flex items-center justify-center transition cursor-pointer ${
                            viewMode === 'grid'
                              ? 'bg-white text-blue-600 shadow-2xs font-bold'
                              : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
                          }`}
                          aria-label="2 Columns Card Grid"
                          title="2 Columns Grid"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
                            <rect x="1" y="2" width="6" height="12" rx="1.5" />
                            <rect x="9" y="2" width="6" height="12" rx="1.5" />
                          </svg>
                        </button>
                      </div>

                      {/* 3 Columns Grid (Wide view) */}
                      <div className="relative group/view">
                        <button
                          type="button"
                          onClick={() => handleViewModeChange('grid3')}
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-md flex items-center justify-center transition cursor-pointer ${
                            viewMode === 'grid3'
                              ? 'bg-white text-blue-600 shadow-2xs font-bold'
                              : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
                          }`}
                          aria-label="3 Columns Card Grid"
                          title="3 Columns Grid"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
                            <rect x="1" y="2" width="3.8" height="12" rx="1" />
                            <rect x="6.1" y="2" width="3.8" height="12" rx="1" />
                            <rect x="11.2" y="2" width="3.8" height="12" rx="1" />
                          </svg>
                        </button>
                      </div>

                      {/* Compact List */}
                      <div className="relative group/view">
                        <button
                          type="button"
                          onClick={() => handleViewModeChange('compact')}
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-md flex items-center justify-center transition cursor-pointer ${
                            viewMode === 'compact'
                              ? 'bg-white text-blue-600 shadow-2xs font-bold'
                              : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
                          }`}
                          aria-label="Compact List Row View"
                          title="Compact List"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
                            <rect x="1" y="2" width="14" height="3" rx="1" />
                            <rect x="1" y="6.5" width="14" height="3" rx="1" />
                            <rect x="1" y="11" width="14" height="3" rx="1" />
                          </svg>
                        </button>
                      </div>

                      {/* Integrated Map View Toggle */}
                      <div className="relative group/view">
                        <button
                          type="button"
                          onClick={() => handleViewModeChange('map')}
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-md flex items-center justify-center transition cursor-pointer ${
                            viewMode === 'map'
                              ? 'bg-[#1A73E8] text-white shadow-2xs font-bold'
                              : 'text-blue-700 hover:bg-blue-100/60'
                          }`}
                          aria-label="Interactive Map View"
                        >
                          <Map size={14} />
                        </button>
                      </div>

                      {/* Divider */}
                      <div className="w-[1px] h-4 bg-gray-300 mx-0.5" />

                      {/* Fullscreen Expand / Restore Toggle (Hides Top Navigation Bar) */}
                      <div className="relative group/view">
                        <button
                          type="button"
                          onClick={() => {
                            const next = !isFullscreen;
                            setIsFullscreen(next);
                            if (viewMode === 'map') {
                              setIsMapFullscreen(next);
                            }
                          }}
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-md flex items-center justify-center transition cursor-pointer ${
                            isFullscreen
                              ? 'bg-blue-600 text-white shadow-2xs font-bold'
                              : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
                          }`}
                          aria-label={isFullscreen ? 'Exit Fullscreen' : 'Expand Fullscreen'}
                          title={isFullscreen ? 'Restore Top Bar' : 'Expand Fullscreen (Hide Navigation)'}
                        >
                          {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Show Hero Carousel Banner Button */}
                  {isHeroMinimized && (
                    <button
                      type="button"
                      onClick={() => setIsHeroMinimized(false)}
                      className="h-8 px-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 flex items-center gap-1.5 transition cursor-pointer text-xs font-semibold shrink-0 shadow-2xs"
                      title="Show Hero Banner Carousel"
                    >
                      <Layout size={13} className="text-gray-600" />
                      <span className="text-[11px]">Banner</span>
                    </button>
                  )}

                  {/* ─── 90-Degree Key Unlock Rotating Expandable "+ Add School" Button ─── */}
                  <div className="relative inline-flex items-center">
                    <button
                      type="button"
                      onClick={() => {
                        if (isAddSchoolExpanded) {
                          handleAddSchoolClick();
                        } else {
                          setIsAddSchoolExpanded(true);
                        }
                      }}
                      className={`h-8 rounded-full flex items-center justify-center transition-all duration-300 ease-out cursor-pointer shadow-sm active:scale-95 ${
                        isAddSchoolExpanded
                          ? 'px-3.5 bg-gradient-to-r from-[#003c6e] to-[#005689] text-white ring-2 ring-blue-400/40 shadow-md gap-1.5'
                          : 'w-8 bg-gradient-to-r from-[#005689] to-[#0077b6] hover:from-[#003c6e] hover:to-[#005689] text-white hover:shadow'
                      }`}
                      title={isAddSchoolExpanded ? "Click to Open School Registration Page" : "Click to unlock Add School"}
                    >
                      {/* Plus icon rotates 90 degrees like unlocking a lock key */}
                      <span
                        className={`inline-flex items-center justify-center transition-transform duration-300 ease-out ${
                          isAddSchoolExpanded ? 'rotate-90 text-amber-300' : 'rotate-0 text-white'
                        }`}
                      >
                        <Plus size={15} strokeWidth={2.8} />
                      </span>
                      {isAddSchoolExpanded && (
                        <span className="text-xs font-black tracking-wide whitespace-nowrap animate-in fade-in duration-200">
                          Add School
                        </span>
                      )}
                    </button>
                    {isAddSchoolExpanded && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsAddSchoolExpanded(false);
                        }}
                        className="ml-1 w-5 h-5 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center text-[10px] transition cursor-pointer"
                        title="Close"
                      >
                        <X size={11} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Right/Bottom Section: Search Bar (When Hero is Minimized) */}
                {isHeroMinimized && (
                  <div className="flex-1 w-full xl:max-w-xl 2xl:max-w-2xl min-w-0">
                    {renderSearchBar(true)}
                  </div>
                )}
              </div>



              <Link href="/about" className="text-blue-500 hover:text-blue-700 hover:underline text-[11px] sm:text-xs font-semibold transition-colors inline-block w-fit">
                What is Experiential Science Lab?
              </Link>
            </div>
          )}

          {/* ── Conditional Display: Auth & Verification Gate vs School Cards ── */}
          {isGuest ? (
            /* 1. Public Visitor: NOT logged in ("Login first to see the school") */
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-lg p-6 sm:p-10 md:p-12 text-center my-4 space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#005689] to-[#0084cc] text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20">
                <Lock className="w-8 h-8" />
              </div>

              <div className="space-y-2.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold uppercase tracking-wider">
                  <ShieldAlert className="w-3.5 h-3.5 text-blue-600" />
                  <span>Member Access Only</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Sign in to Access School Directory
                </h3>
                <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                  Please log in to explore comprehensive school profiles, fee structures, ratings, and academic facilities. Full directory details are accessible exclusively to verified members.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-md mx-auto">
                {/* Google Sign In Button */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading}
                  className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2.5 px-5 py-3 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm shadow-xs hover:shadow transition-all cursor-pointer disabled:opacity-60"
                >
                  {googleLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
                  ) : (
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                  )}
                  <span>Login with Google</span>
                </button>

                {/* Email Sign In Button */}
                <Link
                  href="/login"
                  className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#005689] hover:bg-[#003c6e] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In with Email</span>
                </Link>
              </div>
            </div>
          ) : isListingDisabled || isUserUnverified ? (
            /* 2. Logged In, but Admin disabled list OR user unverified */
            <div className="bg-white rounded-3xl border border-amber-200/90 bg-gradient-to-br from-amber-50/50 via-white to-orange-50/30 shadow-lg p-6 sm:p-10 md:p-12 text-center my-4 space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-amber-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
                <RefreshCw className="w-8 h-8 animate-spin" />
              </div>

              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                  <span>Verification in Progress</span>
                </div>

                <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                  School Directory Verification in Progress
                </h3>

                <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                  We are continuously auditing and verifying institutional profiles. The comprehensive school directory will be displayed here once administrative review is complete.
                </p>

                {effectiveUser && (
                  <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 text-left space-y-1.5 max-w-md mx-auto">
                    <div className="font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Account Logged In: {effectiveUser.email}</span>
                    </div>
                    <p className="text-amber-800 text-[11px] pl-6">
                      {isListingDisabled
                        ? 'Administrative notice: School directory display is currently set to verification review mode by administrator.'
                        : 'Your account is queued for admin approval. Once verified by our administration team, full directory access will be unlocked.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* 3. Authorized View: Display Schools & Pagination */
            <>
              {/* Top Pagination Bar (Strictly max 25 schools per page, shown above school cards) */}
              {viewMode !== 'map' && renderPaginationBar('top')}

              {/* School Cards: Map, Grid, or Compact List */}
              {viewMode === 'map' ? (
                <div className={`fixed inset-0 z-20 w-screen h-[100dvh] rounded-none border-none my-0 overflow-hidden flex flex-col md:relative md:inset-auto md:z-auto md:w-full md:rounded-3xl md:border md:border-slate-200/90 md:my-1 md:flex-row bg-slate-50 transition-all duration-300 ${
                  (isMapFullscreen || isFullscreen)
                    ? 'md:h-[calc(100vh-1rem)] md:my-0'
                    : 'md:h-[calc(100vh-140px)] md:min-h-[520px] md:max-h-[820px] md:sm:h-[680px] md:h-[760px]'
                }`}>
                  
                  {/* ─── DESKTOP SIDE SHEET / DRAWER (Left side of map, collapsible, pullable, minimizable) ─── */}
                  {!isMapSheetHidden && (
                    <div
                      className={`hidden md:flex flex-col bg-white/95 backdrop-blur-xl border-r border-slate-200 shadow-xl transition-all duration-300 z-20 shrink-0 h-full relative rounded-l-3xl overflow-hidden ${
                        isMapSheetMinimized
                          ? 'w-14'
                          : isMapSheetWide
                          ? 'w-[480px]'
                          : 'w-[320px] lg:w-[380px]'
                      }`}
                    >
                      {/* Minimized Vertical Bar */}
                      {isMapSheetMinimized ? (
                        <div className="flex flex-col items-center py-4 h-full justify-between">
                          <button
                            type="button"
                            onClick={() => setIsMapSheetMinimized(false)}
                            className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition shadow-2xs group relative cursor-pointer"
                            title="Expand School Results"
                          >
                            <ChevronRight size={18} className="group-hover:scale-110 transition-transform" />
                            <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-[11px] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-30">
                              Show Results List ({schoolsForMap.length})
                            </span>
                          </button>

                          <div className="[writing-mode:vertical-rl] rotate-180 text-xs font-bold text-gray-500 tracking-wider flex items-center gap-2">
                            <span>{schoolsForMap.length} Points</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            <span>Batch {mapLoadedPage}/{totalPages}</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => setIsMapSheetHidden(true)}
                            className="w-8 h-8 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 flex items-center justify-center transition cursor-pointer"
                            title="Close Sheet"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        /* Expanded Desktop Sheet */
                        <div className="flex flex-col h-full overflow-hidden">
                          {/* Sheet Header */}
                          <div className="p-3.5 border-b border-gray-200 bg-slate-50/70 shrink-0 space-y-2.5">
                            {/* Title & Action Handles */}
                            <div className="flex items-center justify-between gap-1.5">
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                                  {schoolsForMap.length}
                                </div>
                                <div className="truncate">
                                  <h3 className="text-xs font-bold text-gray-900 truncate">
                                    Schools on Map
                                  </h3>
                                  <p className="text-[10px] text-gray-500 truncate">
                                    {totalSchoolsCount} total • {mapRadiusKm}km radius
                                  </p>
                                </div>
                              </div>

                              {/* Sheet Window Controls (Fullscreen Expand, Pull wide, Minimize, Hide) */}
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const next = !isMapFullscreen;
                                    setIsMapFullscreen(next);
                                    setIsFullscreen(next);
                                  }}
                                  className={`w-7 h-7 rounded-lg border transition cursor-pointer flex items-center justify-center ${
                                    (isMapFullscreen || isFullscreen)
                                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                                      : 'border-gray-200 hover:bg-gray-100 text-gray-600'
                                  }`}
                                  title={(isMapFullscreen || isFullscreen) ? 'Restore View (Show Top Bar)' : 'Expand Fullscreen (Hide Top Bar & Maximize Space)'}
                                >
                                  {(isMapFullscreen || isFullscreen) ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setIsMapSheetWide(!isMapSheetWide)}
                                  className="w-7 h-7 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-600 flex items-center justify-center transition cursor-pointer"
                                  title={isMapSheetWide ? 'Narrow Sheet' : 'Widen Sheet (Pull)'}
                                >
                                  <Columns2 size={13} className={isMapSheetWide ? 'rotate-90' : ''} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setIsMapSheetMinimized(true)}
                                  className="w-7 h-7 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-600 flex items-center justify-center transition cursor-pointer"
                                  title="Minimize to side strip"
                                >
                                  <Minus size={13} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setIsMapSheetHidden(true)}
                                  className="w-7 h-7 rounded-lg border border-gray-200 hover:bg-rose-50 hover:text-rose-600 text-gray-400 flex items-center justify-center transition cursor-pointer"
                                  title="Hide Sheet"
                                >
                                  <X size={13} />
                                </button>
                              </div>
                            </div>

                            {/* Compact Control Row 1: Display Mode & Batch Info */}
                            <div className="flex items-center justify-between gap-1.5 flex-wrap">
                              {/* Display Mode Pills */}
                              <div className="flex items-center bg-gray-200/80 p-0.5 rounded-lg text-[10px] font-bold">
                                <button
                                  type="button"
                                  onClick={() => setMapDisplayMode('page')}
                                  className={`px-2 py-0.5 rounded-md transition cursor-pointer ${
                                    mapDisplayMode === 'page'
                                      ? 'bg-white text-blue-600 shadow-2xs'
                                      : 'text-gray-600 hover:text-gray-900'
                                  }`}
                                  title="Show current page 25 schools"
                                >
                                  25 Page
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setMapDisplayMode('accumulate')}
                                  className={`px-2 py-0.5 rounded-md transition cursor-pointer ${
                                    mapDisplayMode === 'accumulate'
                                      ? 'bg-white text-emerald-600 shadow-2xs'
                                      : 'text-gray-600 hover:text-gray-900'
                                  }`}
                                  title="Accumulate 25 points at a time on map"
                                >
                                  +Add ({accumulatedSchools.length})
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setMapDisplayMode('all_dots')}
                                  className={`px-2 py-0.5 rounded-md transition cursor-pointer ${
                                    mapDisplayMode === 'all_dots'
                                      ? 'bg-[#EA4335] text-white shadow-2xs'
                                      : 'text-gray-600 hover:text-gray-900'
                                  }`}
                                  title="Show all schools as red dots on map"
                                >
                                  All Dots
                                </button>
                              </div>

                              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">
                                25 pts / batch
                              </span>
                            </div>

                            {/* Compact Control Row 2: Radius Selector & In-list Search */}
                            <div className="flex items-center gap-1.5">
                              {/* In-list filter search input */}
                              <div className="relative flex-1 min-w-0">
                                <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                  type="text"
                                  value={mapListSearch}
                                  onChange={(e) => setMapListSearch(e.target.value)}
                                  placeholder="Filter name, board, area..."
                                  className="w-full pl-7 pr-6 py-1 bg-white border border-gray-200 rounded-lg text-xs placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                                {mapListSearch && (
                                  <button
                                    type="button"
                                    onClick={() => setMapListSearch('')}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                  >
                                    <X size={11} />
                                  </button>
                                )}
                              </div>

                              {/* Radius Quick Selector */}
                              <div className="flex items-center gap-0.5 shrink-0 bg-white p-0.5 rounded-lg border border-gray-200">
                                {[1, 3, 5, 10].map((km) => (
                                  <button
                                    key={km}
                                    type="button"
                                    onClick={() => setMapRadiusKm(km)}
                                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
                                      mapRadiusKm === km
                                        ? 'bg-gray-900 text-white shadow-2xs'
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                    title={`${km} km radius`}
                                  >
                                    {km}k
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Scrollable School Cards List */}
                          <div className="flex-1 overflow-y-auto p-2.5 space-y-2 custom-scrollbar">
                            {mapFilteredSchools.length > 0 ? (
                              mapFilteredSchools.map((school, idx) => renderMapSchoolCard(school, idx))
                            ) : (
                              <div className="p-8 text-center text-gray-400 text-xs">
                                No schools match &quot;{mapListSearch}&quot;
                              </div>
                            )}
                          </div>

                          {/* Sheet Bottom Footer: Add Next 25 Points on Map */}
                          <div className="p-2.5 border-t border-gray-200 bg-slate-50 shrink-0 flex flex-col gap-1.5">
                            <div className="flex items-center justify-between text-xs text-gray-600 font-medium">
                              <span>
                                Map Points: <strong className="text-gray-900">{schoolsForMap.length}</strong> of{' '}
                                <strong className="text-gray-900">{totalSchoolsCount}</strong>
                              </span>
                              <span className="text-[11px] text-emerald-700 font-semibold">
                                (+25 pts / click)
                              </span>
                            </div>

                            {hasMoreSchools ? (
                              <button
                                type="button"
                                onClick={loadNextBatch}
                                disabled={isLoadingMore}
                                className="w-full py-2 px-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50 cursor-pointer"
                              >
                                {isLoadingMore ? (
                                  <>
                                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Adding 25 points...</span>
                                  </>
                                ) : (
                                  <>
                                    <PlusCircle size={14} />
                                    <span>Add Next 25 Points on Map</span>
                                  </>
                                )}
                              </button>
                            ) : (
                              <div className="text-center text-[11px] text-gray-500 font-semibold py-1">
                                ✓ All {totalSchoolsCount} school points added on map
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Re-open Button if Desktop Sheet is Hidden */}
                  {isMapSheetHidden && (
                    <button
                      type="button"
                      onClick={() => setIsMapSheetHidden(false)}
                      className="hidden md:flex absolute top-4 left-4 z-30 items-center gap-2 px-3 py-2 bg-white/95 backdrop-blur-md rounded-full border border-gray-200 shadow-md hover:bg-white text-xs font-bold text-blue-600 transition cursor-pointer"
                    >
                      <List size={14} />
                      <span>Show Schools List ({schoolsForMap.length})</span>
                    </button>
                  )}

                  {/* ─── MAP CANVAS (Takes rest of container on Desktop, full height on Mobile) ─── */}
                  <div className="flex-1 h-full relative min-w-0">
                    <SchoolFinderMap
                      className="rounded-none md:rounded-r-3xl md:rounded-l-none"
                      searchCenter={searchCenter}
                      mapFocus={mapFocus}
                      radiusKm={mapRadiusKm}
                      schools={schoolsForMap}
                      allSchoolsDots={allSchoolsMapPoints}
                      showAllRedDots={mapDisplayMode === 'all_dots'}
                      selectedSchool={mapSelectedSchool}
                      onSelectSchool={(school) => handleSelectSchoolFromList(school as SchoolRecord, true)}
                      onOpenDetails={(school) => router.push(getSchoolUrl(school as SchoolRecord))}
                      onLocationChange={handleLocationChange}
                      onLocateMe={handleLocateMe}
                      isLocating={isLocating}
                      mobileSheetState={mobileSheetState}
                    />
                  </div>

                  {/* ─── MOBILE BOTTOM DRAWER / SHEET ─── */}
                  <div
                    className={`md:hidden absolute inset-x-0 bottom-0 z-30 bg-white/95 backdrop-blur-xl border-t border-gray-200/90 shadow-[0_-8px_30px_rgba(0,0,0,0.18)] flex flex-col transition-all duration-300 ease-in-out ${
                      mobileSheetState === 'peek'
                        ? 'h-[58px]'
                        : mobileSheetState === 'half'
                        ? 'h-[50vh]'
                        : 'h-[86vh]'
                    }`}
                  >
                    {/* Visual drag pill handle */}
                    <div 
                      className="w-12 h-1 bg-gray-300/80 rounded-full mx-auto my-1 shrink-0 cursor-pointer active:bg-gray-400 transition" 
                      onClick={() => {
                        setMobileSheetState(
                          mobileSheetState === 'peek' ? 'half' : mobileSheetState === 'half' ? 'full' : 'peek'
                        );
                      }}
                      title="Pull or toggle results sheet"
                    />

                    {/* Header Strip with Segmented Tabs */}
                    <div className="w-full px-3 py-1 flex items-center justify-between gap-2 border-b border-gray-100 shrink-0 bg-white/90">
                      {/* Segmented View Switcher: Map, Split, Cards */}
                      <div className="flex items-center bg-gray-100 p-0.5 rounded-lg text-xs font-bold shrink-0 shadow-2xs">
                        <button
                          type="button"
                          onClick={() => setMobileSheetState('peek')}
                          className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 cursor-pointer ${
                            mobileSheetState === 'peek'
                              ? 'bg-white text-blue-600 shadow-2xs'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          <MapPin size={11} />
                          <span>Map</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setMobileSheetState('half')}
                          className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 cursor-pointer ${
                            mobileSheetState === 'half'
                              ? 'bg-white text-blue-600 shadow-2xs'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          <Columns2 size={11} className="rotate-90" />
                          <span>Split</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setMobileSheetState('full')}
                          className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 cursor-pointer ${
                            mobileSheetState === 'full'
                              ? 'bg-white text-blue-600 shadow-2xs'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          <List size={11} />
                          <span>Points ({schoolsForMap.length})</span>
                        </button>
                      </div>

                      {/* Right summary indicator with toggle chevron */}
                      <button
                        type="button"
                        onClick={() => {
                          setMobileSheetState(
                            mobileSheetState === 'peek' ? 'half' : mobileSheetState === 'half' ? 'full' : 'peek'
                          );
                        }}
                        className="flex items-center gap-1 text-[11px] font-bold text-gray-500 hover:text-gray-800 cursor-pointer shrink-0"
                      >
                        <span className="hidden xs:inline">{schoolsForMap.length}/{totalSchoolsCount}</span>
                        <ChevronUp
                          size={14}
                          className={`transition-transform duration-300 ${
                            mobileSheetState === 'full' ? 'rotate-180' : mobileSheetState === 'peek' ? '' : 'rotate-90'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Secondary Controls: Search, Radius, Mode (Shown in Half & Full mode) */}
                    {mobileSheetState !== 'peek' && (
                      <div className="px-3 py-2 border-b border-gray-100 bg-slate-50/80 space-y-1.5 shrink-0">
                        {/* Row 1: Search & Radius */}
                        <div className="flex items-center gap-2">
                          <div className="relative flex-1 min-w-0">
                            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                              type="text"
                              value={mapListSearch}
                              onChange={(e) => setMapListSearch(e.target.value)}
                              placeholder="Filter name, board..."
                              className="w-full pl-7 pr-6 py-1 bg-white border border-gray-200 rounded-lg text-xs placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            {mapListSearch && (
                              <button
                                type="button"
                                onClick={() => setMapListSearch('')}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              >
                                <X size={11} />
                              </button>
                            )}
                          </div>

                          {/* Radius quick buttons */}
                          <div className="flex items-center gap-0.5 shrink-0 bg-white p-0.5 rounded-lg border border-gray-200">
                            {[1, 3, 5, 10].map((km) => (
                              <button
                                key={km}
                                type="button"
                                onClick={() => setMapRadiusKm(km)}
                                className={`px-1.5 py-0.5 rounded text-[10px] font-bold cursor-pointer transition ${
                                  mapRadiusKm === km
                                    ? 'bg-gray-900 text-white shadow-2xs'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                              >
                                {km}k
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Row 2: Batch Info & Map Display Mode */}
                        <div className="flex items-center justify-between gap-1 overflow-x-auto scrollbar-none">
                          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100 shrink-0">
                            25 pts / batch
                          </span>

                          {/* Map Mode */}
                          <div className="flex items-center gap-0.5 bg-white p-0.5 rounded-lg border border-gray-200 text-[10px] shrink-0">
                            <button
                              type="button"
                              onClick={() => setMapDisplayMode('page')}
                              className={`px-2 py-0.5 rounded font-bold cursor-pointer ${
                                mapDisplayMode === 'page' ? 'bg-blue-50 text-blue-600 font-black' : 'text-gray-600'
                              }`}
                            >
                              25 Page
                            </button>
                            <button
                              type="button"
                              onClick={() => setMapDisplayMode('accumulate')}
                              className={`px-2 py-0.5 rounded font-bold cursor-pointer ${
                                mapDisplayMode === 'accumulate' ? 'bg-emerald-50 text-emerald-600 font-black' : 'text-gray-600'
                              }`}
                            >
                              +Add ({accumulatedSchools.length})
                            </button>
                            <button
                              type="button"
                              onClick={() => setMapDisplayMode('all_dots')}
                              className={`px-2 py-0.5 rounded font-bold cursor-pointer ${
                                mapDisplayMode === 'all_dots' ? 'bg-[#EA4335] text-white font-black' : 'text-gray-600'
                              }`}
                            >
                              All Dots
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Scrollable School Cards */}
                    {mobileSheetState !== 'peek' && (
                      <div className="flex-1 overflow-y-auto p-2.5 space-y-2 touch-pan-y overscroll-contain custom-scrollbar">
                        {mapFilteredSchools.length > 0 ? (
                          mapFilteredSchools.map((school, idx) => renderMapSchoolCard(school, idx))
                        ) : (
                          <div className="p-6 text-center text-gray-400 text-xs">
                            No schools match &quot;{mapListSearch}&quot;
                          </div>
                        )}
                      </div>
                    )}

                    {/* Mobile Footer: Add Next 25 Points on Map */}
                    {mobileSheetState !== 'peek' && (
                      <div className="p-2 border-t border-gray-100 bg-white flex items-center justify-between gap-2 shrink-0">
                        <span className="text-[11px] font-bold text-gray-700">
                          {schoolsForMap.length} / {totalSchoolsCount} Points
                        </span>
                        {hasMoreSchools ? (
                          <button
                            type="button"
                            onClick={loadNextBatch}
                            disabled={isLoadingMore}
                            className="px-3 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1 disabled:opacity-50 cursor-pointer shadow-2xs"
                          >
                            {isLoadingMore ? 'Adding 25...' : '+ Add 25 Points'}
                          </button>
                        ) : (
                          <span className="text-[10px] text-gray-500 font-medium">All points added</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : viewMode === 'compact' ? (
                <div className="flex flex-col gap-2.5 sm:gap-3 touch-pan-y overscroll-contain mt-2 sm:mt-2.5 w-full">
                  {displayedSchools.slice(0, 25).map((school, idx) => renderCompactSchoolRow(school, idx))}
                </div>
              ) : viewMode === 'grid3' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-5 touch-pan-y overscroll-contain mt-2 sm:mt-2.5 w-full">
                  {displayedSchools.slice(0, 25).map((school, idx) => renderSchoolCard(school, idx))}
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-3.5 sm:gap-5 touch-pan-y overscroll-contain mt-2 sm:mt-2.5 w-full">
                  {displayedSchools.slice(0, 25).map((school, idx) => renderSchoolCard(school, idx))}
                </div>
              )}

              {displayedSchools.length === 0 && (
                <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center my-4">
                  <Building2 size={40} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-bold text-gray-800">No schools match your search</h3>
                  <p className="text-gray-500 mt-2">Try adjusting your filters or location settings.</p>
                </div>
              )}

              {/* Bottom Pagination Bar (Strictly max 25 schools per page, shown below school cards) */}
              {viewMode !== 'map' && renderPaginationBar('bottom')}
            </>
          )}
        </main>
      </div>

      {/* ── Top Rated Schools Section (Horizontal Scroll Carousel) ── */}
      {canViewSchools && topSchools.length > 0 && (
        <div className={`w-full bg-gray-50/80 py-8 sm:py-10 border-t border-gray-200 ${
          viewMode === 'map' ? 'hidden md:block' : ''
        }`}>
          <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-4 sm:mb-5">
              <div className="flex items-center gap-2">
                <Star className="text-amber-500 fill-amber-500" size={22} />
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  Top Rated Schools
                </h2>
                <span className="text-xs text-gray-400 font-medium hidden sm:inline">
                  (Swipe horizontally to explore)
                </span>
              </div>

              {/* Navigation arrows for desktop/tablet */}
              <div className="hidden sm:flex items-center gap-1.5">
                <button
                  onClick={() => {
                    const el = document.getElementById('top-schools-slider');
                    if (el) el.scrollBy({ left: -300, behavior: 'smooth' });
                  }}
                  className="w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-gray-100 flex items-center justify-center text-gray-600 transition shadow-xs"
                  title="Scroll Left"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => {
                    const el = document.getElementById('top-schools-slider');
                    if (el) el.scrollBy({ left: 300, behavior: 'smooth' });
                  }}
                  className="w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-gray-100 flex items-center justify-center text-gray-600 transition shadow-xs"
                  title="Scroll Right"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Horizontal scroll container with compact cards */}
            <div
              id="top-schools-slider"
              className="flex gap-4 overflow-x-auto pb-4 pt-1 custom-scrollbar snap-x snap-mandatory scroll-smooth w-full px-1.5 touch-pan-x overscroll-x-contain"
            >
              {topSchools.map((school, idx) => renderTopSchoolCard(school, idx))}
            </div>
          </div>
        </div>
      )}

      {/* Compare Modal */}
      {isCompareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 relative">
            <button onClick={() => setIsCompareModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-900">
              <X size={24} />
            </button>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Scale className="text-blue-600" /> Compare Schools</h3>
            {/* Simple table for compare */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="p-3">Parameters</th>
                    {compareList.map(c => <th key={c.id} className="p-3 font-bold">{c.school_name || c.name}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr><td className="p-3 font-semibold">Board</td>{compareList.map(c => <td key={c.id} className="p-3">{c.board || 'CBSE'}</td>)}</tr>
                  <tr><td className="p-3 font-semibold">Rating</td>{compareList.map(c => <td key={c.id} className="p-3 text-amber-600 font-bold">{c.rating && Number(c.rating) > 0 ? `★ ${c.rating}` : 'Verified'}</td>)}</tr>
                  <tr><td className="p-3 font-semibold">Classes</td>{compareList.map(c => <td key={c.id} className="p-3">{c.classes || 'Class 1st - 10th'}</td>)}</tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {/* State Board Modal - Compact & Mobile Friendly (z-[80] so it sits above the filter sheet) */}
      {isStateModalOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div 
            className="fixed inset-0"
            onClick={() => setIsStateModalOpen(false)}
          />
          <div className="relative bg-white rounded-2xl max-w-sm w-full p-4 shadow-2xl border border-gray-150 z-10 flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-gray-100">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <MapPin size={13} />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 leading-tight">Select State Board</h3>
                  <p className="text-[10px] text-gray-500">Choose state curriculum board</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsStateModalOpen(false)} 
                className="w-7 h-7 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 flex items-center justify-center transition cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Quick Search State Input */}
            <div className="relative mb-2.5">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={stateSearchQuery}
                onChange={(e) => setStateSearchQuery(e.target.value)}
                placeholder="Search state (e.g. Haryana, Delhi)..."
                className="w-full pl-7 pr-6 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {stateSearchQuery && (
                <button
                  type="button"
                  onClick={() => setStateSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 cursor-pointer"
                >
                  <X size={11} />
                </button>
              )}
            </div>

            {/* Compact States Grid */}
            <div className="grid grid-cols-2 gap-1.5 overflow-y-auto max-h-56 p-0.5 custom-scrollbar">
              {['Andhra Pradesh', 'Assam', 'Bihar', 'Delhi', 'Gujarat', 'Haryana', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Odisha', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal']
                .filter(st => st.toLowerCase().includes(stateSearchQuery.toLowerCase()))
                .map((state) => {
                  const isChecked = selectedStateBoard === state;
                  return (
                    <button
                      key={state}
                      type="button"
                      onClick={() => {
                        setSelectedStateBoard(isChecked ? null : state);
                        setSelectedBoard('State Board');
                      }}
                      className={`flex items-center justify-between px-2.5 py-1.5 border rounded-xl text-xs transition-all text-left cursor-pointer ${
                        isChecked
                          ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold shadow-2xs'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-slate-50 text-gray-700 font-medium'
                      }`}
                    >
                      <span className="truncate">{state}</span>
                      {isChecked && <Check size={12} className="text-blue-600 shrink-0 ml-1" />}
                    </button>
                  );
                })}
            </div>

            {/* Footer Actions */}
            <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedStateBoard(null);
                  setSelectedBoard('all');
                  handleFilterChange({ board: undefined });
                  setIsStateModalOpen(false);
                }}
                className="text-xs font-semibold text-gray-500 hover:text-gray-800 transition cursor-pointer"
              >
                Clear
              </button>

              <button
                type="button"
                onClick={() => {
                  if (selectedStateBoard) {
                    setSelectedBoard('State Board');
                    handleFilterChange({ board: 'State Board', q: selectedStateBoard });
                  }
                  setIsStateModalOpen(false);
                }}
                className="px-4 py-1.5 bg-[#006FCC] hover:bg-[#005499] text-white rounded-xl text-xs font-bold shadow-2xs transition cursor-pointer"
              >
                Apply State Board
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Google Maps In-Screen Popup Modal ── */}
      {googleMapModalSchool && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-slate-900/75 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setGoogleMapModalSchool(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-slate-200/80 relative flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-start justify-between gap-3 bg-gradient-to-r from-slate-50 to-white">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center shrink-0 shadow-xs">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                    <circle cx="12" cy="9" r="2.8" fill="#FFFFFF"/>
                  </svg>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                      {getCleanSchoolName(googleMapModalSchool.school_name || googleMapModalSchool.name)}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded-full shrink-0">
                      <CheckCircle2 size={11} className="text-emerald-600 fill-emerald-100" />
                      <span>Verified</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 truncate">
                    <span className="truncate">
                      {formatCardLocation(googleMapModalSchool)}
                    </span>
                    {googleMapModalSchool.distance !== undefined && (
                      <span className="shrink-0 font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-full text-[10px]">
                        📍 {googleMapModalSchool.distance < 1 ? `${Math.round(googleMapModalSchool.distance * 1000)}m away` : `${googleMapModalSchool.distance} km away`}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <button 
                onClick={() => setGoogleMapModalSchool(null)} 
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition shrink-0 cursor-pointer"
                title="Close Map"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body: Interactive Leaflet Map (Guaranteed No Iframe Blocking) */}
            <div className="relative w-full h-[380px] sm:h-[480px] bg-slate-100 overflow-hidden">
              <div ref={modalMapContainerRef} className="w-full h-full min-h-[380px] sm:min-h-[480px] z-0" />
            </div>

            {/* Modal Footer: Action Buttons */}
            <div className="p-3.5 sm:p-4 border-t border-slate-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="font-semibold text-slate-700">Board:</span> {googleMapModalSchool.board || 'CBSE'}
                <span>•</span>
                <span className="font-semibold text-slate-700">Classes:</span> {googleMapModalSchool.classes || 'Nursery - 12th'}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <a
                  href={
                    googleMapModalSchool.lat && googleMapModalSchool.lng
                      ? `https://www.google.com/maps/dir/?api=1&destination=${googleMapModalSchool.lat},${googleMapModalSchool.lng}`
                      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          `${googleMapModalSchool.school_name || googleMapModalSchool.name}, ${googleMapModalSchool.district_name || ''}`
                        )}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-full text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition"
                >
                  <Compass size={15} />
                  <span>Get Directions</span>
                </a>

                <Link
                  href={getSchoolUrl(googleMapModalSchool)}
                  onClick={() => setGoogleMapModalSchool(null)}
                  className="flex-1 sm:flex-none px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs sm:text-sm font-bold flex items-center justify-center gap-1 shadow-sm transition"
                >
                  <span>Profile</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Floating Key-Unlock Expandable "+ Add School" Floating Action Button ── */}
      <aside aria-label="Add School Floating Button" className="fixed bottom-6 right-6 z-40 flex items-center gap-1.5 animate-in fade-in slide-in-from-bottom-3 duration-300">
        <button
          type="button"
          onClick={() => {
            if (isAddSchoolExpanded) {
              handleAddSchoolClick();
            } else {
              setIsAddSchoolExpanded(true);
            }
          }}
          className={`rounded-full flex items-center justify-center transition-all duration-300 ease-out cursor-pointer shadow-2xl active:scale-95 border-2 border-white/50 ${
            isAddSchoolExpanded
              ? 'h-12 px-5 bg-gradient-to-r from-[#003c6e] via-[#005689] to-[#0284c7] text-white ring-4 ring-blue-500/30 gap-2 shadow-blue-900/40'
              : 'w-12 h-12 bg-gradient-to-tr from-[#005689] to-[#0284c7] hover:from-[#003c6e] hover:to-[#005689] text-white hover:scale-105'
          }`}
          title={isAddSchoolExpanded ? "Click to open Add School page" : "Click to unlock Add School"}
        >
          {/* 90-degree key rotation animation like unlocking a lock key */}
          <span
            className={`inline-flex items-center justify-center transition-transform duration-300 ease-out ${
              isAddSchoolExpanded ? 'rotate-90 text-amber-300' : 'rotate-0 text-white'
            }`}
          >
            <Plus size={22} strokeWidth={2.8} />
          </span>

          {isAddSchoolExpanded && (
            <span className="text-sm font-black tracking-wide whitespace-nowrap animate-in fade-in duration-200">
              Add School
            </span>
          )}
        </button>

        {isAddSchoolExpanded && (
          <button
            type="button"
            onClick={() => setIsAddSchoolExpanded(false)}
            className="w-7 h-7 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-90"
            title="Minimize Add School button"
          >
            <X size={14} />
          </button>
        )}
      </aside>

      {/* ── Add School Profile Modal ── */}
      <AddSchoolModal
        isOpen={isAddSchoolModalOpen}
        onClose={() => setIsAddSchoolModalOpen(false)}
        currentUser={user}
      />

      {/* ── Claim School Profile Modal ── */}
      <ClaimSchoolModal
        isOpen={claimModalData.isOpen}
        onClose={() => setClaimModalData({ isOpen: false, schoolName: '', udiseCode: '' })}
        schoolName={claimModalData.schoolName}
        udiseCode={claimModalData.udiseCode}
        currentUser={user}
      />
    </div>
  );
}

