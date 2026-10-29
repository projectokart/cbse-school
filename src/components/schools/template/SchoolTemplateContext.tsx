'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchSchoolByUdise, UdiseSchoolData } from '@/lib/services/udiseService';
import { schoolSearchSupabase } from '@/integrations/supabase/schoolSearchClient';
import {
  BLANK_AI_SCHOOL_SCHEMA,
  parseSchoolJsonToState,
  convertStateToStructuredJson,
  ImportSummary,
} from './SchoolJsonSchemaHelper';

export interface FacilityCardItem {
  id: string;
  title: string;
  desc: string;
  points?: string[];
  icon: string;
  illustration?: string;
  badge?: string;
}

export interface AdmissionCardItem {
  id: string;
  title: string;
  criteria: string;
  points?: string[];
  fees?: string;
  icon: string;
  illustration?: string;
  badge?: string;
}

export interface FlipbookSlideItem {
  id: string;
  image: string;
  mediaType?: 'image' | 'video';
  videoUrl?: string;
  title: string;
  desc: string;
  buttonText?: string;
  actionTab?: string;
}


export interface FeeTableState {
  columns: string[];
  rows: string[][];
}

export interface GalleryMediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  title: string;
  category?: string;
}

export interface FacultyMemberItem {
  id: string;
  name: string;
  subject: string;
  qualification: string;
  bio: string;
  image: string;
}

export interface AwardItem {
  id: string;
  title: string;
  desc: string;
  image: string;
  year?: string;
}

export interface SchoolFaqItem {
  id: string;
  q: string;
  a: string;
  category?: string;
}

export interface BoardExamYearResult {
  year: string; // e.g. "2024-25", "2023-24" (strictly max 2 years)
  totalStudents: number; // Total appeared
  passedStudents: number; // Passed students
  passPercentage?: number; // Auto-calculated: ((passedStudents / totalStudents) * 100)
  maxScorePercent: number; // Highest % scored, e.g. 98.6
  above90PercentCount: number; // Count of students who scored 90% and above
}

export interface StreamExamResult {
  streamName: string; // Predefined: 'Science' | 'Commerce' | 'Humanities / Arts'
  totalStudents: number;
  passedStudents: number;
  passPercentage?: number; // Auto-calculated
  maxScorePercent: number;
  above90PercentCount: number;
}

export interface Class12BoardExamYearResult extends BoardExamYearResult {
  streams?: StreamExamResult[];
}

export interface SchoolBoardResultsState {
  class10Results: BoardExamYearResult[]; // Max 2 years
  class12Results: Class12BoardExamYearResult[]; // Max 2 years
}


export interface SchoolTemplateState {
  udiseCode: string;
  schoolName: string;
  board: string;
  medium: string;
  principalName: string;
  address: string;
  state: string;
  district: string;
  blockName: string;
  village: string;
  pincode: string;
  ruralUrban: string;
  classFrom: string;
  classTo: string;
  totalStudents: number | string;
  totalBoys: number | string;
  totalGirls: number | string;
  totalTeachers: number | string;
  maleTeachers: number | string;
  femaleTeachers: number | string;
  classroomsCount: number | string;
  workingSmartBoards: number | string;
  isResidential: boolean;
  residentialSchool?: string;
  hasHostel: boolean;
  genderType: string;
  schoolType: string;
  management: string;
  schoolCategory: string;
  establishedYear: string;
  campusArea?: string;
  phone: string;
  email: string;
  website: string;
  generalPhone?: string;
  generalEmail?: string;
  admissionsPhone?: string;
  admissionsEmail?: string;
  principalPhone?: string;
  principalEmail?: string;
  careersPhone?: string;
  careersEmail?: string;
  heroImage: string;
  logoImage: string;
  aboutText: string;
  visionText: string;
  missionText: string;
  facilities: FacilityCardItem[];
  admissions: AdmissionCardItem[];
  flipbookSlides: FlipbookSlideItem[];
  feeTableData: FeeTableState;
  includedAcademicFeatures: string[];
  galleryItems: GalleryMediaItem[];
  facultyCards: FacultyMemberItem[];
  awardCards: AwardItem[];
  faqs?: SchoolFaqItem[];
  tabVisibility: Record<string, boolean>;
  sectionVisibility?: Record<string, boolean>;
  showContactInfo: boolean;
  completedTabs: Record<string, boolean>;
  verifiedFields: Record<string, boolean>;
  affiliationNumber?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    twitter?: string;
  };
  contentOverrides?: Record<string, string>;
  imageOverrides?: Record<string, string>;
  iconOverrides?: Record<string, string>;
  boardResults?: SchoolBoardResultsState;
  admissionsOpen?: boolean;
  campusVideoUrl?: string;
  heroMediaItems?: any[];
}

import { PLACEHOLDER_EMPTY_IMAGE } from './templateConstants';
export { PLACEHOLDER_EMPTY_IMAGE };

const DEFAULT_TEMPLATE_DATA: SchoolTemplateState = {
  admissionsOpen: false,
  udiseCode: '',
  schoolName: '',
  board: '',
  medium: '',
  principalName: '',
  address: '',
  state: '',
  district: '',
  blockName: '',
  village: '',
  pincode: '',
  ruralUrban: '',
  classFrom: '',
  classTo: '',
  totalStudents: 0,
  totalBoys: 0,
  totalGirls: 0,
  totalTeachers: 0,
  maleTeachers: 0,
  femaleTeachers: 0,
  classroomsCount: 0,
  workingSmartBoards: 0,
  isResidential: false,
  hasHostel: false,
  genderType: '',
  schoolType: '',
  management: '',
  schoolCategory: '',
  establishedYear: '',
  campusArea: '',
  phone: '',
  email: '',
  website: '',
  generalPhone: '',
  generalEmail: '',
  admissionsPhone: '',
  admissionsEmail: '',
  principalPhone: '',
  principalEmail: '',
  careersPhone: '',
  careersEmail: '',
  heroImage: PLACEHOLDER_EMPTY_IMAGE,
  logoImage: '',
  aboutText: '',
  visionText: '',
  missionText: '',
  // Initial template starts strictly empty - zero fake data
  facilities: [],
  admissions: [],
  flipbookSlides: [],
  feeTableData: {
    columns: ['Class / Wing', 'Tuition Fee (Qtr)', 'Dev Fee (Annual)', 'Lab / Sports Fee', 'Total Annual (Est.)'],
    rows: []
  },
  includedAcademicFeatures: [],
  galleryItems: [],
  facultyCards: [],
  awardCards: [],
  tabVisibility: {
    home: true,
    about: true,
    academics: true,
    facilities: true,
    faculty: true,
    gallery: true,
    admissions: true,
    reviews: true,
    contact: true,
  },
  sectionVisibility: {
    basic_info: true,
    hero: true,
    photobook: true,
    stats: true,
    about: true,
    about_cards: true,
    campus_tour: true,
    important_info: true,
    principal: true,
    management: true,
    academics: true,
    results: true,
    facilities: true,
    gallery: true,
    fees: true,
    admissions: true,
    faqs: true,
    contact: true,
  },
  showContactInfo: true,
  completedTabs: {},
  verifiedFields: {},
  contentOverrides: {},
  imageOverrides: {},
  iconOverrides: {},
  boardResults: {
    class10Results: [],
    class12Results: [],
  },
};

const LOCAL_STORAGE_KEY = 'cseel_school_template_draft_v1';

interface SchoolTemplateContextType {
  data: SchoolTemplateState;
  isEditMode: boolean;
  setIsEditMode: (val: boolean) => void;
  canEdit: boolean;
  authRole: 'admin' | 'owner' | 'magic_link' | 'unauthorized';
  isSaving: boolean;
  lastSavedAt: string | null;
  updateField: <K extends keyof SchoolTemplateState>(key: K, value: SchoolTemplateState[K]) => void;
  updateMultipleFields: (updates: Partial<SchoolTemplateState>) => void;
  updateBoardResults: (results: SchoolBoardResultsState) => void;
  updateContentOverride: (key: string, value: string) => void;
  updateImageOverride: (key: string, url: string) => void;
  updateIconOverride: (key: string, iconName: string) => void;
  getContent: (key: string, fallback?: string) => string;
  getImage: (key: string, fallback?: string) => string;
  getIcon: (key: string, fallback?: string) => string;
  toggleTabVisibility: (tabId: string) => void;
  toggleSectionVisibility: (sectionId: string) => void;
  setSectionVisibility: (sectionId: string, visible: boolean) => void;
  toggleContactVisibility: () => void;
  saveTab: (tabId: string) => void;
  fetchUdise: (code: string) => Promise<{ success: boolean; message: string }>;
  toggleFieldVerified: (fieldKey: string) => void;
  setFieldVerified: (fieldKey: string, verified: boolean) => void;
  verifyAllUdiseFields: () => void;
  isFieldVerified: (fieldKey: string) => boolean;
  addFacilityCard: (card: Omit<FacilityCardItem, 'id'>) => void;
  updateFacilityCard: (id: string, card: Partial<FacilityCardItem>) => void;
  deleteFacilityCard: (id: string) => void;
  addAdmissionCard: (card: Omit<AdmissionCardItem, 'id'>) => void;
  updateAdmissionCard: (id: string, card: Partial<AdmissionCardItem>) => void;
  deleteAdmissionCard: (id: string) => void;
  updateFlipbookSlides: (slides: FlipbookSlideItem[]) => void;
  updateFeeTableData: (table: FeeTableState) => void;
  updateIncludedFeatures: (features: string[]) => void;
  addGalleryItem: (item: Omit<GalleryMediaItem, 'id'>) => void;
  deleteGalleryItem: (id: string) => void;
  addFacultyCard: (card: Omit<FacultyMemberItem, 'id'>) => void;
  updateFacultyCard: (id: string, card: Partial<FacultyMemberItem>) => void;
  deleteFacultyCard: (id: string) => void;
  addAwardCard: (card: Omit<AwardItem, 'id'>) => void;
  updateAwardCard: (id: string, card: Partial<AwardItem>) => void;
  deleteAwardCard: (id: string) => void;
  addFaq?: (faq: Omit<SchoolFaqItem, 'id'>) => void;
  updateFaq?: (id: string, faq: Partial<SchoolFaqItem>) => void;
  deleteFaq?: (id: string) => void;
  resetToDefault: () => void;
  publishToSupabase: () => Promise<{ success: boolean; message: string; recordId?: string }>;
  importSchoolDataFromJson: (rawJson: any) => { success: boolean; message: string; summary?: ImportSummary };
  exportSchoolDataAsJson: () => string;
  getBlankAiSchemaJson: () => any;
  isUdiseLoading: boolean;
  notification: { type: 'success' | 'error' | 'info'; message: string } | null;
  setNotification: (notif: { type: 'success' | 'error' | 'info'; message: string } | null) => void;
}

const SchoolTemplateContext = createContext<SchoolTemplateContextType | null>(null);

export function SchoolTemplateProvider({
  children,
  initialData,
  initialEditMode = false,
  canEdit = true,
  authRole = 'unauthorized',
  currentUser,
}: {
  children: React.ReactNode;
  initialData?: Partial<SchoolTemplateState>;
  initialEditMode?: boolean;
  canEdit?: boolean;
  authRole?: 'admin' | 'owner' | 'magic_link' | 'unauthorized';
  currentUser?: { id?: string; email?: string } | null;
}) {
  const [data, setData] = useState<SchoolTemplateState>(() => ({
    ...DEFAULT_TEMPLATE_DATA,
    ...(initialData || {}),
    sectionVisibility: {
      ...DEFAULT_TEMPLATE_DATA.sectionVisibility,
      ...(initialData?.sectionVisibility || {}),
    },
    tabVisibility: {
      ...DEFAULT_TEMPLATE_DATA.tabVisibility,
      ...(initialData?.tabVisibility || {}),
    },
  }));
  const [isEditMode, setIsEditMode] = useState<boolean>(initialEditMode && canEdit);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [isUdiseLoading, setIsUdiseLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  const handleSetIsEditMode = useCallback((val: boolean) => {
    if (val && !canEdit) {
      setNotification({
        type: 'error',
        message: '🔒 Access Denied: You are not authorized to edit this school profile. Only verified institutional owners or administrators have edit access.',
      });
      setTimeout(() => setNotification(null), 5000);
      return;
    }
    setIsEditMode(val);
  }, [canEdit]);

  // Load draft from initialData, URL token, or localStorage upon client mount
  useEffect(() => {
    try {
      if (initialData && Object.keys(initialData).length > 0) {
        setData((prev) => ({ ...prev, ...initialData }));
        setIsHydrated(true);
        return;
      }

      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const urlToken = params.get('token');
        const urlUdise = params.get('udise');

        if (urlToken || urlUdise) {
          const fetchToken = urlToken || `csl_ai_magic_${urlUdise}`;
          const extractedUdise = (urlUdise || (urlToken ? (urlToken.match(/\d{11}/)?.[0] || '') : '')).replace(/\D/g, '');

          fetch(`/api/school-ai-sync?token=${encodeURIComponent(fetchToken)}`)
            .then((r) => r.json())
            .then(async (res) => {
              if (res && res.profileData) {
                const parsed = parseSchoolJsonToState(res.profileData.masterJson || res.profileData, DEFAULT_TEMPLATE_DATA);
                if (parsed.success && parsed.state) {
                  setData(parsed.state);
                  try {
                    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed.state));
                  } catch (_) {}
                  setNotification({
                    type: 'success',
                    message: `✨ Loaded official verified data for "${parsed.state.schoolName}" via Magic Link!`,
                  });
                  return;
                }
              }

              // Multi-layer fallback: If profileData not ready, query direct Government UDISE lookup
              if (extractedUdise && extractedUdise.length === 11) {
                try {
                  const uRes = await fetch(`/api/udise/lookup?code=${extractedUdise}`);
                  const uData = await uRes.json();
                  if (uData.success && uData.school) {
                    const sch = uData.school;
                    setData((prev) => {
                      const updated = {
                        ...prev,
                        udiseCode: extractedUdise,
                        schoolName: sch.schoolName || prev.schoolName,
                        state: sch.state || prev.state,
                        district: sch.district || prev.district,
                        pincode: sch.pincode || prev.pincode,
                        address: sch.address || `${sch.district}, ${sch.state} - ${sch.pincode}`,
                        classFrom: sch.classFrom || prev.classFrom,
                        classTo: sch.classTo || prev.classTo,
                      };
                      try {
                        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
                      } catch (_) {}
                      return updated;
                    });
                    setNotification({
                      type: 'success',
                      message: `✨ Loaded verified institutional data for "${sch.schoolName}" (UDISE: ${extractedUdise})!`,
                    });
                  }
                } catch {}
              }
            })
            .catch(async (err) => {
              console.warn('Failed to auto-sync from token, attempting direct UDISE lookup:', err);
              if (extractedUdise && extractedUdise.length === 11) {
                try {
                  const uRes = await fetch(`/api/udise/lookup?code=${extractedUdise}`);
                  const uData = await uRes.json();
                  if (uData.success && uData.school) {
                    const sch = uData.school;
                    setData((prev) => ({
                      ...prev,
                      udiseCode: extractedUdise,
                      schoolName: sch.schoolName || prev.schoolName,
                      state: sch.state || prev.state,
                      district: sch.district || prev.district,
                      pincode: sch.pincode || prev.pincode,
                      address: sch.address || `${sch.district}, ${sch.state} - ${sch.pincode}`,
                      classFrom: sch.classFrom || prev.classFrom,
                      classTo: sch.classTo || prev.classTo,
                    }));
                  }
                } catch {}
              }
            });
          setIsHydrated(true);
          return;
        }
      }

      // Only restore localStorage draft if explicitly in offline /template mode without initialData
      const isPureTemplateRoute = typeof window !== 'undefined' && window.location.pathname.includes('/template');
      if (isPureTemplateRoute) {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setData((prev) => ({
            ...prev,
            ...parsed,
            tabVisibility: { ...prev.tabVisibility, ...(parsed.tabVisibility || {}) },
            facilities: Array.isArray(parsed.facilities) ? parsed.facilities : [],
            admissions: Array.isArray(parsed.admissions) ? parsed.admissions : [],
          }));
          setLastSavedAt('Loaded from local storage');
        }
      } else {
        // Clear any old leftover local cache from past sessions
        if (typeof window !== 'undefined') {
          try {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
          } catch (_) {}
        }
      }
    } catch (e) {
      console.warn('Failed to initialize school state:', e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Debounced auto-save to localStorage only when explicitly on /template route
  useEffect(() => {
    if (!isHydrated) return;
    const isPureTemplateRoute = typeof window !== 'undefined' && window.location.pathname.includes('/template');
    if (!isPureTemplateRoute) return; // Do NOT persist live school data to localStorage

    setIsSaving(true);
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setLastSavedAt(timeStr);
      } catch (err) {
        console.error('Failed to save draft to localStorage:', err);
      } finally {
        setIsSaving(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [data, isHydrated]);

  const updateField = useCallback(<K extends keyof SchoolTemplateState>(key: K, value: SchoolTemplateState[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const updateMultipleFields = useCallback((updates: Partial<SchoolTemplateState>) => {
    setData((prev) => ({ ...prev, ...updates }));
  }, []);

  const updateContentOverride = useCallback((key: string, value: string) => {
    setData((prev) => ({
      ...prev,
      contentOverrides: {
        ...(prev.contentOverrides || {}),
        [key]: value
      }
    }));
  }, []);

  const updateImageOverride = useCallback((key: string, url: string) => {
    setData((prev) => ({
      ...prev,
      imageOverrides: {
        ...(prev.imageOverrides || {}),
        [key]: url
      }
    }));
  }, []);

  const updateIconOverride = useCallback((key: string, iconName: string) => {
    setData((prev) => ({
      ...prev,
      iconOverrides: {
        ...(prev.iconOverrides || {}),
        [key]: iconName
      }
    }));
  }, []);

  const getContent = useCallback((key: string, fallback: string = '') => {
    return data.contentOverrides?.[key] ?? fallback;
  }, [data.contentOverrides]);

  const getImage = useCallback((key: string, fallback: string = '') => {
    return data.imageOverrides?.[key] ?? fallback;
  }, [data.imageOverrides]);

  const getIcon = useCallback((key: string, fallback: string = '') => {
    return data.iconOverrides?.[key] ?? fallback;
  }, [data.iconOverrides]);

  const toggleTabVisibility = useCallback((tabId: string) => {
    setData((prev) => ({
      ...prev,
      tabVisibility: {
        ...prev.tabVisibility,
        [tabId]: prev.tabVisibility[tabId] === false ? true : false,
      },
    }));
  }, []);

  const toggleSectionVisibility = useCallback((sectionId: string) => {
    setData((prev) => {
      const current = prev.sectionVisibility?.[sectionId] !== false;
      return {
        ...prev,
        sectionVisibility: {
          ...(prev.sectionVisibility || {}),
          [sectionId]: !current,
        },
      };
    });
  }, []);

  const setSectionVisibility = useCallback((sectionId: string, visible: boolean) => {
    setData((prev) => ({
      ...prev,
      sectionVisibility: {
        ...(prev.sectionVisibility || {}),
        [sectionId]: visible,
      },
    }));
  }, []);

  const toggleContactVisibility = useCallback(() => {
    setData((prev) => ({
      ...prev,
      showContactInfo: !prev.showContactInfo,
    }));
  }, []);

  const saveTab = useCallback((tabId: string) => {
    setData((prev) => ({
      ...prev,
      completedTabs: {
        ...prev.completedTabs,
        [tabId]: true,
      },
    }));
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
      setLastSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setNotification({
        type: 'success',
        message: `${tabId.toUpperCase()} Tab data saved successfully!`,
      });
      setTimeout(() => setNotification(null), 3500);
    } catch (_) {}
  }, [data]);

  const fetchUdise = useCallback(async (code: string) => {
    setIsUdiseLoading(true);
    try {
      const res = await fetchSchoolByUdise(code);
      if (!res) {
        setNotification({
          type: 'info',
          message: `UDISE code "${code}" not found in database. You can manually enter details or verify the 11-digit number.`,
        });
        setTimeout(() => setNotification(null), 6000);
        return { success: false, message: 'UDISE code not found' };
      }

      // Auto map all fields from UDISE record
      setData((prev) => {
        const udiseFields = [
          'schoolName',
          'udiseCode',
          'board',
          'medium',
          'principalName',
          'address',
          'state',
          'district',
          'blockName',
          'village',
          'pincode',
          'classFrom',
          'classTo',
          'totalStudents',
          'totalBoys',
          'totalGirls',
          'totalTeachers',
          'maleTeachers',
          'femaleTeachers',
          'classroomsCount',
          'genderType',
          'schoolType',
          'management',
          'establishedYear',
        ];
        const verifiedMap: Record<string, boolean> = { ...(prev.verifiedFields || {}) };
        udiseFields.forEach((k) => {
          verifiedMap[k] = true;
        });

        return {
          ...prev,
          udiseCode: res.udiseCode,
          schoolName: res.schoolName,
          board: res.board,
          medium: res.medium,
          principalName: res.principalName,
          address: res.address,
          state: res.state,
          district: res.district,
          blockName: res.blockName,
          village: res.village,
          pincode: res.pincode,
          ruralUrban: res.ruralUrban,
          classFrom: res.classFrom,
          classTo: res.classTo,
          totalStudents: res.totalStudents,
          totalBoys: res.totalBoys,
          totalGirls: res.totalGirls,
          totalTeachers: res.totalTeachers,
          maleTeachers: res.maleTeachers,
          femaleTeachers: res.femaleTeachers,
          classroomsCount: res.classroomsCount,
          isResidential: res.isResidential,
          hasHostel: res.hasHostel,
          genderType: res.genderType,
          schoolType: res.schoolType,
          management: res.management,
          schoolCategory: res.schoolCategory,
          phone: res.phone || prev.phone,
          email: res.email || prev.email,
          website: res.website || prev.website,
          establishedYear: res.establishedYear || prev.establishedYear,
          verifiedFields: verifiedMap,
        };
      });

      setNotification({
        type: 'success',
        message: `Success! Live UDISE details fetched for "${res.schoolName}". All official data marked Verified!`,
      });
      setTimeout(() => setNotification(null), 5000);
      return { success: true, message: 'School data fetched successfully' };
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Error looking up UDISE code.',
      });
      setTimeout(() => setNotification(null), 5000);
      return { success: false, message: err.message };
    } finally {
      setIsUdiseLoading(false);
    }
  }, []);

  const toggleFieldVerified = useCallback((fieldKey: string) => {
    setData((prev) => {
      const current = prev.verifiedFields?.[fieldKey] ?? false;
      return {
        ...prev,
        verifiedFields: {
          ...(prev.verifiedFields || {}),
          [fieldKey]: !current,
        },
      };
    });
  }, []);

  const setFieldVerified = useCallback((fieldKey: string, verified: boolean) => {
    setData((prev) => ({
      ...prev,
      verifiedFields: {
        ...(prev.verifiedFields || {}),
        [fieldKey]: verified,
      },
    }));
  }, []);

  const verifyAllUdiseFields = useCallback(() => {
    const allKeys = [
      'schoolName',
      'udiseCode',
      'board',
      'medium',
      'principalName',
      'address',
      'state',
      'district',
      'blockName',
      'village',
      'pincode',
      'classFrom',
      'classTo',
      'totalStudents',
      'totalBoys',
      'totalGirls',
      'totalTeachers',
      'maleTeachers',
      'femaleTeachers',
      'classroomsCount',
      'genderType',
      'schoolType',
      'management',
      'establishedYear',
      'phone',
      'email',
      'website',
    ];
    setData((prev) => {
      const updated: Record<string, boolean> = { ...(prev.verifiedFields || {}) };
      allKeys.forEach((k) => {
        updated[k] = true;
      });
      return { ...prev, verifiedFields: updated };
    });
    setNotification({
      type: 'success',
      message: 'All school institutional fields marked as Verified by School!',
    });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const isFieldVerified = useCallback(
    (fieldKey: string) => {
      return Boolean(data.verifiedFields?.[fieldKey]);
    },
    [data.verifiedFields]
  );

  const addFacilityCard = useCallback((card: Omit<FacilityCardItem, 'id'>) => {
    const newCard: FacilityCardItem = {
      ...card,
      id: `fac-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    setData((prev) => ({
      ...prev,
      facilities: [...prev.facilities, newCard],
    }));
  }, []);

  const updateFacilityCard = useCallback((id: string, card: Partial<FacilityCardItem>) => {
    setData((prev) => ({
      ...prev,
      facilities: prev.facilities.map((f) => (f.id === id ? { ...f, ...card } : f)),
    }));
  }, []);

  const deleteFacilityCard = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      facilities: prev.facilities.filter((f) => f.id !== id),
    }));
  }, []);

  const addAdmissionCard = useCallback((card: Omit<AdmissionCardItem, 'id'>) => {
    const newCard: AdmissionCardItem = {
      ...card,
      id: `adm-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    setData((prev) => ({
      ...prev,
      admissions: [...prev.admissions, newCard],
    }));
  }, []);

  const updateAdmissionCard = useCallback((id: string, card: Partial<AdmissionCardItem>) => {
    setData((prev) => ({
      ...prev,
      admissions: prev.admissions.map((a) => (a.id === id ? { ...a, ...card } : a)),
    }));
  }, []);

  const deleteAdmissionCard = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      admissions: prev.admissions.filter((a) => a.id !== id),
    }));
  }, []);

  const updateFlipbookSlides = useCallback((slides: FlipbookSlideItem[]) => {
    setData((prev) => ({
      ...prev,
      flipbookSlides: slides.slice(0, 10),
    }));
  }, []);

  const updateFeeTableData = useCallback((feeTable: FeeTableState) => {
    setData((prev) => ({
      ...prev,
      feeTableData: {
        columns: feeTable.columns.slice(0, 5),
        rows: feeTable.rows.slice(0, 20),
      },
    }));
  }, []);

  const updateBoardResults = useCallback((results: SchoolBoardResultsState) => {
    setData((prev) => ({
      ...prev,
      boardResults: {
        class10Results: (results.class10Results || []).slice(0, 2).map((r) => ({
          ...r,
          passPercentage: r.totalStudents > 0 ? parseFloat(((r.passedStudents / r.totalStudents) * 100).toFixed(1)) : 0,
        })),
        class12Results: (results.class12Results || []).slice(0, 2).map((r) => ({
          ...r,
          passPercentage: r.totalStudents > 0 ? parseFloat(((r.passedStudents / r.totalStudents) * 100).toFixed(1)) : 0,
          streams: (r.streams || []).map((s) => ({
            ...s,
            passPercentage: s.totalStudents > 0 ? parseFloat(((s.passedStudents / s.totalStudents) * 100).toFixed(1)) : 0,
          })),
        })),
      },
    }));
  }, []);


  const updateIncludedFeatures = useCallback((features: string[]) => {
    setData((prev) => ({
      ...prev,
      includedAcademicFeatures: features.slice(0, 10),
    }));
  }, []);

  const addGalleryItem = useCallback((item: Omit<GalleryMediaItem, 'id'>) => {
    const newItem: GalleryMediaItem = {
      ...item,
      id: `gal-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    setData((prev) => ({
      ...prev,
      galleryItems: [...(prev.galleryItems || []), newItem],
    }));
  }, []);

  const deleteGalleryItem = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      galleryItems: (prev.galleryItems || []).filter((g) => g.id !== id),
    }));
  }, []);

  const addFacultyCard = useCallback((card: Omit<FacultyMemberItem, 'id'>) => {
    const newCard: FacultyMemberItem = {
      ...card,
      id: `facm-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    setData((prev) => ({
      ...prev,
      facultyCards: [...(prev.facultyCards || []), newCard],
    }));
  }, []);

  const updateFacultyCard = useCallback((id: string, card: Partial<FacultyMemberItem>) => {
    setData((prev) => ({
      ...prev,
      facultyCards: (prev.facultyCards || []).map((f) => (f.id === id ? { ...f, ...card } : f)),
    }));
  }, []);

  const deleteFacultyCard = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      facultyCards: (prev.facultyCards || []).filter((f) => f.id !== id),
    }));
  }, []);

  const addAwardCard = useCallback((card: Omit<AwardItem, 'id'>) => {
    const newCard: AwardItem = {
      ...card,
      id: `awd-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    setData((prev) => ({
      ...prev,
      awardCards: [...(prev.awardCards || []), newCard],
    }));
  }, []);

  const updateAwardCard = useCallback((id: string, card: Partial<AwardItem>) => {
    setData((prev) => ({
      ...prev,
      awardCards: (prev.awardCards || []).map((a) => (a.id === id ? { ...a, ...card } : a)),
    }));
  }, []);

  const deleteAwardCard = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      awardCards: (prev.awardCards || []).filter((a) => a.id !== id),
    }));
  }, []);

  const addFaq = useCallback((faq: Omit<SchoolFaqItem, 'id'>) => {
    const newFaq: SchoolFaqItem = {
      ...faq,
      id: `faq-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    setData((prev) => ({
      ...prev,
      faqs: [...(prev.faqs || []), newFaq],
    }));
  }, []);

  const updateFaq = useCallback((id: string, card: Partial<SchoolFaqItem>) => {
    setData((prev) => ({
      ...prev,
      faqs: (prev.faqs || []).map((f) => (f.id === id ? { ...f, ...card } : f)),
    }));
  }, []);

  const deleteFaq = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      faqs: (prev.faqs || []).filter((f) => f.id !== id),
    }));
  }, []);

  const resetToDefault = useCallback(() => {
    if (typeof window !== 'undefined' && window.confirm('Are you sure you want to reset this template? All unsaved custom edits will be reverted.')) {
      setData(DEFAULT_TEMPLATE_DATA);
      try {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      } catch (_) {}
      setNotification({
        type: 'info',
        message: 'Template reset to default blueprint.',
      });
      setTimeout(() => setNotification(null), 3000);
    }
  }, []);

  const publishToSupabase = useCallback(async () => {
    try {
      const cleanUdise = (data.udiseCode || '').trim().replace(/\D/g, '');
      if (cleanUdise.length !== 11) {
        setNotification({
          type: 'error',
          message: '❌ Strict Rule: 11-digit official UDISE Code is mandatory to publish. Government UDISE+ record hona zaroori hai.',
        });
        setTimeout(() => setNotification(null), 6000);
        return { success: false, message: 'UDISE code must be 11 digits' };
      }

      const slug = (data.schoolName || 'school')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Retrieve any magicKey from query or storage
      const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
      const magicKey =
        searchParams?.get('magicKey') ||
        searchParams?.get('token') ||
        (typeof localStorage !== 'undefined' ? localStorage.getItem(`magic_key_${cleanUdise}`) : null) ||
        '';

      // Secure Backend API Call - Authenticates Caller and Enforces RBAC
      const res = await fetch('/api/school-profile-save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          udiseCode: cleanUdise,
          data: {
            ...data,
            lastSavedAt: new Date().toISOString(),
          },
          magicKey,
          userId: currentUser?.id,
          userEmail: currentUser?.email,
        }),
      });

      const resJson = await res.json().catch(() => ({}));
      if (!res.ok || !resJson.success) {
        const errorMsg =
          resJson.message ||
          resJson.error ||
          (res.status === 403
            ? 'Access Denied: You are not authorized to publish changes to this school profile.'
            : 'Failed to publish changes to Supabase.');
        setNotification({
          type: 'error',
          message: `🔒 ${errorMsg}`,
        });
        setTimeout(() => setNotification(null), 7000);
        return { success: false, message: errorMsg };
      }

      setLastSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setNotification({
        type: 'success',
        message: '🎉 School Profile Successfully Published! Changes saved permanently in Supabase.',
      });
      setTimeout(() => setNotification(null), 6000);
      return { success: true, message: 'Profile published successfully', recordId: slug };
    } catch (err: any) {
      console.error('Publish error:', err);
      setNotification({
        type: 'error',
        message: `Failed to publish: ${err.message || 'Network error'}`,
      });
      setTimeout(() => setNotification(null), 6000);
      return { success: false, message: err.message || 'Failed to submit' };
    }
  }, [data, currentUser]);

  const importSchoolDataFromJson = useCallback((rawJson: any) => {
    const res = parseSchoolJsonToState(rawJson, data);
    if (!res.success || !res.state) {
      setNotification({
        type: 'error',
        message: `Import Failed: ${res.error || 'Invalid JSON format'}`,
      });
      setTimeout(() => setNotification(null), 6000);
      return { success: false, message: res.error || 'Import failed' };
    }

    setData(res.state);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(res.state));
    } catch (_) {}

    setLastSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    setNotification({
      type: 'success',
      message: `🎉 School Profile for "${res.summary?.schoolName || 'School'}" imported successfully in 1-Click!`,
    });
    setTimeout(() => setNotification(null), 6000);
    return { success: true, message: 'Import successful', summary: res.summary };
  }, [data]);

  const exportSchoolDataAsJson = useCallback(() => {
    const structured = convertStateToStructuredJson(data);
    return JSON.stringify(structured, null, 2);
  }, [data]);

  const getBlankAiSchemaJson = useCallback(() => {
    return BLANK_AI_SCHOOL_SCHEMA;
  }, []);

  return (
    <SchoolTemplateContext.Provider
      value={{
        data,
        isEditMode,
        setIsEditMode: handleSetIsEditMode,
        canEdit,
        authRole,
        isSaving,
        lastSavedAt,
        updateField,
        updateMultipleFields,
        updateContentOverride,
        updateImageOverride,
        updateIconOverride,
        getContent,
        getImage,
        getIcon,
        toggleTabVisibility,
        toggleSectionVisibility,
        setSectionVisibility,
        toggleContactVisibility,
        saveTab,
        fetchUdise,
        toggleFieldVerified,
        setFieldVerified,
        verifyAllUdiseFields,
        isFieldVerified,
        addFacilityCard,
        updateFacilityCard,
        deleteFacilityCard,
        addAdmissionCard,
        updateAdmissionCard,
        deleteAdmissionCard,
        updateFlipbookSlides,
        updateFeeTableData,
        updateBoardResults,
        updateIncludedFeatures,
        addGalleryItem,
        deleteGalleryItem,
        addFacultyCard,
        updateFacultyCard,
        deleteFacultyCard,
        addAwardCard,
        updateAwardCard,
        deleteAwardCard,
        addFaq,
        updateFaq,
        deleteFaq,
        resetToDefault,
        publishToSupabase,
        importSchoolDataFromJson,
        exportSchoolDataAsJson,
        getBlankAiSchemaJson,
        isUdiseLoading,
        notification,
        setNotification,
      }}
    >
      {children}
    </SchoolTemplateContext.Provider>
  );
}

export function useSchoolTemplate() {
  const ctx = useContext(SchoolTemplateContext);
  if (!ctx) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('useSchoolTemplate used outside SchoolTemplateProvider; returning safe fallback.');
    }
    return {
      data: DEFAULT_TEMPLATE_DATA,
      setData: () => {},
      isEditMode: false,
      setIsEditMode: () => {},
      isSaving: false,
      lastSavedAt: null,
      saveTab: async () => false,
      toggleTabVisibility: () => {},
      toggleSectionVisibility: () => {},
      setSectionVisibility: () => {},
      toggleContactVisibility: () => {},
      updateField: () => {},
      updateNestedField: () => {},
      fetchUdise: async () => false,
      verifyAllUdiseFields: async () => false,
      updateBoardResults: () => {},
      resetToDefault: () => {},
      publishToSupabase: async () => false,
      importSchoolDataFromJson: () => ({ success: false, importedKeys: [], skippedKeys: [], message: 'No template context' }),
      exportSchoolDataAsJson: () => JSON.stringify(DEFAULT_TEMPLATE_DATA),
      isUdiseLoading: false,
      notification: null
    };
  }
  return ctx;
}


export function useOptionalSchoolTemplate() {
  return useContext(SchoolTemplateContext);
}
