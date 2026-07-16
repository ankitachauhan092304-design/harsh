// form.js

// IMPORTANT: Replace this URL with your actual deployed Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyc__n3C9_6t3Vz0y7H8sL78xR1yN2vQ95Z6k0M2o4h9G3F5J1wB3N2/exec'; 

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        
        // Add hidden honeypot field dynamically to prevent spam bots
        const honeypot = document.createElement('input');
        honeypot.type = 'text';
        honeypot.name = 'website';
        honeypot.style.display = 'none';
        honeypot.tabIndex = -1;
        honeypot.autocomplete = 'off';
        contactForm.appendChild(honeypot);

        // Add hidden URL field
        const urlField = document.createElement('input');
        urlField.type = 'hidden';
        urlField.name = 'url';
        urlField.value = window.location.href;
        contactForm.appendChild(urlField);

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Honeypot check
            if (honeypot.value !== '') {
                console.warn('Spam detected');
                return; // Silently fail for bots
            }

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Submitting...';

            // Gather data
            const formData = new FormData(contactForm);
            
            try {
                // We use POST with no-cors or standard fetch depending on Google Apps Script setup
                // Since Google Apps Script returns JSON and might have CORS issues if not set up correctly,
                // we'll send it as URL encoded data which works best with GAS doPost
                
                const urlEncodedData = new URLSearchParams(formData).toString();
                
                const response = await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    body: urlEncodedData,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                });

                // Assuming the script returns a success message
                // Note: fetch with no-cors won't let you read the response body, 
                // but GAS deployed as "Anyone" supports CORS.
                
                if (response.ok) {
                    alert('Thank you! Your inquiry has been submitted successfully.');
                    contactForm.reset();
                    
                    // Trigger WhatsApp redirection if WhatsApp button logic exists
                    // We can dispatch a custom event
                    window.dispatchEvent(new CustomEvent('formSubmitted', { 
                        detail: { 
                            name: formData.get('name'), 
                            product: formData.get('product') 
                        } 
                    }));
                } else {
                    alert('There was a problem submitting your form. Please try again or contact us directly.');
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                alert('Network error. Please try again or contact us via WhatsApp.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });
    }
});
