'use client';

import React from 'react';
import EditableText from '@/components/schools/template/EditableText';
import EditableImage from '@/components/schools/template/EditableImage';
import EditableIcon from '@/components/schools/template/EditableIcon';
import VerifiedBadge from '@/components/schools/template/VerifiedBadge';

export interface SchoolPrincipalSectionProps {
  displayName: string;
  displayPrincipal: string;
  displayUdise: string;
  isLiveTemplate: boolean;
  isEditMode: boolean;
  templateData: any;
  initialProfileData?: any;
}

export default function SchoolPrincipalSection({
  displayName,
  displayPrincipal,
  displayUdise,
  isLiveTemplate,
  isEditMode,
  templateData,
  initialProfileData,
}: SchoolPrincipalSectionProps) {
  return (
    <section id="principal" className="pt-8 sm:pt-14 pb-4 sm:pb-8 bg-gradient-to-b from-white via-sky-50/50 to-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#005689] mb-2">
          <span className="w-6 h-1 bg-[#FBBC04] rounded-full inline-block" />
          <EditableText
            contentKey="principal_eyebrow"
            value="MESSAGE FROM THE PRINCIPAL"
            className="inline-block"
          />
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-8">
          <EditableText
            contentKey="principal_heading"
            value="A Message for a Brighter Tomorrow"
            className="inline"
          />
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Principal Photo Card */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl p-3 shadow-lg border border-gray-100 max-w-sm mx-auto">
              <div className="rounded-2xl overflow-hidden aspect-[4/5] bg-slate-100">
                <EditableImage
                  imageKey="principal_photo"
                  src={templateData?.imageOverrides?.principal_photo || initialProfileData?.imageOverrides?.principal_photo}
                  defaultSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 250' fill='%23f1f5f9'%3E%3Crect width='200' height='250' fill='%23f8fafc'/%3E%3Ccircle cx='100' cy='85' r='38' fill='%23cbd5e1'/%3E%3Cpath d='M35 210c0-42 29-65 65-65s65 23 65 65z' fill='%23cbd5e1'/%3E%3Ctext x='100' y='235' font-family='sans-serif' font-size='11' font-weight='600' fill='%2394a3b8' text-anchor='middle'%3EPrincipal Desk%3C/text%3E%3C/svg%3E"
                  alt={displayPrincipal}
                  className="w-full h-full object-cover object-top"
                />
              </div>

              <div className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EDF5FA] text-[#006FCC] flex items-center justify-center shrink-0">
                  <EditableIcon iconKey="principal_badge_icon" defaultIcon="Building" className="w-5 h-5" />
                </div>

                <div>
                  <h3 className="font-bold text-gray-950 text-base leading-snug flex items-center gap-1.5">
                    {isLiveTemplate && isEditMode ? (
                      <EditableText
                        value={templateData?.principalName || displayPrincipal}
                        fieldKey="principalName"
                        showVerificationBadge={false}
                        className="font-bold text-gray-950 text-base leading-snug"
                      />
                    ) : (
                      <span>{displayPrincipal}</span>
                    )}
                    <VerifiedBadge fieldKey="principalName" size="sm" />
                  </h3>

                  <EditableText
                    contentKey="principal_role_label"
                    value="Principal / Head of Institution"
                    className="text-xs text-gray-500 font-medium block"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Quote & Narrative */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-[#EDF5FA] border border-[#D6EDFF] rounded-3xl p-6 sm:p-8 relative">
              <div className="text-amber-400 text-5xl font-serif leading-none select-none">“</div>
              <EditableText
                contentKey="principal_quote"
                value={templateData?.contentOverrides?.['principal_quote'] || (displayPrincipal && displayPrincipal !== 'School Leadership' && displayPrincipal !== 'Principal Desk' ? `“Welcome to ${displayName}. Dedicated to fostering a culture of knowledge, discipline, and student success.”` : 'Official address from the Principal desk will be published upon institutional verification.')}
                multiline={true}
                rows={2}
                className="italic text-base sm:text-lg text-gray-800 font-medium mt-1 leading-relaxed block"
              />
              <EditableText
                contentKey="principal_quote_author"
                value="— From the Principal's Desk"
                className="text-xs text-gray-500 font-semibold mt-3 block"
              />
            </div>

            <EditableText
              contentKey="principal_narrative"
              value={templateData?.contentOverrides?.['principal_narrative'] || (displayPrincipal && displayPrincipal !== 'School Leadership' && displayPrincipal !== 'Principal Desk' ? `At ${displayName}, the administrative leadership strives to provide an encouraging academic environment for all students.` : `${displayName} is registered under Government UDISE Code ${displayUdise}. Official institutional messages and leadership updates can be published by claiming this profile.`)}
              multiline={true}
              rows={4}
              className="text-gray-600 text-sm sm:text-base leading-relaxed block"
            />

            <div className="pt-4 flex items-center gap-6">
              <div>
                <div className="font-serif italic text-2xl sm:text-3xl text-[#005689] font-bold tracking-wide">
                  {displayPrincipal && displayPrincipal !== 'School Leadership' && displayPrincipal !== 'Principal Desk' ? displayPrincipal.replace(/^(Dr\.|Mrs\.|Mr\.|Shri|Ms\.)\s*/i, '') : 'Principal Desk'}
                </div>
                <div className="text-xs text-gray-500 font-medium mt-1 flex items-center gap-1.5">
                  <span>{displayPrincipal && displayPrincipal !== 'School Leadership' && displayPrincipal !== 'Principal Desk' ? `${displayPrincipal}, Principal` : 'School Leadership'}</span>
                  <VerifiedBadge fieldKey="principalName" size="sm" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
