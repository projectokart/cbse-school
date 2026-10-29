'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  Building2,
  MapPin,
  Sparkles,
  Menu,
  X,
  Phone,
  ShieldCheck,
  ChevronDown,
  ExternalLink,
  User,
  Clock,
  CheckCircle2,
  Edit3,
  LogOut,
  FileText
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ClaimStatusModal from '@/components/schools/ClaimStatusModal';

export default function SchoolHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const { user, signOut, activeClaim, hasVerifiedClaim } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const schoolSlug = activeClaim
    ? `${activeClaim.schoolId}-${(activeClaim.schoolName || 'school')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')}`
    : '';

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        {/* Top micro ribbon */}
        <div className="bg-slate-900 text-slate-300 text-[11px] font-medium py-1 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950">
                NEW
              </span>
              <span className="hidden sm:inline">
                33,219+ Verified CBSE, ICSE &amp; Private Schools Directory — 2026-27 Admissions Open
              </span>
              <span className="sm:hidden">33,219+ CBSE Schools Directory</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="https://www.cseel.org"
                target="_blank"
                className="hover:text-white transition flex items-center gap-1 text-[11px]"
              >
                <span>Main Portal (cseel.org)</span>
                <ExternalLink size={10} />
              </Link>
            </div>
          </div>
        </div>

        {/* Main navigation bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#005689] to-[#0077B6] flex items-center justify-center shadow-md shadow-blue-900/10 group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-slate-900 font-sans">
                  CSEEL
                </span>
                <span className="px-1.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-blue-100 text-[#005689]">
                  Schools
                </span>
              </div>
              <span className="text-[10px] font-semibold text-slate-500 tracking-wider uppercase">
                CBSE &amp; Private Schools Directory
              </span>
            </div>
          </Link>

          {/* Desktop Quick Nav Links */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-semibold text-slate-600">
            <Link
              href="/"
              className="px-3 py-1.5 rounded-lg hover:text-[#005689] hover:bg-slate-100 transition"
            >
              All Schools
            </Link>
            <Link
              href="/schools/delhi"
              className="px-3 py-1.5 rounded-lg hover:text-[#005689] hover:bg-slate-100 transition flex items-center gap-1"
            >
              <MapPin size={12} className="text-rose-500" />
              <span>Delhi NCR</span>
            </Link>
            <Link
              href="/schools/haryana/gurugram"
              className="px-3 py-1.5 rounded-lg hover:text-[#005689] hover:bg-slate-100 transition"
            >
              Gurugram
            </Link>
            <Link
              href="/schools/uttar-pradesh/noida"
              className="px-3 py-1.5 rounded-lg hover:text-[#005689] hover:bg-slate-100 transition"
            >
              Noida
            </Link>
            <Link
              href="/schools/karnataka/bangalore"
              className="px-3 py-1.5 rounded-lg hover:text-[#005689] hover:bg-slate-100 transition"
            >
              Bengaluru
            </Link>
          </nav>

          {/* Right CTA Actions & Profile Icon */}
          <div className="flex items-center gap-2">
            
            {/* Desktop Verified Only & Search CTA */}
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/schools/delhi"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 transition"
              >
                <ShieldCheck size={14} className="text-emerald-600" />
                <span>Verified Only</span>
              </Link>
              <Link
                href="/#schools-list"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#005689] hover:bg-[#00436B] shadow-sm hover:shadow-md transition active:scale-95"
              >
                <Search size={14} />
                <span>Search 33k+</span>
              </Link>
            </div>

            {/* ── PROFILE ICON & USER DROPDOWN (Requested by user) ── */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className={`flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border transition cursor-pointer ${
                  activeClaim
                    ? activeClaim.status === 'verified'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-amber-50 border-amber-200 text-amber-800'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
                title="Profile & School Claims"
                aria-label="User Profile & Claims"
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                  user ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  <User size={15} />
                </div>

                <div className="hidden sm:flex flex-col text-left leading-none">
                  <span className="text-[11px] font-bold truncate max-w-[100px]">
                    {user?.displayName || user?.email?.split('@')[0] || 'My Profile'}
                  </span>
                  <span className="text-[9px] text-gray-500 mt-0.5">
                    {activeClaim
                      ? activeClaim.status === 'verified'
                        ? 'Verified Owner'
                        : 'Claim Pending'
                      : 'Institutional'}
                  </span>
                </div>

                <ChevronDown size={13} className="text-gray-400 hidden sm:block" />

                {/* Pulse dot if pending or verified */}
                {activeClaim && (
                  <span className={`w-2 h-2 rounded-full absolute -top-0.5 -right-0.5 animate-pulse ${
                    activeClaim.status === 'verified' ? 'bg-emerald-500' : 'bg-amber-500'
                  }`} />
                )}
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-200 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                  
                  {/* User Info Header */}
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-gray-100 mb-1.5">
                    <span className="text-[10px] text-gray-500 uppercase font-semibold block">
                      Signed In As
                    </span>
                    <div className="font-bold text-xs text-gray-900 truncate mt-0.5">
                      {user?.displayName || 'Educator / School Admin'}
                    </div>
                    <div className="text-[11px] text-gray-500 truncate">
                      {user?.email || 'Not verified'}
                    </div>
                  </div>

                  <div className="divide-y divide-gray-100 text-xs">
                    {/* ── CASE 1: CLAIM VERIFIED -> SHOW "EDIT SCHOOL PROFILE" (Requested by user) ── */}
                    {activeClaim && activeClaim.status === 'verified' && (
                      <div className="py-1">
                        <Link
                          href={`/schools/${schoolSlug}?edit=true`}
                          onClick={() => setProfileDropdownOpen(false)}
                          className="w-full flex items-center justify-between p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold transition group cursor-pointer"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <Edit3 size={15} className="text-emerald-600 shrink-0" />
                            <div className="truncate">
                              <span className="block text-xs font-bold truncate">
                                Edit School Profile
                              </span>
                              <span className="text-[10px] text-emerald-700 block truncate">
                                {activeClaim.schoolName}
                              </span>
                            </div>
                          </div>
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-200 text-emerald-900 font-extrabold shrink-0">
                            VERIFIED
                          </span>
                        </Link>
                      </div>
                    )}

                    {/* ── CASE 2: CLAIM PENDING -> SHOW "SEE YOUR CLAIM" (Requested by user) ── */}
                    {activeClaim && activeClaim.status === 'pending' && (
                      <div className="py-1">
                        <button
                          type="button"
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            setIsStatusModalOpen(true);
                          }}
                          className="w-full flex items-center justify-between p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold transition group cursor-pointer text-left"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <Clock size={15} className="text-amber-600 shrink-0" />
                            <div className="truncate">
                              <span className="block text-xs font-bold">
                                See Your Claim
                              </span>
                              <span className="text-[10px] text-amber-700 block truncate">
                                {activeClaim.schoolName}
                              </span>
                            </div>
                          </div>
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-200 text-amber-950 font-extrabold shrink-0">
                            PENDING
                          </span>
                        </button>
                      </div>
                    )}

                    {/* CASE 3: NO CLAIM YET */}
                    {!activeClaim && (
                      <div className="py-1">
                        <div className="p-2 text-[11px] text-gray-500 leading-snug">
                          Search any school and click <strong>&quot;Claim&quot;</strong> to manage official fees, faculty, and board results.
                        </div>
                      </div>
                    )}

                    {/* Sign out */}
                    {user && (
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            signOut();
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2 p-2 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-red-600 transition cursor-pointer text-left"
                        >
                          <LogOut size={14} />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              )}
            </div>

            {/* Mobile menu hamburger */}
            <div className="flex sm:hidden items-center">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2 shadow-lg animate-in slide-in-from-top-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              All Schools Directory
            </Link>
            <Link
              href="/schools/delhi"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Delhi Schools
            </Link>
            <Link
              href="/schools/haryana/gurugram"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Gurugram Schools
            </Link>
            <Link
              href="/schools/uttar-pradesh/noida"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Noida Schools
            </Link>

            {/* Mobile Profile & Claim Status */}
            {activeClaim && (
              <div className="pt-2 border-t border-slate-100">
                {activeClaim.status === 'verified' ? (
                  <Link
                    href={`/schools/${schoolSlug}?edit=true`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 text-emerald-900 font-bold text-xs"
                  >
                    <span>✏️ Edit School Profile ({activeClaim.schoolName.slice(0, 15)}...)</span>
                    <span className="text-[10px] bg-emerald-200 px-2 py-0.5 rounded">VERIFIED</span>
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsStatusModalOpen(true);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-amber-50 text-amber-900 font-bold text-xs text-left"
                  >
                    <span>⏳ See Your Claim ({activeClaim.schoolName.slice(0, 15)}...)</span>
                    <span className="text-[10px] bg-amber-200 px-2 py-0.5 rounded">PENDING</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </header>

      {/* ── CLAIM STATUS MODAL ── */}
      <ClaimStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        claim={activeClaim}
      />
    </>
  );
}
