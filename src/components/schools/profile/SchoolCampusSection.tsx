'use client';

import React, { useState } from 'react';
import {
  Camera,
  Trash2,
  Loader2,
  ChevronDown,
  Play,
  Plus
} from 'lucide-react';

export interface SchoolCampusSectionProps {
  displayName: string;
  isLiveTemplate?: boolean;
  isEditMode?: boolean;
  templateData?: any;
  templateCtx?: any;
  onAddMediaClick?: () => void;
  onTourClick?: () => void;
  onApplyClick?: () => void;
}

export default function SchoolCampusSection({
  displayName,
  isLiveTemplate = false,
  isEditMode = false,
  templateData,
  templateCtx,
  onAddMediaClick,
  onTourClick,
  onApplyClick,
}: SchoolCampusSectionProps) {
  const [galleryVisibleCount, setGalleryVisibleCount] = useState(6);
  const [isGalleryLoadingMore, setIsGalleryLoadingMore] = useState(false);

  return (
    <section id="school-campus" className="py-12 sm:py-20 bg-[#F7F8F8] border-b border-[#E8E9E9] relative overflow-hidden">
      {/* Decorative ambient background */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#EDF5FA]/50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-[#006FCC] bg-[#EDF5FA] border border-[#D0E4F5] px-3.5 py-1.5 rounded-full mb-3 shadow-2xs font-['Montserrat',sans-serif]">
            <span className="w-2 h-2 bg-[#006FCC] rounded-full inline-block animate-pulse" />
            <span>SCHOOL CAMPUS &amp; LIFE</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-['Montserrat',sans-serif] text-[#003C6E] tracking-tight leading-tight">
            Campus Gallery,
            <span className="text-[#006FCC] block mt-0.5">Architecture &amp; Learning Spaces</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed font-normal">
            Take a visual tour of our experiential laboratories, learning halls, sports arenas, and vibrant campus at {displayName}.
          </p>

          {isLiveTemplate && isEditMode && (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={onAddMediaClick}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-[14px] bg-[#006FCC] hover:bg-[#005399] text-white font-bold text-xs shadow-md shadow-[#006FCC]/20 transition-all cursor-pointer active:scale-95 font-['Montserrat',sans-serif]"
              >
                <Plus className="w-4 h-4" />
                <span>Add Verified Campus Media</span>
              </button>
            </div>
          )}
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {(() => {
            const items = (templateData?.galleryItems && templateData.galleryItems.length > 0)
              ? templateData.galleryItems
              : [
                  {
                    id: 'campus-1',
                    type: 'image',
                    url: '/images/schools/hero-school-1.png',
                    title: 'Main Academic Quadrangle',
                    category: 'Infrastructure',
                  },
                  {
                    id: 'campus-2',
                    type: 'image',
                    url: '/images/real-facilities/science-lab.jpg',
                    title: 'Composite Practical Sciences Lab',
                    category: 'STEM Labs',
                  },
                  {
                    id: 'campus-3',
                    type: 'image',
                    url: '/images/real-facilities/computer-lab.jpg',
                    title: 'Interactive Multimedia IT Center',
                    category: 'Digital Innovation',
                  },
                  {
                    id: 'campus-4',
                    type: 'image',
                    url: '/images/real-facilities/library.jpg',
                    title: 'Central Library & Reading Hall',
                    category: 'Academics',
                  },
                  {
                    id: 'campus-5',
                    type: 'image',
                    url: '/images/real-facilities/sports.jpg',
                    title: 'Athletic Sports Complex',
                    category: 'Sports',
                  },
                  {
                    id: 'campus-6',
                    type: 'image',
                    url: '/images/schools/hero-school-2.jpg',
                    title: 'Junior Wing Activity Enclosure',
                    category: 'Campus Life',
                  },
                ];

            return items.slice(0, galleryVisibleCount).map((item: any, idx: number) => (
              <div
                key={item.id || idx}
                className="group relative rounded-[14px] overflow-hidden bg-slate-900 shadow-xs border border-[#E8E9E9] hover:border-[#006FCC]/40 hover:shadow-md transition-all duration-500 aspect-[4/3]"
              >
                {item.type === 'video' ? (
                  <div className="w-full h-full relative">
                    <iframe
                      src={item.url.includes('watch?v=') ? `https://www.youtube.com/embed/${item.url.split('watch?v=')[1]?.split('&')[0]}` : item.url}
                      title={item.title}
                      className="w-full h-full object-cover border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                )}

                {/* Overlay info with Labster badge */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5 pointer-events-none">
                  <div className="mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-[6px] bg-[#006FCC] text-white inline-block shadow-xs font-['Montserrat',sans-serif]">
                      {item.category || 'Campus Life'}
                    </span>
                  </div>
                  <h3 className="text-white font-bold text-base leading-snug drop-shadow-sm font-['Montserrat',sans-serif]">
                    {item.title}
                  </h3>
                </div>

                {isEditMode && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      templateCtx?.deleteGalleryItem(item.id);
                    }}
                    className="absolute top-3 right-3 p-2 rounded-[10px] bg-black/60 text-white hover:bg-rose-600 transition-colors cursor-pointer z-20"
                    title="Delete Media"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ));
          })()}
        </div>

        {/* Load More Button */}
        {(() => {
          const totalItems = templateData?.galleryItems?.length || 6;
          if (galleryVisibleCount < totalItems) {
            return (
              <div className="mt-12 text-center">
                <button
                  type="button"
                  disabled={isGalleryLoadingMore}
                  onClick={() => {
                    setIsGalleryLoadingMore(true);
                    setTimeout(() => {
                      setGalleryVisibleCount((prev) => prev + 6);
                      setIsGalleryLoadingMore(false);
                    }, 500);
                  }}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-[14px] bg-white hover:bg-slate-50 text-[#003C6E] font-bold text-xs transition border border-[#E8E9E9] shadow-xs hover:shadow-md cursor-pointer font-['Montserrat',sans-serif]"
                >
                  {isGalleryLoadingMore ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#006FCC]" />
                      <span>Loading Campus Photos...</span>
                    </>
                  ) : (
                    <>
                      <span>Show More Campus Photos</span>
                      <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                    </>
                  )}
                </button>
              </div>
            );
          }
          return null;
        })()}

        {/* Bottom Campus Tour CTA */}
        <div className="mt-14 sm:mt-20 rounded-[18px] bg-[#001C33] text-white p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl border border-[#002F56] relative overflow-hidden">
          <div className="max-w-xl text-center md:text-left relative z-10">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-[#006FCC] bg-white/10 px-3 py-1 rounded-full mb-3 border border-white/10 font-['Montserrat',sans-serif]">
              <span>EXPERIENCE CAMPUS IN PERSON</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold font-['Montserrat',sans-serif]">Plan an In-Person Campus Walkthrough</h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-2.5 leading-relaxed font-normal">
              Experience the classrooms, meet educators, and explore our laboratories firsthand during school working hours.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-3.5 shrink-0 relative z-10">
            {onTourClick && (
              <button
                type="button"
                onClick={onTourClick}
                className="px-6 py-3 rounded-[14px] bg-white text-[#003C6E] font-bold text-xs hover:bg-slate-100 shadow-md transition-all cursor-pointer flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0 font-['Montserrat',sans-serif]"
              >
                <Play className="w-3.5 h-3.5 fill-current text-[#006FCC]" />
                <span>Virtual Video Tour</span>
              </button>
            )}
            {onApplyClick && (
              <button
                type="button"
                onClick={onApplyClick}
                className="px-6 py-3 rounded-[14px] bg-[#006FCC] hover:bg-[#005399] text-white font-bold text-xs shadow-md shadow-[#006FCC]/30 transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0 font-['Montserrat',sans-serif]"
              >
                Book Campus Visit
              </button>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
