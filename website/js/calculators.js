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

        function calculateEMI() {
            const principal = parseFloat(amountRange.value);
            const tenureMonths = parseFloat(tenureRange.value) * 12; // Assuming tenure is in years
            const annualInterest = parseFloat(interestRange.value);
            const monthlyInterest = annualInterest / 12 / 100;

            let emi = 0;
            if (monthlyInterest > 0) {
                emi = principal * monthlyInterest * Math.pow(1 + monthlyInterest, tenureMonths) / (Math.pow(1 + monthlyInterest, tenureMonths) - 1);
            } else {
                emi = principal / tenureMonths;
            }

            const totalPayment = emi * tenureMonths;
            const totalInterest = totalPayment - principal;

            if (emiValueEl) emiValueEl.textContent = formatINR(emi);
            if (totalInterestEl) totalInterestEl.textContent = formatINR(totalInterest);
            if (totalPaymentEl) totalPaymentEl.textContent = formatINR(totalPayment);
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
        
        // Initial Calculation
        if (amountRange) {
            calculateEMI();
        }
    }

    // You can add Credit Score and Eligibility calculator logic here similarly
});
