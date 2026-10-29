'use client';

import React from 'react';
import { Building2, ShieldCheck, Award } from 'lucide-react';
import EditableText from '@/components/schools/template/EditableText';
import EditableImage from '@/components/schools/template/EditableImage';
import EditableIcon from '@/components/schools/template/EditableIcon';
import VerifiedBadge from '@/components/schools/template/VerifiedBadge';

export interface SchoolManagementMessageSectionProps {
  displayName: string;
  displayManagementLabel: string;
  displayUdise: string;
  isLiveTemplate?: boolean;
  isEditMode?: boolean;
  templateData?: any;
  initialProfileData?: any;
}

export default function SchoolManagementMessageSection({
  displayName,
  displayManagementLabel,
  displayUdise,
  isLiveTemplate = false,
  isEditMode = false,
  templateData,
  initialProfileData,
}: SchoolManagementMessageSectionProps) {
  return (
    <section id="management-message" className="py-12 sm:py-20 bg-white border-b border-[#E8E9E9] relative overflow-hidden">
      {/* Decorative ambient background */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#EDF5FA]/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Eyebrow & Dual-tone Headline */}
        <div className="text-center sm:text-left mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-[#006FCC] bg-[#EDF5FA] border border-[#D0E4F5] px-3.5 py-1.5 rounded-full mb-3 shadow-2xs font-['Montserrat',sans-serif]">
            <span className="w-2 h-2 bg-[#006FCC] rounded-full inline-block animate-pulse" />
            <EditableText
              contentKey="mgmt_eyebrow"
              value="GOVERNING BODY & MANAGEMENT"
              className="inline-block"
            />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-['Montserrat',sans-serif] text-[#003C6E] tracking-tight leading-tight">
            <EditableText
              contentKey="mgmt_heading_prefix"
              value="Message from"
              className="inline text-[#003C6E]"
            />
            <span className="text-[#006FCC] block mt-0.5">
              <EditableText
                contentKey="mgmt_heading"
                value="School Management & Governing Trust"
                className="inline text-[#006FCC]"
              />
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          
          {/* Left Management Society / Leadership Card */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="bg-white rounded-[14px] p-6 shadow-xs border border-[#E8E9E9] flex-1 flex flex-col justify-between hover:shadow-md hover:border-[#006FCC]/40 transition-all">
              <div>
                <div className="rounded-[12px] overflow-hidden aspect-[4/3] bg-gradient-to-br from-[#F8FAFC] to-[#EDF5FA] flex items-center justify-center p-6 border border-[#E8E9E9]">
                  <EditableImage
                    imageKey="management_logo"
                    src={templateData?.imageOverrides?.management_logo || initialProfileData?.imageOverrides?.management_logo}
                    defaultSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 150' fill='%23f1f5f9'%3E%3Crect width='200' height='150' fill='%23f8fafc'/%3E%3Cpath d='M100 25 L160 55 L160 95 L100 125 L40 95 L40 55 Z' fill='%23e0f2fe' stroke='%23006FCC' stroke-width='2'/%3E%3Ctext x='100' y='80' font-family='sans-serif' font-size='11' font-weight='700' fill='%23006FCC' text-anchor='middle'%3EManagement Trust%3C/text%3E%3C/svg%3E"
                    alt="Management Seal"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="pt-6 pb-2 px-2 text-center">
                  <div className="font-bold text-[#003C6E] text-lg flex items-center justify-center gap-1.5 flex-wrap font-['Montserrat',sans-serif]">
                    <EditableText
                      contentKey="management_authority_name"
                      value={displayManagementLabel}
                      className="inline font-['Montserrat',sans-serif]"
                    />
                    <VerifiedBadge fieldKey="management" size="sm" />
                  </div>
                  <div className="text-xs font-bold text-[#006FCC] mt-1 bg-[#EDF5FA] px-3 py-1 rounded-[10px] inline-block border border-[#D0E4F5] font-['Montserrat',sans-serif]">
                    <EditableText
                      contentKey="management_designation"
                      value="Governing Council / Managing Committee"
                      className="inline"
                    />
                  </div>
                  <div className="text-xs font-semibold text-slate-500 mt-2">
                    UDISE Registered: {displayUdise}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E8E9E9] mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-slate-700 bg-[#F7F8F8] py-2.5 px-4 rounded-[10px] border border-[#E8E9E9]">
                <ShieldCheck className="w-4 h-4 text-[#006FCC] shrink-0" />
                <span>Officially Recognized Society</span>
              </div>
            </div>
          </div>

          {/* Right Management Philosophy & Commitment */}
          <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
            
            {/* Quote Card */}
            <div className="bg-white rounded-[14px] p-6 sm:p-8 shadow-xs border border-[#E8E9E9] relative overflow-hidden">
              <span className="absolute top-2 right-4 text-8xl text-[#006FCC]/10 font-serif select-none pointer-events-none leading-none">
                “
              </span>
              <div className="relative z-10 pl-2">
                <div className="w-10 h-1 bg-[#006FCC] rounded-full mb-4" />
                <EditableText
                  contentKey="management_quote"
                  value="Our mission as guardians of this institution is to ensure world-class infrastructure, compassionate pedagogical mentorship, and accessible education for every family."
                  multiline={true}
                  rows={3}
                  className="text-base sm:text-lg font-medium text-slate-800 italic leading-relaxed block"
                />
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-white rounded-[14px] p-6 sm:p-8 shadow-xs border border-[#E8E9E9] space-y-4">
              <div className="space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                <EditableText
                  contentKey="management_body_1"
                  value="The management committee remains committed to continuous institutional growth, continuous faculty development, and adhering to the highest standards of safety, transparent governance, and experiential curriculum delivery."
                  multiline={true}
                  rows={3}
                  className="block"
                />

                <EditableText
                  contentKey="management_body_2"
                  value="Through consistent investment in STEM laboratories, athletic arenas, and modern library resources, we empower our students to meet future global challenges with confidence and ethical character."
                  multiline={true}
                  rows={3}
                  className="block"
                />
              </div>

              <div className="pt-4 border-t border-[#E8E9E9] flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-[12px] bg-[#EDF5FA] text-[#006FCC] border border-[#D0E4F5] flex items-center justify-center shadow-xs shrink-0">
                  <Building2 className="w-6 h-6 text-[#006FCC]" />
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-['Montserrat',sans-serif]">
                    Institutional Governance
                  </div>
                  <div className="text-sm font-bold text-[#003C6E] font-['Montserrat',sans-serif]">
                    <EditableText
                      contentKey="management_tagline"
                      value="Recognized & Audited Educational Trust"
                      className="inline"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
