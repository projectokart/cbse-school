'use client';

import React, { useState } from 'react';
import {
  FileText,
  ExternalLink,
  Phone,
  Mail,
  Trash2,
  Plus,
  Calendar,
  CreditCard,
  Clock,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Info
} from 'lucide-react';

export interface FeeTermItem {
  id: string;
  category: string;
  title: string;
  description: string;
}

export const DEFAULT_FEE_TERMS: FeeTermItem[] = [
  {
    id: 'term-1',
    category: 'Due Date',
    title: 'Quarterly / Monthly Remittance Due Date',
    description: 'School fees must be deposited on or before the 10th of every scheduled month or quarter. A nominal late fee of ₹50 per working day is applicable from the 16th onwards.'
  },
  {
    id: 'term-2',
    category: 'Payment Modes',
    title: 'Accepted Digital & Bank Payment Modes',
    description: 'Payments are accepted via the Official Online School ERP Portal, Net Banking (NEFT/RTGS), UPI QR code, and Account Payee Cheques / Demand Drafts.'
  },
  {
    id: 'term-3',
    category: 'Refund & TC',
    title: 'Withdrawal & Caution Money Policy',
    description: 'A minimum of 30 days prior written notice is mandatory for student withdrawal and Transfer Certificate (TC) issuance. Caution/Security deposits are refundable upon clearance of all school dues.'
  },
  {
    id: 'term-4',
    category: 'Concessions',
    title: 'Sibling & Merit Concession Policy',
    description: 'A 10% concession on composite tuition fees is extended to the younger sibling enrolled simultaneously in regular day school. Special merit waivers are offered to academic toppers.'
  },
  {
    id: 'term-5',
    category: 'Important Note',
    title: 'Annual Fee Revision & Documentation',
    description: 'Tuition fees are subject to regulatory annual revisions as sanctioned by the state education department. All fee receipts must be retained by parents for official records and income tax rebates.'
  }
];

export interface SchoolFeeSectionProps {
  displayName: string;
  displayBoard: string;
  displayUdise: string;
  displayAddress: string;
  state?: string;
  district?: string;
  village?: string;
  pincode?: string;
  classFrom?: string;
  classTo?: string;
  schoolCategory?: string;
  totalStudents?: number;
  totalTeachers?: number;
  isEditMode?: boolean;
  templateData?: any;
  initialProfileData?: any;
  admissionPhone?: string;
  setAdmissionPhone?: (val: string) => void;
  admissionEmail?: string;
  setAdmissionEmail?: (val: string) => void;
  feesTable: { columns: string[]; rows: string[][] };
  setFeesTable: React.Dispatch<React.SetStateAction<{ columns: string[]; rows: string[][] }>>;
  extraChargesTable: { columns: string[]; rows: string[][] };
  setExtraChargesTable: React.Dispatch<React.SetStateAction<{ columns: string[]; rows: string[][] }>>;
  feeTermsList?: FeeTermItem[];
  setFeeTermsList?: React.Dispatch<React.SetStateAction<FeeTermItem[]>>;
}

export default function SchoolFeeSection({
  displayName,
  displayBoard,
  displayUdise,
  displayAddress,
  state,
  district,
  village,
  pincode,
  classFrom,
  classTo,
  schoolCategory,
  totalStudents,
  totalTeachers,
  isEditMode = false,
  templateData,
  initialProfileData,
  admissionPhone = '',
  setAdmissionPhone,
  admissionEmail = '',
  setAdmissionEmail,
  feesTable,
  setFeesTable,
  extraChargesTable,
  setExtraChargesTable,
  feeTermsList: propFeeTermsList,
  setFeeTermsList: propSetFeeTermsList,
}: SchoolFeeSectionProps) {
  const [internalTermsList, setInternalTermsList] = useState<FeeTermItem[]>(() => {
    if (propFeeTermsList && propFeeTermsList.length > 0) return propFeeTermsList;
    if (templateData?.feeTermsList && Array.isArray(templateData.feeTermsList) && templateData.feeTermsList.length > 0) {
      return templateData.feeTermsList;
    }
    if (initialProfileData?.feeTermsList && Array.isArray(initialProfileData.feeTermsList) && initialProfileData.feeTermsList.length > 0) {
      return initialProfileData.feeTermsList;
    }
    return DEFAULT_FEE_TERMS;
  });

  const termsList = propFeeTermsList || internalTermsList;
  const updateTerms = (newTerms: FeeTermItem[]) => {
    if (propSetFeeTermsList) {
      propSetFeeTermsList(newTerms);
    } else {
      setInternalTermsList(newTerms);
    }
    if (templateData) {
      templateData.feeTermsList = newTerms;
    }
  };

  const addTermItem = () => {
    const newItem: FeeTermItem = {
      id: `term-${Date.now()}`,
      category: 'Due Date',
      title: 'New Term / Important Instruction',
      description: 'Enter fee due date guidelines, penalty grace period, or required documents here.'
    };
    updateTerms([...termsList, newItem]);
  };

  const removeTermItem = (id: string) => {
    updateTerms(termsList.filter(t => t.id !== id));
  };

  const updateTermItem = (id: string, field: keyof FeeTermItem, val: string) => {
    updateTerms(termsList.map(t => t.id === id ? { ...t, [field]: val } : t));
  };

  const getCategoryTheme = (category: string) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('due') || cat.includes('date')) {
      return { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200', icon: Calendar, tag: 'Due Date' };
    }
    if (cat.includes('payment') || cat.includes('mode')) {
      return { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200', icon: CreditCard, tag: 'Payment Mode' };
    }
    if (cat.includes('refund') || cat.includes('tc') || cat.includes('withdr')) {
      return { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200', icon: ShieldCheck, tag: 'Refund & TC' };
    }
    if (cat.includes('concession') || cat.includes('scholarship') || cat.includes('sibling')) {
      return { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200', icon: Sparkles, tag: 'Concession' };
    }
    return { bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-200', icon: AlertCircle, tag: 'Important Note' };
  };
  const renderDynamicTable = (
    title: string, 
    data: { columns: string[]; rows: string[][] }, 
    setData: React.Dispatch<React.SetStateAction<{ columns: string[]; rows: string[][] }>>
  ) => {
    const rawCols = Array.isArray(data?.columns) && data.columns.length > 0 ? data.columns : ['Grade Level', 'Monthly Tuition Fee', 'Quarterly Fee', 'Annualized Fee'];
    const rawRows = Array.isArray(data?.rows) ? data.rows : [];
    
    // Normalize any rows that might be objects or malformed
    const safeRows: string[][] = rawRows.map((r: any) => {
      if (Array.isArray(r)) return r.map((c: any) => String(c ?? ''));
      if (typeof r === 'object' && r !== null) {
        const mapped = rawCols.map((colName) => {
          const cn = colName.toLowerCase();
          if (cn.includes('grade') || cn.includes('class')) return r.grade || r.class || r.className || r.name || '';
          if (cn.includes('month')) return r.monthly || r.monthlyFee || '';
          if (cn.includes('qtr') || cn.includes('quarter')) return r.quarterly || r.quarterlyFee || '';
          if (cn.includes('annual') || cn.includes('year') || cn.includes('total')) return r.annual || r.totalAnnual || r.annualizedFee || '';
          return r[colName] || '';
        });
        if (mapped.every(v => !v)) {
          return Object.values(r).map(v => String(v ?? ''));
        }
        return mapped;
      }
      return Array(rawCols.length).fill('');
    });

    const safeData = {
      columns: rawCols,
      rows: safeRows
    };

    const maxCols = 10;
    const maxRows = 20;
    const lastColIdx = safeData.columns.length - 1;

    const removeCol = (colIdx: number) => {
      if (safeData.columns.length <= 2) return;
      setData({
        columns: safeData.columns.filter((_, i) => i !== colIdx),
        rows: safeData.rows.map(r => r.filter((_, i) => i !== colIdx))
      });
    };

    const addRow = () => {
      if (safeData.rows.length >= maxRows) return;
      setData({
        columns: safeData.columns,
        rows: [...safeData.rows, Array(safeData.columns.length).fill('')]
      });
    };

    const removeRow = (rowIdx: number) => {
      if (safeData.rows.length <= 1) return;
      setData({
        columns: safeData.columns,
        rows: safeData.rows.filter((_, i) => i !== rowIdx)
      });
    };

    const recalcRowTotal = (rowArray: string[], cols: string[]) => {
      const last = cols.length - 1;
      let sum = 0;
      let hasNumbers = false;
      for (let i = 1; i < last; i++) {
        const cVal = (rowArray[i] || '').replace(/₹/g, '').replace(/,/g, '').trim();
        const header = (cols[i] || '').toLowerCase();
        const num = parseFloat(cVal);
        if (!isNaN(num) && num > 0) {
          hasNumbers = true;
          let factor = 1;
          if (header.includes('month')) factor = 12;
          else if (header.includes('qtr') || header.includes('quarter')) factor = 4;
          else if (header.includes('half')) factor = 2;
          else if (header.includes('one') || header.includes('annual') || header.includes('year')) factor = 1;
          sum += num * factor;
        }
      }
      if (cols[last].toLowerCase().includes('total')) {
        rowArray[last] = hasNumbers ? `₹${Math.round(sum).toLocaleString('en-IN')}` : '';
      }
      return rowArray;
    };

    const updateCol = (colIdx: number, val: string) => {
      const newCols = [...safeData.columns];
      newCols[colIdx] = val;
      const newRows = safeData.rows.map(r => recalcRowTotal([...r], newCols));
      setData({ columns: newCols, rows: newRows });
    };

    const updateCell = (rowIdx: number, colIdx: number, val: string) => {
      const newRows = [...safeData.rows];
      newRows[rowIdx] = [...newRows[rowIdx]];
      newRows[rowIdx][colIdx] = val;
      if (colIdx < safeData.columns.length - 1) {
        newRows[rowIdx] = recalcRowTotal(newRows[rowIdx], safeData.columns);
      }
      setData({ columns: safeData.columns, rows: newRows });
    };

    const addColBeforeTotal = () => {
      if (safeData.columns.length >= maxCols) return;
      const newCols = [...safeData.columns];
      newCols.splice(lastColIdx, 0, 'New Charge (Monthly)');
      const newRows = safeData.rows.map(r => {
        const newRow = [...r];
        newRow.splice(lastColIdx, 0, '');
        return recalcRowTotal(newRow, newCols);
      });
      setData({ columns: newCols, rows: newRows });
    };

    return (
      <div className="bg-white/95 rounded-[32px] border border-[#F4EBD9] shadow-[0_12px_36px_rgba(0,35,70,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] overflow-hidden mb-8 max-w-5xl mx-auto w-full">
        <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap justify-between items-center gap-3 bg-gradient-to-r from-[#F8FAFC] to-[#EDF5FA]">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#005689]" />
            <span>{title}</span>
          </h3>
          {isEditMode && (
             <span className="text-[11px] text-[#005689] font-bold bg-white px-3 py-1 rounded-full border border-blue-200/80 shadow-2xs">
               ✏️ Edit Mode Active • Columns, Rows &amp; Cells are editable
             </span>
          )}
        </div>

        {/* Billing Frequency Rule Note */}
        <div className="px-5 py-2.5 bg-[#F7F8F8] border-b border-[#E8E9E9] flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 text-xs">
          <div className="flex flex-wrap items-center gap-2 text-slate-700">
            <span className="font-bold text-[#003C6E] bg-[#EDF5FA] border border-[#D0E4F5] px-2 py-0.5 rounded text-[10px] sm:text-[11px] uppercase tracking-wider font-['Montserrat',sans-serif]">
              Note
            </span>
            <span className="text-slate-700 font-semibold text-[11px] sm:text-xs">
              Annual total calculate karne ke liye column header me bracket <strong>( )</strong> me ye value likhna <span className="text-red-600 font-bold">MUST</span> hai:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 bg-white border border-[#E8E9E9] text-slate-800 font-bold px-2 py-0.5 rounded-md shadow-2xs text-[10px] sm:text-[11px]">
              <span className="text-[#006FCC]">(Monthly)</span>
              <span className="text-slate-500 font-semibold">= Monthly (×12)</span>
            </span>
            <span className="inline-flex items-center gap-1 bg-white border border-[#E8E9E9] text-slate-800 font-bold px-2 py-0.5 rounded-md shadow-2xs text-[10px] sm:text-[11px]">
              <span className="text-[#006FCC]">(Qtr)</span>
              <span className="text-slate-500 font-semibold">= Quarterly (×4)</span>
            </span>
            <span className="inline-flex items-center gap-1 bg-white border border-[#E8E9E9] text-slate-800 font-bold px-2 py-0.5 rounded-md shadow-2xs text-[10px] sm:text-[11px]">
              <span className="text-[#006FCC]">(Half Yearly)</span>
              <span className="text-slate-500 font-semibold">= Half Yearly (×2)</span>
            </span>
            <span className="inline-flex items-center gap-1 bg-white border border-slate-200 text-slate-800 font-bold px-2 py-0.5 rounded-md shadow-2xs text-[10px] sm:text-[11px]">
              <span className="text-[#005689]">(One Time)</span>
              <span className="text-slate-500 font-semibold">= One Time (×1)</span>
            </span>
          </div>
        </div>
        
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                {safeData.columns.map((col, cIdx) => (
                  <th key={cIdx} className={`px-2 py-2 border-r border-b border-[#EDF5FA] bg-white text-xs font-bold text-gray-700 ${cIdx === 0 ? 'w-36 min-w-[120px]' : cIdx === lastColIdx ? 'w-28 min-w-[100px] bg-green-50/30' : 'w-24 min-w-[90px]'}`}>
                    {isEditMode ? (
                      <div className="flex items-center gap-0.5 bg-white border border-gray-200 rounded-md pr-0.5 focus-within:border-[#005689]">
                        <input 
                          type="text" 
                          value={col} 
                          onChange={e => updateCol(cIdx, e.target.value)} 
                          className="w-full bg-transparent px-1 py-0.5 text-xs font-bold text-gray-700 focus:outline-none min-w-0"
                        />
                        {cIdx !== lastColIdx && (
                          <button onClick={() => removeCol(cIdx)} className="text-red-400 hover:text-red-600 p-0.5 shrink-0">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ) : (
                      <span className={`px-1 py-0.5 block truncate ${cIdx === lastColIdx ? 'text-[#137333]' : ''}`} title={col}>{col}</span>
                    )}
                  </th>
                ))}
                {isEditMode && (
                  <th className="px-1.5 py-1.5 border-b border-[#EDF5FA] bg-white w-12 text-center align-middle">
                    <button onClick={addColBeforeTotal} disabled={safeData.columns.length >= maxCols} className="text-[#005689] hover:text-[#003c6e] p-1 rounded-md hover:bg-blue-50 transition-colors inline-block" title="Add column before Total">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {safeData.rows.map((row, rIdx) => {
                const breakdownParts: string[] = [];
                for (let i = 1; i < safeData.columns.length - 1; i++) {
                  const cVal = (row[i] || '').replace(/₹/g, '').replace(/,/g, '').trim();
                  const header = safeData.columns[i];
                  const num = parseFloat(cVal);
                  if (!isNaN(num) && num > 0) {
                    const lh = header.toLowerCase();
                    let factor = 1, unit = '×1';
                    if (lh.includes('month')) { factor = 12; unit = '×12'; }
                    else if (lh.includes('qtr') || lh.includes('quarter')) { factor = 4; unit = '×4'; }
                    else if (lh.includes('half')) { factor = 2; unit = '×2'; }
                    else if (lh.includes('one') || lh.includes('annual') || lh.includes('year')) { factor = 1; unit = '×1'; }
                    breakdownParts.push(`${header.split('(')[0].trim()} ${unit} = ₹${(num * factor).toLocaleString('en-IN')}`);
                  }
                }
                const breakdownTitle = breakdownParts.length > 0 ? breakdownParts.join('\n') : '';

                return (
                  <tr key={rIdx} className="hover:bg-[#F8FAFC] border-b border-[#EDF5FA] group transition-colors">
                    {row.map((cell, cIdx) => {
                      const isTotal = cIdx === safeData.columns.length - 1;
                      return (
                        <td key={cIdx} className={`px-2 py-1.5 border-r border-[#EDF5FA] ${isTotal ? 'bg-green-50/60 font-bold text-[#137333]' : ''}`}>
                          {isTotal ? (
                            <span
                              className="text-xs font-bold text-[#137333] px-1.5 block"
                              title={breakdownTitle || 'Enter fees to auto-calculate'}
                            >
                              {cell || '—'}
                            </span>
                          ) : isEditMode ? (
                            <input 
                              type="text" 
                              value={cell} 
                              onChange={e => updateCell(rIdx, cIdx, e.target.value)} 
                              className="w-full bg-transparent border-b border-dashed border-transparent hover:border-gray-300 focus:border-[#005689] px-1.5 py-0.5 text-xs text-gray-700 focus:outline-none"
                              placeholder={cIdx === 0 ? 'Class name' : '0'}
                            />
                          ) : (
                            <span className="text-xs text-gray-700 px-1.5 block">{cell || '—'}</span>
                          )}
                        </td>
                      );
                    })}
                    {isEditMode && (
                      <td className="px-1 py-1 text-center align-middle w-8">
                        <button onClick={() => removeRow(rIdx)} className="text-red-400 hover:text-red-600 p-1 rounded-md hover:bg-red-50 transition-colors inline-block opacity-0 group-hover:opacity-100">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {isEditMode && (
          <div className="px-4 py-2 border-t border-[#EDF5FA] bg-[#F8FAFC] flex justify-end">
            <button 
              onClick={addRow} 
              disabled={data.rows.length >= maxRows} 
              className="px-3 py-1 bg-[#005689] text-white text-xs font-bold rounded-md hover:bg-[#003c6e] disabled:opacity-50 flex items-center gap-1 transition-colors shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" /> Add Row
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <section id="fee-structure" className="py-12 sm:py-20 bg-[#F7F8F8] border-b border-[#E8E9E9] relative overflow-hidden">
      {/* Decorative ambient background */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#EDF5FA]/50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center sm:text-left mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-[#006FCC] bg-[#EDF5FA] border border-[#D0E4F5] px-3.5 py-1.5 rounded-full mb-3 shadow-2xs font-['Montserrat',sans-serif]">
            <span className="w-2 h-2 bg-[#006FCC] rounded-full inline-block animate-pulse" />
            <span>ADMISSIONS &amp; COMPOSITE FEES</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-['Montserrat',sans-serif] text-[#003C6E] tracking-tight leading-tight">
            Transparent Fee Structure &amp;
            <span className="text-[#006FCC] block mt-0.5">Admissions Guidelines</span>
          </h2>

          <p className="mt-3 text-slate-600 font-normal max-w-2xl text-sm sm:text-base leading-relaxed">
            Review detailed grade-wise tuition schedules, transparent fee breakdowns, and direct contact channels for {displayName}.
          </p>
        </div>

        <div className="flex flex-col gap-8 w-full">
          
          {/* Top: Verified Official Fee & Admissions Links */}
          <div className="w-full">
            {((templateData?.officialFeeUrl || templateData?.fees?.official_fee_page_url || initialProfileData?.officialFeeUrl) ||
              (templateData?.officialAdmissionsUrl || templateData?.admissions?.official_admissions_page_url || initialProfileData?.officialAdmissionsUrl)) && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
                {(templateData?.officialFeeUrl || templateData?.fees?.official_fee_page_url || initialProfileData?.officialFeeUrl) && (
                  <div className="bg-white border border-[#E8E9E9] rounded-[14px] p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-xs hover:shadow-md hover:border-[#006FCC]/40 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-[12px] bg-[#EDF5FA] text-[#006FCC] flex items-center justify-center shrink-0 border border-[#D0E4F5] shadow-xs">
                        <FileText className="w-6 h-6 text-[#006FCC]" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold font-['Montserrat',sans-serif] text-[#003C6E]">Official School Fee Structure Page</h4>
                        <p className="text-xs sm:text-sm text-slate-600 font-normal mt-0.5">
                          Direct link to official fee schedule on school website
                        </p>
                      </div>
                    </div>
                    <a
                      href={templateData?.officialFeeUrl || templateData?.fees?.official_fee_page_url || initialProfileData?.officialFeeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] bg-[#006FCC] hover:bg-[#005399] text-white text-xs font-bold font-['Montserrat',sans-serif] transition-all shrink-0 shadow-md hover:-translate-y-0.5 active:translate-y-0"
                    >
                      <span>Official Fee Page</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}

                {(templateData?.officialAdmissionsUrl || templateData?.admissions?.official_admissions_page_url || initialProfileData?.officialAdmissionsUrl) && (
                  <div className="bg-white border border-[#E8E9E9] rounded-[14px] p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-xs hover:shadow-md hover:border-[#006FCC]/40 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-[12px] bg-[#EDF5FA] text-[#006FCC] flex items-center justify-center shrink-0 border border-[#D0E4F5] shadow-xs">
                        <ShieldCheck className="w-6 h-6 text-[#006FCC]" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold font-['Montserrat',sans-serif] text-[#003C6E]">Official School Admissions Portal</h4>
                        <p className="text-xs sm:text-sm text-slate-600 font-normal mt-0.5">
                          Direct link to official admissions &amp; registration page
                        </p>
                      </div>
                    </div>
                    <a
                      href={templateData?.officialAdmissionsUrl || templateData?.admissions?.official_admissions_page_url || initialProfileData?.officialAdmissionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] bg-[#006FCC] hover:bg-[#005399] text-white text-xs font-bold font-['Montserrat',sans-serif] transition-all shrink-0 shadow-md hover:-translate-y-0.5 active:translate-y-0"
                    >
                      <span>Official Admissions Page</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>
            )}

            {feesTable.rows.some(r => r.some((c, idx) => idx > 0 && c && c.trim() !== '')) || isEditMode ? (
              renderDynamicTable('Admission & Tuition Fees', feesTable, setFeesTable)
            ) : (
              <div className="bg-white border border-[#E8E9E9] rounded-[14px] p-8 sm:p-10 text-center max-w-4xl mx-auto mb-8 shadow-xs">
                <div className="w-12 h-12 rounded-[12px] bg-[#EDF5FA] text-[#006FCC] border border-[#D0E4F5] flex items-center justify-center mx-auto mb-4 shadow-xs">
                  <FileText className="w-6 h-6 text-[#006FCC]" />
                </div>
                <h4 className="text-lg font-bold font-['Montserrat',sans-serif] text-[#003C6E] mb-1.5">Official Fee Schedule Verification</h4>
                <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
                  Class-wise tuition fee breakdown is officially published directly by the institution during the academic session. Parents are advised to consult the school admissions office for the latest fee structure.
                </p>
              </div>
            )}

            {(extraChargesTable.rows.some(r => r.some((c, idx) => idx > 0 && c && c.trim() !== '')) || isEditMode) && (
              renderDynamicTable('Extra / Other Charges', extraChargesTable, setExtraChargesTable)
            )}

            {/* ─── TERMS, DUE DATES & INSTITUTIONAL GUIDELINES CARD ─── */}
            <div className="bg-white rounded-[14px] border border-[#E8E9E9] shadow-xs overflow-hidden mb-8 max-w-5xl mx-auto w-full">
              <div className="px-6 py-4 border-b border-[#E8E9E9] flex flex-wrap justify-between items-center gap-3 bg-[#F7F8F8]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-[10px] bg-[#006FCC] text-white flex items-center justify-center shadow-xs">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <span>Important Terms, Due Dates &amp; Guidelines</span>
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Fee cycles, payment dates, late fine policy, refund rules &amp; institutional guidelines
                    </p>
                  </div>
                </div>

                {isEditMode && (
                  <button
                    onClick={addTermItem}
                    className="px-3.5 py-1.5 bg-[#005689] text-white text-xs font-bold rounded-full hover:bg-[#003c6e] flex items-center gap-1.5 shadow-2xs transition-transform active:scale-95 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Instruction / Rule</span>
                  </button>
                )}
              </div>

              {/* Terms Grid */}
              <div className="p-6 sm:p-7 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                {termsList.map((item) => {
                  const theme = getCategoryTheme(item.category);
                  const IconComp = theme.icon;

                  return (
                    <div
                      key={item.id}
                      className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs hover:border-[#005689]/40 hover:shadow-xs transition-all relative group flex flex-col justify-between"
                    >
                      <div>
                        {/* Header: Tag + Actions */}
                        <div className="flex items-center justify-between gap-2 mb-2.5">
                          {isEditMode ? (
                            <select
                              value={item.category}
                              onChange={(e) => updateTermItem(item.id, 'category', e.target.value)}
                              className="text-[11px] font-bold border border-slate-300 rounded-lg px-2 py-1 bg-white text-slate-800 focus:outline-none focus:border-[#005689]"
                            >
                              <option value="Due Date">Due Date</option>
                              <option value="Payment Modes">Payment Modes</option>
                              <option value="Refund & TC">Refund &amp; TC</option>
                              <option value="Concessions">Concessions</option>
                              <option value="Important Note">Important Note</option>
                            </select>
                          ) : (
                            <span className={`inline-flex items-center gap-1.5 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${theme.bg} ${theme.text} ${theme.border} uppercase tracking-wider`}>
                              <IconComp className="w-3 h-3" />
                              <span>{item.category}</span>
                            </span>
                          )}

                          {isEditMode && (
                            <button
                              onClick={() => removeTermItem(item.id)}
                              className="text-red-400 hover:text-red-600 p-1 rounded-md hover:bg-red-50 transition-colors"
                              title="Delete rule"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        {/* Title */}
                        {isEditMode ? (
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => updateTermItem(item.id, 'title', e.target.value)}
                            placeholder="Rule / Due Date Title"
                            className="w-full text-xs font-black text-slate-900 bg-white border border-slate-300 rounded-md px-2 py-1 mb-2 focus:border-[#005689] focus:outline-none"
                          />
                        ) : (
                          <h4 className="text-xs sm:text-sm font-black text-slate-900 mb-1.5 flex items-center gap-1.5">
                            <span>{item.title}</span>
                          </h4>
                        )}

                        {/* Description */}
                        {isEditMode ? (
                          <textarea
                            value={item.description}
                            onChange={(e) => updateTermItem(item.id, 'description', e.target.value)}
                            placeholder="Enter specific terms, dates, penalty amounts or guidelines..."
                            rows={3}
                            className="w-full text-xs text-slate-700 bg-white border border-slate-300 rounded-md p-2 focus:border-[#005689] focus:outline-none resize-none font-medium"
                          />
                        ) : (
                          <p className="text-xs text-slate-600 leading-relaxed font-medium">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Admissions Inquiry Desk Card (Claymorphic) */}
          <div className="w-full bg-white/95 border border-[#F4EBD9] rounded-[32px] sm:rounded-[36px] p-8 sm:p-12 text-center max-w-4xl mx-auto shadow-[0_12px_36px_rgba(0,35,70,0.06),inset_0_1px_0_rgba(255,255,255,0.9)]">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#005689] bg-[#EDF5FA] border border-[#D6EDFF] px-3.5 py-1.5 rounded-full mb-3 shadow-2xs">
              <span>ADMISSION HELPDESK</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-950 mb-2">
              Have Questions About Admissions or Fees?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mb-8 max-w-xl mx-auto font-medium leading-relaxed">
              Our admissions team is available to assist you with registration guidelines, documentation, and enrollment procedures for {displayName}.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              {isEditMode ? (
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto">
                  <div className="flex-1 text-left">
                    <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Admissions Phone</label>
                    <input 
                      type="text" 
                      value={admissionPhone} 
                      onChange={e => setAdmissionPhone && setAdmissionPhone(e.target.value)} 
                      placeholder="+91 98765 43210"
                      className="w-full text-xs font-extrabold text-slate-800 bg-white border-2 border-slate-200 rounded-2xl px-4 py-2.5 focus:border-[#005689] focus:outline-none"
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Admissions Email</label>
                    <input 
                      type="text" 
                      value={admissionEmail} 
                      onChange={e => setAdmissionEmail && setAdmissionEmail(e.target.value)} 
                      placeholder="admissions@school.org"
                      className="w-full text-xs font-extrabold text-slate-800 bg-white border-2 border-slate-200 rounded-2xl px-4 py-2.5 focus:border-[#005689] focus:outline-none"
                    />
                  </div>
                </div>
              ) : (
                <>
                  {admissionPhone ? (
                    <a
                      href={`tel:${admissionPhone}`}
                      className="inline-flex items-center gap-2.5 text-xs font-black text-white bg-[#005689] hover:bg-[#004168] px-7 py-3.5 rounded-full transition-all shadow-[0_6px_20px_rgba(0,86,137,0.25)] hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Call Admissions: {admissionPhone}</span>
                    </a>
                  ) : (
                    <button disabled className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-100 border border-slate-200 px-6 py-3 rounded-full opacity-60 cursor-not-allowed">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span>Admissions Phone Not Available</span>
                    </button>
                  )}

                  {admissionEmail ? (
                    <a
                      href={`mailto:${admissionEmail}`}
                      className="inline-flex items-center gap-2.5 text-xs font-black text-[#005689] bg-[#EDF5FA] border border-[#D6EDFF] hover:bg-[#DDF0FD] px-7 py-3.5 rounded-full transition-all shadow-xs hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Email Admissions: {admissionEmail}</span>
                    </a>
                  ) : (
                    <button disabled className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-100 border border-slate-200 px-6 py-3 rounded-full opacity-60 cursor-not-allowed">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span>Admissions Email Not Available</span>
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
