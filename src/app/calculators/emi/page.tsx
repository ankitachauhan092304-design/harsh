import React from 'react';
import EMICalculator from '@/components/calculators/EMICalculator';

export const metadata = {
  title: 'EMI Calculator | Calculate Loan Monthly Installments | Whitestone',
  description: 'Use our advanced EMI calculator to calculate your monthly installment payouts, principal vs interest splits, view amortization tables, and download reports.',
};

export default function EmiCalcPage() {
  return (
    <div className="flex flex-col w-full bg-slate-50 min-h-screen pb-24">
      {/* Hero */}
      <section className="relative pt-8 lg:pt-12 pb-12 bg-gradient-to-br from-slate-50 to-blue-50/20 text-center overflow-hidden">
        {/* Soft Background Blobs */}
        <div className="absolute top-20 left-10 w-80 h-80 rounded-full bg-[#0B4F9C]/5 blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-10 right-20 w-96 h-96 rounded-full bg-[#00A86B]/5 blur-3xl -z-10 pointer-events-none" />

        {/* Background Network Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none -z-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%230B4F9C\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        
        <div className="max-w-4xl mx-auto px-6 flex flex-col gap-4 relative z-10">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#00A86B] font-poppins">Planning Utilities</span>
          <h1 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight font-poppins">
            Loan EMI Calculator
          </h1>
          <p className="text-xs md:text-sm text-slate-500 font-semibold leading-relaxed max-w-xl mx-auto">
            Input principal, interest, and tenure parameters to evaluate your monthly obligations, total interest outflow, and download a detailed amortization sheet.
          </p>
        </div>
      </section>

      {/* Calculator Container */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 mt-4">
        <EMICalculator />
      </section>

      {/* Guide Section */}
      <section className="max-w-4xl mx-auto px-6 md:px-8 mt-16 flex flex-col gap-6">
        <h2 className="text-lg font-bold text-slate-800 font-poppins">Understanding EMI Calculations</h2>
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xs flex flex-col gap-4 text-xs md:text-sm text-slate-600 leading-relaxed font-semibold">
          <p>
            Equated Monthly Installment (EMI) is the fixed payment amount made by a borrower to a lender at a specified date each calendar month. EMIs consist of both interest and principal components, structured such that over time, the interest portion decreases while the principal portion increases.
          </p>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <span className="font-bold text-slate-800 font-poppins block text-xs tracking-wider uppercase mb-1">Standard Mathematical Formula</span>
            <span className="text-sm md:text-base font-bold text-[#0B4F9C] font-dmsans">
              EMI = [P x R x (1+R)^N] / [(1+R)^N - 1]
            </span>
          </div>
          <p className="mt-2">
            Where: <br />
            <strong>P</strong> = Principal Loan Amount (the capital borrowed). <br />
            <strong>R</strong> = Monthly Interest Rate (annual rate divided by 12 and then divided by 100). <br />
            <strong>N</strong> = Loan Tenure in Months (years multiplied by 12).
          </p>
        </div>
      </section>
    </div>
  );
}
