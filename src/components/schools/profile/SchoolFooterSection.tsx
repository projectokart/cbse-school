'use client';

import React from 'react';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Youtube,
  Linkedin
} from 'lucide-react';
import EditableText from '@/components/schools/template/EditableText';
import VerifiedBadge from '@/components/schools/template/VerifiedBadge';

export interface SchoolFooterSectionProps {
  displayName: string;
  actualSchoolLogo?: string;
  templateData: any;
  displayAddress: string;
  displayPhone: string;
  displayEmail: string;
  onTabSwitch: (tab: any) => void;
}

export default function SchoolFooterSection({
  displayName,
  actualSchoolLogo,
  templateData,
  displayAddress,
  displayPhone,
  displayEmail,
  onTabSwitch,
}: SchoolFooterSectionProps) {
  return (
    <footer id="contact" className="relative bg-[#001C33] text-white pt-20 pb-10 overflow-hidden border-t border-[#002F56]">
      {/* Curved Top Wave Divider matching page background */}
      <div className="absolute top-0 left-0 right-0 h-10 overflow-hidden leading-none pointer-events-none">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full text-white fill-current">
          <path d="M0,0 C300,90 600,0 900,60 C1050,90 1150,40 1200,0 L1200,0 L0,0 Z"></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-16 border-b border-blue-900/50">
          
          {/* Col 1: School Brand & Tagline */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-blue-800 bg-white shadow-xs flex items-center justify-center shrink-0">
                {actualSchoolLogo ? (
                  <img
                    src={actualSchoolLogo}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#005689] to-[#0D4979] text-white font-black text-sm flex items-center justify-center">
                    {displayName ? displayName.charAt(0).toUpperCase() : 'S'}
                  </div>
                )}
              </div>

              <div>
                <div className="text-xl font-black font-serif tracking-tight leading-none">
                  {displayName}
                </div>
                <div className="text-[10px] font-semibold tracking-wider uppercase text-blue-300 mt-1">
                  <EditableText
                    contentKey="footer_school_subtitle"
                    value="Public School"
                    className="inline-block"
                  />
                </div>
              </div>
            </div>

            <p className="text-xs text-blue-200/80">
              <EditableText
                contentKey="footer_tagline"
                value="Rooted in Values • Ready for Tomorrow"
                className="inline-block"
              />
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2 pt-2">
              {[
                { icon: Facebook, name: 'Facebook', url: templateData?.socialLinks?.facebook || (templateData as any)?.social_links?.facebook },
                { icon: Instagram, name: 'Instagram', url: templateData?.socialLinks?.instagram || (templateData as any)?.social_links?.instagram },
                { icon: Youtube, name: 'YouTube', url: templateData?.socialLinks?.youtube || (templateData as any)?.social_links?.youtube },
                { icon: Linkedin, name: 'LinkedIn', url: templateData?.socialLinks?.linkedin || (templateData as any)?.social_links?.linkedin },
              ].map((item, idx) => (
                item.url ? (
                  <a
                    key={idx}
                    href={item.url.startsWith('http') ? item.url : `https://${item.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${item.name} Official Page`}
                    title={`${item.name} Official Page`}
                    className="w-9 h-9 rounded-[10px] bg-blue-900/60 hover:bg-blue-600 flex items-center justify-center text-blue-200 hover:text-white border border-blue-700/60 transition shadow-sm cursor-pointer"
                  >
                    <item.icon className="w-4 h-4" />
                  </a>
                ) : (
                  <span
                    key={idx}
                    aria-label={`${item.name} (Not Configured)`}
                    title={`${item.name} handle not linked`}
                    className="w-9 h-9 rounded-[10px] bg-blue-950/60 flex items-center justify-center text-blue-300/40 border border-blue-900/40 opacity-40 cursor-not-allowed select-none pointer-events-none"
                  >
                    <item.icon className="w-4 h-4" />
                  </span>
                )
              ))}
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold tracking-wider uppercase text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-xs text-blue-200/80">
              <li><button type="button" onClick={() => onTabSwitch('home')} className="hover:text-white transition-colors text-left cursor-pointer">Home</button></li>
              <li><button type="button" onClick={() => onTabSwitch('about')} className="hover:text-white transition-colors text-left cursor-pointer">About Us</button></li>
              <li><button type="button" onClick={() => onTabSwitch('facilities')} className="hover:text-white transition-colors text-left cursor-pointer">Facilities</button></li>
              <li><button type="button" onClick={() => onTabSwitch('admissions')} className="hover:text-white transition-colors text-left cursor-pointer">Admissions & Fees</button></li>
              <li><button type="button" onClick={() => onTabSwitch('reviews')} className="hover:text-white transition-colors text-left cursor-pointer">Reviews & Ratings</button></li>
              <li><button type="button" onClick={() => onTabSwitch('contact')} className="hover:text-white transition-colors text-left cursor-pointer">Contact Us</button></li>
            </ul>
          </div>

          {/* Col 3: Focus Areas */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold tracking-wider uppercase text-white mb-4">Focus Areas</h4>
            <ul className="space-y-2 text-xs text-blue-200/80">
              <li><button type="button" onClick={() => onTabSwitch('facilities')} className="hover:text-white transition-colors text-left cursor-pointer">Modern Labs & Tech</button></li>
              <li><button type="button" onClick={() => onTabSwitch('academics')} className="hover:text-white transition-colors text-left cursor-pointer">Academic Curriculum</button></li>
              <li><button type="button" onClick={() => onTabSwitch('facilities')} className="hover:text-white transition-colors text-left cursor-pointer">Sports & Athletics</button></li>
              <li><button type="button" onClick={() => onTabSwitch('gallery')} className="hover:text-white transition-colors text-left cursor-pointer">Arts & Co-Curricular</button></li>
              <li><button type="button" onClick={() => onTabSwitch('admissions')} className="hover:text-white transition-colors text-left cursor-pointer">Admissions Process</button></li>
            </ul>
          </div>

          {/* Col 4: Contact Info */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold tracking-wider uppercase text-white mb-4">Contact</h4>
            
            <div className="flex items-start gap-2 text-xs text-blue-200/80">
              <MapPin className="w-3.5 h-3.5 text-[#38BDF8] shrink-0 mt-0.5" />
              <span className="flex items-center gap-1.5 flex-wrap">
                <span>{displayAddress}</span>
                <VerifiedBadge fieldKey="address" size="sm" />
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-blue-200/80">
              <Phone className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
              <span className="flex items-center gap-1.5 flex-wrap">
                <span>{displayPhone}</span>
                <VerifiedBadge fieldKey="phone" size="sm" />
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-blue-200/80">
              <Mail className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
              <span className="flex items-center gap-1.5 flex-wrap truncate">
                <span className="truncate">{displayEmail}</span>
                <VerifiedBadge fieldKey="email" size="sm" />
              </span>
            </div>
          </div>

          {/* Col 5: Newsletter */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold tracking-wider uppercase text-white mb-2">Newsletter</h4>
            <p className="text-xs text-blue-200/80 leading-relaxed">
              Stay updated with our latest news, events and activities.
            </p>

            <form onSubmit={(e) => { e.preventDefault(); alert('Thank you for subscribing!'); }} className="flex flex-col sm:flex-row gap-2 pt-1">
              <input
                type="email"
                placeholder="Your email address"
                required
                className="bg-white text-gray-900 px-3.5 py-2.5 rounded-[12px] text-xs focus:outline-none focus:ring-2 focus:ring-[#006FCC] flex-1"
              />
              <button
                type="submit"
                className="button_primary inline-flex items-center justify-center bg-[#006FCC] hover:bg-[#005499] text-white font-bold px-5 py-2.5 rounded-[12px] text-xs shadow-[0_4px_14px_rgba(0,111,204,0.35)] hover:shadow-[0_6px_22px_rgba(0,111,204,0.45)] transition-all cursor-pointer shrink-0"
              >
                Subscribe
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Copyright & Legal Links */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-blue-300/70 gap-4">
          <div>
            © 2026 {displayName}. All Rights Reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <span>•</span>
            <span className="text-blue-300/40 select-none cursor-not-allowed">Sitemap</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
