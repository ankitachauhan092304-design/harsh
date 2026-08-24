(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[151],{81055:(e,t,n)=>{Promise.resolve().then(n.bind(n,50779))},84325:(e,t,n)=>{"use strict";n.d(t,{DA:()=>s,Y0:()=>y,YI:()=>m,jB:()=>o,k0:()=>u,yD:()=>p});let o="919824975488";function a(e){return null==e?"N/A":String(e).replace(/[<>"'`]/g,"").replace(/\r/g,"").trim().slice(0,500)}function r(e){let t=Number(e);return isNaN(t)?"N/A":`₹${t.toLocaleString("en-IN")}`}let i={PERSONAL:"Personal Loan",BUSINESS:"Business Loan",HOME:"Home Loan",LAP:"Loan Against Property (LAP)",CREDIT_CARD:"Credit Card"};function l(e){return i[e?.toUpperCase()]??e}function s(e){let t=new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}),n=e.loanType?.toUpperCase(),o="";return o="PERSONAL"===n?`
💼 Employment Type: ${a(e.employmentType||"N/A")}
🏢 Company Name: ${a(e.companyName||"N/A")}
📈 Experience: ${a(e.experience||"N/A")}
💰 Monthly Income: ${r(e.monthlyIncome||0)}`:"BUSINESS"===n?`
🏪 Business Name: ${a(e.businessName||"N/A")}
🏢 Business Type: ${a(e.businessType||"N/A")}
📊 Annual Turnover: ${a(e.annualTurnover||"N/A")}
🧾 GST Registered: ${a(e.gstAvailable||"N/A")}
📅 Years in Business: ${a(e.yearsInBusiness||"N/A")}`:"HOME"===n?`
💼 Occupation: ${a(e.employmentType||"N/A")}
💰 Monthly Income: ${r(e.monthlyIncome||0)}
🏘 Property Value: ${a(e.propertyValue||"N/A")}`:"LAP"===n?`
🏠 Property Type: ${a(e.propertyType||"N/A")}
🏘 Property Value: ${a(e.propertyValue||"N/A")}`:`
💼 Employment Type: ${a(e.employmentType||"N/A")}
💰 Monthly Income: ${r(e.monthlyIncome||0)}`,`🏢 *WHITESTONE FINCORP — Loan Enquiry*
${"─".repeat(35)}

📋 *Lead Reference:* ${a(e.leadNumber)}

👤 *Name:* ${a(e.name)}
📞 *Mobile:* +91 ${a(e.phone)}
📧 *Email:* ${a(e.email)}
🏙 *City:* ${a(e.city)}

🏦 *Loan Type:* ${l(e.loanType)}
💵 *Required Amount:* ${r(e.loanAmount)}
${o}

📝 *Remarks:*
${a(e.remarks||"No additional remarks.")}

📅 *Submitted:* ${t}
🌐 *Source:* WHITESTONE FINCORP Website

${"─".repeat(35)}
_Please respond with your best offer._`}function u(e){return`📊 *EMI Calculation — WHITESTONE FINCORP*
${"─".repeat(35)}

💵 *Loan Amount:* ${r(e.loanAmount)}
📈 *Interest Rate:* ${e.interestRate}% p.a.
📅 *Tenure:* ${e.tenure} Years

━━━━━━━━━━━━━━━━━━━━

💳 *Monthly EMI:* ${r(Math.round(e.monthlyEmi))}
💰 *Total Interest:* ${r(Math.round(e.totalInterest))}
🏦 *Total Payment:* ${r(Math.round(e.totalPayment))}

${"─".repeat(35)}
I'd like to discuss loan options for this amount. Can you help me find the best offer?

_Calculated via WHITESTONE FINCORP EMI Calculator_`}function p(e){return`📊 *Credit Score Estimate — WHITESTONE FINCORP*
${"─".repeat(35)}

🎯 *Estimated Score:* ${e.estimatedScore}
⭐ *Rating:* ${a(e.rating)}
🔒 *Risk Level:* ${a(e.riskLevel)}

${"─".repeat(35)}
I'd like to discuss loan options based on my credit profile. Can you guide me?

_Estimated via WHITESTONE FINCORP Credit Score Tool_`}function m(e){return`📊 *Loan Eligibility — WHITESTONE FINCORP*
${"─".repeat(35)}

💰 *Monthly Income:* ${r(e.monthlyIncome)}
🏦 *Loan Type:* ${l(e.loanType)}

━━━━━━━━━━━━━━━━━━━━

✅ *Eligible Amount:* ${r(e.eligibleAmount)}
📊 *FOIR:* ${e.foir}%
🎯 *Approval Chance:* ${a(e.approvalChance)}

${"─".repeat(35)}
I'd like to apply for a loan. Can your team assist me?

_Calculated via WHITESTONE FINCORP Eligibility Checker_`}function y(e,t){let n=(t||o).replace(/[^0-9]/g,""),a=encodeURIComponent(e);return`https://wa.me/${n}?text=${a}`}}},e=>{e.O(0,[147,675,779,441,794,358],()=>e(e.s=81055)),_N_E=e.O()}]);