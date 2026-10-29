import { NextResponse } from 'next/server';
import { getAllSchoolsFromDatabase, deduplicateSchools } from '@/integrations/supabase/schoolsDirectoryDb';
import { SchoolRecord } from '@/data/schoolFinderData';

function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const isNearMe = searchParams.get('near_me') === 'true' || searchParams.get('near_me') === '1';
    const lat = Number(searchParams.get('lat'));
    const lng = Number(searchParams.get('lng'));
    const rawRadius = Number(searchParams.get('radius')) || 5;
    const effectiveRadius = Math.min(25, Math.max(1, rawRadius)); // Strictly max 25 km
    const page = Math.max(1, Number(searchParams.get('page')) || 1);
    const limit = Math.min(50, Math.max(1, Number(searchParams.get('limit')) || 25));
    const q = (searchParams.get('q') || '').trim().toLowerCase();
    const board = (searchParams.get('board') || '').trim().toLowerCase();
    const district = (searchParams.get('district') || '').trim().toLowerCase();
    const state = (searchParams.get('state') || '').trim().toLowerCase();

    const allSchools = getAllSchoolsFromDatabase();

    // ─── 1. NEAR ME MODE: STRICTLY FILTER ONLY SCHOOLS WITHIN RADIUS (MAX 25KM) ───
    if (isNearMe && !isNaN(lat) && !isNaN(lng) && lat > 5 && lng > 60) {
      const nearList: SchoolRecord[] = [];

      for (let i = 0; i < allSchools.length; i++) {
        const s = allSchools[i];
        const sLat = Number(s.latitude || s.lat);
        const sLng = Number(s.longitude || s.lng);

        if (!sLat || !sLng || isNaN(sLat) || isNaN(sLng) || sLat < 5) continue;

        const dist = calculateDistanceKm(lat, lng, sLat, sLng);
        if (dist <= effectiveRadius) {
          // Additional filters if provided
          if (board && board !== 'all') {
            const b = `${s.board || ''} ${s.board_secondary_10th || ''}`.toLowerCase();
            if (!b.includes(board)) continue;
          }
          if (q) {
            const name = `${s.school_name || s.name || ''} ${s.district_name || ''}`.toLowerCase();
            if (!name.includes(q)) continue;
          }

          nearList.push({
            ...s,
            lat: sLat,
            lng: sLng,
            distance: dist,
          });
        }
      }

      // Sort strictly nearest first
      nearList.sort((a, b) => (a.distance ?? 99999) - (b.distance ?? 99999));

      const totalCount = nearList.length;
      const totalPages = Math.max(1, Math.ceil(totalCount / limit));
      const offset = (page - 1) * limit;
      const pageSlice = deduplicateSchools(nearList.slice(offset, offset + limit));

      // All points within radius for high-density red dots on map
      const allNearPoints = nearList.map((s) => ({
        id: s.id,
        school_id: s.school_id || s.id,
        udise_code: s.udise_code || s.id,
        school_name: s.school_name || s.name,
        name: s.school_name || s.name,
        lat: s.lat,
        lng: s.lng,
        distance: s.distance,
        board: s.board || 'CBSE',
        management: s.management || 'Private',
      }));

      return NextResponse.json({
        success: true,
        isNearMe: true,
        radius: effectiveRadius,
        totalCount,
        totalPages,
        currentPage: page,
        limit,
        schools: pageSlice,
        allNearPoints,
      });
    }

    // ─── 2. STANDARD LIST DIRECTORY MODE: NO RADIUS FILTERING ───
    let filtered = allSchools;

    if (q) {
      filtered = filtered.filter((s) => {
        const text = `${s.school_name || s.name || ''} ${s.district_name || ''} ${s.state_name || ''} ${s.pincode || ''} ${s.udise_code || ''}`.toLowerCase();
        return text.includes(q);
      });
    }

    if (district && district !== 'all') {
      filtered = filtered.filter((s) => (s.district_name || s.city || '').toLowerCase().includes(district));
    }

    if (state && state !== 'all') {
      filtered = filtered.filter((s) => (s.state_name || s.state || '').toLowerCase().includes(state));
    }

    if (board && board !== 'all') {
      filtered = filtered.filter((s) => {
        const b = `${s.board || ''} ${s.board_secondary_10th || ''}`.toLowerCase();
        return b.includes(board);
      });
    }

    const totalCount = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / limit));
    const offset = (page - 1) * limit;
    const pageSlice = deduplicateSchools(filtered.slice(offset, offset + limit));

    return NextResponse.json({
      success: true,
      isNearMe: false,
      totalCount,
      totalPages,
      currentPage: page,
      limit,
      schools: pageSlice,
    });
  } catch (err: any) {
    console.error('Error in /api/schools-directory:', err);
    return NextResponse.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}
