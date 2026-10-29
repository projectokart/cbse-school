'use client';

import React, { useState, useEffect } from 'react';
import {
  Award,
  GraduationCap,
  TrendingUp,
  Users,
  CheckCircle2,
  Calendar,
  Sparkles,
  Edit3,
  X,
  Plus,
  Trash2,
  HelpCircle,
  FlaskConical,
  Briefcase,
  Palette
} from 'lucide-react';
import {
  SchoolBoardResultsState,
  BoardExamYearResult,
  Class12BoardExamYearResult,
  StreamExamResult
} from './SchoolTemplateContext';

interface SchoolBoardResultsSectionProps {
  boardResults?: SchoolBoardResultsState;
  classTo?: string;
  boardName?: string;
  schoolName?: string;
  isEditMode?: boolean;
  onSaveResults?: (newResults: SchoolBoardResultsState) => void;
}

// Helper to determine if school has Senior Secondary classes (Class 11 & 12)
export function isSeniorSecondarySchool(classToStr: string | undefined): boolean {
  if (!classToStr) return true; // Default to showing both if unspecified
  const lower = classToStr.toLowerCase().trim();
  const digits = lower.replace(/\D/g, '');
  const num = parseInt(digits, 10);
  if (!isNaN(num)) {
    return num >= 11;
  }
  return lower.includes('12') || lower.includes('senior') || lower.includes('inter') || lower.includes('higher');
}

// Auto-calculate pass percentage strictly
export function calculatePassRate(passed: number, total: number): number {
  if (!total || total <= 0) return 0;
  const pct = (passed / total) * 100;
  return parseFloat(Math.min(100, Math.max(0, pct)).toFixed(1));
}

// Clean initial state when no official board results have been submitted
const FALLBACK_10TH_RESULTS: BoardExamYearResult[] = [];
const FALLBACK_12TH_RESULTS: Class12BoardExamYearResult[] = [];

const PREDEFINED_STREAMS = [
  { name: 'Science', icon: FlaskConical, badgeColor: 'bg-blue-50 text-blue-700 border-blue-200' },
  { name: 'Commerce', icon: Briefcase, badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { name: 'Humanities / Arts', icon: Palette, badgeColor: 'bg-purple-50 text-purple-700 border-purple-200' },
];

export const PREDEFINED_ACADEMIC_YEARS = [
  { value: '2024-25', label: '2024-25 (Latest)' },
  { value: '2023-24', label: '2023-24 (Previous Year)' },
  { value: '2022-23', label: '2022-23 (Last 2nd Year)' },
  { value: '2021-22', label: '2021-22' },
  { value: '2025-26', label: '2025-26 (Upcoming)' },
];

export const getAvailableNextYear = (existingYears: string[]) => {
  const defaults = ['2024-25', '2023-24', '2022-23', '2021-22', '2025-26'];
  for (const y of defaults) {
    if (!existingYears.includes(y)) return y;
  }
  return '2020-21';
};

export default function SchoolBoardResultsSection({
  boardResults,
  classTo = 'Class 12th',
  boardName = 'CBSE',
  schoolName = 'School',
  isEditMode = false,
  onSaveResults,
}: SchoolBoardResultsSectionProps) {
  const isSeniorSec = isSeniorSecondarySchool(classTo);

  // Active internal state synced with props
  const [internalBoardResults, setInternalBoardResults] = useState<SchoolBoardResultsState>(() => ({
    class10Results: boardResults?.class10Results || [],
    class12Results: boardResults?.class12Results || [],
  }));

  useEffect(() => {
    if (boardResults) {
      setInternalBoardResults({
        class10Results: boardResults.class10Results || [],
        class12Results: boardResults.class12Results || [],
      });
    }
  }, [boardResults]);

  const c10Data: BoardExamYearResult[] = internalBoardResults.class10Results || [];
  const c12Data: Class12BoardExamYearResult[] = internalBoardResults.class12Results || [];

  // Selected Year for Stream Breakdown view
  const [selected12thYear, setSelected12thYear] = useState<string>(c12Data[0]?.year || '2024-25');

  useEffect(() => {
    if (c12Data.length > 0 && !c12Data.some(y => y.year === selected12thYear)) {
      setSelected12thYear(c12Data[0].year);
    }
  }, [c12Data, selected12thYear]);

  // Modal State for Predefined Strict Editing
  const [editingModal, setEditingModal] = useState<'10th' | '12th' | null>(null);

  // Strict modal working copies
  const [modal10thRows, setModal10thRows] = useState<BoardExamYearResult[]>([]);
  const [modal12thRows, setModal12thRows] = useState<Class12BoardExamYearResult[]>([]);

  const handleOpen10thEdit = () => {
    if (c10Data.length > 0) {
      setModal10thRows(JSON.parse(JSON.stringify(c10Data)));
    } else {
      setModal10thRows([
        {
          year: '2024-25',
          totalStudents: 100,
          passedStudents: 98,
          passPercentage: 98,
          maxScorePercent: 98.4,
          above90PercentCount: 35,
        }
      ]);
    }
    setEditingModal('10th');
  };

  const handleOpen12thEdit = () => {
    if (c12Data.length > 0) {
      setModal12thRows(JSON.parse(JSON.stringify(c12Data)));
    } else {
      setModal12thRows([
        {
          year: '2024-25',
          totalStudents: 120,
          passedStudents: 118,
          passPercentage: 98.3,
          maxScorePercent: 99.2,
          above90PercentCount: 52,
          streams: [
            { streamName: 'Science', totalStudents: 50, passedStudents: 49, passPercentage: 98, maxScorePercent: 99.2, above90PercentCount: 28 },
            { streamName: 'Commerce', totalStudents: 40, passedStudents: 39, passPercentage: 97.5, maxScorePercent: 97.6, above90PercentCount: 16 },
            { streamName: 'Humanities / Arts', totalStudents: 30, passedStudents: 30, passPercentage: 100, maxScorePercent: 98.0, above90PercentCount: 8 }
          ]
        }
      ]);
    }
    setEditingModal('12th');
  };

  const handleAdd10thYearRow = () => {
    if (modal10thRows.length >= 3) return;
    const nextYear = modal10thRows.length === 1 ? '2023-24' : '2022-23';
    setModal10thRows([
      ...modal10thRows,
      {
        year: nextYear,
        totalStudents: 100,
        passedStudents: 96,
        passPercentage: 96,
        maxScorePercent: 97.8,
        above90PercentCount: 28,
      }
    ]);
  };

  const handleRemove10thYearRow = (idx: number) => {
    setModal10thRows(modal10thRows.filter((_, i) => i !== idx));
  };

  const handleAdd12thYearRow = () => {
    if (modal12thRows.length >= 3) return;
    const nextYear = modal12thRows.length === 1 ? '2023-24' : '2022-23';
    setModal12thRows([
      ...modal12thRows,
      {
        year: nextYear,
        totalStudents: 110,
        passedStudents: 108,
        passPercentage: 98.1,
        maxScorePercent: 98.6,
        above90PercentCount: 40,
        streams: [
          { streamName: 'Science', totalStudents: 45, passedStudents: 44, passPercentage: 97.7, maxScorePercent: 98.6, above90PercentCount: 20 },
          { streamName: 'Commerce', totalStudents: 35, passedStudents: 34, passPercentage: 97.1, maxScorePercent: 96.5, above90PercentCount: 12 },
          { streamName: 'Humanities / Arts', totalStudents: 30, passedStudents: 30, passPercentage: 100, maxScorePercent: 97.0, above90PercentCount: 8 }
        ]
      }
    ]);
  };

  const handleRemove12thYearRow = (idx: number) => {
    setModal12thRows(modal12thRows.filter((_, i) => i !== idx));
  };

  const publicC10Data = c10Data.filter(r => (Number(r.totalStudents) > 0 || Number(r.passedStudents) > 0));
  const publicC12Data = c12Data.filter(r => (Number(r.totalStudents) > 0 || Number(r.passedStudents) > 0));
  const displayedC10Rows = isEditMode ? c10Data : publicC10Data;
  const displayedC12Rows = isEditMode ? c12Data : publicC12Data;

  const update10thInlineCell = (idx: number, field: keyof BoardExamYearResult, val: any) => {
    const updated = [...c10Data];
    updated[idx] = { ...updated[idx], [field]: val };
    const total = Number(updated[idx].totalStudents) || 0;
    const passed = Number(updated[idx].passedStudents) || 0;
    updated[idx].passPercentage = calculatePassRate(passed, total);
    const nextState = {
      class10Results: updated,
      class12Results: c12Data,
    };
    setInternalBoardResults(nextState);
    if (onSaveResults) onSaveResults(nextState);
  };

  const remove10thInlineRow = (idx: number) => {
    const updated = c10Data.filter((_, i) => i !== idx);
    const nextState = {
      class10Results: updated,
      class12Results: c12Data,
    };
    setInternalBoardResults(nextState);
    if (onSaveResults) onSaveResults(nextState);
  };

  const add10thInlineRow = () => {
    if (c10Data.length >= 3) return;
    const existingYears = c10Data.map(r => r.year);
    const nextYear = getAvailableNextYear(existingYears);
    const updated = [
      ...c10Data,
      {
        year: nextYear,
        totalStudents: 100,
        passedStudents: 98,
        passPercentage: 98,
        maxScorePercent: 98.4,
        above90PercentCount: 35,
      }
    ];
    const nextState = {
      class10Results: updated,
      class12Results: c12Data,
    };
    setInternalBoardResults(nextState);
    if (onSaveResults) onSaveResults(nextState);
  };

  const update12thInlineCell = (idx: number, field: keyof Class12BoardExamYearResult, val: any) => {
    const updated = [...c12Data];
    updated[idx] = { ...updated[idx], [field]: val };
    const total = Number(updated[idx].totalStudents) || 0;
    const passed = Number(updated[idx].passedStudents) || 0;
    updated[idx].passPercentage = calculatePassRate(passed, total);
    const nextState = {
      class10Results: c10Data,
      class12Results: updated,
    };
    setInternalBoardResults(nextState);
    if (onSaveResults) onSaveResults(nextState);
  };

  const remove12thInlineRow = (idx: number) => {
    const updated = c12Data.filter((_, i) => i !== idx);
    const nextState = {
      class10Results: c10Data,
      class12Results: updated,
    };
    setInternalBoardResults(nextState);
    if (onSaveResults) onSaveResults(nextState);
  };

  const add12thInlineRow = () => {
    if (c12Data.length >= 3) return;
    const existingYears = c12Data.map(r => r.year);
    const nextYear = getAvailableNextYear(existingYears);
    const updated = [
      ...c12Data,
      {
        year: nextYear,
        totalStudents: 120,
        passedStudents: 118,
        passPercentage: 98.3,
        maxScorePercent: 99.2,
        above90PercentCount: 52,
        streams: PREDEFINED_STREAMS.map(s => ({
          streamName: s.name,
          totalStudents: 40,
          passedStudents: 39,
          passPercentage: 97.5,
          maxScorePercent: 98.0,
          above90PercentCount: 15,
        })),
      }
    ];
    const nextState = {
      class10Results: c10Data,
      class12Results: updated,
    };
    setInternalBoardResults(nextState);
    if (onSaveResults) onSaveResults(nextState);
  };

  const handlePrefill3Years10th = () => {
    setModal10thRows([
      { year: '2024-25', totalStudents: 100, passedStudents: 98, passPercentage: 98, maxScorePercent: 98.4, above90PercentCount: 35 },
      { year: '2023-24', totalStudents: 95, passedStudents: 93, passPercentage: 97.8, maxScorePercent: 97.6, above90PercentCount: 28 },
      { year: '2022-23', totalStudents: 90, passedStudents: 88, passPercentage: 97.7, maxScorePercent: 96.8, above90PercentCount: 22 },
    ]);
  };

  const handlePrefill3Years12th = () => {
    setModal12thRows([
      {
        year: '2024-25', totalStudents: 120, passedStudents: 118, passPercentage: 98.3, maxScorePercent: 99.2, above90PercentCount: 52,
        streams: [
          { streamName: 'Science', totalStudents: 50, passedStudents: 49, passPercentage: 98, maxScorePercent: 99.2, above90PercentCount: 28 },
          { streamName: 'Commerce', totalStudents: 40, passedStudents: 39, passPercentage: 97.5, maxScorePercent: 97.6, above90PercentCount: 16 },
          { streamName: 'Humanities / Arts', totalStudents: 30, passedStudents: 30, passPercentage: 100, maxScorePercent: 98.0, above90PercentCount: 8 }
        ]
      },
      {
        year: '2023-24', totalStudents: 110, passedStudents: 107, passPercentage: 97.2, maxScorePercent: 98.4, above90PercentCount: 42,
        streams: [
          { streamName: 'Science', totalStudents: 45, passedStudents: 44, passPercentage: 97.7, maxScorePercent: 98.4, above90PercentCount: 22 },
          { streamName: 'Commerce', totalStudents: 38, passedStudents: 37, passPercentage: 97.3, maxScorePercent: 96.8, above90PercentCount: 13 },
          { streamName: 'Humanities / Arts', totalStudents: 27, passedStudents: 26, passPercentage: 96.2, maxScorePercent: 97.0, above90PercentCount: 7 }
        ]
      },
      {
        year: '2022-23', totalStudents: 100, passedStudents: 97, passPercentage: 97.0, maxScorePercent: 97.8, above90PercentCount: 35,
        streams: [
          { streamName: 'Science', totalStudents: 40, passedStudents: 39, passPercentage: 97.5, maxScorePercent: 97.8, above90PercentCount: 18 },
          { streamName: 'Commerce', totalStudents: 35, passedStudents: 34, passPercentage: 97.1, maxScorePercent: 96.0, above90PercentCount: 11 },
          { streamName: 'Humanities / Arts', totalStudents: 25, passedStudents: 24, passPercentage: 96.0, maxScorePercent: 96.2, above90PercentCount: 6 }
        ]
      }
    ]);
  };

  const handleSaveModal = () => {
    let nextState: SchoolBoardResultsState = {
      class10Results: c10Data,
      class12Results: c12Data,
    };

    if (editingModal === '10th') {
      const sanitized = modal10thRows.slice(0, 3).map((r) => {
        const total = Number(r.totalStudents) || 0;
        const passed = Number(r.passedStudents) || 0;
        return {
          year: r.year.trim() || '2024-25',
          totalStudents: total,
          passedStudents: Math.min(passed, total),
          passPercentage: calculatePassRate(passed, total),
          maxScorePercent: Math.min(100, Math.max(0, Number(r.maxScorePercent) || 0)),
          above90PercentCount: Math.min(total, Math.max(0, Number(r.above90PercentCount) || 0)),
        };
      });
      nextState = {
        class10Results: sanitized,
        class12Results: c12Data,
      };
    } else if (editingModal === '12th') {
      const sanitized = modal12thRows.slice(0, 3).map((r) => {
        const total = Number(r.totalStudents) || 0;
        const passed = Number(r.passedStudents) || 0;
        const cleanStreams = (r.streams || []).map((s) => {
          const sTotal = Number(s.totalStudents) || 0;
          const sPassed = Number(s.passedStudents) || 0;
          return {
            streamName: s.streamName || 'Science',
            totalStudents: sTotal,
            passedStudents: Math.min(sPassed, sTotal),
            passPercentage: calculatePassRate(sPassed, sTotal),
            maxScorePercent: Math.min(100, Math.max(0, Number(s.maxScorePercent) || 0)),
            above90PercentCount: Math.min(sTotal, Math.max(0, Number(s.above90PercentCount) || 0)),
          };
        });
        return {
          year: r.year.trim() || '2024-25',
          totalStudents: total,
          passedStudents: Math.min(passed, total),
          passPercentage: calculatePassRate(passed, total),
          maxScorePercent: Math.min(100, Math.max(0, Number(r.maxScorePercent) || 0)),
          above90PercentCount: Math.min(total, Math.max(0, Number(r.above90PercentCount) || 0)),
          streams: cleanStreams,
        };
      });
      nextState = {
        class10Results: c10Data,
        class12Results: sanitized,
      };
    }

    setInternalBoardResults(nextState);
    if (onSaveResults) {
      onSaveResults(nextState);
    }
    setEditingModal(null);
  };

  const active12thYearObj = c12Data.find((y) => y.year === selected12thYear) || c12Data[0];

  return (
    <div id="board-results" className="my-10 scroll-mt-24">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#005689] bg-[#EDF5FA] border border-[#D6EDFF] px-3.5 py-1.5 rounded-full mb-3 shadow-2xs">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>Academic Performance Records</span>
          </div>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-950 tracking-tight leading-tight">
            Verified Examination Records
            <span className="text-[#005689] block mt-1">Board Examination Results &amp; Merit Analytics</span>
          </h3>
          <p className="text-sm text-slate-600 mt-2 font-medium">
            Verified official {boardName} board results for {schoolName} (Up to 3 Academic Sessions).
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Official Records</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#EDF5FA] border border-[#D6EDFF] text-[#005689] text-xs font-bold shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-[#005689]" />
            <span>Up to 3 Years</span>
          </span>
        </div>
      </div>

      <div className="space-y-10">
        {/* ========================================================= */}
        {/* TABLE 1: CLASS 10TH BOARD EXAMINATION RESULTS            */}
        {/* ========================================================= */}
        <div className="bg-white/95 rounded-[32px] sm:rounded-[36px] border border-[#F4EBD9] shadow-[0_12px_36px_rgba(0,35,70,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] overflow-hidden">
          {/* Table Header Bar */}
          <div className="px-6 py-5 bg-gradient-to-r from-[#002B49] via-[#005689] to-[#004168] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 shadow-xs">
                <GraduationCap className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h4 className="font-black text-base sm:text-lg tracking-wide flex items-center gap-2.5">
                  <span>Class 10th Board Results (Secondary Examination)</span>
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 uppercase tracking-wider">
                    10th Board
                  </span>
                </h4>
                <p className="text-xs text-blue-100 mt-0.5 font-medium">
                  Affiliated Curriculum: {boardName} | Pass rate auto-calculated from total appeared &amp; passed students
                </p>
              </div>
            </div>

            {isEditMode && (
              <button
                onClick={handleOpen10thEdit}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-blue-50 text-[#005689] text-xs font-black transition-all border border-white/60 shadow-md cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add 10th Class Result</span>
              </button>
            )}
          </div>

          {/* Clean Fixed-Column Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/90 text-slate-700 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3.5 px-4 font-extrabold text-slate-900">Academic Year</th>
                  <th className="py-3.5 px-4">Total Appeared</th>
                  <th className="py-3.5 px-4">Students Passed</th>
                  <th className="py-3.5 px-4 text-center">Pass Percentage</th>
                  <th className="py-3.5 px-4 text-center">School Top Score</th>
                  <th className="py-3.5 px-4 text-right">90% & Above Scorers</th>
                  {isEditMode && <th className="py-3.5 px-3 text-center w-12">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {displayedC10Rows.length === 0 ? (
                  <tr>
                    <td colSpan={isEditMode ? 7 : 6} className="py-10 text-center">
                      <p className="text-xs text-slate-500 font-medium mb-3">
                        Official Class 10th board examination performance records to be published by the institution.
                      </p>
                      {isEditMode && (
                        <div className="flex flex-wrap items-center justify-center gap-2.5">
                          <button
                            onClick={handleOpen10thEdit}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#005689] hover:bg-[#004168] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Add 10th Class Result (Form Modal)</span>
                          </button>
                          <button
                            onClick={add10thInlineRow}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-300 shadow-2xs transition-all cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>+ Direct Add in Table</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ) : (
                  displayedC10Rows.map((row, idx) => {
                    const passRate = calculatePassRate(row.passedStudents, row.totalStudents);
                    const isHundred = passRate >= 100;
                    const above90Ratio = row.totalStudents > 0
                      ? ((row.above90PercentCount / row.totalStudents) * 100).toFixed(1)
                      : '0';

                    return (
                      <tr key={idx} className="hover:bg-blue-50/40 transition-colors">
                        {/* Year */}
                        <td className="py-3 px-4 font-bold text-slate-950">
                          {isEditMode ? (
                            <select
                              value={row.year}
                              onChange={(e) => update10thInlineCell(idx, 'year', e.target.value)}
                              className="px-2.5 py-1.5 text-xs font-bold rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:border-[#005689]"
                            >
                              {PREDEFINED_ACADEMIC_YEARS.map(y => (
                                <option key={y.value} value={y.value}>{y.label}</option>
                              ))}
                              {!PREDEFINED_ACADEMIC_YEARS.some(y => y.value === row.year) && (
                                <option value={row.year}>{row.year}</option>
                              )}
                            </select>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-[#005689]" />
                              <span className="text-sm font-black">{row.year}</span>
                              {idx === 0 && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-[#005689]">
                                  Latest
                                </span>
                              )}
                            </div>
                          )}
                        </td>

                        {/* Total Appeared */}
                        <td className="py-3 px-4 font-semibold text-slate-700">
                          {isEditMode ? (
                            <input
                              type="number"
                              value={row.totalStudents || ''}
                              onChange={(e) => update10thInlineCell(idx, 'totalStudents', parseInt(e.target.value, 10) || 0)}
                              placeholder="Total"
                              className="w-24 px-2.5 py-1.5 text-xs font-bold rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:border-[#005689]"
                            />
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <Users className="w-4 h-4 text-slate-400" />
                              <span>{row.totalStudents} Students</span>
                            </div>
                          )}
                        </td>

                        {/* Passed Students */}
                        <td className="py-3 px-4 font-semibold text-slate-700">
                          {isEditMode ? (
                            <input
                              type="number"
                              value={row.passedStudents || ''}
                              onChange={(e) => update10thInlineCell(idx, 'passedStudents', parseInt(e.target.value, 10) || 0)}
                              placeholder="Passed"
                              className="w-24 px-2.5 py-1.5 text-xs font-bold rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:border-[#005689]"
                            />
                          ) : (
                            <div className="flex items-center gap-1.5 text-emerald-700">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span>{row.passedStudents} Passed</span>
                            </div>
                          )}
                        </td>

                        {/* Pass Percentage */}
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black tracking-wide ${
                              isHundred
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                : 'bg-blue-100 text-blue-900 border border-blue-200'
                            }`}
                          >
                            <TrendingUp className="w-3.5 h-3.5" />
                            <span>{passRate}% Pass</span>
                          </span>
                        </td>

                        {/* Top Score */}
                        <td className="py-3 px-4 text-center">
                          {isEditMode ? (
                            <input
                              type="number"
                              step="0.1"
                              value={row.maxScorePercent || ''}
                              onChange={(e) => update10thInlineCell(idx, 'maxScorePercent', parseFloat(e.target.value) || 0)}
                              placeholder="Topper %"
                              className="w-20 px-2 py-1.5 text-xs font-bold rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:border-[#005689] text-center"
                            />
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 font-extrabold text-xs">
                              <Award className="w-3.5 h-3.5 text-amber-500" />
                              <span>{row.maxScorePercent}%</span>
                            </span>
                          )}
                        </td>

                        {/* Above 90% */}
                        <td className={`py-3 px-4 ${isEditMode ? 'text-center' : 'text-right'}`}>
                          {isEditMode ? (
                            <input
                              type="number"
                              value={row.above90PercentCount || ''}
                              onChange={(e) => update10thInlineCell(idx, 'above90PercentCount', parseInt(e.target.value, 10) || 0)}
                              placeholder="90%+ Count"
                              className="w-20 px-2 py-1.5 text-xs font-bold rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:border-[#005689] text-center"
                            />
                          ) : (
                            <div className="inline-block text-right">
                              <span className="font-black text-slate-900 text-sm">{row.above90PercentCount}</span>
                              <span className="text-slate-500 text-xs ml-1 font-medium">({above90Ratio}%)</span>
                            </div>
                          )}
                        </td>

                        {/* Action Column for isEditMode */}
                        {isEditMode && (
                          <td className="py-3 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => remove10thInlineRow(idx)}
                              className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete row"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Edit Mode Quick Add Row Ribbon */}
          {isEditMode && (
            <div className="px-6 py-3 bg-slate-50/80 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] text-slate-500 font-semibold">
                💡 Public ko sirf wahi rows dikhengi jisme students data fill kiya gaya hai ({publicC10Data.length} row(s) published).
              </span>
              <button
                type="button"
                onClick={add10thInlineRow}
                disabled={c10Data.length >= 3}
                className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-blue-50 text-[#005689] text-xs font-bold flex items-center gap-1.5 shadow-2xs disabled:opacity-50 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Row Direct in Table (Max 3)</span>
              </button>
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* TABLE 2: CLASS 12TH BOARD EXAMINATION RESULTS            */}
        {/* (Only rendered if school is Senior Secondary)            */}
        {/* ========================================================= */}
        {isSeniorSec ? (
          <div className="bg-white/95 rounded-[32px] sm:rounded-[36px] border border-[#F4EBD9] shadow-[0_12px_36px_rgba(0,35,70,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] overflow-hidden">
            {/* Table Header Bar */}
            <div className="px-6 py-5 bg-gradient-to-r from-emerald-950 via-[#0A4D68] to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 shadow-xs">
                  <Award className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-black text-base sm:text-lg tracking-wide flex items-center gap-2.5">
                    <span>Class 12th Board Results (Senior Secondary Examination)</span>
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-400 text-slate-950 uppercase tracking-wider">
                      12th Board
                    </span>
                  </h4>
                  <p className="text-xs text-emerald-100 mt-0.5 font-medium">
                    Comprehensive School-Level &amp; Stream-Wise (Science, Commerce &amp; Humanities) Merit Records
                  </p>
                </div>
              </div>

              {isEditMode && (
                <button
                  onClick={handleOpen12thEdit}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-emerald-50 text-emerald-950 text-xs font-black transition-all border border-white/60 shadow-md cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add 12th Class Result</span>
                </button>
              )}
            </div>

            {/* Overall Class 12 Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/90 text-slate-700 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                    <th className="py-3.5 px-4 font-extrabold text-slate-900">Academic Year</th>
                    <th className="py-3.5 px-4">Total Appeared</th>
                    <th className="py-3.5 px-4">Students Passed</th>
                    <th className="py-3.5 px-4 text-center">Overall Pass %</th>
                    <th className="py-3.5 px-4 text-center">School Topper %</th>
                    <th className="py-3.5 px-4 text-right">90% & Above Scorers</th>
                    {isEditMode && <th className="py-3.5 px-3 text-center w-12">Action</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {displayedC12Rows.length === 0 ? (
                    <tr>
                      <td colSpan={isEditMode ? 7 : 6} className="py-10 text-center">
                        <p className="text-xs text-slate-500 font-medium mb-3">
                          Official Class 12th Senior Secondary board examination performance records to be published by the institution.
                        </p>
                        {isEditMode && (
                          <div className="flex flex-wrap items-center justify-center gap-2.5">
                            <button
                              onClick={handleOpen12thEdit}
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                            >
                              <Plus className="w-4 h-4" />
                              <span>Add 12th Class Result (Form Modal)</span>
                            </button>
                            <button
                              onClick={add12thInlineRow}
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-300 shadow-2xs transition-all cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>+ Direct Add in Table</span>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ) : (
                    displayedC12Rows.map((row, idx) => {
                      const passRate = calculatePassRate(row.passedStudents, row.totalStudents);
                      const isHundred = passRate >= 100;
                      const above90Ratio = row.totalStudents > 0
                        ? ((row.above90PercentCount / row.totalStudents) * 100).toFixed(1)
                        : '0';

                      return (
                        <tr key={idx} className="hover:bg-emerald-50/30 transition-colors">
                          {/* Year */}
                          <td className="py-3 px-4 font-bold text-slate-950">
                            {isEditMode ? (
                              <select
                                value={row.year}
                                onChange={(e) => update12thInlineCell(idx, 'year', e.target.value)}
                                className="px-2.5 py-1.5 text-xs font-bold rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:border-emerald-700"
                              >
                                {PREDEFINED_ACADEMIC_YEARS.map(y => (
                                  <option key={y.value} value={y.value}>{y.label}</option>
                                ))}
                                {!PREDEFINED_ACADEMIC_YEARS.some(y => y.value === row.year) && (
                                  <option value={row.year}>{row.year}</option>
                                )}
                              </select>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                                <span className="text-sm font-black">{row.year}</span>
                                {idx === 0 && (
                                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                                    Latest
                                  </span>
                                )}
                              </div>
                            )}
                          </td>

                          {/* Total Appeared */}
                          <td className="py-3 px-4 font-semibold text-slate-700">
                            {isEditMode ? (
                              <input
                                type="number"
                                value={row.totalStudents || ''}
                                onChange={(e) => update12thInlineCell(idx, 'totalStudents', parseInt(e.target.value, 10) || 0)}
                                placeholder="Total Students"
                                className="w-24 px-2.5 py-1.5 text-xs font-bold rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:border-emerald-700"
                              />
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <Users className="w-4 h-4 text-slate-400" />
                                <span>{row.totalStudents} Students</span>
                              </div>
                            )}
                          </td>

                          {/* Passed */}
                          <td className="py-3 px-4 font-semibold text-slate-700">
                            {isEditMode ? (
                              <input
                                type="number"
                                value={row.passedStudents || ''}
                                onChange={(e) => update12thInlineCell(idx, 'passedStudents', parseInt(e.target.value, 10) || 0)}
                                placeholder="Passed"
                                className="w-24 px-2.5 py-1.5 text-xs font-bold rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:border-emerald-700"
                              />
                            ) : (
                              <div className="flex items-center gap-1.5 text-emerald-700">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                <span>{row.passedStudents} Passed</span>
                              </div>
                            )}
                          </td>

                          {/* Pass Percentage */}
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black tracking-wide ${
                                isHundred
                                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                  : 'bg-blue-100 text-blue-900 border border-blue-200'
                              }`}
                            >
                              <TrendingUp className="w-3.5 h-3.5" />
                              <span>{passRate}% Pass</span>
                            </span>
                          </td>

                          {/* Topper Score */}
                          <td className="py-3 px-4 text-center">
                            {isEditMode ? (
                              <input
                                type="number"
                                step="0.1"
                                value={row.maxScorePercent || ''}
                                onChange={(e) => update12thInlineCell(idx, 'maxScorePercent', parseFloat(e.target.value) || 0)}
                                placeholder="Topper %"
                                className="w-20 px-2 py-1.5 text-xs font-bold rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:border-emerald-700 text-center"
                              />
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 font-extrabold text-xs">
                                <Award className="w-3.5 h-3.5 text-amber-500" />
                                <span>{row.maxScorePercent}%</span>
                              </span>
                            )}
                          </td>

                          {/* Above 90% */}
                          <td className={`py-3 px-4 ${isEditMode ? 'text-center' : 'text-right'}`}>
                            {isEditMode ? (
                              <input
                                type="number"
                                value={row.above90PercentCount || ''}
                                onChange={(e) => update12thInlineCell(idx, 'above90PercentCount', parseInt(e.target.value, 10) || 0)}
                                placeholder="90%+ Count"
                                className="w-20 px-2 py-1.5 text-xs font-bold rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:border-emerald-700 text-center"
                              />
                            ) : (
                              <div className="inline-block text-right">
                                <span className="font-black text-slate-900 text-sm">{row.above90PercentCount}</span>
                                <span className="text-slate-500 text-xs ml-1 font-medium">({above90Ratio}%)</span>
                              </div>
                            )}
                          </td>

                          {/* Action Column for isEditMode */}
                          {isEditMode && (
                            <td className="py-3 px-2 text-center">
                              <button
                                type="button"
                                onClick={() => remove12thInlineRow(idx)}
                                className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                title="Delete row"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          )}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Edit Mode Quick Add Row Ribbon */}
            {isEditMode && (
              <div className="px-6 py-3 bg-slate-50/80 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] text-slate-500 font-semibold">
                  💡 Public ko sirf wahi rows dikhengi jisme students data fill kiya gaya hai ({publicC12Data.length} row(s) published).
                </span>
                <button
                  type="button"
                  onClick={add12thInlineRow}
                  disabled={c12Data.length >= 3}
                  className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-1.5 shadow-2xs disabled:opacity-50 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Row Direct in Table (Max 3)</span>
                </button>
              </div>
            )}

            {/* Stream-Wise Breakdown Table - only rendered when real stream data exists */}
            {c12Data.length > 0 && active12thYearObj?.streams && active12thYearObj.streams.length > 0 && (
              <div className="p-4 sm:p-5 bg-slate-50/70 border-t border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#005689]" />
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                      Stream-Wise Breakdown ({selected12thYear})
                    </span>
                  </div>

                  {/* Session selector tabs */}
                  <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-slate-200 shadow-2xs">
                    {c12Data.map((yr) => (
                      <button
                        key={yr.year}
                        onClick={() => setSelected12thYear(yr.year)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          selected12thYear === yr.year
                            ? 'bg-[#005689] text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                        }`}
                      >
                        Session {yr.year}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Strict Stream Table */}
                <div className="overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100/80 text-slate-700 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                        <th className="py-2.5 px-4 font-extrabold text-slate-900">Stream</th>
                        <th className="py-2.5 px-4">Appeared</th>
                        <th className="py-2.5 px-4">Passed</th>
                        <th className="py-2.5 px-4 text-center">Stream Pass %</th>
                        <th className="py-2.5 px-4 text-center">Stream Topper</th>
                        <th className="py-2.5 px-4 text-right">90%+ Students</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {active12thYearObj.streams.map((st, sIdx) => {
                        const stPass = calculatePassRate(st.passedStudents, st.totalStudents);
                        const isStHundred = stPass >= 100;
                        const pred = PREDEFINED_STREAMS.find(
                          (p) => p.name.toLowerCase().includes(st.streamName.toLowerCase()) || st.streamName.toLowerCase().includes(p.name.toLowerCase())
                        );
                        const IconComp = pred ? pred.icon : FlaskConical;

                        return (
                          <tr key={sIdx} className="hover:bg-slate-50 transition-colors">
                            <td className="py-3 px-4 font-bold text-slate-950">
                              <div className="flex items-center gap-2">
                                <span className={`p-1 rounded-md border ${pred?.badgeColor || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                                  <IconComp className="w-3.5 h-3.5" />
                                </span>
                                <span>{st.streamName}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 font-medium text-slate-700">{st.totalStudents}</td>
                            <td className="py-3 px-4 font-medium text-emerald-700">{st.passedStudents}</td>
                            <td className="py-3 px-4 text-center">
                              <span
                                className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                  isStHundred ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                                }`}
                              >
                                {stPass}%
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center font-bold text-amber-700">
                              {st.maxScorePercent}%
                            </td>
                            <td className="py-3 px-4 text-right font-black text-slate-900">
                              {st.above90PercentCount}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
            <span>
              ℹ️ Note: This institution offers instruction up to Class {classTo}. Class 12th Senior Secondary board tables are displayed only for schools offering Grades 11–12.
            </span>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* STRICT PREDEFINED EDIT MODAL (SCHOOL CANNOT ADD NEW FIELDS) */}
      {/* ========================================================= */}
      {editingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#005689] flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Update Class {editingModal === '10th' ? '10th' : '12th'} Board Results
                  </h3>
                  <p className="text-xs text-slate-500">
                    Strict predefined fields only (Max 3 academic years). Pass % is auto-calculated.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={editingModal === '10th' ? handlePrefill3Years10th : handlePrefill3Years12th}
                  className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200 transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  title="Automatically populate 3 years of benchmark data"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span className="hidden sm:inline">⚡ Fill 3 Years at Once</span>
                  <span className="sm:hidden">⚡ 3 Years</span>
                </button>
                <button
                  onClick={() => setEditingModal(null)}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="py-4 space-y-6 max-h-[65vh] overflow-y-auto pr-1">
              {editingModal === '10th' ? (
                <>
                  {modal10thRows.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-500 font-semibold bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      No Class 10th records added yet. Click &ldquo;+ Add Academic Year Record&rdquo; below to add.
                    </div>
                  ) : (
                    modal10thRows.map((row, rIdx) => {
                      const currentPassRate = calculatePassRate(row.passedStudents, row.totalStudents);
                      return (
                        <div key={rIdx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative group">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black uppercase text-[#005689] tracking-wider">
                              Year #{rIdx + 1} Record
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                                Auto Pass Rate: {currentPassRate}%
                              </span>
                              {modal10thRows.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemove10thYearRow(rIdx)}
                                  className="p-1 rounded-md text-red-500 hover:bg-red-50 transition-colors"
                                  title="Delete Year"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">Academic Year</label>
                              <select
                                value={row.year}
                                onChange={(e) => {
                                  const updated = [...modal10thRows];
                                  updated[rIdx].year = e.target.value;
                                  setModal10thRows(updated);
                                }}
                                className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 bg-white"
                              >
                                {PREDEFINED_ACADEMIC_YEARS.map(y => (
                                  <option key={y.value} value={y.value}>{y.label}</option>
                                ))}
                                {!PREDEFINED_ACADEMIC_YEARS.some(y => y.value === row.year) && (
                                  <option value={row.year}>{row.year}</option>
                                )}
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">Total Appeared</label>
                              <input
                                type="number"
                                value={row.totalStudents || ''}
                                onChange={(e) => {
                                  const updated = [...modal10thRows];
                                  updated[rIdx].totalStudents = parseInt(e.target.value, 10) || 0;
                                  setModal10thRows(updated);
                                }}
                                placeholder="e.g. 165"
                                className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 bg-white"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">Students Passed</label>
                              <input
                                type="number"
                                value={row.passedStudents || ''}
                                onChange={(e) => {
                                  const updated = [...modal10thRows];
                                  updated[rIdx].passedStudents = parseInt(e.target.value, 10) || 0;
                                  setModal10thRows(updated);
                                }}
                                placeholder="e.g. 165"
                                className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 bg-white"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">Top / Highest Score %</label>
                              <input
                                type="number"
                                step="0.1"
                                value={row.maxScorePercent || ''}
                                onChange={(e) => {
                                  const updated = [...modal10thRows];
                                  updated[rIdx].maxScorePercent = parseFloat(e.target.value) || 0;
                                  setModal10thRows(updated);
                                }}
                                placeholder="e.g. 99.2"
                                className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 bg-white"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">Above 90% Scorers Count</label>
                              <input
                                type="number"
                                value={row.above90PercentCount || ''}
                                onChange={(e) => {
                                  const updated = [...modal10thRows];
                                  updated[rIdx].above90PercentCount = parseInt(e.target.value, 10) || 0;
                                  setModal10thRows(updated);
                                }}
                                placeholder="e.g. 88"
                                className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 bg-white"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}

                  <button
                    type="button"
                    onClick={handleAdd10thYearRow}
                    disabled={modal10thRows.length >= 3}
                    className="w-full py-2.5 px-4 rounded-xl border-2 border-dashed border-[#005689]/40 text-[#005689] text-xs font-bold hover:bg-blue-50/50 flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add Academic Year Record (Max 3 Years)</span>
                  </button>
                </>
              ) : (
                <>
                  {modal12thRows.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-500 font-semibold bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      No Class 12th records added yet. Click &ldquo;+ Add Academic Year Record&rdquo; below to add.
                    </div>
                  ) : (
                    modal12thRows.map((row, rIdx) => {
                      const currentPassRate = calculatePassRate(row.passedStudents, row.totalStudents);
                      return (
                        <div key={rIdx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 relative group">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black uppercase text-emerald-800 tracking-wider">
                              Class 12th Year #{rIdx + 1} Record
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                                Overall Pass Rate: {currentPassRate}%
                              </span>
                              {modal12thRows.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemove12thYearRow(rIdx)}
                                  className="p-1 rounded-md text-red-500 hover:bg-red-50 transition-colors"
                                  title="Delete Year"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Academic Year</label>
                          <select
                            value={row.year}
                            onChange={(e) => {
                              const updated = [...modal12thRows];
                              updated[rIdx].year = e.target.value;
                              setModal12thRows(updated);
                            }}
                            className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 bg-white"
                          >
                            {PREDEFINED_ACADEMIC_YEARS.map(y => (
                              <option key={y.value} value={y.value}>{y.label}</option>
                            ))}
                            {!PREDEFINED_ACADEMIC_YEARS.some(y => y.value === row.year) && (
                              <option value={row.year}>{row.year}</option>
                            )}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Total Appeared</label>
                          <input
                            type="number"
                            value={row.totalStudents || ''}
                            onChange={(e) => {
                              const updated = [...modal12thRows];
                              updated[rIdx].totalStudents = parseInt(e.target.value, 10) || 0;
                              setModal12thRows(updated);
                            }}
                            placeholder="e.g. 142"
                            className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Students Passed</label>
                          <input
                            type="number"
                            value={row.passedStudents || ''}
                            onChange={(e) => {
                              const updated = [...modal12thRows];
                              updated[rIdx].passedStudents = parseInt(e.target.value, 10) || 0;
                              setModal12thRows(updated);
                            }}
                            placeholder="e.g. 142"
                            className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 bg-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">School Topper %</label>
                          <input
                            type="number"
                            step="0.1"
                            value={row.maxScorePercent || ''}
                            onChange={(e) => {
                              const updated = [...modal12thRows];
                              updated[rIdx].maxScorePercent = parseFloat(e.target.value) || 0;
                              setModal12thRows(updated);
                            }}
                            placeholder="e.g. 99.4"
                            className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Above 90% Scorers Count</label>
                          <input
                            type="number"
                            value={row.above90PercentCount || ''}
                            onChange={(e) => {
                              const updated = [...modal12thRows];
                              updated[rIdx].above90PercentCount = parseInt(e.target.value, 10) || 0;
                              setModal12thRows(updated);
                            }}
                            placeholder="e.g. 79"
                            className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 bg-white"
                          />
                        </div>
                      </div>

                      {/* Stream Breakdown Sub-Editor */}
                      <div className="pt-2 border-t border-slate-200">
                        <span className="block text-xs font-extrabold uppercase text-slate-800 mb-2">
                          Stream Breakdown (Science, Commerce, Humanities)
                        </span>

                        <div className="space-y-2">
                          {(row.streams || [
                            { streamName: 'Science', totalStudents: 62, passedStudents: 62, maxScorePercent: 99.4, above90PercentCount: 42 },
                            { streamName: 'Commerce', totalStudents: 48, passedStudents: 48, maxScorePercent: 98.6, above90PercentCount: 24 },
                            { streamName: 'Humanities / Arts', totalStudents: 32, passedStudents: 32, maxScorePercent: 98.8, above90PercentCount: 13 },
                          ]).map((st, sIdx) => (
                            <div key={sIdx} className="p-2.5 rounded-xl bg-white border border-slate-200 grid grid-cols-5 gap-2 items-center text-xs">
                              <span className="font-bold text-slate-900 col-span-1">{st.streamName}</span>
                              <input
                                type="number"
                                placeholder="Appeared"
                                value={st.totalStudents || ''}
                                onChange={(e) => {
                                  const updated = [...modal12thRows];
                                  if (!updated[rIdx].streams) updated[rIdx].streams = [];
                                  updated[rIdx].streams![sIdx].totalStudents = parseInt(e.target.value, 10) || 0;
                                  setModal12thRows(updated);
                                }}
                                className="px-2 py-1.5 rounded-lg border border-slate-300 text-center font-semibold"
                              />
                              <input
                                type="number"
                                placeholder="Passed"
                                value={st.passedStudents || ''}
                                onChange={(e) => {
                                  const updated = [...modal12thRows];
                                  if (!updated[rIdx].streams) updated[rIdx].streams = [];
                                  updated[rIdx].streams![sIdx].passedStudents = parseInt(e.target.value, 10) || 0;
                                  setModal12thRows(updated);
                                }}
                                className="px-2 py-1.5 rounded-lg border border-slate-300 text-center font-semibold"
                              />
                              <input
                                type="number"
                                step="0.1"
                                placeholder="Top %"
                                value={st.maxScorePercent || ''}
                                onChange={(e) => {
                                  const updated = [...modal12thRows];
                                  if (!updated[rIdx].streams) updated[rIdx].streams = [];
                                  updated[rIdx].streams![sIdx].maxScorePercent = parseFloat(e.target.value) || 0;
                                  setModal12thRows(updated);
                                }}
                                className="px-2 py-1.5 rounded-lg border border-slate-300 text-center font-semibold"
                              />
                              <input
                                type="number"
                                placeholder="90%+ Cnt"
                                value={st.above90PercentCount || ''}
                                onChange={(e) => {
                                  const updated = [...modal12thRows];
                                  if (!updated[rIdx].streams) updated[rIdx].streams = [];
                                  updated[rIdx].streams![sIdx].above90PercentCount = parseInt(e.target.value, 10) || 0;
                                  setModal12thRows(updated);
                                }}
                                className="px-2 py-1.5 rounded-lg border border-slate-300 text-center font-semibold"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}

              <button
                type="button"
                onClick={handleAdd12thYearRow}
                disabled={modal12thRows.length >= 3}
                className="w-full py-2.5 px-4 rounded-xl border-2 border-dashed border-emerald-600/40 text-emerald-700 text-xs font-bold hover:bg-emerald-50/50 flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Academic Year Record (Max 3 Years)</span>
              </button>
            </>
          )}
        </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setEditingModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveModal}
                className="px-5 py-2.5 rounded-xl bg-[#005689] text-white text-xs font-bold hover:bg-[#003c6e] shadow-xs transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Predefined Results</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
