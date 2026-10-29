'use client';

import React, { useState } from 'react';
import { X, Image as ImageIcon, Video, Link as LinkIcon, Sparkles } from 'lucide-react';
import { GalleryMediaItem } from './SchoolTemplateContext';

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<GalleryMediaItem, 'id'>) => void;
}

export default function GalleryModal({
  isOpen,
  onClose,
  onSave
}: GalleryModalProps) {
  const [type, setType] = useState<'image' | 'video'>('image');
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Campus');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !title.trim()) return;

    onSave({
      type,
      url: url.trim(),
      title: title.trim(),
      category: category.trim() || 'Campus'
    });
    setUrl('');
    setTitle('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-2xl max-h-[90vh] flex flex-col text-slate-800 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#EDF5FA] flex items-center justify-center text-[#006FCC] border border-[#D6EDFF]">
              <LinkIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-slate-900">
                Add External Media (Link Only)
              </h3>
              <p className="text-xs text-slate-500">
                Purely external URL based. Enter an Image URL or Video / YouTube embed link.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {/* Media Type Toggle: Image vs Video */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Select Media Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType('image')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  type === 'image'
                    ? 'bg-[#006FCC] text-white border-[#006FCC] shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>External Image</span>
              </button>
              <button
                type="button"
                onClick={() => setType('video')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  type === 'video'
                    ? 'bg-[#006FCC] text-white border-[#006FCC] shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Video className="w-4 h-4" />
                <span>Video (YouTube / MP4)</span>
              </button>
            </div>
          </div>

          {/* External URL Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {type === 'image' ? 'Image Web URL (HTTPS)' : 'Video URL / YouTube Link'} <span className="text-rose-500">*</span>
            </label>
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={
                type === 'image'
                  ? 'https://images.unsplash.com/... or https://yourcdn.com/photo.jpg'
                  : 'https://www.youtube.com/watch?v=... or https://cdn.com/tour.mp4'
              }
              className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#006FCC]"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Zero storage upload required. Media loads dynamically from this external link.
            </p>
          </div>

          {/* Caption Heading */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Caption Heading <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior Chemistry Research Laboratory in Session"
              className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#006FCC]"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Category Tag (Optional)
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Campus, Labs, Sports, Events"
              className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#006FCC]"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#006FCC] hover:bg-[#005499] text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
            >
              Add to Gallery
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
