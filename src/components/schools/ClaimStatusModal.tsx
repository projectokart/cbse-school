'use client';

import React from 'react';
import Link from 'next/link';
import {
  X,
  ShieldCheck,
  Building2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  Edit3,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { SchoolClaimRecord, useAuth } from '@/contexts/AuthContext';

interface ClaimStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  claim: SchoolClaimRecord | null;
  onEditSchool?: (schoolId: string) => void;
}

export default function ClaimStatusModal({
  isOpen,
  onClose,
  claim,
  onEditSchool,
}: ClaimStatusModalProps) {
  const { verifyClaimByAdmin } = useAuth();

  if (!isOpen || !claim) return null;

  const isVerified = claim.status === 'verified';
  const schoolSlug = `${claim.schoolId}-${(claim.schoolName || 'school').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;

  const handleAdminVerify = async () => {
    await verifyClaimByAdmin(claim.id);
  };

  return (
    <div className="fixed inset-0 z-[99999] overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${
              isVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
            }`}>
              {isVerified ? <CheckCircle2 size={18} /> : <Clock size={18} />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 leading-tight">
                {isVerified ? 'School Profile Verified' : 'Claim Verification Status'}
              </h3>
              <p className="text-[11px] text-gray-500">
                Official Institutional Claim Record
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

        {/* Body */}
        <div className="p-5 space-y-4 text-xs">
          
          {/* Status Badge Strip */}
          <div className={`p-3 rounded-xl border flex items-center justify-between ${
            isVerified
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            <div>
              <span className="text-[10px] text-gray-500 block uppercase tracking-wider font-semibold">
                Status
              </span>
              <span className="text-xs font-black block mt-0.5">
                {isVerified ? '✅ VERIFIED & APPROVED' : '⏳ PENDING ADMIN VERIFICATION'}
              </span>
            </div>

            <span className={`px-2.5 py-1 rounded-full text-[10.5px] font-bold ${
              isVerified ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-200 text-amber-950'
            }`}>
              {isVerified ? 'Verified Owner' : 'Under Review'}
            </span>
          </div>

          {/* School Details */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-gray-200/80 space-y-2">
            <div>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider block font-semibold">
                Claimed School
              </span>
              <span className="text-sm font-bold text-gray-900 block mt-0.5">
                {claim.schoolName}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-gray-200/60 text-[11px]">
              <div>
                <span className="text-gray-500 block">UDISE Code</span>
                <span className="font-semibold text-gray-900 font-mono">{claim.schoolId}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Submitted On</span>
                <span className="font-semibold text-gray-900">
                  {new Date(claim.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>

          {/* Claimant Profile Details */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-gray-200/80 space-y-2">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider block font-semibold">
              Applicant Details
            </span>

            <div className="space-y-1.5 text-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Full Name:</span>
                <span className="font-semibold text-gray-900">{claim.claimantName}</span>
              </div>
              {claim.designation && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Designation:</span>
                  <span className="font-semibold text-gray-900">{claim.designation}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Email:</span>
                <span className="font-semibold text-gray-900">{claim.claimantEmail}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">WhatsApp Phone:</span>
                <span className="font-semibold text-gray-900 font-mono">{claim.phone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Location:</span>
                <span className="font-semibold text-gray-900">
                  {claim.district}, {claim.state} ({claim.pincode})
                </span>
              </div>
            </div>

            {claim.note && (
              <div className="pt-2 border-t border-gray-200/60">
                <span className="text-gray-500 block text-[10px]">Requirements / Note:</span>
                <p className="text-gray-800 italic mt-0.5 leading-relaxed">&ldquo;{claim.note}&rdquo;</p>
              </div>
            )}
          </div>

          {/* Action Area */}
          <div className="space-y-2 pt-1">
            {isVerified ? (
              <Link
                href={`/schools/${schoolSlug}?edit=true`}
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-2 shadow-xs transition active:scale-98"
              >
                <Edit3 size={15} />
                <span>Edit School Profile</span>
              </Link>
            ) : (
              <div className="space-y-2">
                <p className="text-[11px] text-gray-500 leading-relaxed text-center">
                  Once verified by administrator, you can change fees, contacts, board results, and facilities directly.
                </p>

                {/* ADMIN DEMO SIMULATION BUTTON (Allows instant testing) */}
                <button
                  type="button"
                  onClick={handleAdminVerify}
                  className="w-full py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold flex items-center justify-center gap-1.5 transition active:scale-98 cursor-pointer"
                >
                  <Sparkles size={14} />
                  <span>Admin Demo: Approve &amp; Verify Claim Now</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
