// whatsapp.js

document.addEventListener('DOMContentLoaded', () => {
    // WhatsApp auto-redirection on successful form submission
    window.addEventListener('formSubmitted', (e) => {
        const { name, product } = e.detail;
        
        // Whitestone Fincorp WhatsApp Number (replace with actual number if different)
        const waNumber = '919824975488'; 
        
        const message = `Hello Whitestone Fincorp, I am ${name || 'a customer'} and I have submitted an inquiry for ${product || 'your services'} on your website. Please assist me.`;
        
        const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
        
        // Redirect after a short delay so the user sees the success alert
        setTimeout(() => {
            window.open(waUrl, '_blank');
        }, 1000);
    });

    // Handle generic WhatsApp CTA buttons
    const waButtons = document.querySelectorAll('.wa-btn, a[href^="https://wa.me"]');
    waButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Optional analytics tracking for WhatsApp clicks could go here
            console.log('WhatsApp CTA clicked');
        });
    });
});
