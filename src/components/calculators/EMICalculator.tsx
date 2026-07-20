'use client';

import React, { useState } from 'react';
import { Calculator, Download, RefreshCw, IndianRupee, FileText, Share2, Copy, Check } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { buildEMIShareMessage, buildWhatsAppUrl, DEFAULT_WA_NUMBER } from '@/lib/whatsapp';
import { CALCULATOR_CONFIG } from '@/config/calculator.config';

interface AmortizationRow {
  year: number;
  principal: number;
  interest: number;
  totalPayment: number;
  balance: number;
}

export default function EMICalculator() {
  const [amount, setAmount] = useState<number>(CALCULATOR_CONFIG.EMI.LOAN_AMOUNT.DEFAULT);
  const [interestRate, setInterestRate] = useState<number>(CALCULATOR_CONFIG.EMI.INTEREST_RATE.DEFAULT);
  const [tenure, setTenure] = useState<number>(CALCULATOR_CONFIG.EMI.TENURE_YEARS.DEFAULT); // in years
  const [copied, setCopied] = useState<boolean>(false);

  // Calculate EMI & Amortization directly during rendering
  const P = amount;
  const r = interestRate / 12 / 100;
  const n = tenure * 12;

  let monthlyEmi = 0;
  let totalInterest = 0;
  let totalPayment = 0;
  const amortization: AmortizationRow[] = [];

  if (amount > 0 && interestRate > 0 && tenure > 0) {
    monthlyEmi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    totalPayment = monthlyEmi * n;
    totalInterest = totalPayment - P;

    let balance = P;
    let yearlyPrincipal = 0;
    let yearlyInterest = 0;

    for (let i = 1; i <= n; i++) {
      const interest = balance * r;
      const principal = monthlyEmi - interest;
      balance -= principal;

      yearlyPrincipal += principal;
      yearlyInterest += interest;

      if (i % 12 === 0 || i === n) {
        amortization.push({
          year: Math.ceil(i / 12),
          principal: Math.max(0, yearlyPrincipal),
          interest: Math.max(0, yearlyInterest),
          totalPayment: yearlyPrincipal + yearlyInterest,
          balance: Math.max(0, balance),
        });
        yearlyPrincipal = 0;
        yearlyInterest = 0;
      }
    }
  }

  const copyResults = () => {
    const text = `Whitestone Fincorp Loan EMI Estimate:\nPrincipal: Rs. ${amount.toLocaleString()}\nInterest Rate: ${interestRate}% p.a.\nTenure: ${tenure} Years\nMonthly EMI: Rs. ${Math.round(monthlyEmi).toLocaleString()}\nTotal Interest: Rs. ${Math.round(totalInterest).toLocaleString()}\nTotal Payment: Rs. ${Math.round(totalPayment).toLocaleString()}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareResults = () => {
    const shareData = {
      title: 'Whitestone Fincorp EMI Estimate',
      text: `Calculated EMI payout: Rs. ${Math.round(monthlyEmi).toLocaleString()}/mo for a loan of Rs. ${amount.toLocaleString()} at ${interestRate}% interest.`,
      url: typeof window !== 'undefined' ? window.location.href : '',
    };
    if (navigator.share) {
      navigator.share(shareData).catch(() => copyResults());
    } else {
      copyResults();
    }
  };

  const resetCalculator = () => {
    setAmount(100000);
    setInterestRate(8.5);
    setTenure(20);
  };

  const chartData = [
    { name: 'Principal Amount', value: amount, color: '#0B4F9C' },
    { name: 'Total Interest', value: totalInterest, color: '#00A86B' },
  ];

  // Export PDF Report
  const downloadPdf = () => {
    const doc = new jsPDF();
    
    // Header styling
    doc.setFillColor(11, 79, 156); // Primary blue
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('Whitestone Fincorp', 20, 20);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('Premium Loan Facilitation & Consulting', 20, 30);
    doc.text(`Report Generated: ${new Date().toLocaleDateString()}`, 150, 25);

    // Loan Summary Box
    doc.setFillColor(248, 250, 252);
    doc.rect(20, 50, 170, 45, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.rect(20, 50, 170, 45);

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('LOAN SUMMARY REPORT', 25, 58);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Requested Loan Principal: Rs. ${amount.toLocaleString()}`, 25, 68);
    doc.text(`Applicable Interest Rate: ${interestRate}% p.a.`, 25, 74);
    doc.text(`Total Tenure Selected: ${tenure} Years (${tenure * 12} Months)`, 25, 80);
    doc.text(`Monthly Installment (EMI): Rs. ${Math.round(monthlyEmi).toLocaleString()}`, 25, 86);

    doc.text(`Total Interest Payable: Rs. ${Math.round(totalInterest).toLocaleString()}`, 115, 68);
    doc.text(`Total Cumulative Payment: Rs. ${Math.round(totalPayment).toLocaleString()}`, 115, 74);

    // Amortization Table Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('ANNUAL AMORTIZATION SCHEDULE', 20, 110);

    const tableRows = amortization.map((row) => [
      `Year ${row.year}`,
      `Rs. ${Math.round(row.principal).toLocaleString()}`,
      `Rs. ${Math.round(row.interest).toLocaleString()}`,
      `Rs. ${Math.round(row.totalPayment).toLocaleString()}`,
      `Rs. ${Math.round(row.balance).toLocaleString()}`,
    ]);

    autoTable(doc, {
      startY: 115,
      head: [['Year', 'Principal Paid', 'Interest Paid', 'Total Annual Outflow', 'Outstanding Balance']],
      body: tableRows,
      theme: 'striped',
      headStyles: { fillColor: [11, 79, 156] },
      styles: { fontSize: 9 },
    });

    // Disclaimer
    const docWithAutoTable = doc as unknown as { lastAutoTable: { finalY: number } } & typeof doc;
    const finalY = docWithAutoTable.lastAutoTable.finalY + 15;
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.setFont('helvetica', 'italic');
    doc.text('Disclaimer: This is an estimated report facilitated by Whitestone Fincorp. Final interest rates and terms are subject to bank approval.', 20, finalY);

    doc.save(`Whitestone_EMI_Report_${Date.now()}.pdf`);
  };

  return (
    <div className="emi-calculator p-4 md:p-6 lg:p-8 rounded-[40px] bg-gradient-to-br from-slate-50 via-blue-50/20 to-white border border-white shadow-2xl shadow-blue-900/5">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sliders Input */}
        <div className="lg:col-span-7 bg-white/80 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white shadow-xl shadow-slate-200/50 flex flex-col gap-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-[#0B4F9C]/20 to-transparent" />
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-xl bg-blue-50 text-[#0B4F9C]">
              <Calculator size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 font-poppins">EMI Calculator</h3>
          </div>
          <button
            id="emi-reset-btn"
            onClick={resetCalculator}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1 text-xs font-semibold"
          >
            <RefreshCw size={14} />
            Reset
          </button>
        </div>

        {/* Loan Amount Slider */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-slate-500">Loan Amount</span>
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-100 rounded-xl px-3 py-1 text-sm font-bold text-[#0B4F9C] font-dmsans">
              <IndianRupee size={14} />
              <input
                type="number"
                id="loanAmountInput"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-24 bg-transparent text-right outline-none"
              />
            </div>
          </div>
          <input
            type="range"
            id="loanAmount"
            min={CALCULATOR_CONFIG.EMI.LOAN_AMOUNT.MIN}
            max={CALCULATOR_CONFIG.EMI.LOAN_AMOUNT.MAX}
            step={CALCULATOR_CONFIG.EMI.LOAN_AMOUNT.STEP}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full accent-[#0B4F9C] cursor-pointer h-2 bg-slate-100 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-semibold font-dmsans">
            <span>₹1 LAKH</span>
            <span>₹50 LAKHS</span>
            <span>₹10 CRORES</span>
          </div>
        </div>

        {/* Interest Rate Slider */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-slate-500">Interest Rate</span>
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-100 rounded-xl px-3 py-1 text-sm font-bold text-[#0B4F9C] font-dmsans">
              <input
                type="number"
                id="interestRateInput"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-16 bg-transparent text-right outline-none"
              />
              <span>% p.a.</span>
            </div>
          </div>
          <input
            type="range"
            id="interestRate"
            min={CALCULATOR_CONFIG.EMI.INTEREST_RATE.MIN}
            max={CALCULATOR_CONFIG.EMI.INTEREST_RATE.MAX}
            step={CALCULATOR_CONFIG.EMI.INTEREST_RATE.STEP}
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full accent-[#0B4F9C] cursor-pointer h-2 bg-slate-100 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-semibold font-dmsans">
            <span>{CALCULATOR_CONFIG.EMI.INTEREST_RATE.MIN}%</span>
            <span>{CALCULATOR_CONFIG.EMI.INTEREST_RATE.MAX}%</span>
          </div>
        </div>

        {/* Tenure Slider */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-slate-500">Repayment Tenure</span>
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-100 rounded-xl px-3 py-1 text-sm font-bold text-[#0B4F9C] font-dmsans">
              <input
                type="number"
                id="loanTenureInput"
                step={CALCULATOR_CONFIG.EMI.TENURE_YEARS.STEP}
                value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
                className="w-16 bg-transparent text-right outline-none"
              />
              <span>Years</span>
            </div>
          </div>
          <input
            type="range"
            id="loanTenure"
            min={CALCULATOR_CONFIG.EMI.TENURE_YEARS.MIN}
            max={CALCULATOR_CONFIG.EMI.TENURE_YEARS.MAX}
            step={CALCULATOR_CONFIG.EMI.TENURE_YEARS.STEP}
            value={tenure}
            onChange={(e) => setTenure(Number(e.target.value))}
            className="w-full accent-[#0B4F9C] cursor-pointer h-2 bg-slate-100 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-semibold font-dmsans">
            <span>{CALCULATOR_CONFIG.EMI.TENURE_YEARS.MIN} Yr</span>
            <span>{CALCULATOR_CONFIG.EMI.TENURE_YEARS.MAX} Yrs</span>
          </div>
        </div>

        {/* Export and Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
          <button
            onClick={downloadPdf}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#0B4F9C] hover:bg-[#083c78] text-white font-bold text-xs shadow-md transition-all duration-300 cursor-pointer"
          >
            <Download size={14} />
            Download PDF
          </button>
          <button
            onClick={copyResults}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-all duration-300 cursor-pointer"
          >
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy Estimate'}
          </button>
          <button
            onClick={shareResults}
            className="p-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold transition-all duration-300 cursor-pointer flex items-center justify-center"
            title="Share Estimate"
          >
            <Share2 size={14} />
          </button>
          <button
            onClick={() => {
              const msg = buildEMIShareMessage({ loanAmount: amount, interestRate, tenure, monthlyEmi, totalInterest, totalPayment });
              window.location.href = buildWhatsAppUrl(msg, DEFAULT_WA_NUMBER);
            }}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#25D366] hover:bg-[#22c55e] text-white font-bold text-xs shadow-sm transition-all duration-300 cursor-pointer"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Discuss on WhatsApp
          </button>
        </div>
      </div>

      {/* Outputs & Charts */}
      <div className="lg:col-span-5 flex flex-col gap-8">
        <div className="bg-white/80 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white shadow-xl shadow-slate-200/50 flex flex-col gap-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-[#00A86B]/20 to-transparent" />
          <h4 className="text-base font-bold text-slate-800 font-poppins pb-3 border-b border-slate-100">Your EMI Summary</h4>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Monthly EMI</span>
              <span className="text-lg font-bold text-[#0B4F9C] font-dmsans mt-1" id="emiValue">
                ₹{Math.round(monthlyEmi).toLocaleString()}
              </span>
            </div>
            <div className="flex flex-col p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Interest</span>
              <span className="text-lg font-bold text-[#00A86B] font-dmsans mt-1" id="totalInterestValue">
                ₹{Math.round(totalInterest).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex flex-col p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50 text-center">
            <span className="text-xs font-semibold text-slate-500">Total Payments (Principal + Interest)</span>
            <span className="text-2xl font-black text-[#0B4F9C] font-dmsans mt-1" id="totalPaymentValue">
              ₹{Math.round(totalPayment).toLocaleString()}
            </span>
          </div>

          {/* Recharts Pie Chart */}
          <div className="h-44 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${Math.round(Number(value) || 0).toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Principal</span>
              <span className="text-sm font-bold text-slate-800 font-dmsans">
                {Math.round((amount / totalPayment) * 100)}%
              </span>
            </div>
          </div>

          {/* Chart Legend */}
          <div className="flex justify-center gap-6 text-xs font-semibold text-slate-600">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#0B4F9C]" />
              <span>Principal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#00A86B]" />
              <span>Interest</span>
            </div>
          </div>
        </div>
      </div>

      {/* Amortization Table */}
      <div className="lg:col-span-12 bg-white/80 backdrop-blur-xl rounded-3xl border border-white shadow-xl shadow-slate-200/50 p-6 md:p-8 mt-4 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-xl bg-slate-50 text-slate-600">
              <FileText size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 font-poppins">Amortization Schedule</h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm font-inter">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <th className="py-4 px-6 rounded-l-2xl">Year</th>
                <th className="py-4 px-6">Principal Paid</th>
                <th className="py-4 px-6">Interest Paid</th>
                <th className="py-4 px-6">Total Payments</th>
                <th className="py-4 px-6 rounded-r-2xl">Balance Outstanding</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
              {amortization.map((row) => (
                <tr key={row.year} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6 font-bold text-[#0B4F9C]">Year {row.year}</td>
                  <td className="py-4 px-6 font-dmsans">₹{Math.round(row.principal).toLocaleString()}</td>
                  <td className="py-4 px-6 font-dmsans text-[#00A86B]">₹{Math.round(row.interest).toLocaleString()}</td>
                  <td className="py-4 px-6 font-dmsans">₹{Math.round(row.totalPayment).toLocaleString()}</td>
                  <td className="py-4 px-6 font-dmsans text-slate-400">₹{Math.round(row.balance).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  );
}
