'use client';

import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  X
} from 'lucide-react';
import EditableText from '@/components/schools/template/EditableText';
import SchoolBoardResultsSection from '@/components/schools/template/SchoolBoardResultsSection';

export interface SchoolAcademicsTabProps {
  displayName: string;
  displayClassFrom: string;
  displayClassTo: string;
  board: string;
  isEditMode: boolean;
  templateData: any;
  initialProfileData?: any;
  templateCtx?: any;
}

export default function SchoolAcademicsTab({
  displayName,
  displayClassFrom,
  displayClassTo,
  board,
  isEditMode,
  templateData,
  initialProfileData,
  templateCtx,
}: SchoolAcademicsTabProps) {
  const [streamCategories, setStreamCategories] = useState(() => {
    const existing = initialProfileData?.streamCategories || templateData?.streamCategories;
    if (Array.isArray(existing) && existing.length > 0) {
      return existing;
    }
    return [
      { name: 'Science (Medical)', subjects: ['Physics', 'Chemistry', 'Biology', 'English Core'] },
      { name: 'Science (Non-Medical)', subjects: ['Physics', 'Chemistry', 'Mathematics', 'Computer Science'] },
      { name: 'Commerce', subjects: ['Accountancy', 'Business Studies', 'Economics', 'Mathematics'] },
      { name: 'Humanities / Arts', subjects: ['History', 'Geography', 'Political Science', 'Psychology'] }
    ];
  });

  React.useEffect(() => {
    const existing = initialProfileData?.streamCategories || templateData?.streamCategories;
    if (Array.isArray(existing) && existing.length > 0) {
      setStreamCategories(existing);
    }
  }, [initialProfileData?.streamCategories, templateData?.streamCategories]);

  const [newStreamTitle, setNewStreamTitle] = useState('');
  const [newSubjectInputs, setNewSubjectInputs] = useState<Record<number, string>>({});

  const handleAddNewStream = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newStreamTitle.trim()) {
      const newStreams = newStreamTitle.split(',').map(s => s.trim()).filter(s => s);
      const newCategories = newStreams.map(name => ({ name, subjects: [] }));
      setStreamCategories(prev => [...prev, ...newCategories]);
      setNewStreamTitle('');
    }
  };

  const handleAddSubjectToStream = (e: React.KeyboardEvent<HTMLInputElement>, streamIndex: number) => {
    if (e.key === 'Enter' && newSubjectInputs[streamIndex]?.trim()) {
      const newSubjects = newSubjectInputs[streamIndex].split(',').map(s => s.trim()).filter(s => s);
      setStreamCategories(prev => {
        const updated = [...prev];
        updated[streamIndex].subjects = [...updated[streamIndex].subjects, ...newSubjects];
        return updated;
      });
      setNewSubjectInputs(prev => ({ ...prev, [streamIndex]: '' }));
    }
  };

  const removeSubject = (streamIndex: number, subjectIndex: number) => {
    setStreamCategories(prev => {
      const updated = [...prev];
      updated[streamIndex].subjects = updated[streamIndex].subjects.filter((_, idx) => idx !== subjectIndex);
      return updated;
    });
  };

  const removeStream = (streamIndex: number) => {
    setStreamCategories(prev => prev.filter((_, idx) => idx !== streamIndex));
  };

  return (
    <section id="academics" className="py-12 sm:py-20 bg-[#F7F8F8] border-b border-[#E8E9E9] relative overflow-hidden">
      {/* Decorative ambient background */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#EDF5FA]/50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-[#006FCC] bg-[#EDF5FA] border border-[#D0E4F5] px-3.5 py-1.5 rounded-full mb-3 shadow-2xs font-['Montserrat',sans-serif]">
            <span className="w-2 h-2 bg-[#006FCC] rounded-full inline-block animate-pulse" />
            <EditableText
              contentKey="academics_eyebrow"
              value="ACADEMIC EXCELLENCE & CURRICULUM"
              className="inline-block"
            />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-['Montserrat',sans-serif] text-[#003C6E] tracking-tight leading-tight">
            <EditableText
              contentKey="academics_heading"
              value="Rigorous Academics,"
              className="inline text-[#003C6E]"
            />
            <span className="text-[#006FCC] block mt-0.5">NEP 2020 Aligned Pedagogy</span>
          </h2>

          <EditableText
            contentKey="academics_description"
            value={`At ${displayName}, education transcends rote memorization. We integrate experiential STEM learning, critical inquiry, and comprehensive continuous evaluation from foundational years to senior secondary board examinations.`}
            multiline={true}
            rows={3}
            className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed block font-normal"
          />
        </div>

        {/* Classes Offered Range Card */}
        <div className="mb-12 bg-white p-6 sm:p-7 rounded-[14px] border border-[#E8E9E9] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-[12px] bg-[#EDF5FA] text-[#006FCC] border border-[#D0E4F5] flex items-center justify-center shadow-xs shrink-0">
              <GraduationCap className="w-6 h-6 text-[#006FCC]" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold font-['Montserrat',sans-serif] text-[#003C6E]">
                Classes Offered &amp; Grade Span
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                Officially recognized grade range available at this school
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isEditMode ? (
              <>
                <input
                  type="text"
                  className="w-28 sm:w-36 px-4 py-2 text-sm font-bold border border-[#E8E9E9] rounded-[10px] text-center focus:outline-none focus:border-[#006FCC] bg-white transition-all shadow-xs"
                  defaultValue={displayClassFrom}
                />
                <span className="text-slate-400 font-bold uppercase text-xs tracking-wider">to</span>
                <input
                  type="text"
                  className="w-28 sm:w-36 px-4 py-2 text-sm font-bold border border-[#E8E9E9] rounded-[10px] text-center focus:outline-none focus:border-[#006FCC] bg-white transition-all shadow-xs"
                  defaultValue={displayClassTo}
                />
              </>
            ) : (
              <>
                <span className="bg-[#EDF5FA] text-[#006FCC] font-bold font-['Montserrat',sans-serif] px-5 py-2.5 rounded-[10px] border border-[#D0E4F5] shadow-xs text-sm sm:text-base">
                  {displayClassFrom.toLowerCase().startsWith('class') ? displayClassFrom : `Class ${displayClassFrom}`}
                </span>
                <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">to</span>
                <span className="bg-[#EDF5FA] text-[#006FCC] font-bold font-['Montserrat',sans-serif] px-5 py-2.5 rounded-[10px] border border-[#D0E4F5] shadow-xs text-sm sm:text-base">
                  {displayClassTo.toLowerCase().startsWith('class') ? displayClassTo : `Class ${displayClassTo}`}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Senior Secondary Academic Streams & Subjects */}
        <div className="mb-14">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-[12px] bg-[#EDF5FA] text-[#006FCC] border border-[#D0E4F5] flex items-center justify-center shadow-xs shrink-0">
                <BookOpen className="w-6 h-6 text-[#006FCC]" />
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold font-['Montserrat',sans-serif] text-[#003C6E]">
                  Academic Streams &amp; Course Electives
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                  Senior secondary subjects offered under specialized pedagogical streams
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {streamCategories.map((stream, sIdx) => (
              <div
                key={sIdx}
                className="bg-white p-6 rounded-[14px] border border-[#E8E9E9] shadow-xs relative group/stream hover:shadow-md hover:border-[#006FCC]/40 transition-all duration-300"
              >
                {isEditMode && (
                  <button 
                    onClick={() => removeStream(sIdx)}
                    className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover/stream:opacity-100"
                    title="Remove Stream"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2.5 h-2.5 bg-[#006FCC] rounded-full shadow-xs"></div>
                  <h4 className="text-base font-bold font-['Montserrat',sans-serif] text-[#003C6E] tracking-tight">{stream.name}</h4>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {stream.subjects.map((sub, i) => (
                    <div
                      key={i}
                      className="group/sub flex items-center gap-2 bg-[#F7F8F8] border border-[#E8E9E9] px-3.5 py-1.5 rounded-[10px] hover:border-[#006FCC]/40 hover:bg-white transition-colors cursor-default"
                    >
                      <span className="text-xs font-semibold text-[#003C6E]">{sub}</span>
                      {isEditMode && (
                        <button 
                          onClick={() => removeSubject(sIdx, i)}
                          className="text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}

                  {stream.subjects.length === 0 && (
                    <span className="text-xs text-slate-400 italic py-1">No subjects configured</span>
                  )}

                  {isEditMode && (
                    <input 
                      type="text" 
                      placeholder="+ Add subject..." 
                      className="px-3.5 py-1.5 text-xs font-bold border border-dashed border-[#006FCC]/40 rounded-[10px] focus:outline-none focus:border-[#006FCC] bg-white w-32 sm:w-36 text-slate-700 placeholder-slate-400"
                      value={newSubjectInputs[sIdx] || ''}
                      onChange={(e) => setNewSubjectInputs(prev => ({...prev, [sIdx]: e.target.value}))}
                      onKeyDown={(e) => handleAddSubjectToStream(e, sIdx)}
                    />
                  )}
                </div>
              </div>
            ))}
            
            {streamCategories.length === 0 && (
              <div className="col-span-1 md:col-span-2 text-center py-8 bg-white rounded-[14px] border border-dashed border-slate-300 text-sm font-semibold text-slate-500">
                No streams added. Use the input below to add a stream.
              </div>
            )}
            
            {isEditMode && (
              <div className="col-span-1 md:col-span-2 pt-2 flex justify-start">
                <input 
                  type="text" 
                  placeholder="+ Add new stream (Type & Enter)..." 
                  className="px-5 py-2.5 text-sm font-bold border border-dashed border-[#006FCC]/40 rounded-[10px] focus:outline-none focus:border-[#006FCC] focus:bg-blue-50/50 w-full sm:w-auto min-w-[280px] shadow-sm transition-all text-slate-800"
                  value={newStreamTitle}
                  onChange={(e) => setNewStreamTitle(e.target.value)}
                  onKeyDown={handleAddNewStream}
                />
              </div>
            )}
          </div>
        </div>

        {/* Official Board Examination Records Section */}
        <SchoolBoardResultsSection
          boardResults={
            templateData?.boardResults ||
            initialProfileData?.boardResults ||
            ((initialProfileData?.class10Results?.length > 0 || initialProfileData?.class12Results?.length > 0) ? {
              class10Results: initialProfileData?.class10Results || [],
              class12Results: initialProfileData?.class12Results || [],
            } : undefined)
          }
          classTo={displayClassTo}
          boardName={board}
          schoolName={displayName}
          isEditMode={isEditMode}
          onSaveResults={(newResults) => {
            if (templateData) {
              templateData.boardResults = newResults;
            }
            if (templateCtx?.updateBoardResults) {
              templateCtx.updateBoardResults(newResults);
            }
          }}
        />
      </div>
    </section>
  );
}
