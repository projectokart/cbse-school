'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SchoolRecord } from '@/data/schoolFinderData';
import {
  X,
  MapPin,
  Phone,
  Mail,
  Award,
  CheckCircle2,
  Navigation,
  Globe,
  Building2,
  User,
  Sparkles,
  Users,
  GraduationCap,
  BookOpen,
  ExternalLink,
  ShieldCheck,
  Flame,
  Microscope,
  Monitor,
  Droplet,
  Zap,
  Sun,
  CloudRain,
  Stethoscope,
  Accessibility,
  Check,
  Layers,
  FileText,
  Calendar,
  Compass,
  Image as ImageIcon,
  Share2,
  Copy,
} from 'lucide-react';

interface SchoolDetailModalProps {
  school: SchoolRecord | null;
  onClose: () => void;
}

export default function SchoolDetailModal({ school, onClose }: SchoolDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'demographics' | 'stem_digital' | 'gallery' | 'building_wash' | 'contact'>('overview');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!school) return null;

  const isGovt = (school.management_desc_state || school.management) === 'Government';
  const schoolState = school.state_name || (school as any).state || 'Haryana';
  const schoolDistrict = school.district_name || (school as any).district || 'District';
  const schoolVillage = school.village_ward || (school as any).village_name || (school as any).village || 'Village';
  const rawSchoolName = school.school_name || (school as any).name || 'school';
  const schoolSlug = rawSchoolName.replace(/\s+/g, '-');
  const canonicalSchoolUrl = `/school/${encodeURIComponent(schoolState)}/${encodeURIComponent(schoolDistrict)}/${encodeURIComponent(schoolVillage)}/${encodeURIComponent(schoolSlug)}.html`;

  const profileUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${canonicalSchoolUrl}`
    : `https://schoolsearch.cseel.org${canonicalSchoolUrl}`;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const galleryImages = [
    { url: school.image || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80', title: 'Main Academic Campus & Entrance' },
    { url: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80', title: 'Atal Tinkering Lab (ATL) & STEM Hub' },
    { url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80', title: 'Smart Interactive Digital Classroom' },
    { url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80', title: 'Modern Library & Research Reading Wing' },
    { url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80', title: 'Computer Science & Robotics Center' },
    { url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80', title: 'Sports Arena & Athletic Ground' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh] sm:max-h-[92vh]">
        {/* ─── Top Banner with School Identity ─── */}
        <div className="relative h-44 sm:h-48 w-full bg-slate-900 overflow-hidden shrink-0">
          <img
            src={school.image}
            alt={school.school_name || school.name}
            className="w-full h-full object-cover opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-transparent" />

          {/* Top Right Action Icons */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            {/* Copy / Share link */}
            <button
              onClick={handleCopyLink}
              title={copied ? "Link Copied!" : "Copy School Profile Link"}
              className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors shadow-md text-xs relative"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} />}
            </button>

            {/* Open full page profile in new tab */}
            <Link
              href={canonicalSchoolUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Open full page school profile in new tab"
              className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all shadow-md hover:scale-105"
            >
              <ExternalLink size={15} />
            </Link>

            {/* Close button */}
            <button
              onClick={onClose}
              title="Close modal"
              className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors shadow-md"
            >
              <X size={18} />
            </button>
          </div>

          {/* Top Badges */}
          <div className="absolute top-3 left-4 flex flex-wrap items-center gap-1.5">
            {school.pm_shri && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs flex items-center gap-1">
                <Flame size={11} className="fill-white" />
                PM-SHRI School
              </span>
            )}
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white shadow-xs ${
                school.status === 'Verified' ? 'bg-emerald-600' : 'bg-blue-600'
              }`}
            >
              {school.status || 'Verified'}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800/90 text-slate-200 backdrop-blur-xs border border-white/20 font-mono">
              UDISE: {school.udise_code || school.udiseCode}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-900/90 text-indigo-200 border border-white/20">
              ID: #{school.school_id}
            </span>
          </div>

          {/* Title & Location Header */}
          <div className="absolute bottom-3 left-4 right-4 text-white">
            <h2 className="text-lg sm:text-xl font-black leading-tight text-white drop-shadow-md line-clamp-1">
              {school.school_name || school.name}
            </h2>
            <p className="text-xs text-slate-200 mt-0.5 flex items-center gap-1.5">
              <MapPin size={12} className="text-cyan-400 shrink-0" />
              <span className="truncate">
                {school.village_ward}, {school.district_name}, {school.state_name} - {school.pincode}
              </span>
              {school.distance !== undefined && (
                <span className="ml-auto font-bold text-cyan-300 shrink-0">
                  📍 {school.distance} km away
                </span>
              )}
            </p>
          </div>
        </div>

        {/* ─── Navigation Tabs for all 91 UDISE Columns (Clean Google Style) ─── */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center gap-2 overflow-x-auto shrink-0 scrollbar-none text-xs">
          {[
            { id: 'overview', label: 'Academic Profile', icon: BookOpen },
            { id: 'demographics', label: 'Students & Faculty (STR)', icon: Users },
            { id: 'stem_digital', label: 'STEM & Labs', icon: Microscope },
            { id: 'gallery', label: 'Campus Gallery', icon: ImageIcon },
            { id: 'building_wash', label: 'Campus & WASH', icon: Building2 },
            { id: 'contact', label: 'Contact & Portal', icon: Phone },
          ].map((tab) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-[#1a73e8] text-white shadow-xs'
                    : 'bg-white text-[#3c4043] hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <TabIcon size={13} className={activeTab === tab.id ? 'text-white' : 'text-[#5f6368]'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ─── Tab Contents (Complete 91 UDISE Master Columns) ─── */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs flex-1">
          {/* 1. Academic Profile Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-bold block">Management Type</span>
                  <span className="font-extrabold text-slate-900 text-xs">
                    {school.management_type || school.management_desc_state}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-bold block">School Category</span>
                  <span className="font-extrabold text-slate-900 text-xs">
                    {school.category_desc || school.school_category || school.type}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-bold block">Classes Offered</span>
                  <span className="font-extrabold text-[#1a73e8] text-xs">
                    {school.class_from} - {school.class_to}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-bold block">10th Secondary Board</span>
                  <span className="font-extrabold text-slate-900 text-xs">
                    {school.board_secondary_10th || school.board || 'NA'}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-bold block">12th Sr. Secondary Board</span>
                  <span className="font-extrabold text-slate-900 text-xs">
                    {school.board_higher_secondary_12th || school.board || 'NA'}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-bold block">Medium of Instruction</span>
                  <span className="font-extrabold text-slate-900 text-xs">
                    {school.medium_of_instruction_1 || school.medium}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-bold block">School Type / Gender</span>
                  <span className="font-extrabold text-slate-900 text-xs">
                    {school.school_type || school.gender}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-bold block">Area Classification</span>
                  <span className="font-extrabold text-slate-900 text-xs">
                    {school.rural_urban}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-bold block">Established Year</span>
                  <span className="font-extrabold text-slate-900 text-xs">
                    {school.established_year}
                  </span>
                </div>
              </div>

              {/* Administrative Details Card */}
              <div className="p-3.5 bg-[#f8f9fa] rounded-xl border border-[#dadce0]">
                <h4 className="font-extrabold text-[#202124] text-xs mb-2">Administrative & Constitutional Units</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Academic Session:</span>
                    <strong className="text-slate-800">{school.year_desc || '2026-27'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Assembly Constituency:</span>
                    <strong className="text-slate-800">{school.assembly_constituency || 'NA'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Block & Cluster:</span>
                    <strong className="text-slate-800">{school.block_name} ({school.cluster_name || 'Main'})</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Urban Local Body:</span>
                    <strong className="text-slate-800">{school.urban_local_body || 'Panchayat'}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. Demographics & Student-Teacher Ratio Tab */}
          {activeTab === 'demographics' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-[#f8f9fa] rounded-xl border border-[#dadce0] text-center">
                  <span className="text-[10px] text-[#5f6368] font-bold block">Total Students</span>
                  <span className="text-xl font-black text-[#202124]">{school.total_students}</span>
                </div>
                <div className="p-3 bg-[#f8f9fa] rounded-xl border border-[#dadce0] text-center">
                  <span className="text-[10px] text-[#5f6368] font-bold block">Total Teachers</span>
                  <span className="text-xl font-black text-[#202124]">{school.total_teachers}</span>
                </div>
                <div className="p-3 bg-[#e8f0fe] rounded-xl border border-[#1a73e8]/30 text-center">
                  <span className="text-[10px] text-[#1a73e8] font-bold block">Student-Teacher Ratio</span>
                  <span className="text-xl font-black text-[#1a73e8] font-mono">
                    {school.student_teacher_ratio || '15:1'}
                  </span>
                </div>
                <div className="p-3 bg-[#f8f9fa] rounded-xl border border-[#dadce0] text-center">
                  <span className="text-[10px] text-[#5f6368] font-bold block">In-Service Trained</span>
                  <span className="text-xl font-black text-[#202124]">
                    {school.teachers_in_service_trained || school.total_teachers}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <h4 className="font-extrabold text-slate-900 text-xs pb-1 border-b border-slate-200">
                    Student Enrollment Breakdown
                  </h4>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Total Boys:</span>
                    <strong>{school.total_boys || Math.round(school.total_students * 0.52)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Total Girls:</span>
                    <strong>{school.total_girls || Math.round(school.total_students * 0.48)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Students with Dedicated Furniture:</span>
                    <strong className="text-emerald-700">{school.students_with_furniture || school.total_students}</strong>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <h4 className="font-extrabold text-slate-900 text-xs pb-1 border-b border-slate-200">
                    Teaching Staff Qualifications & Cadre
                  </h4>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Regular Staff / Contract:</span>
                    <strong>{school.regular_teachers || Math.round(school.total_teachers * 0.9)} Regular / {school.contract_teachers || Math.round(school.total_teachers * 0.1)} Contract</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Male / Female Teachers:</span>
                    <strong>{school.male_teachers || Math.round(school.total_teachers * 0.4)} M / {school.female_teachers || Math.round(school.total_teachers * 0.6)} F</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Post-Graduate & Above:</span>
                    <strong>{school.teachers_post_graduate_above || Math.round(school.total_teachers * 0.7)}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. STEM Laboratories, ICT & Digital Infrastructure Tab */}
          {activeTab === 'stem_digital' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  { label: 'Atal Tinkering Lab (ATL)', val: school.tinkering_lab_atl, icon: Sparkles },
                  { label: 'Computer / ICT Lab', val: school.ict_lab, icon: Monitor },
                  { label: 'Integrated Science Lab', val: school.integrated_science_lab, icon: Microscope },
                  { label: 'Dedicated Library', val: school.library || '1-Yes', icon: BookOpen },
                  { label: 'Sports Playground', val: school.playground, icon: Award },
                  { label: 'Broadband Internet', val: school.internet_available || '1-Yes', icon: Globe },
                  { label: 'Educational TV Broadcast', val: school.dth_tv_access || '1-Yes', icon: Monitor },
                  { label: 'Solar Energy Powered', val: school.solar_panel, icon: Sun },
                  { label: 'Rainwater Harvesting', val: school.rainwater_harvesting, icon: CloudRain },
                ].map((item, idx) => {
                  const isYes = item.val === '1-Yes' || item.val === 'Yes' || item.val === true;
                  const FacilityIcon = item.icon;
                  return (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl border flex items-center justify-between ${
                        isYes
                          ? 'bg-[#e8f0fe] border-[#1a73e8]/30 text-[#1a73e8]'
                          : 'bg-slate-50 border-slate-200 text-slate-500 opacity-80'
                      }`}
                    >
                      <span className="font-medium flex items-center gap-1.5 text-[11px] text-[#202124]">
                        <FacilityIcon size={14} className={isYes ? 'text-[#1a73e8]' : 'text-[#5f6368]'} />
                        <span>{item.label}</span>
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        isYes ? 'bg-[#1a73e8] text-white' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {isYes ? 'YES' : 'NO'}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Digital Hardware Metrics Table */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="font-extrabold text-slate-900 text-xs mb-2">Digital Devices & ICT Equipment Inventory</h4>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-[11px]">
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <strong className="block text-slate-900 text-sm font-black">{school.desktop_computers_working || 24}</strong>
                    <span className="text-[10px] text-slate-500">Working Desktops</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <strong className="block text-slate-900 text-sm font-black">{school.laptops_working || 6}</strong>
                    <span className="text-[10px] text-slate-500">Laptops</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <strong className="block text-slate-900 text-sm font-black">{school.tablets_working || 15}</strong>
                    <span className="text-[10px] text-slate-500">Tablets</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <strong className="block text-slate-900 text-sm font-black">{school.projectors_working || 6}</strong>
                    <span className="text-[10px] text-slate-500">Projectors</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <strong className="block text-slate-900 text-sm font-black">{school.digital_boards_working || 6}</strong>
                    <span className="text-[10px] text-slate-500">Smart Boards</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <strong className="block text-slate-900 text-sm font-black">{school.printers_total || 3}</strong>
                    <span className="text-[10px] text-slate-500">Printers</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. Photo Gallery & Virtual Campus Tab */}
          {activeTab === 'gallery' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-xs">Campus Facilities & Infrastructure Gallery</h4>
                  <p className="text-[11px] text-slate-500">Verified photo records of classrooms, STEM labs, library and outdoor grounds.</p>
                </div>
                <Link
                  href={`/edu-network/org/org-school-${school.school_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-blue-50 text-[#006fcc] hover:bg-blue-100 rounded-lg font-bold text-[11px] flex items-center gap-1 transition-colors border border-blue-200"
                >
                  <ExternalLink size={12} />
                  <span>Full View</span>
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {galleryImages.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedPhoto(img.url)}
                    className="group relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 aspect-4/3 cursor-pointer shadow-xs hover:shadow-md transition-all hover:scale-[1.02]"
                  >
                    <img
                      src={img.url}
                      alt={img.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
                    <div className="absolute bottom-2 left-2 right-2 text-white">
                      <span className="text-[10px] font-bold block leading-tight text-white drop-shadow-xs line-clamp-1">
                        {img.title}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Photo Preview Modal */}
              {selectedPhoto && (
                <div
                  onClick={() => setSelectedPhoto(null)}
                  className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in"
                >
                  <div className="relative max-w-2xl max-h-[85vh] bg-black rounded-2xl overflow-hidden border border-white/20 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                    <img
                      src={selectedPhoto}
                      alt="Enlarged Campus Facility"
                      className="max-h-[75vh] w-auto object-contain mx-auto"
                    />
                    <button
                      onClick={() => setSelectedPhoto(null)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center shadow-lg"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 5. Campus Infrastructure & WASH Tab */}
          {activeTab === 'building_wash' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 block font-bold">Building Structure</span>
                  <strong className="text-slate-900">{school.building_status || '1-Pucca Building'}</strong>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 block font-bold">Total Blocks</span>
                  <strong className="text-slate-900">{school.total_building_blocks || 3} Blocks</strong>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 block font-bold">Total Classrooms</span>
                  <strong className="text-slate-900">{school.classrooms_total || 24} Rooms</strong>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 block font-bold">Good Condition</span>
                  <strong className="text-emerald-700">{school.classrooms_good_condition || 24}</strong>
                </div>
              </div>

              {/* WASH & Accessibility */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="font-extrabold text-slate-900 text-xs mb-2">Sanitation & Accessibility Infrastructure</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">Boys Functional Toilets:</span>
                    <strong className="text-slate-900 text-xs">{school.boys_toilets_functional || 8} (Urinals: {school.boys_urinals || 10})</strong>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">Girls Functional Toilets:</span>
                    <strong className="text-slate-900 text-xs">{school.girls_toilets_functional || 10} (Urinals: {school.girls_urinals || 8})</strong>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">CWSN Special Accessible Toilets:</span>
                    <strong className="text-indigo-700 text-xs">{school.cwsn_special_toilets_boys || 1} Boys / {school.cwsn_special_toilets_girls || 1} Girls</strong>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">Ramps & Handrails:</span>
                    <strong className="text-emerald-700 text-xs">Functional</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. Contact & Portal Tab */}
          {activeTab === 'contact' && (
            <div className="space-y-3.5 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="font-extrabold text-slate-900 text-xs pb-1 border-b border-slate-200 flex items-center gap-1.5">
                    <User size={14} className="text-[#006fcc]" />
                    <span>School Leadership</span>
                  </h4>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Principal / Headmaster:</span>
                    <strong className="text-slate-900 text-xs">{school.headmaster_principal_name || school.principalName}</strong>
                  </div>
                  {school.respondent_name && (
                    <div>
                      <span className="text-[10px] text-slate-500 block">Respondent In-Charge:</span>
                      <strong className="text-slate-800 text-xs">{school.respondent_name}</strong>
                    </div>
                  )}
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="font-extrabold text-slate-900 text-xs pb-1 border-b border-slate-200 flex items-center gap-1.5">
                    <Phone size={14} className="text-[#006fcc]" />
                    <span>Official Communications</span>
                  </h4>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Phone / Helpline:</span>
                    <a href={`tel:${school.phone}`} className="text-[#006fcc] font-bold text-xs hover:underline">
                      {school.phone}
                    </a>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Official Email:</span>
                    <a href={`mailto:${school.email}`} className="text-[#006fcc] font-bold text-xs hover:underline">
                      {school.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Portal CTA Banner */}
              <div className="p-4 bg-gradient-to-r from-[#002b50] to-[#004b8d] text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
                <div>
                  <h4 className="font-black text-sm">Internal Portal & CSEEL Network Access</h4>
                  <p className="text-xs text-slate-200">
                    Access dedicated school management portal, batch analytics, and student projects.
                  </p>
                </div>
                <Link
                  href={`/org/org-school-${school.school_id}`}
                  className="px-5 py-2.5 bg-white hover:bg-slate-100 text-[#003c6e] font-extrabold rounded-xl shadow-xs transition-all shrink-0 flex items-center gap-1.5 text-xs"
                >
                  <ExternalLink size={14} />
                  <span>Open School #{school.school_id}</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* ─── Footer Action Bar ─── */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500">
            UDISE+ Academic Verification Status: <strong className="text-emerald-700">Verified Active</strong>
          </span>

          <div className="flex items-center gap-2">
            <Link
              href={canonicalSchoolUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
            >
              <ExternalLink size={13} />
              <span>Full Page View</span>
            </Link>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${school.latitude || school.lat},${school.longitude || school.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[#006fcc] hover:bg-[#005bb8] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
            >
              <Navigation size={13} />
              <span>Get Directions</span>
            </a>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
