# CBSE Schools Directory & Search Portal (school.cseel.org)

Independent, high-performance CBSE Schools Directory and Exploration Portal for India, decoupled from the core monolithic application.

## 🚀 Key Features

- **33,151 Verified Schools**: Complete database of CBSE & private schools across all 28 states and 8 union territories.
- **Sub-100ms Search**: Fast fuzzy search across UDISE codes, school names, cities, districts, and boards.
- **Dedicated Supabase Database**: Connected to dedicated Supabase backend (`iaqpumtwzqsdbfjmbvmv.supabase.co`) with fallback to local JSON.
- **SEO Hierarchy URLs**: Dynamic geographic breadcrumbs (`/schools/delhi/south-delhi`, `/schools/haryana/gurugram`).
- **Interactive Profiles**: Facilities checklist, student-teacher ratios, labs, smart boards, fee ranges, and direct inquiry forms.
- **Independent Vercel Deployment**: Configured for independent deployments on `school.cseel.org`.

## 📦 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS, Material 3 Design
- **Database**: Supabase PostgreSQL (`iaqpumtwzqsdbfjmbvmv.supabase.co`)
- **Icons**: Lucide React
- **Hosting**: Vercel (`cseel-schools`) + Cloudflare DNS (`school.cseel.org`)

## 🛠️ Environment Variables

Create `.env.local` with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://iaqpumtwzqsdbfjmbvmv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_PORTAL_NAME="CBSE Schools Directory"
NEXT_PUBLIC_ROOT_DOMAIN=school.cseel.org
```

## 💻 Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the portal.
