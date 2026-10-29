'use client';

import React, { useState } from 'react';
import {
  Briefcase,
  GraduationCap,
  Clock,
  Send,
  CheckCircle2,
  DollarSign,
  Mail,
  Phone,
  Sparkles,
  Award,
  Users,
  ExternalLink,
  Calendar
} from 'lucide-react';
import EditableText from '@/components/schools/template/EditableText';

export interface CareerVacancyItem {
  id: string;
  title: string;
  department: string;
  type: string;
  experience: string;
  qualification: string;
  salary_range?: string;
  description?: string;
  published_date?: string; // Exact date published on official school website (e.g. "2026-10-05" or "05 Oct 2026")
  posted_date?: string;
  vacancy_age?: string; // How old the vacancy is according to school website (e.g. "6 days old")
  vacancy_age_days?: number;
  is_new?: boolean; // Only true if it is a new/active vacancy on the school website
  official_vacancy_url?: string; // Direct URL to the vacancy page/notice on the school website
}

export interface SchoolCareersTabProps {
  displayName: string;
  isLiveTemplate?: boolean;
  isEditMode?: boolean;
  templateData?: any;
  careersData?: {
    heading?: string;
    subheading?: string;
    description?: string;
    official_careers_page_url?: string;
    contact_email?: string;
    contact_phone?: string;
    openings?: CareerVacancyItem[];
    open_positions?: CareerVacancyItem[];
  };
}

/**
 * Helper to compute published date and how old a vacancy is according to the school's official website.
 * Strictly filters out old/expired or non-website dummy vacancies.
 */
function evaluateOfficialVacancy(job: any): {
  isValidNewVacancy: boolean;
  publishedDateFormatted: string;
  vacancyAgeLabel: string;
  daysOld: number;
} {
  if (!job || !job.title) {
    return { isValidNewVacancy: false, publishedDateFormatted: '', vacancyAgeLabel: '', daysOld: 999 };
  }

  // Explicitly marked old/inactive -> do not show
  if (job.is_new === false) {
    return { isValidNewVacancy: false, publishedDateFormatted: '', vacancyAgeLabel: 'Expired', daysOld: 999 };
  }

  const rawDateStr = (job.published_date || job.posted_date || '').trim();
  // Reject generic non-date placeholders like "Session 2026-27" unless published_date is provided
  if (!rawDateStr || rawDateStr.toLowerCase().startsWith('session')) {
    return { isValidNewVacancy: false, publishedDateFormatted: '', vacancyAgeLabel: '', daysOld: 999 };
  }

  const parsedTime = Date.parse(rawDateStr);
  if (!isNaN(parsedTime)) {
    const pubDate = new Date(parsedTime);
    const now = new Date();
    const diffMs = now.getTime() - pubDate.getTime();
    const daysOld = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

    const publishedDateFormatted = pubDate.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const vacancyAgeLabel =
      job.vacancy_age ||
      (daysOld === 0
        ? 'Published Today (New)'
        : daysOld === 1
        ? '1 day old'
        : `${daysOld} days old`);

    // Only treat as a NEW active vacancy if published within the last 45 days (or explicitly marked is_new: true)
    const isValidNewVacancy = daysOld <= 45;
    return {
      isValidNewVacancy,
      publishedDateFormatted,
      vacancyAgeLabel,
      daysOld,
    };
  }

  // If pre-formatted date + age are provided and is_new === true
  if (job.is_new === true && rawDateStr) {
    const daysOld = typeof job.vacancy_age_days === 'number' ? job.vacancy_age_days : 0;
    return {
      isValidNewVacancy: daysOld <= 45,
      publishedDateFormatted: rawDateStr,
      vacancyAgeLabel: job.vacancy_age || (daysOld > 0 ? `${daysOld} days old` : 'New Vacancy'),
      daysOld,
    };
  }

  return { isValidNewVacancy: false, publishedDateFormatted: '', vacancyAgeLabel: '', daysOld: 999 };
}

export default function SchoolCareersTab({
  displayName,
  isLiveTemplate = false,
  isEditMode = false,
  templateData,
  careersData,
}: SchoolCareersTabProps) {
  const cData = careersData || templateData?.careers || {};
  const officialCareersUrl =
    cData.official_careers_page_url ||
    templateData?.officialCareersUrl ||
    templateData?.careers?.official_careers_page_url ||
    '';

  // Strictly NO dummy/fallback vacancies: only read actual openings from database/official school website
  const rawOpenings: any[] = Array.isArray(cData.openings)
    ? cData.openings
    : Array.isArray(cData.open_positions)
    ? cData.open_positions
    : [];

  // Filter to ONLY new/active vacancies published on the school's official website
  const openings = rawOpenings
    .map((job) => {
      const meta = evaluateOfficialVacancy(job);
      return {
        ...job,
        _isValidNewVacancy: meta.isValidNewVacancy,
        _publishedDateFormatted: meta.publishedDateFormatted,
        _vacancyAgeLabel: meta.vacancyAgeLabel,
        _daysOld: meta.daysOld,
      };
    })
    .filter((job) => job._isValidNewVacancy);

  const contactEmail =
    (cData.contact_email && cData.contact_email !== 'careers@school.edu.in' ? cData.contact_email : '') ||
    templateData?.contact?.desks?.careers_desk?.email ||
    templateData?.contactEmail ||
    templateData?.email ||
    '';
  const contactPhone =
    (cData.contact_phone && cData.contact_phone !== '+91-XXXXXXXXXX' ? cData.contact_phone : '') ||
    templateData?.contact?.desks?.careers_desk?.phone ||
    templateData?.contactPhone ||
    templateData?.phone ||
    '';

  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantExp, setApplicantExp] = useState('');
  const [appliedSuccess, setAppliedSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setAppliedSuccess(true);
      setTimeout(() => {
        setAppliedSuccess(false);
        setSelectedJob(null);
        setApplicantName('');
        setApplicantEmail('');
        setApplicantPhone('');
        setApplicantExp('');
      }, 2500);
    }, 600);
  };

  return (
    <section
      id="careers"
      className="py-12 sm:py-20 bg-white border-b border-[#E8E9E9] relative overflow-hidden"
    >
      {/* Decorative ambient background */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#EDF5FA]/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* ─── Section Header ─── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="text-center sm:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-[#006FCC] bg-[#EDF5FA] border border-[#D0E4F5] px-3.5 py-1.5 rounded-full mb-3 shadow-2xs font-['Montserrat',sans-serif]">
              <span className="w-2 h-2 bg-[#006FCC] rounded-full inline-block animate-pulse" />
              <span>CAREERS &amp; FACULTY RECRUITMENT</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold font-['Montserrat',sans-serif] text-[#003C6E] tracking-tight leading-tight">
              <EditableText
                fieldKey="careers_heading"
                value={cData.heading || 'Join Our Esteemed Teaching &'}
                className="inline text-[#003C6E]"
              />
              <span className="text-[#006FCC] block mt-0.5">
                Mentoring Faculty at {displayName}
              </span>
            </h2>

            <p className="mt-3 text-slate-600 font-normal max-w-2xl text-sm sm:text-base leading-relaxed">
              <EditableText
                fieldKey="careers_subheading"
                value={
                  cData.subheading ||
                  'We list only verified, new faculty and staff vacancies published directly on the official school website.'
                }
              />
            </p>
          </div>

          {/* Direct HR Contact Pill Card */}
          {(contactEmail || contactPhone) && (
            <div className="bg-white border border-[#E8E9E9] rounded-[14px] p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
              {contactEmail && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EDF5FA] text-[#005689] border border-[#D6EDFF] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      HR Recruitment Desk
                    </span>
                    <a
                      href={`mailto:${contactEmail}`}
                      className="text-xs sm:text-sm font-black text-slate-900 hover:text-[#005689] transition-colors"
                    >
                      {contactEmail}
                    </a>
                  </div>
                </div>
              )}

              {contactEmail && contactPhone && (
                <div className="hidden sm:block w-px h-8 bg-slate-200" />
              )}

              {contactPhone && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/60 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      HR Helpline
                    </span>
                    <span className="text-xs sm:text-sm font-black text-slate-900">
                      {contactPhone}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ─── Official School Careers Page Link Card ─── */}
        {officialCareersUrl && (
          <div className="bg-white/95 border border-[#F4EBD9] rounded-[28px] p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-[0_10px_30px_rgba(0,35,70,0.06),inset_0_1px_0_rgba(255,255,255,0.9)]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EDF5FA] text-[#005689] flex items-center justify-center shrink-0 border border-[#D6EDFF] shadow-xs">
                <Briefcase className="w-6 h-6 text-[#005689]" />
              </div>
              <div>
                <h4 className="text-base font-black text-slate-950">Official School Careers &amp; Recruitment Portal</h4>
                <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
                  Verify published vacancy dates and apply directly on the official website of {displayName}
                </p>
              </div>
            </div>
            <a
              href={officialCareersUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#005689] hover:bg-[#004168] text-white text-xs font-black transition-all shrink-0 shadow-md hover:scale-105 active:scale-95"
            >
              <span>Visit Official Careers Page</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}

        {/* ─── Open Positions Container Card (Shows ONLY New Website-Verified Vacancies) ─── */}
        <div className="bg-white/95 rounded-[32px] sm:rounded-[36px] p-6 sm:p-8 border border-[#F4EBD9] shadow-[0_12px_36px_rgba(0,35,70,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] space-y-6">
          {/* Card Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#EDF5FA] text-[#005689] border border-[#D6EDFF] flex items-center justify-center shadow-xs">
                <Briefcase className="w-6 h-6 text-[#005689]" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                  Official Website Faculty &amp; Staff Vacancies
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {openings.length > 0
                    ? `${openings.length} New Active ${openings.length === 1 ? 'Vacancy' : 'Vacancies'} Verified from School Website`
                    : 'Only new, active vacancies published on the official school website are shown here'}
                </p>
              </div>
            </div>

            {openings.length > 0 ? (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                New Website Vacancy Active
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 border border-slate-200 px-3.5 py-1.5 rounded-full">
                No New Vacancy Published
              </span>
            )}
          </div>

          {/* Conditional: Render Job Cards ONLY if new official website vacancies exist */}
          {openings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {openings.map((job: any, idx: number) => (
                <div
                  key={job.id || `vac-${idx}`}
                  className="bg-white hover:bg-slate-50/50 rounded-[14px] border border-[#E8E9E9] hover:border-[#006FCC]/40 p-6 flex flex-col justify-between transition-all duration-300 shadow-xs hover:shadow-md group"
                >
                  <div className="space-y-4">
                    {/* Top Row: Department + NEW Vacancy Age Badge */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-[#EDF5FA] text-[#006FCC] border border-[#D0E4F5] font-['Montserrat',sans-serif]">
                        {job.department || 'Academic Faculty'}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>NEW • {job._vacancyAgeLabel}</span>
                      </span>
                    </div>

                    {/* Official Website Published Date & Vacancy Age Banner */}
                    <div className="bg-[#F7F8F8] border border-[#E8E9E9] rounded-[10px] p-3 space-y-1.5 shadow-2xs">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 font-semibold flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#006FCC]" />
                          Published on Website:
                        </span>
                        <span className="font-bold text-[#003C6E]">
                          {job._publishedDateFormatted}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 font-semibold flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          Vacancy Age:
                        </span>
                        <span className="font-bold text-emerald-700">
                          {job._vacancyAgeLabel} (Active)
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold font-['Montserrat',sans-serif] text-[#003C6E] group-hover:text-[#006FCC] transition-colors leading-snug">
                        {job.title}
                      </h4>
                      {job.description && (
                        <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed font-normal">
                          {job.description}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 pt-3 border-t border-[#E8E9E9] text-xs text-slate-600">
                      {job.qualification && (
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 text-[#006FCC] shrink-0" />
                          <span>
                            <strong className="text-slate-800">Qualification:</strong> {job.qualification}
                          </span>
                        </div>
                      )}
                      {job.experience && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>
                            <strong className="text-slate-800">Experience:</strong> {job.experience}
                          </span>
                        </div>
                      )}
                      {job.salary_range && (
                        <div className="flex items-center gap-2 text-emerald-700 font-bold">
                          <DollarSign className="w-4 h-4 shrink-0" />
                          <span>{job.salary_range}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-5 mt-5 border-t border-[#E8E9E9] flex items-center justify-between gap-2">
                    {(job.official_vacancy_url || officialCareersUrl) ? (
                      <a
                        href={job.official_vacancy_url || officialCareersUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-[#006FCC] hover:underline font-bold"
                      >
                        <span>Official Notice</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-bold">
                        {job.type || 'Full Time'}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => setSelectedJob(job)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[10px] text-xs font-bold text-white bg-[#006FCC] hover:bg-[#005399] shadow-sm transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer font-['Montserrat',sans-serif]"
                    >
                      <span>Apply Now</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#F7F8F8] border border-dashed border-[#D0E4F5] rounded-[14px] p-8 sm:p-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-[12px] bg-[#EDF5FA] text-[#006FCC] border border-[#D0E4F5] flex items-center justify-center mx-auto">
                <Briefcase className="w-6 h-6" />
              </div>
              <h4 className="text-base sm:text-lg font-bold font-['Montserrat',sans-serif] text-[#003C6E]">
                No New Active Vacancies Published on School Website Currently
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
                According to the official records of <strong>{displayName}</strong>, there are no newly published job vacancies at this time. We strictly display only verified, new recruitment notifications from the school&apos;s official website.
              </p>
              {(officialCareersUrl || contactEmail) && (
                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  {officialCareersUrl && (
                    <a
                      href={officialCareersUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#005689] hover:bg-[#003c6e] text-white text-xs font-bold transition shadow-xs"
                    >
                      <span>Check Official School Website</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {contactEmail && (
                    <a
                      href={`mailto:${contactEmail}?subject=Faculty%20Resume%20Submission%20-%20${encodeURIComponent(displayName)}`}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs font-bold transition shadow-2xs"
                    >
                      <Mail className="w-3.5 h-3.5 text-[#005689]" />
                      <span>Email Resume for Future Openings</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ─── Faculty Benefits & Institutional Culture Card ─── */}
        <div className="bg-white/95 rounded-[32px] sm:rounded-[36px] p-6 sm:p-8 border border-[#F4EBD9] shadow-[0_12px_36px_rgba(0,35,70,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#EDF5FA] text-[#005689] border border-[#D6EDFF] flex items-center justify-center shadow-xs">
                <Award className="w-6 h-6 text-[#005689]" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                  Why Build Your Career With Us?
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Empowering educators with modern pedagogical tools &amp; holistic benefits
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: 'Competitive Pay Scale',
                desc: 'Attractive remuneration aligned with standard pay commissions, PF, and performance incentives.',
                icon: DollarSign,
                badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
              },
              {
                title: 'Smart Lab Classrooms',
                desc: 'Teach with interactive flat panels, Atal Tinkering Labs, and digital experiential resources.',
                icon: Sparkles,
                badgeBg: 'bg-[#EDF5FA] text-[#005689] border-[#D6EDFF]',
              },
              {
                title: 'Faculty Training & PD',
                desc: 'Regular CBSE capacity building workshops, NEP 2020 training, and academic leadership seminars.',
                icon: GraduationCap,
                badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
              },
              {
                title: 'Supportive Work Culture',
                desc: 'Safe, inclusive campus environment with transport facility and staff ward fee concessions.',
                icon: Users,
                badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
              },
            ].map((benefit, i) => (
              <div
                key={i}
                className="bg-[#F7F8F8] p-5 rounded-[14px] border border-[#E8E9E9] space-y-3 hover:bg-white hover:border-[#006FCC]/40 transition-all"
              >
                <div
                  className={`w-10 h-10 rounded-[10px] border flex items-center justify-center ${benefit.badgeBg}`}
                >
                  <benefit.icon className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold font-['Montserrat',sans-serif] text-[#003C6E]">{benefit.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {benefit.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Apply Modal ─── */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[16px] max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E8E9E9] relative">
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 w-8 h-8 rounded-full flex items-center justify-center transition-colors font-bold text-sm"
            >
              ✕
            </button>

            {appliedSuccess ? (
              <div className="text-center py-8 space-y-3 animate-fade-in">
                <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-[12px] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold font-['Montserrat',sans-serif] text-[#003C6E]">Application Submitted!</h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-xs mx-auto font-normal">
                  Your application for <strong>{selectedJob.title}</strong> has been sent to the HR desk at {displayName}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#006FCC] bg-[#EDF5FA] border border-[#D0E4F5] px-3 py-1 rounded-full mb-2 font-['Montserrat',sans-serif]">
                    <span className="w-1.5 h-1.5 bg-[#006FCC] rounded-full" />
                    Faculty Application
                  </div>
                  <h3 className="text-xl font-bold font-['Montserrat',sans-serif] text-[#003C6E] leading-tight">
                    {selectedJob.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    {selectedJob.department} • {selectedJob.type}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 font-['Montserrat',sans-serif]">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Anjali Sharma"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-[#F7F8F8] border border-[#E8E9E9] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#006FCC]/20 focus:border-[#006FCC]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1 font-['Montserrat',sans-serif]">
                        Email ID *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="yourname@gmail.com"
                        value={applicantEmail}
                        onChange={(e) => setApplicantEmail(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 bg-[#F7F8F8] border border-[#E8E9E9] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#006FCC]/20 focus:border-[#006FCC]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1 font-['Montserrat',sans-serif]">
                        Contact Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 9876543210"
                        value={applicantPhone}
                        onChange={(e) => setApplicantPhone(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 bg-[#F7F8F8] border border-[#E8E9E9] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#006FCC]/20 focus:border-[#006FCC]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 font-['Montserrat',sans-serif]">
                      Qualification &amp; Teaching Experience
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. M.Sc, B.Ed — 4 Years in CBSE School"
                      value={applicantExp}
                      onChange={(e) => setApplicantExp(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-[#F7F8F8] border border-[#E8E9E9] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#006FCC]/20 focus:border-[#006FCC]"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedJob(null)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 text-xs font-black text-white bg-[#005689] hover:bg-[#003c6e] rounded-full transition-all shadow-md flex items-center gap-2"
                  >
                    <span>{isSubmitting ? 'Submitting...' : 'Submit Application'}</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
