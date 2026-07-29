// form.js - Static HTML Form Handler for Whitestone Fincorp

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyc__n3C9_6t3Vz0y7H8sL78xR1yN2vQ95Z6k0M2o4h9G3F5J1wB3N2/exec'; 
const DEFAULT_WA_NUMBER = '919824975488';

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm') || document.querySelector('form');
    if (contactForm) {
        
        // Add hidden honeypot field dynamically to prevent spam bots
        if (!contactForm.querySelector('input[name="honeypot"]')) {
            const honeypot = document.createElement('input');
            honeypot.type = 'text';
            honeypot.name = 'honeypot';
            honeypot.style.display = 'none';
            honeypot.tabIndex = -1;
            honeypot.autocomplete = 'off';
            contactForm.appendChild(honeypot);
        }

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const honeypot = contactForm.querySelector('input[name="honeypot"]');
            if (honeypot && honeypot.value !== '') {
                console.warn('Spam detected');
                return;
            }

            const nameInput = contactForm.querySelector('input[name="name"]');
            const phoneInput = contactForm.querySelector('input[name="phone"]');
            const emailInput = contactForm.querySelector('input[name="email"]');
            const cityInput = contactForm.querySelector('input[name="city"]');
            const loanTypeSelect = contactForm.querySelector('select[name="loanType"]');
            const loanAmountInput = contactForm.querySelector('input[name="loanAmount"]');
            const messageInput = contactForm.querySelector('textarea[name="message"]');
            const consentCheck = contactForm.querySelector('input[type="checkbox"]');

            const name = nameInput ? nameInput.value.trim() : '';
            const phone = phoneInput ? phoneInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';
            const city = cityInput ? cityInput.value.trim() : '';
            const loanType = loanTypeSelect ? loanTypeSelect.value : 'PERSONAL';
            const loanAmount = loanAmountInput ? loanAmountInput.value.trim() : '';
            const remarks = messageInput ? messageInput.value.trim() : '';

            // Basic validation
            if (!name || name.length < 3) {
                alert('Please enter your full name (minimum 3 characters).');
                if (nameInput) nameInput.focus();
                return;
            }
            if (!phone || !/^[6-9]\d{9}$/.test(phone.replace(/\s+/g, ''))) {
                alert('Please enter a valid 10-digit Indian mobile number.');
                if (phoneInput) phoneInput.focus();
                return;
            }
            if (consentCheck && !consentCheck.checked) {
                alert('Please authorize Whitestone Fincorp to contact you to proceed.');
                return;
            }

            const submitBtn = contactForm.querySelector('button[type="submit"]') || contactForm.querySelector('button');
            const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Submit';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = 'Connecting to Advisor...';
            }

            // Generate Lead Reference Number
            const now = new Date();
            const yyyy = now.getFullYear();
            const mm = String(now.getMonth() + 1).padStart(2, '0');
            const dd = String(now.getDate()).padStart(2, '0');
            const seq = String(Math.floor(Math.random() * 900000 + 100000));
            const leadNumber = `WF-${yyyy}${mm}${dd}-${seq}`;

            // Background submit to Google Apps Script if URL is configured
            if (GOOGLE_SCRIPT_URL && !GOOGLE_SCRIPT_URL.includes('AKfycbyc__')) {
                const formData = new FormData(contactForm);
                formData.append('leadNumber', leadNumber);
                const urlEncodedData = new URLSearchParams(formData).toString();
                fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    body: urlEncodedData,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                }).catch(err => console.log('Background script error:', err));
            }

            // Build WhatsApp message
            const loanLabel = {
                PERSONAL: 'Personal Loan',
                BUSINESS: 'Business Loan',
                HOME: 'Home Loan',
                LAP: 'Loan Against Property (LAP)',
                PROJECT_LOAN: 'Project Loan',
                TOP_UP_LOAN: 'Top-up Loan',
                CREDIT_CARD: 'Credit Card',
            }[loanType.toUpperCase()] || loanType;

            const formattedAmount = loanAmount ? `₹${Number(loanAmount).toLocaleString('en-IN')}` : 'N/A';
            const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

            const waMsg = `🏢 *WHITESTONE FINCORP — Loan Enquiry*\n` +
                          `───────────────────────────────────\n\n` +
                          `📋 *Lead Reference:* ${leadNumber}\n\n` +
                          `👤 *Name:* ${name}\n` +
                          `📞 *Mobile:* +91 ${phone}\n` +
                          `📧 *Email:* ${email || 'N/A'}\n` +
                          `🏙 *City:* ${city || 'N/A'}\n\n` +
                          `🏦 *Loan Type:* ${loanLabel}\n` +
                          `💵 *Required Amount:* ${formattedAmount}\n\n` +
                          `📝 *Remarks:*\n${remarks || 'No additional remarks.'}\n\n` +
                          `📅 *Submitted:* ${dateStr}\n` +
                          `🌐 *Source:* WHITESTONE FINCORP Website\n\n` +
                          `───────────────────────────────────\n` +
                          `_Please respond with your best offer._`;

            const waUrl = `https://wa.me/${DEFAULT_WA_NUMBER}?text=${encodeURIComponent(waMsg)}`;

            alert(`Thank you ${name}! Your enquiry (${leadNumber}) has been submitted successfully.\n\nOpening WhatsApp chat with our loan advisor...`);
            
            window.location.href = waUrl;

            contactForm.reset();
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });
    }
});
