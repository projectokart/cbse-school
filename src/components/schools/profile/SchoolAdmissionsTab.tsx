'use client';

import React from 'react';
import {
  FileText,
  ExternalLink,
  Phone,
  Mail,
  Trash2,
  Plus
} from 'lucide-react';

export interface SchoolAdmissionsTabProps {
  displayName: string;
  displayBoard: string;
  displayUdise: string;
  displayAddress: string;
  state: string;
  district: string;
  village: string;
  pincode: string;
  classFrom: string;
  classTo: string;
  schoolCategory: string;
  totalStudents: number;
  totalTeachers: number;
  isEditMode: boolean;
  templateData: any;
  initialProfileData?: any;
  admissionPhone: string;
  setAdmissionPhone: (val: string) => void;
  admissionEmail: string;
  setAdmissionEmail: (val: string) => void;
  feesTable: { columns: string[]; rows: string[][] };
  setFeesTable: React.Dispatch<React.SetStateAction<{ columns: string[]; rows: string[][] }>>;
  extraChargesTable: { columns: string[]; rows: string[][] };
  setExtraChargesTable: React.Dispatch<React.SetStateAction<{ columns: string[]; rows: string[][] }>>;
}

export default function SchoolAdmissionsTab({
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
  isEditMode,
  templateData,
  initialProfileData,
  admissionPhone,
  setAdmissionPhone,
  admissionEmail,
  setAdmissionEmail,
  feesTable,
  setFeesTable,
  extraChargesTable,
  setExtraChargesTable,
}: SchoolAdmissionsTabProps) {
  const renderDynamicTable = (
    title: string, 
    data: { columns: string[]; rows: string[][] }, 
    setData: React.Dispatch<React.SetStateAction<{ columns: string[]; rows: string[][] }>>
  ) => {
    const maxCols = 10;
    const maxRows = 20;
    const lastColIdx = data.columns.length - 1;

    const removeCol = (colIdx: number) => {
      if (data.columns.length <= 2) return;
      setData({
        columns: data.columns.filter((_, i) => i !== colIdx),
        rows: data.rows.map(r => r.filter((_, i) => i !== colIdx))
      });
    };

    const addRow = () => {
      if (data.rows.length >= maxRows) return;
      setData({
        ...data,
        rows: [...data.rows, Array(data.columns.length).fill('')]
      });
    };

    const removeRow = (rowIdx: number) => {
      if (data.rows.length <= 1) return;
      setData({
        ...data,
        rows: data.rows.filter((_, i) => i !== rowIdx)
      });
    };

    const recalcRowTotal = (rowArray: string[], cols: string[]) => {
      const last = cols.length - 1;
      let sum = 0;
      let hasNumbers = false;
      for (let i = 1; i < last; i++) {
        const cVal = (rowArray[i] || '').replace(/₹/g, '').replace(/,/g, '').trim();
        const header = cols[i].toLowerCase();
        const num = parseFloat(cVal);
        if (!isNaN(num) && num > 0) {
          hasNumbers = true;
          let factor = 1;
          if (header.includes('month')) factor = 12;
          else if (header.includes('qtr') || header.includes('quarter')) factor = 4;
          else if (header.includes('half')) factor = 2;
          sum += num * factor;
        }
      }
      if (cols[last].toLowerCase().includes('total')) {
        rowArray[last] = hasNumbers ? `₹${Math.round(sum).toLocaleString('en-IN')}` : '';
      }
      return rowArray;
    };

    const updateCol = (colIdx: number, val: string) => {
      const newCols = [...data.columns];
      newCols[colIdx] = val;
      const newRows = data.rows.map(r => recalcRowTotal([...r], newCols));
      setData({ columns: newCols, rows: newRows });
    };

    const updateCell = (rowIdx: number, colIdx: number, val: string) => {
      const newRows = [...data.rows];
      newRows[rowIdx] = [...newRows[rowIdx]];
      newRows[rowIdx][colIdx] = val;
      if (colIdx < data.columns.length - 1) {
        newRows[rowIdx] = recalcRowTotal(newRows[rowIdx], data.columns);
      }
      setData({ ...data, rows: newRows });
    };

    const addColBeforeTotal = () => {
      if (data.columns.length >= maxCols) return;
      const newCols = [...data.columns];
      newCols.splice(lastColIdx, 0, 'New Column');
      const newRows = data.rows.map(r => {
        const newRow = [...r];
        newRow.splice(lastColIdx, 0, '');
        return recalcRowTotal(newRow, newCols);
      });
      setData({ columns: newCols, rows: newRows });
    };

    return (
      <div className="bg-white rounded-xl border border-[#EDF5FA] shadow-sm overflow-hidden mb-6 max-w-5xl mx-auto w-full">
        <div className="px-4 py-3 border-b border-[#EDF5FA] flex flex-wrap justify-between items-center gap-2 bg-[#F8FAFC]">
          <h3 className="text-base font-black text-[#005689]">{title}</h3>
          {isEditMode && (
            <span className="text-xs text-gray-500 font-medium bg-white px-2.5 py-1 rounded-full border border-[#EDF5FA] shadow-sm">
              💡 Add "(Monthly)" or "(Qtr)" to column names for auto-multiplication!
            </span>
          )}
        </div>
        
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                {data.columns.map((col, cIdx) => (
                  <th key={cIdx} className={`px-2 py-2.5 border-r border-b border-[#EDF5FA] bg-white text-xs font-bold text-gray-700 ${cIdx === 0 ? 'w-36 min-w-[130px]' : cIdx === lastColIdx ? 'w-28 min-w-[110px] bg-green-50/30' : 'w-24 min-w-[95px]'}`}>
                    {isEditMode ? (
                      <div className="flex items-center gap-0.5 bg-white border border-gray-200 rounded-md pr-0.5 focus-within:border-[#005689]">
                        <input 
                          type="text" 
                          value={col} 
                          onChange={e => updateCol(cIdx, e.target.value)} 
                          className="w-full bg-transparent px-1.5 py-1 text-xs font-bold text-gray-700 focus:outline-none min-w-0"
                        />
                        {cIdx !== lastColIdx && (
                          <button onClick={() => removeCol(cIdx)} className="text-red-400 hover:text-red-600 p-0.5 flex-shrink-0">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-gray-800 px-1.5 block">{col}</span>
                    )}
                  </th>
                ))}
                {isEditMode && (
                  <th className="px-1.5 py-1 bg-white border-b border-[#EDF5FA] text-center w-8">
                    <button onClick={addColBeforeTotal} disabled={data.columns.length >= maxCols} className="text-[#005689] hover:text-[#003c6e] p-1 rounded-md hover:bg-blue-50 transition-colors inline-block" title="Add column before Total">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row, rIdx) => {
                const breakdownParts: string[] = [];
                for (let i = 1; i < data.columns.length - 1; i++) {
                  const cVal = (row[i] || '').replace(/₹/g, '').replace(/,/g, '').trim();
                  const header = data.columns[i];
                  const num = parseFloat(cVal);
                  if (!isNaN(num) && num > 0) {
                    const lh = header.toLowerCase();
                    let factor = 1, unit = '×1';
                    if (lh.includes('month')) { factor = 12; unit = '×12'; }
                    else if (lh.includes('qtr') || lh.includes('quarter')) { factor = 4; unit = '×4'; }
                    else if (lh.includes('half')) { factor = 2; unit = '×2'; }
                    breakdownParts.push(`${header.split('(')[0].trim()} ${unit} = ₹${(num * factor).toLocaleString('en-IN')}`);
                  }
                }
                const breakdownTitle = breakdownParts.length > 0 ? breakdownParts.join('\n') : '';

                return (
                  <tr key={rIdx} className="hover:bg-[#F8FAFC] border-b border-[#EDF5FA] group transition-colors">
                    {row.map((cell, cIdx) => {
                      const isTotal = cIdx === data.columns.length - 1;
                      return (
                        <td key={cIdx} className={`px-2 py-2 border-r border-[#EDF5FA] ${isTotal ? 'bg-green-50/60 font-bold text-[#137333]' : ''}`}>
                          {isTotal ? (
                            <span
                              className="text-sm font-bold text-[#137333] px-1.5 block"
                              title={breakdownTitle || 'Enter fees to auto-calculate'}
                            >
                              {cell || '—'}
                            </span>
                          ) : isEditMode ? (
                            <input 
                              type="text" 
                              value={cell} 
                              onChange={e => updateCell(rIdx, cIdx, e.target.value)} 
                              className="w-full bg-transparent border-b border-dashed border-transparent hover:border-gray-300 focus:border-[#005689] px-1.5 py-0.5 text-sm text-gray-700 focus:outline-none"
                              placeholder={cIdx === 0 ? 'Class name' : '0'}
                            />
                          ) : (
                            <span className="text-sm text-gray-700 px-1.5 block">{cell || '—'}</span>
                          )}
                        </td>
                      );
                    })}
                    {isEditMode && (
                      <td className="px-1.5 py-1 text-center align-middle w-8">
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
              className="px-4 py-1.5 bg-[#005689] text-white text-xs font-bold rounded-md border border-[#005689] hover:bg-[#003c6e] disabled:opacity-50 flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" /> Add Row
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <section id="admissions" className="pt-6 sm:pt-10 pb-12 sm:pb-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-12 w-full">
            {/* Top: Dynamic Tables */}
            <div className="w-full overflow-hidden">
              {(templateData?.officialFeeUrl || initialProfileData?.officialFeeUrl) && (
                <div className="bg-[#EDF5FA] border border-[#D6EDFF] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white text-[#005689] flex items-center justify-center shrink-0 border border-blue-100 shadow-2xs">
                      <FileText className="w-5 h-5 text-[#005689]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-[#002B49]">Official Institutional Fee Schedule Verified</h4>
                      <p className="text-xs text-slate-600">
                        Academic Sessions Composite Tuition, Joining & Annual Schedules
                      </p>
                    </div>
                  </div>
                  <a
                    href={templateData?.officialFeeUrl || initialProfileData?.officialFeeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#005689] hover:bg-[#003c6e] text-white text-xs font-bold transition-all shrink-0 shadow-xs"
                  >
                    <span>View Official Fee Schedule</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {feesTable.rows.some(r => r.some((c, idx) => idx > 0 && c && c.trim() !== '')) || isEditMode ? (
                renderDynamicTable('Admission & Tuition Fees', feesTable, setFeesTable)
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center max-w-4xl mx-auto mb-6">
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-[#005689] flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-gray-900 mb-1">Official Fee Schedule Verification</h4>
                  <p className="text-xs text-gray-600 max-w-xl mx-auto leading-relaxed">
                    Class-wise tuition fee breakdown is officially published directly by the institution during the academic session. Parents are advised to consult the school admissions office for the latest fee structure.
                  </p>
                </div>
              )}

              {(extraChargesTable.rows.some(r => r.some((c, idx) => idx > 0 && c && c.trim() !== '')) || isEditMode) && (
                renderDynamicTable('Extra / Other Charges', extraChargesTable, setExtraChargesTable)
              )}
            </div>

            {/* Bottom: Info / Contact Card */}
            <div className="w-full max-w-4xl mx-auto">
              <div className="bg-[#EDF5FA] rounded-3xl p-6 sm:p-8 text-center flex flex-col items-center">
                <h3 className="text-2xl font-black text-[#005689] mb-4">Admissions Contact</h3>
                <p className="text-gray-700 text-sm leading-relaxed mb-8 max-w-2xl mx-auto">
                  For any queries regarding the fee structure or admission process, feel free to contact us.
                </p>
                <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 w-full">
                  {isEditMode ? (
                    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl">
                      <div className="flex items-center gap-3 text-sm font-medium text-gray-800 flex-1">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-[#005689] shrink-0">
                          <Phone className="w-5 h-5" />
                        </div>
                        <input 
                          type="text" 
                          value={admissionPhone} 
                          onChange={e => setAdmissionPhone(e.target.value)} 
                          placeholder="Admission Phone"
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#005689]"
                        />
                      </div>
                      <div className="flex items-center gap-3 text-sm font-medium text-gray-800 flex-1">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-[#005689] shrink-0">
                          <Mail className="w-5 h-5" />
                        </div>
                        <input 
                          type="text" 
                          value={admissionEmail} 
                          onChange={e => setAdmissionEmail(e.target.value)} 
                          placeholder="Admission Email"
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#005689]"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      {admissionPhone ? (
                        <a href={`tel:${admissionPhone}`} className="flex items-center gap-3 text-sm font-bold text-white bg-[#005689] hover:bg-[#003c6e] px-6 py-3.5 rounded-full transition-all shadow-md shadow-[#005689]/20 hover:shadow-lg hover:shadow-[#005689]/30 hover:-translate-y-0.5 group">
                          <Phone className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                          <span>Call Admissions: {admissionPhone}</span>
                        </a>
                      ) : (
                        <button disabled className="flex items-center gap-3 text-sm font-semibold text-slate-400 bg-slate-100 border border-slate-200 px-6 py-3.5 rounded-full opacity-40 cursor-not-allowed pointer-events-none select-none">
                          <Phone className="w-5 h-5 text-slate-400" />
                          <span>Admissions Phone Not Available</span>
                        </button>
                      )}

                      {admissionEmail ? (
                        <a href={`mailto:${admissionEmail}`} className="flex items-center gap-3 text-sm font-bold text-[#005689] bg-white border border-[#D6EDFF] hover:bg-[#EDF5FA] px-6 py-3.5 rounded-full transition-all shadow-sm">
                          <Mail className="w-5 h-5" />
                          <span>Email Admissions: {admissionEmail}</span>
                        </a>
                      ) : (
                        <button disabled className="flex items-center gap-3 text-sm font-semibold text-slate-400 bg-slate-100 border border-slate-200 px-6 py-3.5 rounded-full opacity-40 cursor-not-allowed pointer-events-none select-none">
                          <Mail className="w-5 h-5 text-slate-400" />
                          <span>Admissions Email Not Available</span>
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
}
