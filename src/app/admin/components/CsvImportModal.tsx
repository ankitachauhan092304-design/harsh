'use client';

import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, X, ShieldAlert, Loader2 } from 'lucide-react';
import { Lead } from '@/types';

interface CsvImportModalProps {
  onImportLeads: (leads: Partial<Lead>[]) => void;
  onClose: () => void;
}

export default function CsvImportModal({
  onImportLeads,
  onClose,
}: CsvImportModalProps) {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<Partial<Lead>[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setErrorMsg('Please select a valid .csv file.');
      return;
    }
    setErrorMsg('');
    setCsvFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      parseCSV(text);
    };
    reader.readAsText(file);
  };

  const parseCSV = (text: string) => {
    const lines = text.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
    if (lines.length < 2) {
      setErrorMsg('CSV file is empty or missing data rows.');
      return;
    }

    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/"/g, ''));
    const rows: Partial<Lead>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map((v) => v.trim().replace(/"/g, ''));
      const rowObj: Record<string, string> = {};
      headers.forEach((h, idx) => {
        rowObj[h] = values[idx] || '';
      });

      const name = rowObj['name'] || rowObj['customer name'] || rowObj['full name'] || 'CSV Lead';
      const phone = (rowObj['phone'] || rowObj['mobile'] || '').replace(/\D/g, '');
      const email = rowObj['email'] || '';
      const city = rowObj['city'] || 'Ahmedabad';
      const loanType = (rowObj['loantype'] || rowObj['loan type'] || 'PERSONAL').toUpperCase();
      const loanAmount = Number((rowObj['loanamount'] || rowObj['loan amount'] || '500000').replace(/\D/g, ''));

      if (phone.length === 10) {
        rows.push({
          name,
          phone,
          email,
          city,
          loanType,
          loanAmount,
          source: 'CSV_IMPORT',
          status: 'NEW',
          priority: 'MEDIUM',
        });
      }
    }

    if (rows.length === 0) {
      setErrorMsg('No valid leads found in CSV. Ensure rows contain 10-digit mobile numbers.');
    } else {
      setParsedData(rows);
    }
  };

  const handleConfirmImport = () => {
    if (parsedData.length === 0) return;
    setIsProcessing(true);
    setTimeout(() => {
      onImportLeads(parsedData);
      setIsProcessing(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl p-6 md:p-8 border border-slate-200 shadow-2xl relative flex flex-col gap-5">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#00A86B] flex items-center justify-center">
            <Upload size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800 font-poppins">Import Leads from CSV</h3>
            <p className="text-xs text-slate-500">Upload structured CSV data into the CRM database</p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl flex items-center gap-2">
            <ShieldAlert size={16} className="text-rose-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Drag Zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-200 hover:border-[#0B4F9C] rounded-2xl p-6 text-center cursor-pointer bg-slate-50 hover:bg-blue-50/20 transition-all flex flex-col items-center gap-2 group"
        >
          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-[#0B4F9C]">
            <FileText size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-700 group-hover:text-[#0B4F9C]">
              {csvFile ? csvFile.name : 'Click or drop CSV file here'}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">Headers required: Name, Phone, Email, City, LoanType, LoanAmount</p>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            accept=".csv"
            className="hidden"
          />
        </div>

        {/* Parsed Preview Table */}
        {parsedData.length > 0 && (
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-700">
              <span>Preview Parsed Records ({parsedData.length})</span>
              <span className="text-emerald-600 flex items-center gap-1"><CheckCircle size={12} /> Validated</span>
            </div>
            <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 text-xs">
              {parsedData.slice(0, 5).map((row, i) => (
                <div key={i} className="p-2.5 bg-white flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-800">{row.name}</span>
                    <span className="text-[10px] text-slate-400 ml-2">({row.phone})</span>
                  </div>
                  <span className="font-mono text-[10px] font-bold text-slate-600">₹{(Number(row.loanAmount || 0) / 100000).toFixed(1)}L</span>
                </div>
              ))}
              {parsedData.length > 5 && (
                <div className="p-2 text-center text-[10px] text-slate-400 font-semibold bg-slate-50">
                  + {parsedData.length - 5} more valid records
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={parsedData.length === 0 || isProcessing}
            onClick={handleConfirmImport}
            className="px-5 py-2.5 rounded-xl bg-[#00A86B] hover:bg-[#008f5b] text-white font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            {isProcessing ? <><Loader2 size={15} className="animate-spin" /> Importing...</> : `Import ${parsedData.length} Leads`}
          </button>
        </div>
      </div>
    </div>
  );
}
