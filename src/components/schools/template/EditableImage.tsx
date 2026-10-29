'use client';

import React, { useState, useRef } from 'react';
import { useOptionalSchoolTemplate } from './SchoolTemplateContext';
import { Camera, Upload, Image as ImageIcon, Link as LinkIcon, X, Check, RotateCcw } from 'lucide-react';

interface EditableImageProps {
  imageKey: string;
  defaultSrc: string;
  src?: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  aspectRatio?: string;
}

const PRESET_GALLERY = [
  {
    label: 'Campus Architecture',
    url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400' fill='%23002B49'%3E%3Crect width='600' height='400' fill='%230D4979'/%3E%3Cg fill='%23196296' opacity='0.75'%3E%3Crect x='80' y='140' width='160' height='200' rx='6'/%3E%3Crect x='260' y='100' width='260' height='240' rx='6'/%3E%3Cpolygon points='290,100 390,40 490,100' fill='%232279B5'/%3E%3C/g%3E%3Cg fill='%23EDF5FA'%3E%3Crect x='110' y='170' width='30' height='40' rx='3'/%3E%3Crect x='160' y='170' width='30' height='40' rx='3'/%3E%3Crect x='110' y='230' width='30' height='40' rx='3'/%3E%3Crect x='160' y='230' width='30' height='40' rx='3'/%3E%3Crect x='300' y='140' width='35' height='45' rx='3'/%3E%3Crect x='370' y='140' width='35' height='45' rx='3'/%3E%3Crect x='440' y='140' width='35' height='45' rx='3'/%3E%3Crect x='300' y='210' width='35' height='45' rx='3'/%3E%3Crect x='370' y='210' width='35' height='45' rx='3'/%3E%3Crect x='440' y='210' width='35' height='45' rx='3'/%3E%3Crect x='370' y='280' width='40' height='60' rx='3' fill='%23F6AD55'/%3E%3Ccircle cx='390' cy='80' r='14' fill='%23F6AD55'/%3E%3C/g%3E%3Ctext x='300' y='375' font-family='sans-serif' font-size='16' font-weight='bold' fill='%23FFFFFF' text-anchor='middle'%3ECampus Architecture%3C/text%3E%3C/svg%3E",
  },
  {
    label: 'Science & Inquiry Lab',
    url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400' fill='%23083344'%3E%3Crect width='600' height='400' fill='%23083344'/%3E%3Cg stroke='%2306b6d4' stroke-width='4' fill='none'%3E%3Cpath d='M250 100 L250 160 L190 280 A20 20 0 0 0 208 310 L292 310 A20 20 0 0 0 310 280 L250 160 Z' fill='%230e7490' fill-opacity='0.3'/%3E%3Cellipse cx='370' cy='180' rx='45' ry='15' transform='rotate(-30 370 180)'/%3E%3Cellipse cx='370' cy='180' rx='45' ry='15' transform='rotate(30 370 180)'/%3E%3Ccircle cx='370' cy='180' r='8' fill='%2338bdf8'/%3E%3C/g%3E%3Ccircle cx='240' cy='260' r='6' fill='%2367e8f9'/%3E%3Ccircle cx='260' cy='230' r='8' fill='%2367e8f9'/%3E%3Ccircle cx='245' cy='200' r='5' fill='%23a5f3fc'/%3E%3Ctext x='300' y='370' font-family='sans-serif' font-size='16' font-weight='bold' fill='%23e0f2fe' text-anchor='middle'%3EScience &amp; Inquiry Lab%3C/text%3E%3C/svg%3E",
  },
  {
    label: 'Computer & Robotics Lab',
    url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400' fill='%230f172a'%3E%3Crect width='600' height='400' fill='%230f172a'/%3E%3Crect x='160' y='90' width='280' height='180' rx='10' fill='%231e293b' stroke='%2338bdf8' stroke-width='4'/%3E%3Crect x='180' y='110' width='240' height='140' rx='4' fill='%230284c7' fill-opacity='0.25'/%3E%3Cpath d='M200 140 L230 160 L200 180' stroke='%2338bdf8' stroke-width='4' fill='none' stroke-linecap='round'/%3E%3Cline x1='245' y1='180' x2='280' y2='180' stroke='%2338bdf8' stroke-width='4' stroke-linecap='round'/%3E%3Crect x='280' y='270' width='40' height='35' fill='%23334155'/%3E%3Crect x='250' y='305' width='100' height='12' rx='4' fill='%23475569'/%3E%3Ctext x='300' y='365' font-family='sans-serif' font-size='16' font-weight='bold' fill='%23f1f5f9' text-anchor='middle'%3EComputer &amp; Robotics Lab%3C/text%3E%3C/svg%3E",
  },
  {
    label: 'Digital Library & E-Books',
    url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400' fill='%231e1b4b'%3E%3Crect width='600' height='400' fill='%231e1b4b'/%3E%3Cg stroke='%23818cf8' stroke-width='4' fill='none'%3E%3Cpath d='M180 240 C240 210, 290 230, 300 245 C310 230, 360 210, 420 240 L420 140 C360 110, 310 130, 300 145 C290 130, 240 110, 180 140 Z' fill='%234338ca' fill-opacity='0.4'/%3E%3Cline x1='300' y1='145' x2='300' y2='245' stroke='%23c7d2fe' stroke-width='3'/%3E%3C/g%3E%3Cpolygon points='300,70 310,95 335,95 315,110 322,135 300,120 278,135 285,110 265,95 290,95' fill='%23fbbf24'/%3E%3Ctext x='300' y='365' font-family='sans-serif' font-size='16' font-weight='bold' fill='%23e0e7ff' text-anchor='middle'%3EDigital Library &amp; E-Books%3C/text%3E%3C/svg%3E",
  },
  {
    label: 'Sports Complex & Arena',
    url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400' fill='%23064e3b'%3E%3Crect width='600' height='400' fill='%23064e3b'/%3E%3Cellipse cx='300' cy='200' rx='210' ry='110' fill='%23047857' stroke='%236ee7b7' stroke-width='4'/%3E%3Cline x1='300' y1='90' x2='300' y2='310' stroke='%23a7f3d0' stroke-width='3' stroke-dasharray='8 8'/%3E%3Ccircle cx='300' cy='200' r='40' stroke='%23a7f3d0' stroke-width='3' fill='none'/%3E%3Ctext x='300' y='365' font-family='sans-serif' font-size='16' font-weight='bold' fill='%23ecfdf5' text-anchor='middle'%3ESports Complex &amp; Arena%3C/text%3E%3C/svg%3E",
  },
  {
    label: 'Smart Interactive Classroom',
    url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400' fill='%23172554'%3E%3Crect width='600' height='400' fill='%23172554'/%3E%3Crect x='140' y='80' width='320' height='180' rx='8' fill='%231e3a8a' stroke='%2360a5fa' stroke-width='4'/%3E%3Ccircle cx='300' cy='150' r='35' stroke='%2393c5fd' stroke-width='3' fill='none'/%3E%3Cpolygon points='290,135 320,150 290,165' fill='%2360a5fa'/%3E%3Cline x1='180' y1='220' x2='420' y2='220' stroke='%233b82f6' stroke-width='3'/%3E%3Ctext x='300' y='365' font-family='sans-serif' font-size='16' font-weight='bold' fill='%23eff6ff' text-anchor='middle'%3ESmart Interactive Classroom%3C/text%3E%3C/svg%3E",
  },
  {
    label: 'GPS School Bus Fleet',
    url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400' fill='%23451a03'%3E%3Crect width='600' height='400' fill='%23451a03'/%3E%3Crect x='130' y='120' width='340' height='130' rx='16' fill='%23f59e0b' stroke='%23d97706' stroke-width='4'/%3E%3Crect x='160' y='145' width='55' height='45' rx='4' fill='%23fef3c7'/%3E%3Crect x='230' y='145' width='55' height='45' rx='4' fill='%23fef3c7'/%3E%3Crect x='300' y='145' width='55' height='45' rx='4' fill='%23fef3c7'/%3E%3Crect x='370' y='145' width='70' height='45' rx='4' fill='%23fef3c7'/%3E%3Ccircle cx='210' cy='250' r='30' fill='%231f2937' stroke='%239ca3af' stroke-width='5'/%3E%3Ccircle cx='390' cy='250' r='30' fill='%231f2937' stroke='%239ca3af' stroke-width='5'/%3E%3Ctext x='300' y='365' font-family='sans-serif' font-size='16' font-weight='bold' fill='%23fef3c7' text-anchor='middle'%3EGPS School Bus Fleet%3C/text%3E%3C/svg%3E",
  },
  {
    label: 'Official School Crest',
    url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400' fill='%23002B49'%3E%3Crect width='600' height='400' fill='%23002B49'/%3E%3Cpath d='M300 70 C380 70, 420 110, 420 200 C420 270, 360 310, 300 330 C240 310, 180 270, 180 200 C180 110, 220 70, 300 70 Z' fill='%23005689' stroke='%23f59e0b' stroke-width='5'/%3E%3Cpath d='M250 200 C280 185, 300 190, 300 200 C300 190, 320 185, 350 200 L350 240 C320 225, 300 230, 300 240 C300 230, 280 225, 250 240 Z' fill='%23ffffff'/%3E%3Cpolygon points='300,120 310,140 330,140 315,152 320,172 300,160 280,172 285,152 270,140 290,140' fill='%23f59e0b'/%3E%3Ctext x='300' y='370' font-family='sans-serif' font-size='16' font-weight='bold' fill='%23ffffff' text-anchor='middle'%3EOfficial Institutional Crest%3C/text%3E%3C/svg%3E",
  },
];

export function compressImageUnder50KB(file: File): Promise<{ dataUrl: string; sizeKb: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        const maxDim = 1200;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          const raw = e.target?.result as string;
          return resolve({ dataUrl: raw, sizeKb: Math.round(raw.length * 0.75 / 1024) });
        }

        // Use high quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Target: <= 50KB (approx 48KB safe ceiling)
        const targetBytes = 49 * 1024;
        let quality = 0.85;
        let dataUrl = canvas.toDataURL('image/jpeg', quality);
        let currentBytes = dataUrl.length * 0.75;

        while (currentBytes > targetBytes && quality > 0.25) {
          quality -= 0.08;
          dataUrl = canvas.toDataURL('image/jpeg', quality);
          currentBytes = dataUrl.length * 0.75;
        }

        // If still over 50KB, scale down canvas resolution slightly
        if (currentBytes > targetBytes) {
          const scaleCanvas = document.createElement('canvas');
          scaleCanvas.width = Math.round(width * 0.8);
          scaleCanvas.height = Math.round(height * 0.8);
          const sCtx = scaleCanvas.getContext('2d');
          if (sCtx) {
            sCtx.imageSmoothingEnabled = true;
            sCtx.imageSmoothingQuality = 'high';
            sCtx.drawImage(canvas, 0, 0, scaleCanvas.width, scaleCanvas.height);
            dataUrl = scaleCanvas.toDataURL('image/jpeg', 0.65);
            currentBytes = dataUrl.length * 0.75;
          }
        }

        resolve({ dataUrl, sizeKb: Math.round(currentBytes / 1024) });
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function EditableImage({
  imageKey,
  defaultSrc,
  src,
  alt,
  className = 'w-full h-full object-cover',
  containerClassName = 'relative w-full h-full',
}: EditableImageProps) {
  const ctx = useOptionalSchoolTemplate();
  const isEditMode = ctx?.isEditMode ?? false;
  const contextOverride = ctx?.data?.imageOverrides?.[imageKey];
  const updateImageOverride = ctx?.updateImageOverride || (() => {});
  const effectiveSrc = contextOverride || src || (ctx?.getImage ? ctx.getImage(imageKey, defaultSrc) : defaultSrc);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'presets' | 'url'>('presets');
  const [previewSrc, setPreviewSrc] = useState(effectiveSrc);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [compressedSizeKb, setCompressedSizeKb] = useState<number | null>(null);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);

  const handleOpenModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewSrc(effectiveSrc);
    setUrlInput(effectiveSrc.startsWith('data:') ? '' : effectiveSrc);
    setCompressedSizeKb(null);
    setIsModalOpen(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressing(true);
      const { dataUrl, sizeKb } = await compressImageUnder50KB(file);
      setPreviewSrc(dataUrl);
      setCompressedSizeKb(sizeKb);
    } catch (err) {
      console.error('Image compression failed:', err);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSave = () => {
    updateImageOverride(imageKey, previewSrc);
    if (imageKey === 'school_logo' && ctx?.updateField) {
      ctx.updateField('logoImage', previewSrc);
    }
    setIsModalOpen(false);
  };

  const handleReset = () => {
    setPreviewSrc(defaultSrc);
    updateImageOverride(imageKey, defaultSrc);
    if (imageKey === 'school_logo' && ctx?.updateField) {
      ctx.updateField('logoImage', defaultSrc);
    }
    setIsModalOpen(false);
  };

  return (
    <div className={`group/editimg relative overflow-hidden ${containerClassName} ${
      isEditMode ? 'ring-2 ring-offset-2 ring-dashed ring-[#005689] rounded-2xl cursor-pointer' : ''
    }`}>
      <img
        src={effectiveSrc}
        alt={alt}
        className={className}
        onError={(e) => {
          // Fallback if broken URL
          (e.currentTarget as HTMLImageElement).src = defaultSrc;
        }}
      />

      {/* Edit Overlay Button */}
      {isEditMode && (
        <div
          onClick={handleOpenModal}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] opacity-0 group-hover/editimg:opacity-100 transition-opacity flex items-center justify-center cursor-pointer z-20"
        >
          <button
            type="button"
            className="px-3.5 py-2 rounded-xl bg-white/95 hover:bg-white text-slate-900 font-bold text-xs flex items-center gap-2 shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/40"
          >
            <Camera className="w-4 h-4 text-[#005689]" />
            <span>Change Photo / File</span>
          </button>
        </div>
      )}

      {/* Image Change Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#EDF5FA] text-[#006FCC] flex items-center justify-center">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Change Image</h3>
                  <p className="text-[11px] text-slate-500">Upload your own photo or pick from school gallery</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-slate-100 px-5 pt-3 gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('presets')}
                className={`pb-2.5 text-xs font-bold px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'presets'
                    ? 'border-[#005689] text-[#005689]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Preset Gallery</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`pb-2.5 text-xs font-bold px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'upload'
                    ? 'border-[#005689] text-[#005689]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Photo / File</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('url')}
                className={`pb-2.5 text-xs font-bold px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'url'
                    ? 'border-[#005689] text-[#005689]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Media / Video / PDF URL</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 max-h-[360px] overflow-y-auto [scrollbar-width:thin]">
              {/* Tab 1: Presets */}
              {activeTab === 'presets' && (
                <div className="grid grid-cols-2 gap-3">
                  {PRESET_GALLERY.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => setPreviewSrc(item.url)}
                      className={`relative rounded-xl overflow-hidden aspect-[4/3] border-2 cursor-pointer transition-all ${
                        previewSrc === item.url
                          ? 'border-[#006FCC] ring-2 ring-[#006FCC]/30 scale-[1.02]'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <img src={item.url} alt={item.label} className="w-full h-full object-cover" />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 text-white text-[10px] font-bold">
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 2: Upload */}
              {activeTab === 'upload' && (
                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50/50">
                  <div className="w-12 h-12 rounded-2xl bg-[#EDF5FA] text-[#006FCC] flex items-center justify-center mb-3">
                    <Upload className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">Click to browse your photos</h4>
                  <p className="text-xs text-slate-500 mb-4 text-center">PNG, JPG, WebP up to 5MB</p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl bg-[#006FCC] hover:bg-[#005499] text-white font-bold text-xs shadow-md transition cursor-pointer"
                  >
                    Select Photo From Device
                  </button>
                </div>
              )}

              {/* Tab 3: URL (Image, Video, or PDF) */}
              {activeTab === 'url' && (
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-700 block">Direct Media / PDF Link</label>
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => {
                      setUrlInput(e.target.value);
                      if (e.target.value.trim().startsWith('http')) {
                        setPreviewSrc(e.target.value.trim());
                      }
                    }}
                    placeholder="https://example.com/brochure.pdf or image.jpg or video.mp4"
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#005689]/30 bg-slate-50 font-mono"
                  />
                  <p className="text-[11px] text-slate-500">
                    Paste any public image, video URL (YouTube/MP4), or PDF document link (e.g. fee schedule, prospectus, or brochure).
                  </p>
                </div>
              )}

              {/* Live Preview Strip */}
              {previewSrc && (
                <div className="mt-4 p-3 bg-slate-100 rounded-2xl flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-slate-300">
                    <img src={previewSrc} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Selected Photo Preview</span>
                    {isCompressing ? (
                      <p className="text-[11px] text-[#006FCC] font-semibold animate-pulse">
                        ⚡ Auto-compressing under 50KB without quality loss...
                      </p>
                    ) : compressedSizeKb !== null ? (
                      <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                        ✓ Auto-compressed to {compressedSizeKb} KB (Max &lt; 50 KB, Crisp HD)
                      </p>
                    ) : (
                      <p className="text-xs font-semibold text-slate-800 truncate">Ready to apply to page</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Default</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-4 py-1.5 rounded-xl bg-[#006FCC] hover:bg-[#005499] text-white text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Apply Photo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
