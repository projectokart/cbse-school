-- ==============================================================================
-- CSEEL Dedicated Schools Database Schema (school.cseel.org)
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/iaqpumtwzqsdbfjmbvmv/sql/new
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.udise_private_schools (
    id TEXT PRIMARY KEY,
    udise_code TEXT,
    school_name TEXT NOT NULL,
    school_slug TEXT,
    affiliation_number TEXT,
    state_name TEXT,
    district_name TEXT,
    address TEXT,
    pincode TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    phone TEXT,
    email TEXT,
    website TEXT,
    principal_name TEXT,
    management_desc TEXT,
    school_category TEXT,
    board_10th TEXT,
    board_12th TEXT,
    gender_type TEXT,
    primary_medium TEXT,
    secondary_medium TEXT,
    rural_urban TEXT,
    total_students INTEGER DEFAULT 0,
    total_teachers INTEGER DEFAULT 0,
    image_url TEXT,
    rating DOUBLE PRECISION DEFAULT 4.5,
    admissions_open BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.udise_private_schools ENABLE ROW LEVEL SECURITY;

-- Allow public read access (High speed CDN caching)
CREATE POLICY "Allow public read access" ON public.udise_private_schools
    FOR SELECT USING (true);

-- Allow service role full write/update access
CREATE POLICY "Allow service role full access" ON public.udise_private_schools
    FOR ALL USING (true);

-- Fast Indexes for Instant Filter & Map Querying
CREATE INDEX IF NOT EXISTS idx_schools_state ON public.udise_private_schools(state_name);
CREATE INDEX IF NOT EXISTS idx_schools_district ON public.udise_private_schools(district_name);
CREATE INDEX IF NOT EXISTS idx_schools_coords ON public.udise_private_schools(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_schools_udise ON public.udise_private_schools(udise_code);

-- View alias 'schools' for backwards compatibility
CREATE OR REPLACE VIEW public.schools AS SELECT * FROM public.udise_private_schools;
