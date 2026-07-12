'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, CheckCircle, ChevronLeft, ChevronRight, RefreshCw, Star, Info } from 'lucide-react';
import { buildCreditScoreShareMessage, buildWhatsAppUrl, DEFAULT_WA_NUMBER } from '@/lib/whatsapp';

interface Question {
  id: string;
  question: string;
  options: { label: string; value: number; risk?: string }[];
}

export default function CreditScoreEstimator() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [riskFlags, setRiskFlags] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [estimatedScore, setEstimatedScore] = useState(650);

  const questions: Question[] = [
    {
      id: 'age',
      question: 'What is your age?',
      options: [
        { label: '18 - 21 Years', value: -20 },
        { label: '22 - 30 Years', value: 10 },
        { label: '31 - 50 Years', value: 35 },
        { label: 'Above 50 Years', value: 20 },
      ],
    },
    {
      id: 'employment',
      question: 'What is your employment status?',
      options: [
        { label: 'Salaried (Govt / Public Sector / MNC)', value: 40 },
        { label: 'Salaried (Private Company)', value: 20 },
        { label: 'Self Employed Professional (Doctor, CA, etc.)', value: 25 },
        { label: 'Business Owner / MSME', value: 15 },
        { label: 'Retired / Student / Homemaker', value: -10 },
      ],
    },
    {
      id: 'income',
      question: 'What is your net monthly take-home income?',
      options: [
        { label: 'Below ₹25,000', value: -15 },
        { label: '₹25,000 - ₹50,000', value: 15 },
        { label: '₹50,000 - ₹1,00,000', value: 30 },
        { label: 'Above ₹1,00,000', value: 45 },
      ],
    },
    {
      id: 'existEmi',
      question: 'What percentage of your income goes towards monthly EMIs?',
      options: [
        { label: 'No existing EMIs', value: 35 },
        { label: 'Less than 30%', value: 20 },
        { label: '30% - 50%', value: -10, risk: 'High existing debt burden' },
        { label: 'More than 50%', value: -35, risk: 'Debt-to-Income ratio exceeds 50%' },
      ],
    },
    {
      id: 'ccUsage',
      question: 'How do you use your credit cards?',
      options: [
        { label: 'I do not have a credit card', value: 0 },
        { label: 'Under 30% utilization (pay full bills)', value: 40 },
        { label: '30% - 60% utilization (pay full bills)', value: 10 },
        { label: 'Over 60% utilization / Pay only minimum due', value: -30, risk: 'High credit card utilization' },
      ],
    },
    {
      id: 'loanHistory',
      question: 'What is your previous loan history?',
      options: [
        { label: 'No previous loans or credit history', value: 0 },
        { label: 'Paid back previous loans on time', value: 45 },
        { label: 'Currently paying active loans on time', value: 30 },
        { label: 'Settled a loan or defaulted in the past', value: -60, risk: 'Past loan settlement / default' },
      ],
    },
    {
      id: 'missedEmi',
      question: 'Have you missed any EMI or card payments in the last 12 months?',
      options: [
        { label: 'Never missed any payment', value: 40 },
        { label: 'Missed once (delayed by <30 days)', value: -20, risk: 'Single late payment in last 12 months' },
        { label: 'Missed multiple times / default', value: -70, risk: 'Multiple late payments/defaults' },
      ],
    },
    {
      id: 'existLoans',
      question: 'How many active loans/credit cards do you currently have?',
      options: [
        { label: 'None', value: 10 },
        { label: '1 - 2 active accounts', value: 25 },
        { label: '3 - 4 active accounts', value: 10 },
        { label: '5 or more active accounts', value: -20, risk: 'Multiple active lines of credit (Credit Hungry)' },
      ],
    },
    {
      id: 'businessOwner',
      question: 'If you run a business, do you have active GST registration?',
      options: [
        { label: 'Not a business owner', value: 0 },
        { label: 'Yes, GST registered with 1+ year vintage', value: 20 },
        { label: 'No GST / Unregistered business', value: -5 },
      ],
    },
  ];

  const handleSelectOption = (qId: string, val: number, riskFlag?: string) => {
    setAnswers({ ...answers, [qId]: val });

    // Handle risk flag accumulation
    const updatedRisks = [...riskFlags];
    const riskIndex = updatedRisks.indexOf(questions.find((q) => q.id === qId)?.options.find((o) => o.value === val)?.risk || '');
    if (riskIndex !== -1) {
      updatedRisks.splice(riskIndex, 1);
    }
    if (riskFlag) {
      updatedRisks.push(riskFlag);
    }
    setRiskFlags(updatedRisks);

    // Proceed
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      calculateResult({ ...answers, [qId]: val });
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const calculateResult = (finalAnswers: Record<string, number>) => {
    let baseScore = 650;
    Object.values(finalAnswers).forEach((val) => {
      baseScore += val;
    });

    // Cap the score
    const finalScore = Math.max(300, Math.min(900, baseScore));
    setEstimatedScore(finalScore);
    setShowResult(true);
  };

  const getScoreDetails = (score: number) => {
    if (score >= 750) {
      return {
        label: 'EXCELLENT',
        color: 'text-[#00A86B] bg-emerald-50 border-emerald-100',
        barColor: 'bg-[#00A86B]',
        gaugeColor: '#00A86B',
        probability: 'Very High (95% Approval Chance)',
        tips: [
          'Maintain credit card utilization below 30% to sustain this score.',
          'Continue paying all current EMIs on time via autopay.',
          'Avoid applying for multiple new loans within a short span.',
        ],
      };
    } else if (score >= 680) {
      return {
        label: 'GOOD',
        color: 'text-[#0B4F9C] bg-blue-50 border-blue-100',
        barColor: 'bg-[#0B4F9C]',
        gaugeColor: '#0B4F9C',
        probability: 'High (80% Approval Chance)',
        tips: [
          'Try to pay off small outstanding balances to cross 750.',
          'Ensure zero late payments on your credit report.',
          'Keep your oldest credit card active to expand credit history length.',
        ],
      };
    } else if (score >= 600) {
      return {
        label: 'AVERAGE',
        color: 'text-amber-600 bg-amber-50 border-amber-100',
        barColor: 'bg-amber-500',
        gaugeColor: '#F59E0B',
        probability: 'Moderate (50% Approval Chance, may need collateral/co-applicant)',
        tips: [
          'Reduce total outstanding credit card balances immediately.',
          'Limit new credit card applications and hard queries.',
          'Set up reminders to prevent single late payments.',
        ],
      };
    } else {
      return {
        label: 'POOR',
        color: 'text-rose-600 bg-rose-50 border-rose-100',
        barColor: 'bg-rose-500',
        gaugeColor: '#EF4444',
        probability: 'Low (High risk of rejection or high interest rates)',
        tips: [
          'Address and clear any settled or defaulted loan accounts immediately.',
          'Avoid applying for unsecured credit cards; consider a card secured against a Fixed Deposit.',
          'Never miss or delay an EMI payment for the next 12-18 months.',
        ],
      };
    }
  };

  const resultDetails = getScoreDetails(estimatedScore);

  const resetEstimator = () => {
    setCurrentStep(0);
    setAnswers({});
    setRiskFlags([]);
    setShowResult(false);
    setEstimatedScore(650);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 rounded-[40px] bg-gradient-to-br from-slate-50 via-blue-50/20 to-white border border-white shadow-2xl shadow-blue-900/5 max-w-4xl mx-auto">
      <div className="bg-white/80 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white shadow-xl shadow-slate-200/50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-[#0B4F9C]/20 to-transparent" />
      <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2.5 rounded-xl bg-blue-50 text-[#0B4F9C]">
            <Star size={20} className="fill-[#0B4F9C] stroke-none" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 font-poppins">Credit Score Estimator</h3>
        </div>
        {showResult && (
          <button
            onClick={resetEstimator}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1 text-xs font-semibold"
          >
            <RefreshCw size={14} />
            Start Over
          </button>
        )}
      </div>

      {/* CIBIL Disclaimer Alert */}
      <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-xs text-slate-500 mb-6 flex gap-2">
        <Info size={16} className="text-slate-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Non-Official Estimate:</strong> This credit health check provides an estimated profile score. It is NOT an official CIBIL, Experian, or Equifax credit score. Whitestone Fincorp facilitates credit assessments but does not pull official credit report pulls without your explicit consent via official forms.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!showResult ? (
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-6"
          >
            {/* Step Indicator */}
            <div className="flex justify-between items-center text-xs font-bold text-slate-400">
              <span>QUESTION {currentStep + 1} OF {questions.length}</span>
              <span className="font-dmsans">{Math.round(((currentStep) / questions.length) * 100)}% COMPLETE</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#0B4F9C] h-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* Question Label */}
            <h4 className="text-base md:text-lg font-bold text-slate-800 font-poppins">
              {questions[currentStep].question}
            </h4>

            {/* Options List */}
            <div className="grid gap-3.5">
              {questions[currentStep].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(questions[currentStep].id, option.value, option.risk)}
                  className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-[#0B4F9C] hover:bg-blue-50/20 text-sm font-semibold text-slate-700 hover:text-[#0B4F9C] transition-all duration-200 flex justify-between items-center group"
                >
                  <span>{option.label}</span>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-[#0B4F9C] transition-colors" />
                </button>
              ))}
            </div>

            {/* Navigation Button */}
            <div className="flex justify-between pt-4 border-t border-slate-100 mt-2">
              <button
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={16} />
                Back
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-8"
          >
            {/* Score Ring / Health Display */}
            <div className="flex flex-col items-center justify-center p-6 bg-slate-50 border border-slate-100 rounded-3xl text-center relative overflow-hidden">
              <div className="flex flex-col z-10">
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Estimated Score</span>
                
                {/* SVG Semi-circular Gauge */}
                <div className="relative w-48 h-28 mx-auto mt-4">
                  <svg width="192" height="110" viewBox="0 0 200 110" className="mx-auto">
                    <path
                      d="M 20 100 A 80 80 0 0 1 180 100"
                      fill="none"
                      stroke="#E2E8F0"
                      strokeWidth="14"
                      strokeLinecap="round"
                    />
                    <motion.path
                      d="M 20 100 A 80 80 0 0 1 180 100"
                      fill="none"
                      stroke={resultDetails.gaugeColor}
                      strokeWidth="14"
                      strokeLinecap="round"
                      strokeDasharray="251.3"
                      initial={{ strokeDashoffset: 251.3 }}
                      animate={{ strokeDashoffset: 251.3 - (((estimatedScore - 300) / 600) * 251.3) }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                    />
                  </svg>
                  
                  {/* Score Text Overlay inside Gauge */}
                  <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-end">
                    <motion.span
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 220, damping: 15, delay: 0.2 }}
                      className="text-4xl md:text-5xl font-black text-slate-800 font-dmsans tracking-tight"
                    >
                      {estimatedScore}
                    </motion.span>
                  </div>
                </div>

                <div className={`mt-4 px-3.5 py-1 rounded-full border text-xs font-bold inline-block mx-auto ${resultDetails.color}`}>
                  {resultDetails.label} CREDIT HEALTH
                </div>
              </div>
            </div>

            {/* Approval Probability */}
            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100/50 flex flex-col gap-1.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest font-poppins">Partner Approval Probability</span>
              <span className="text-sm font-bold text-[#0B4F9C] flex items-center gap-1.5">
                <CheckCircle size={16} className="text-emerald-500" />
                {resultDetails.probability}
              </span>
            </div>

            <button
              onClick={() => {
                const msg = buildCreditScoreShareMessage({
                  estimatedScore,
                  rating: resultDetails.label,
                  riskLevel: estimatedScore >= 750 ? 'Low Risk' :
                             estimatedScore >= 680 ? 'Moderate Risk' :
                             estimatedScore >= 600 ? 'High Risk' : 'Severe Default Risk'
                });
                window.location.href = buildWhatsAppUrl(msg, DEFAULT_WA_NUMBER);
              }}
              className="w-full py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#22c55e] text-white font-bold text-xs shadow-md transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Discuss Credit Options on WhatsApp
            </button>


            {/* Action Tips */}
            <div className="flex flex-col gap-4">
              <h4 className="text-base font-bold text-slate-800 font-poppins">Score Improvement Action Items</h4>
              <div className="grid gap-3">
                {resultDetails.tips.map((tip, index) => (
                  <div key={index} className="flex gap-2.5 items-start p-3 bg-white border border-slate-100 rounded-xl shadow-xs">
                    <CheckCircle size={16} className="text-[#00A86B] shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-600 font-semibold leading-relaxed">{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Indicators Flagged */}
            {riskFlags.length > 0 && (
              <div className="flex flex-col gap-4 pt-4 border-t border-slate-100">
                <h4 className="text-base font-bold text-slate-800 font-poppins">Risk Factors Flagged</h4>
                <div className="grid gap-2.5">
                  {riskFlags.map((risk, index) => (
                    <div key={index} className="flex gap-2 items-center p-3 bg-rose-50/50 border border-rose-100/50 text-rose-800 rounded-xl">
                      <ShieldAlert size={16} className="text-rose-500 shrink-0" />
                      <span className="text-xs font-bold">{risk}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}
