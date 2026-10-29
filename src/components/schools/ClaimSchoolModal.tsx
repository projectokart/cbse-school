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
  FileText,
  Lock,
  ExternalLink,
  Copy,
  Check,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  KeyRound
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ClaimSchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  schoolName: string;
  udiseCode: string;
  currentUser?: any;
  onClaimSuccess?: (claim: any) => void;
}

export default function ClaimSchoolModal({
  isOpen,
  onClose,
  schoolName,
  udiseCode,
  currentUser: currentUserProp,
  onClaimSuccess,
}: ClaimSchoolModalProps) {
  const { user: authUser, signInWithEmailOtp, submitClaim } = useAuth();
  const currentUser = currentUserProp || authUser;

  // Form Fields
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [pincode, setPincode] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [note, setNote] = useState('');

  // Pincode fetching states
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [pincodeError, setPincodeError] = useState<string | null>(null);

  // OTP Login States (Requested: "email ke side mai ek button hoga login now, otp field, green text timer")
  const [showOtpField, setShowOtpField] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [otpTimer, setOtpTimer] = useState(119); // 1:59 countdown
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  // Submission States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successClaim, setSuccessClaim] = useState<any | null>(null);

  // Pre-fill user data if logged in
  useEffect(() => {
    if (currentUser) {
      if (currentUser.displayName && !name) setName(currentUser.displayName);
      if (currentUser.email && !email) setEmail(currentUser.email);
      if (currentUser.phone && !phone) setPhone(currentUser.phone);
      setIsOtpVerified(true);
    }
  }, [currentUser]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setSubmitError(null);
      setSuccessClaim(null);
      setShowOtpField(false);
      setIsOtpVerified(Boolean(currentUser));
      if (currentUser) {
        setName(currentUser.displayName || currentUser.user_metadata?.full_name || '');
        setEmail(currentUser.email || '');
        setPhone(currentUser.phone || currentUser.user_metadata?.phone || '');
      }
    }
  }, [isOpen, currentUser]);

  // Live Timer Countdown for OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    } else if (otpTimer === 0) {
      setIsTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, otpTimer]);

  // Format timer MM:SS
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // ─── PINCODE AUTO-FETCH STATE & DISTRICT ───
  useEffect(() => {
    const cleanPin = pincode.replace(/\D/g, '');
    if (cleanPin.length === 6) {
      setIsFetchingLocation(true);
      setPincodeError(null);

      // Fast fetch with Indian Postal PIN API
      fetch(`https://api.postalpincode.in/pincode/${cleanPin}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
            const po = data[0].PostOffice[0];
            setDistrict(po.District || '');
            setState(po.State || '');
          } else {
            // Local fallback dictionary for top school hubs
            const FALLBACK_PINS: Record<string, { d: string; s: string }> = {
              '110001': { d: 'Central Delhi', s: 'Delhi' },
              '110075': { d: 'South West Delhi', s: 'Delhi' },
              '122001': { d: 'Gurugram', s: 'Haryana' },
              '122002': { d: 'Gurugram', s: 'Haryana' },
              '201301': { d: 'Gautam Buddha Nagar', s: 'Uttar Pradesh' },
              '560001': { d: 'Bengaluru', s: 'Karnataka' },
              '400001': { d: 'Mumbai', s: 'Maharashtra' },
              '700001': { d: 'Kolkata', s: 'West Bengal' },
              '600001': { d: 'Chennai', s: 'Tamil Nadu' },
              '500001': { d: 'Hyderabad', s: 'Telangana' },
              '302001': { d: 'Jaipur', s: 'Rajasthan' },
              '380001': { d: 'Ahmedabad', s: 'Gujarat' },
            };
            if (FALLBACK_PINS[cleanPin]) {
              setDistrict(FALLBACK_PINS[cleanPin].d);
              setState(FALLBACK_PINS[cleanPin].s);
            } else {
              setPincodeError('Could not auto-detect location. Please enter District and State below manually.');
            }
          }
        })
        .catch(() => {
          setPincodeError('Could not auto-fetch location. Please enter District and State below manually.');
        })
        .finally(() => {
          setIsFetchingLocation(false);
        });
    } else {
      if (cleanPin.length === 0) {
        setPincodeError(null);
      }
    }
  }, [pincode]);

  if (!isOpen) return null;

  // ─── SEND OTP / LOGIN NOW ───
  const handleSendOtp = async () => {
    setOtpError(null);
    if (!email.trim() || !email.includes('@')) {
      setOtpError('Please enter a valid email address first.');
      return;
    }
    setIsSendingOtp(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to send OTP to email.');
      }
      setShowOtpField(true);
      setOtpTimer(119);
      setIsTimerActive(true);
    } catch (err: any) {
      setOtpError(err.message || 'Failed to send OTP. Please check your internet connection.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  // ─── VERIFY OTP & CREATE / SIGN-IN USER ───
  const handleVerifyOtp = async () => {
    setOtpError(null);
    const cleanOtp = otpInput.trim();
    if (!cleanOtp) {
      setOtpError('Please enter the OTP sent to your email.');
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), otp: cleanOtp }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid OTP code.');
      }

      await signInWithEmailOtp(email, name, phone);
      setIsOtpVerified(true);
      setShowOtpField(false);
      setIsTimerActive(false);
    } catch (err: any) {
      setOtpError(err.message || 'Invalid OTP code. Please try again.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // ─── SUBMIT CLAIM ───
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!name.trim()) {
      setSubmitError('Please enter your full name.');
      return;
    }
    if (!designation.trim()) {
      setSubmitError('Please enter your designation in the school (e.g. Principal, Director, Admin).');
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setSubmitError('Please enter a valid 10-digit WhatsApp mobile number (compulsory).');
      return;
    }
    if (!pincode.trim() || pincode.trim().length !== 6) {
      setSubmitError('Please enter a valid 6-digit postal PIN code.');
      return;
    }
    if (!district.trim()) {
      setSubmitError('Please enter your district.');
      return;
    }
    if (!state.trim()) {
      setSubmitError('Please enter your state.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setSubmitError('Please enter a valid email address.');
      return;
    }

    // Ensure user is signed in
    if (!currentUser && !isOtpVerified) {
      setSubmitError('Please click "Login Now" to verify your email via OTP before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      const claimResult = await submitClaim({
        schoolId: udiseCode || '35010104713',
        schoolName: schoolName || 'School',
        claimantName: name.trim(),
        claimantEmail: email.trim(),
        phone: phone.trim(),
        designation: designation.trim(),
        pincode: pincode.trim(),
        state: state.trim() || 'Delhi',
        district: district.trim() || 'New Delhi',
        note: note.trim() || 'Official school ownership and management claim request.',
      });

      setSuccessClaim(claimResult);
      onClaimSuccess?.(claimResult);
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit claim request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* ── HEADER ── */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-gray-900 leading-tight">
                Claim School Profile
              </h3>
              <p className="text-[11px] text-gray-500">
                Official School Administration & Management Verification
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── MODAL BODY ── */}
        <div className="p-5 overflow-y-auto custom-scrollbar space-y-4">
          
          {/* SUCCESS SCREEN */}
          {successClaim ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 size={32} />
              </div>

              <div>
                <h4 className="text-lg font-bold text-gray-900">
                  Claim Request Submitted!
                </h4>
                <p className="text-xs text-gray-600 mt-1 max-w-sm mx-auto leading-relaxed">
                  Your claim for <strong className="text-gray-900">{schoolName}</strong> (UDISE: {udiseCode}) has been received.
                </p>
              </div>

              {/* Status Box */}
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-left space-y-1.5 text-xs text-amber-900 max-w-sm mx-auto">
                <div className="flex items-center justify-between font-bold text-amber-950">
                  <span>Current Claim Status:</span>
                  <span className="px-2 py-0.5 rounded-md bg-amber-200/80 text-[11px]">
                    ⏳ Pending Admin Verification
                  </span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  CSEEL Admin will review your phone & email identity. Once approved, your profile menu will update from <strong>&quot;See Your Claim&quot;</strong> to <strong>&quot;Edit School Profile&quot;</strong>!
                </p>
              </div>

              <div className="pt-2 flex justify-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="py-2.5 px-6 rounded-xl bg-[#006FCC] hover:bg-[#005399] text-white text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  Done / Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              
              {/* ── 1. PRE-FILLED READ-ONLY SCHOOL IDENTITY (User cannot change this) ── */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/90 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                    <Lock size={11} className="text-slate-400" />
                    <span>Claiming School (Pre-filled &amp; Locked)</span>
                  </span>
                  <span className="text-[10px] font-semibold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded">
                    UDISE: {udiseCode || '35010104713'}
                  </span>
                </div>

                <div className="text-xs font-bold text-gray-900 truncate">
                  {schoolName || 'School Profile'}
                </div>
              </div>

              {/* ── 2. NAME & DESIGNATION FIELDS ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                    <User size={13} className="text-blue-600" />
                    <span>Full Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 text-xs bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                    <Building2 size={13} className="text-indigo-600" />
                    <span>Designation in School *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Principal / Director / Admin"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 text-xs bg-white"
                  />
                </div>
              </div>

              {/* ── 3. WHATSAPP MOBILE NUMBER (Compulsory) ── */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black">
                      W
                    </span>
                    <span className="text-emerald-950 font-bold">WhatsApp Mobile Number (Compulsory) *</span>
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Contact &amp; Verification
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-xs select-none">
                    +91
                  </div>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10-digit WhatsApp number (e.g. 9876543210)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-11 pr-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs bg-white font-medium"
                  />
                </div>
              </div>

              {/* ── 4. PINCODE & EDITABLE DISTRICT / STATE ── */}
              <div className="space-y-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <MapPin size={13} className="text-red-500" />
                      <span>PIN Code *</span>
                    </span>
                    {isFetchingLocation && (
                      <span className="text-[10px] text-blue-600 font-medium animate-pulse">
                        Auto-fetching District &amp; State...
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="e.g. 110001"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 text-xs bg-white"
                  />
                  {pincodeError && (
                    <p className="text-[11px] text-amber-600">{pincodeError}</p>
                  )}
                </div>

                {/* Editable District & State Inputs (Autofills from PIN, user can edit) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-0.5">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700 flex items-center justify-between">
                      <span>District *</span>
                      <span className="text-[10px] text-gray-400 font-normal">Autofills / Editable</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Central Delhi"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 text-xs bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700 flex items-center justify-between">
                      <span>State *</span>
                      <span className="text-[10px] text-gray-400 font-normal">Autofills / Editable</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Delhi"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 text-xs bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* ── 5. EMAIL FIELD WITH "LOGIN NOW" BUTTON & OTP VERIFICATION ── */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Mail size={13} className="text-blue-600" />
                    <span>Email Address *</span>
                  </span>
                  {isOtpVerified && (
                    <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                      <Check size={11} />
                      <span>Verified / Logged In</span>
                    </span>
                  )}
                </label>

                <div className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="e.g. principal@school.edu.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isOtpVerified}
                    className="flex-1 px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 text-xs bg-white disabled:bg-gray-50"
                  />

                  {/* "LOGIN NOW" BUTTON */}
                  {!isOtpVerified && (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={isSendingOtp}
                      className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#006FCC] border border-blue-200 text-xs font-bold transition active:scale-95 cursor-pointer whitespace-nowrap shrink-0 disabled:opacity-60"
                    >
                      {isSendingOtp ? 'Sending OTP...' : 'Login Now'}
                    </button>
                  )}
                </div>

                {/* OTP FIELD & GREEN TIMER TEXT (Requested by user) */}
                {showOtpField && !isOtpVerified && (
                  <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2 mt-2 animate-in fade-in">
                    {/* Green status text with live timer */}
                    <div className="text-[11px] font-bold text-emerald-700 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                        <span>OTP is sent to your mail ({email})</span>
                      </span>
                      <span className="text-emerald-800 font-mono">
                        Valid for {formatTimer(otpTimer)}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="Enter 6-digit OTP"
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-emerald-300 focus:outline-none focus:border-emerald-600 text-xs bg-white font-mono"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        disabled={isVerifyingOtp}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition active:scale-95 cursor-pointer shrink-0 disabled:opacity-60"
                      >
                        {isVerifyingOtp ? 'Verifying...' : 'Verify OTP'}
                      </button>
                    </div>

                    <p className="text-[10px] text-emerald-800/80">
                      Check your Gmail inbox or Spam folder for the 6-digit code.
                    </p>
                    {otpError && <p className="text-[11px] text-red-600 font-medium">{otpError}</p>}
                  </div>
                )}
              </div>

              {/* ── 6. NOTE / REQUIREMENTS TEXTBOX (Requested by user) ── */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                  <FileText size={13} className="text-gray-500" />
                  <span>Requirements &amp; Institutional Note</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Specify your requirements (e.g. want to update 2026 fee structure, board results, or contact number)..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 text-xs bg-white resize-none"
                />
              </div>

              {submitError && (
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* ── SUBMIT BUTTON ── */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#006FCC] hover:bg-[#005399] text-white text-xs font-bold transition shadow-md active:scale-98 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck size={15} />
                  <span>{isSubmitting ? 'Submitting Request...' : 'Submit Claim Request'}</span>
                </button>
              </div>

              <p className="text-[10.5px] text-center text-gray-400">
                CSEEL verifies all claims to prevent unauthorized profile alterations.
              </p>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
