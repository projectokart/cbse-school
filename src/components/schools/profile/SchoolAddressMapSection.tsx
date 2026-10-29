'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  MapPin,
  Globe,
  ExternalLink,
  Navigation,
  Layers,
  Crosshair,
  Maximize2,
  Check,
  Copy
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';

export interface SchoolAddressMapSectionProps {
  displayName: string;
  displayAddress: string;
  displayWebsiteUrl?: string;
  lat: number;
  lng: number;
}

export default function SchoolAddressMapSection({
  displayName,
  displayAddress,
  displayWebsiteUrl,
  lat,
  lng,
}: SchoolAddressMapSectionProps) {
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
    let isMounted = true;
    if (typeof window === 'undefined') return;

    const initMap = async () => {
      const L = (await import('leaflet')).default;
      if (!isMounted || !mapContainerRef.current) return;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      const map = L.map(mapContainerRef.current, {
        center: [mapLat, mapLng],
        zoom: 14,
        zoomControl: true,
        scrollWheelZoom: false,
      });

      const tileUrls = {
        osm: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        google: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
      };

      const tileLayers = {
        osm: L.tileLayer(tileUrls.osm, { attribution: '© OpenStreetMap contributors', maxZoom: 19 }),
        satellite: L.tileLayer(tileUrls.satellite, { attribution: '© Esri & Satellite Community', maxZoom: 18 }),
        google: L.tileLayer(tileUrls.google, { attribution: '© Google Maps', maxZoom: 20 }),
      };

      tileLayers[mapMode].addTo(map);

      const customPin = L.divIcon({
        className: 'custom-school-map-pin',
        html: `
          <div style="position:relative;display:flex;align-items:center;justify-content:center;width:42px;height:42px;">
            <div style="position:absolute;width:42px;height:42px;background:rgba(0,111,204,0.25);border-radius:50%;animation:ping 2s cubic-bezier(0,0,0.2,1) infinite;"></div>
            <div style="position:relative;width:34px;height:34px;background:#005689;border:3px solid #ffffff;border-radius:50%;box-shadow:0 4px 12px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;color:#ffffff;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
          </div>
        `,
        iconSize: [42, 42],
        iconAnchor: [21, 21],
      });

      const marker = L.marker([mapLat, mapLng], { icon: customPin }).addTo(map);

      marker.bindPopup(`
        <div style="font-family:system-ui,sans-serif;padding:4px;min-width:180px;">
          <h4 style="font-weight:800;color:#0f172a;margin:0 0 4px;font-size:13px;line-height:1.2;">${displayName}</h4>
          <p style="margin:0 0 8px;color:#64748b;font-size:11px;line-height:1.3;">${displayAddress}</p>
          <a href="https://www.google.com/maps/dir/?api=1&destination=${mapLat},${mapLng}" target="_blank" rel="noopener noreferrer" style="display:inline-block;background:#005689;color:#ffffff;padding:4px 10px;border-radius:6px;font-size:10.5px;font-weight:700;text-decoration:none;">
            Get Directions →
          </a>
        </div>
      `).openPopup();

      mapInstanceRef.current = map;
      setMapLoaded(true);
    };

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapLat, mapLng, mapMode, displayName, displayAddress]);

  const handleCopyAddress = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(displayAddress);
      setIsAddressCopied(true);
      setTimeout(() => setIsAddressCopied(false), 2000);
    }
  };

  return (
    <section id="address-map" className="py-12 sm:py-20 bg-[#F7F8F8] border-b border-[#E8E9E9] relative overflow-hidden">
      {/* Decorative ambient background */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#EDF5FA]/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center sm:text-left mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-[#006FCC] bg-[#EDF5FA] border border-[#D0E4F5] px-3.5 py-1.5 rounded-full mb-3 shadow-2xs font-['Montserrat',sans-serif]">
            <MapPin className="w-3.5 h-3.5 text-[#006FCC]" />
            <span>CAMPUS LOCATION &amp; ACCESS</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-['Montserrat',sans-serif] text-[#003C6E] tracking-tight leading-tight">
            Campus Address &amp;
            <span className="text-[#006FCC] block mt-0.5">Interactive Geospatial Map</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed max-w-2xl font-normal">
            Verified geographic location and real-time navigation directions for visiting {displayName}.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Campus Address Card */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-[14px] p-7 sm:p-8 border border-[#E8E9E9] shadow-xs space-y-6">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#006FCC] mb-1.5 font-['Montserrat',sans-serif]">
                  OFFICIAL CAMPUS ADDRESS
                </div>
                <h3 className="text-2xl font-bold font-['Montserrat',sans-serif] text-[#003C6E] leading-snug">
                  {displayName}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed font-normal">
                  {displayAddress}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-white border border-[#E8E9E9] text-[#003C6E] hover:bg-slate-50 text-xs font-bold font-['Montserrat',sans-serif] transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  {isAddressCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#006FCC]" />
                      <span>Copy Address</span>
                    </>
                  )}
                </button>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${mapLat},${mapLng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] bg-[#006FCC] hover:bg-[#005399] text-white text-xs font-bold font-['Montserrat',sans-serif] transition-all shadow-md shadow-[#006FCC]/20 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Get Driving Directions</span>
                </a>
              </div>

              {displayWebsiteUrl && (
                <div className="pt-5 border-t border-[#E8E9E9] flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-semibold flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-[#006FCC]" />
                    Official Website:
                  </span>
                  <a
                    href={displayWebsiteUrl.startsWith('http') ? displayWebsiteUrl : `https://${displayWebsiteUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-[#006FCC] hover:underline flex items-center gap-1 truncate max-w-[200px]"
                  >
                    <span>{displayWebsiteUrl.replace(/^https?:\/\//, '')}</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  </a>
                </div>
              )}
            </div>

            {/* Geolocation Tag */}
            <div className="bg-white rounded-[10px] p-4 border border-[#E8E9E9] shadow-xs flex items-center justify-between text-xs text-slate-600">
              <span className="font-semibold">GPS Geolocation:</span>
              <span className="font-mono font-bold text-[#006FCC] bg-[#EDF5FA] px-3 py-1 rounded-[6px] border border-[#D0E4F5]">
                {mapLat.toFixed(4)}° N, {mapLng.toFixed(4)}° E
              </span>
            </div>
          </div>

          {/* Right Interactive Map Card */}
          <div className="lg:col-span-7">
            <div
              className={`rounded-[16px] border-4 border-white ring-1 ring-[#E8E9E9] shadow-xl overflow-hidden relative bg-slate-100 transition-all ${
                isMapFullscreen ? 'fixed inset-4 z-[9999] bg-white m-0' : 'aspect-[4/3] sm:aspect-[16/10] w-full'
              }`}
            >
              {/* Map Controls Ribbon */}
              <div className="absolute top-4 left-4 right-4 z-[400] flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-2xl shadow-md border border-slate-200 pointer-events-auto">
                  {(['osm', 'satellite', 'google'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setMapMode(mode)}
                      className={`px-3 py-1.5 text-xs font-black rounded-xl transition-all capitalize cursor-pointer ${
                        mapMode === mode
                          ? 'bg-[#005689] text-white shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {mode === 'osm' ? 'Standard' : mode}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 pointer-events-auto">
                  <button
                    type="button"
                    onClick={() => {
                      if (mapInstanceRef.current) {
                        mapInstanceRef.current.setView([mapLat, mapLng], 15);
                      }
                    }}
                    title="Center on School"
                    className="w-10 h-10 rounded-2xl bg-white/95 backdrop-blur-md text-slate-700 hover:text-[#005689] flex items-center justify-center shadow-md border border-slate-200 transition-all cursor-pointer hover:scale-105 active:scale-95"
                  >
                    <Crosshair className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsMapFullscreen((prev) => !prev)}
                    title={isMapFullscreen ? 'Exit Fullscreen' : 'View Fullscreen'}
                    className="w-10 h-10 rounded-2xl bg-white/95 backdrop-blur-md text-slate-700 hover:text-[#005689] flex items-center justify-center shadow-md border border-slate-200 transition-all cursor-pointer hover:scale-105 active:scale-95"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* The Map Div */}
              <div ref={mapContainerRef} className="w-full h-full min-h-[360px]" />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
