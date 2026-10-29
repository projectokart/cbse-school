'use client';

import React, { useState, useEffect } from 'react';
import { X, Award, Link as LinkIcon } from 'lucide-react';
import { AwardItem } from './SchoolTemplateContext';

interface AwardModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: AwardItem | null;
  onSave: (data: Omit<AwardItem, 'id'>) => void;
}

export default function AwardModal({
  isOpen,
  onClose,
  initialData,
  onSave
}: AwardModalProps) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [image, setImage] = useState('');
  const [year, setYear] = useState('2025');

  useEffect(() => {
    if (isOpen) {
      setTitle(initialData?.title || '');
      setDesc(initialData?.desc || '');
      setImage(initialData?.image || 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80');
      setYear(initialData?.year || '2025');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !image.trim()) return;

    onSave({
      title: title.trim(),
      desc: desc.trim() || 'Official school achievement & recognition.',
      image: image.trim(),
      year: year.trim() || '2025'
    });
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
            <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-200">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-slate-900">
                {initialData ? 'Edit Award Card' : 'Add New Award Card'}
              </h3>
              <p className="text-xs text-slate-500">
                Fetch photo from external URL with award title and details.
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
          {/* External Image URL Preview */}
          <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-200 border border-slate-300">
              <img
                src={image}
                alt="Award Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80';
                }}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Award Image URL (HTTPS) <span className="text-rose-500">*</span>
              </label>
              <input
                type="url"
                required
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://images.unsplash.com/... or https://yourdomain.com/trophy.jpg"
                className="w-full p-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#006FCC]"
              />
            </div>
          </div>

          {/* Award Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Award Title / Honor Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. National Green School Excellence Award"
              className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#006FCC]"
            />
          </div>

          {/* Description / Summary */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Award Details & Organization
            </label>
            <textarea
              rows={3}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="e.g. Awarded by the Ministry of Education for exemplary eco-friendly practices and solar adoption."
              className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#006FCC]"
            />
          </div>

          {/* Year / Category */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Session / Year
            </label>
            <input
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="e.g. 2025 or 2024-25"
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
              {initialData ? 'Update Award' : 'Save Award'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
