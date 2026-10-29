'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useOptionalSchoolTemplate } from './SchoolTemplateContext';
import { Edit2, Check, X, CheckCircle2 } from 'lucide-react';

interface EditableTextProps {
  value?: string | number;
  fieldKey?: string;
  contentKey?: string;
  className?: string;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  maxLength?: number;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  showVerificationBadge?: boolean;
  formatDisplay?: (val: string) => string;
}

export default function EditableText({
  value = '',
  fieldKey,
  contentKey,
  className = '',
  placeholder = 'Click to enter text...',
  multiline = false,
  rows = 3,
  maxLength,
  tag = 'span',
  showVerificationBadge = false,
  formatDisplay,
}: EditableTextProps) {
  const ctx = useOptionalSchoolTemplate();
  const isEditMode = ctx?.isEditMode ?? false;
  const updateField = ctx?.updateField || (() => {});
  const updateContentOverride = ctx?.updateContentOverride || (() => {});
  const getContent = ctx?.getContent || ((_k: string, fb: string) => fb);
  const isFieldVerified = ctx?.isFieldVerified || (() => false);
  const toggleFieldVerified = ctx?.toggleFieldVerified || (() => {});

  const isVerified = fieldKey ? isFieldVerified(fieldKey) : false;
  const [isEditing, setIsEditing] = useState<boolean>(false);
  
  const effectiveValue = contentKey
    ? getContent(contentKey, String(value ?? ''))
    : String(value ?? '');

  const displayValue = formatDisplay ? formatDisplay(effectiveValue) : effectiveValue;

  const [tempValue, setTempValue] = useState<string>(effectiveValue);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  useEffect(() => {
    setTempValue(effectiveValue);
  }, [effectiveValue]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    const finalVal = maxLength ? tempValue.slice(0, maxLength) : tempValue;
    if (contentKey) {
      updateContentOverride(contentKey, finalVal);
    } else if (fieldKey) {
      updateField(fieldKey as any, finalVal);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(effectiveValue);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!multiline && e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  // Preview Mode: render pure content without editing decorations
  if (!isEditMode) {
    const TagComponent = tag as any;
    return (
      <TagComponent className={className}>
        <span>{displayValue || placeholder}</span>
      </TagComponent>
    );
  }

  // Active Inline Editing state
  if (isEditing) {
    return (
      <div className="relative inline-block w-full max-w-full my-1 z-30" onClick={(e) => e.stopPropagation()}>
        {multiline ? (
          <textarea
            ref={inputRef as any}
            rows={rows}
            maxLength={maxLength}
            value={tempValue}
            onChange={(e) => setTempValue(maxLength ? e.target.value.slice(0, maxLength) : e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full p-2.5 text-sm rounded-xl border-2 border-[#006FCC] bg-white text-slate-900 shadow-xl focus:outline-none focus:ring-2 focus:ring-[#006FCC]/30 transition-all"
          />
        ) : (
          <input
            ref={inputRef as any}
            type="text"
            maxLength={maxLength}
            value={tempValue}
            onChange={(e) => setTempValue(maxLength ? e.target.value.slice(0, maxLength) : e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full p-2 text-sm rounded-lg border-2 border-[#006FCC] bg-white text-slate-900 shadow-xl focus:outline-none focus:ring-2 focus:ring-[#006FCC]/30 transition-all"
          />
        )}
        <div className="flex items-center justify-between gap-1.5 mt-1.5">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                handleSave();
              }}
              className="px-2.5 py-1 bg-[#006FCC] hover:bg-[#005499] text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer shadow-xs active:scale-95"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save</span>
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                handleCancel();
              }}
              className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Cancel</span>
            </button>
          </div>
          {maxLength !== undefined && (
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${tempValue.length >= maxLength ? 'bg-amber-100 text-amber-700 font-bold' : 'text-slate-400'}`}>
              {tempValue.length}/{maxLength} max
            </span>
          )}
        </div>
      </div>
    );
  }

  // In Edit Mode, not currently editing: show editable highlight with hover indicator & verification badge
  const TagComponent = tag as any;
  return (
    <TagComponent
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        setIsEditing(true);
      }}
      title="Click to edit this text"
      className={`group/editable relative inline-block cursor-pointer transition-all rounded px-1.5 py-0.5 border border-dashed border-[#005689]/40 hover:border-[#005689] bg-[#005689]/[0.03] hover:bg-[#EDF5FA] ${className}`}
    >
      <span>{displayValue || <span className="italic text-slate-400">{placeholder}</span>}</span>
      <span className="opacity-0 group-hover/editable:opacity-100 transition-opacity ml-1.5 inline-flex items-center gap-0.5 text-[10px] font-bold bg-[#005689] text-white px-1.5 py-0.5 rounded shadow-xs align-middle">
        <Edit2 className="w-2.5 h-2.5" />
        <span>Edit</span>
      </span>

      {/* Field Verification Toggle */}
      {showVerificationBadge && (
        <span
          onClick={(e) => {
            e.stopPropagation();
            toggleFieldVerified(fieldKey);
          }}
          className="ml-1.5 inline-block align-middle"
        >
          {isVerified ? (
            <span
              title="Verified by School (Click to toggle)"
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 text-[10px] font-bold tracking-tight bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-400 shadow-xs cursor-pointer select-none transition-all leading-none"
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-600 fill-emerald-100 shrink-0" />
              <span className="leading-none">Verified by School</span>
            </span>
          ) : (
            <span
              title="Click to mark verified by school"
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 text-[10px] font-bold bg-rose-50 hover:bg-emerald-50 text-rose-700 hover:text-emerald-700 border border-rose-300 hover:border-emerald-400 transition-all cursor-pointer shadow-xs select-none leading-none"
            >
              <span>Is this data correct?</span>
              <span className="w-3.5 h-3.5 rounded bg-rose-200 hover:bg-emerald-200 text-rose-800 hover:text-emerald-800 flex items-center justify-center text-[10px] font-black shrink-0">
                ✓
              </span>
            </span>
          )}
        </span>
      )}
    </TagComponent>
  );
}
