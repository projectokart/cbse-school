'use client';

import React from 'react';
import EditableText from '@/components/schools/template/EditableText';
import EditableIcon from '@/components/schools/template/EditableIcon';

export interface SchoolStatsSectionProps {
  displayBoard: string;
  displayUdise: string;
  totalStudents: number;
  totalTeachers: number;
  classroomsCount: number;
  schoolCategory: string;
  classFrom: string;
  classTo: string;
  templateData: any;
  residentialSchool?: string;
  schoolType?: string;
  medium?: string;
  genderType?: string;
}

export function formatShortStatKeyword(text: string, type: 'management' | 'gender' | 'nature' | 'medium'): string {
  if (!text) return '';
  const lower = text.toLowerCase().trim();
  
  if (type === 'management') {
    if (lower.includes('private') || lower.includes('pvt') || lower.includes('unaided') || lower.includes('un-aided')) return 'Private';
    if (lower.includes('aided')) return 'Aided';
    if (lower.includes('central') || lower.includes('kendriya') || lower.includes('kvs') || lower.includes('jnv')) return 'Central Govt';
    if (lower.includes('govt') || lower.includes('government') || lower.includes('dept') || lower.includes('tribal')) return 'Govt';
    return 'Private';
  }

  if (type === 'gender') {
    if (lower.includes('co-ed') || lower.includes('coed') || lower.includes('co-educat')) return 'Co-Edu';
    if (lower.includes('boys')) return 'Boys';
    if (lower.includes('girls')) return 'Girls';
    return 'Co-Edu';
  }

  if (type === 'nature') {
    if (lower.includes('day') && (lower.includes('boarding') || lower.includes('residen'))) return 'Day-Boarding';
    if (lower.includes('day')) return 'Day School';
    if (lower.includes('boarding') || lower.includes('residen')) return 'Residential';
    return text.length > 12 ? text.slice(0, 12) : text;
  }

  if (type === 'medium') {
    if (lower.includes('english') && lower.includes('hindi')) return 'Eng / Hin';
    if (lower.includes('english')) return 'English';
    if (lower.includes('hindi')) return 'Hindi';
    return text.length > 10 ? text.slice(0, 10) : text;
  }

  return text;
}

export function formatOrdinal(num: number | string): string {
  const n = parseInt(String(num).replace(/\D/g, ''), 10);
  if (isNaN(n)) return String(num);
  const j = n % 10;
  const k = n % 100;
  if (j === 1 && k !== 11) return `${n}st`;
  if (j === 2 && k !== 12) return `${n}nd`;
  if (j === 3 && k !== 13) return `${n}rd`;
  return `${n}th`;
}

export function parseGradePart(part: string): string {
  const p = (part || '').toLowerCase().trim();
  if (!p) return '';
  if (p.includes('nur') || p.includes('pre') || p.includes('kg')) return 'Nursery';
  const numMatch = p.match(/\d+/);
  if (numMatch) return formatOrdinal(numMatch[0]);
  const romanMap: Record<string, string> = {
    'i': '1st', 'ii': '2nd', 'iii': '3rd', 'iv': '4th', 'v': '5th',
    'vi': '6th', 'vii': '7th', 'viii': '8th', 'ix': '9th', 'x': '10th',
    'xi': '11th', 'xii': '12th'
  };
  const romanMatch = p.match(/\b(xii|xi|x|ix|viii|vii|vi|v|iv|iii|ii|i)\b/);
  if (romanMatch) return romanMap[romanMatch[1]];
  return p;
}

export function formatShortGradeRange(raw: string, classFrom?: string, classTo?: string): string {
  let val = (raw || '').trim();
  if (!val && classFrom && classTo) {
    val = `${classFrom} - ${classTo}`;
  }
  if (!val) return 'Nursery - 12th';

  const lower = val.toLowerCase();

  // UDISE Standard Categories
  if (lower.includes('sec and higher sec') || (lower.includes('primary') && lower.includes('higher sec'))) return '1st - 12th';
  if (lower.includes('upper pr') && lower.includes('higher sec')) return '6th - 12th';
  if (lower.includes('up pr. and secondary') || (lower.includes('primary') && lower.includes('secondary only'))) return '1st - 10th';
  if (lower.includes('upper primary only') || lower.includes('up. pr')) return '6th - 8th';
  if (lower.includes('higher secondary only')) return '11th - 12th';
  if (lower.includes('secondary only')) return '9th - 10th';
  if (lower.includes('primary only')) return '1st - 5th';

  const normalized = val
    .replace(/pre[- ]?primary/gi, 'Nursery')
    .replace(/pre[- ]?k/gi, 'Nursery')
    .replace(/nur\b/gi, 'Nursery')
    .replace(/nursery/gi, 'Nursery');

  // Split by range separators: -, –, to, /
  const parts = normalized.split(/\s*[-–]\s*|\s*\bto\b\s*|\s*\/\s*/i);
  if (parts.length >= 2) {
    const start = parseGradePart(parts[0]);
    const end = parseGradePart(parts[parts.length - 1]);
    if (start && end) {
      return `${start} - ${end}`;
    }
  }

  const single = parseGradePart(normalized);
  return single.length > 14 ? single.slice(0, 14) : single;
}

export function formatShortRooms(raw: string, count?: number): string {
  if (raw) {
    const trimmed = raw.trim();
    const match = trimmed.match(/^(\d+\+?)\s*(?:labs?\s*&?\s*rooms?|rooms?\s*&?\s*labs?|rooms?|labs?)/i);
    if (match) {
      return `${match[1]} Rooms`;
    }
    if (trimmed.length > 11) {
      return trimmed.slice(0, 11);
    }
    return trimmed;
  }
  if (count && count > 0) return `${count} Rooms`;
  return '35+ Rooms';
}

export function formatShortBoard(board: string): string {
  if (!board || board === 'N/A') return 'CBSE';
  const trimmed = board.trim();
  const lower = trimmed.toLowerCase();
  if (lower.includes('cbse')) return 'CBSE';
  if (lower.includes('icse') || lower.includes('cisce')) return 'ICSE';
  if (lower.includes('ib') || lower.includes('international baccalaureate')) return 'IB';
  if (lower.includes('cambridge') || lower.includes('igcse')) return 'Cambridge';
  if (lower.includes('state') || lower.includes('state board')) return 'State Board';
  return trimmed.length > 10 ? trimmed.split(' ')[0] : trimmed;
}

export function formatShortRatio(ratio: string): string {
  if (!ratio) return '1:20';
  const trimmed = ratio.trim();
  return trimmed.length > 8 ? trimmed.slice(0, 8) : trimmed;
}

export default function SchoolStatsSection({
  displayBoard,
  displayUdise,
  totalStudents,
  totalTeachers,
  classroomsCount,
  schoolCategory,
  classFrom,
  classTo,
  templateData,
  residentialSchool,
  schoolType,
  medium,
  genderType,
}: SchoolStatsSectionProps) {
  const rawResidential = templateData?.contentOverrides?.['hero_stat_val_nature'] || residentialSchool || templateData?.schoolFormat || 'Day School';
  const rawSchoolType = templateData?.contentOverrides?.['hero_stat_val_mgmt'] || templateData?.management || schoolType || 'Private';
  const rawMedium = templateData?.contentOverrides?.['hero_stat_val_med'] || templateData?.medium || medium || 'English';
  const rawGender = templateData?.contentOverrides?.['hero_stat_val_gender'] || templateData?.genderType || genderType || 'Co-Educational';

  const rawBoard = templateData?.contentOverrides?.['hero_stat_val_1'] || displayBoard || 'CBSE';
  const rawRatio = templateData?.contentOverrides?.['hero_stat_val_2'] || (totalStudents > 0 && totalTeachers > 0 ? `1:${Math.round(totalStudents / Math.max(totalTeachers, 1))}` : '1:20');
  const rawRooms = templateData?.contentOverrides?.['hero_stat_val_3'] || (classroomsCount > 0 ? `${classroomsCount} Rooms` : '35+ Rooms');
  const rawGrades = templateData?.contentOverrides?.['hero_stat_val_4'] || (classFrom && classTo ? `${classFrom} - ${classTo}` : 'Nursery - 12th');

  const displayBoardVal = formatShortBoard(rawBoard);
  const displayResidential = formatShortStatKeyword(rawResidential, 'nature');
  const displaySchoolType = formatShortStatKeyword(rawSchoolType, 'management');
  const displayMedium = formatShortStatKeyword(rawMedium, 'medium');
  const displayGender = formatShortStatKeyword(rawGender, 'gender');
  const displayRatio = formatShortRatio(rawRatio);
  const displayRooms = formatShortRooms(rawRooms, classroomsCount);
  const displayGrades = formatShortGradeRange(rawGrades, classFrom, classTo);

  return (
    <section id="school-key-metrics" className="relative z-20 w-full bg-[#F7F8F8] border-b border-[#E8E9E9] py-5 sm:py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header Eyebrow */}
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#006FCC] animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#006FCC] font-['Montserrat',sans-serif]">
              Key School Profile & Academic Indicators
            </span>
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:inline">
            Government UDISE+ Verified
          </span>
        </div>

        {/* Floating Elevated Statistical Cards (8 Comprehensive Cards in Responsive Grid) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
          
          {/* Card 1: Board */}
          <div className="group relative rounded-[14px] bg-white p-2.5 sm:p-3 border border-[#E8E9E9] shadow-xs hover:shadow-md hover:border-[#006FCC]/40 hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 sm:gap-2.5 min-w-0 overflow-hidden">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/70 border border-amber-200/80 text-amber-700 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
              <EditableIcon iconKey="stat_icon_1" defaultIcon="Award" className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10.5px] xs:text-[11px] sm:text-xs font-bold font-['Montserrat',sans-serif] text-[#003C6E] leading-tight truncate">
                <EditableText
                  contentKey="hero_stat_val_1"
                  value={displayBoardVal}
                  formatDisplay={formatShortBoard}
                  maxLength={14}
                  showVerificationBadge={false}
                  className="text-[10.5px] xs:text-[11px] sm:text-xs font-bold font-['Montserrat',sans-serif] text-[#003C6E] leading-tight truncate block"
                />
              </div>
              <EditableText
                contentKey="hero_stat_lbl_1"
                value="Affiliated Board"
                maxLength={20}
                className="text-[9px] sm:text-[10px] font-semibold text-slate-500 block truncate leading-tight mt-0.5"
                showVerificationBadge={false}
              />
            </div>
          </div>

          {/* Card 2: School Nature (Residential / Day School) */}
          <div className="group relative rounded-[14px] bg-white p-2.5 sm:p-3 border border-[#E8E9E9] shadow-xs hover:shadow-md hover:border-[#006FCC]/40 hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 sm:gap-2.5 min-w-0 overflow-hidden">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100/70 border border-orange-200/80 text-orange-700 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
              <EditableIcon iconKey="stat_icon_nature" defaultIcon="Home" className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10.5px] xs:text-[11px] sm:text-xs font-bold font-['Montserrat',sans-serif] text-[#003C6E] leading-tight truncate">
                <EditableText
                  contentKey="hero_stat_val_nature"
                  value={displayResidential}
                  formatDisplay={(val) => formatShortStatKeyword(val, 'nature')}
                  maxLength={16}
                  showVerificationBadge={false}
                  className="text-[10.5px] xs:text-[11px] sm:text-xs font-bold font-['Montserrat',sans-serif] text-[#003C6E] leading-tight truncate block"
                />
              </div>
              <EditableText
                contentKey="hero_stat_lbl_nature"
                value="School Nature"
                maxLength={20}
                className="text-[9px] sm:text-[10px] font-semibold text-slate-500 block truncate leading-tight mt-0.5"
                showVerificationBadge={false}
              />
            </div>
          </div>

          {/* Card 3: School Type / Management */}
          <div className="group relative rounded-[14px] bg-white p-2.5 sm:p-3 border border-[#E8E9E9] shadow-xs hover:shadow-md hover:border-[#006FCC]/40 hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 sm:gap-2.5 min-w-0 overflow-hidden">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/70 border border-emerald-200/80 text-emerald-700 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
              <EditableIcon iconKey="stat_icon_mgmt" defaultIcon="Building2" className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10.5px] xs:text-[11px] sm:text-xs font-bold font-['Montserrat',sans-serif] text-[#003C6E] leading-tight truncate">
                <EditableText
                  contentKey="hero_stat_val_mgmt"
                  value={displaySchoolType}
                  formatDisplay={(val) => formatShortStatKeyword(val, 'management')}
                  maxLength={18}
                  showVerificationBadge={false}
                  className="text-[10.5px] xs:text-[11px] sm:text-xs font-bold font-['Montserrat',sans-serif] text-[#003C6E] leading-tight truncate block"
                />
              </div>
              <EditableText
                contentKey="hero_stat_lbl_mgmt"
                value="Management"
                maxLength={20}
                className="text-[9px] sm:text-[10px] font-semibold text-slate-500 block truncate leading-tight mt-0.5"
                showVerificationBadge={false}
              />
            </div>
          </div>

          {/* Card 4: Medium of Instruction */}
          <div className="group relative rounded-[14px] bg-white p-2.5 sm:p-3 border border-[#E8E9E9] shadow-xs hover:shadow-md hover:border-[#006FCC]/40 hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 sm:gap-2.5 min-w-0 overflow-hidden">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/70 border border-blue-200/80 text-blue-700 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
              <EditableIcon iconKey="stat_icon_med" defaultIcon="BookOpen" className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10.5px] xs:text-[11px] sm:text-xs font-bold font-['Montserrat',sans-serif] text-[#003C6E] leading-tight truncate">
                <EditableText
                  contentKey="hero_stat_val_med"
                  value={displayMedium}
                  formatDisplay={(val) => formatShortStatKeyword(val, 'medium')}
                  maxLength={16}
                  showVerificationBadge={false}
                  className="text-[10.5px] xs:text-[11px] sm:text-xs font-bold font-['Montserrat',sans-serif] text-[#003C6E] leading-tight truncate block"
                />
              </div>
              <EditableText
                contentKey="hero_stat_lbl_med"
                value="Medium"
                maxLength={20}
                className="text-[9px] sm:text-[10px] font-semibold text-slate-500 block truncate leading-tight mt-0.5"
                showVerificationBadge={false}
              />
            </div>
          </div>

          {/* Card 5: Student Gender Type */}
          <div className="group relative rounded-[14px] bg-white p-2.5 sm:p-3 border border-[#E8E9E9] shadow-xs hover:shadow-md hover:border-[#006FCC]/40 hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 sm:gap-2.5 min-w-0 overflow-hidden">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100/70 border border-purple-200/80 text-purple-700 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
              <EditableIcon iconKey="stat_icon_gender" defaultIcon="Users" className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10.5px] xs:text-[11px] sm:text-xs font-bold font-['Montserrat',sans-serif] text-[#003C6E] leading-tight truncate">
                <EditableText
                  contentKey="hero_stat_val_gender"
                  value={displayGender}
                  formatDisplay={(val) => formatShortStatKeyword(val, 'gender')}
                  maxLength={14}
                  showVerificationBadge={false}
                  className="text-[10.5px] xs:text-[11px] sm:text-xs font-bold font-['Montserrat',sans-serif] text-[#003C6E] leading-tight truncate block"
                />
              </div>
              <EditableText
                contentKey="hero_stat_lbl_gender"
                value="Student Gender"
                maxLength={20}
                className="text-[9px] sm:text-[10px] font-semibold text-slate-500 block truncate leading-tight mt-0.5"
                showVerificationBadge={false}
              />
            </div>
          </div>

          {/* Card 6: Student-Teacher Ratio */}
          <div className="group relative rounded-[14px] bg-white p-2.5 sm:p-3 border border-[#E8E9E9] shadow-xs hover:shadow-md hover:border-[#006FCC]/40 hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 sm:gap-2.5 min-w-0 overflow-hidden">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-sky-50 to-sky-100/70 border border-sky-200/80 text-[#005689] flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
              <EditableIcon iconKey="stat_icon_2" defaultIcon="UsersRound" className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10.5px] xs:text-[11px] sm:text-xs font-bold font-['Montserrat',sans-serif] text-[#003C6E] leading-tight truncate">
                <EditableText
                  contentKey="hero_stat_val_2"
                  value={displayRatio}
                  formatDisplay={formatShortRatio}
                  maxLength={10}
                  showVerificationBadge={false}
                  className="text-[10.5px] xs:text-[11px] sm:text-xs font-bold font-['Montserrat',sans-serif] text-[#003C6E] leading-tight truncate block"
                />
              </div>
              <EditableText
                contentKey="hero_stat_lbl_2"
                value="Student : Teacher"
                maxLength={20}
                className="text-[9px] sm:text-[10px] font-semibold text-slate-500 block truncate leading-tight mt-0.5"
                showVerificationBadge={false}
              />
            </div>
          </div>

          {/* Card 7: Classrooms & Labs */}
          <div className="group relative rounded-[14px] bg-white p-2.5 sm:p-3 border border-[#E8E9E9] shadow-xs hover:shadow-md hover:border-[#006FCC]/40 hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 sm:gap-2.5 min-w-0 overflow-hidden">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100/70 border border-indigo-200/80 text-indigo-700 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
              <EditableIcon iconKey="stat_icon_3" defaultIcon="FlaskConical" className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10.5px] xs:text-[11px] sm:text-xs font-bold font-['Montserrat',sans-serif] text-[#003C6E] leading-tight truncate">
                <EditableText
                  contentKey="hero_stat_val_3"
                  value={displayRooms}
                  formatDisplay={(val) => formatShortRooms(val, classroomsCount)}
                  maxLength={14}
                  showVerificationBadge={false}
                  className="text-[10.5px] xs:text-[11px] sm:text-xs font-bold font-['Montserrat',sans-serif] text-[#003C6E] leading-tight truncate block"
                />
              </div>
              <EditableText
                contentKey="hero_stat_lbl_3"
                value="Labs & Classes"
                maxLength={20}
                className="text-[9px] sm:text-[10px] font-semibold text-slate-500 block truncate leading-tight mt-0.5"
                showVerificationBadge={false}
              />
            </div>
          </div>

          {/* Card 8: School Level / Class Range */}
          <div className="group relative rounded-[14px] bg-white p-2.5 sm:p-3 border border-[#E8E9E9] shadow-xs hover:shadow-md hover:border-[#006FCC]/40 hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 sm:gap-2.5 min-w-0 overflow-hidden">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-teal-50 to-teal-100/70 border border-teal-200/80 text-teal-700 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
              <EditableIcon iconKey="stat_icon_4" defaultIcon="GraduationCap" className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10.5px] xs:text-[11px] sm:text-xs font-bold font-['Montserrat',sans-serif] text-[#003C6E] leading-tight truncate">
                <EditableText
                  contentKey="hero_stat_val_4"
                  value={displayGrades}
                  formatDisplay={(val) => formatShortGradeRange(val, classFrom, classTo)}
                  maxLength={16}
                  showVerificationBadge={false}
                  className="text-[10.5px] xs:text-[11px] sm:text-xs font-bold font-['Montserrat',sans-serif] text-[#003C6E] leading-tight truncate block"
                />
              </div>
              <EditableText
                contentKey="hero_stat_lbl_4"
                value="Grades / Level"
                maxLength={20}
                className="text-[9px] sm:text-[10px] font-semibold text-slate-500 block truncate leading-tight mt-0.5"
                showVerificationBadge={false}
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
