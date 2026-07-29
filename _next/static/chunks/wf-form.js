// form.js - Enterprise Static HTML Form Handler for Whitestone Fincorp

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyc__n3C9_6t3Vz0y7H8sL78xR1yN2vQ95Z6k0M2o4h9G3F5J1wB3N2/exec'; 
const DEFAULT_WA_NUMBER = '919824975488';

const GUJARAT_CITIES = [
  'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar',
  'Jamnagar', 'Junagadh', 'Gandhinagar', 'Anand', 'Nadiad',
  'Mehsana', 'Patan', 'Palanpur', 'Navsari', 'Valsad',
  'Bharuch', 'Morbi', 'Porbandar', 'Amreli', 'Botad',
  'Godhra', 'Veraval', 'Gandhidham', 'Bhuj', 'Dahod',
  'Himmatnagar', 'Kalol', 'Vapi', 'Sanand', 'Deesa',
  'Jetpur', 'Mahuva', 'Ankleshwar', 'Viramgam', 'Bardoli',
  'Kadi', 'Unjha', 'Dhoraji', 'Gondal', 'Pardi',
  'Vyara', 'Modasa', 'Wadhwan', 'Surendranagar', 'Borsad',
  'Khambhat', 'Dabhoi', 'Halol', 'Mangrol', 'Keshod',
  'Una', 'Dwarka', 'Mandvi', 'Mundra'
];

function formatIndianCurrency(val) {
  const digits = val.replace(/\D/g, '');
  if (!digits) return '';
  const num = Number(digits);
  return num.toLocaleString('en-IN');
}

function sanitizeInput(str) {
  return str.replace(/<[^>]*>?/gm, '').replace(/\n{3,}/g, '\n\n');
}

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm') || document.querySelector('form');
    if (!contactForm) return;

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

    const nameInput = contactForm.querySelector('input[name="name"]');
    const phoneInput = contactForm.querySelector('input[name="phone"]');
    const emailInput = contactForm.querySelector('input[name="email"]');
    const cityInput = contactForm.querySelector('input[name="city"]');
    const loanTypeSelect = contactForm.querySelector('select[name="loanType"]');
    const loanAmountInput = contactForm.querySelector('input[name="loanAmount"]');
    const messageInput = contactForm.querySelector('textarea[name="message"]');
    const consentCheck = contactForm.querySelector('input[type="checkbox"]');
    const submitBtn = contactForm.querySelector('button[type="submit"]') || contactForm.querySelector('button');

    // Helper: Show Inline Error
    function setError(inputEl, msg) {
        if (!inputEl) return;
        let parent = inputEl.closest('.flex-col') || inputEl.parentElement;
        let errorEl = parent.querySelector('.wf-inline-error');
        if (!errorEl) {
            errorEl = document.createElement('span');
            errorEl.className = 'wf-inline-error text-[10px] font-semibold text-rose-500 flex items-center gap-1 mt-0.5';
            parent.appendChild(errorEl);
        }
        if (msg) {
            errorEl.textContent = msg;
            inputEl.classList.add('border-rose-400', 'bg-rose-50/20');
            inputEl.classList.remove('border-emerald-400');
        } else {
            errorEl.textContent = '';
            inputEl.classList.remove('border-rose-400', 'bg-rose-50/20');
            if (inputEl.value.trim()) {
                inputEl.classList.add('border-emerald-400');
            }
        }
    }

    // Validation Functions
    function validateName() {
        if (!nameInput) return true;
        const val = nameInput.value.trim().replace(/\s+/g, ' ');
        nameInput.value = val;
        if (!val) {
            setError(nameInput, 'Full name is required.');
            return false;
        }
        if (val.length < 2 || val.length > 60 || !/^[a-zA-Z\s\.\-']+$/.test(val)) {
            setError(nameInput, 'Please enter a valid full name.');
            return false;
        }
        setError(nameInput, '');
        return true;
    }

    function validatePhone() {
        if (!phoneInput) return true;
        const digits = phoneInput.value.replace(/\D/g, '');
        phoneInput.value = digits;
        if (!digits) {
            setError(phoneInput, 'Mobile number is required.');
            return false;
        }
        if (digits.length !== 10 || !/^[6-9]\d{9}$/.test(digits)) {
            setError(phoneInput, 'Enter a valid 10-digit mobile number.');
            return false;
        }
        setError(phoneInput, '');
        return true;
    }

    function validateEmail() {
        if (!emailInput) return true;
        const val = emailInput.value.toLowerCase().trim();
        emailInput.value = val;
        if (!val) {
            setError(emailInput, '');
            return true; // Optional
        }
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val)) {
            setError(emailInput, 'Enter a valid email address.');
            return false;
        }
        setError(emailInput, '');
        return true;
    }

    function validateCity() {
        if (!cityInput) return true;
        const val = cityInput.value.trim();
        if (!val) {
            setError(cityInput, 'City is required.');
            return false;
        }
        setError(cityInput, '');
        return true;
    }

    function validateLoanAmount() {
        if (!loanAmountInput) return true;
        const digits = loanAmountInput.value.replace(/\D/g, '');
        if (!digits) {
            setError(loanAmountInput, 'Loan amount is required.');
            return false;
        }
        const num = Number(digits);
        if (num < 50000) {
            setError(loanAmountInput, 'Minimum loan amount is ₹50,000.');
            return false;
        }
        if (num > 100000000) {
            setError(loanAmountInput, 'Maximum loan amount is ₹10,00,00,000.');
            return false;
        }
        setError(loanAmountInput, '');
        return true;
    }

    function validateConsent() {
        if (!consentCheck) return true;
        if (!consentCheck.checked) {
            setError(consentCheck, 'Please provide authorization to proceed.');
            return false;
        }
        setError(consentCheck, '');
        return true;
    }

    function validateAll() {
        const v1 = validateName();
        const v2 = validatePhone();
        const v3 = validateEmail();
        const v4 = validateCity();
        const v5 = validateLoanAmount();
        const v6 = validateConsent();
        return v1 && v2 && v3 && v4 && v5 && v6;
    }

    function updateSubmitState() {
        if (!submitBtn) return;
        const valid = validateAll();
        submitBtn.disabled = !valid;
        if (valid) {
            submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        } else {
            submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
        }
    }

    // Input Restrictions while typing
    if (nameInput) {
        nameInput.maxLength = 60;
        nameInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^a-zA-Z\s\.\-']/g, '').slice(0, 60);
            updateSubmitState();
        });
        nameInput.addEventListener('blur', () => {
            validateName();
            updateSubmitState();
        });
    }

    if (phoneInput) {
        phoneInput.maxLength = 10;
        phoneInput.setAttribute('inputmode', 'numeric');
        phoneInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
            updateSubmitState();
        });
        phoneInput.addEventListener('blur', () => {
            validatePhone();
            updateSubmitState();
        });
    }

    if (emailInput) {
        emailInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.toLowerCase().replace(/\s/g, '');
            updateSubmitState();
        });
        emailInput.addEventListener('blur', () => {
            validateEmail();
            updateSubmitState();
        });
    }

    if (loanAmountInput) {
        loanAmountInput.setAttribute('inputmode', 'numeric');
        loanAmountInput.addEventListener('input', (e) => {
            const digits = e.target.value.replace(/\D/g, '');
            e.target.value = digits ? formatIndianCurrency(digits) : '';
            updateSubmitState();
        });
        loanAmountInput.addEventListener('blur', () => {
            validateLoanAmount();
            updateSubmitState();
        });
    }

    if (messageInput) {
        messageInput.maxLength = 500;
        messageInput.addEventListener('input', (e) => {
            e.target.value = sanitizeInput(e.target.value).slice(0, 500);
        });
    }

    if (consentCheck) {
        consentCheck.addEventListener('change', () => {
            validateConsent();
            updateSubmitState();
        });
    }

    // ── Gujarat City Autocomplete Setup ─────────────────────────────────────
    if (cityInput) {
        const cityParent = cityInput.closest('.flex-col') || cityInput.parentElement;
        cityParent.style.position = 'relative';

        const dropdown = document.createElement('div');
        dropdown.className = 'wf-city-dropdown hidden absolute left-0 right-0 top-[100%] mt-1 max-h-48 overflow-y-auto bg-white rounded-xl border border-slate-200 shadow-xl z-50 divide-y divide-slate-50';
        cityParent.appendChild(dropdown);

        function renderCityDropdown(query) {
            const matches = GUJARAT_CITIES.filter(c => c.toLowerCase().includes(query.toLowerCase()));
            dropdown.innerHTML = '';
            if (matches.length > 0) {
                matches.forEach(city => {
                    const item = document.createElement('div');
                    item.className = 'px-4 py-2.5 text-xs font-semibold cursor-pointer flex items-center justify-between hover:bg-slate-50 text-slate-700';
                    item.innerHTML = `<span>${city}</span><span class="text-[10px] text-slate-400 font-normal">Gujarat</span>`;
                    item.addEventListener('mousedown', (e) => {
                        e.preventDefault();
                        cityInput.value = city;
                        dropdown.classList.add('hidden');
                        validateCity();
                        updateSubmitState();
                    });
                    dropdown.appendChild(item);
                });
            } else {
                const noMatch = document.createElement('div');
                noMatch.className = 'px-4 py-3 text-xs font-semibold text-slate-400 text-center';
                noMatch.textContent = 'No matching city found.';
                dropdown.appendChild(noMatch);
            }
            dropdown.classList.remove('hidden');
        }

        cityInput.addEventListener('focus', () => {
            renderCityDropdown(cityInput.value.trim());
        });

        cityInput.addEventListener('input', (e) => {
            renderCityDropdown(e.target.value.trim());
            updateSubmitState();
        });

        cityInput.addEventListener('blur', () => {
            setTimeout(() => dropdown.classList.add('hidden'), 200);
            validateCity();
            updateSubmitState();
        });
    }

    // Initial check on page load
    updateSubmitState();

    // ── Form Submission ─────────────────────────────────────────────────────
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!validateAll()) {
            return;
        }

        const honeypot = contactForm.querySelector('input[name="honeypot"]');
        if (honeypot && honeypot.value !== '') {
            console.warn('Spam detected');
            return;
        }

        const name = nameInput ? nameInput.value.trim() : '';
        const phone = phoneInput ? phoneInput.value.trim() : '';
        const email = emailInput ? emailInput.value.trim() : '';
        const city = cityInput ? cityInput.value.trim() : '';
        const loanType = loanTypeSelect ? loanTypeSelect.value : 'PERSONAL';
        const loanAmountDigits = loanAmountInput ? loanAmountInput.value.replace(/\D/g, '') : '';
        const remarks = messageInput ? messageInput.value.trim() : '';

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

        const formattedAmount = loanAmountDigits ? `₹${Number(loanAmountDigits).toLocaleString('en-IN')}` : 'N/A';
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
});
