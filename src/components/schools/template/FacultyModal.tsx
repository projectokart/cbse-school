'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, GraduationCap, Check } from 'lucide-react';
import { compressImageUnder50KB } from './EditableImage';
import { FacultyMemberItem } from './SchoolTemplateContext';

interface FacultyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: FacultyMemberItem | null;
  onSave: (data: Omit<FacultyMemberItem, 'id'>) => void;
}

const DEFAULT_FACULTY_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2394a3b8'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";

export default function FacultyModal({
  isOpen,
  onClose,
  initialData,
  onSave
}: FacultyModalProps) {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [qualification, setQualification] = useState('');
  const [bio, setBio] = useState('');
  const [image, setImage] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressFeedback, setCompressFeedback] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setName(initialData?.name || '');
      setSubject(initialData?.subject || '');
      setQualification(initialData?.qualification || '');
      setBio(initialData?.bio || '');
      setImage(initialData?.image || DEFAULT_FACULTY_PLACEHOLDER);
      setCompressFeedback(null);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsCompressing(true);
    setCompressFeedback('⚡ Auto-compressing under 50KB...');
    try {
      const res = await compressImageUnder50KB(file);
      setImage(res.dataUrl);
      setCompressFeedback(`✓ Auto-compressed to ${res.sizeKb} KB (< 50 KB ceiling)`);
      setTimeout(() => setCompressFeedback(null), 4000);
    } catch (_) {
      setCompressFeedback('Compression failed.');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !subject.trim()) return;
    onSave({
      name: name.trim(),
      subject: subject.trim(),
      qualification: qualification.trim() || 'Certified Educator',
      bio: bio.trim() || 'Committed to experiential student mentorship.',
      image: image.trim() || DEFAULT_FACULTY_PLACEHOLDER
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
            <div className="w-10 h-10 rounded-2xl bg-[#EDF5FA] flex items-center justify-center text-[#006FCC] border border-[#D6EDFF]">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-slate-900">
                {initialData ? 'Edit Faculty Member' : 'Add Faculty Member'}
              </h3>
              <p className="text-xs text-slate-500">
                Teacher card with photo, subject title, qualifications, and short bio.
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
          {/* Profile Photo */}
          <div className="flex items-center gap-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-200 border border-slate-300 shrink-0">
              <img
                src={image || DEFAULT_FACULTY_PLACEHOLDER}
                alt="Teacher Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_FACULTY_PLACEHOLDER;
                }}
              />
            </div>
            <div className="flex-1 space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Profile Photo (Auto-compress &lt; 50KB or URL)
              </label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://... or /images/..."
                className="w-full p-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#006FCC]"
              />
              <div>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isCompressing}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-slate-100 text-[#006FCC] font-bold text-xs rounded-lg border border-slate-300 shadow-2xs transition-all cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Image (&lt; 50KB Auto)</span>
                </button>
                {compressFeedback && (
                  <p className="text-[11px] font-semibold text-emerald-600 mt-1">
                    {compressFeedback}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Teacher Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Teacher Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Prof. Rajeshwar Verma"
              className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#006FCC]"
            />
          </div>

          {/* Subject Heading */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Subject Heading <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Physics & Quantum Mechanics"
              className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#006FCC]"
            />
          </div>

          {/* Sub Heading (Qualification / Experience) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Sub Heading (Degrees & Experience)
            </label>
            <input
              type="text"
              value={qualification}
              onChange={(e) => setQualification(e.target.value)}
              placeholder="e.g. M.Sc. Physics, CSIR-NET • 18 Yrs Teaching Exp"
              className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#006FCC]"
            />
          </div>

          {/* Short Bio Paragraph */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Short Bio / Mentorship Focus
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="e.g. Mentored 100+ students into IITs; designer of experimental optics and mechanics practicals."
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
              {initialData ? 'Update Teacher' : 'Add Teacher'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
