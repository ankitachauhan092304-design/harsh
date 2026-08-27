// form.js - Enterprise Static HTML Form Handler for Whitestone Fincorp

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz0cUzmV5xLrHAG90ECaM1RtYvvFXPn6Qo0cQVE3uNp-6SX6VsfHpeNq1FzdtIdnSbZ/exec'; 
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
    // Automatic Visitor Telemetry Tracking
    (function trackVisitor() {
        try {
            let sid = sessionStorage.getItem('wf_visitor_sid');
            if (!sid) {
                sid = 'sid-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
                sessionStorage.setItem('wf_visitor_sid', sid);
            }
            const currentPath = window.location.pathname || '/';
            const pageTitle = document.title || 'Whitestone Fincorp';
            const ua = navigator.userAgent || '';
            const device = /Mobile|iP(hone|od)|Android/i.test(ua) ? 'MOBILE' : 'DESKTOP';
            const browser = ua.includes('Chrome') ? 'Chrome' : ua.includes('Safari') ? 'Safari' : 'Browser';
            const os = ua.includes('Android') ? 'Android' : ua.includes('iPhone') ? 'iOS' : ua.includes('Mac') ? 'macOS' : 'Windows';
            const referrer = document.referrer || 'Direct / Search';

            const localLog = {
                id: 'vlog-' + Date.now(),
                sessionId: sid,
                timestamp: new Date().toISOString(),
                path: currentPath,
                pageTitle: pageTitle,
                device: device,
                browser: browser,
                os: os,
                referrer: referrer,
                city: 'Ahmedabad',
                region: 'Gujarat',
                country: 'India',
                location: 'Ahmedabad, Gujarat, India'
            };

            const storedLogs = JSON.parse(localStorage.getItem('wf_visitor_logs') || '[]');
            storedLogs.unshift(localLog);
            localStorage.setItem('wf_visitor_logs', JSON.stringify(storedLogs.slice(0, 200)));

            // Increment live persistent pageviews count
            let currentTotal = parseInt(localStorage.getItem('wf_total_site_pageviews') || '1240', 10);
            currentTotal += 1;
            localStorage.setItem('wf_total_site_pageviews', currentTotal.toString());
            try {
                window.dispatchEvent(new CustomEvent('wf_visitor_updated', { detail: { count: currentTotal } }));
            } catch (evErr) {}

            const targetWebhook = localStorage.getItem('wf_google_webhook_url') || 'https://script.google.com/macros/s/AKfycbz0cUzmV5xLrHAG90ECaM1RtYvvFXPn6Qo0cQVE3uNp-6SX6VsfHpeNq1FzdtIdnSbZ/exec';
            const urlWithAction = targetWebhook.includes('?') ? targetWebhook + '&action=logVisitor' : targetWebhook + '?action=logVisitor';
            const params = new URLSearchParams();
            params.append('action', 'logVisitor');
            params.append('sessionId', sid);
            params.append('path', currentPath);
            params.append('pageTitle', pageTitle);
            params.append('device', device);
            params.append('browser', browser);
            params.append('os', os);
            params.append('referrer', referrer);

            fetch('https://ipapi.co/json/').then(function(res) { return res.json(); }).then(function(loc) {
                const city = loc.city || 'Ahmedabad';
                const region = loc.region || 'Gujarat';
                const country = loc.country_name || 'India';
                const locationStr = city + ', ' + region + ', ' + country;
                localLog.city = city;
                localLog.region = region;
                localLog.country = country;
                localLog.location = locationStr;
                params.append('city', city);
                params.append('region', region);
                params.append('country', country);
                params.append('location', locationStr);
                fetch(urlWithAction, { method: 'POST', mode: 'no-cors', body: params, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).catch(function(){});
            }).catch(function() {
                fetch(urlWithAction, { method: 'POST', mode: 'no-cors', body: params, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).catch(function(){});
            });
        } catch (e) {}
    })();

    const contactForm = document.getElementById('contactForm') || document.querySelector('form');
    if (!contactForm) return;

    // Honeypot field for spam prevention
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

    // Touched state tracking for each field
    const touched = {
        name: false,
        phone: false,
        email: false,
        city: false,
        loanAmount: false,
        consent: false,
    };

    // Helper: Set/Clear Inline Error
    function setError(inputEl, msg, fieldName) {
        if (!inputEl) return;
        let parent = inputEl.closest('.flex-col') || inputEl.parentElement;
        let errorEl = parent.querySelector('.wf-inline-error');
        
        if (!errorEl) {
            errorEl = document.createElement('span');
            errorEl.className = 'wf-inline-error text-[10px] font-semibold text-rose-500 flex items-center gap-1 mt-0.5';
            parent.appendChild(errorEl);
        }

        // Show error UI if touched or if field has invalid input
        if (fieldName && !touched[fieldName] && !inputEl.value.trim()) {
            errorEl.textContent = '';
            inputEl.classList.remove('border-rose-400', 'bg-rose-50/20', 'border-emerald-400');
            return;
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
        if (!val) {
            setError(nameInput, 'Full Name cannot be blank. Enter letters only (min 2 chars).', 'name');
            return false;
        }
        if (val.length < 2 || val.length > 60 || !/^[a-zA-Z\s\.\-']+$/.test(val)) {
            setError(nameInput, 'Name should contain only letters, spaces, hyphen ( - ), apostrophe ( \' ) and dot ( . )', 'name');
            return false;
        }
        setError(nameInput, '', 'name');
        return true;
    }

    function validatePhone() {
        if (!phoneInput) return true;
        const digits = phoneInput.value.replace(/\D/g, '');
        if (!digits) {
            setError(phoneInput, 'Mobile Number cannot be blank. Enter 10-digit number.', 'phone');
            return false;
        }
        if (digits.length !== 10 || !/^[6-9]\d{9}$/.test(digits)) {
            setError(phoneInput, 'Enter a valid 10-digit mobile number starting with 6, 7, 8 or 9.', 'phone');
            return false;
        }
        setError(phoneInput, '', 'phone');
        return true;
    }

    function validateEmail() {
        if (!emailInput) return true;
        const val = emailInput.value.toLowerCase().trim();
        if (!val) {
            setError(emailInput, 'Please enter a valid email address.', 'email');
            return false;
        }
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val)) {
            setError(emailInput, 'Please enter a valid email address.', 'email');
            return false;
        }
        setError(emailInput, '', 'email');
        return true;
    }

    function validateCity() {
        if (!cityInput) return true;
        const val = cityInput.value.trim();
        if (!val) {
            setError(cityInput, 'Please select a valid city from the list.', 'city');
            return false;
        }
        const match = GUJARAT_CITIES.find(c => c.toLowerCase() === val.toLowerCase());
        if (!match) {
            setError(cityInput, 'Please select a valid city from the list.', 'city');
            return false;
        }
        setError(cityInput, '', 'city');
        return true;
    }

    function validateLoanAmount() {
        if (!loanAmountInput) return true;
        const digits = loanAmountInput.value.replace(/\D/g, '');
        if (!digits) {
            setError(loanAmountInput, 'Loan amount is required.', 'loanAmount');
            return false;
        }
        const num = Number(digits);
        if (num < 10000) {
            setError(loanAmountInput, 'Minimum loan amount is ₹10,000.', 'loanAmount');
            return false;
        }
        if (num > 50000000) {
            setError(loanAmountInput, 'Maximum loan amount is ₹5,00,00,000.', 'loanAmount');
            return false;
        }
        setError(loanAmountInput, '', 'loanAmount');
        return true;
    }

    function validateConsent() {
        if (!consentCheck) return true;
        if (!consentCheck.checked) {
            setError(consentCheck, 'Please provide authorization to proceed.', 'consent');
            return false;
        }
        setError(consentCheck, '', 'consent');
        return true;
    }

    function updateSubmitButtonState() {
        const nameVal = nameInput ? nameInput.value.trim() : '';
        const phoneVal = phoneInput ? phoneInput.value.replace(/\D/g, '') : '';
        const emailVal = emailInput ? emailInput.value.trim() : '';
        const cityVal = cityInput ? cityInput.value.trim() : '';
        const loanVal = loanAmountInput ? loanAmountInput.value.replace(/\D/g, '') : '';
        
        const isNameOk = Boolean(nameVal.length >= 2 && /^[a-zA-Z\s\.\-']+$/.test(nameVal));
        const isPhoneOk = Boolean(phoneVal.length === 10 && /^[6-9]\d{9}$/.test(phoneVal));
        const isEmailOk = emailInput ? Boolean(emailVal && /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailVal)) : true;
        const isCityOk = cityInput ? Boolean(GUJARAT_CITIES.some(c => c.toLowerCase() === cityVal.toLowerCase())) : true;
        const isLoanOk = loanAmountInput ? Boolean(Number(loanVal) >= 10000) : true;
        const isConsentOk = consentCheck ? Boolean(consentCheck.checked) : true;

        const isFormValid = isNameOk && isPhoneOk && isEmailOk && isCityOk && isLoanOk && isConsentOk;

        if (submitBtn) {
            submitBtn.disabled = !isFormValid;
            if (isFormValid) {
                // Fully Active State: Vibrant Blue-Emerald Gradient, Glowing Shadow, Clickable
                submitBtn.style.opacity = '1';
                submitBtn.style.cursor = 'pointer';
                submitBtn.style.pointerEvents = 'auto';
                submitBtn.style.background = 'linear-gradient(to right, #0B4F9C, #0E5DB5, #00A86B)';
                submitBtn.style.color = '#ffffff';
                submitBtn.style.boxShadow = '0 10px 25px -5px rgba(11, 79, 156, 0.4)';
                submitBtn.classList.remove('opacity-50', 'opacity-60', 'opacity-70', 'cursor-not-allowed', 'bg-slate-200', 'bg-slate-300', 'text-slate-400');
                submitBtn.classList.add('cursor-pointer', 'shadow-lg');
            } else {
                // Fully Disabled State: Grayed Out, Muted Text, Non-clickable
                submitBtn.style.opacity = '0.45';
                submitBtn.style.cursor = 'not-allowed';
                submitBtn.style.pointerEvents = 'none';
                submitBtn.style.background = '#cbd5e1';
                submitBtn.style.color = '#64748b';
                submitBtn.style.boxShadow = 'none';
                submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
                submitBtn.classList.remove('cursor-pointer', 'shadow-lg');
            }
        }
    }

    function validateAll() {
        const v1 = validateName();
        const v2 = validatePhone();
        const v3 = validateEmail();
        const v4 = validateCity();
        const v5 = validateLoanAmount();
        const v6 = validateConsent();
        updateSubmitButtonState();
        return v1 && v2 && v3 && v4 && v5 && v6;
    }

    // Initialize Submit Button in Disabled State
    updateSubmitButtonState();

    // Input Restrictions & Live Handlers
    if (nameInput) {
        nameInput.maxLength = 60;
        nameInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^a-zA-Z\s\.\-']/g, '').slice(0, 60);
            touched.name = true;
            validateName();
            updateSubmitButtonState();
        });
        nameInput.addEventListener('blur', () => {
            touched.name = true;
            nameInput.value = nameInput.value.trim().replace(/\s+/g, ' ');
            validateName();
            updateSubmitButtonState();
        });
    }

    if (phoneInput) {
        phoneInput.maxLength = 10;
        phoneInput.setAttribute('inputmode', 'numeric');
        phoneInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
            touched.phone = true;
            validatePhone();
            updateSubmitButtonState();
        });
        phoneInput.addEventListener('blur', () => {
            touched.phone = true;
            validatePhone();
            updateSubmitButtonState();
        });
    }

    if (emailInput) {
        emailInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.toLowerCase().replace(/\s/g, '');
            touched.email = true;
            validateEmail();
            updateSubmitButtonState();
        });
        emailInput.addEventListener('blur', () => {
            touched.email = true;
            validateEmail();
            updateSubmitButtonState();
        });
    }

    if (loanAmountInput) {
        loanAmountInput.setAttribute('inputmode', 'numeric');
        loanAmountInput.addEventListener('input', (e) => {
            const digits = e.target.value.replace(/\D/g, '');
            e.target.value = digits ? formatIndianCurrency(digits) : '';
            touched.loanAmount = true;
            validateLoanAmount();
            updateSubmitButtonState();
        });
        loanAmountInput.addEventListener('blur', () => {
            touched.loanAmount = true;
            validateLoanAmount();
            updateSubmitButtonState();
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
            touched.consent = true;
            validateConsent();
            updateSubmitButtonState();
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
                        touched.city = true;
                        validateCity();
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
            if (touched.city) validateCity();
        });

        cityInput.addEventListener('blur', () => {
            setTimeout(() => dropdown.classList.add('hidden'), 200);
            touched.city = true;
            validateCity();
        });
    }

    // ── Form Submission ─────────────────────────────────────────────────────
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Mark ALL fields as touched on submit press
        Object.keys(touched).forEach(key => touched[key] = true);

        // Run validation across all fields & display messages for invalid fields
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
        const leadId = `lead-${Date.now()}`;

        // Save lead locally to guarantee instantaneous presence in Admin CRM (/admin)
        const localLeadObj = {
            id: leadId,
            leadNumber: leadNumber,
            name: name,
            phone: phone,
            email: email,
            city: city,
            employmentType: 'SALARIED',
            monthlyIncome: 0,
            loanType: loanType.toUpperCase(),
            loanAmount: Number(loanAmountDigits) || 0,
            status: 'NEW',
            priority: 'HIGH',
            tags: 'Website Submission',
            remarks: remarks || 'Inquiry submitted via website form.',
            source: 'WEBSITE_FORM',
            whatsappClicked: true,
            createdAt: now.toISOString(),
            updatedAt: now.toISOString()
        };

        try {
            const stored = JSON.parse(localStorage.getItem('wf_leads') || '[]');
            stored.unshift(localLeadObj);
            localStorage.setItem('wf_leads', JSON.stringify(stored));
        } catch (e) {}

        // Background Webhook Post to Google Apps Script
        const targetWebhook = localStorage.getItem('wf_google_webhook_url') || 'https://script.google.com/macros/s/AKfycbz0cUzmV5xLrHAG90ECaM1RtYvvFXPn6Qo0cQVE3uNp-6SX6VsfHpeNq1FzdtIdnSbZ/exec';
        
        try {
            const formData = new URLSearchParams();
            formData.append('action', 'createLead');
            formData.append('name', name);
            formData.append('phone', phone);
            formData.append('email', email);
            formData.append('city', city);
            formData.append('loanType', loanType);
            formData.append('loanAmount', loanAmountDigits);
            formData.append('remarks', remarks);
            formData.append('source', 'WEBSITE_FORM');

            // Send via fetch without blocking user redirection
            fetch(targetWebhook, {
                method: 'POST',
                mode: 'no-cors',
                body: formData,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).catch(err => console.log('Background Webhook post notice:', err));
        } catch (err) {
            console.error('Google Apps Script POST error:', err);
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
        Object.keys(touched).forEach(key => touched[key] = false);
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    });
});
