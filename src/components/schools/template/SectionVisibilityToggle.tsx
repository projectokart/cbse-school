'use client';

import React from 'react';
import { useOptionalSchoolTemplate } from './SchoolTemplateContext';
import { Eye, EyeOff } from 'lucide-react';

interface SectionVisibilityToggleProps {
  sectionId: string;
  sectionTitle?: string;
  className?: string;
}

export default function SectionVisibilityToggle({
  sectionId,
  sectionTitle,
  className = '',
}: SectionVisibilityToggleProps) {
  const ctx = useOptionalSchoolTemplate();

  // Only visible in Edit Mode
  if (!ctx || !ctx.isEditMode) {
    return null;
  }

  const isVisible = ctx.data.sectionVisibility?.[sectionId] !== false;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    ctx.toggleSectionVisibility(sectionId);
  };

  return (
    <div
      className={`absolute top-2 right-2 sm:top-3 sm:right-4 z-30 flex flex-col items-end select-none pointer-events-auto ${className}`}
      title={isVisible ? `Hide ${sectionTitle || 'section'} from public visitors` : `Show ${sectionTitle || 'section'} to public visitors`}
    >
      <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border border-slate-200 shadow-md transition-all hover:shadow-lg">
        <span className="text-[11px] font-bold">
          {isVisible ? (
            <span className="text-emerald-700 flex items-center gap-1">
              <Eye className="w-3 h-3 text-emerald-600 stroke-[2.5]" />
              <span className="hidden xs:inline">Visible</span>
            </span>
          ) : (
            <span className="text-rose-600 flex items-center gap-1">
              <EyeOff className="w-3 h-3 text-rose-500 stroke-[2.5]" />
              <span className="hidden xs:inline">Hidden</span>
            </span>
          )}
        </span>

        {/* Toggle Switch */}
        <button
          type="button"
          onClick={handleToggle}
          className={`w-9 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors duration-200 ${
            isVisible ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-slate-300 hover:bg-slate-400'
          }`}
          aria-label={isVisible ? 'Hide from Public' : 'Show to Public'}
        >
          <div
            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
              isVisible ? 'translate-x-4' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Under the toggle: Very small text "Hide from Public" */}
      <span className="text-[9.5px] font-semibold text-slate-500 mt-0.5 pr-1 tracking-tight">
        {isVisible ? 'Hide from Public' : 'Hidden from Public'}
      </span>
    </div>
  );
}
