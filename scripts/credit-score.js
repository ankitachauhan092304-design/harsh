document.addEventListener('DOMContentLoaded', () => {
    // Check if we are on the credit score estimator page
    const container = document.querySelector('h3') && Array.from(document.querySelectorAll('h3')).find(el => el.textContent.includes('Credit Score Estimator')) ? document.querySelector('.max-w-4xl') : null;
    if (!container) return;

    // We know we're on the Credit Score Estimator
    // Because Next.js SSR only renders the first question, we will replace the inner HTML of the motion.div
    const motionDiv = container.querySelector('.flex.flex-col.gap-6');
    if (!motionDiv) return;

    const questions = [
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

    let currentStep = 0;
    let answers = {};
    let riskFlags = [];

    const getScoreDetails = (score) => {
        if (score >= 750) return {
            label: 'EXCELLENT', color: 'text-[#00A86B] bg-emerald-50 border-emerald-100', gaugeColor: '#00A86B', probability: 'Very High (95% Approval Chance)',
            tips: ['Maintain credit card utilization below 30% to sustain this score.', 'Continue paying all current EMIs on time via autopay.', 'Avoid applying for multiple new loans within a short span.']
        };
        if (score >= 680) return {
            label: 'GOOD', color: 'text-[#0B4F9C] bg-blue-50 border-blue-100', gaugeColor: '#0B4F9C', probability: 'High (80% Approval Chance)',
            tips: ['Try to pay off small outstanding balances to cross 750.', 'Ensure zero late payments on your credit report.', 'Keep your oldest credit card active to expand credit history length.']
        };
        if (score >= 600) return {
            label: 'AVERAGE', color: 'text-amber-600 bg-amber-50 border-amber-100', gaugeColor: '#F59E0B', probability: 'Moderate (50% Approval Chance)',
            tips: ['Reduce total outstanding credit card balances immediately.', 'Limit new credit card applications and hard queries.', 'Set up reminders to prevent single late payments.']
        };
        return {
            label: 'POOR', color: 'text-rose-600 bg-rose-50 border-rose-100', gaugeColor: '#EF4444', probability: 'Low (High risk of rejection)',
            tips: ['Address and clear any settled or defaulted loan accounts immediately.', 'Avoid applying for unsecured credit cards.', 'Never miss or delay an EMI payment for the next 12-18 months.']
        };
    };

    function renderQuestion() {
        if (currentStep >= questions.length) {
            renderResult();
            return;
        }

        const q = questions[currentStep];
        const progress = Math.round((currentStep / questions.length) * 100);

        let html = `
            <div class="flex justify-between items-center text-xs font-bold text-slate-400">
              <span>QUESTION ${currentStep + 1} OF ${questions.length}</span>
              <span class="font-dmsans">${progress}% COMPLETE</span>
            </div>
            <div class="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div class="bg-[#0B4F9C] h-full transition-all duration-300" style="width: ${((currentStep + 1) / questions.length) * 100}%"></div>
            </div>
            <h4 class="text-base md:text-lg font-bold text-slate-800 font-poppins">${q.question}</h4>
            <div class="grid gap-3.5">
        `;

        q.options.forEach((opt, idx) => {
            html += `
                <button type="button" data-val="${opt.value}" data-risk="${opt.risk || ''}" class="q-opt w-full text-left p-4 rounded-xl border border-slate-200 hover:border-[#0B4F9C] hover:bg-blue-50/20 text-sm font-semibold text-slate-700 hover:text-[#0B4F9C] transition-all duration-200 flex justify-between items-center group">
                  <span>${opt.label}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-300 group-hover:text-[#0B4F9C] transition-colors"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
            `;
        });

        html += `
            </div>
            <div class="flex justify-between pt-4 border-t border-slate-100 mt-2">
              <button id="btn-back" ${currentStep === 0 ? 'disabled' : ''} class="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                Back
              </button>
            </div>
        `;

        motionDiv.innerHTML = html;

        // Attach events
        motionDiv.querySelectorAll('.q-opt').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const val = parseInt(e.currentTarget.getAttribute('data-val'));
                const risk = e.currentTarget.getAttribute('data-risk');
                
                answers[q.id] = val;
                
                // Risk flags logic
                const riskIndex = riskFlags.indexOf(q.options.find(o => o.value === val)?.risk || '');
                if (riskIndex !== -1) riskFlags.splice(riskIndex, 1);
                if (risk) riskFlags.push(risk);

                currentStep++;
                renderQuestion();
            });
        });

        document.getElementById('btn-back').addEventListener('click', () => {
            if (currentStep > 0) {
                currentStep--;
                renderQuestion();
            }
        });
    }

    function renderResult() {
        let baseScore = 650;
        Object.values(answers).forEach(val => baseScore += val);
        const estimatedScore = Math.max(300, Math.min(900, baseScore));
        const res = getScoreDetails(estimatedScore);

        let tipsHtml = '';
        res.tips.forEach(t => {
            tipsHtml += `
                <div class="flex gap-2.5 items-start p-3 bg-white border border-slate-100 rounded-xl shadow-xs">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[#00A86B] shrink-0 mt-0.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    <span class="text-xs text-slate-600 font-semibold leading-relaxed">${t}</span>
                </div>
            `;
        });

        let risksHtml = '';
        if (riskFlags.length > 0) {
            risksHtml = `<div class="flex flex-col gap-4 pt-4 border-t border-slate-100"><h4 class="text-base font-bold text-rose-600 font-poppins flex items-center gap-2"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg> Negative Factors Detected</h4><div class="grid gap-3">`;
            riskFlags.forEach(r => {
                risksHtml += `
                    <div class="flex gap-2.5 items-start p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-700">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                        <span class="text-xs font-semibold leading-relaxed">${r}</span>
                    </div>
                `;
            });
            risksHtml += `</div></div>`;
        }

        const msg = encodeURIComponent(`Hi Whitestone Fincorp, I completed the Credit Health Check.\n\n*My Estimated Profile:*\nEstimated Score: ${estimatedScore}\nHealth Rating: ${res.label}\nRisk Level: ${estimatedScore >= 750 ? 'Low Risk' : estimatedScore >= 680 ? 'Moderate Risk' : estimatedScore >= 600 ? 'High Risk' : 'Severe Default Risk'}\n\nI would like to consult an expert regarding my loan eligibility.`);
        const waUrl = `https://wa.me/919876543210?text=${msg}`;

        let html = `
            <div class="flex flex-col gap-8">
                <div class="flex justify-end mb-[-1rem]">
                    <button id="btn-reset" class="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1 text-xs font-semibold">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
                        Start Over
                    </button>
                </div>
                <div class="flex flex-col items-center justify-center p-6 bg-slate-50 border border-slate-100 rounded-3xl text-center relative overflow-hidden">
                    <span class="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Estimated Score</span>
                    <div class="relative w-48 h-28 mx-auto mt-4">
                        <svg width="192" height="110" viewBox="0 0 200 110" class="mx-auto">
                            <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#E2E8F0" stroke-width="14" stroke-linecap="round" />
                            <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="${res.gaugeColor}" stroke-width="14" stroke-linecap="round" stroke-dasharray="251.3" stroke-dashoffset="${251.3 - (((estimatedScore - 300) / 600) * 251.3)}" />
                        </svg>
                        <div class="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-end">
                            <span class="text-4xl md:text-5xl font-black text-slate-800 font-dmsans tracking-tight">${estimatedScore}</span>
                        </div>
                    </div>
                    <div class="mt-4 px-3.5 py-1 rounded-full border text-xs font-bold inline-block mx-auto ${res.color}">
                        ${res.label} CREDIT HEALTH
                    </div>
                </div>

                <div class="p-4 rounded-2xl bg-blue-50/50 border border-blue-100/50 flex flex-col gap-1.5">
                    <span class="text-xs font-bold text-slate-400 uppercase tracking-widest font-poppins">Partner Approval Probability</span>
                    <span class="text-sm font-bold text-[#0B4F9C] flex items-center gap-1.5">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                        ${res.probability}
                    </span>
                </div>

                <a href="${waUrl}" class="w-full py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#22c55e] text-white font-bold text-xs shadow-md transition-all duration-300 cursor-pointer flex items-center justify-center gap-2">
                    <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    Discuss Credit Options on WhatsApp
                </a>

                <div class="flex flex-col gap-4">
                    <h4 class="text-base font-bold text-slate-800 font-poppins">Score Improvement Action Items</h4>
                    <div class="grid gap-3">${tipsHtml}</div>
                </div>

                ${risksHtml}
            </div>
        `;

        motionDiv.innerHTML = html;

        document.getElementById('btn-reset').addEventListener('click', () => {
            currentStep = 0;
            answers = {};
            riskFlags = [];
            renderQuestion();
        });
    }

    // Initialize overriding React HTML
    renderQuestion();
});
