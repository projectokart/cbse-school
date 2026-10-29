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

export interface SchoolGalleryTabProps {
  displayName: string;
  isLiveTemplate: boolean;
  isEditMode: boolean;
  templateData: any;
  templateCtx?: any;
  onAddMediaClick: () => void;
  onTourClick: () => void;
  onApplyClick: () => void;
}

export default function SchoolGalleryTab({
  displayName,
  isLiveTemplate,
  isEditMode,
  templateData,
  templateCtx,
  onAddMediaClick,
  onTourClick,
  onApplyClick,
}: SchoolGalleryTabProps) {
  const [galleryVisibleCount, setGalleryVisibleCount] = useState(6);
  const [isGalleryLoadingMore, setIsGalleryLoadingMore] = useState(false);

  return (
    <section id="gallery" className="py-12 sm:py-16 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#005689] bg-[#EDF5FA] border border-[#D6EDFF] px-3.5 py-1.5 rounded-full mb-3">
            <span className="w-2 h-2 bg-[#FBBC04] rounded-full inline-block" />
            <span>VISUAL CAMPUS TOUR</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight leading-tight">
            Campus Gallery, <br className="hidden sm:inline" />
            <span className="text-[#005689]">Modern Architecture & Learning Spaces</span>
          </h2>

          <p className="text-sm sm:text-base text-gray-600 mt-3 leading-relaxed">
            Explore the green lawns, state-of-the-art laboratory benches, smart interactive classrooms, and multi-sport complexes at {displayName}. Complete transparency for visiting parents.
          </p>

          {isLiveTemplate && isEditMode && (
            <div className="mt-5 flex justify-center">
              <button
                type="button"
                onClick={onAddMediaClick}
                className="inline-flex items-center gap-2 bg-[#006FCC] hover:bg-[#005499] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add External Media (Image / Video URL)</span>
              </button>
            </div>
          )}
        </div>

        {/* Gallery Media Grid */}
        {(!templateData?.galleryItems || templateData.galleryItems.length === 0) ? (
          <div className="py-16 px-6 text-center bg-slate-50 rounded-3xl border border-slate-200/80 mb-12 max-w-2xl mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mx-auto text-slate-400 mb-3 shadow-xs">
              <Camera className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-slate-800 text-base mb-1">Campus Media to be Uploaded</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Official campus photographs and walk-through videos can be uploaded through the institution dashboard.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {templateData.galleryItems
              .slice(0, galleryVisibleCount)
              .map((item: any, gIdx: number) => {
                const isVideo = item.type === 'video';
                const isYouTube = item.url?.includes('youtube.com') || item.url?.includes('youtu.be');
                let embedUrl = item.url;

                if (isYouTube) {
                  if (item.url.includes('watch?v=')) {
                    const vId = item.url.split('watch?v=')[1]?.split('&')[0];
                    embedUrl = `https://www.youtube.com/embed/${vId}`;
                  } else if (item.url.includes('youtu.be/')) {
                    const vId = item.url.split('youtu.be/')[1]?.split('?')[0];
                    embedUrl = `https://www.youtube.com/embed/${vId}`;
                  }
                }

                return (
                  <div
                    key={item.id || gIdx}
                    className="bg-white rounded-3xl p-3 sm:p-4 border-2 border-gray-100 shadow-md hover:border-blue-400 hover:shadow-xl transition-all flex flex-col justify-between relative group"
                  >
                    {isLiveTemplate && isEditMode && (
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Remove media "${item.title}"?`)) {
                            templateCtx?.deleteGalleryItem(item.id);
                          }
                        }}
                        title="Delete Media"
                        className="absolute top-5 right-5 z-20 p-1.5 rounded-lg bg-white/95 backdrop-blur-xs hover:bg-rose-100 text-rose-600 shadow-md border border-slate-200 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Media Display */}
                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 shadow-xs">
                      {isVideo ? (
                        isYouTube ? (
                          <iframe
                            src={embedUrl}
                            title={item.title}
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : (
                          <video
                            controls
                            src={item.url}
                            className="w-full h-full object-cover"
                          />
                        )
                      ) : (
                        <img
                          src={item.url}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80';
                          }}
                        />
                      )}

                      <span className="absolute bottom-2.5 left-2.5 text-[9.5px] font-black uppercase tracking-wider bg-black/60 backdrop-blur-xs text-white px-2 py-0.5 rounded-md pointer-events-none">
                        {isVideo ? '▶ Video' : '📷 Photo'} {item.category ? `• ${item.category}` : ''}
                      </span>
                    </div>

                    <div className="pt-3 pb-1 px-1">
                      <h3 className="text-sm sm:text-base font-bold text-gray-900 leading-snug">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                );
              })}
          </div>
        )}

        {/* Load More Pagination */}
        {(templateData?.galleryItems?.length || 0) > galleryVisibleCount && (
          <div className="mt-8 mb-12 text-center">
            <button
              type="button"
              disabled={isGalleryLoadingMore}
              onClick={() => {
                setIsGalleryLoadingMore(true);
                setTimeout(() => {
                  setGalleryVisibleCount((prev) => prev + 6);
                  setIsGalleryLoadingMore(false);
                }, 2000);
              }}
              className="inline-flex items-center gap-2 bg-[#006FCC] hover:bg-[#005499] text-white font-bold text-xs sm:text-sm px-7 py-3 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-80 cursor-pointer"
            >
              {isGalleryLoadingMore ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Fetching External Media (2s)...</span>
                </>
              ) : (
                <>
                  <span>Load More Media ({Math.min(galleryVisibleCount, templateData?.galleryItems?.length || 0)} of {templateData?.galleryItems?.length || 0})</span>
                  <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}

        {/* Virtual Campus Tour Prompt Card */}
        <div className="bg-gradient-to-r from-[#002B49] to-[#005689] rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="max-w-xl text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Interactive Experience
            </span>
            <h3 className="text-2xl sm:text-3xl font-black mt-1">
              Want to Experience {displayName} in Person?
            </h3>
            <p className="text-xs sm:text-sm text-blue-100/90 mt-2">
              Schedule a 45-minute guided campus walkthrough with our admissions team. Experience classrooms, labs, sports arenas, and interact with senior faculty.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onTourClick}
              className="bg-white hover:bg-blue-50 text-[#005689] font-bold px-6 py-3 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current text-[#005689]" />
              <span>Watch Video Tour</span>
            </button>

            <button
              type="button"
              onClick={onApplyClick}
              className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-6 py-3 rounded-xl text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
            >
              Book Campus Visit
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
