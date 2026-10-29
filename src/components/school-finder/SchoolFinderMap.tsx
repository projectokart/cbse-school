'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { SchoolRecord } from '@/data/schoolFinderData';
import { SchoolMapPoint } from '@/integrations/supabase/schoolSearchClient';
import {
  Plus,
  Minus,
  Crosshair,
  Loader2,
  Maximize2,
  MapPin,
  Sparkles,
} from 'lucide-react';

interface SchoolFinderMapProps {
  searchCenter: { lat: number; lng: number };
  mapFocus: { lat: number; lng: number; zoom?: number; timestamp: number } | null;
  radiusKm: number;
  schools: SchoolRecord[];
  mapPoints?: SchoolMapPoint[];
  allSchoolsDots?: SchoolRecord[];
  showAllRedDots?: boolean;
  selectedSchool: SchoolRecord | null;
  onSelectSchool: (school: SchoolRecord | SchoolMapPoint) => void;
  onLocationChange?: (lat: number, lng: number) => void;
  onDeselectSchool?: () => void;
  onLocateMe: () => void;
  isLocating?: boolean;
  onOpenDetails: (school: SchoolRecord) => void;
  viewMode?: 'auto' | 'pins' | 'dots';
  onViewModeChange?: (mode: 'auto' | 'pins' | 'dots') => void;
  className?: string;
  mobileSheetState?: 'peek' | 'half' | 'full';
}

export default function SchoolFinderMap({
  searchCenter,
  mapFocus,
  radiusKm,
  schools,
  mapPoints = [],
  allSchoolsDots = [],
  showAllRedDots = false,
  selectedSchool,
  className,
  onSelectSchool,
  onLocationChange,
  onDeselectSchool,
  onLocateMe,
  isLocating = false,
  onOpenDetails,
  viewMode: controlledViewMode,
  onViewModeChange,
  mobileSheetState,
}: SchoolFinderMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const canvasRendererRef = useRef<L.Canvas | null>(null);
  const dotsLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const selectedMarkerRef = useRef<L.Marker | null>(null);
  const circleRef = useRef<L.Circle | null>(null);
  const centerMarkerRef = useRef<L.Marker | null>(null);
  const userGpsMarkerRef = useRef<L.Marker | null>(null);
  const userCoordsRef = useRef<{ lat: number; lng: number } | null>(null);
  const longPressTimerRef = useRef<any>(null);

  const onSelectSchoolRef = useRef(onSelectSchool);
  onSelectSchoolRef.current = onSelectSchool;
  const onOpenDetailsRef = useRef(onOpenDetails);
  onOpenDetailsRef.current = onOpenDetails;
  const onDeselectSchoolRef = useRef(onDeselectSchool);
  onDeselectSchoolRef.current = onDeselectSchool;
  const onLocationChangeRef = useRef(onLocationChange);
  onLocationChangeRef.current = onLocationChange;
  const onLocateMeRef = useRef(onLocateMe);
  onLocateMeRef.current = onLocateMe;

  const [mapReady, setMapReady] = useState(false);
  const [internalLocating, setInternalLocating] = useState(false);
  const [currentZoom, setCurrentZoom] = useState<number>(13);

  // Calculates visual target coordinate so point/pin lands slightly below the middle of visible upper half in half mode
  const getOffsetLatLng = useCallback((lat: number, lng: number, targetZoom: number) => {
    if (!mapInstanceRef.current || !mapContainerRef.current) return L.latLng(lat, lng);
    const map = mapInstanceRef.current;
    const containerHeight = mapContainerRef.current.clientHeight || (typeof window !== 'undefined' ? window.innerHeight : 800);
    const containerWidth = mapContainerRef.current.clientWidth || (typeof window !== 'undefined' ? window.innerWidth : 400);
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    let offsetY = 0;
    let offsetX = 0;

    if (isMobile) {
      if (mobileSheetState === 'half') {
        // Visible upper half is 0 to 50vh (middle is 25vh).
        // User wants point slightly below middle of upper half (around 29% - 30% from top).
        // Screen center is at 50vh. Distance from 50vh to 29.5vh is ~20.5% of container height.
        offsetY = Math.round(containerHeight * 0.205);
      } else if (mobileSheetState === 'full') {
        offsetY = Math.round(containerHeight * 0.36);
      } else {
        // 'peek' mode (58px bottom sheet, ~60px top bar)
        offsetY = 12;
      }
    } else {
      // Desktop left drawer offset
      offsetX = Math.round(containerWidth * 0.08);
    }

    try {
      const targetPoint = map.project([lat, lng], targetZoom);
      const offsetPoint = L.point(targetPoint.x - offsetX, targetPoint.y + offsetY);
      return map.unproject(offsetPoint, targetZoom);
    } catch {
      return L.latLng(lat, lng);
    }
  }, [mobileSheetState]);

  // Auto fit map bounds to the radius circle & schools (properly centered in visible upper area when bottom sheet is half)
  const fitToCurrentRadius = useCallback(() => {
    if (!mapInstanceRef.current || !circleRef.current) return;
    const map = mapInstanceRef.current;
    try {
      const bounds = circleRef.current.getBounds();
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
      const containerHeight = mapContainerRef.current?.clientHeight || (typeof window !== 'undefined' ? window.innerHeight : 800);

      let paddingTop = 40;
      let paddingBottom = 40;

      if (isMobile && mobileSheetState === 'half') {
        // 75px clears floating search bar at top
        paddingTop = 75;
        // 50% bottom sheet + 15px centers circle nicely slightly below the middle of the upper half
        paddingBottom = Math.round(containerHeight * 0.50) + 15;
      } else if (isMobile && mobileSheetState === 'full') {
        paddingTop = 75;
        paddingBottom = Math.round(containerHeight * 0.86) + 15;
      }

      map.fitBounds(bounds, {
        paddingTopLeft: [30, paddingTop],
        paddingBottomRight: [30, paddingBottom],
        maxZoom: 15,
        animate: true,
        duration: 0.5,
      });
    } catch (e) {
      console.warn('fitBounds error:', e);
    }
  }, [mobileSheetState]);

  // Initialize Map Instance directly
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const initialZoom = radiusKm <= 3 ? 14 : radiusKm <= 7 ? 13 : radiusKm <= 15 ? 12 : 11;
    setCurrentZoom(initialZoom);

    // Create high-speed Canvas renderer
    const canvasRenderer = L.canvas({ padding: 0.5, tolerance: 8 });
    canvasRendererRef.current = canvasRenderer;

    const map = L.map(mapContainerRef.current, {
      center: [searchCenter.lat || 28.6139, searchCenter.lng || 77.2090],
      zoom: initialZoom,
      zoomControl: false,
      closePopupOnClick: false,
      preferCanvas: true,
      renderer: canvasRenderer,
    });

    // Clean, Free OpenStreetMap & ESRI World Street Map Tile Layer (No API key, No watermark)
    const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    });

    tileLayer.on('tileerror', () => {
      // Fallback to ESRI World Street Map if OSM has network throttle
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri',
        maxZoom: 19,
      }).addTo(map);
    });

    tileLayer.addTo(map);

    map.on('zoomend', () => {
      setCurrentZoom(map.getZoom());
    });

    // Click anywhere on map or Long press / Context menu to relocate Search Pin
    const handleLocationSelect = (latlng: L.LatLng) => {
      if (onLocationChange && latlng?.lat && latlng?.lng) {
        onLocationChange(latlng.lat, latlng.lng);
      }
    };

    map.on('click', (e: L.LeafletMouseEvent) => {
      if (e.originalEvent && e.originalEvent.target) {
        const target = e.originalEvent.target as HTMLElement;
        if (target.closest('.leaflet-popup') || target.closest('.leaflet-control') || target.closest('button')) {
          return;
        }
      }
      if (e.latlng) handleLocationSelect(e.latlng);
    });

    map.on('contextmenu', (e: L.LeafletMouseEvent) => {
      if (e.latlng) handleLocationSelect(e.latlng);
    });

    map.on('touchstart', (e: any) => {
      if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
      if (e.originalEvent && e.originalEvent.target) {
        const target = e.originalEvent.target as HTMLElement;
        if (target.closest('aside') || target.closest('button') || target.closest('.leaflet-control') || target.closest('.leaflet-popup')) {
          return;
        }
      }
      if (e.latlng) {
        longPressTimerRef.current = setTimeout(() => {
          handleLocationSelect(e.latlng);
        }, 600);
      }
    });

    const clearPressTimer = () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
    };

    map.on('touchend touchmove touchcancel movestart zoomstart dragstart', clearPressTimer);

    mapInstanceRef.current = map;
    setMapReady(true);

    // Multi-stage invalidateSize to guarantee tiles render when container expands
    const timers = [
      setTimeout(() => map.invalidateSize(), 80),
      setTimeout(() => map.invalidateSize(), 300),
      setTimeout(() => map.invalidateSize(), 800),
    ];

    return () => {
      timers.forEach(clearTimeout);
      clearPressTimer();
      map.remove();
      mapInstanceRef.current = null;
      setMapReady(false);
    };
  }, []);

  // ResizeObserver to invalidate map size automatically
  useEffect(() => {
    if (!mapInstanceRef.current || !mapContainerRef.current) return;
    const resizeObserver = new ResizeObserver(() => {
      mapInstanceRef.current?.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);
    return () => resizeObserver.disconnect();
  }, [mapReady]);

  const hasAutoCenteredGPS = useRef(false);

  // Helper to ensure the blue dot marker is created and persistently updated on the map
  const ensureUserMarker = useCallback((lat: number, lng: number) => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    userCoordsRef.current = { lat, lng };

    const gpsIcon = L.divIcon({
      className: 'live-gps-marker',
      html: `
        <div class="relative w-8 h-8 flex items-center justify-center pointer-events-none">
          <div class="absolute inset-0 rounded-full bg-[#1a73e8]/30 live-gps-radar-ring"></div>
          <div class="absolute inset-1 rounded-full bg-[#1a73e8]/25 animate-ping" style="animation-duration: 2.2s;"></div>
          <div class="w-4 h-4 rounded-full bg-[#1a73e8] border-2 border-white shadow-[0_2px_8px_rgba(26,115,232,0.9)] z-10"></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    if (!userGpsMarkerRef.current) {
      userGpsMarkerRef.current = L.marker([lat, lng], {
        icon: gpsIcon,
        zIndexOffset: 1600,
        interactive: false,
      }).addTo(map);
    } else {
      userGpsMarkerRef.current.setLatLng([lat, lng]);
      if (!map.hasLayer(userGpsMarkerRef.current)) {
        userGpsMarkerRef.current.addTo(map);
      }
    }
  }, []);

  // Instant Locate Handler: Snaps map and blue dot directly on 1st click
  const handleLocateMe = useCallback(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // 1. If we already have known user coordinates, snap to them immediately in 0ms!
    if (userCoordsRef.current) {
      const { lat, lng } = userCoordsRef.current;
      ensureUserMarker(lat, lng);
      onLocationChangeRef.current?.(lat, lng);
      const offsetLatLng = getOffsetLatLng(lat, lng, 15);
      map.flyTo(offsetLatLng, 15, { duration: 0.35 });
    }

    // 2. Query fresh GPS position with highest accuracy
    if (typeof window !== 'undefined' && navigator.geolocation) {
      setInternalLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setInternalLocating(false);
          const { latitude, longitude } = pos.coords;
          ensureUserMarker(latitude, longitude);
          onLocationChangeRef.current?.(latitude, longitude);
          const offsetLatLng = getOffsetLatLng(latitude, longitude, 15);
          map.flyTo(offsetLatLng, 15, { duration: 0.45 });
        },
        (err) => {
          setInternalLocating(false);
          console.warn('GPS location error:', err);
          onLocateMeRef.current?.();
        },
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
      );
    } else {
      onLocateMeRef.current?.();
    }
  }, [ensureUserMarker, getOffsetLatLng]);

  // GPS Blue Dot & Immediate Auto-Center Red Pin (Never resets on parent renders)
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current || typeof window === 'undefined' || !navigator.geolocation) return;

    let isCancelled = false;

    // Rapid initial GPS resolution
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (isCancelled) return;
        const { latitude, longitude } = pos.coords;
        ensureUserMarker(latitude, longitude);

        if (!hasAutoCenteredGPS.current) {
          hasAutoCenteredGPS.current = true;
          onLocationChangeRef.current?.(latitude, longitude);
        }
      },
      (err) => console.warn('Initial GPS notice:', err),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );

    // Continuous watch for movement
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        if (isCancelled) return;
        const { latitude, longitude } = pos.coords;
        ensureUserMarker(latitude, longitude);

        if (!hasAutoCenteredGPS.current) {
          hasAutoCenteredGPS.current = true;
          onLocationChangeRef.current?.(latitude, longitude);
          mapInstanceRef.current?.flyTo([latitude, longitude], 14, { duration: 0.4 });
        }
      },
      (err) => console.warn('GPS watch notice:', err),
      { enableHighAccuracy: true, maximumAge: 3000, timeout: 15000 }
    );

    return () => {
      isCancelled = true;
      navigator.geolocation.clearWatch(watchId);
      if (userGpsMarkerRef.current) {
        userGpsMarkerRef.current.remove();
        userGpsMarkerRef.current = null;
      }
    };
  }, [mapReady, ensureUserMarker]);

  // Smooth flyTo when mapFocus changes (pointer, Fly to Pin, school selection)
  useEffect(() => {
    if (!mapInstanceRef.current || !mapReady || !mapFocus) return;
    const map = mapInstanceRef.current;
    const curZoom = map.getZoom();
    const targetZoom = typeof mapFocus.zoom === 'number' ? mapFocus.zoom : curZoom;

    try {
      const offsetLatLng = getOffsetLatLng(mapFocus.lat, mapFocus.lng, targetZoom);
      map.flyTo(offsetLatLng, targetZoom, {
        duration: 0.5,
        easeLinearity: 0.25,
      });
    } catch {
      map.flyTo([mapFocus.lat, mapFocus.lng], targetZoom, { duration: 0.5 });
    }
  }, [mapFocus, mapReady, getOffsetLatLng]);

  // When mobileSheetState changes (e.g. user toggles Split / Half mode),
  // smoothly re-center the active school pointer or search center into the visible upper area
  useEffect(() => {
    if (!mapInstanceRef.current || !mapReady) return;
    const target = selectedSchool
      ? { lat: Number(selectedSchool.latitude || selectedSchool.lat), lng: Number(selectedSchool.longitude || selectedSchool.lng) }
      : searchCenter;

    if (target && target.lat && target.lng) {
      const zoom = mapInstanceRef.current.getZoom();
      const offsetLatLng = getOffsetLatLng(target.lat, target.lng, zoom);
      mapInstanceRef.current.flyTo(offsetLatLng, zoom, { duration: 0.4 });
    }
  }, [mobileSheetState, getOffsetLatLng]);

  // Search Center Red SVG Pin + Draggable + Radius Circle
  useEffect(() => {
    if (!mapInstanceRef.current || !mapReady) return;
    const map = mapInstanceRef.current;

    if (!centerMarkerRef.current) {
      const redDropPinHtml = `
        <div class="google-red-drop-pin" style="position: relative; width: 34px; height: 42px; display: flex; flex-direction: column; align-items: center; cursor: grab; user-select: none;">
          <svg width="34" height="42" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 4px 10px rgba(0,0,0,0.38));">
            <path d="M12 0C5.373 0 0 5.373 0 12C0 21 12 32 12 32C12 32 24 21 24 12C24 5.373 18.627 0 12 0Z" fill="#EA4335"/>
            <circle cx="12" cy="11.5" r="4.5" fill="#FFFFFF"/>
            <circle cx="12" cy="11.5" r="2.8" fill="#B31412"/>
          </svg>
          <div style="position: absolute; bottom: -4px; width: 14px; height: 5px; background: rgba(0,0,0,0.25); border-radius: 50%; filter: blur(1px);"></div>
        </div>
      `;

      const centerIcon = L.divIcon({
        className: 'custom-google-red-pin',
        html: redDropPinHtml,
        iconSize: [34, 42],
        iconAnchor: [17, 42],
        tooltipAnchor: [0, -42],
      });

      const marker = L.marker([searchCenter.lat, searchCenter.lng], {
        icon: centerIcon,
        draggable: true,
        zIndexOffset: 2000,
      }).addTo(map);

      marker.bindTooltip(
        '<div class="font-sans text-xs font-bold text-slate-800">📍 Drag Pin or Hold on Map to Move</div>',
        { direction: 'top', offset: [0, -42] }
      );

      marker.on('dragend', (e: any) => {
        const newPos = e.target.getLatLng();
        if (newPos) {
          onLocationChangeRef.current?.(newPos.lat, newPos.lng);
          const offsetLatLng = getOffsetLatLng(newPos.lat, newPos.lng, map.getZoom());
          map.flyTo(offsetLatLng, map.getZoom(), { duration: 0.35 });
        }
      });

      marker.on('click', () => {
        const offsetLatLng = getOffsetLatLng(searchCenter.lat, searchCenter.lng, map.getZoom());
        map.flyTo(offsetLatLng, map.getZoom(), { duration: 0.35 });
      });

      centerMarkerRef.current = marker;
    } else {
      centerMarkerRef.current.setLatLng([searchCenter.lat, searchCenter.lng]);
    }

    // Dynamic Radius Circle
    if (!circleRef.current) {
      const circle = L.circle([searchCenter.lat, searchCenter.lng], {
        radius: radiusKm * 1000,
        color: '#ea4335',
        weight: 1.8,
        dashArray: '6, 6',
        fillColor: '#ea4335',
        fillOpacity: 0.05,
      }).addTo(map);
      circleRef.current = circle;
    } else {
      circleRef.current.setLatLng([searchCenter.lat, searchCenter.lng]);
      circleRef.current.setRadius(radiusKm * 1000);
    }
  }, [searchCenter.lat, searchCenter.lng, radiusKm, mapReady]);

  // High Speed Canvas School Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !mapReady) return;
    const map = mapInstanceRef.current;

    if (dotsLayerGroupRef.current) {
      map.removeLayer(dotsLayerGroupRef.current);
      dotsLayerGroupRef.current = null;
    }

    const validSchools = schools.filter(
      (s) => s.lat && s.lng && !isNaN(s.lat) && !isNaN(s.lng) && s.lat > 5
    );

    const canvasRenderer = canvasRendererRef.current || L.canvas({ padding: 0.5, tolerance: 8 });
    const layerGroup = L.layerGroup();

    // 1. If showAllRedDots is enabled, render background schools as small high-density red dots
    if (showAllRedDots && allSchoolsDots && allSchoolsDots.length > 0) {
      const activeIds = new Set(validSchools.map((s) => String(s.udise_code || s.school_id || s.id || '').toUpperCase()));
      const validBackgroundDots = allSchoolsDots.filter(
        (s) => s.lat && s.lng && !isNaN(s.lat) && !isNaN(s.lng) && s.lat > 5
      );

      validBackgroundDots.forEach((school) => {
        const schoolKey = String(school.udise_code || school.school_id || school.id || '').toUpperCase();
        if (activeIds.has(schoolKey)) return; // already rendered as main active school

        const bgMarker = L.circleMarker([school.lat!, school.lng!], {
          renderer: canvasRenderer,
          radius: 4,
          color: '#ffffff',
          weight: 1.2,
          fillColor: '#ea4335',
          fillOpacity: 0.85,
        });

        bgMarker.bindTooltip(
          `<div class="font-sans text-xs">
            <strong>${school.school_name || (school as any).name}</strong><br/>
            <span style="color: #64748b;">${school.distance !== undefined ? `${school.distance} km • ` : ''}${school.board || school.management || 'Private School'}</span>
          </div>`,
          { direction: 'top', offset: [0, -4] }
        );

        bgMarker.on('click', () => {
          onSelectSchoolRef.current?.(school);
        });

        layerGroup.addLayer(bgMarker);
      });
    }

    // 2. Render Active / Paginated Schools as prominent markers
    validSchools.forEach((school) => {
      const isGovt = (school.management_desc_state || school.management) === 'Government';
      const isSelected = selectedSchool?.id === school.id;
      const dotColor = isSelected ? '#ea4335' : isGovt ? '#059669' : '#1a73e8';
      const dotRadius = isSelected ? 7 : 5.5;

      const circleMarker = L.circleMarker([school.lat, school.lng], {
        renderer: canvasRenderer,
        radius: dotRadius,
        color: '#ffffff',
        weight: 1.8,
        fillColor: dotColor,
        fillOpacity: 0.95,
      });

      circleMarker.bindTooltip(
        `<div class="font-sans text-xs">
          <strong>${school.school_name || (school as any).name}</strong><br/>
          <span style="color: #64748b;">${school.distance !== undefined ? `${school.distance} km • ` : ''}${school.management_desc_state || school.management || 'Private'}</span>
        </div>`,
        { direction: 'top', offset: [0, -6] }
      );

      circleMarker.on('click', () => {
        onSelectSchoolRef.current?.(school);
      });

      layerGroup.addLayer(circleMarker);
    });

    layerGroup.addTo(map);
    dotsLayerGroupRef.current = layerGroup;
  }, [schools, selectedSchool, mapReady, showAllRedDots, allSchoolsDots]);

  // Selected School Popup
  useEffect(() => {
    (window as any).__cseelOpenSchoolDetails = (id: string) => {
      const found = schools.find((s) => String(s.id) === String(id) || String(s.school_id) === String(id));
      if (found) {
        onOpenDetailsRef.current?.(found);
      } else if (selectedSchool) {
        onOpenDetailsRef.current?.(selectedSchool);
      }
    };
    return () => {
      delete (window as any).__cseelOpenSchoolDetails;
    };
  }, [schools, selectedSchool]);

  useEffect(() => {
    if (!mapInstanceRef.current || !mapReady) return;
    const map = mapInstanceRef.current;

    if (selectedMarkerRef.current) {
      map.removeLayer(selectedMarkerRef.current);
      selectedMarkerRef.current = null;
    }

    if (!selectedSchool || !selectedSchool.lat || !selectedSchool.lng) return;

    const isGovt = (selectedSchool.management_desc_state || selectedSchool.management) === 'Government';
    const pinBg = isGovt ? '#059669' : '#1a73e8';
    const pinSize = 34;

    const selectedPinHtml = `
      <div class="selected-school-pip-wrapper" style="position: relative; width: ${pinSize}px; height: ${pinSize + 8}px; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; cursor: pointer;">
        <div style="position: absolute; top: 0; width: ${pinSize}px; height: ${pinSize}px; border-radius: 50%; background: ${pinBg}; opacity: 0.35; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="
          position: relative;
          width: ${pinSize}px; 
          height: ${pinSize}px; 
          background: ${pinBg}; 
          border: 3px solid #ffffff; 
          border-radius: 50% 50% 50% 0; 
          transform: rotate(-45deg); 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          box-shadow: 0 4px 14px rgba(0,0,0,0.4);
          z-index: 2;
        ">
          <div style="transform: rotate(45deg); display: flex; align-items: center; justify-content: center; color: white;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 22v-4a2 2 0 1 0-4 0v4"></path><path d="m18 10 3.447 1.724a1 1 0 0 1 .553.894V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7.382a1 1 0 0 1 .553-.894L6 10"></path><path d="M18 5v17"></path><path d="m4 6 7.106-3.553a2 2 0 0 1 1.788 0L20 6"></path><path d="M6 5v17"></path><circle cx="12" cy="9" r="2"></circle></svg>
          </div>
        </div>
        <div style="position: absolute; bottom: 0; width: 12px; height: 4px; background: rgba(0,0,0,0.3); border-radius: 50%; filter: blur(1px);"></div>
      </div>
    `;

    const pinIcon = L.divIcon({
      className: `selected-school-marker-${selectedSchool.id}`,
      html: selectedPinHtml,
      iconSize: [pinSize, pinSize + 8],
      iconAnchor: [pinSize / 2, pinSize + 8],
      popupAnchor: [0, -(pinSize + 4)],
    });

    const marker = L.marker([selectedSchool.lat, selectedSchool.lng], {
      icon: pinIcon,
      zIndexOffset: 1600,
    }).addTo(map);

    const distFormatted = selectedSchool.distance !== undefined && selectedSchool.distance > 0
      ? selectedSchool.distance < 1
        ? `${Math.round(selectedSchool.distance * 1000)}m`
        : `${selectedSchool.distance} km`
      : 'Nearby';

    const schoolImage = selectedSchool.image || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=400&q=80';
    const fallbackImage = 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=400&q=80';

    const popupContent = document.createElement('div');
    popupContent.className = 'school-compact-popup-card';
    popupContent.innerHTML = `
      <div style="width: 285px; max-width: 85vw; font-family: Inter, system-ui, -apple-system, sans-serif; color: #0f172a; padding: 0; margin: 0; overflow: hidden; background: #ffffff;">
        <div style="display: flex; gap: 8px; padding: 8px 8px 6px 8px; align-items: stretch;">
          <div style="position: relative; width: 84px; min-width: 84px; height: 96px; border-radius: 8px; overflow: hidden; background: #f1f5f9; shrink-0;">
            <img 
              src="${schoolImage}" 
              alt="${selectedSchool.school_name || (selectedSchool as any).name || 'School'}" 
              style="width: 100%; height: 100%; object-fit: cover; display: block;"
              onerror="this.src='${fallbackImage}'"
            />
            <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%);"></div>
            <span style="position: absolute; bottom: 3px; left: 3px; right: 3px; background: rgba(0,0,0,0.75); color: #ffffff; font-size: 9px; font-weight: 700; padding: 1px 3px; border-radius: 4px; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block;">
              📍 ${distFormatted}
            </span>
          </div>

          <div style="flex: 1; min-width: 0; display: flex; flex-direction: column; justify-content: space-between; padding: 1px 0;">
            <div>
              <h4 style="font-weight: 700; font-size: 12px; line-height: 1.25; margin: 0 0 2px 0; color: #0f172a; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                ${selectedSchool.school_name || (selectedSchool as any).name || ''}
              </h4>
              <p style="font-size: 10px; color: #64748b; margin: 0 0 4px 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${selectedSchool.village_ward ? `${selectedSchool.village_ward}, ` : ''}${selectedSchool.district_name || (selectedSchool as any).district || ''}
              </p>
            </div>

            <div style="display: flex; flex-wrap: wrap; gap: 3px; margin-bottom: 3px;">
              <span style="background: #eff6ff; color: #1d4ed8; font-size: 8.5px; font-weight: 700; padding: 1.5px 4px; border-radius: 4px; border: 1px solid #dbeafe;">
                ${selectedSchool.board_secondary_10th || selectedSchool.board || 'CBSE'}
              </span>
              <span style="background: ${isGovt ? '#ecfdf5' : '#f8fafc'}; color: ${isGovt ? '#047857' : '#475569'}; font-size: 8.5px; font-weight: 700; padding: 1.5px 4px; border-radius: 4px; border: 1px solid ${isGovt ? '#a7f3d0' : '#e2e8f0'};">
                ${isGovt ? 'Govt' : 'Private'}
              </span>
            </div>

            <div style="display: flex; items-center; justify-content: space-between; font-size: 9.5px; color: #475569; border-top: 1px solid #f1f5f9; padding-top: 2px;">
              <span>Cls: <strong>${selectedSchool.class_from}-${selectedSchool.class_to}</strong></span>
              <span>👥 <strong>${(selectedSchool.total_students || 0).toLocaleString('en-IN')}</strong></span>
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 5px; padding: 0 8px 8px 8px;">
          <a 
            href="https://www.google.com/maps/dir/?api=1&destination=${selectedSchool.lat},${selectedSchool.lng}" 
            target="_blank" 
            rel="noopener noreferrer" 
            style="
              flex: 1;
              background: #1a73e8;
              color: #ffffff;
              font-size: 10.5px;
              font-weight: 700;
              padding: 5px 6px;
              border-radius: 6px;
              text-decoration: none;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 3px;
              box-shadow: 0 1px 2px rgba(26,115,232,0.3);
            "
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>
            <span>Directions</span>
          </a>

          <button 
            id="popup-btn-profile-${selectedSchool.id}"
            type="button"
            onclick="window.__cseelOpenSchoolDetails && window.__cseelOpenSchoolDetails('${selectedSchool.id}')"
            style="
              flex: 1.2;
              background: #f8fafc;
              color: #0f172a;
              font-size: 10.5px;
              font-weight: 700;
              padding: 5px 6px;
              border-radius: 6px;
              border: 1px solid #cbd5e1;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 3px;
              transition: background 0.15s;
            "
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#1a73e8" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            <span>Profile Details</span>
          </button>
        </div>
      </div>
    `;

    marker.bindPopup(popupContent, {
      maxWidth: 300,
      minWidth: 275,
      className: 'custom-school-compact-popup',
      autoClose: true,
      closeOnClick: false,
    });

    marker.on('popupopen', () => {
      const btn = document.getElementById(`popup-btn-profile-${selectedSchool.id}`);
      if (btn) {
        btn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          onOpenDetailsRef.current?.(selectedSchool);
        };
        btn.ontouchend = (e) => {
          e.preventDefault();
          e.stopPropagation();
          onOpenDetailsRef.current?.(selectedSchool);
        };
      }
    });

    marker.on('popupclose', () => {
      onDeselectSchool?.();
    });

    marker.openPopup();
    selectedMarkerRef.current = marker;
  }, [selectedSchool, mapReady, onDeselectSchool]);

  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  return (
    <div className={`relative w-full h-full min-h-0 md:min-h-[500px] overflow-hidden bg-slate-100 flex flex-col select-none ${className !== undefined ? className : 'rounded-3xl'}`}>
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full min-h-0 md:min-h-[500px] z-0 flex-1" />

      {/* Floating Map Zoom & GPS Controls */}
      <div className="absolute top-24 sm:top-28 right-2.5 sm:right-3 md:top-auto md:bottom-6 md:right-4 z-10 flex flex-col shadow-[0_2px_8px_rgba(60,64,67,0.25)] rounded-2xl overflow-hidden bg-white/95 backdrop-blur-md border border-[#dadce0]">
        <button
          onClick={handleZoomIn}
          className="w-9 h-9 sm:w-10 sm:h-10 hover:bg-[#f8f9fa] text-[#3c4043] flex items-center justify-center border-b border-[#dadce0] transition-colors active:bg-slate-100"
          title="Zoom In"
          aria-label="Zoom In"
        >
          <Plus size={16} />
        </button>
        <button
          onClick={handleZoomOut}
          className="w-9 h-9 sm:w-10 sm:h-10 hover:bg-[#f8f9fa] text-[#3c4043] flex items-center justify-center transition-colors active:bg-slate-100"
          title="Zoom Out"
          aria-label="Zoom Out"
        >
          <Minus size={16} />
        </button>
        <button
          onClick={fitToCurrentRadius}
          className="w-9 h-9 sm:w-10 sm:h-10 hover:bg-[#f8f9fa] text-[#5f6368] hover:text-[#1a73e8] flex items-center justify-center border-t border-[#dadce0] transition-colors active:bg-slate-100"
          title="Fit View to Search Radius Area"
          aria-label="Fit View"
        >
          <Maximize2 size={15} />
        </button>
        <button
          onClick={handleLocateMe}
          disabled={isLocating || internalLocating}
          className="w-9 h-9 sm:w-10 sm:h-10 hover:bg-[#f8f9fa] text-[#1a73e8] flex items-center justify-center border-t border-[#dadce0] transition-colors active:bg-slate-100 cursor-pointer disabled:opacity-60"
          title="Locate Current Position"
          aria-label="My Location"
        >
          {(isLocating || internalLocating) ? <Loader2 size={16} className="animate-spin text-[#1a73e8]" /> : <Crosshair size={16} />}
        </button>
      </div>

      {/* Custom Popup & Marker Styles */}
      <style>{`
        @keyframes liveGpsRadarPulse {
          0% {
            transform: scale(0.85);
            opacity: 0.85;
          }
          70% {
            transform: scale(2.2);
            opacity: 0;
          }
          100% {
            transform: scale(2.4);
            opacity: 0;
          }
        }
        .live-gps-radar-ring {
          animation: liveGpsRadarPulse 2s cubic-bezier(0.2, 0.6, 0.35, 1) infinite;
        }
        .custom-school-compact-popup .leaflet-popup-content-wrapper {
          padding: 0 !important;
          border-radius: 14px !important;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.28), 0 8px 10px -6px rgba(0, 0, 0, 0.2) !important;
          border: 1px solid #cbd5e1 !important;
          overflow: hidden !important;
          background: #ffffff !important;
        }
        .custom-school-compact-popup .leaflet-popup-content {
          margin: 0 !important;
          line-height: 1.4 !important;
          width: 285px !important;
        }
        .custom-school-compact-popup .leaflet-popup-tip {
          background: #ffffff !important;
        }
        .custom-school-compact-popup a.leaflet-popup-close-button {
          top: 5px !important;
          right: 5px !important;
          color: #475569 !important;
          background: rgba(255, 255, 255, 0.95) !important;
          border-radius: 50% !important;
          width: 20px !important;
          height: 20px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          font-size: 14px !important;
          border: 1px solid #cbd5e1 !important;
          box-shadow: 0 1px 3px rgba(0,0,0,0.15) !important;
          z-index: 10 !important;
          padding: 0 !important;
        }
        .custom-school-compact-popup a.leaflet-popup-close-button:hover {
          color: #0f172a !important;
          background: #f1f5f9 !important;
        }
      `}</style>
    </div>
  );
}
