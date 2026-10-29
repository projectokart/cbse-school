'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';

export default function SchoolHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top micro ribbon */}
      <div className="bg-slate-900 text-slate-300 text-[11px] font-medium py-1 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950">
              NEW
            </span>
            <span className="hidden sm:inline">
              33,219+ Verified CBSE, ICSE & Private Schools Directory — 2026-27 Admissions Open
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
              CBSE & Private Schools Directory
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

        {/* Right CTA Actions */}
        <div className="hidden sm:flex items-center gap-2.5">
          <Link
            href="/schools/delhi"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 transition"
          >
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>Verified Only</span>
          </Link>
          <Link
            href="/#schools-list"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#005689] hover:bg-[#00436B] shadow-sm hover:shadow-md transition active:scale-95"
          >
            <Search size={14} />
            <span>Search 33k+ Schools</span>
          </Link>
        </div>

        {/* Mobile menu hamburger */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
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
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="https://www.cseel.org"
              target="_blank"
              className="text-xs text-center font-medium text-slate-500 py-1"
            >
              CSEEL National Platform
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
