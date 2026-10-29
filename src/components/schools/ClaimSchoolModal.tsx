'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  X,
  CheckCircle2,
  AlertCircle,
  Building2,
  Mail,
  Phone,
  User,
  Briefcase,
  FileText,
  Lock,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface ClaimSchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  schoolName: string;
  udiseCode: string;
  currentUser?: any;
}

export default function ClaimSchoolModal({
  isOpen,
  onClose,
  schoolName,
  udiseCode,
  currentUser: currentUserProp,
}: ClaimSchoolModalProps) {
  const { user: authContextUser, loading: authContextLoading } = useAuth();
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);

  const currentUser = currentUserProp || authContextUser || sessionUser;
  const isAuthLoading = authContextLoading && isSessionLoading && !currentUser;

  // Form State
  const [claimantName, setClaimantName] = useState('');
  const [claimantEmail, setClaimantEmail] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [designation, setDesignation] = useState('Principal / Head of School');
  const [note, setNote] = useState('');

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<any | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Check login state upon modal opening
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setErrorMsg(null);
    setSuccessData(null);

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) return;
      setIsSessionLoading(false);
      const active = session?.user || currentUserProp || authContextUser;
      if (active) {
        setSessionUser(active);
        if (active.email) setClaimantEmail((prev) => prev || active.email || '');
        const metaName = active.user_metadata?.full_name || active.user_metadata?.name || '';
        if (metaName) setClaimantName((prev) => prev || metaName);
        const metaPhone = active.user_metadata?.phone || active.phone || '';
        if (metaPhone) setWhatsappNumber((prev) => prev || metaPhone);
      }
    }).catch(() => {
      if (isMounted) setIsSessionLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [isOpen, currentUserProp, authContextUser]);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.email && !claimantEmail) setClaimantEmail(currentUser.email);
      const metaName = currentUser.user_metadata?.full_name || currentUser.user_metadata?.name || '';
      if (metaName && !claimantName) setClaimantName(metaName);
      const metaPhone = currentUser.user_metadata?.phone || currentUser.phone || '';
      if (metaPhone && !whatsappNumber) setWhatsappNumber(metaPhone);
    }
  }, [currentUser]);

  if (!isOpen) return null;

  const handleLoginRedirect = () => {
    const returnUrl = typeof window !== 'undefined' ? window.location.pathname : '/';
    window.location.href = `/login?returnUrl=${encodeURIComponent(returnUrl)}`;
  };

  const handleSubmitClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!claimantName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!claimantEmail.trim() || !claimantEmail.includes('@')) {
      setErrorMsg('Please enter a valid official email address.');
      return;
    }
    const cleanPhone = whatsappNumber.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit WhatsApp number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/school-claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          school_name: schoolName,
          udise_code: udiseCode,
          claimant_name: claimantName.trim(),
          claimant_email: claimantEmail.trim(),
          whatsapp_number: whatsappNumber.trim(),
          designation,
          note: note.trim(),
          user_id: currentUser?.id,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit claim request.');
      }

      setSuccessData(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error submitting claim.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyLink = () => {
    if (successData?.visual_edit_url) {
      navigator.clipboard.writeText(successData.visual_edit_url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#005689] via-[#0D4979] to-[#003c6e] p-5 sm:p-6 text-white flex items-start justify-between relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
              <ShieldCheck className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-full mb-1">
                Official Verification
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white leading-tight">Claim This School Profile</h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          {/* Loading Auth */}
          {isAuthLoading && (
            <div className="py-12 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 rounded-full border-3 border-[#005689] border-t-transparent animate-spin" />
              <p className="text-xs text-slate-500 font-semibold">Verifying your account session...</p>
            </div>
          )}

          {/* Condition 1: User NOT logged in */}
          {!isAuthLoading && !currentUser && !successData && (
            <div className="text-center py-6 px-2">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Lock className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-black text-slate-900 mb-2">Login Required to Claim Profile</h4>
              <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto mb-6 leading-relaxed">
                To protect official institutions from unauthorized edits, you must be signed in with a verified account before claiming management of{' '}
                <strong className="text-slate-900 font-bold">{schoolName}</strong>.
              </p>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left mb-6 text-xs text-slate-600 space-y-1.5">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  What happens when you claim?
                </div>
                <p>• Admin verification notification is dispatched immediately.</p>
                <p>• Direct visual page editing link is generated for your school.</p>
                <p>• Manage admissions, fee structure, contact details, and board results.</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  onClick={handleLoginRedirect}
                  className="px-6 py-3 rounded-xl bg-[#005689] hover:bg-[#003c6e] text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Sign In with Google / Email
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Condition 2: Success Confirmation */}
          {successData && (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full mb-2">
                  Status: Pending Official Verification
                </span>
                <h4 className="text-xl font-black text-slate-900 mb-1">Claim Request Submitted</h4>
                <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                  Thank you, <strong>{claimantName}</strong>. Your claim for <strong>{schoolName}</strong> (UDISE: {udiseCode}) has been registered and sent for administrative review.
                </p>
              </div>

              {/* Review Info Notice */}
              <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 text-left space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#003c6e]">
                  <ShieldCheck className="w-4 h-4 text-[#005689]" />
                  Institutional Authorization Review
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  To protect schools and prevent unauthorized modifications, editing access is granted only after administrative credentials verification.
                  Our team will contact you at <strong>{claimantEmail}</strong> / WhatsApp <strong>{whatsappNumber}</strong>.
                </p>
              </div>

              <div className="pt-2 flex justify-center">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-8 py-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm transition-all cursor-pointer shadow-md"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Condition 3: User IS logged in -> Show Form */}
          {!isAuthLoading && currentUser && !successData && (
            <form onSubmit={handleSubmitClaim} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Pre-filled School Details (Read Only) */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">School Name</span>
                  <div className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5 mt-0.5">
                    <Building2 className="w-4 h-4 text-[#005689] shrink-0" />
                    <span>{schoolName}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 pt-2 border-t border-slate-200/60 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">UDISE Code</span>
                    <p className="font-mono font-bold text-slate-800">{udiseCode}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Account</span>
                    <p className="font-semibold text-slate-700">{currentUser.email}</p>
                  </div>
                </div>
              </div>

              {/* Claimant Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={claimantName}
                    onChange={(e) => setClaimantName(e.target.value)}
                    placeholder="e.g. Dr. Ramesh Sharma"
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689] focus:ring-1 focus:ring-[#005689]"
                  />
                </div>
              </div>

              {/* WhatsApp Number & Official Email in 2 Cols */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    WhatsApp Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="tel"
                      required
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      placeholder="e.g. 9812345678"
                      className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689] focus:ring-1 focus:ring-[#005689]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Official Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={claimantEmail}
                      onChange={(e) => setClaimantEmail(e.target.value)}
                      placeholder="principal@school.org"
                      className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689] focus:ring-1 focus:ring-[#005689]"
                    />
                  </div>
                </div>
              </div>

              {/* Designation / Role */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Designation / Authority <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689] focus:ring-1 focus:ring-[#005689] bg-white cursor-pointer"
                  >
                    <option value="Principal / Head of School">Principal / Head of School</option>
                    <option value="School Owner / Trustee / Board Member">School Owner / Trustee / Board Member</option>
                    <option value="Admissions Director / Officer">Admissions Director / Officer</option>
                    <option value="IT Administrator / System Incharge">IT Administrator / System Incharge</option>
                    <option value="Authorized Senior Teacher / Coordinator">Authorized Senior Teacher / Coordinator</option>
                    <option value="Other Authorized Representative">Other Authorized Representative</option>
                  </select>
                </div>
              </div>

              {/* Verification Note */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Verification Note / Authorization Details
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <textarea
                    rows={3}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Provide official school website email, affiliation registration details, or verification message..."
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689] focus:ring-1 focus:ring-[#005689]"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#005689] hover:bg-[#003c6e] disabled:opacity-50 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting Claim...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-amber-300" />
                      <span>Submit Claim Request</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
