'use client';

import React, { useState } from 'react';
import { Info, ClipboardList, TrendingUp } from 'lucide-react';
import { buildEligibilityShareMessage, buildWhatsAppUrl, DEFAULT_WA_NUMBER } from '@/lib/whatsapp';

export default function EligibilityCalculator() {
  const [age, setAge] = useState<number>(30);
  const [employment, setEmployment] = useState<string>('SALARIED');
  const [income, setIncome] = useState<number>(75000);
  const [existingEmi, setExistingEmi] = useState<number>(10000);
  const [loanType, setLoanType] = useState<string>('PERSONAL');
  const [isMetro, setIsMetro] = useState<boolean>(true);

  // 1. Calculate FOIR (Fixed Obligation to Income Ratio) Limit based on income tier
  let limit = 0.40; // 40% default
  if (income >= 30000 && income < 75000) limit = 0.50;
  else if (income >= 75000) limit = 0.55;

  // Adjust limit slightly based on age and city
  if (age < 22 || age > 58) limit -= 0.05;
  if (!isMetro) limit -= 0.05;

  const foirLimit = limit * 100;

  // 2. Calculate Debt Ratio
  const debtRatio = income > 0 ? (existingEmi / income) * 100 : 0;

  // 3. Calculate Maximum EMI capacity
  const maxInstallment = (income * limit) - existingEmi;
  const emiCapacity = Math.max(0, maxInstallment);

  // 4. Calculate Loan Amount based on interest rates & typical max tenures
  let r = 0; // monthly rate
  let n = 0; // tenure in months

  if (loanType === 'PERSONAL') {
    r = 11.5 / 12 / 100; // 11.5% p.a.
    n = 5 * 12; // 5 years
  } else if (loanType === 'BUSINESS') {
    r = 14.0 / 12 / 100; // 14.0% p.a.
    n = 3 * 12; // 3 years
  } else {
    r = 8.5 / 12 / 100; // 8.5% p.a.
    n = 20 * 12; // 20 years
  }

  let eligibleAmount = 0;
  let approvalChance = 'POOR';

  if (emiCapacity > 0 && r > 0 && n > 0) {
    // PV formula: Loan Amount = EMI * [(1 - (1 + r)^-n) / r]
    const amount = emiCapacity * ((1 - Math.pow(1 + r, -n)) / r);
    eligibleAmount = Math.round(amount);

    // Calculate approval chance based on debt ratio
    if (debtRatio < 30) approvalChance = 'EXCELLENT';
    else if (debtRatio < 45) approvalChance = 'GOOD';
    else if (debtRatio < 55) approvalChance = 'AVERAGE';
    else approvalChance = 'POOR';
  }

  const getRequiredDocuments = () => {
    const commonDocs = ['Aadhaar Card', 'PAN Card', 'Address Proof (Electricity Bill / Rent Agreement)'];
    if (employment === 'SALARIED') {
      return [
        ...commonDocs,
        'Last 3 Months Salary Slips',
        'Last 6 Months Bank Statement (showing salary credits)',
        'Form 16 & Income Tax Returns (ITR) for last 2 years',
      ];
    } else {
      return [
        ...commonDocs,
        'Business Incorporation Proof (GST Reg / Shop Act License)',
        'Last 12 Months primary business Bank Statements',
        'Audited Balance Sheet & Profit & Loss Statement (last 2 years)',
        'Income Tax Returns (ITR) with Computation of Income for last 2 years',
      ];
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 rounded-[40px] bg-gradient-to-br from-slate-50 via-blue-50/20 to-white border border-white shadow-2xl shadow-blue-900/5">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Section */}
        <div className="lg:col-span-7 bg-white/80 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white shadow-xl shadow-slate-200/50 flex flex-col gap-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-[#0B4F9C]/20 to-transparent" />
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-xl bg-blue-50 text-[#0B4F9C]">
              <TrendingUp size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 font-poppins">Eligibility Checker</h3>
          </div>
        </div>

        {/* Loan Type */}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-slate-500">Select Loan Type</span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'PERSONAL', label: 'Personal' },
              { id: 'BUSINESS', label: 'Business' },
              { id: 'HOME', label: 'Home / LAP' },
            ].map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setLoanType(type.id)}
                className={`py-3 rounded-xl text-xs font-bold border transition-all ${
                  loanType === type.id
                    ? 'border-[#0B4F9C] bg-blue-50/20 text-[#0B4F9C]'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Employment Type */}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-slate-500">Employment Status</span>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'SALARIED', label: 'Salaried' },
              { id: 'SELF_EMPLOYED', label: 'Self Employed / Business' },
            ].map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setEmployment(type.id)}
                className={`py-3 rounded-xl text-xs font-bold border transition-all ${
                  employment === type.id
                    ? 'border-[#0B4F9C] bg-blue-50/20 text-[#0B4F9C]'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Age Input */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center text-sm font-semibold text-slate-500">
            <span>Age</span>
            <span className="font-bold text-slate-800">{age} Years</span>
          </div>
          <input
            type="range"
            min="18"
            max="65"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            className="w-full accent-[#0B4F9C] cursor-pointer h-1.5 bg-slate-100 rounded-lg appearance-none"
          />
        </div>

        {/* Monthly Income Input */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center text-sm font-semibold text-slate-500">
            <span>Net Monthly Income</span>
            <span className="font-bold text-slate-800 font-dmsans">₹{income.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min="10000"
            max="1000000"
            step="5000"
            value={income}
            onChange={(e) => setIncome(Number(e.target.value))}
            className="w-full accent-[#0B4F9C] cursor-pointer h-1.5 bg-slate-100 rounded-lg appearance-none"
          />
        </div>

        {/* Existing EMIs Input */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center text-sm font-semibold text-slate-500">
            <span>Existing Monthly EMIs</span>
            <span className="font-bold text-slate-800 font-dmsans">₹{existingEmi.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min="0"
            max={income}
            step="1000"
            value={existingEmi}
            onChange={(e) => setExistingEmi(Number(e.target.value))}
            className="w-full accent-[#0B4F9C] cursor-pointer h-1.5 bg-slate-100 rounded-lg appearance-none"
          />
        </div>

        {/* City Category Toggle */}
        <div className="flex justify-between items-center p-3 bg-slate-50 border border-slate-100 rounded-xl">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-700">Metro City Resident?</span>
            <span className="text-[10px] text-slate-400 font-semibold">Higher eligibility caps in Tier-1 locations</span>
          </div>
          <button
            type="button"
            onClick={() => setIsMetro(!isMetro)}
            className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 cursor-pointer ${
              isMetro ? 'bg-[#00A86B]' : 'bg-slate-300'
            }`}
          >
            <div className={`bg-white w-4 h-4 rounded-full shadow-md transition-transform duration-200 ${isMetro ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>

      {/* Output Section */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <div className="bg-white/80 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white shadow-xl shadow-slate-200/50 flex flex-col gap-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-[#00A86B]/20 to-transparent" />
          <h4 className="text-base font-bold text-slate-800 font-poppins pb-3 border-b border-slate-100">Estimated Eligibility</h4>

          <div className="flex flex-col p-5 bg-[#0B4F9C]/5 border border-[#0B4F9C]/10 rounded-2xl text-center relative overflow-hidden">
            <span className="text-xs font-bold text-slate-500">Maximum Eligible Loan Amount</span>
            <span className="text-3xl font-black text-[#0B4F9C] font-dmsans mt-1">
              ₹{eligibleAmount.toLocaleString()}
            </span>
          </div>

          <button
            onClick={() => {
              const msg = buildEligibilityShareMessage({
                eligibleAmount,
                foir: Math.round(debtRatio),
                approvalChance: approvalChance === 'EXCELLENT' ? 'Excellent (Pre-Approved)' :
                                approvalChance === 'GOOD' ? 'Good (High Chance)' :
                                approvalChance === 'AVERAGE' ? 'Average (Moderate)' : 'Poor (Low Chance)',
                monthlyIncome: income,
                loanType
              });
              window.location.href = buildWhatsAppUrl(msg, DEFAULT_WA_NUMBER);
            }}
            className="w-full py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#22c55e] text-white font-bold text-xs shadow-md transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Discuss Eligibility on WhatsApp
          </button>


          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">EMI Capacity</span>
              <span className="text-base font-bold text-slate-800 font-dmsans mt-1">
                ₹{Math.round(emiCapacity).toLocaleString()}/mo
              </span>
            </div>
            <div className="flex flex-col p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Approval Probability</span>
              <span className={`text-sm font-bold mt-1.5 font-poppins ${
                approvalChance === 'EXCELLENT' ? 'text-emerald-500' :
                approvalChance === 'GOOD' ? 'text-blue-500' :
                approvalChance === 'AVERAGE' ? 'text-amber-500' : 'text-rose-500'
              }`}>
                {approvalChance === 'EXCELLENT' ? 'Pre-Approved' :
                 approvalChance === 'GOOD' ? 'High Chance' :
                 approvalChance === 'AVERAGE' ? 'Moderate' : 'Low Chance'}
              </span>
            </div>
          </div>

          {/* Income FOIR Visual Split Progress Bar */}
          <div className="flex flex-col gap-2.5 pt-3 border-t border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Income Allocation (FOIR Split)</span>
            
            {/* Segmented Progress Bar */}
            <div className="w-full h-3.5 rounded-full overflow-hidden flex bg-slate-100 border border-slate-200/40">
              {/* Existing EMIs (Red) */}
              <div 
                style={{ width: `${Math.min(100, debtRatio)}%` }} 
                className="h-full bg-rose-500 transition-all duration-300" 
                title="Existing Debt Obligations" 
              />
              {/* New Loan Capacity (Blue) */}
              <div 
                style={{ width: `${Math.min(100 - Math.min(100, debtRatio), (emiCapacity / income) * 100)}%` }} 
                className="h-full bg-[#0B4F9C] transition-all duration-300" 
                title="Eligible Additional Capacity" 
              />
              {/* Disposable Income Surplus (Green) */}
              <div 
                style={{ width: `${Math.max(0, 100 - Math.min(100, debtRatio) - Math.min(100 - Math.min(100, debtRatio), (emiCapacity / income) * 100))}%` }} 
                className="h-full bg-emerald-500 transition-all duration-300" 
                title="Net Surplus Disposable Income" 
              />
            </div>

            {/* Progress Bar Legend */}
            <div className="grid grid-cols-3 gap-1 text-[9px] font-bold text-slate-500 mt-0.5">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm bg-rose-500 shrink-0" />
                <span className="truncate">Existing Obligations ({Math.round(debtRatio)}%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm bg-[#0B4F9C] shrink-0" />
                <span className="truncate">New Capacity ({Math.round((emiCapacity / income) * 100)}%)</span>
              </div>
              <div className="flex items-center gap-1.5 justify-end">
                <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500 shrink-0" />
                <span className="truncate">Net Disposable</span>
              </div>
            </div>
          </div>

          {/* Debt Ratio details */}
          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100 text-xs text-slate-500 font-semibold">
            <div className="flex justify-between">
              <span>Max Allowable FOIR:</span>
              <span className="font-bold text-slate-800 font-dmsans">{Math.round(foirLimit)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Current Debt-to-Income:</span>
              <span className={`font-bold font-dmsans ${debtRatio > 40 ? 'text-rose-500' : 'text-slate-800'}`}>
                {Math.round(debtRatio)}%
              </span>
            </div>
          </div>

          {/* Disclaimer Alert */}
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-[10px] text-slate-400 leading-relaxed flex gap-2">
            <Info size={14} className="text-slate-400 shrink-0 mt-0.5" />
            <span>
              <strong>Disclaimer:</strong> This is a facilitator output based on typical credit scoring models. The actual loan limit, interest rate, and processing parameters are subject to partner bank credit audits.
            </span>
          </div>
        </div>

        {/* Documents Required */}
        <div className="bg-white/80 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white shadow-xl shadow-slate-200/50 flex flex-col gap-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <ClipboardList size={18} className="text-[#00A86B]" />
            <h4 className="text-base font-bold text-slate-800 font-poppins">Documents Required</h4>
          </div>
          <div className="grid gap-2.5">
            {getRequiredDocuments().map((doc, index) => (
              <div key={index} className="flex gap-2 items-start text-xs font-semibold text-slate-600">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00A86B] shrink-0 mt-1.5" />
                <span>{doc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}
