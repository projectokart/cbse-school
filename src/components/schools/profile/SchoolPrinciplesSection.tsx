'use client';

import React from 'react';
import { Sparkles, Check } from 'lucide-react';
import EditableText from '@/components/schools/template/EditableText';
import EditableImage from '@/components/schools/template/EditableImage';
import EditableIcon from '@/components/schools/template/EditableIcon';

export interface SchoolPrinciplesSectionProps {
  isLiveTemplate: boolean;
  isEditMode: boolean;
  templateData: any;
  initialProfileData?: any;
}

export default function SchoolPrinciplesSection({
  isLiveTemplate,
  isEditMode,
  templateData,
  initialProfileData,
}: SchoolPrinciplesSectionProps) {
  return (
    <section id="principles" className="pt-6 sm:pt-10 pb-10 sm:pb-16 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-left max-w-2xl mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#005689] mb-2">
            <span className="w-6 h-1 bg-[#FBBC04] rounded-full inline-block" />
            <EditableText
              contentKey="principles_eyebrow"
              value="VISION • MISSION • VALUES"
              className="inline-block"
            />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            <EditableText
              contentKey="principles_heading"
              value="Our Guiding Principles"
              className="inline"
            />
          </h2>

          <EditableText
            contentKey="principles_subheading"
            value="Every initiative, laboratory experiment, and classroom interaction is driven by our core philosophy to nurture holistic global citizens."
            multiline={true}
            rows={2}
            className="text-sm sm:text-base text-gray-600 mt-2 leading-relaxed block"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Card 1: Vision (Telescope) */}
          <div className="bg-gradient-to-b from-blue-50/50 via-white to-white rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-white mb-6 p-2 flex items-center justify-center border border-blue-50 group-hover:scale-105 transition-transform duration-500">
                <EditableImage
                  imageKey="vision_image"
                  src={templateData?.imageOverrides?.vision_image || initialProfileData?.imageOverrides?.vision_image}
                  defaultSrc="/images/illustrations/vision-telescope.jpg"
                  alt="Vision Illustration"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#EDF5FA] text-[#006FCC] flex items-center justify-center">
                  <EditableIcon iconKey="vision_icon" defaultIcon="Eye" className="w-5 h-5" />
                </div>
                <EditableText
                  contentKey="vision_title"
                  value="Vision"
                  className="text-2xl font-bold text-gray-950 inline-block"
                />
              </div>

              {isLiveTemplate && isEditMode ? (
                <EditableText
                  value={templateData?.visionText || 'Empowering every learner to imagine, explore, and create a better future through deep curiosity, scientific inquiry, and purposeful leadership.'}
                  fieldKey="visionText"
                  multiline={true}
                  rows={3}
                  showVerificationBadge={false}
                  className="text-gray-600 text-sm leading-relaxed block"
                />
              ) : (
                <p className="text-gray-600 text-sm leading-relaxed">
                  {templateData?.visionText || 'Empowering every learner to imagine, explore, and create a better future through deep curiosity, scientific inquiry, and purposeful leadership.'}
                </p>
              )}
            </div>

            <div className="pt-6 border-t border-blue-50 mt-6 flex items-center gap-2 text-xs font-bold text-[#006FCC]">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <EditableText
                contentKey="vision_tagline"
                value="Future-Ready Thinking"
                className="inline-block"
              />
            </div>
          </div>

          {/* Card 2: Mission (Target) */}
          <div className="bg-gradient-to-b from-sky-50/50 via-white to-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-white mb-6 p-2 flex items-center justify-center border border-sky-50 group-hover:scale-105 transition-transform duration-500">
                <EditableImage
                  imageKey="mission_image"
                  src={templateData?.imageOverrides?.mission_image || initialProfileData?.imageOverrides?.mission_image}
                  defaultSrc="/images/illustrations/mission-target.png"
                  alt="Mission Illustration"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                  <EditableIcon iconKey="mission_icon" defaultIcon="Target" className="w-5 h-5" />
                </div>
                <EditableText
                  contentKey="mission_title"
                  value="Mission"
                  className="text-2xl font-bold text-gray-950 inline-block"
                />
              </div>

              {isLiveTemplate && isEditMode ? (
                <EditableText
                  value={templateData?.missionText || 'To provide meaningful, experiential learning environments that cultivate real-world problem solving, character building, and creative confidence.'}
                  fieldKey="missionText"
                  multiline={true}
                  rows={3}
                  showVerificationBadge={false}
                  className="text-gray-600 text-sm leading-relaxed block"
                />
              ) : (
                <p className="text-gray-600 text-sm leading-relaxed">
                  {templateData?.missionText || 'To provide meaningful, experiential learning environments that cultivate real-world problem solving, character building, and creative confidence.'}
                </p>
              )}
            </div>

            <div className="pt-6 border-t border-sky-50 mt-6 flex items-center gap-2 text-xs font-bold text-[#006FCC]">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <EditableText
                contentKey="mission_tagline"
                value="Action-Oriented Learning"
                className="inline-block"
              />
            </div>
          </div>

          {/* Card 3: Values (Care & Growth) */}
          <div className="bg-gradient-to-b from-amber-50/40 via-white to-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-white mb-6 p-2 flex items-center justify-center border border-amber-50 group-hover:scale-105 transition-transform duration-500">
                <EditableImage
                  imageKey="values_image"
                  src={templateData?.imageOverrides?.values_image || initialProfileData?.imageOverrides?.values_image}
                  defaultSrc="/images/illustrations/values-community.jpg"
                  alt="Values Illustration"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                  <EditableIcon iconKey="values_icon" defaultIcon="Heart" className="w-5 h-5" />
                </div>
                <EditableText
                  contentKey="values_title"
                  value="Values"
                  className="text-2xl font-bold text-gray-950 inline-block"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-gray-700 pt-1">
                {['Integrity', 'Curiosity', 'Respect', 'Excellence', 'Innovation', 'Compassion'].map((val, idx) => (
                  <div key={val} className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 rounded-full bg-[#EDF5FA] text-[#006FCC] flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <EditableText
                      contentKey={`value_item_${idx}`}
                      value={val}
                      className="inline-block"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-amber-50 mt-6 flex items-center gap-2 text-xs font-bold text-[#006FCC]">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <EditableText
                contentKey="values_tagline"
                value="Holistic Character"
                className="inline-block"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
