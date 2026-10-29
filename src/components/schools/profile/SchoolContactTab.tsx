'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  CheckCircle2,
  Building2,
  GraduationCap,
  UserCheck,
  Briefcase,
  MapPin,
  Clock,
  Globe,
  ExternalLink,
  Send,
  ArrowRight,
  Navigation,
  Layers,
  Crosshair,
  Maximize2,
  Check,
  Copy,
  Lock,
  Phone,
  Mail
} from 'lucide-react';
import EditableText from '@/components/schools/template/EditableText';

export interface SchoolContactTabProps {
  displayName: string;
  displayAddress: string;
  displayWebsiteUrl?: string;
  isLiveTemplate: boolean;
  isEditMode: boolean;
  templateData: any;
  displayGeneralPhone: string;
  displayGeneralEmail: string;
  displayAdmissionsPhone: string;
  displayAdmissionsEmail: string;
  displayPrincipalPhone: string;
  displayPrincipalEmail: string;
  displayCareersPhone: string;
  displayCareersEmail: string;
  lat: number;
  lng: number;
}

export default function SchoolContactTab({
  displayName,
  displayAddress,
  displayWebsiteUrl,
  isLiveTemplate,
  isEditMode,
  templateData,
  displayGeneralPhone,
  displayGeneralEmail,
  displayAdmissionsPhone,
  displayAdmissionsEmail,
  displayPrincipalPhone,
  displayPrincipalEmail,
  displayCareersPhone,
  displayCareersEmail,
  lat,
  lng,
}: SchoolContactTabProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [mapMode, setMapMode] = useState<'osm' | 'satellite' | 'google'>('osm');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  const [isAddressCopied, setIsAddressCopied] = useState(false);

  const mapLat = (typeof lat === 'number' && !isNaN(lat) && lat !== 0) ? lat : 28.3182;
  const mapLng = (typeof lng === 'number' && !isNaN(lng) && lng !== 0) ? lng : 76.6191;

  // Leaflet map initialization
  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;
    if (mapMode === 'google') return;

    let isMounted = true;

    import('leaflet').then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      try {
        const map = L.map(mapContainerRef.current, {
          center: [mapLat, mapLng],
          zoom: 15,
          zoomControl: false,
          scrollWheelZoom: false,
        });

        L.control.zoom({ position: 'bottomright' }).addTo(map);

        const tileUrl =
          mapMode === 'satellite'
            ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
            : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

        const attribution =
          mapMode === 'satellite' ? '&copy; Esri, Maxar, Earthstar' : '&copy; OpenStreetMap contributors';

        L.tileLayer(tileUrl, { attribution, maxZoom: 19 }).addTo(map);

        const customIcon = L.divIcon({
          className: 'custom-school-marker',
          html: `
            <div style="background-color: #006FCC; color: white; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,111,204,0.4); border: 3px solid white;">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            </div>
          `,
          iconSize: [36, 36],
          iconAnchor: [18, 36],
          popupAnchor: [0, -36],
        });

        const marker = L.marker([mapLat, mapLng], { icon: customIcon }).addTo(map);
        marker.bindPopup(`<b>${displayName}</b><br/>${displayAddress}`);

        mapInstanceRef.current = map;
        setMapLoaded(true);
      } catch (err) {
        console.error('Error initializing map:', err);
      }
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapLat, mapLng, mapMode, displayName, displayAddress]);

  return (
    <section id="contact-info" className="py-12 sm:py-16 bg-[#F8FAFC] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#005689] mb-2">
            <span className="w-6 h-1 bg-[#FBBC04] rounded-full inline-block" />
            <EditableText
              contentKey="contact_eyebrow"
              value="GET IN TOUCH"
              className="inline-block"
            />
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">
            <EditableText
              contentKey="contact_heading"
              value="Contact & Campus Location"
              className="inline"
            />
          </h2>

          <EditableText
            contentKey="contact_subheading"
            value="Have questions regarding admissions, academics, or campus visits? Reach out to us directly or drop a message below."
            className="text-sm text-gray-600 mt-2 block"
          />
        </div>

        {/* Standard 2-Column Professional Contact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Contact Desks & Send Message Form */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#006FCC] inline-block animate-pulse" />
                  <h3 className="text-base font-bold text-gray-950">Official Contact Desks</h3>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  UDISE Verified
                </span>
              </div>

              {/* 4 Dedicated Contact Channels in 2x2 High-Density Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Channel 1: General & Admin Desk */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 text-[#006FCC] flex items-center justify-center shrink-0">
                      <Building2 className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-gray-900 leading-tight">General & Admin Desk</span>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    {isLiveTemplate && isEditMode ? (
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-gray-500 uppercase">Phone</label>
                        <EditableText fieldKey="generalPhone" value={templateData?.generalPhone || templateData?.phone || ''} placeholder="General phone" className="text-xs text-gray-900" />
                        <label className="text-[10px] font-semibold text-gray-500 uppercase">Email</label>
                        <EditableText fieldKey="generalEmail" value={templateData?.generalEmail || templateData?.email || ''} placeholder="General email" className="text-xs text-gray-900" />
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-gray-400 shrink-0" />
                          {displayGeneralPhone ? (
                            <a href={`tel:${displayGeneralPhone}`} className="text-[#006FCC] font-medium hover:underline truncate">{displayGeneralPhone}</a>
                          ) : (
                            <span className="text-gray-400 opacity-60 cursor-not-allowed select-none">Not listed</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3 h-3 text-gray-400 shrink-0" />
                          {displayGeneralEmail ? (
                            <a href={`mailto:${displayGeneralEmail}`} className="text-gray-700 hover:text-[#006FCC] font-medium hover:underline truncate" title={displayGeneralEmail}>{displayGeneralEmail}</a>
                          ) : (
                            <span className="text-gray-400 opacity-60 cursor-not-allowed select-none">Not listed</span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Channel 2: Admissions Office */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <GraduationCap className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-gray-900 leading-tight">Admissions Desk</span>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    {isLiveTemplate && isEditMode ? (
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-gray-500 uppercase">Phone</label>
                        <EditableText fieldKey="admissionsPhone" value={templateData?.admissionsPhone || ''} placeholder="Admissions phone" className="text-xs text-gray-900" />
                        <label className="text-[10px] font-semibold text-gray-500 uppercase">Email</label>
                        <EditableText fieldKey="admissionsEmail" value={templateData?.admissionsEmail || ''} placeholder="Admissions email" className="text-xs text-gray-900" />
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-gray-400 shrink-0" />
                          {displayAdmissionsPhone ? (
                            <a href={`tel:${displayAdmissionsPhone}`} className="text-emerald-700 font-medium hover:underline truncate">{displayAdmissionsPhone}</a>
                          ) : (
                            <span className="text-gray-400 opacity-60 cursor-not-allowed select-none">Not listed</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3 h-3 text-gray-400 shrink-0" />
                          {displayAdmissionsEmail ? (
                            <a href={`mailto:${displayAdmissionsEmail}`} className="text-gray-700 hover:text-emerald-700 font-medium hover:underline truncate" title={displayAdmissionsEmail}>{displayAdmissionsEmail}</a>
                          ) : (
                            <span className="text-gray-400 opacity-60 cursor-not-allowed select-none">Not listed</span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Channel 3: Principal's Office */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-purple-300 transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                      <UserCheck className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-gray-900 leading-tight">Principal Desk</span>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    {isLiveTemplate && isEditMode ? (
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-gray-500 uppercase">Phone</label>
                        <EditableText fieldKey="principalPhone" value={templateData?.principalPhone || ''} placeholder="Principal phone" className="text-xs text-gray-900" />
                        <label className="text-[10px] font-semibold text-gray-500 uppercase">Email</label>
                        <EditableText fieldKey="principalEmail" value={templateData?.principalEmail || ''} placeholder="Principal email" className="text-xs text-gray-900" />
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-gray-400 shrink-0" />
                          {displayPrincipalPhone ? (
                            <a href={`tel:${displayPrincipalPhone}`} className="text-purple-700 font-medium hover:underline truncate">{displayPrincipalPhone}</a>
                          ) : (
                            <span className="text-gray-400 opacity-60 cursor-not-allowed select-none">Not listed</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3 h-3 text-gray-400 shrink-0" />
                          {displayPrincipalEmail ? (
                            <a href={`mailto:${displayPrincipalEmail}`} className="text-gray-700 hover:text-purple-700 font-medium hover:underline truncate" title={displayPrincipalEmail}>{displayPrincipalEmail}</a>
                          ) : (
                            <span className="text-gray-400 opacity-60 cursor-not-allowed select-none">Not listed</span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Channel 4: Careers & HR Desk */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-amber-300 transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                      <Briefcase className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-gray-900 leading-tight">Careers & HR</span>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    {isLiveTemplate && isEditMode ? (
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-gray-500 uppercase">Phone</label>
                        <EditableText fieldKey="careersPhone" value={templateData?.careersPhone || ''} placeholder="Careers phone" className="text-xs text-gray-900" />
                        <label className="text-[10px] font-semibold text-gray-500 uppercase">Email</label>
                        <EditableText fieldKey="careersEmail" value={templateData?.careersEmail || ''} placeholder="Careers email" className="text-xs text-gray-900" />
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-gray-400 shrink-0" />
                          {displayCareersPhone ? (
                            <a href={`tel:${displayCareersPhone}`} className="text-amber-800 font-medium hover:underline truncate">{displayCareersPhone}</a>
                          ) : (
                            <span className="text-gray-400 opacity-60 cursor-not-allowed select-none">Not listed</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3 h-3 text-gray-400 shrink-0" />
                          {displayCareersEmail ? (
                            <a href={`mailto:${displayCareersEmail}`} className="text-gray-700 hover:text-amber-800 font-medium hover:underline truncate" title={displayCareersEmail}>{displayCareersEmail}</a>
                          ) : (
                            <span className="text-gray-400 opacity-60 cursor-not-allowed select-none">Not listed</span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Campus Address & Website Summary Strip */}
              <div className="pt-3 border-t border-gray-100 space-y-2.5">
                <div className="flex items-start gap-2.5 text-xs text-gray-700">
                  <MapPin className="w-4 h-4 text-[#006FCC] shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-gray-900">Campus Address</span>
                      {isLiveTemplate && isEditMode && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-300 select-none">
                          <Lock className="w-2.5 h-2.5 text-amber-700" /> UDISE Locked
                        </span>
                      )}
                    </div>
                    <div className="text-gray-600 mt-0.5 leading-relaxed">{displayAddress}</div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs">
                  <div className="flex items-center gap-1.5 text-gray-500 text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span>Mon – Sat: 8:00 AM – 3:30 PM (Sun Closed)</span>
                  </div>

                  {displayWebsiteUrl && displayWebsiteUrl !== '#' && displayWebsiteUrl !== '' ? (
                    <a
                      href={displayWebsiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#EDF5FA] hover:bg-[#006FCC] text-[#006FCC] hover:text-white font-semibold text-xs border border-blue-200 transition-colors"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Visit Website</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-400 font-semibold text-xs border border-slate-200 cursor-not-allowed opacity-40 select-none pointer-events-none"
                      title="Website not listed"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>No Website Listed</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Inquiry Form */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200/90 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-gray-950 flex items-center gap-2">
                  <Send className="w-4 h-4 text-[#006FCC]" />
                  <span>Quick Direct Inquiry</span>
                </h3>
                <span className="text-[11px] text-gray-400">Response within 24h</span>
              </div>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  alert('Thank you! Your inquiry has been dispatched to the relevant school desk.');
                }}
                className="space-y-3"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Full Name *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Parent / Student Name"
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#006FCC] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Contact Phone *</label>
                    <input 
                      type="tel" 
                      required 
                      placeholder="+91 Mobile number"
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#006FCC] focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="parent@example.com"
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#006FCC] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Select Inquiry Desk *</label>
                    <select className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#006FCC] focus:border-transparent bg-white text-gray-800">
                      <option value="admissions">Admissions & New Enrollment</option>
                      <option value="general">General & Administration</option>
                      <option value="principal">Principal's Office Desk</option>
                      <option value="careers">Careers & Faculty Recruitment</option>
                      <option value="fees">Fee Structure & Transport Desk</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Inquiry Details *</label>
                  <textarea 
                    required 
                    rows={3}
                    placeholder="Type your message or questions here..."
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#006FCC] focus:border-transparent resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="button_primary w-full bg-[#006FCC] hover:bg-[#005499] text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Send Message to Selected Desk</span>
                  
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Interactive Live Campus Map */}
          <div className={`lg:col-span-6 transition-all ${isMapFullscreen ? 'fixed inset-4 z-[99999] bg-white rounded-3xl p-6 shadow-2xl flex flex-col' : ''}`}>
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-200/90 overflow-hidden relative flex flex-col h-full">
              {/* Map Header Strip */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-gray-950 text-sm sm:text-base leading-tight">{displayName} Campus</h4>
                      <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Verified GPS
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5 truncate max-w-xs sm:max-w-md">{displayAddress}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${mapLat},${mapLng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="button_primary inline-flex items-center gap-1.5 bg-[#006FCC] hover:bg-[#005499] text-white text-xs font-bold px-3.5 py-2 rounded-[10px] shadow-[0_4px_14px_rgba(0,111,204,0.35)] transition-transform active:scale-95 cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Directions</span>
                  </a>
                </div>
              </div>

              {/* Map Mode Selector Bar */}
              <div className="flex items-center justify-between gap-2 py-2 px-1">
                <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setMapMode('osm')}
                    className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                      mapMode === 'osm'
                        ? 'bg-white text-[#006FCC] shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <MapPin className="w-3 h-3" />
                    <span>Campus Map</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMapMode('satellite')}
                    className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                      mapMode === 'satellite'
                        ? 'bg-white text-[#006FCC] shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Layers className="w-3 h-3" />
                    <span>Satellite</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMapMode('google')}
                    className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                      mapMode === 'google'
                        ? 'bg-white text-[#006FCC] shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Globe className="w-3 h-3" />
                    <span>Google Map</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  {mapMode !== 'google' && (
                    <button
                      type="button"
                      onClick={() => {
                        if (mapInstanceRef.current) {
                          mapInstanceRef.current.setView([mapLat, mapLng], 15, { animate: true });
                        }
                      }}
                      title="Re-center Campus"
                      className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-[#EDF5FA] hover:text-[#006FCC] text-gray-600 flex items-center justify-center transition-colors"
                    >
                      <Crosshair className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setIsMapFullscreen(!isMapFullscreen)}
                    title={isMapFullscreen ? 'Exit Fullscreen' : 'View Fullscreen Map'}
                    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-[#EDF5FA] hover:text-[#006FCC] text-gray-600 flex items-center justify-center transition-colors"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Map Display Container */}
              <div className="relative w-full rounded-xl overflow-hidden bg-slate-100 border border-gray-200 shadow-inner flex-1 min-h-[380px] lg:min-h-[460px]">
                {mapMode === 'google' ? (
                  <iframe
                    title="Google Maps Verified Campus"
                    src={`https://maps.google.com/maps?q=${mapLat},${mapLng}+(${encodeURIComponent(displayName)})&hl=en&z=15&output=embed`}
                    className="w-full h-full border-0 min-h-[380px] lg:min-h-[460px]"
                    loading="lazy"
                  />
                ) : (
                  <>
                    <div ref={mapContainerRef} className="w-full h-full min-h-[380px] lg:min-h-[460px] z-0" />
                    {!mapLoaded && (
                      <div className="absolute inset-0 bg-slate-100 flex flex-col items-center justify-center gap-3 p-4 text-center">
                        <div className="w-8 h-8 rounded-full border-2 border-[#006FCC] border-t-transparent animate-spin" />
                        <span className="text-xs font-semibold text-gray-500">Loading interactive campus map...</span>
                        <button
                          type="button"
                          onClick={() => {
                            setMapMode('google');
                            setMapLoaded(true);
                          }}
                          className="text-xs font-bold text-[#006FCC] hover:underline bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs"
                        >
                          Switch to Google Maps view
                        </button>
                      </div>
                    )}
                  </>
                )}

                {/* Floating Campus Badge Preview Overlay */}
                <div className="absolute bottom-3 left-3 z-[400] bg-white/95 backdrop-blur-md rounded-xl p-2.5 sm:p-3 shadow-lg border border-gray-200/90 max-w-[280px] xs:max-w-xs">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Verified Location</span>
                  </div>
                  <div className="font-bold text-xs text-gray-900 truncate">{displayName}</div>
                  <div className="text-[10px] font-mono text-gray-500 mt-0.5">
                    📍 {mapLat.toFixed(4)}° N, {mapLng.toFixed(4)}° E
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${mapLat},${mapLng}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-bold text-[#006FCC] hover:underline flex items-center gap-1"
                    >
                      <span>Start Navigation</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Bottom Address Copy Strip */}
              <div className="pt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-600">
                <span className="bg-gray-100 px-2.5 py-1 rounded-full text-[11px] font-medium text-gray-700">
                  🅿️ Free Visitor Parking Available
                </span>

                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== 'undefined' && navigator.clipboard) {
                      navigator.clipboard.writeText(displayAddress);
                      setIsAddressCopied(true);
                      setTimeout(() => setIsAddressCopied(false), 2000);
                    }
                  }}
                  className="text-[#006FCC] hover:text-[#005499] font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {isAddressCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Address Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Full Address</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
