'use client';

import React from 'react';
import EditableText from '@/components/schools/template/EditableText';
import EditableIcon from '@/components/schools/template/EditableIcon';
import VerifiedBadge from '@/components/schools/template/VerifiedBadge';

export interface SchoolAboutCardsSectionProps {
  displayName: string;
  isLiveTemplate: boolean;
  isEditMode: boolean;
  templateData: any;
  displayEstablished: string;
  displayStudents: string;
  displayTeachers: string;
  displayCampusArea: string;
}

export function formatCampusAreaSqMt(raw: string | number): string {
  if (!raw || raw === '—' || raw === 'N/A') return '2,000 sq mt';
  const str = String(raw).trim();

  // If already contains number + sq mt / sq.m / sqm inside or outside parentheses
  const sqMatch = str.match(/(\d[\d,]*)\s*(?:sq\.?\s*m(?:t|eters?)?|sqm)/i);
  if (sqMatch) {
    const num = parseInt(sqMatch[1].replace(/,/g, ''), 10);
    if (!isNaN(num) && num > 0) {
      return `${num.toLocaleString('en-IN')} sq mt`;
    }
  }

  // If contains Acres
  const acreMatch = str.match(/([\d.]+)\s*acres?/i);
  if (acreMatch) {
    const acres = parseFloat(acreMatch[1]);
    if (!isNaN(acres) && acres > 0) {
      const sqMt = Math.round(acres * 4046.86);
      return `${sqMt.toLocaleString('en-IN')} sq mt`;
    }
  }

  // If pure number: e.g. '2000'
  const pureNum = parseInt(str.replace(/[^\d]/g, ''), 10);
  if (!isNaN(pureNum) && pureNum > 0) {
    return `${pureNum.toLocaleString('en-IN')} sq mt`;
  }

  return '2,000 sq mt';
}

export default function SchoolAboutCardsSection({
  displayName,
  isLiveTemplate,
  isEditMode,
  templateData,
  displayEstablished,
  displayStudents,
  displayTeachers,
  displayCampusArea,
}: SchoolAboutCardsSectionProps) {
  const rawEstablished = templateData?.establishedYear || (displayEstablished && displayEstablished !== 'N/A' ? displayEstablished : '—');
  const rawStudents = templateData?.totalStudents ? String(templateData.totalStudents) : (displayStudents && displayStudents !== 'N/A' && displayStudents !== '0' ? displayStudents : '—');
  const rawTeachers = templateData?.totalTeachers ? String(templateData.totalTeachers) : (displayTeachers && displayTeachers !== 'N/A' && displayTeachers !== '0' ? displayTeachers : '—');
  const rawCampusArea = templateData?.campusArea || displayCampusArea || '—';
  const formattedCampusArea = formatCampusAreaSqMt(rawCampusArea);

  return (
    <section id="about-cards-section" className="relative z-10 w-full bg-[#F8FAFC] py-5 sm:py-6 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header Eyebrow */}
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#006FCC] animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#006FCC] font-['Montserrat',sans-serif]">
              Institutional Heritage & Infrastructure Metrics
            </span>
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:inline">
            Verified Campus Record
          </span>
        </div>

        {/* 4 Floating Elevated Cards (Labster 14px Card Design) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
          
          {/* Card 1: Established Year */}
          <div className="group relative rounded-[14px] bg-white p-2.5 sm:p-3 border border-[#E8E9E9] shadow-xs hover:shadow-md hover:border-[#006FCC]/40 hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 sm:gap-2.5 min-w-0 overflow-hidden">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-[10px] bg-amber-50 border border-amber-200/80 text-amber-700 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <EditableIcon iconKey="about_stat_icon_1" defaultIcon="Building2" className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10.5px] xs:text-[11px] sm:text-xs font-bold font-['Montserrat',sans-serif] text-[#003C6E] leading-tight truncate flex items-center gap-1">
                {isLiveTemplate && isEditMode ? (
                  <EditableText
                    value={rawEstablished}
                    fieldKey="establishedYear"
                    maxLength={12}
                    showVerificationBadge={false}
                    className="text-[10.5px] xs:text-[11px] sm:text-xs font-bold font-['Montserrat',sans-serif] text-[#003C6E] leading-tight truncate"
                  />
                ) : (
                  <span className="truncate">{rawEstablished}</span>
                )}
                <VerifiedBadge fieldKey="establishedYear" size="sm" />
              </div>
              <EditableText
                contentKey="about_stat_lbl_1"
                value="Established"
                maxLength={25}
                className="text-[9px] sm:text-[10px] text-slate-500 font-semibold block truncate leading-tight mt-0.5"
                showVerificationBadge={false}
              />
            </div>
          </div>

          {/* Card 2: Student Strength */}
          <div className="group relative rounded-[14px] bg-white p-2.5 sm:p-3 border border-[#E8E9E9] shadow-xs hover:shadow-md hover:border-[#006FCC]/40 hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 sm:gap-2.5 min-w-0 overflow-hidden">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-[10px] bg-[#EDF5FA] border border-[#DDF0FC] text-[#006FCC] flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <EditableIcon iconKey="about_stat_icon_2" defaultIcon="Users" className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10.5px] xs:text-[11px] sm:text-xs font-bold font-['Montserrat',sans-serif] text-[#003C6E] leading-tight truncate flex items-center gap-1">
                {isLiveTemplate && isEditMode ? (
                  <EditableText
                    value={rawStudents}
                    fieldKey="totalStudents"
                    maxLength={12}
                    showVerificationBadge={false}
                    className="text-[10.5px] xs:text-[11px] sm:text-xs font-bold font-['Montserrat',sans-serif] text-[#003C6E] leading-tight truncate"
                  />
                ) : (
                  <span className="truncate">{rawStudents}</span>
                )}
                <VerifiedBadge fieldKey="totalStudents" size="sm" />
              </div>
              <EditableText
                contentKey="about_stat_lbl_2"
                value="Total Students"
                maxLength={25}
                className="text-[9px] sm:text-[10px] text-slate-500 font-semibold block truncate leading-tight mt-0.5"
                showVerificationBadge={false}
              />
            </div>
          </div>

          {/* Card 3: Faculty Strength */}
          <div className="group relative rounded-[14px] bg-white p-2.5 sm:p-3 border border-[#E8E9E9] shadow-xs hover:shadow-md hover:border-[#006FCC]/40 hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 sm:gap-2.5 min-w-0 overflow-hidden">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-[10px] bg-indigo-50 border border-indigo-200/80 text-indigo-700 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <EditableIcon iconKey="about_stat_icon_3" defaultIcon="Award" className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10.5px] xs:text-[11px] sm:text-xs font-bold font-['Montserrat',sans-serif] text-[#003C6E] leading-tight truncate flex items-center gap-1">
                {isLiveTemplate && isEditMode ? (
                  <EditableText
                    value={rawTeachers}
                    fieldKey="totalTeachers"
                    maxLength={12}
                    showVerificationBadge={false}
                    className="text-[10.5px] xs:text-[11px] sm:text-xs font-bold font-['Montserrat',sans-serif] text-[#003C6E] leading-tight truncate"
                  />
                ) : (
                  <span className="truncate">{rawTeachers}</span>
                )}
                <VerifiedBadge fieldKey="totalTeachers" size="sm" />
              </div>
              <EditableText
                contentKey="about_stat_lbl_3"
                value="Expert Faculty"
                maxLength={25}
                className="text-[9px] sm:text-[10px] text-slate-500 font-semibold block truncate leading-tight mt-0.5"
                showVerificationBadge={false}
              />
            </div>
          </div>

          {/* Card 4: Campus Area */}
          <div className="group relative rounded-[14px] bg-white p-2.5 sm:p-3 border border-[#E8E9E9] shadow-xs hover:shadow-md hover:border-[#006FCC]/40 hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 sm:gap-2.5 min-w-0 overflow-hidden">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-[10px] bg-emerald-50 border border-emerald-200/80 text-emerald-700 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <EditableIcon iconKey="about_stat_icon_4" defaultIcon="Compass" className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10.5px] xs:text-[11px] sm:text-xs font-bold font-['Montserrat',sans-serif] text-[#003C6E] leading-tight truncate flex items-center gap-1">
                {isLiveTemplate && isEditMode ? (
                  <EditableText
                    value={formattedCampusArea}
                    formatDisplay={formatCampusAreaSqMt}
                    fieldKey="campusArea"
                    maxLength={18}
                    showVerificationBadge={false}
                    className="text-[10.5px] xs:text-[11px] sm:text-xs font-bold font-['Montserrat',sans-serif] text-[#003C6E] leading-tight truncate"
                  />
                ) : (
                  <span className="truncate">{formattedCampusArea}</span>
                )}
                <VerifiedBadge fieldKey="campusArea" size="sm" />
              </div>
              <EditableText
                contentKey="about_stat_lbl_4"
                value="Campus Area"
                maxLength={25}
                className="text-[9px] sm:text-[10px] text-slate-500 font-semibold block truncate leading-tight mt-0.5"
                showVerificationBadge={false}
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
