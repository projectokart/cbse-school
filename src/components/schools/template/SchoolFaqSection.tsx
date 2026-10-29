'use client';

import React, { useState } from 'react';
import {
  HelpCircle,
  ChevronDown,
  Plus,
  Trash2,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import EditableText from './EditableText';
import { useOptionalSchoolTemplate, SchoolFaqItem } from './SchoolTemplateContext';
import { cleanBoardName } from '@/integrations/supabase/schoolSearchClient';
export interface AuthenticFaqProps {
  id?: string;
  schoolName?: string;
  board?: string;
  udiseCode?: string;
  address?: string;
  state?: string;
  district?: string;
  village?: string;
  pincode?: string;
  classFrom?: string;
  classTo?: string;
  schoolCategory?: string;
  management?: string;
  medium?: string;
  genderType?: string;
  totalStudents?: number | string;
  totalTeachers?: number | string;
  workingSmartBoards?: number;
  computerIctLab?: string;
  atalStemLab?: string;
  playgroundAvailable?: string;
}

export function buildAuthenticFaqs(props: AuthenticFaqProps): SchoolFaqItem[] {
  const name = props.schoolName || 'This school';
  const faqs: SchoolFaqItem[] = [];

  // 1. Board Affiliation (Strictly from UDISE)
  const cleanedBoard = cleanBoardName(props.board);
  if (cleanedBoard && cleanedBoard !== '—' && cleanedBoard !== 'N/A' && cleanedBoard.toLowerCase() !== 'other') {
    faqs.push({
      id: 'faq-board',
      q: `Which educational board is ${name} affiliated with?`,
      a: `${name} is affiliated with ${cleanedBoard} under official government educational records.`,
      category: 'Academics',
    });
  }

  // 2. Official UDISE Code (Strictly from UDISE)
  const rawUdise = (props.udiseCode || '').replace(/\D/g, '');
  if (rawUdise && rawUdise.length >= 8) {
    faqs.push({
      id: 'faq-udise',
      q: `What is the official UDISE Code of ${name}?`,
      a: `The official UDISE+ code for ${name} is ${rawUdise}, registered under the Department of School Education, Ministry of Education, Government of India.`,
      category: 'Accreditation',
    });
  }

  // 3. Classes Offered (Strictly from UDISE)
  const hasClasses = props.classFrom && props.classTo && props.classFrom !== '—' && props.classTo !== '—';
  if (hasClasses) {
    faqs.push({
      id: 'faq-classes',
      q: `Which grade levels and classes are taught at ${name}?`,
      a: `${name} offers school education from ${props.classFrom} to ${props.classTo}.`,
      category: 'Academics',
    });
  } else if (props.schoolCategory && props.schoolCategory !== '—') {
    faqs.push({
      id: 'faq-classes',
      q: `What institutional grade category does ${name} belong to?`,
      a: `${name} is categorized as ${props.schoolCategory} under official records.`,
      category: 'Academics',
    });
  }

  // 4. Management & Authority (Strictly from UDISE)
  if (props.management && props.management.trim() && props.management !== '—') {
    faqs.push({
      id: 'faq-mgmt',
      q: `What type of management operates ${name}?`,
      a: `${name} operates under ${props.management} administration.`,
      category: 'Accreditation',
    });
  }

  // 5. Medium of Instruction (Strictly from UDISE)
  if (props.medium && props.medium.trim() && props.medium !== '—') {
    faqs.push({
      id: 'faq-medium',
      q: `What is the medium of instruction at ${name}?`,
      a: `The recognized medium of instruction at ${name} is ${props.medium}.`,
      category: 'Academics',
    });
  }

  // 6. School Gender Format (Strictly from UDISE)
  if (props.genderType && props.genderType.trim() && props.genderType !== '—') {
    faqs.push({
      id: 'faq-gender',
      q: `Is ${name} a co-educational or single-gender institution?`,
      a: `${name} is recognized as a ${props.genderType} school.`,
      category: 'General',
    });
  }

  // 7. Student-Teacher Ratio (Strictly only when both students and teachers > 0)
  const students = Number(props.totalStudents) || 0;
  const teachers = Number(props.totalTeachers) || 0;
  if (students > 0 && teachers > 0) {
    const ratio = Math.round(students / teachers);
    faqs.push({
      id: 'faq-ratio',
      q: `What is the student-teacher ratio at ${name}?`,
      a: `According to verified government records, the school reports ${students.toLocaleString()} enrolled students and ${teachers.toLocaleString()} faculty members, establishing a student-teacher ratio of 1:${ratio}.`,
      category: 'Faculty',
    });
  }

  // 8. Campus Location (Strictly from UDISE)
  const location = props.address || [props.village, props.district, props.state, props.pincode].filter(Boolean).join(', ');
  if (location && location.trim() && location !== '—' && location !== 'Campus Address') {
    faqs.push({
      id: 'faq-location',
      q: `Where is the campus of ${name} located?`,
      a: `${name} is located at ${location}.`,
      category: 'Location',
    });
  }

  // 9. Digital & STEM Labs (Strictly from UDISE)
  const smartBoards = Number(props.workingSmartBoards) || 0;
  const hasIct = (props.computerIctLab || '').toLowerCase().includes('yes') || (props.computerIctLab || '').toLowerCase().includes('avail');
  const hasStem = (props.atalStemLab || '').toLowerCase().includes('yes') || (props.atalStemLab || '').toLowerCase().includes('avail');
  const facilitiesList: string[] = [];
  if (hasStem) facilitiesList.push('Atal Tinkering STEM Lab');
  if (hasIct) facilitiesList.push('Computer ICT Lab');
  if (smartBoards > 0) facilitiesList.push(`${smartBoards} Smart Classrooms`);

  if (facilitiesList.length > 0) {
    faqs.push({
      id: 'faq-labs',
      q: `What digital learning and laboratory infrastructure is available at ${name}?`,
      a: `Official records confirm the availability of ${facilitiesList.join(', ')}.`,
      category: 'Facilities',
    });
  }

  // 10. Dedicated Playground (Strictly from UDISE)
  const hasPlayground = (props.playgroundAvailable || '').toLowerCase().includes('yes');
  if (hasPlayground) {
    faqs.push({
      id: 'faq-playground',
      q: `Does ${name} have a playground for sports and athletic activities?`,
      a: `Yes, official records confirm dedicated playground facilities for sports and physical education.`,
      category: 'Facilities',
    });
  }

  return faqs;
}

export interface SchoolFaqSectionProps extends AuthenticFaqProps {
  id?: string;
  className?: string;
  title?: string;
  subtitle?: string;
}

export default function SchoolFaqSection({
  id = 'faq',
  className = '',
  title = 'Frequently Asked Questions',
  subtitle = 'Authentic questions and verified information derived directly from official government records.',
  schoolName,
  board,
  udiseCode,
  address,
  state,
  district,
  village,
  pincode,
  classFrom,
  classTo,
  schoolCategory,
  management,
  medium,
  genderType,
  totalStudents,
  totalTeachers,
  workingSmartBoards,
  computerIctLab,
  atalStemLab,
  playgroundAvailable,
}: SchoolFaqSectionProps) {
  const ctx = useOptionalSchoolTemplate();
  const isEditMode = ctx?.isEditMode ?? false;

  // Build authentic FAQs strictly from current real UDISE data
  const defaultUdiseFaqs = React.useMemo(() => {
    return buildAuthenticFaqs({
      schoolName: schoolName || ctx?.data?.schoolName,
      board: board || ctx?.data?.board,
      udiseCode: udiseCode || ctx?.data?.udiseCode,
      address: address || ctx?.data?.address,
      state: state || ctx?.data?.state,
      district: district || ctx?.data?.district,
      village: village || ctx?.data?.village,
      pincode: pincode || ctx?.data?.pincode,
      classFrom: classFrom || ctx?.data?.classFrom,
      classTo: classTo || ctx?.data?.classTo,
      schoolCategory: schoolCategory || (ctx?.data as any)?.schoolCategory,
      management: management || ctx?.data?.management,
      medium: medium || ctx?.data?.medium,
      genderType: genderType || ctx?.data?.genderType,
      totalStudents: totalStudents ?? ctx?.data?.totalStudents,
      totalTeachers: totalTeachers ?? ctx?.data?.totalTeachers,
      workingSmartBoards: workingSmartBoards ?? (ctx?.data?.workingSmartBoards ? Number(ctx.data.workingSmartBoards) : undefined),
      computerIctLab: computerIctLab,
      atalStemLab: atalStemLab,
      playgroundAvailable: playgroundAvailable,
    });
  }, [
    schoolName,
    board,
    udiseCode,
    address,
    state,
    district,
    village,
    pincode,
    classFrom,
    classTo,
    schoolCategory,
    management,
    medium,
    genderType,
    totalStudents,
    totalTeachers,
    workingSmartBoards,
    computerIctLab,
    atalStemLab,
    playgroundAvailable,
    ctx?.data,
  ]);

  // Use school's custom saved FAQs if present, otherwise fall back to authentic UDISE data
  const faqs: SchoolFaqItem[] =
    ctx?.data?.faqs && ctx.data.faqs.length > 0
      ? ctx.data.faqs
      : defaultUdiseFaqs;

  // Track which FAQ items are open (accordion)
  const [openFaqIds, setOpenFaqIds] = useState<Record<string, boolean>>(() => {
    const firstId = faqs[0]?.id || 'faq-board';
    return { [firstId]: true };
  });

  const [activeCategory, setActiveCategory] = useState<string>('All');

  const toggleFaq = (faqId: string) => {
    setOpenFaqIds((prev) => ({
      ...prev,
      [faqId]: !prev[faqId],
    }));
  };

  // Derive categories dynamically ONLY from existing FAQs
  const availableCategories = React.useMemo(() => {
    const cats = new Set<string>();
    faqs.forEach((f) => {
      if (f.category) cats.add(f.category);
    });
    return ['All', ...Array.from(cats)];
  }, [faqs]);

  const filteredFaqs = faqs.filter((item) => {
    if (activeCategory === 'All') return true;
    return item.category?.toLowerCase() === activeCategory.toLowerCase();
  });

  // Edit Mode actions (School khud add/edit/delete karegi)
  const handleAddFaq = () => {
    if (!ctx?.addFaq) return;
    const newId = `faq-${Date.now().toString(36)}`;
    ctx.addFaq({
      q: 'Write parent or student query here?',
      a: 'Provide clear, authentic institutional information.',
      category: activeCategory !== 'All' ? activeCategory : 'General',
    });
    setOpenFaqIds((prev) => ({ ...prev, [newId]: true }));
  };

  const handleDeleteFaq = (faqId: string) => {
    if (!ctx?.deleteFaq) return;
    ctx.deleteFaq(faqId);
  };

  // 1-Click AI Auto-Generate FAQs from School Profile
  const handleAiGenerateFaqs = () => {
    if (!ctx) return;
    defaultUdiseFaqs.forEach((item) => {
      if (ctx.addFaq) {
        ctx.addFaq({
          q: item.q,
          a: item.a,
          category: item.category,
        });
      }
    });
  };

  if (faqs.length === 0 && !isEditMode) {
    return null;
  }

  return (
    <section id={id} className={`py-12 sm:py-20 bg-[#F7F8F8] border-b border-[#E8E9E9] relative overflow-hidden ${className}`}>
      {/* Decorative ambient background */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#EDF5FA]/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EDF5FA] border border-[#D0E4F5] text-xs font-bold tracking-wider uppercase text-[#006FCC] mb-3 shadow-2xs font-['Montserrat',sans-serif]">
            <HelpCircle className="w-4 h-4 text-[#006FCC]" />
            <EditableText
              contentKey="faq_eyebrow"
              value="FREQUENTLY ASKED QUESTIONS"
              maxLength={35}
              className="inline-block"
            />
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-['Montserrat',sans-serif] text-[#003C6E] tracking-tight leading-tight">
            <EditableText
              contentKey="faq_heading"
              value={title}
              maxLength={60}
              className="inline-block"
            />
            <span className="text-[#006FCC] block mt-1">Questions & Clear Answers</span>
          </h2>

          <p className="mt-3 text-sm sm:text-base text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
            <EditableText
              contentKey="faq_subtitle"
              value={subtitle}
              maxLength={180}
              multiline
              rows={2}
              className="inline-block"
            />
          </p>

          {/* Category Filter Pills (Only shown if > 1 category exists) */}
          {availableCategories.length > 2 && (
            <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
              {availableCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-[10px] text-xs font-bold font-['Montserrat',sans-serif] transition-all cursor-pointer shadow-xs ${
                    activeCategory === cat
                      ? 'bg-[#006FCC] text-white shadow-md'
                      : 'bg-white text-slate-600 hover:bg-slate-50 border border-[#E8E9E9]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3.5">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = !!openFaqIds[faq.id];

            return (
              <div
                key={faq.id || idx}
                className={`rounded-[14px] border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'bg-white border-[#006FCC]/50 shadow-md ring-1 ring-[#006FCC]/20'
                    : 'bg-white border-[#E8E9E9] shadow-xs hover:border-[#006FCC]/40 hover:shadow-sm'
                }`}
              >
                {/* Accordion Header */}
                <div
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left cursor-pointer select-none group"
                >
                  <div className="flex items-start gap-3.5 pr-3 flex-1 min-w-0">
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-[10px] flex items-center justify-center shrink-0 transition-colors shadow-2xs border ${
                        isOpen 
                          ? 'bg-[#006FCC] text-white border-[#006FCC]' 
                          : 'bg-[#EDF5FA] text-[#006FCC] border-[#D0E4F5] group-hover:bg-[#006FCC] group-hover:text-white'
                      }`}
                    >
                      <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>

                    <div className="flex-1 min-w-0 pt-0.5">
                      {faq.category && (
                        <div className="mb-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-[6px] bg-[#EDF5FA] text-[#006FCC] border border-[#D0E4F5] font-['Montserrat',sans-serif]">
                            {faq.category}
                          </span>
                        </div>
                      )}

                      <div className="text-sm sm:text-base font-bold font-['Montserrat',sans-serif] text-[#003C6E] group-hover:text-[#006FCC] transition-colors leading-snug">
                        {isEditMode ? (
                          <EditableText
                            contentKey={`faq_q_${faq.id}`}
                            value={faq.q}
                            maxLength={120}
                            placeholder="Enter question..."
                            className="inline-block"
                          />
                        ) : (
                          <span>{faq.q}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isEditMode && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteFaq(faq.id);
                        }}
                        className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                        title="Delete question"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}

                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-200 ${
                        isOpen 
                          ? 'rotate-180 bg-[#EDF5FA] text-[#005689]' 
                          : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                    </div>
                  </div>
                </div>

                {/* Accordion Answer Content */}
                {isOpen && (
                  <div className="px-4 sm:px-6 pb-5 pt-0 border-t border-slate-100 mt-1">
                    <div className="pl-12 sm:pl-14 pt-3 text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                      {isEditMode ? (
                        <EditableText
                          contentKey={`faq_a_${faq.id}`}
                          value={faq.a}
                          multiline
                          rows={3}
                          maxLength={350}
                          placeholder="Enter clear, authentic answer..."
                          className="inline-block"
                        />
                      ) : (
                        <p>{faq.a}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Edit Mode Actions (School Khud Dalega ya AI Likhega) */}
        {isEditMode && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleAddFaq}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#005689] text-white hover:bg-[#003c6e] font-bold text-xs shadow-xs transition cursor-pointer active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom FAQ Question</span>
            </button>

            <button
              type="button"
              onClick={handleAiGenerateFaqs}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 font-bold text-xs transition cursor-pointer active:scale-95"
              title="Populate questions from verified school UDISE records"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>AI Generate from UDISE Profile</span>
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
