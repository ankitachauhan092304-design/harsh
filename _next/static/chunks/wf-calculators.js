// calculators.js

// Format number to INR
function formatINR(number) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(number);
}

document.addEventListener('DOMContentLoaded', () => {
    // EMI Calculator Logic
    const emiContainer = document.querySelector('.emi-calculator');
    if (emiContainer) {
        const amountRange = document.getElementById('loanAmount');
        const amountNumber = document.getElementById('loanAmountInput');
        const tenureRange = document.getElementById('loanTenure');
        const tenureNumber = document.getElementById('loanTenureInput');
        const interestRange = document.getElementById('interestRate');
        const interestNumber = document.getElementById('interestRateInput');
        
        const emiValueEl = document.getElementById('emiValue');
        const totalInterestEl = document.getElementById('totalInterestValue');
        const totalPaymentEl = document.getElementById('totalPaymentValue');
        const tbody = emiContainer.querySelector('table tbody');

        function calculateEMI() {
            const principal = parseFloat(amountRange.value) || 0;
            const tenureYears = parseFloat(tenureRange.value) || 0;
            const tenureMonths = tenureYears * 12; // Assuming tenure is in years
            const annualInterest = parseFloat(interestRange.value) || 0;
            const monthlyInterest = annualInterest / 12 / 100;

            let emi = 0;
            if (monthlyInterest > 0 && tenureMonths > 0) {
                emi = principal * monthlyInterest * Math.pow(1 + monthlyInterest, tenureMonths) / (Math.pow(1 + monthlyInterest, tenureMonths) - 1);
            } else if (tenureMonths > 0) {
                emi = principal / tenureMonths;
            }

            const totalPayment = emi * tenureMonths;
            const totalInterest = Math.max(0, totalPayment - principal);

            if (emiValueEl) emiValueEl.textContent = formatINR(emi);
            if (totalInterestEl) totalInterestEl.textContent = formatINR(totalInterest);
            if (totalPaymentEl) totalPaymentEl.textContent = formatINR(totalPayment);

            // Update Amortization Table in UI
            if (tbody && tenureYears > 0) {
                let bal = principal;
                let rowsHtml = '';
                for (let year = 1; year <= tenureYears; year++) {
                    let yearlyInterest = 0;
                    let yearlyPrincipal = 0;
                    for (let month = 1; month <= 12; month++) {
                        const interestPaid = bal * monthlyInterest;
                        const principalPaid = emi - interestPaid;
                        yearlyInterest += interestPaid;
                        yearlyPrincipal += principalPaid;
                        bal = Math.max(0, bal - principalPaid);
                    }
                    rowsHtml += `<tr class="hover:bg-slate-50/50 transition-colors">
                        <td class="py-4 px-6 font-bold text-[#0B4F9C]">Year ${year}</td>
                        <td class="py-4 px-6 font-dmsans">₹${Math.round(yearlyPrincipal).toLocaleString('en-IN')}</td>
                        <td class="py-4 px-6 font-dmsans text-[#00A86B]">₹${Math.round(yearlyInterest).toLocaleString('en-IN')}</td>
                        <td class="py-4 px-6 font-dmsans">₹${Math.round(yearlyPrincipal + yearlyInterest).toLocaleString('en-IN')}</td>
                        <td class="py-4 px-6 font-dmsans text-slate-400">₹${Math.round(bal).toLocaleString('en-IN')}</td>
                    </tr>`;
                }
                tbody.innerHTML = rowsHtml;
            }
        }

        // Add event listeners if elements exist
        if (amountRange && amountNumber) {
            amountRange.addEventListener('input', (e) => {
                amountNumber.value = e.target.value;
                calculateEMI();
            });
            amountNumber.addEventListener('input', (e) => {
                amountRange.value = e.target.value;
                calculateEMI();
            });
        }

        if (tenureRange && tenureNumber) {
            tenureRange.addEventListener('input', (e) => {
                tenureNumber.value = e.target.value;
                calculateEMI();
            });
            tenureNumber.addEventListener('input', (e) => {
                tenureRange.value = e.target.value;
                calculateEMI();
            });
        }

        if (interestRange && interestNumber) {
            interestRange.addEventListener('input', (e) => {
                interestNumber.value = e.target.value;
                calculateEMI();
            });
            interestNumber.addEventListener('input', (e) => {
                interestRange.value = e.target.value;
                calculateEMI();
            });
        }

        // Action Buttons Setup
        const buttons = Array.from(emiContainer.querySelectorAll('button'));
        const resetBtn = document.getElementById('emi-reset-btn') || buttons.find(b => b.textContent.includes('Reset'));
        const pdfBtn = buttons.find(b => b.textContent.includes('Download PDF'));
        const copyBtn = buttons.find(b => b.textContent.includes('Copy Estimate'));
        const whatsappBtn = buttons.find(b => b.textContent.includes('Discuss on WhatsApp') || b.textContent.includes('WhatsApp'));
        const shareBtn = buttons.find(b => b.title === 'Share Estimate' || b.getAttribute('aria-label') === 'Share Estimate');

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                amountRange.value = 100000;
                amountNumber.value = 100000;
                interestRange.value = 8.5;
                interestNumber.value = 8.5;
                tenureRange.value = 20;
                tenureNumber.value = 20;
                calculateEMI();
            });
        }

        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                const principal = parseFloat(amountRange.value) || 0;
                const tenureYears = parseFloat(tenureRange.value) || 0;
                const interest = parseFloat(interestRange.value) || 0;
                const tenureMonths = tenureYears * 12;
                const monthlyInterest = interest / 12 / 100;
                let emi = 0;
                if (monthlyInterest > 0 && tenureMonths > 0) {
                    emi = principal * monthlyInterest * Math.pow(1 + monthlyInterest, tenureMonths) / (Math.pow(1 + monthlyInterest, tenureMonths) - 1);
                } else if (tenureMonths > 0) {
                    emi = principal / tenureMonths;
                }
                const text = `Calculated EMI payout: Rs. ${Math.round(emi).toLocaleString('en-IN')}/mo for a loan of Rs. ${principal.toLocaleString('en-IN')} at ${interest}% interest.`;
                navigator.clipboard.writeText(text).then(() => {
                    const originalText = copyBtn.innerHTML;
                    copyBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check text-emerald-500"><path d="M20 6 9 17l-5-5"/></svg> Copied`;
                    setTimeout(() => {
                        copyBtn.innerHTML = originalText;
                    }, 2000);
                });
            });
        }

        if (whatsappBtn) {
            whatsappBtn.addEventListener('click', () => {
                const principal = parseFloat(amountRange.value) || 0;
                const tenureYears = parseFloat(tenureRange.value) || 0;
                const interest = parseFloat(interestRange.value) || 0;
                const tenureMonths = tenureYears * 12;
                const monthlyInterest = interest / 12 / 100;
                let emi = 0;
                if (monthlyInterest > 0 && tenureMonths > 0) {
                    emi = principal * monthlyInterest * Math.pow(1 + monthlyInterest, tenureMonths) / (Math.pow(1 + monthlyInterest, tenureMonths) - 1);
                } else if (tenureMonths > 0) {
                    emi = principal / tenureMonths;
                }
                const totalPayment = emi * tenureMonths;
                const totalInterest = Math.max(0, totalPayment - principal);

                const msg = `*Whitestone Fincorp - EMI Estimate*\n\n` +
                            `• Loan Principal: Rs. ${principal.toLocaleString('en-IN')}\n` +
                            `• Interest Rate: ${interest}% p.a.\n` +
                            `• Selected Tenure: ${tenureYears} Years (${tenureMonths} Months)\n\n` +
                            `*Calculated Outputs:*\n` +
                            `• Monthly EMI: Rs. ${Math.round(emi).toLocaleString('en-IN')}/month\n` +
                            `• Total Interest: Rs. ${Math.round(totalInterest).toLocaleString('en-IN')}\n` +
                            `• Total Cumulative Payment: Rs. ${Math.round(totalPayment).toLocaleString('en-IN')}\n\n` +
                            `_Estimate generated via Whitestone Fincorp Interactive Utilities._`;
                
                window.open(`https://wa.me/919824975488?text=${encodeURIComponent(msg)}`, '_blank');
            });
        }

        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                const principal = parseFloat(amountRange.value) || 0;
                const tenureYears = parseFloat(tenureRange.value) || 0;
                const interest = parseFloat(interestRange.value) || 0;
                const tenureMonths = tenureYears * 12;
                const monthlyInterest = interest / 12 / 100;
                let emi = 0;
                if (monthlyInterest > 0 && tenureMonths > 0) {
                    emi = principal * monthlyInterest * Math.pow(1 + monthlyInterest, tenureMonths) / (Math.pow(1 + monthlyInterest, tenureMonths) - 1);
                } else if (tenureMonths > 0) {
                    emi = principal / tenureMonths;
                }
                const text = `Calculated EMI payout: Rs. ${Math.round(emi).toLocaleString('en-IN')}/mo for a loan of Rs. ${principal.toLocaleString('en-IN')} at ${interest}% interest.`;
                const shareData = {
                    title: 'Whitestone Fincorp EMI Estimate',
                    text: text,
                    url: window.location.href
                };
                if (navigator.share) {
                    navigator.share(shareData).catch(() => {});
                } else {
                    navigator.clipboard.writeText(text).then(() => {
                        alert('Link & Estimate copied to clipboard!');
                    });
                }
            });
        }

        function loadScript(src) {
            return new Promise((resolve, reject) => {
                const s = document.createElement('script');
                s.src = src;
                s.onload = resolve;
                s.onerror = reject;
                document.head.appendChild(s);
            });
        }

        async function generatePDF() {
            if (!window.jspdf) {
                const originalText = pdfBtn.innerHTML;
                pdfBtn.innerHTML = 'Loading PDF Library...';
                try {
                    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
                    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.29/jspdf.plugin.autotable.min.js');
                } catch (e) {
                    alert('Failed to load PDF library. Please check your internet connection.');
                    pdfBtn.innerHTML = originalText;
                    return;
                }
                pdfBtn.innerHTML = originalText;
            }

            const principal = parseFloat(amountRange.value) || 0;
            const tenureYears = parseFloat(tenureRange.value) || 0;
            const interest = parseFloat(interestRange.value) || 0;
            const tenureMonths = tenureYears * 12;
            const monthlyInterest = interest / 12 / 100;
            let emi = 0;
            if (monthlyInterest > 0 && tenureMonths > 0) {
                emi = principal * monthlyInterest * Math.pow(1 + monthlyInterest, tenureMonths) / (Math.pow(1 + monthlyInterest, tenureMonths) - 1);
            } else if (tenureMonths > 0) {
                emi = principal / tenureMonths;
            }
            const totalPayment = emi * tenureMonths;
            const totalInterest = Math.max(0, totalPayment - principal);

            // Generate Amortization schedule (Year-wise)
            let balance = principal;
            const amortization = [];
            for (let year = 1; year <= tenureYears; year++) {
                let yearlyInterest = 0;
                let yearlyPrincipal = 0;
                for (let month = 1; month <= 12; month++) {
                    const interestPaid = balance * monthlyInterest;
                    const principalPaid = emi - interestPaid;
                    yearlyInterest += interestPaid;
                    yearlyPrincipal += principalPaid;
                    balance = Math.max(0, balance - principalPaid);
                }
                amortization.push({
                    year,
                    principal: yearlyPrincipal,
                    interest: yearlyInterest,
                    totalPayment: yearlyPrincipal + yearlyInterest,
                    balance
                });
            }

            const { jsPDF } = window.jspdf;
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
            doc.text(`Requested Loan Principal: Rs. ${Math.round(principal).toLocaleString('en-IN')}`, 25, 68);
            doc.text(`Applicable Interest Rate: ${interest}% p.a.`, 25, 74);
            doc.text(`Total Tenure Selected: ${tenureYears} Years (${tenureMonths} Months)`, 25, 80);
            doc.text(`Monthly Installment (EMI): Rs. ${Math.round(emi).toLocaleString('en-IN')}`, 25, 86);

            doc.text(`Total Interest Payable: Rs. ${Math.round(totalInterest).toLocaleString('en-IN')}`, 115, 68);
            doc.text(`Total Cumulative Payment: Rs. ${Math.round(totalPayment).toLocaleString('en-IN')}`, 115, 74);

            // Amortization Table Title
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(12);
            doc.text('ANNUAL AMORTIZATION SCHEDULE', 20, 110);

            const tableRows = amortization.map((row) => [
                `Year ${row.year}`,
                `Rs. ${Math.round(row.principal).toLocaleString('en-IN')}`,
                `Rs. ${Math.round(row.interest).toLocaleString('en-IN')}`,
                `Rs. ${Math.round(row.totalPayment).toLocaleString('en-IN')}`,
                `Rs. ${Math.round(row.balance).toLocaleString('en-IN')}`,
            ]);

            doc.autoTable({
                startY: 115,
                head: [['Year', 'Principal Paid', 'Interest Paid', 'Total Annual Outflow', 'Outstanding Balance']],
                body: tableRows,
                theme: 'striped',
                headStyles: { fillColor: [11, 79, 156] },
                styles: { fontSize: 9 },
            });

            // Disclaimer
            const finalY = doc.lastAutoTable.finalY + 15;
            doc.setFont('helvetica', 'oblique');
            doc.setFontSize(8);
            doc.setTextColor(148, 163, 184);
            const disclaimer = 'Disclaimer: This report is for illustration purposes only. Actual interest rates, processing fees, and terms of credit are determined solely by our partner financial institutions upon document audit. Whitestone Fincorp is a consulting facilitator and does not underwrite loans directly.';
            doc.text(disclaimer, 20, finalY, { maxWidth: 170 });

            doc.save(`Whitestone_EMI_Report_${Math.round(principal)}.pdf`);
        }

        if (pdfBtn) {
            pdfBtn.addEventListener('click', generatePDF);
        }
        
        // Initial Calculation
        if (amountRange) {
            calculateEMI();
        }
    }

    
    // Eligibility Checker Logic
    const eligContainer = document.querySelector('.eligibility-calculator');
    const incomeInput = document.getElementById('el-income-input');
    
    if (eligContainer && incomeInput) {
        // State
        let loanType = 'PERSONAL';
        let employment = 'SALARIED';
        let age = 30;
        let income = 50000;
        let existingEmi = 10000;
        let isMetro = true;
        
        // Find inputs
        const ageRange = document.getElementById('el-age-input');
        const incomeRange = document.getElementById('el-income-input');
        const emiRange = document.getElementById('el-emi-input');
        
        // Values displays
        const ageVal = document.getElementById('el-age-val');
        const incomeVal = document.getElementById('el-income-val');
        const emiVal = document.getElementById('el-emi-val');
        
        // Buttons
        const allBtns = Array.from(eligContainer.querySelectorAll('button[type="button"]'));
        const loanBtns = allBtns.filter(b => ['Personal', 'Business', 'Home / LAP'].includes(b.textContent.trim()));
        const empBtns = allBtns.filter(b => ['Salaried', 'Self Employed / Business'].includes(b.textContent.trim()));
        const metroBtn = allBtns.find(b => b.parentElement.textContent.includes('Metro City'));
        
        // Output elements
        const maxAmountEl = eligContainer.querySelector('.text-3xl.font-black.text-\\[\\#0B4F9C\\]') || eligContainer.querySelector('.text-3xl');
        // The emi capacity is the next bold text inside a p-4 block
        const p4Blocks = eligContainer.querySelectorAll('.p-4.bg-slate-50');
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

});
