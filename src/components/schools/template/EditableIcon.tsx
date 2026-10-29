'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useOptionalSchoolTemplate } from './SchoolTemplateContext';
import { ICON_MAP } from './AddCardModal';
import { SCHOOL_ICONS_COLLECTION } from './SchoolAssetLibrary';
import { X, Check, Edit2, Sparkles } from 'lucide-react';

interface EditableIconProps {
  iconKey: string;
  defaultIcon: string;
  className?: string;
  containerClassName?: string;
}

export default function EditableIcon({
  iconKey,
  defaultIcon,
  className = 'w-6 h-6 stroke-[2]',
  containerClassName = 'relative inline-flex items-center justify-center',
}: EditableIconProps) {
  const ctx = useOptionalSchoolTemplate();
  const isEditMode = ctx?.isEditMode ?? false;
  const getIcon = ctx?.getIcon || ((_k: string, fb: string) => fb);
  const updateIconOverride = ctx?.updateIconOverride || (() => {});
  const effectiveIconName = getIcon(iconKey, defaultIcon);
  const IconComponent = ICON_MAP[effectiveIconName] || ICON_MAP[defaultIcon] || Sparkles;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const categories = ['All', 'Labs & Tech', 'Academics & Arts', 'Sports & Fitness', 'Campus Safety & Security', 'Campus Infrastructure'];

  const filteredIcons = SCHOOL_ICONS_COLLECTION.filter((item) => {
    if (selectedCategory === 'All') return true;
    return item.category === selectedCategory;
  });

  const handleSelectIcon = (iconName: string) => {
    updateIconOverride(iconKey, iconName);
    setIsModalOpen(false);
  };

  return (
    <div className={`group/editicon relative ${containerClassName} ${
      isEditMode ? 'rounded-lg ring-1 ring-dashed ring-[#005689]/40 p-0.5 cursor-pointer hover:ring-[#005689]' : ''
    }`}>
      <IconComponent className={className} />

      {/* Mini Edit Badge */}
      {isEditMode && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsModalOpen(true);
          }}
          title="Click to change this icon"
          className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#005689] hover:bg-[#003c6e] text-white flex items-center justify-center text-[8px] opacity-0 group-hover/editicon:opacity-100 transition-opacity shadow-sm cursor-pointer z-20"
        >
          <Edit2 className="w-2 h-2" />
        </button>
      )}

      {/* Icon Selector Modal Portalled to document.body */}
      {isModalOpen && mounted && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[99999] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-md max-h-[85vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Pick An Icon</h3>
                <p className="text-[11px] text-slate-500">Choose from 30+ school infrastructure icons</p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="px-4 pt-3 flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none]">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#006FCC] text-white font-bold shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Icons Grid */}
            <div className="p-4 max-h-[340px] overflow-y-auto [scrollbar-width:thin] grid grid-cols-4 sm:grid-cols-5 gap-2.5">
              {filteredIcons.map((opt) => {
                const ItemIcon = ICON_MAP[opt.iconName] || Sparkles;
                const isCurrent = effectiveIconName === opt.iconName;
                return (
                  <button
                    key={opt.iconName}
                    type="button"
                    onClick={() => handleSelectIcon(opt.iconName)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border text-center transition cursor-pointer ${
                      isCurrent
                        ? 'bg-blue-50 border-[#006FCC] text-[#006FCC] ring-2 ring-[#006FCC]/20'
                        : 'bg-white border-slate-200 hover:border-[#006FCC] text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <ItemIcon className="w-6 h-6 mb-1 text-inherit" />
                    <span className="text-[9.5px] font-semibold leading-tight line-clamp-1 w-full text-inherit">
                      {opt.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
