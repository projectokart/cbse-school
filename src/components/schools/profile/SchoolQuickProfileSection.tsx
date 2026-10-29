'use client';

import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import EditableText from '@/components/schools/template/EditableText';
import VerifiedBadge from '@/components/schools/template/VerifiedBadge';

export interface SchoolQuickProfileSectionProps {
  isLiveTemplate: boolean;
  isEditMode: boolean;
  templateData: any;
  displayBoard: string;
  boardsList: string[];
  displayAffiliationNo: string;
  displayUdise: string;
  displayManagementLabel: string;
  displayMedium: string;
  mediumsList: string[];
  classFrom: string;
  classTo: string;
  displayClasses: string;
}

export default function SchoolQuickProfileSection({
  isLiveTemplate,
  isEditMode,
  templateData,
  displayBoard,
  boardsList,
  displayAffiliationNo,
  displayUdise,
  displayManagementLabel,
  displayMedium,
  mediumsList,
  classFrom,
  classTo,
  displayClasses,
}: SchoolQuickProfileSectionProps) {
  const [isCredOpen, setIsCredOpen] = useState(false);

  return (
    <section id="credentials" className="py-2.5 sm:py-3.5 bg-slate-50/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_4px_rgba(0,0,0,0.03)] overflow-hidden">
          
          {/* Collapsible Header (Click to Open/Close) */}
          <button
            type="button"
            onClick={() => setIsCredOpen(prev => !prev)}
            className="w-full flex items-center justify-between p-3 sm:px-4 text-left hover:bg-slate-50 transition cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#EDF5FA] text-[#005689] flex items-center justify-center shrink-0 border border-[#D0E5F5]/60">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
                  <path d="m9 12 2 2 4-4"></path>
                </svg>
              </div>
              <div>
                <span className="text-[8.5px] font-bold tracking-wider uppercase text-[#005689] block leading-none">Accreditation</span>
                <h3 className="text-xs sm:text-[13px] font-black text-[#002B49] leading-tight flex items-center gap-1.5">
                  <span>Quick Profile</span>
                  <span className="text-[10px] font-normal text-slate-500">
                    {isCredOpen ? '(Tap to collapse)' : '(Tap to expand)'}
                  </span>
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>UDISE Verified
              </span>
              
              {/* Visible Arrow / Chevron Icon */}
              <div className={`w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 transition-transform duration-200 ${isCredOpen ? 'rotate-180' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </div>
            </div>
          </button>

          {/* Collapsible List Content */}
          <div className={`${isCredOpen ? 'block' : 'hidden'} border-t border-slate-100 bg-[#F8FAFC] divide-y divide-slate-100`}>
            {/* Board */}
            <div className="flex items-center justify-between px-4 py-2.5 text-xs">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Board</span>
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                {isLiveTemplate && isEditMode ? (
                  <EditableText
                    value={templateData?.board || displayBoard}
                    fieldKey="board"
                    showVerificationBadge={false}
                    className="font-bold text-slate-900"
                  />
                ) : (
                  <span>{boardsList.length > 0 ? boardsList.join(' / ') : displayBoard}</span>
                )}
                <VerifiedBadge fieldKey="board" size="sm" />
              </span>
            </div>

            {/* Affiliation Number */}
            {displayAffiliationNo && (
              <div className="flex items-center justify-between px-4 py-2.5 text-xs">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Affiliation No.</span>
                <span className="font-mono font-bold text-slate-900 flex items-center gap-1.5">
                  <span>{displayAffiliationNo}</span>
                  <VerifiedBadge fieldKey="affiliationNumber" size="sm" />
                </span>
              </div>
            )}

            {/* UDISE Code */}
            <div className="flex items-center justify-between px-4 py-2.5 text-xs">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">UDISE Code</span>
              <span className="font-mono font-bold text-slate-900 inline-flex items-center gap-1.5">
                <span>{displayUdise}</span>
                {isLiveTemplate && isEditMode && (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-300 select-none" title="UDISE Code is verified and locked">
                    <Lock className="w-2.5 h-2.5 text-amber-700" /> Locked
                  </span>
                )}
                <VerifiedBadge fieldKey="udiseCode" size="sm" />
              </span>
            </div>

            {/* School Type */}
            <div className="flex items-center justify-between px-4 py-2.5 text-xs">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">School Type</span>
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                {isLiveTemplate && isEditMode ? (
                  <EditableText
                    value={templateData?.management || displayManagementLabel}
                    fieldKey="management"
                    showVerificationBadge={false}
                    className="font-bold text-slate-900"
                  />
                ) : (
                  <span>{displayManagementLabel}</span>
                )}
                <VerifiedBadge fieldKey="management" size="sm" />
              </span>
            </div>

            {/* Medium */}
            <div className="flex items-center justify-between px-4 py-2.5 text-xs">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Medium</span>
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                {isLiveTemplate && isEditMode ? (
                  <EditableText
                    value={templateData?.medium || displayMedium}
                    fieldKey="medium"
                    showVerificationBadge={false}
                    className="font-bold text-slate-900"
                  />
                ) : (
                  <span>{mediumsList.length > 0 ? mediumsList.join(' / ') : displayMedium}</span>
                )}
                <VerifiedBadge fieldKey="medium" size="sm" />
              </span>
            </div>

            {/* Classes */}
            <div className="flex items-center justify-between px-4 py-2.5 text-xs">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Classes</span>
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                {isLiveTemplate && isEditMode ? (
                  <span className="flex items-center gap-1 font-bold text-slate-900">
                    <EditableText
                      value={templateData?.classFrom || classFrom || 'Class 1'}
                      fieldKey="classFrom"
                      showVerificationBadge={false}
                      className="font-bold text-slate-900"
                    />
                    <span>to</span>
                    <EditableText
                      value={templateData?.classTo || classTo || 'Class 12th'}
                      fieldKey="classTo"
                      showVerificationBadge={false}
                      className="font-bold text-slate-900"
                    />
                  </span>
                ) : (
                  <span>{displayClasses}</span>
                )}
                <VerifiedBadge fieldKey="classFrom" size="sm" />
              </span>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
