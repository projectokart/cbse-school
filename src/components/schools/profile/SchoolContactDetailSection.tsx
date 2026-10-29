'use client';

import React, { useState } from 'react';
import {
  Building2,
  GraduationCap,
  UserCheck,
  Briefcase,
  Phone,
  Mail,
  Send,
  CheckCircle2,
  Lock
} from 'lucide-react';
import EditableText from '@/components/schools/template/EditableText';

export interface SchoolContactDetailSectionProps {
  displayName: string;
  isLiveTemplate?: boolean;
  isEditMode?: boolean;
  templateData?: any;
  displayGeneralPhone: string;
  displayGeneralEmail: string;
  displayAdmissionsPhone: string;
  displayAdmissionsEmail: string;
  displayPrincipalPhone: string;
  displayPrincipalEmail: string;
  displayCareersPhone: string;
  displayCareersEmail: string;
}

export default function SchoolContactDetailSection({
  displayName,
  isLiveTemplate = false,
  isEditMode = false,
  templateData,
  displayGeneralPhone,
  displayGeneralEmail,
  displayAdmissionsPhone,
  displayAdmissionsEmail,
  displayPrincipalPhone,
  displayPrincipalEmail,
  displayCareersPhone,
  displayCareersEmail,
}: SchoolContactDetailSectionProps) {
  // Quick Inquiry Form State
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquirySubject, setInquirySubject] = useState('Admissions');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setInquiryName('');
      setInquiryPhone('');
      setInquiryMessage('');
    }, 2500);
  };

  const contactDesks = [
    {
      id: 'general',
      title: 'General Inquiries Desk',
      sub: 'Administrative, student records & visiting hours',
      icon: Building2,
      phone: displayGeneralPhone,
      email: displayGeneralEmail,
      color: 'bg-blue-50 text-[#005689] border-blue-100',
    },
    {
      id: 'admissions',
      title: 'Admissions & Enrollment',
      sub: 'New admissions, class availability & registration',
      icon: GraduationCap,
      phone: displayAdmissionsPhone,
      email: displayAdmissionsEmail,
      color: 'bg-emerald-50 text-emerald-800 border-emerald-100',
    },
    {
      id: 'principal',
      title: 'Principal & Leadership Desk',
      sub: 'Special appointments & academic counsel',
      icon: UserCheck,
      phone: displayPrincipalPhone,
      email: displayPrincipalEmail,
      color: 'bg-amber-50 text-amber-800 border-amber-100',
    },
    {
      id: 'careers',
      title: 'Careers & Human Resources',
      sub: 'Faculty recruitment & administrative jobs',
      icon: Briefcase,
      phone: displayCareersPhone,
      email: displayCareersEmail,
      color: 'bg-purple-50 text-purple-800 border-purple-100',
    },
  ];

  return (
    <section id="contact-details" className="py-12 sm:py-20 bg-white border-b border-[#E8E9E9] relative overflow-hidden">
      {/* Decorative ambient background */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#EDF5FA]/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center sm:text-left mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-[#006FCC] bg-[#EDF5FA] border border-[#D0E4F5] px-3.5 py-1.5 rounded-full mb-3 shadow-2xs font-['Montserrat',sans-serif]">
            <span className="w-2 h-2 bg-[#006FCC] rounded-full inline-block animate-pulse" />
            <span>COMMUNICATION DESKS</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-['Montserrat',sans-serif] text-[#003C6E] tracking-tight leading-tight">
            Contact Departments &amp;
            <span className="text-[#006FCC] block mt-0.5">Institutional Inquiries</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed max-w-2xl font-normal">
            Reach out to our specialized administrative channels for fast, dedicated assistance regarding {displayName}.
          </p>
        </div>

        {/* 4 Contact Desks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          {contactDesks.map((desk) => {
            const Icon = desk.icon;
            const hasPhone = Boolean(desk.phone && desk.phone.trim());
            const hasEmail = Boolean(desk.email && desk.email.trim());

            return (
              <div
                key={desk.id}
                className="bg-white rounded-[14px] p-6 border border-[#E8E9E9] shadow-xs hover:border-[#006FCC]/40 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className={`w-10 h-10 rounded-[10px] flex items-center justify-center mb-4 border shadow-xs ${desk.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-base font-bold font-['Montserrat',sans-serif] text-[#003C6E] tracking-tight">{desk.title}</h3>
                  <p className="text-xs text-slate-500 font-normal mt-1 leading-snug min-h-[32px]">{desk.sub}</p>
                </div>

                <div className="space-y-2.5 pt-4 mt-4 border-t border-[#E8E9E9]">
                  {hasPhone ? (
                    <a
                      href={`tel:${desk.phone}`}
                      className="flex items-center gap-2.5 text-xs font-semibold text-slate-800 hover:text-[#006FCC] transition-colors truncate group"
                    >
                      <div className="w-7 h-7 rounded-full bg-[#EDF5FA] flex items-center justify-center group-hover:bg-[#006FCC] group-hover:text-white transition-colors">
                        <Phone className="w-3.5 h-3.5 text-[#006FCC] group-hover:text-white shrink-0" />
                      </div>
                      <span className="truncate">{desk.phone}</span>
                    </a>
                  ) : (
                    <div className="flex items-center gap-2.5 text-xs text-slate-400">
                      <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      </div>
                      <span>Phone not listed</span>
                    </div>
                  )}

                  {hasEmail ? (
                    <a
                      href={`mailto:${desk.email}`}
                      className="flex items-center gap-2.5 text-xs font-semibold text-slate-800 hover:text-[#006FCC] transition-colors truncate group"
                    >
                      <div className="w-7 h-7 rounded-full bg-[#EDF5FA] flex items-center justify-center group-hover:bg-[#006FCC] group-hover:text-white transition-colors">
                        <Mail className="w-3.5 h-3.5 text-[#006FCC] group-hover:text-white shrink-0" />
                      </div>
                      <span className="truncate">{desk.email}</span>
                    </a>
                  ) : (
                    <div className="flex items-center gap-2.5 text-xs text-slate-400">
                      <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      </div>
                      <span>Email not listed</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Message Dispatch Box */}
        <div className="bg-[#F7F8F8] rounded-[14px] p-8 sm:p-10 border border-[#E8E9E9] shadow-xs max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-[12px] bg-[#EDF5FA] text-[#006FCC] border border-[#D0E4F5] flex items-center justify-center shadow-xs shrink-0">
              <Send className="w-6 h-6 text-[#006FCC]" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold font-['Montserrat',sans-serif] text-[#003C6E]">Send an Administrative Message</h3>
              <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">The administration will receive and respond directly to your inquiry.</p>
            </div>
          </div>

          {isSent ? (
            <div className="py-10 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold font-['Montserrat',sans-serif] text-[#003C6E]">Message Dispatched!</h4>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">Thank you. The institutional desk will review your communication.</p>
            </div>
          ) : (
            <form onSubmit={handleInquirySubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1.5 font-['Montserrat',sans-serif]">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                    className="w-full text-xs font-medium px-3.5 py-2.5 rounded-[10px] border border-[#E8E9E9] focus:outline-none focus:border-[#006FCC] bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1.5 font-['Montserrat',sans-serif]">
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={inquiryPhone}
                    onChange={(e) => setInquiryPhone(e.target.value)}
                    className="w-full text-xs font-medium px-3.5 py-2.5 rounded-[10px] border border-[#E8E9E9] focus:outline-none focus:border-[#006FCC] bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1.5 font-['Montserrat',sans-serif]">
                  Department Desk *
                </label>
                <select
                  value={inquirySubject}
                  onChange={(e) => setInquirySubject(e.target.value)}
                  className="w-full text-xs font-medium px-3.5 py-2.5 rounded-[10px] border border-[#E8E9E9] focus:outline-none focus:border-[#006FCC] bg-white transition-all"
                >
                  <option value="Admissions">Admissions &amp; Enrollment</option>
                  <option value="General">General Administration &amp; Transport</option>
                  <option value="Principal">Principal Appointment</option>
                  <option value="Careers">Careers &amp; Faculty Opportunities</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1.5 font-['Montserrat',sans-serif]">
                  Inquiry Message *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Enter details of your query..."
                  value={inquiryMessage}
                  onChange={(e) => setInquiryMessage(e.target.value)}
                  className="w-full text-xs font-medium px-3.5 py-2.5 rounded-[10px] border border-[#E8E9E9] focus:outline-none focus:border-[#006FCC] bg-white transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-[14px] bg-[#006FCC] hover:bg-[#005399] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#006FCC]/20 transition-all cursor-pointer flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 font-['Montserrat',sans-serif]"
              >
                <Send className="w-4 h-4" />
                <span>Submit Inquiry to {displayName}</span>
              </button>
            </form>
          )}
        </div>

      </div>
    </section>
  );
}
