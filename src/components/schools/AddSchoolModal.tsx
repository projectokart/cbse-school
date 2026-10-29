'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Building2,
  Mail,
  Phone,
  User,
  Briefcase,
  FileText,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  Lock,
  Loader2,
  AlertCircle,
  Clock,
  LogIn,
  Award,
  Calendar,
  Layers,
  GraduationCap,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface AddSchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSchoolName?: string;
  defaultUdise?: string;
  defaultSchoolName?: string;
  currentUser?: any;
}

const BOARD_OPTIONS = [
  { value: 'CBSE', label: 'CBSE (Central Board of Secondary Education)' },
  { value: 'ICSE', label: 'ICSE / CISCE (Council for Indian School Certificate Examinations)' },
  { value: 'State Board', label: 'State Board of Education' },
  { value: 'IB', label: 'IB (International Baccalaureate)' },
  { value: 'Cambridge', label: 'Cambridge International (CIE / IGCSE)' },
  { value: 'NIOS', label: 'NIOS (National Institute of Open Schooling)' },
  { value: 'Other', label: 'Other Recognized Board' },
];

const MANAGEMENT_OPTIONS = ['Private', 'Govt', 'Aided', 'Central Govt'];
const NATURE_OPTIONS = ['Day School', 'Residential', 'Day-Boarding'];

export default function AddSchoolModal({
  isOpen,
  onClose,
  initialSchoolName = '',
  defaultUdise = '',
  defaultSchoolName = '',
  currentUser: currentUserProp,
}: AddSchoolModalProps) {
  // Authentication State
  const { user: authContextUser, loading: authContextLoading } = useAuth();
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentUser = currentUserProp || authContextUser || sessionUser;
  const isAuthLoading = authContextLoading && isSessionLoading && !currentUser;

  // Form Fields: UDISE & Identification
  const [udiseCode, setUdiseCode] = useState(defaultUdise || '');
  const [isUdiseChecking, setIsUdiseChecking] = useState(false);
  const [udiseVerified, setUdiseVerified] = useState(Boolean(defaultUdise && defaultUdise.length === 11));
  const [udiseFeedback, setUdiseFeedback] = useState<string | null>(null);

  // Form Fields: School Details
  const [schoolName, setSchoolName] = useState(defaultSchoolName || initialSchoolName || '');
  const [board, setBoard] = useState('CBSE');
  const [affiliationNumber, setAffiliationNumber] = useState('');
  const [stateName, setStateName] = useState('');

  // Update initial values if default props change
  useEffect(() => {
    if (defaultUdise) {
      setUdiseCode(defaultUdise);
      if (defaultUdise.length === 11) {
        setUdiseVerified(true);
      }
    }
    if (defaultSchoolName || initialSchoolName) {
      setSchoolName(defaultSchoolName || initialSchoolName || '');
    }
  }, [defaultUdise, defaultSchoolName, initialSchoolName]);
  const [district, setDistrict] = useState('');
  const [localAddress, setLocalAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [gradesLevel, setGradesLevel] = useState('Nursery - 12th');
  const [managementType, setManagementType] = useState('Private');
  const [schoolNature, setSchoolNature] = useState('Day School');
  const [establishedYear, setEstablishedYear] = useState('');
  const [principalName, setPrincipalName] = useState('');

  // Form Fields: Claimant Credentials
  const [claimantName, setClaimantName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [designation, setDesignation] = useState('Principal / Head of Institution');
  const [additionalNote, setAdditionalNote] = useState('');

  // Submission & State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);
  const [existingClaim, setExistingClaim] = useState<any>(null);

  // Sync user session
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setErrorMsg(null);
    setIsSubmittedSuccess(false);

    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (!isMounted) return;
        setIsSessionLoading(false);
        const active = session?.user || currentUserProp || authContextUser;
        if (active) {
          setSessionUser(active);
          const email = active.email || '';
          if (email) {
            setContactEmail(email);
            // Check if user already submitted a request
            fetch(`/api/school-claim?email=${encodeURIComponent(email)}&user_id=${encodeURIComponent(active.id)}`)
              .then((r) => r.json())
              .then((json) => {
                if (json.success && Array.isArray(json.claims) && json.claims.length > 0) {
                  const prior = json.claims.find((c: any) => c.status === 'pending' || c.status === 'approved');
                  if (prior && isMounted) {
                    setExistingClaim(prior);
                  }
                }
              })
              .catch(() => {});
          }
          const fullName = active.user_metadata?.full_name || active.user_metadata?.name || '';
          if (fullName) setClaimantName(fullName);
          const phone = active.user_metadata?.phone || active.phone || '';
          if (phone) setContactNumber(phone);
        }
      })
      .catch(() => {
        if (isMounted) setIsSessionLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, currentUserProp, authContextUser]);

  // Client-Side UDISE Verification & Auto-Fill Pipeline
  const handleUdiseChange = async (val: string) => {
    const clean = val.replace(/\D/g, '').slice(0, 11);
    setUdiseCode(clean);
    setUdiseFeedback(null);
    setUdiseVerified(false);

    if (clean.length === 11) {
      setIsUdiseChecking(true);
      try {
        const res = await fetch(`/api/udise/lookup?code=${clean}`);
        const json = await res.json();

        if (json.success && json.data) {
          const d = json.data;
          setUdiseVerified(true);
          setUdiseFeedback(`✔ UDISE Verified: ${d.schoolName || 'Institution Found'}`);

          // Auto-fill form fields from Government / Supabase registry
          if (d.schoolName && !schoolName) setSchoolName(d.schoolName);
          if (d.state) setStateName(d.state);
          if (d.district) setDistrict(d.district);
          if (d.village || d.streetAddress) {
            setLocalAddress(d.streetAddress || `${d.village || ''}, ${d.block || ''}`);
          }
          if (d.pincode) setPincode(String(d.pincode));

          // Board matching
          if (d.board) {
            const upper = d.board.toUpperCase();
            if (upper.includes('CBSE')) setBoard('CBSE');
            else if (upper.includes('ICSE') || upper.includes('CISCE')) setBoard('ICSE');
            else if (upper.includes('IB')) setBoard('IB');
            else if (upper.includes('CAMBRIDGE')) setBoard('Cambridge');
            else if (upper.includes('STATE')) setBoard('State Board');
          }

          // Classes
          if (d.classFrom && d.classTo) {
            setGradesLevel(`Class ${d.classFrom} - ${d.classTo}`);
          }

          // Management
          if (d.management) {
            const mLower = d.management.toLowerCase();
            if (mLower.includes('private') || mLower.includes('pvt') || mLower.includes('unaided')) {
              setManagementType('Private');
            } else if (mLower.includes('aided')) {
              setManagementType('Aided');
            } else if (mLower.includes('central') || mLower.includes('kvs')) {
              setManagementType('Central Govt');
            } else {
              setManagementType('Govt');
            }
          }

          // Nature
          if (d.nature && d.nature.toLowerCase().includes('residential')) {
            setSchoolNature('Residential');
          } else {
            setSchoolNature('Day School');
          }

          if (d.headMasterName) setPrincipalName(d.headMasterName);
          if (d.establishedYear) setEstablishedYear(String(d.establishedYear));
        } else {
          setUdiseVerified(false);
          setUdiseFeedback('UDISE format verified (11-digit). Please verify school details below.');
        }
      } catch {
        setUdiseVerified(false);
        setUdiseFeedback('11-digit code accepted. Please enter remaining institutional details.');
      } finally {
        setIsUdiseChecking(false);
      }
    }
  };

  const handleLoginRedirect = () => {
    const returnUrl = typeof window !== 'undefined' ? window.location.pathname : '/schools';
    window.location.href = `/login?returnUrl=${encodeURIComponent(returnUrl)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!currentUser) {
      setErrorMsg('Authentication Required: Please sign in to submit a school registration.');
      return;
    }

    if (!udiseCode || udiseCode.length !== 11) {
      setErrorMsg('Please enter a valid 11-digit UDISE number.');
      return;
    }

    if (!schoolName.trim()) {
      setErrorMsg('Please enter your School Name.');
      return;
    }

    if (!stateName.trim() || !district.trim()) {
      setErrorMsg('Please specify the State and District of the school campus.');
      return;
    }

    if (!affiliationNumber.trim()) {
      setErrorMsg('Please enter your Board Affiliation Number (e.g. CBSE / ICSE Affiliation No).');
      return;
    }

    const cleanPhone = contactNumber.replace(/\D/g, '').trim();
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit Contact Phone / Mobile number.');
      return;
    }

    if (!contactEmail.trim() || !contactEmail.includes('@')) {
      setErrorMsg('Please provide a valid Official Email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/school-claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          school_name: schoolName.trim(),
          udise_code: udiseCode.trim(),
          affiliation_number: affiliationNumber.trim(),
          board,
          state: stateName.trim(),
          district: district.trim(),
          city: localAddress.trim() || district.trim(),
          pincode: pincode.trim(),
          school_type: schoolNature,
          management: managementType,
          grades_level: gradesLevel,
          established_year: establishedYear.trim(),
          principal_name: principalName.trim(),
          claimant_name: claimantName.trim() || 'Institution Representative',
          claimant_email: contactEmail.trim().toLowerCase(),
          whatsapp_number: cleanPhone,
          designation: designation.trim(),
          note: `[ADD SCHOOL ONBOARDING] Board: ${board}, Affiliation: ${affiliationNumber.trim()}, Management: ${managementType}, Nature: ${schoolNature}. ${additionalNote.trim()}`,
          request_type: 'add_school',
          user_id: currentUser?.id,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        if (data.error === 'ALREADY_REQUESTED' || res.status === 409) {
          if (data.existing_claim) {
            setExistingClaim(data.existing_claim);
          }
          throw new Error(data.message || 'This school or UDISE is already registered or has a pending claim.');
        }
        throw new Error(data.error || data.message || 'Failed to submit school registration request.');
      }

      if (data.isAdminDirect && data.edit_url) {
        if (typeof window !== 'undefined') {
          window.location.href = data.edit_url;
          return;
        }
      }

      setIsSubmittedSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong while submitting.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div
        className="relative w-full max-w-2xl max-h-[92vh] my-auto overflow-y-auto bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 z-20 bg-gradient-to-r from-[#003c6e] via-[#005689] to-[#0284c7] px-5 sm:px-6 py-4 text-white flex items-center justify-between rounded-t-3xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shrink-0">
              <Building2 className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                {isSubmittedSuccess ? 'Registration Submitted' : 'Add Your School Profile'}
              </h3>
              <p className="text-[11px] sm:text-xs text-blue-100 font-medium">
                {isSubmittedSuccess
                  ? 'Official Administrative Verification Underway'
                  : 'UDISE+ & Affiliation Verification Pipeline'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto">
          {/* ── CASE 1: AUTH LOADING ── */}
          {isAuthLoading && (
            <div className="py-14 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-[#005689] animate-spin" />
              <p className="text-xs text-slate-500 font-semibold">Checking institution credentials...</p>
            </div>
          )}

          {/* ── CASE 2: USER NOT LOGGED IN ── */}
          {!isAuthLoading && !currentUser && (
            <div className="text-center py-8 px-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Lock className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-black text-slate-900 mb-2">Institutional Sign-In Required</h4>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mb-6 leading-relaxed">
                To prevent unauthorized profile changes, school profiles must be claimed or added by authenticated institutional accounts. Please sign in to proceed.
              </p>
              <button
                type="button"
                onClick={handleLoginRedirect}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#005689] hover:bg-[#003c6e] text-white text-xs font-bold shadow-md hover:shadow-lg transition cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In to Continue</span>
              </button>
            </div>
          )}

          {/* ── CASE 3: SUCCESS STATE ── */}
          {!isAuthLoading && currentUser && isSubmittedSuccess && (
            <div className="text-center py-8 px-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <ShieldCheck className="w-9 h-9" />
              </div>
              <h4 className="text-lg font-black text-slate-900 mb-1.5">Registration Submitted for Verification</h4>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mb-4 leading-relaxed">
                Your school profile details for <strong className="text-slate-800">{schoolName}</strong> (UDISE: <span className="font-mono text-[#005689]">{udiseCode}</span>) have been sent to the CSEEL Directorate for verification.
              </p>
              <div className="bg-blue-50/80 border border-blue-200/80 rounded-2xl p-4 max-w-md mx-auto text-left text-xs text-slate-700 space-y-2 mb-6">
                <div className="flex items-center gap-2 font-bold text-[#003c6e]">
                  <Clock className="w-4 h-4 text-[#005689]" />
                  <span>Next Step: Admin Approval</span>
                </div>
                <p className="text-[11.5px] text-slate-600 leading-relaxed">
                  Once verified by the administrator, your profile will be published live on CSEEL, and your login account will automatically be activated with full Edit & Publish permissions.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-full bg-[#005689] hover:bg-[#003c6e] text-white text-xs font-bold shadow-sm transition cursor-pointer"
              >
                Done
              </button>
            </div>
          )}

          {/* ── CASE 4: ALREADY REQUESTED / PENDING STATE ── */}
          {!isAuthLoading && currentUser && !isSubmittedSuccess && existingClaim && (
            <div className="text-center py-6 px-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto mb-3.5">
                <Clock className="w-7 h-7" />
              </div>
              <h4 className="text-base font-black text-slate-900 mb-1">
                {existingClaim.status === 'approved' ? 'School Already Registered & Approved' : 'Registration Pending Verification'}
              </h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto mb-4 leading-relaxed">
                {existingClaim.status === 'approved'
                  ? `Your account is already linked to ${existingClaim.school_name}. You can edit your school details directly from your profile.`
                  : `A registration request for ${existingClaim.school_name} (UDISE: ${existingClaim.udise_code}) is currently awaiting admin verification.`}
              </p>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-full border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                Close
              </button>
            </div>
          )}

          {/* ── CASE 5: ACTIVE FORM ── */}
          {!isAuthLoading && currentUser && !isSubmittedSuccess && !existingClaim && (
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMsg && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-xs text-rose-700">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="flex-1 font-medium">{errorMsg}</div>
                </div>
              )}

              {/* ── STEP 1: UDISE NUMBER & AUTO-VERIFICATION ── */}
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-[#005689]" />
                    <span>11-Digit UDISE Code</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  {isUdiseChecking && (
                    <span className="text-[10.5px] font-bold text-[#005689] flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Checking UDISE...
                    </span>
                  )}
                  {udiseVerified && (
                    <span className="text-[10.5px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      UDISE Verified
                    </span>
                  )}
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={udiseCode}
                    onChange={(e) => handleUdiseChange(e.target.value)}
                    placeholder="e.g. 07040101926"
                    maxLength={11}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-mono text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#005689] focus:border-transparent transition"
                    required
                  />
                </div>
                {udiseFeedback && (
                  <p className={`text-[11px] mt-1.5 font-medium ${udiseVerified ? 'text-emerald-700 font-semibold' : 'text-slate-500'}`}>
                    {udiseFeedback}
                  </p>
                )}
                <p className="text-[10px] text-slate-400 mt-1">
                  Entering your 11-digit UDISE auto-fills verified school data from central registry to save your time.
                </p>
              </div>

              {/* ── STEP 2: BOARD & AFFILIATION NUMBER ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    Affiliated Board <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={board}
                    onChange={(e) => setBoard(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#005689]"
                  >
                    {BOARD_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    Board Affiliation No. <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={affiliationNumber}
                    onChange={(e) => setAffiliationNumber(e.target.value)}
                    placeholder="e.g. 2130123 / ICSE-DEL-04"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#005689]"
                    required
                  />
                </div>
              </div>

              {/* ── STEP 3: SCHOOL PROFILE DETAILS (EDITABLE AUTO-FILLED) ── */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  School Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="Full Official Institution Name"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#005689]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    State <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    placeholder="e.g. Delhi, Haryana"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#005689]"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    District <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="e.g. East Delhi, Gurugram"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#005689]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    Local Campus Address / Locality
                  </label>
                  <input
                    type="text"
                    value={localAddress}
                    onChange={(e) => setLocalAddress(e.target.value)}
                    placeholder="Campus street address or sector"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#005689]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Pincode</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="6 digits"
                    maxLength={6}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#005689]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Management</label>
                  <select
                    value={managementType}
                    onChange={(e) => setManagementType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#005689]"
                  >
                    {MANAGEMENT_OPTIONS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">School Nature</label>
                  <select
                    value={schoolNature}
                    onChange={(e) => setSchoolNature(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#005689]"
                  >
                    {NATURE_OPTIONS.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Grades Level</label>
                  <input
                    type="text"
                    value={gradesLevel}
                    onChange={(e) => setGradesLevel(e.target.value)}
                    placeholder="Nursery - 12th"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#005689]"
                  />
                </div>
              </div>

              {/* ── STEP 4: AUTHORIZED CLAIMANT DETAILS ── */}
              <div className="border-t border-slate-200/80 pt-4">
                <h5 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#005689]" />
                  <span>Authorized Representative Contact</span>
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-3.5">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">
                      Your Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={claimantName}
                      onChange={(e) => setClaimantName(e.target.value)}
                      placeholder="Principal / Admin Name"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#005689]"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">
                      Official Email <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="principal@school.edu.in"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#005689]"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">
                      WhatsApp / Mobile No. <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      placeholder="10-digit mobile number"
                      maxLength={14}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#005689]"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">Designation</label>
                    <input
                      type="text"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      placeholder="Principal / Director / Trustee"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#005689]"
                    />
                  </div>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-full border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#005689] hover:bg-[#003c6e] text-white text-xs font-bold shadow-md hover:shadow-lg disabled:opacity-50 transition cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Submit for Verification</span>
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

  return createPortal(modalContent, document.body);
}
