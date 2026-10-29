'use client';

import React from 'react';
import Link from 'next/link';
import { Building2, ShieldCheck, Heart, ExternalLink, MapPin } from 'lucide-react';

export default function SchoolFooter() {
  return (
    <footer className="w-full bg-slate-900 text-slate-400 border-t border-slate-800 text-xs">
      {/* Top quick links grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        {/* Col 1: About */}
        <div className="col-span-2 md:col-span-1 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#005689] flex items-center justify-center text-white font-bold">
              <Building2 size={18} />
            </div>
            <span className="text-base font-black text-white">CSEEL Schools</span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            India's most comprehensive verified CBSE, ICSE, and private school exploration portal. Search 33,219+ schools across 28 states and 8 union territories.
          </p>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
            <ShieldCheck size={14} />
            <span>UDISE+ & Ministry of Education Integrated</span>
          </div>
        </div>

        {/* Col 2: Top States */}
        <div>
          <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Top States</h4>
          <ul className="space-y-1.5 text-xs">
            <li><Link href="/schools/delhi" className="hover:text-white transition">Delhi (2,226 schools)</Link></li>
            <li><Link href="/schools/haryana" className="hover:text-white transition">Haryana (2,623 schools)</Link></li>
            <li><Link href="/schools/uttar-pradesh" className="hover:text-white transition">Uttar Pradesh (5,062 schools)</Link></li>
            <li><Link href="/schools/karnataka" className="hover:text-white transition">Karnataka (1,848 schools)</Link></li>
            <li><Link href="/schools/maharashtra" className="hover:text-white transition">Maharashtra (1,763 schools)</Link></li>
            <li><Link href="/schools/tamilnadu" className="hover:text-white transition">Tamil Nadu (1,822 schools)</Link></li>
          </ul>
        </div>

        {/* Col 3: Popular Cities */}
        <div>
          <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Popular Hubs</h4>
          <ul className="space-y-1.5 text-xs">
            <li><Link href="/schools/haryana/gurugram" className="hover:text-white transition">Gurugram</Link></li>
            <li><Link href="/schools/uttar-pradesh/noida" className="hover:text-white transition">Noida & Greater Noida</Link></li>
            <li><Link href="/schools/karnataka/bangalore" className="hover:text-white transition">Bengaluru</Link></li>
            <li><Link href="/schools/delhi/south-delhi" className="hover:text-white transition">South Delhi</Link></li>
            <li><Link href="/schools/punjab/chandigarh" className="hover:text-white transition">Chandigarh</Link></li>
            <li><Link href="/schools/rajasthan/jaipur" className="hover:text-white transition">Jaipur</Link></li>
          </ul>
        </div>

        {/* Col 4: Platform & Support */}
        <div>
          <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Network</h4>
          <ul className="space-y-1.5 text-xs">
            <li>
              <Link href="https://www.cseel.org" target="_blank" className="hover:text-white transition flex items-center gap-1">
                <span>CSEEL National Portal</span>
                <ExternalLink size={10} />
              </Link>
            </li>
            <li>
              <Link href="https://resumes.cseel.org" target="_blank" className="hover:text-white transition flex items-center gap-1">
                <span>Faculty & Teacher Jobs</span>
                <ExternalLink size={10} />
              </Link>
            </li>
            <li><Link href="/#schools-list" className="hover:text-white transition">Admission Enquiries</Link></li>
            <li><Link href="/#schools-list" className="hover:text-white transition">School Verification</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800 bg-slate-950/60 py-4 px-4 sm:px-6 text-[11px] text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} CSEEL — Center for Scientific Exploration & Experiential Learning. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <span>Powered by UDISE+ Official Dataset</span>
            <span>•</span>
            <span className="text-slate-400">CBSE Affiliated Institutions</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
