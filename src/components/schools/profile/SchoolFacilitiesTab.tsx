'use client';

import React from 'react';
import { Check } from 'lucide-react';
import EditableText from '@/components/schools/template/EditableText';
import { FACILITY_CATEGORIES } from '@/components/schools/FacilityData';
import { renderFacilityIcon, renderCategoryHeaderIcon } from '@/components/schools/FacilityIcons';

export interface SchoolFacilitiesTabProps {
  isEditMode: boolean;
  effectiveFacilities: any[];
  templateCtx?: any;
}

export default function SchoolFacilitiesTab({
  isEditMode,
  effectiveFacilities,
  templateCtx,
}: SchoolFacilitiesTabProps) {
  const hasAnySelectedFacility = FACILITY_CATEGORIES.some(category => 
    category.items.some(item => effectiveFacilities.some(f => f.name === item.name))
  );

  return (
    <section id="facilities" className="pt-10 sm:pt-16 pb-6 sm:pb-8 bg-[#F8FAFC] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#005689] mb-2">
            <span className="w-6 h-1 bg-[#FBBC04] rounded-full inline-block" />
            <EditableText
              contentKey="facilities_eyebrow"
              value="OUR FACILITIES"
              className="inline-block"
            />
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">
            <EditableText
              contentKey="facilities_heading"
              value="Everything Students Need to Learn, Explore & Grow"
              className="inline"
            />
          </h2>

          {isEditMode && (
            <p className="mt-3 text-gray-600 font-medium max-w-2xl">
              Select the facilities available at your school. This helps parents understand your infrastructure at a glance.
            </p>
          )}
        </div>

        <div className="space-y-10">
          {FACILITY_CATEGORIES.map((category) => {
            const selectedItemsInCategory = category.items.filter(item => 
              effectiveFacilities.some(f => f.name === item.name)
            );
            
            if (!isEditMode && selectedItemsInCategory.length === 0) return null;

            return (
              <div key={category.category} className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                  {renderCategoryHeaderIcon(category.category, category.categoryIcon)}
                  <h3 className="text-xl font-bold text-[#002B49]">{category.category}</h3>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3 sm:gap-4">
                  {(isEditMode ? category.items : selectedItemsInCategory).map((item) => {
                    const isSelected = effectiveFacilities.some(f => f.name === item.name);

                    return (
                      <div
                        key={item.name}
                        onClick={() => {
                          if (!isEditMode || !templateCtx) return;
                          if (isSelected) {
                            const existing = effectiveFacilities.find(f => f.name === item.name);
                            if (existing && existing.id) {
                              templateCtx.deleteFacilityCard(existing.id);
                            }
                          } else {
                            templateCtx.addFacilityCard({
                              title: item.name,
                              desc: '',
                              icon: item.icon,
                              points: [],
                            });
                          }
                        }}
                        className={`
                          relative flex flex-col items-center justify-center text-center gap-2 p-2.5 rounded-xl border transition-all
                          ${isEditMode ? 'cursor-pointer hover:shadow-md' : ''}
                          ${isSelected 
                            ? 'border-[#005689] bg-[#EDF5FA] shadow-sm' 
                            : 'border-slate-100 bg-slate-50 hover:border-sky-200'
                          }
                        `}
                      >
                        <div className={`flex items-center justify-center shrink-0 [&>svg]:w-9 [&>svg]:h-9 sm:[&>svg]:w-10 sm:[&>svg]:h-10 mb-1 transition-transform group-hover:scale-110 ${isSelected ? 'text-[#005689] drop-shadow-sm' : 'text-slate-600'}`}>
                          {renderFacilityIcon(item)}
                        </div>

                        <span className={`text-xs sm:text-[13px] font-bold leading-tight ${isSelected ? 'text-[#005689]' : 'text-slate-600'}`}>
                          {item.name}
                        </span>

                        {isEditMode && (
                          <div className={`absolute top-1.5 right-1.5 w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'bg-[#005689] border-[#005689] text-white' : 'border-gray-300 bg-white'}`}>
                            {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {!isEditMode && !hasAnySelectedFacility && (
            <div className="py-12 px-6 text-center bg-white rounded-2xl border border-slate-200/80 max-w-xl mx-auto shadow-xs">
              <h4 className="text-base font-bold text-gray-900 mb-1">Campus Infrastructure Information</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Specific room-wise and sports facility specifications are updated directly upon verified institutional audit.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
