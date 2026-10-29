'use client';

import React from 'react';
import { Check } from 'lucide-react';
import EditableText from '@/components/schools/template/EditableText';
import { FACILITY_CATEGORIES } from '@/components/schools/FacilityData';
import { renderFacilityIcon, renderCategoryHeaderIcon } from '@/components/schools/FacilityIcons';

export interface SchoolFacilitiesSectionProps {
  isEditMode?: boolean;
  effectiveFacilities?: any[];
  templateCtx?: any;
}

export default function SchoolFacilitiesSection({
  isEditMode = false,
  effectiveFacilities = [],
  templateCtx,
}: SchoolFacilitiesSectionProps) {
  const hasAnySelectedFacility = FACILITY_CATEGORIES.some(category => 
    category.items.some(item => effectiveFacilities.some(f => f.name === item.name))
  );

  return (
    <section id="facilities" className="py-12 sm:py-20 bg-white border-b border-[#E8E9E9] relative overflow-hidden">
      {/* Decorative ambient background */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#EDF5FA]/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center sm:text-left mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-[#006FCC] bg-[#EDF5FA] border border-[#D0E4F5] px-3.5 py-1.5 rounded-full mb-3 shadow-2xs font-['Montserrat',sans-serif]">
            <span className="w-2 h-2 bg-[#006FCC] rounded-full inline-block animate-pulse" />
            <EditableText
              contentKey="facilities_eyebrow"
              value="OUR CAMPUS INFRASTRUCTURE"
              className="inline-block"
            />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-['Montserrat',sans-serif] text-[#003C6E] tracking-tight leading-tight">
            <EditableText
              contentKey="facilities_heading"
              value="Campus Facilities &"
              className="inline text-[#003C6E]"
            />
            <span className="text-[#006FCC] block mt-0.5">Learning Infrastructure</span>
          </h2>

          {isEditMode ? (
            <p className="mt-3 text-slate-600 font-normal max-w-2xl text-xs sm:text-sm">
              Click facilities to toggle them on or off. This updates your institutional profile in real time for prospective parents.
            </p>
          ) : (
            <p className="mt-3 text-slate-600 font-normal max-w-2xl text-sm sm:text-base leading-relaxed">
              Explore the verified digital, experiential, and athletic infrastructure facilities available on campus.
            </p>
          )}
        </div>

        <div className="space-y-8">
          {FACILITY_CATEGORIES.map((category) => {
            const selectedItemsInCategory = category.items.filter(item => 
              effectiveFacilities.some(f => f.name === item.name)
            );
            
            if (!isEditMode && selectedItemsInCategory.length === 0) return null;

            return (
              <div
                key={category.category}
                className="bg-white rounded-[14px] p-6 sm:p-7 border border-[#E8E9E9] shadow-xs space-y-6"
              >
                {/* Category Header */}
                <div className="flex items-center justify-between pb-4 border-b border-[#E8E9E9]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[10px] bg-[#EDF5FA] text-[#006FCC] border border-[#D0E4F5] flex items-center justify-center shadow-xs">
                      {renderCategoryHeaderIcon(category.category, category.categoryIcon)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold font-['Montserrat',sans-serif] text-[#003C6E] tracking-tight">
                        {category.category}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {selectedItemsInCategory.length} Facilities Available
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#006FCC] bg-[#EDF5FA] border border-[#D0E4F5] px-3 py-1 rounded-[10px] hidden sm:inline-block font-['Montserrat',sans-serif]">
                    Verified Category
                  </span>
                </div>

                {/* Facility Tiles Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                  {category.items.map((item) => {
                    const isSelected = effectiveFacilities.some(f => f.name === item.name);

                    if (!isEditMode && !isSelected) return null;

                    return (
                      <div
                        key={item.name}
                        onClick={() => {
                          if (!isEditMode) return;
                          if (isSelected) {
                            const existing = effectiveFacilities.find(f => f.name === item.name);
                            if (existing?.id) {
                              templateCtx?.deleteFacilityCard(existing.id);
                            }
                          } else {
                            templateCtx?.addFacilityCard({
                              title: item.name,
                              desc: '',
                              icon: item.icon,
                              badge: category.category,
                              points: []
                            });
                          }
                        }}
                        className={`relative rounded-[12px] p-4 flex flex-col items-center text-center transition-all duration-300 ${
                          isEditMode ? 'cursor-pointer select-none' : ''
                        } ${
                          isSelected
                            ? 'bg-[#F7F8F8] border border-[#E8E9E9] hover:border-[#006FCC]/40 hover:shadow-sm'
                            : 'bg-white/40 border border-dashed border-slate-300 opacity-60 hover:opacity-100 hover:border-slate-400'
                        }`}
                      >
                        {isEditMode && isSelected && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#006FCC] text-white flex items-center justify-center shadow-xs">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}

                        <div className={`w-11 h-11 rounded-[10px] flex items-center justify-center mb-2.5 transition-colors shadow-2xs border ${
                          isSelected 
                            ? 'bg-white text-[#006FCC] border-[#E8E9E9]' 
                            : 'bg-slate-100 text-slate-400 border-slate-200'
                        }`}>
                          {renderFacilityIcon(item)}
                        </div>

                        <div className="w-full">
                          <h4 className={`text-xs font-semibold leading-snug ${isSelected ? 'text-[#003C6E]' : 'text-slate-500'}`}>
                            {item.name}
                          </h4>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {!isEditMode && !hasAnySelectedFacility && (
            <div className="bg-white rounded-[14px] border border-[#E8E9E9] p-10 text-center max-w-xl mx-auto shadow-xs">
              <div className="w-12 h-12 rounded-[12px] bg-[#EDF5FA] text-[#006FCC] border border-[#D0E4F5] flex items-center justify-center mx-auto mb-4 shadow-xs">
                <Check className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold font-['Montserrat',sans-serif] text-[#003C6E]">Campus Facilities Verification</h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Official infrastructure facilities records are published directly by the institution.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
