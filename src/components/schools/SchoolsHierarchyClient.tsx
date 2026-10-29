'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Building2,
  MapPin,
  GraduationCap,
  Users,
  Award,
  BookOpen,
  Filter,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Search,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowRight,
  Compass,
  Laptop,
  Beaker,
  Home,
  HelpCircle,
  Star,
  Scale,
  Heart,
  Share2,
  X,
  Check,
  Phone,
  Mail,
  AlertCircle,
  Info,
  Calculator,
  Loader2,
  SlidersHorizontal,
  RotateCcw,
  Monitor,
  Flame,
  Microscope,
  IndianRupee,
  Navigation
} from 'lucide-react';
import { HierarchyPageData, HierarchyLocationItem } from '@/integrations/supabase/schoolsHierarchyDb';
import { SchoolRecord } from '@/data/schoolFinderData';

interface Props {
  initialData: HierarchyPageData;
}

export default function SchoolsHierarchyClient({ initialData }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = initialData.query;

  // Search & Navigation
  const [searchTerm, setSearchTerm] = useState('');
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  // Dynamic Filters State (Exact Map Page Schema)
  const [sortBy, setSortBy] = useState<string>(query.sortBy || 'students_desc');
  const [quickManagementFilter, setQuickManagementFilter] = useState<string>('all'); // all | Private | Government
  const [selectedBoards, setSelectedBoards] = useState<string[]>(query.board && query.board !== 'all' ? [query.board.toUpperCase()] : []);
  const [selectedClass, setSelectedClass] = useState<string>('all'); // all | nursery | 1 | 5 | 8 | 10 | 12
  const [maxAnnualFee, setMaxAnnualFee] = useState<number | null>(null);
  const [minStudents, setMinStudents] = useState<number>(0);
  const [maxStudents, setMaxStudents] = useState<number | null>(null);
  const [minTeachers, setMinTeachers] = useState<number>(0);
  const [maxTeachers, setMaxTeachers] = useState<number | null>(null);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>(
    query.facility === 'atl'
      ? ['Atal Tinkering Lab']
      : query.facility === 'computer_lab'
      ? ['Computer Lab']
      : query.facility === 'science_lab'
      ? ['Science']
      : query.facility === 'sports'
      ? ['Sports']
      : []
  );
  const [selectedGenders, setSelectedGenders] = useState<string[]>(query.gender && query.gender !== 'all' ? [query.gender] : []);
  const [residentialType, setResidentialType] = useState<string>(query.residential || 'all');
  const [onlyPmShri, setOnlyPmShri] = useState(false);
  const [onlyAdmissionsOpen, setOnlyAdmissionsOpen] = useState(false);

  // Interactive State
  const [likedSchoolIds, setLikedSchoolIds] = useState<string[]>([]);
  const [copiedToastId, setCopiedToastId] = useState<string | null>(null);

  // Reset navigation state once new initialData is mounted
  useEffect(() => {
    setNavigatingTo(null);
  }, [initialData]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (quickManagementFilter !== 'all') count++;
    if (selectedBoards.length > 0) count += selectedBoards.length;
    if (selectedClass !== 'all') count++;
    if (maxAnnualFee !== null) count++;
    if (minStudents > 0 || maxStudents !== null) count++;
    if (minTeachers > 0 || maxTeachers !== null) count++;
    if (selectedFacilities.length > 0) count += selectedFacilities.length;
    if (selectedGenders.length > 0) count++;
    if (residentialType !== 'all') count++;
    if (onlyPmShri) count++;
    if (onlyAdmissionsOpen) count++;
    if (sortBy !== 'students_desc') count++;
    return count;
  }, [
    quickManagementFilter,
    selectedBoards,
    selectedClass,
    maxAnnualFee,
    minStudents,
    maxStudents,
    minTeachers,
    maxTeachers,
    selectedFacilities,
    selectedGenders,
    residentialType,
    onlyPmShri,
    onlyAdmissionsOpen,
    sortBy
  ]);

  const resetFilters = () => {
    setQuickManagementFilter('all');
    setSelectedBoards([]);
    setSelectedClass('all');
    setMaxAnnualFee(null);
    setMinStudents(0);
    setMaxStudents(null);
    setMinTeachers(0);
    setMaxTeachers(null);
    setSelectedFacilities([]);
    setSelectedGenders([]);
    setResidentialType('all');
    setOnlyPmShri(false);
    setOnlyAdmissionsOpen(false);
    setSortBy('students_desc');
    setSearchTerm('');
  };

  const toggleFacility = (fac: string) => {
    setSelectedFacilities((prev) => (prev.includes(fac) ? prev.filter((f) => f !== fac) : [...prev, fac]));
  };

  const toggleBoard = (b: string) => {
    setSelectedBoards((prev) => (prev.includes(b) ? prev.filter((item) => item !== b) : [...prev, b]));
  };

  // Dynamic live facility & management counts
  const dynamicCounts = useMemo(() => {
    const rawList = initialData.schools || [];
    const isYes = (val: any) => val === true || String(val || '').toLowerCase().includes('yes') || String(val || '') === '1';

    return {
      mgmtCounts: {
        Private: rawList.filter((s) => (s.management_desc_state || s.management || '').includes('Private')).length,
        Government: rawList.filter((s) => (s.management_desc_state || s.management || '').includes('Government') || (s.management_desc_state || s.management || '').includes('Department')).length,
      },
      boardCounts: {
        CBSE: rawList.filter((s) => (s.board_secondary_10th && s.board_secondary_10th.includes('CBSE')) || (s.board && s.board.includes('CBSE'))).length,
        ICSE: rawList.filter((s) => (s.board_secondary_10th && s.board_secondary_10th.includes('ICSE')) || (s.board && s.board.includes('ICSE'))).length,
        HBSE: rawList.filter((s) => (s.board_secondary_10th && s.board_secondary_10th.includes('HBSE')) || (s.board && s.board.includes('HBSE'))).length,
        'State Board': rawList.filter((s) => (s.board_secondary_10th && s.board_secondary_10th.includes('State')) || (s.board && s.board.includes('State'))).length,
        'IB Partner': rawList.filter((s) => (s.board_secondary_10th && s.board_secondary_10th.includes('IB')) || (s.board && s.board.includes('IB'))).length,
      },
      facilityCounts: {
        Library: rawList.filter((s) => isYes(s.library) || (s.facilities || []).includes('Library')).length,
        'Smart Classrooms': rawList.filter((s) => (s.digital_boards_working ?? 0) > 0 || (s.facilities || []).some((f) => f.toLowerCase().includes('smart'))).length,
        'Atal Tinkering Lab': rawList.filter((s) => isYes(s.tinkering_lab_atl)).length,
        'Computer Lab': rawList.filter((s) => isYes(s.ict_lab) || Number(s.desktop_computers_working) > 0).length,
        Science: rawList.filter((s) => isYes(s.integrated_science_lab) || (s.facilities || []).some((f) => f.toLowerCase().includes('science'))).length,
        Sports: rawList.filter((s) => isYes(s.playground) || (s.facilities || []).some((f) => f.toLowerCase().includes('sport'))).length,
      }
    };
  }, [initialData.schools]);

  // Dynamic Client-side Filter & Sort
  const displayedSchools = useMemo(() => {
    let list = [...(initialData.schools || [])];
    const isYes = (val: any) => val === true || String(val || '').toLowerCase().includes('yes') || String(val || '') === '1';

    // 1. Text Search Filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      list = list.filter(
        (s) =>
          (s.school_name || s.name || '').toLowerCase().includes(q) ||
          (s.village_ward || '').toLowerCase().includes(q) ||
          (s.block_name || '').toLowerCase().includes(q) ||
          (s.district_name || '').toLowerCase().includes(q) ||
          (s.udise_code || '').includes(q)
      );
    }

    // 2. Management Filter (Quick + Panel)
    if (quickManagementFilter !== 'all') {
      list = list.filter((s) => (s.management_desc_state || s.management || '').includes(quickManagementFilter));
    }

    // 3. Board Filter
    if (selectedBoards.length > 0) {
      list = list.filter((s) =>
        selectedBoards.some((b) =>
          (s.board_secondary_10th && s.board_secondary_10th.toLowerCase().includes(b.toLowerCase())) ||
          (s.board_higher_secondary_12th && s.board_higher_secondary_12th.toLowerCase().includes(b.toLowerCase())) ||
          (s.board && s.board.toLowerCase().includes(b.toLowerCase()))
        )
      );
    }

    // 4. Class / Grade Filter
    if (selectedClass !== 'all') {
      if (selectedClass === 'nursery') {
        list = list.filter(
          (s) =>
            s.class_from?.toLowerCase().includes('nursery') ||
            s.class_from?.toLowerCase().includes('pre') ||
            s.pre_primary_section === '1-Yes' ||
            s.pre_primary_section === 'Yes'
        );
      } else {
        const targetNum = parseInt(selectedClass);
        list = list.filter((s) => {
          const fromNum = parseInt(s.class_from || '1') || 1;
          const toNum = parseInt(s.class_to || '12') || 12;
          return targetNum >= fromNum && targetNum <= toNum;
        });
      }
    }

    // 5. Annual Fee Budget
    if (maxAnnualFee !== null) {
      list = list.filter((s) => (s.annual_fee ?? 0) <= maxAnnualFee);
    }

    // 6. Student Strength Range Sliders
    if (minStudents > 0) {
      list = list.filter((s) => (Number(s.total_students) || 0) >= minStudents);
    }
    if (maxStudents !== null) {
      list = list.filter((s) => (Number(s.total_students) || 0) <= maxStudents);
    }

    // 7. Teacher Strength Range Sliders
    if (minTeachers > 0) {
      list = list.filter((s) => (Number(s.total_teachers) || 0) >= minTeachers);
    }
    if (maxTeachers !== null) {
      list = list.filter((s) => (Number(s.total_teachers) || 0) <= maxTeachers);
    }

    // 8. Campus Facilities Checkboxes
    if (selectedFacilities.length > 0) {
      list = list.filter((s) =>
        selectedFacilities.every((fac) => {
          if (fac === 'Library') return isYes(s.library) || (s.facilities || []).includes('Library');
          if (fac === 'Smart Classrooms') return (s.digital_boards_working ?? 0) > 0 || (s.facilities || []).some((f) => f.toLowerCase().includes('smart'));
          if (fac === 'Atal Tinkering Lab') return isYes(s.tinkering_lab_atl);
          if (fac === 'Computer Lab') return isYes(s.ict_lab) || Number(s.desktop_computers_working) > 0;
          if (fac === 'Science') return isYes(s.integrated_science_lab) || (s.facilities || []).some((f) => f.toLowerCase().includes('science'));
          if (fac === 'Sports') return isYes(s.playground) || (s.facilities || []).some((f) => f.toLowerCase().includes('sport'));
          return (s.facilities || []).some((f) => f.toLowerCase().includes(fac.toLowerCase()));
        })
      );
    }

    // 9. Gender Filter
    if (selectedGenders.length > 0) {
      list = list.filter((s) => selectedGenders.some((g) => (s.school_type || s.gender || '').toLowerCase().includes(g.toLowerCase())));
    }

    // 10. Residential Filter
    if (residentialType !== 'all') {
      if (residentialType === 'res' || residentialType === 'boarding') {
        list = list.filter((s) => s.residential_school?.toLowerCase().includes('residential') || s.residential_school?.toLowerCase().includes('1-completely') || s.residential_school?.toLowerCase().includes('boarding'));
      } else if (residentialType === 'non_res' || residentialType === 'day') {
        list = list.filter((s) => !s.residential_school || s.residential_school.toLowerCase().includes('non') || s.residential_school.toLowerCase().includes('day'));
      }
    }

    // 11. PM SHRI Filter
    if (onlyPmShri) {
      list = list.filter((s) => s.pm_shri);
    }

    // 12. Admissions Open
    if (onlyAdmissionsOpen) {
      list = list.filter((s) => s.status === 'Admissions Open');
    }

    // 13. Sorting
    list.sort((a, b) => {
      if (sortBy === 'students_desc' || sortBy === 'students') {
        return (Number(b.total_students) || 0) - (Number(a.total_students) || 0);
      }
      if (sortBy === 'teachers_desc' || sortBy === 'teachers') {
        return (Number(b.total_teachers) || 0) - (Number(a.total_teachers) || 0);
      }
      if (sortBy === 'name_asc' || sortBy === 'name') {
        return (a.school_name || a.name || '').localeCompare(b.school_name || b.name || '');
      }
      if (sortBy === 'fees') {
        return (a.annual_fee ?? 0) - (b.annual_fee ?? 0);
      }
      if (sortBy === 'atl_first') {
        const aAtl = isYes(a.tinkering_lab_atl) ? 1 : 0;
        const bAtl = isYes(b.tinkering_lab_atl) ? 1 : 0;
        if (bAtl !== aAtl) return bAtl - aAtl;
        return (Number(b.total_students) || 0) - (Number(a.total_students) || 0);
      }
      return (Number(b.total_students) || 0) - (Number(a.total_students) || 0);
    });

    return list;
  }, [
    initialData.schools,
    searchTerm,
    quickManagementFilter,
    selectedBoards,
    selectedClass,
    maxAnnualFee,
    minStudents,
    maxStudents,
    minTeachers,
    maxTeachers,
    selectedFacilities,
    selectedGenders,
    residentialType,
    onlyPmShri,
    onlyAdmissionsOpen,
    sortBy
  ]);

  // Sublocations search for States/Districts/Blocks
  const displayedSubLocations = useMemo(() => {
    if (!initialData.subLocations) return [];
    if (!searchTerm.trim()) return initialData.subLocations;
    const q = searchTerm.toLowerCase().trim();
    return initialData.subLocations.filter((loc) => loc.name.toLowerCase().includes(q));
  }, [initialData.subLocations, searchTerm]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : '');
    params.set('page', newPage.toString());
    setNavigatingTo(`?${params.toString()}`);
    router.push(`?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShare = async (url: string, id: string) => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setCopiedToastId(id);
      setTimeout(() => setCopiedToastId(null), 2500);
    }
  };

  const toggleLike = (id: string) => {
    setLikedSchoolIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  // Reusable Filter Sidebar Content Component (Exact School Finder Style)
  const renderFilterSidebarControls = () => (
    <div className="space-y-4 text-xs">
      {/* 1. Sort Results */}
      <div>
        <span className="font-bold text-slate-700 text-xs block mb-1">Sort Results By:</span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full p-2 bg-white border border-slate-200 rounded-xl font-medium text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
        >
          <option value="students_desc">Most Students (Enrollment)</option>
          <option value="teachers_desc">Faculty Strength (Teachers)</option>
          <option value="name_asc">Alphabetical (School Name A-Z)</option>
          <option value="atl_first">STEM & Atal Labs First</option>
          <option value="fees">Annual Fee (Low to High)</option>
        </select>
      </div>

      {/* 2. Management Type */}
      <div>
        <span className="font-bold text-slate-700 text-xs block mb-1.5">Management Type:</span>
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { id: 'all', label: 'All' },
            { id: 'Private', label: `Private (${dynamicCounts.mgmtCounts.Private})` },
            { id: 'Government', label: `Govt (${dynamicCounts.mgmtCounts.Government})` },
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setQuickManagementFilter(m.id)}
              className={`py-2 px-1.5 rounded-xl border text-center text-[11px] font-bold transition-all whitespace-normal break-words leading-tight ${
                quickManagementFilter === m.id
                  ? 'bg-[#1a73e8] text-white border-[#1a73e8] shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Target Class & Max Annual Fee */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div>
          <span className="font-bold text-slate-700 text-xs block mb-1">Target Class:</span>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full p-2 bg-white border border-slate-200 rounded-xl font-medium text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
          >
            <option value="all">All Classes (Pre-Nur to 12th)</option>
            <option value="nursery">Pre-Primary / Nursery</option>
            <option value="1">Class 1st</option>
            <option value="5">Class 5th</option>
            <option value="8">Class 8th</option>
            <option value="10">Class 10th (Secondary)</option>
            <option value="12">Class 12th (Sr Secondary)</option>
          </select>
        </div>

        <div>
          <span className="font-bold text-slate-700 text-xs block mb-1">Max Annual Fee:</span>
          <select
            value={maxAnnualFee === null ? 'any' : maxAnnualFee.toString()}
            onChange={(e) => setMaxAnnualFee(e.target.value === 'any' ? null : Number(e.target.value))}
            className="w-full p-2 bg-white border border-slate-200 rounded-xl font-medium text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
          >
            <option value="any">Any Budget</option>
            <option value="0">Free / Government (₹0)</option>
            <option value="25000">Under ₹25,000 / year</option>
            <option value="45000">Under ₹45,000 / year</option>
            <option value="75000">Under ₹75,000 / year</option>
            <option value="150000">Under ₹1.5 Lakh / year</option>
          </select>
        </div>
      </div>

      {/* 4. Student Strength Range Slider */}
      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-bold text-slate-700 text-xs flex items-center gap-1.5">
            <Users size={14} className="text-[#1a73e8]" />
            <span>Student Strength:</span>
          </span>
          <span className="px-2 py-0.5 rounded-full bg-blue-100 text-[#1a73e8] font-bold text-xs font-mono">
            {minStudents === 0 && maxStudents === null
              ? 'Any (All Sizes)'
              : minStudents > 0 && maxStudents !== null
              ? `${minStudents} - ${maxStudents}`
              : minStudents > 0
              ? `${minStudents}+`
              : `Up to ${maxStudents}`}
          </span>
        </div>
        <div className="grid grid-cols-5 gap-1 mb-2">
          {[
            { label: 'All', min: 0, max: null },
            { label: '< 250', min: 0, max: 250 },
            { label: '250-500', min: 250, max: 500 },
            { label: '500-1k', min: 500, max: 1000 },
            { label: '1k+', min: 1000, max: null },
          ].map((item) => {
            const isSelected = minStudents === item.min && maxStudents === item.max;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  setMinStudents(item.min);
                  setMaxStudents(item.max);
                }}
                className={`py-1 rounded-lg border text-center text-[11px] font-bold transition-all ${
                  isSelected
                    ? 'bg-[#1a73e8] text-white border-[#1a73e8] shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
        <input
          type="range"
          min={0}
          max={3000}
          step={50}
          value={maxStudents ?? 3000}
          onChange={(e) => {
            const val = Number(e.target.value);
            setMaxStudents(val >= 3000 ? null : val);
          }}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1a73e8]"
        />
      </div>

      {/* 5. Faculty / Teacher Count */}
      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-bold text-slate-700 text-xs flex items-center gap-1.5">
            <GraduationCap size={14} className="text-[#1a73e8]" />
            <span>Faculty / Teacher Count:</span>
          </span>
          <span className="px-2 py-0.5 rounded-full bg-blue-100 text-[#1a73e8] font-bold text-xs font-mono">
            {minTeachers === 0 && maxTeachers === null
              ? 'Any'
              : minTeachers > 0 && maxTeachers !== null
              ? `${minTeachers} - ${maxTeachers}`
              : minTeachers > 0
              ? `${minTeachers}+`
              : `Up to ${maxTeachers}`}
          </span>
        </div>
        <div className="grid grid-cols-5 gap-1 mb-2">
          {[
            { label: 'All', min: 0, max: null },
            { label: '10+', min: 10, max: null },
            { label: '25+', min: 25, max: null },
            { label: '50+', min: 50, max: null },
            { label: '100+', min: 100, max: null },
          ].map((item) => {
            const isSelected = minTeachers === item.min && maxTeachers === item.max;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  setMinTeachers(item.min);
                  setMaxTeachers(item.max);
                }}
                className={`py-1 rounded-lg border text-center text-[11px] font-bold transition-all ${
                  isSelected
                    ? 'bg-[#1a73e8] text-white border-[#1a73e8] shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={minTeachers}
          onChange={(e) => {
            const val = Number(e.target.value);
            setMinTeachers(val);
            setMaxTeachers(null);
          }}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1a73e8]"
        />
      </div>

      {/* 6. Campus Facilities Checklist */}
      <div>
        <span className="font-bold text-slate-700 text-xs block mb-1.5">Campus Facilities:</span>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { id: 'Library', label: 'Library', icon: BookOpen },
            { id: 'Smart Classrooms', label: 'Smart Classrooms', icon: Monitor },
            { id: 'Atal Tinkering Lab', label: 'ATL Tinkering Lab', icon: Beaker },
            { id: 'Computer Lab', label: 'Computer / ICT Lab', icon: Laptop },
            { id: 'Science', label: 'Science Labs', icon: Microscope },
            { id: 'Sports', label: 'Sports Playground', icon: Flame },
          ].map((f) => {
            const count = dynamicCounts.facilityCounts[f.id as keyof typeof dynamicCounts.facilityCounts] ?? 0;
            const IconComp = f.icon;
            const isChecked = selectedFacilities.includes(f.id);
            return (
              <label
                key={f.id}
                className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer text-xs transition-all ${
                  isChecked
                    ? 'bg-[#e8f0fe] border-[#1a73e8] text-[#1a73e8] font-bold shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleFacility(f.id)}
                  className="w-4 h-4 rounded text-[#1a73e8] focus:ring-[#1a73e8] accent-[#1a73e8] shrink-0"
                />
                <IconComp size={14} className={isChecked ? 'text-[#1a73e8] shrink-0' : 'text-slate-500 shrink-0'} />
                <span className="flex-1 font-medium leading-snug whitespace-normal break-words">{f.label}</span>
                <span className="text-[10px] text-slate-400 font-mono shrink-0">({count})</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 7. Board Affiliation Checklist */}
      <div>
        <span className="font-bold text-slate-700 text-xs block mb-1.5">Board Affiliation:</span>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {['CBSE', 'ICSE', 'HBSE', 'State Board', 'IB Partner'].map((b) => {
            const count = dynamicCounts.boardCounts[b as keyof typeof dynamicCounts.boardCounts] ?? 0;
            const isChecked = selectedBoards.includes(b);
            return (
              <label
                key={b}
                className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer text-xs transition-all ${
                  isChecked
                    ? 'bg-[#e8f0fe] border-[#1a73e8] text-[#1a73e8] font-bold'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleBoard(b)}
                  className="w-4 h-4 rounded text-[#1a73e8] accent-[#1a73e8] shrink-0"
                />
                <span className="flex-1 font-medium leading-snug whitespace-normal break-words">{b}</span>
                <span className="text-[10px] text-slate-400 font-mono shrink-0">({count})</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 8. Special Flag Filters */}
      <div className="pt-2 border-t border-slate-100 space-y-2">
        <label className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer text-xs transition-all ${
          onlyPmShri ? 'bg-[#e8f0fe] border-[#1a73e8] text-[#1a73e8] font-bold' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
        }`}>
          <span className="flex items-center gap-2 leading-snug whitespace-normal break-words">
            <Sparkles size={14} className="text-amber-500 shrink-0" />
            <span>PM SHRI Schools Only</span>
          </span>
          <input
            type="checkbox"
            checked={onlyPmShri}
            onChange={(e) => setOnlyPmShri(e.target.checked)}
            className="w-4 h-4 rounded text-[#1a73e8] accent-[#1a73e8] shrink-0 ml-2"
          />
        </label>

        <label className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer text-xs transition-all ${
          onlyAdmissionsOpen ? 'bg-[#e8f0fe] border-[#1a73e8] text-[#1a73e8] font-bold' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
        }`}>
          <span className="flex items-center gap-2 leading-snug whitespace-normal break-words">
            <Award size={14} className="text-emerald-600 shrink-0" />
            <span>Admissions Open (2026-27)</span>
          </span>
          <input
            type="checkbox"
            checked={onlyAdmissionsOpen}
            onChange={(e) => setOnlyAdmissionsOpen(e.target.checked)}
            className="w-4 h-4 rounded text-[#1a73e8] accent-[#1a73e8] shrink-0 ml-2"
          />
        </label>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      {/* Top Persistent Animated Navigation Progress Bar */}
      {navigatingTo && (
        <div className="fixed top-0 left-0 right-0 h-1.5 bg-blue-600/20 z-50 overflow-hidden pointer-events-none">
          <div className="h-full bg-gradient-to-r from-blue-500 via-indigo-400 to-amber-400 animate-pulse w-full origin-left-right" />
        </div>
      )}

      {/* Schema.org Structured Data */}
      {query.schemaJsonLd &&
        query.schemaJsonLd.map((schema, idx) => (
          <script
            key={idx}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}

      {/* Header Banner & Breadcrumbs */}
      <header className="bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 text-white pt-10 pb-14 px-4 sm:px-6 lg:px-8 border-b border-indigo-950/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Breadcrumbs */}
          <nav className="flex flex-wrap items-center gap-2 text-xs font-medium text-blue-200/80 mb-6">
            {query.breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-blue-300/40" />}
                {idx === query.breadcrumbs.length - 1 ? (
                  <span className="text-white font-semibold truncate max-w-xs">{crumb.label}</span>
                ) : (
                  <Link
                    href={crumb.href}
                    onClick={() => setNavigatingTo(crumb.href)}
                    className="hover:text-white transition-colors"
                  >
                    {crumb.label}
                  </Link>
                )}
              </React.Fragment>
            ))}
          </nav>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-400/30">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Verified UDISE+ National Education Network</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
                {query.h1Heading}
              </h1>
              <p className="text-base sm:text-lg text-blue-100/90 leading-relaxed">
                {query.metaDescription}
              </p>
            </div>

            {/* Quick Metrics Badge Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 flex flex-row md:flex-col gap-4 justify-around min-w-[240px]">
              <div>
                <p className="text-xs font-medium text-blue-200">Total Schools</p>
                <p className="text-2xl sm:text-3xl font-black text-white">
                  {initialData.totalCount ? initialData.totalCount.toLocaleString() : '3,88,932+'}
                </p>
              </div>
              <div className="border-l md:border-l-0 md:border-t border-white/15 pl-4 md:pl-0 md:pt-3">
                <p className="text-xs font-medium text-emerald-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-400" /> ATL Labs Indexed
                </p>
                <p className="text-xl sm:text-2xl font-bold text-white">
                  {initialData.stats.atlCount ? initialData.stats.atlCount.toLocaleString() : '17,105+'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Search Bar */}
          <div className="mt-8 max-w-2xl relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={
                query.level === 'country'
                  ? 'Search by State name (e.g. Rajasthan, Uttar Pradesh)...'
                  : query.level === 'state'
                  ? `Search districts in ${query.stateName} (e.g. Jaipur, Lucknow)...`
                  : 'Search schools by name, village, or UDISE code...'
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white text-slate-900 rounded-xl shadow-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium placeholder-slate-400"
            />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        {/* ────────────────────────────────────────────────────────────────────────── */}
        {/* LEVEL 1: ALL INDIA VIEW (/school/india)                                    */}
        {/* ────────────────────────────────────────────────────────────────────────── */}
        {query.level === 'country' && (
          <section className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-slate-200/80 mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <Compass className="w-6 h-6 text-blue-600" />
                  Explore Schools by State (32 States & Union Territories)
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Click on any State below to view its complete district-wise calculation and school directory.
                </p>
              </div>
              <div className="text-xs font-semibold px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 self-start sm:self-auto">
                {displayedSubLocations.length} States Displayed
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
              {displayedSubLocations.map((st) => (
                <Link
                  key={st.slug}
                  href={st.href}
                  onClick={() => setNavigatingTo(st.href)}
                  className={`group p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between shadow-sm hover:shadow ${
                    navigatingTo === st.href
                      ? 'border-blue-500 bg-blue-50/80 ring-2 ring-blue-400/30'
                      : 'border-slate-200/80 bg-slate-50/50 hover:bg-blue-50/60 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                      {st.name}
                    </span>
                    {navigatingTo === st.href ? (
                      <Loader2 className="w-4 h-4 text-blue-600 animate-spin shrink-0" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all shrink-0" />
                    )}
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {st.schoolCount.toLocaleString()} Schools
                    </span>
                    <span className="text-blue-600 font-medium group-hover:underline">
                      {navigatingTo === st.href ? 'Loading...' : 'View Districts →'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ────────────────────────────────────────────────────────────────────────── */}
        {/* LEVEL 2: STATE VIEW (/school/india/[state])                                */}
        {/* ────────────────────────────────────────────────────────────────────────── */}
        {query.level === 'state' && (
          <section className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-slate-200/80 mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <Calculator className="w-6 h-6 text-indigo-600" />
                  District-wise School Calculation in {query.stateName}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Showing all administrative districts in {query.stateName}. Click on any district to filter all schools.
                </p>
              </div>
              <div className="text-xs font-semibold px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-200 self-start sm:self-auto">
                {displayedSubLocations.length} Districts in {query.stateName}
              </div>
            </div>

            {/* Districts Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
              {displayedSubLocations.map((dist) => (
                <Link
                  key={dist.slug}
                  href={dist.href}
                  onClick={() => setNavigatingTo(dist.href)}
                  className={`group p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between shadow-sm hover:shadow ${
                    navigatingTo === dist.href
                      ? 'border-indigo-500 bg-indigo-50/80 ring-2 ring-indigo-400/30'
                      : 'border-slate-200/80 bg-slate-50/50 hover:bg-indigo-50/60 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                      {dist.name}
                    </span>
                    {navigatingTo === dist.href ? (
                      <Loader2 className="w-4 h-4 text-indigo-600 animate-spin shrink-0" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all shrink-0" />
                    )}
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {dist.schoolCount.toLocaleString()} Schools
                    </span>
                    {dist.atlCount && dist.atlCount > 0 ? (
                      <span className="text-emerald-700 font-medium bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        {dist.atlCount} ATL Labs
                      </span>
                    ) : (
                      <span className="text-indigo-600 font-medium group-hover:underline">
                        {navigatingTo === dist.href ? 'Loading...' : 'Explore →'}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* Top Schools in State Preview Section */}
            {initialData.schools.length > 0 && (
              <div className="mt-12 pt-8 border-t border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500" />
                  Top Rated Schools in {query.stateName}
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {initialData.schools.slice(0, 10).map((school) => renderSchoolCard(school, query, setNavigatingTo))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* ────────────────────────────────────────────────────────────────────────── */}
        {/* LEVEL 3, 4, 5: DISTRICT / BLOCK / VILLAGE VIEW WITH LEFT FILTER SIDEBAR   */}
        {/* ────────────────────────────────────────────────────────────────────────── */}
        {(query.level === 'district' || query.level === 'block' || query.level === 'village') && (
          <div className="space-y-8">
            {/* Sublocation Chips (Blocks in District, or Villages in Block) */}
            {initialData.subLocations.length > 0 && (
              <section className="bg-white rounded-2xl shadow-md p-5 border border-slate-200/80">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-blue-600" />
                  {query.level === 'district' ? `Blocks in ${query.districtName}` : `Villages / Wards in ${query.blockName}`}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {initialData.subLocations.slice(0, 28).map((subLoc) => (
                    <Link
                      key={subLoc.slug}
                      href={subLoc.href}
                      onClick={() => setNavigatingTo(subLoc.href)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                        navigatingTo === subLoc.href
                          ? 'bg-blue-100 border-blue-400 text-blue-800'
                          : 'bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border-slate-200 hover:border-blue-300'
                      }`}
                    >
                      {navigatingTo === subLoc.href && <Loader2 className="w-3 h-3 animate-spin" />}
                      <span>{subLoc.name}</span>
                      <span className="text-slate-400 text-[10px]">({subLoc.schoolCount})</span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Filter Trigger Bar (Mobile & Quick Action) */}
            <div className="flex items-center justify-between gap-4 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs">
              <button
                type="button"
                onClick={() => setFilterPanelOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters & Controls</span>
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-white text-[#1a73e8] text-[11px] font-black flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              <div className="text-xs font-semibold text-slate-600">
                <span className="text-[#1a73e8] font-bold">{displayedSchools.length}</span> Schools Filtered
              </div>
            </div>

            {/* ─── SLIDE-OUT FILTER DRAWER / SIDE-SHEET (Exact Map Page Style & Functioning) ─── */}
            <div
              className={`fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300 ${
                filterPanelOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
              }`}
              onClick={() => setFilterPanelOpen(false)}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className={`fixed top-0 bottom-0 left-0 w-[360px] sm:w-[440px] max-w-[92vw] bg-white/95 backdrop-blur-xl shadow-2xl border-r border-slate-200 rounded-r-3xl flex flex-col transition-transform duration-300 ease-out text-xs z-50 ${
                  filterPanelOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
              >
                {/* Filter Drawer Header */}
                <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80 rounded-tr-3xl">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#1a73e8] flex items-center justify-center font-bold">
                      <SlidersHorizontal size={16} />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">Filters & Controls</h3>
                      <p className="text-[11px] text-slate-500">
                        {initialData.totalCount ? initialData.totalCount.toLocaleString('en-IN') : displayedSchools.length} schools available
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFilterPanelOpen(false)}
                    className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Close filters"
                  >
                    <X size={15} />
                  </button>
                </div>

                {/* Filter Drawer Scrollable Body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {renderFilterSidebarControls()}
                </div>

                {/* Filter Drawer Footer Buttons */}
                <div className="p-4 border-t border-slate-200 bg-slate-50/80 rounded-br-3xl flex items-center gap-2">
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="flex-1 py-2.5 px-3 rounded-full border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition-colors text-center cursor-pointer"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterPanelOpen(false)}
                    className="flex-2 py-2.5 px-4 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold transition-all shadow-md text-center cursor-pointer"
                  >
                    Apply Filters ({displayedSchools.length})
                  </button>
                </div>
              </div>
            </div>

            {/* 2-Column Layout: Left Filter Sidebar + Right School Cards */}
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Sticky Left Sidebar (Desktop) */}
              <aside className="hidden lg:block w-72 shrink-0 sticky top-24 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <SlidersHorizontal size={15} className="text-[#1a73e8]" />
                    <span>Quick Filters</span>
                  </h3>
                  {activeFilterCount > 0 && (
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="text-xs text-rose-600 hover:underline font-semibold"
                    >
                      Reset
                    </button>
                  )}
                </div>
                {renderFilterSidebarControls()}
              </aside>

              {/* Right Main School Results */}
              <div className="flex-1 min-w-0 w-full space-y-4">
                {/* Active Filters Bar */}
                {activeFilterCount > 0 && (
                  <div className="flex flex-wrap items-center gap-2 p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl text-xs">
                    <span className="font-bold text-blue-900">Active Filters:</span>
                    {quickManagementFilter !== 'all' && (
                      <span className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border border-blue-300 font-semibold text-blue-800">
                        Mgmt: {quickManagementFilter}
                        <button type="button" onClick={() => setQuickManagementFilter('all')}>
                          <X className="w-3 h-3 text-slate-400 hover:text-slate-700" />
                        </button>
                      </span>
                    )}
                    {selectedBoards.map((b) => (
                      <span key={b} className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border border-blue-300 font-semibold text-blue-800">
                        Board: {b}
                        <button type="button" onClick={() => toggleBoard(b)}>
                          <X className="w-3 h-3 text-slate-400 hover:text-slate-700" />
                        </button>
                      </span>
                    ))}
                    {selectedClass !== 'all' && (
                      <span className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border border-blue-300 font-semibold text-blue-800">
                        Class: {selectedClass === 'nursery' ? 'Nursery' : `${selectedClass}th`}
                        <button type="button" onClick={() => setSelectedClass('all')}>
                          <X className="w-3 h-3 text-slate-400 hover:text-slate-700" />
                        </button>
                      </span>
                    )}
                    {maxAnnualFee !== null && (
                      <span className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border border-blue-300 font-semibold text-blue-800">
                        Fee ≤ ₹{maxAnnualFee.toLocaleString('en-IN')}
                        <button type="button" onClick={() => setMaxAnnualFee(null)}>
                          <X className="w-3 h-3 text-slate-400 hover:text-slate-700" />
                        </button>
                      </span>
                    )}
                    {(minStudents > 0 || maxStudents !== null) && (
                      <span className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border border-blue-300 font-semibold text-blue-800">
                        Students: {minStudents > 0 && maxStudents !== null ? `${minStudents}-${maxStudents}` : minStudents > 0 ? `${minStudents}+` : `≤${maxStudents}`}
                        <button type="button" onClick={() => { setMinStudents(0); setMaxStudents(null); }}>
                          <X className="w-3 h-3 text-slate-400 hover:text-slate-700" />
                        </button>
                      </span>
                    )}
                    {(minTeachers > 0 || maxTeachers !== null) && (
                      <span className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border border-blue-300 font-semibold text-blue-800">
                        Faculty: {minTeachers > 0 && maxTeachers !== null ? `${minTeachers}-${maxTeachers}` : minTeachers > 0 ? `${minTeachers}+` : `≤${maxTeachers}`}
                        <button type="button" onClick={() => { setMinTeachers(0); setMaxTeachers(null); }}>
                          <X className="w-3 h-3 text-slate-400 hover:text-slate-700" />
                        </button>
                      </span>
                    )}
                    {selectedFacilities.map((f) => (
                      <span key={f} className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border border-emerald-300 font-semibold text-emerald-800">
                        {f}
                        <button type="button" onClick={() => toggleFacility(f)}>
                          <X className="w-3 h-3 text-slate-400 hover:text-slate-700" />
                        </button>
                      </span>
                    ))}
                    {onlyPmShri && (
                      <span className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border border-amber-300 font-semibold text-amber-800">
                        PM SHRI Only
                        <button type="button" onClick={() => setOnlyPmShri(false)}>
                          <X className="w-3 h-3 text-slate-400 hover:text-slate-700" />
                        </button>
                      </span>
                    )}
                    {onlyAdmissionsOpen && (
                      <span className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border border-emerald-300 font-semibold text-emerald-800">
                        Admissions Open
                        <button type="button" onClick={() => setOnlyAdmissionsOpen(false)}>
                          <X className="w-3 h-3 text-slate-400 hover:text-slate-700" />
                        </button>
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="ml-auto text-xs font-bold text-rose-600 hover:underline"
                    >
                      Clear All
                    </button>
                  </div>
                )}

                {/* Results Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                    {displayedSchools.length.toLocaleString()} Verified Schools Found
                  </h2>
                  <div className="text-xs text-slate-500 font-medium">
                    Page {initialData.currentPage} of {initialData.totalPages}
                  </div>
                </div>

                {/* 1-Column School Card Grid */}
                <div className="grid grid-cols-1 gap-4">
                  {displayedSchools.map((school) => renderSchoolCard(school, query, setNavigatingTo))}
                </div>

                {/* Empty Fallback */}
                {displayedSchools.length === 0 && (
                  <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
                    <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-slate-800">No schools matched your filter criteria</h3>
                    <p className="text-sm text-slate-500 mt-1 mb-4">
                      Try resetting one or more filters to view more schools in this region.
                    </p>
                    <button
                      onClick={resetFilters}
                      className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-full shadow hover:bg-blue-700 transition-all"
                    >
                      Reset All Filters
                    </button>
                  </div>
                )}

                {/* Pagination */}
                {initialData.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-6">
                    <button
                      onClick={() => handlePageChange(initialData.currentPage - 1)}
                      disabled={initialData.currentPage <= 1}
                      className="px-4 py-2 rounded-full border border-slate-300 bg-white text-slate-700 disabled:opacity-40 text-sm font-semibold flex items-center gap-1 hover:bg-slate-50"
                    >
                      <ChevronLeft className="w-4 h-4" /> Prev
                    </button>
                    <span className="px-4 py-2 text-sm font-medium text-slate-600">
                      Page {initialData.currentPage} of {initialData.totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(initialData.currentPage + 1)}
                      disabled={initialData.currentPage >= initialData.totalPages}
                      className="px-4 py-2 rounded-full border border-slate-300 bg-white text-slate-700 disabled:opacity-40 text-sm font-semibold flex items-center gap-1 hover:bg-slate-50"
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* ────────────────────────────────────────────────────────────────────────── */}
            {/* 24 HIGH-INTENT POPULAR SEARCHES (Bottom Section Right Above FAQs)          */}
            {/* ────────────────────────────────────────────────────────────────────────── */}
            {query.companionIntentPages && query.companionIntentPages.length > 0 && (
              <section className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-slate-200/80 mt-12">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-6">
                  <Sparkles className="w-6 h-6 text-amber-500" />
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      Popular School Searches in {query.districtName || query.stateName}
                    </h3>
                    <p className="text-xs text-slate-500">
                      High-converting category filters across boards, facilities, and school levels.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {query.companionIntentPages.map((intent, idx) => (
                    <Link
                      key={idx}
                      href={intent.href}
                      onClick={() => setNavigatingTo(intent.href)}
                      className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-blue-50/80 hover:border-blue-300 transition-all text-xs font-semibold text-slate-800 hover:text-blue-700 flex items-center justify-between group shadow-sm"
                    >
                      <span className="truncate">{intent.label}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform shrink-0" />
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* ────────────────────────────────────────────────────────────────────────── */}
        {/* SEO FAQ ACCORDION SECTION                                                  */}
        {/* ────────────────────────────────────────────────────────────────────────── */}
        {query.faqs && query.faqs.length > 0 && (
          <section className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-slate-200/80 mt-12">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-blue-600" />
              Frequently Asked Questions
            </h3>

            <div className="divide-y divide-slate-100">
              {query.faqs.map((faq, idx) => (
                <div key={idx} className="py-4">
                  <button
                    onClick={() => setOpenFaqIdx(openFaqIdx === idx ? null : idx)}
                    className="w-full text-left flex items-center justify-between gap-4 font-semibold text-slate-800 hover:text-blue-600 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 transition-transform duration-200 shrink-0 ${
                        openFaqIdx === idx ? 'rotate-180 text-blue-600' : ''
                      }`}
                    />
                  </button>
                  {openFaqIdx === idx && (
                    <p className="mt-3 text-sm text-slate-600 leading-relaxed pr-6">
                      {faq.answer}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

// ─── 1-COLUMN SCHOOL CARD RENDERER ───
function renderSchoolCard(
  school: SchoolRecord,
  query: any,
  setNavigatingTo: (href: string) => void
) {
  const profileUrl = `/school/${(school.state_name || query.stateSlug || 'india').toLowerCase().replace(/\s+/g, '-')}/${(school.district_name || query.districtSlug || 'district').toLowerCase().replace(/\s+/g, '-')}/${(school.village_ward || 'area').toLowerCase().replace(/\s+/g, '-')}/${school.udise_code || school.school_id || school.id}`;
  const hasAtl = school.tinkering_lab_atl === 'Yes' || school.tinkering_lab_atl === true;
  const hasComp = school.ict_lab === 'Yes' || school.ict_lab === true || Number(school.desktop_computers_working) > 0;

  return (
    <div
      key={school.id || school.udise_code}
      className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-blue-300"
    >
      <div className="space-y-3 flex-1">
        {/* Badges Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {hasAtl && (
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-500" /> Atal Tinkering Lab (ATL)
            </span>
          )}
          {school.board && (
            <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
              {school.board}
            </span>
          )}
          {school.management && (
            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
              {school.management}
            </span>
          )}
          {school.residential_school && (
            <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[11px] font-medium border border-amber-200">
              {school.residential_school}
            </span>
          )}
        </div>

        {/* School Name */}
        <div>
          <Link
            href={profileUrl}
            onClick={() => setNavigatingTo(profileUrl)}
            className="text-lg sm:text-xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-2"
          >
            <span>{school.school_name || school.name}</span>
          </Link>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-1">
            <span className="text-slate-700 font-mono font-semibold">UDISE: {school.udise_code || 'N/A'}</span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {[school.village_ward, school.block_name, school.district_name, school.state_name].filter(Boolean).join(', ')}
            </span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-700 pt-1">
          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span>{school.total_students ? `${school.total_students.toLocaleString()} Students` : 'Verified Enrollment'}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
            <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
            <span>{school.total_teachers ? `${school.total_teachers} Teachers` : 'Qualified Faculty'}</span>
          </div>
          {hasComp && (
            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600">
              <Laptop className="w-3.5 h-3.5 text-emerald-600" />
              <span>Computer Lab</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex sm:flex-col items-center gap-2 justify-end pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
        <Link
          href={profileUrl}
          onClick={() => setNavigatingTo(profileUrl)}
          className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm text-center shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5"
        >
          <span>View Profile</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
