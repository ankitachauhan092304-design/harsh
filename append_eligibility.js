const fs = require('fs');
const jsCode = `
    // Eligibility Checker Logic
    const eligContainer = document.querySelector('h4') && Array.from(document.querySelectorAll('h4')).find(el => el.textContent.includes('Estimated Eligibility')) ? document.body : null;
    if (eligContainer && document.querySelectorAll('input[type="range"]').length === 3) {
        // State
        let loanType = 'PERSONAL';
        let employment = 'SALARIED';
        let age = 30;
        let income = 50000;
        let existingEmi = 10000;
        let isMetro = true;
        
        // Find inputs
        const ranges = document.querySelectorAll('input[type="range"]');
        const ageRange = ranges[0];
        const incomeRange = ranges[1];
        const emiRange = ranges[2];
        
        // Values displays
        const valSpans = Array.from(document.querySelectorAll('.flex.justify-between.items-center span.font-bold'));
        const ageVal = valSpans[0];
        const incomeVal = valSpans[1];
        const emiVal = valSpans[2];
        
        // Buttons
        const allBtns = Array.from(document.querySelectorAll('button[type="button"]'));
        const loanBtns = allBtns.filter(b => ['Personal', 'Business', 'Home / LAP'].includes(b.textContent.trim()));
        const empBtns = allBtns.filter(b => ['Salaried', 'Self Employed / Business'].includes(b.textContent.trim()));
        const metroBtn = allBtns.find(b => b.parentElement.textContent.includes('Metro City'));
        
        // Output elements
        const maxAmountEl = document.querySelector('.text-3xl.font-black.text-\\[\\#0B4F9C\\]');
        // The emi capacity is the next bold text inside a p-4 block
        const p4Blocks = document.querySelectorAll('.p-4.bg-slate-50');
        const emiCapEl = p4Blocks.length > 0 ? p4Blocks[0].querySelector('.text-lg, .text-base') : null;
        
        // Approval Chances Element
        const approvalChanceTextEl = p4Blocks.length > 1 ? Array.from(p4Blocks[1].querySelectorAll('span')).find(s => ['Pre-Approved', 'High Chance', 'Moderate', 'Low Chance', 'Excellent', 'Good', 'Average', 'Poor'].includes(s.textContent.trim())) || p4Blocks[1].querySelector('span:last-child') : null;
        const approvalDot = p4Blocks.length > 1 ? p4Blocks[1].querySelector('div.w-2.h-2') : null;

        function updateUI() {
            // Update buttons visually
            loanBtns.forEach(b => {
                const isSelected = (b.textContent.trim() === 'Personal' && loanType === 'PERSONAL') || 
                                   (b.textContent.trim() === 'Business' && loanType === 'BUSINESS') || 
                                   (b.textContent.trim() === 'Home / LAP' && loanType === 'HOME');
                b.className = isSelected 
                    ? 'py-3 rounded-xl text-xs font-bold border transition-all border-[#0B4F9C] bg-blue-50/20 text-[#0B4F9C]' 
                    : 'py-3 rounded-xl text-xs font-bold border transition-all border-slate-200 hover:border-slate-300 text-slate-600';
            });
            empBtns.forEach(b => {
                const isSelected = (b.textContent.trim() === 'Salaried' && employment === 'SALARIED') || 
                                   (b.textContent.trim() === 'Self Employed / Business' && employment === 'SELF_EMPLOYED');
                b.className = isSelected 
                    ? 'py-3 rounded-xl text-xs font-bold border transition-all border-[#0B4F9C] bg-blue-50/20 text-[#0B4F9C]' 
                    : 'py-3 rounded-xl text-xs font-bold border transition-all border-slate-200 hover:border-slate-300 text-slate-600';
            });
            
            if (metroBtn) {
                metroBtn.className = isMetro 
                    ? 'w-12 h-6 rounded-full p-1 transition-colors duration-200 cursor-pointer bg-[#00A86B]'
                    : 'w-12 h-6 rounded-full p-1 transition-colors duration-200 cursor-pointer bg-slate-300';
                const inner = metroBtn.querySelector('div');
                if(inner) {
                    inner.className = isMetro 
                        ? 'bg-white w-4 h-4 rounded-full shadow-md transition-transform duration-200 translate-x-6'
                        : 'bg-white w-4 h-4 rounded-full shadow-md transition-transform duration-200 translate-x-0';
                }
            }
            
            if(ageVal) ageVal.textContent = age + ' Years';
            if(incomeVal) incomeVal.textContent = '₹' + parseInt(income).toLocaleString('en-IN');
            if(emiVal) emiVal.textContent = '₹' + parseInt(existingEmi).toLocaleString('en-IN');
            
            calculate();
        }
        
        function calculate() {
            // Same logic as EligibilityCalculator.tsx
            const maxFoir = income < 30000 ? 0.4 : income < 75000 ? 0.5 : 0.6;
            const maxEmiAllowed = income * maxFoir;
            let emiCapacity = Math.max(0, maxEmiAllowed - existingEmi);
            
            let rate = 0;
            let tenure = 0;
            if (loanType === 'PERSONAL') {
                rate = 12.5; tenure = 5;
            } else if (loanType === 'BUSINESS') {
                rate = 14.5; tenure = 3;
            } else {
                rate = 8.5; tenure = 20;
            }
            
            const r = (rate / 12) / 100;
            const n = tenure * 12;
            let amount = 0;
            if (r > 0) {
                amount = emiCapacity * ((Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n)));
            }
            
            // Adjustments
            if (employment === 'SELF_EMPLOYED') amount *= 0.9;
            if (isMetro) amount *= 1.1;
            if (age > 55) amount *= 0.8;
            else if (age > 45) amount *= 0.9;
            else if (age < 23) amount *= 0.85;
            
            // Output
            if(maxAmountEl) maxAmountEl.textContent = '₹' + Math.round(amount).toLocaleString('en-IN');
            if(emiCapEl) emiCapEl.textContent = '₹' + Math.round(emiCapacity).toLocaleString('en-IN') + '/mo';
            
            const debtRatio = (existingEmi / income) * 100;
            let approvalChance = 'GOOD';
            if (debtRatio > 60 || age > 65 || age < 21 || income < 15000) approvalChance = 'POOR';
            else if (debtRatio > 45) approvalChance = 'AVERAGE';
            else if (debtRatio < 25 && income > 40000) approvalChance = 'EXCELLENT';
            
            if (approvalChanceTextEl) {
                approvalChanceTextEl.textContent = approvalChance === 'EXCELLENT' ? 'Pre-Approved' :
                                                 approvalChance === 'GOOD' ? 'High Chance' :
                                                 approvalChance === 'AVERAGE' ? 'Moderate' : 'Low Chance';
                approvalChanceTextEl.className = 'text-sm font-bold mt-1.5 font-poppins ' + (
                    approvalChance === 'EXCELLENT' ? 'text-emerald-500' :
                    approvalChance === 'GOOD' ? 'text-blue-500' :
                    approvalChance === 'AVERAGE' ? 'text-amber-500' : 'text-rose-500'
                );
            }
            if (approvalDot) {
                approvalDot.className = 'w-2 h-2 rounded-full ' + (
                    approvalChance === 'EXCELLENT' ? 'bg-emerald-500' :
                    approvalChance === 'GOOD' ? 'bg-blue-500' :
                    approvalChance === 'AVERAGE' ? 'bg-amber-500' : 'bg-red-500'
                );
            }
        }

        // Attach events
        loanBtns.forEach(b => b.addEventListener('click', () => {
            const t = b.textContent.trim();
            if(t === 'Personal') loanType = 'PERSONAL';
            else if(t === 'Business') loanType = 'BUSINESS';
            else if(t === 'Home / LAP') loanType = 'HOME';
            updateUI();
        }));
        
        empBtns.forEach(b => b.addEventListener('click', () => {
            const t = b.textContent.trim();
            if(t === 'Salaried') employment = 'SALARIED';
            else if(t === 'Self Employed / Business') employment = 'SELF_EMPLOYED';
            updateUI();
        }));
        
        if (metroBtn) {
            metroBtn.addEventListener('click', () => {
                isMetro = !isMetro;
                updateUI();
            });
        }
        
        if (ageRange) ageRange.addEventListener('input', (e) => { age = Number(e.target.value); updateUI(); });
        if (incomeRange) incomeRange.addEventListener('input', (e) => { income = Number(e.target.value); updateUI(); });
        if (emiRange) emiRange.addEventListener('input', (e) => { existingEmi = Number(e.target.value); updateUI(); });
        
        updateUI(); // init
    }
`;
let content = fs.readFileSync('scripts/calculators.js', 'utf8');
if (!content.includes('Eligibility Checker Logic')) {
    content = content.replace('// You can add Credit Score and Eligibility calculator logic here similarly', jsCode);
    fs.writeFileSync('scripts/calculators.js', content);
    console.log("Appended successfully");
} else {
    console.log("Already appended");
}
