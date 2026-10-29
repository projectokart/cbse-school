'use client';

import React from 'react';
import { useOptionalSchoolTemplate } from './SchoolTemplateContext';
import { CheckCircle2 } from 'lucide-react';

interface VerifiedBadgeProps {
  fieldKey: string;
  className?: string;
  label?: string;
  size?: 'sm' | 'md';
}

export default function VerifiedBadge({
  fieldKey,
  className = '',
  label = 'Verified by School',
  size = 'sm',
}: VerifiedBadgeProps) {
  const ctx = useOptionalSchoolTemplate();
  const isEditMode = ctx?.isEditMode ?? false;

  // In Preview Mode or Public Profile, do NOT show field-level verification badges
  if (!isEditMode) {
    return null;
  }

  const isVerified = ctx?.isFieldVerified ? ctx.isFieldVerified(fieldKey) : false;
  const toggleFieldVerified = ctx?.toggleFieldVerified || (() => {});

  if (!isVerified) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          toggleFieldVerified(fieldKey);
        }}
        title="Is this data correct? Click checkmark to mark verified by school"
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap shrink-0 bg-rose-50 hover:bg-emerald-50 text-rose-700 hover:text-emerald-700 border border-rose-300 hover:border-emerald-400 transition-all cursor-pointer shadow-xs select-none leading-none align-middle ${className}`}
      >
        <span>Is this data correct?</span>
        <span className="w-3.5 h-3.5 rounded bg-rose-200 hover:bg-emerald-200 text-rose-800 hover:text-emerald-800 flex items-center justify-center text-[10px] font-black shrink-0">
          ✓
        </span>
      </button>
    );
  }

  return (
    <span
      onClick={(e) => {
        e.stopPropagation();
        toggleFieldVerified(fieldKey);
      }}
      title="Verified by School (Click to toggle)"
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 ${
        size === 'sm' ? 'text-[10px]' : 'text-xs'
      } font-bold tracking-tight bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-xs select-none align-middle leading-none cursor-pointer hover:bg-emerald-100 hover:border-emerald-400 ${className}`}
    >
      <CheckCircle2 className={`${size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} text-emerald-600 fill-emerald-100 shrink-0`} />
      <span className="leading-none">{label}</span>
    </span>
  );
}
