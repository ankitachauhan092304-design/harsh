import React from 'react';
import CreditScoreEstimator from '@/components/calculators/CreditScoreEstimator';

export const metadata = {
  title: 'Credit Score Estimator | Credit Health Check online | Whitestone',
  description: 'Evaluate your credit eligibility profile, estimate your rating score between 300 and 900, identify risk factors, and read tips to improve CIBIL ratings.',
};

export default function CreditScorePage() {
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
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#00A86B] font-poppins">Credit Assessment</span>
          <h1 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight font-poppins">
            Credit Score Estimator
          </h1>
          <p className="text-xs md:text-sm text-slate-500 font-semibold leading-relaxed max-w-xl mx-auto">
            Analyze key parameters like debt utilization, payment histories, and vintage to check your estimated credit health. Undergo a soft audit before bank reviews.
          </p>
        </div>
      </section>

      {/* Estimator Container */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 mt-4">
        <CreditScoreEstimator />
      </section>

      {/* Tiers guide */}
      <section className="max-w-4xl mx-auto px-6 md:px-8 mt-16 flex flex-col gap-6">
        <h2 className="text-lg font-bold text-slate-800 font-poppins">How Lenders Read Credit Score Tiers</h2>
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xs flex flex-col gap-6 text-xs md:text-sm text-slate-600 leading-relaxed font-semibold">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
              <span className="font-bold text-[#00A86B] block">750 - 900</span>
              <span className="text-[10px] text-slate-400 font-bold block mt-1 uppercase">Excellent</span>
              <span className="text-[11px] text-slate-600 mt-2 block font-semibold">Lowest rates, instant pre-approval.</span>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl">
              <span className="font-bold text-[#0B4F9C] block">680 - 749</span>
              <span className="text-[10px] text-slate-400 font-bold block mt-1 uppercase">Good</span>
              <span className="text-[11px] text-slate-600 mt-2 block font-semibold">Competitive rates, fast processing.</span>
            </div>
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl">
              <span className="font-bold text-amber-600 block">600 - 679</span>
              <span className="text-[10px] text-slate-400 font-bold block mt-1 uppercase">Average</span>
              <span className="text-[11px] text-slate-600 mt-2 block font-semibold">May need co-applicant or collateral.</span>
            </div>
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl">
              <span className="font-bold text-rose-600 block">300 - 599</span>
              <span className="text-[10px] text-slate-400 font-bold block mt-1 uppercase">Poor</span>
              <span className="text-[11px] text-slate-600 mt-2 block font-semibold">High risk of rejection or high rates.</span>
            </div>
          </div>

          <p className="mt-2">
            While CIBIL reports provide official scores, lenders also evaluate other parameters like credit history vintage (length of record), debt-to-income (FOIR) ratios, and tax returns (ITR records) which we map together during our consulting sessions.
          </p>
        </div>
      </section>
    </div>
  );
}
