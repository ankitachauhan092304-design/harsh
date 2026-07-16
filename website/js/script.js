// script.js

document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Logic
    const menuBtn = document.querySelector('button.lg\\:hidden');
    
    if (menuBtn) {
        let isOpen = false;
        
        // Find the mobile drawer by checking for the div that contains mobile links
        // We can identify it because it is hidden on lg screens and has fixed/absolute or specific classes
        // The HTML structure might have changed slightly from React to static, let's find it robustly.
        
        const mobileDrawer = document.createElement('div');
        mobileDrawer.className = 'lg:hidden w-full bg-white border-t border-slate-100 overflow-hidden shadow-lg transition-all duration-300';
        mobileDrawer.style.maxHeight = '0px';
        mobileDrawer.style.opacity = '0';
        
        // Next.js static export leaves the React DOM intact for initial render.
        // Wait, the mobile drawer in Header.tsx was wrapped in <AnimatePresence> and only rendered if isOpen is true.
        // That means the mobile drawer HTML *is not present* in the static HTML because isOpen was false on server!
        // We need to construct the mobile drawer dynamically, OR tell the user that the mobile menu might need to be hardcoded if they want it.
        // Let's dynamically create the mobile menu from the desktop links!
        
        const desktopNav = document.querySelector('nav.hidden.lg\\:flex');
        
        if (desktopNav) {
            // We can clone the links
            const links = desktopNav.querySelectorAll('a, button');
            let drawerHTML = '<div class="px-6 py-6 flex flex-col gap-4 max-h-[85vh] overflow-y-auto">';
            
            // Hardcode or extract standard links for mobile
            drawerHTML += `
              <a href="index.html" class="text-base font-bold text-slate-800 py-1.5 border-b border-slate-50">Home</a>
              <a href="about.html" class="text-base font-bold text-slate-800 py-1.5 border-b border-slate-50">About</a>
              
              <div class="flex flex-col gap-1.5">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Our Services</span>
                <a href="services/personal-loan.html" class="text-sm font-semibold text-slate-700 pl-3 py-1.5 hover:text-[#0B4F9C]">Personal Loan</a>
                <a href="services/business-loan.html" class="text-sm font-semibold text-slate-700 pl-3 py-1.5 hover:text-[#0B4F9C]">Business Loan</a>
                <a href="services/home-loan.html" class="text-sm font-semibold text-slate-700 pl-3 py-1.5 hover:text-[#0B4F9C]">Home Loan</a>
                <a href="services/loan-against-property.html" class="text-sm font-semibold text-slate-700 pl-3 py-1.5 hover:text-[#0B4F9C]">Loan Against Property</a>
              </div>

              <div class="flex flex-col gap-1.5">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Calculators</span>
                <a href="calculators/emi.html" class="text-sm font-semibold text-slate-700 pl-3 py-1.5 hover:text-[#0B4F9C]">EMI Calculator</a>
                <a href="calculators/credit-score.html" class="text-sm font-semibold text-slate-700 pl-3 py-1.5 hover:text-[#0B4F9C]">Credit Score Estimator</a>
                <a href="calculators/eligibility.html" class="text-sm font-semibold text-slate-700 pl-3 py-1.5 hover:text-[#0B4F9C]">Eligibility Checker</a>
              </div>

              <a href="blog.html" class="text-base font-bold text-slate-800 py-1.5 border-b border-slate-50 mt-2">Blog</a>
              <a href="contact.html" class="text-base font-bold text-slate-800 py-1.5 border-b border-slate-50">Contact</a>
              
              <div class="flex flex-col gap-3 mt-4 pt-4 border-t border-slate-100">
                <a href="tel:+919824975488" class="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-50 text-slate-800 font-bold text-sm">
                  Call Support
                </a>
                <a href="contact.html?type=apply" class="w-full text-center px-4 py-3 rounded-xl bg-gradient-to-r from-[#0B4F9C] to-[#00A86B] text-white font-bold text-sm shadow-md">
                  Apply for Loan
                </a>
              </div>
            </div>`;
            
            mobileDrawer.innerHTML = drawerHTML;
            
            // Append it to the header
            const header = document.querySelector('header');
            if (header) {
                header.appendChild(mobileDrawer);
            }
            
            // Adjust paths dynamically based on depth
            // E.g., if we are in /services/personal-loan, "about.html" should be "../about.html"
            // Wait, this might be tricky in pure JS. A simple regex fix:
            const depth = window.location.pathname.split('/').length - 2;
            const prefix = depth > 0 ? '../'.repeat(depth) : './';
            if (depth > 0) {
                 const links = mobileDrawer.querySelectorAll('a');
                 links.forEach(a => {
                     const href = a.getAttribute('href');
                     if (href && !href.startsWith('http') && !href.startsWith('tel:')) {
                         a.setAttribute('href', prefix + href);
                     }
                 });
            }

            menuBtn.addEventListener('click', () => {
                isOpen = !isOpen;
                if (isOpen) {
                    mobileDrawer.style.maxHeight = '1000px';
                    mobileDrawer.style.opacity = '1';
                    // Optional: change icon from Menu to X
                    menuBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
                } else {
                    mobileDrawer.style.maxHeight = '0px';
                    mobileDrawer.style.opacity = '0';
                    // Change icon back to Menu
                    menuBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
                }
            });
        }
    }

    // Scroll effect for header
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                header.classList.add('glassmorphism', 'shadow-md');
                header.classList.replace('py-3', 'py-1.5');
                header.classList.replace('md:py-4.5', 'md:py-2');
                header.classList.remove('bg-transparent');
            } else {
                header.classList.remove('glassmorphism', 'shadow-md');
                header.classList.replace('py-1.5', 'py-3');
                header.classList.replace('md:py-2', 'md:py-4.5');
                header.classList.add('bg-transparent');
            }
        });
    }
});
