'use client';

import React, { useState, useMemo, useRef } from 'react';
import {
  SlidersHorizontal, X, RotateCcw, Check, ArrowRight, ChevronDown, ChevronLeft,
  Search, Sparkles, Navigation, ArrowUpDown, Award, GraduationCap, Building2,
  Building, Landmark, Castle, Compass, Shield, Swords, Target,
  MapPin, CheckCircle2, ChevronRight, IndianRupee, Users
} from 'lucide-react';
import {
  renderFacilityIcon, renderCategoryHeaderIcon, renderBoardLogo,
  renderClassIcon, renderSchoolTypeIcon, renderSpecialCategoryIcon
} from './FacilityIcons';
import { FACILITY_CATEGORIES } from './FacilityData';

export interface SchoolFilterSheetProps {
  mode: 'sheet' | 'sidebar';
  isOpen?: boolean;
  onClose?: () => void;
  totalSchoolsCount: number;
  displayedCount: number;
  // Filter States
  selectedBoard: string;
  setSelectedBoard: (board: string) => void;
  selectedStateBoard: string | null;
  setSelectedStateBoard: (state: string | null) => void;
  setIsStateModalOpen: (open: boolean) => void;
  selectedResidential: string;
  setSelectedResidential: (residential: string) => void;
  selectedFacilities: string[];
  toggleFacility: (facility: string) => void;
  setSelectedFacilities: React.Dispatch<React.SetStateAction<string[]>>;
  selectedClasses: string[];
  setSelectedClasses: React.Dispatch<React.SetStateAction<string[]>>;
  selectedSchoolTypes: string[];
  setSelectedSchoolTypes: React.Dispatch<React.SetStateAction<string[]>>;
  selectedSpecialCategories: string[];
  setSelectedSpecialCategories: React.Dispatch<React.SetStateAction<string[]>>;
  selectedLocation: string | null;
  setSelectedLocation: (loc: string | null) => void;
  feeMax: number;
  setFeeMax: (fee: number) => void;
  studentMax: number;
  setStudentMax: (strength: number) => void;
  onlyAtl: boolean;
  setOnlyAtl: (atl: boolean) => void;
  mapRadiusKm: number;
  setMapRadiusKm: (radius: number) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  setSearchMode: (mode: 'text' | 'near_me') => void;
  setSearchTerm: (term: string) => void;
  handleFilterChange: (filters: Record<string, string | undefined>) => void;
  onResetAll: () => void;
  // Sidebar minimize
  isSidebarMinimized?: boolean;
  setIsSidebarMinimized?: (minimized: boolean) => void;
}

const CLASS_STAGES = [
  {
    stage: 'Pre-School',
    description: 'Ages 2-5',
    classes: ['Play Group', 'Pre-Nursery', 'Nursery', 'LKG', 'UKG'],
  },
  {
    stage: 'Primary',
    description: 'Class 1 to 5',
    classes: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'],
  },
  {
    stage: 'Middle',
    description: 'Class 6 to 8',
    classes: ['Class 6', 'Class 7', 'Class 8'],
  },
  {
    stage: 'Secondary',
    description: 'Class 9 to 10',
    classes: ['Class 9', 'Class 10'],
  },
  {
    stage: 'Senior Secondary',
    description: 'Class 11 to 12',
    classes: ['Class 11', 'Class 12'],
  },
];

const BOARD_OPTIONS = [
  { name: 'CBSE', tag: 'Central Board of Secondary Education' },
  { name: 'ICSE', tag: 'Council for the Indian School Certificate' },
  { name: 'IB', tag: 'International Baccalaureate' },
  { name: 'Cambridge/IGCSE', tag: 'Cambridge Assessment International' },
  { name: 'State Board', tag: 'State Government Board of Education' },
];

const SCHOOL_TYPES = [
  { name: 'Private Unaided', Icon: Building, desc: 'Independently managed private school' },
  { name: 'Government', Icon: Landmark, desc: 'Central or State government operated' },
  { name: 'Government Aided', Icon: Castle, desc: 'Privately managed with govt grants' },
  { name: 'International', Icon: Compass, desc: 'Affiliated to international curriculum' },
];

const SPECIAL_CATEGORIES = [
  { name: 'Sainik School', Icon: Shield },
  { name: 'Kendriya Vidyalaya (KVS)', Icon: Landmark },
  { name: 'Navodaya Vidyalaya (JNV)', Icon: GraduationCap },
  { name: 'Army Public School (APS)', Icon: Swords },
  { name: 'Eklavya Model (EMRS)', Icon: Target },
];

const POPULAR_FACILITIES = [
  'Smart Classes',
  'Robotics Lab',
  'Composite Science Lab',
  'Computer Lab',
  'Swimming Pool',
  'Library',
  'ATL Tinkering Lab',
  'Playground / Outdoor Sports',
];

export const SchoolFilterSheet: React.FC<SchoolFilterSheetProps> = ({
  mode,
  isOpen = false,
  onClose,
  totalSchoolsCount,
  displayedCount,
  selectedBoard,
  setSelectedBoard,
  selectedStateBoard,
  setSelectedStateBoard,
  setIsStateModalOpen,
  selectedResidential,
  setSelectedResidential,
  selectedFacilities,
  toggleFacility,
  setSelectedFacilities,
  selectedClasses,
  setSelectedClasses,
  selectedSchoolTypes,
  setSelectedSchoolTypes,
  selectedSpecialCategories,
  setSelectedSpecialCategories,
  selectedLocation,
  setSelectedLocation,
  feeMax,
  setFeeMax,
  studentMax,
  setStudentMax,
  onlyAtl,
  setOnlyAtl,
  mapRadiusKm,
  setMapRadiusKm,
  sortBy,
  setSortBy,
  setSearchMode,
  setSearchTerm,
  handleFilterChange,
  onResetAll,
  isSidebarMinimized,
  setIsSidebarMinimized,
}) => {
  const [facilitySearch, setFacilitySearch] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Active filters count
  const activeCount = useMemo(() => {
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

  // Filter facilities by search query
  const filteredFacilityCategories = useMemo(() => {
    if (!facilitySearch.trim()) return FACILITY_CATEGORIES;
    const q = facilitySearch.toLowerCase().trim();
    return FACILITY_CATEGORIES.map((cat) => ({
      ...cat,
      items: cat.items.filter((item) => item.name.toLowerCase().includes(q)),
    })).filter((cat) => cat.items.length > 0);
  }, [facilitySearch]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const toggleStageClasses = (stageClasses: string[]) => {
    const allSelected = stageClasses.every((c) => selectedClasses.includes(c));
    if (allSelected) {
      setSelectedClasses((prev) => prev.filter((c) => !stageClasses.includes(c)));
    } else {
      setSelectedClasses((prev) => Array.from(new Set([...prev, ...stageClasses])));
    }
  };

  // Google Material 3 Standard Filter Content
  const renderFilterBody = () => (
    <div className="space-y-4 pb-16 md:pb-4 text-[13px] text-gray-700">
      {/* ── Active Filter Chips Bar ── */}
      {activeCount > 0 && (
        <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
              {activeCount} Active Filter{activeCount > 1 ? 's' : ''}
            </span>
            <button
              type="button"
              onClick={onResetAll}
              className="text-[11px] font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer transition hover:underline"
            >
              <RotateCcw size={11} />
              Reset All
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
            {selectedBoard && selectedBoard !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-100/80 text-blue-800 border border-blue-200">
                Board: {selectedBoard}
                <button
                  type="button"
                  onClick={() => setSelectedBoard('all')}
                  className="hover:text-red-600 transition ml-0.5"
                  aria-label="Remove Board Filter"
                >
                  <X size={11} />
                </button>
              </span>
            )}
            {selectedStateBoard && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-100/80 text-blue-800 border border-blue-200">
                State: {selectedStateBoard}
                <button
                  type="button"
                  onClick={() => setSelectedStateBoard(null)}
                  className="hover:text-red-600 transition ml-0.5"
                  aria-label="Remove State Board Filter"
                >
                  <X size={11} />
                </button>
              </span>
            )}
            {selectedResidential && selectedResidential !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-100/80 text-blue-800 border border-blue-200">
                Format: {selectedResidential === 'day' ? 'Day School' : 'Boarding'}
                <button
                  type="button"
                  onClick={() => setSelectedResidential('all')}
                  className="hover:text-red-600 transition ml-0.5"
                  aria-label="Remove School Format Filter"
                >
                  <X size={11} />
                </button>
              </span>
            )}
            {selectedClasses.map((cls) => (
              <span
                key={cls}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-100/80 text-blue-800 border border-blue-200"
              >
                {cls}
                <button
                  type="button"
                  onClick={() => setSelectedClasses((prev) => prev.filter((c) => c !== cls))}
                  className="hover:text-red-600 transition ml-0.5"
                  aria-label={`Remove ${cls} Filter`}
                >
                  <X size={11} />
                </button>
              </span>
            ))}
            {selectedSchoolTypes.map((type) => (
              <span
                key={type}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-700 border border-gray-300"
              >
                {type}
                <button
                  type="button"
                  onClick={() => setSelectedSchoolTypes((prev) => prev.filter((t) => t !== type))}
                  className="hover:text-red-600 transition ml-0.5"
                  aria-label={`Remove ${type} Filter`}
                >
                  <X size={11} />
                </button>
              </span>
            ))}
            {selectedSpecialCategories.map((cat) => (
              <span
                key={cat}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200"
              >
                {cat}
                <button
                  type="button"
                  onClick={() => setSelectedSpecialCategories((prev) => prev.filter((c) => c !== cat))}
                  className="hover:text-red-600 transition ml-0.5"
                  aria-label={`Remove ${cat} Filter`}
                >
                  <X size={11} />
                </button>
              </span>
            ))}
            {feeMax < 1000000 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                Fee &le; ₹{(feeMax / 100000).toFixed(1)}L
                <button
                  type="button"
                  onClick={() => setFeeMax(1000000)}
                  className="hover:text-red-600 transition ml-0.5"
                  aria-label="Remove Fee Filter"
                >
                  <X size={11} />
                </button>
              </span>
            )}
            {selectedFacilities.map((fac) => (
              <span
                key={fac}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-medium bg-gray-100 text-gray-700 border border-gray-200"
              >
                {fac}
                <button
                  type="button"
                  onClick={() => toggleFacility(fac)}
                  className="hover:text-red-600 transition ml-0.5"
                  aria-label={`Remove ${fac} Facility`}
                >
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Section: Sort Dropdown ── */}
      <div id="filter-sort" className="p-3 bg-white border border-gray-200/90 rounded-xl shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-gray-900 font-medium text-xs">
            <ArrowUpDown size={14} className="text-blue-600" />
            <span>Sort by</span>
          </div>
          <span className="text-[10px] font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
            {sortBy.includes('desc') ? 'High to Low' : sortBy.includes('asc') ? 'Low to High' : 'Custom'}
          </span>
        </div>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => {
              const val = e.target.value;
              setSortBy(val);
              if (val !== 'distance_asc' && val !== 'distance_desc') {
                setSearchMode('text');
              }
              handleFilterChange({ sort: val });
            }}
            className="w-full text-xs text-gray-800 font-medium bg-gray-50/80 border border-gray-200 rounded-lg px-3 py-2 pr-8 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer transition appearance-none"
          >
            <option value="popularity_desc">Popularity: High to Low</option>
            <option value="popularity_asc">Popularity: Low to High</option>
            <option value="distance_asc">Distance: Nearest First</option>
            <option value="distance_desc">Distance: Farthest First</option>
            <option value="students_desc">Student Strength: High to Low</option>
            <option value="students_asc">Student Strength: Low to High</option>
            <option value="name_asc">School Name: A to Z</option>
            <option value="name_desc">School Name: Z to A</option>
            <option value="teachers">Faculty Count: High to Low</option>
          </select>
          <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* ── Section: Search Distance Radius ── */}
      <div id="filter-radius" className="p-3 bg-white border border-gray-200/90 rounded-xl shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-gray-900 font-medium text-xs">
            <Navigation size={14} className="text-blue-600" />
            <span>Search Distance</span>
          </div>
          <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
            {mapRadiusKm} km
          </span>
        </div>

        <div className="space-y-2">
          <input
            type="range"
            min="0.5"
            max="10"
            step="0.5"
            value={mapRadiusKm}
            onChange={(e) => setMapRadiusKm(Number(e.target.value))}
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-[10px] text-gray-500 font-medium">
            <span>0.5 km</span>
            <span>5 km</span>
            <span>10 km</span>
          </div>
          <div className="flex items-center justify-between gap-1 pt-1">
            {[1, 2, 3, 5, 10].map((km) => (
              <button
                key={km}
                type="button"
                onClick={() => setMapRadiusKm(km)}
                className={`flex-1 py-1 rounded text-[11px] font-medium transition cursor-pointer ${
                  mapRadiusKm === km
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                {km}k
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Section: Curriculum Board (Single Column — Full Text, No Truncation) ── */}
      <div id="filter-board" className="p-3 bg-white border border-gray-200/90 rounded-xl shadow-2xs">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5 text-gray-900 font-medium text-xs">
            <Award size={14} className="text-blue-600" />
            <span>Curriculum Board</span>
          </div>
          {selectedBoard !== 'all' && (
            <button
              type="button"
              onClick={() => {
                setSelectedBoard('all');
                handleFilterChange({ board: undefined });
              }}
              className="text-[11px] font-medium text-blue-600 hover:underline cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Single Column to avoid any text cutting off */}
        <div className="space-y-1.5">
          {BOARD_OPTIONS.map((board) => {
            const isSelected = selectedBoard.toLowerCase() === board.name.toLowerCase();
            return (
              <div
                key={board.name}
                onClick={() => {
                  const nextBoard = isSelected ? 'all' : board.name;
                  setSelectedBoard(nextBoard);
                  handleFilterChange({ board: nextBoard === 'all' ? undefined : nextBoard });
                }}
                className={`flex items-center justify-between p-2 rounded-xl border transition cursor-pointer select-none ${
                  isSelected
                    ? 'bg-blue-50/80 border-blue-500 text-blue-900 shadow-2xs'
                    : 'bg-white border-gray-200 hover:bg-gray-50/80 text-gray-800'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <div className="w-5 h-5 flex items-center justify-center shrink-0">
                    {renderBoardLogo(board.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold leading-tight text-gray-900">{board.name}</p>
                    <p className="text-[10px] text-gray-500 leading-tight mt-0.5 truncate">{board.tag}</p>
                  </div>
                </div>

                {isSelected ? (
                  <CheckCircle2 size={16} className="text-blue-600 shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-gray-300 shrink-0" />
                )}
              </div>
            );
          })}
        </div>

        {selectedBoard === 'State Board' && (
          <div className="mt-2.5 p-2 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
            <span className="text-[11px] text-blue-800 font-medium truncate pr-2">
              {selectedStateBoard ? `State: ${selectedStateBoard}` : 'Specific State Board'}
            </span>
            <button
              type="button"
              onClick={() => setIsStateModalOpen(true)}
              className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-blue-600 text-white hover:bg-blue-700 transition shadow-2xs shrink-0 cursor-pointer"
            >
              {selectedStateBoard ? 'Change' : 'Select State'}
            </button>
          </div>
        )}
      </div>

      {/* ── Section: Classes / Grade Stages ── */}
      <div id="filter-class" className="p-3 bg-white border border-gray-200/90 rounded-xl shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-gray-900 font-medium text-xs">
            <GraduationCap size={14} className="text-blue-600" />
            <span>Class / Grade</span>
          </div>
          {selectedClasses.length > 0 && (
            <button
              type="button"
              onClick={() => setSelectedClasses([])}
              className="text-[11px] font-medium text-blue-600 hover:underline cursor-pointer"
            >
              Clear ({selectedClasses.length})
            </button>
          )}
        </div>

        <div className="space-y-2">
          {CLASS_STAGES.map((stg) => {
            const stageActiveCount = stg.classes.filter((c) => selectedClasses.includes(c)).length;
            const isAllStageSelected = stageActiveCount === stg.classes.length;

            return (
              <div key={stg.stage} className="bg-gray-50/80 p-2 rounded-xl border border-gray-200/70">
                <div className="flex items-center justify-between mb-1.5 px-0.5">
                  <span className="text-[11px] font-medium text-gray-700">{stg.stage}</span>
                  <button
                    type="button"
                    onClick={() => toggleStageClasses(stg.classes)}
                    className="text-[10px] font-medium text-blue-600 hover:underline cursor-pointer"
                  >
                    {isAllStageSelected ? 'Clear' : 'Select all'}
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {stg.classes.map((cls) => {
                    const isSelected = selectedClasses.includes(cls);
                    return (
                      <button
                        key={cls}
                        type="button"
                        onClick={() =>
                          setSelectedClasses((prev) =>
                            prev.includes(cls) ? prev.filter((c) => c !== cls) : [...prev, cls]
                          )
                        }
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition cursor-pointer select-none ${
                          isSelected
                            ? 'bg-blue-50 text-blue-700 border border-blue-500 shadow-2xs font-semibold'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        <span>{cls}</span>
                        {isSelected && <Check size={11} className="text-blue-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Section: School Format (Segmented Control) ── */}
      <div id="filter-format" className="p-3 bg-white border border-gray-200/90 rounded-xl shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-gray-900 font-medium text-xs">
            <Building2 size={14} className="text-blue-600" />
            <span>School Format</span>
          </div>
          {selectedResidential !== 'all' && (
            <button
              type="button"
              onClick={() => {
                setSelectedResidential('all');
                handleFilterChange({ residential: undefined });
              }}
              className="text-[11px] font-medium text-blue-600 hover:underline cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-1 bg-gray-100 p-1 rounded-lg">
          {[
            { id: 'all', label: 'All' },
            { id: 'day', label: 'Day' },
            { id: 'boarding', label: 'Boarding' },
          ].map((fmt) => (
            <button
              key={fmt.id}
              type="button"
              onClick={() => {
                setSelectedResidential(fmt.id);
                handleFilterChange({ residential: fmt.id === 'all' ? undefined : fmt.id });
              }}
              className={`py-1.5 rounded-md text-xs font-medium transition cursor-pointer ${
                selectedResidential === fmt.id
                  ? 'bg-white text-blue-700 shadow-xs font-semibold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {fmt.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Section: School Type (Single Column — Full Text, No Truncation) ── */}
      <div id="filter-type" className="p-3 bg-white border border-gray-200/90 rounded-xl shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-gray-900 font-medium text-xs">
            <Landmark size={14} className="text-blue-600" />
            <span>School Type</span>
          </div>
          {selectedSchoolTypes.length > 0 && (
            <button
              type="button"
              onClick={() => setSelectedSchoolTypes([])}
              className="text-[11px] font-medium text-blue-600 hover:underline cursor-pointer"
            >
              Clear ({selectedSchoolTypes.length})
            </button>
          )}
        </div>

        <div className="space-y-1.5">
          {SCHOOL_TYPES.map((type) => {
            const isChecked = selectedSchoolTypes.includes(type.name);
            const TypeIcon = type.Icon;
            return (
              <div
                key={type.name}
                onClick={() =>
                  setSelectedSchoolTypes((prev) =>
                    prev.includes(type.name) ? prev.filter((t) => t !== type.name) : [...prev, type.name]
                  )
                }
                className={`flex items-center justify-between p-2 rounded-xl border transition cursor-pointer select-none ${
                  isChecked
                    ? 'bg-blue-50/80 border-blue-500 text-blue-900 shadow-2xs'
                    : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-800'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <div className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center shrink-0 text-gray-600">
                    <TypeIcon size={13} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold leading-tight text-gray-900">{type.name}</p>
                    <p className="text-[10px] text-gray-500 leading-tight mt-0.5 truncate">{type.desc}</p>
                  </div>
                </div>
                {isChecked ? (
                  <CheckCircle2 size={16} className="text-blue-600 shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-gray-300 shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Section: Special Institutional Categories ── */}
      <div id="filter-special" className="p-3 bg-white border border-gray-200/90 rounded-xl shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-gray-900 font-medium text-xs">
            <Shield size={14} className="text-blue-600" />
            <span>Special Wings</span>
          </div>
          {selectedSpecialCategories.length > 0 && (
            <button
              type="button"
              onClick={() => setSelectedSpecialCategories([])}
              className="text-[11px] font-medium text-blue-600 hover:underline cursor-pointer"
            >
              Clear ({selectedSpecialCategories.length})
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {SPECIAL_CATEGORIES.map((cat) => {
            const isChecked = selectedSpecialCategories.includes(cat.name);
            const CatIcon = cat.Icon;
            return (
              <button
                key={cat.name}
                type="button"
                onClick={() =>
                  setSelectedSpecialCategories((prev) =>
                    prev.includes(cat.name) ? prev.filter((c) => c !== cat.name) : [...prev, cat.name]
                  )
                }
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer select-none ${
                  isChecked
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-500 shadow-2xs font-semibold'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                <CatIcon size={12} className={isChecked ? 'text-emerald-700' : 'text-gray-400'} />
                <span>{cat.name}</span>
                {isChecked && <Check size={11} className="text-emerald-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Section: Annual Fees Range ── */}
      <div id="filter-fees" className="p-3 bg-white border border-gray-200/90 rounded-xl shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-gray-900 font-medium text-xs">
            <IndianRupee size={14} className="text-blue-600" />
            <span>Annual Fees</span>
          </div>
          <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
            {feeMax >= 1000000 ? 'Any Fee (Up to ₹10L+)' : `Up to ₹${(feeMax / 100000).toFixed(1)} Lakh`}
          </span>
        </div>

        <div className="space-y-2.5">
          <div className="grid grid-cols-5 gap-1">
            {[
              { label: 'Any', value: 1000000 },
              { label: '< 50K', value: 50000 },
              { label: '< 1.5L', value: 150000 },
              { label: '< 3L', value: 300000 },
              { label: '< 5L', value: 500000 },
            ].map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => setFeeMax(p.value)}
                className={`py-1 rounded-md text-[11px] font-medium transition cursor-pointer ${
                  feeMax === p.value
                    ? 'bg-blue-600 text-white shadow-2xs font-semibold'
                    : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <input
            type="range"
            min="0"
            max="1000000"
            step="25000"
            value={feeMax}
            onChange={(e) => setFeeMax(Number(e.target.value))}
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-[10px] text-gray-500 font-medium">
            <span>₹0</span>
            <span>₹5 Lakh</span>
            <span>₹10 Lakh+</span>
          </div>
        </div>
      </div>

      {/* ── Section: Student Strength ── */}
      <div id="filter-students" className="p-3 bg-white border border-gray-200/90 rounded-xl shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-gray-900 font-medium text-xs">
            <Users size={14} className="text-blue-600" />
            <span>Student Strength</span>
          </div>
          <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full">
            {studentMax >= 5000 ? 'Any (Up to 5000+)' : `Up to ${studentMax} Students`}
          </span>
        </div>

        <div className="space-y-2.5">
          <div className="grid grid-cols-4 gap-1">
            {[
              { label: 'Any', value: 5000 },
              { label: '< 500', value: 500 },
              { label: '< 1500', value: 1500 },
              { label: '< 3000', value: 3000 },
            ].map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={() => setStudentMax(s.value)}
                className={`py-1 rounded-md text-[11px] font-medium transition cursor-pointer ${
                  studentMax === s.value
                    ? 'bg-gray-800 text-white shadow-2xs font-semibold'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <input
            type="range"
            min="100"
            max="5000"
            step="100"
            value={studentMax}
            onChange={(e) => setStudentMax(Number(e.target.value))}
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-800"
          />
          <div className="flex justify-between text-[10px] text-gray-500 font-medium">
            <span>100</span>
            <span>2,500</span>
            <span>5,000+</span>
          </div>
        </div>
      </div>

      {/* ── Section: Facilities & Campus Infrastructure ── */}
      <div id="filter-facilities" className="p-3 bg-white border border-gray-200/90 rounded-xl shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-gray-900 font-medium text-xs">
            <Sparkles size={14} className="text-blue-600" />
            <span>Campus Facilities</span>
          </div>
          {selectedFacilities.length > 0 && (
            <button
              type="button"
              onClick={() => setSelectedFacilities([])}
              className="text-[11px] font-medium text-blue-600 hover:underline cursor-pointer"
            >
              Clear ({selectedFacilities.length})
            </button>
          )}
        </div>

        {/* Search facilities */}
        <div className="relative mb-2.5">
          <input
            type="text"
            value={facilitySearch}
            onChange={(e) => setFacilitySearch(e.target.value)}
            placeholder="Search facilities..."
            className="w-full pl-8 pr-7 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
          />
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          {facilitySearch && (
            <button
              type="button"
              onClick={() => setFacilitySearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Popular facilities quick strip */}
        {!facilitySearch && (
          <div className="mb-3">
            <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Popular</p>
            <div className="flex flex-wrap gap-1">
              {POPULAR_FACILITIES.map((fac) => {
                const isSelected = selectedFacilities.includes(fac);
                return (
                  <button
                    key={fac}
                    type="button"
                    onClick={() => toggleFacility(fac)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition cursor-pointer select-none ${
                      isSelected
                        ? 'bg-blue-50 text-blue-700 border border-blue-500 font-semibold'
                        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <span>{fac}</span>
                    {isSelected && <Check size={10} className="text-blue-600" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Categorized Facility Accordions — Single column items to prevent text wrapping issues */}
        <div className="space-y-1.5">
          {filteredFacilityCategories.map((cat) => {
            const catActiveCount = cat.items.filter((item) => selectedFacilities.includes(item.name)).length;
            return (
              <details key={cat.category} className="group" open={Boolean(facilitySearch) || catActiveCount > 0}>
                <summary className="text-xs font-medium text-gray-900 cursor-pointer list-none flex items-center justify-between bg-gray-50/90 hover:bg-gray-100 p-2 rounded-lg border border-gray-200 select-none">
                  <div className="flex items-center gap-2">
                    {renderCategoryHeaderIcon(cat.category, cat.categoryIcon)}
                    <span>{cat.category}</span>
                    {catActiveCount > 0 && (
                      <span className="text-[10px] font-semibold text-white bg-blue-600 px-1.5 py-0.2 rounded-full">
                        {catActiveCount}
                      </span>
                    )}
                  </div>
                  <ChevronDown size={14} className="text-gray-500 group-open:rotate-180 transition-transform" />
                </summary>

                {/* Single Column for each facility to display full name smoothly */}
                <div className="mt-1.5 space-y-0.5 px-1 py-1">
                  {cat.items.map((item) => {
                    const isChecked = selectedFacilities.includes(item.name);
                    return (
                      <label
                        key={item.name}
                        className={`flex items-center gap-2.5 p-1.5 rounded-lg cursor-pointer transition select-none ${
                          isChecked
                            ? 'bg-blue-50/80 text-blue-900 font-medium'
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleFacility(item.name)}
                          className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <div className="w-4 h-4 flex items-center justify-center shrink-0 text-gray-500">
                          {renderFacilityIcon(item)}
                        </div>
                        <span className="text-xs leading-normal">
                          {item.name}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </details>
            );
          })}
        </div>
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────────────
  // 1. MOBILE SHEET MODE (< 768px Drawer / Bottom Sheet)
  // ─────────────────────────────────────────────────────────────
  if (mode === 'sheet') {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-[99990] md:hidden">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          onClick={onClose}
        />

        {/* Mobile Left Drawer Sheet */}
        <div className="fixed inset-y-0 left-0 w-[88vw] max-w-[360px] h-full bg-white shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-left duration-300 z-10">
          {/* Sticky Header */}
          <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between shrink-0 bg-white">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <SlidersHorizontal size={15} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-base font-semibold text-gray-900">Filters</h2>
                  {activeCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-600 text-white">
                      {activeCount}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-gray-500">
                  {displayedCount} of {totalSchoolsCount} schools match
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {activeCount > 0 && (
                <button
                  type="button"
                  onClick={onResetAll}
                  className="px-2.5 py-1 rounded-full text-xs font-medium text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                >
                  Reset
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition cursor-pointer"
                aria-label="Close Filter Sheet"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Quick Category Jump Tabs */}
          <div className="px-3 py-2 bg-gray-50 border-b border-gray-200 flex items-center gap-1.5 overflow-x-auto shrink-0 custom-scrollbar">
            {[
              { id: 'filter-sort', label: 'Sort' },
              { id: 'filter-board', label: 'Board' },
              { id: 'filter-class', label: 'Class' },
              { id: 'filter-format', label: 'Format' },
              { id: 'filter-type', label: 'Type' },
              { id: 'filter-fees', label: 'Fees' },
              { id: 'filter-radius', label: 'Distance' },
              { id: 'filter-facilities', label: 'Facilities' },
              { id: 'filter-special', label: 'Special' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => scrollToSection(tab.id)}
                className="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-200 transition cursor-pointer shadow-2xs"
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Scrollable Content Body */}
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto px-4 py-3 custom-scrollbar"
          >
            {renderFilterBody()}
          </div>

          {/* Sticky Bottom CTA Bar */}
          <div className="p-3 border-t border-gray-200 bg-white flex items-center gap-2 shadow-lg shrink-0">
            <button
              type="button"
              onClick={onResetAll}
              className="px-3.5 py-2.5 rounded-full text-xs font-semibold text-gray-700 hover:bg-gray-100 transition border border-gray-300 cursor-pointer whitespace-nowrap shrink-0"
            >
              Clear all
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-full text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-1.5 shadow-sm transition active:scale-98 cursor-pointer whitespace-nowrap overflow-hidden"
            >
              <span>Apply</span>
              <span className="opacity-80 font-normal">({displayedCount} Schools)</span>
              
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 2. DESKTOP SIDEBAR MODE (>= 768px)
  // ─────────────────────────────────────────────────────────────
  return (
    <aside
      className={`
        hidden md:flex flex-col md:fixed md:left-0 md:w-64 lg:w-72 md:z-30 md:translate-x-0 md:bg-white md:shadow-none directory-sidebar-fixed rounded-none
        ${isSidebarMinimized ? 'md:hidden' : ''}
      `}
    >
      <div className="flex-1 overflow-y-auto overflow-x-hidden bg-white rounded-none md:border-r md:border-b md:border-gray-200 md:shadow-xs p-3.5 flex flex-col custom-scrollbar h-full">
        {/* Desktop Header */}
        <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-gray-200">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <SlidersHorizontal size={13} />
            </div>
            <span className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
              Filters
            </span>
            {activeCount > 0 ? (
              <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded-full border border-blue-200">
                {activeCount}
              </span>
            ) : (
              <span className="text-[10px] font-medium text-gray-400">All</span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {activeCount > 0 && (
              <button
                type="button"
                onClick={onResetAll}
                className="px-2 py-0.5 rounded-full text-[11px] font-medium text-blue-600 hover:bg-blue-50 border border-blue-200 transition cursor-pointer"
                title="Reset all active filters"
              >
                Reset
              </button>
            )}
            {setIsSidebarMinimized && (
              <button
                type="button"
                onClick={() => setIsSidebarMinimized(true)}
                className="p-1 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition cursor-pointer"
                title="Minimise Filters"
              >
                <ChevronLeft size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Filter Content */}
        {renderFilterBody()}
      </div>
    </aside>
  );
};

export default SchoolFilterSheet;
