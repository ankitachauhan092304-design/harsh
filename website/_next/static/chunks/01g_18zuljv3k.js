(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,49702,e=>{"use strict";let t="919824975488";function n(e){return null==e?"N/A":String(e).replace(/[<>"'`]/g,"").replace(/\r/g,"").trim().slice(0,500)}function a(e){let t=Number(e);return isNaN(t)?"N/A":`₹${t.toLocaleString("en-IN")}`}let o={PERSONAL:"Personal Loan",BUSINESS:"Business Loan",HOME:"Home Loan",LAP:"Loan Against Property (LAP)",CREDIT_CARD:"Credit Card"};function r(e){return o[e?.toUpperCase()]??e}e.s(["DEFAULT_WA_NUMBER",0,t,"buildCreditScoreShareMessage",0,function(e){return`📊 *Credit Score Estimate — WHITESTONE FINCORP*
${"─".repeat(35)}

🎯 *Estimated Score:* ${e.estimatedScore}
⭐ *Rating:* ${n(e.rating)}
🔒 *Risk Level:* ${n(e.riskLevel)}

${"─".repeat(35)}
I'd like to discuss loan options based on my credit profile. Can you guide me?

_Estimated via WHITESTONE FINCORP Credit Score Tool_`},"buildEMIShareMessage",0,function(e){return`📊 *EMI Calculation — WHITESTONE FINCORP*
${"─".repeat(35)}

💵 *Loan Amount:* ${a(e.loanAmount)}
📈 *Interest Rate:* ${e.interestRate}% p.a.
📅 *Tenure:* ${e.tenure} Years

━━━━━━━━━━━━━━━━━━━━

💳 *Monthly EMI:* ${a(Math.round(e.monthlyEmi))}
💰 *Total Interest:* ${a(Math.round(e.totalInterest))}
🏦 *Total Payment:* ${a(Math.round(e.totalPayment))}

${"─".repeat(35)}
I'd like to discuss loan options for this amount. Can you help me find the best offer?

_Calculated via WHITESTONE FINCORP EMI Calculator_`},"buildEligibilityShareMessage",0,function(e){return`📊 *Loan Eligibility — WHITESTONE FINCORP*
${"─".repeat(35)}

💰 *Monthly Income:* ${a(e.monthlyIncome)}
🏦 *Loan Type:* ${r(e.loanType)}

━━━━━━━━━━━━━━━━━━━━

✅ *Eligible Amount:* ${a(e.eligibleAmount)}
📊 *FOIR:* ${e.foir}%
🎯 *Approval Chance:* ${n(e.approvalChance)}

${"─".repeat(35)}
I'd like to apply for a loan. Can your team assist me?

_Calculated via WHITESTONE FINCORP Eligibility Checker_`},"buildEnquiryMessage",0,function(e){let t=new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}),o=e.loanType?.toUpperCase(),i="";return i="PERSONAL"===o?`
💼 Employment Type: ${n(e.employmentType||"N/A")}
🏢 Company Name: ${n(e.companyName||"N/A")}
📈 Experience: ${n(e.experience||"N/A")}
💰 Monthly Income: ${a(e.monthlyIncome||0)}`:"BUSINESS"===o?`
🏪 Business Name: ${n(e.businessName||"N/A")}
🏢 Business Type: ${n(e.businessType||"N/A")}
📊 Annual Turnover: ${n(e.annualTurnover||"N/A")}
🧾 GST Registered: ${n(e.gstAvailable||"N/A")}
📅 Years in Business: ${n(e.yearsInBusiness||"N/A")}`:"HOME"===o?`
💼 Occupation: ${n(e.employmentType||"N/A")}
💰 Monthly Income: ${a(e.monthlyIncome||0)}
🏘 Property Value: ${n(e.propertyValue||"N/A")}`:"LAP"===o?`
🏠 Property Type: ${n(e.propertyType||"N/A")}
🏘 Property Value: ${n(e.propertyValue||"N/A")}`:`
💼 Employment Type: ${n(e.employmentType||"N/A")}
💰 Monthly Income: ${a(e.monthlyIncome||0)}`,`🏢 *WHITESTONE FINCORP — Loan Enquiry*
${"─".repeat(35)}

📋 *Lead Reference:* ${n(e.leadNumber)}

👤 *Name:* ${n(e.name)}
📞 *Mobile:* +91 ${n(e.phone)}
📧 *Email:* ${n(e.email)}
🏙 *City:* ${n(e.city)}

🏦 *Loan Type:* ${r(e.loanType)}
💵 *Required Amount:* ${a(e.loanAmount)}
${i}

📝 *Remarks:*
${n(e.remarks||"No additional remarks.")}

📅 *Submitted:* ${t}
🌐 *Source:* WHITESTONE FINCORP Website

${"─".repeat(35)}
_Please respond with your best offer._`},"buildWhatsAppUrl",0,function(e,n){let a=(n||t).replace(/[^0-9]/g,""),o=encodeURIComponent(e);return`https://wa.me/${a}?text=${o}`}])},76226,e=>{"use strict";let t=(0,e.i(56420).default)("indian-rupee",[["path",{d:"M6 3h12",key:"ggurg9"}],["path",{d:"M6 8h12",key:"6g4wlu"}],["path",{d:"m6 13 8.5 8",key:"u1kupk"}],["path",{d:"M6 13h3",key:"wdp6ag"}],["path",{d:"M9 13c6.667 0 6.667-10 0-10",key:"1nkvk2"}]]);e.s(["IndianRupee",0,t],76226)},26091,e=>{"use strict";let t=(0,e.i(56420).default)("file-text",[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",key:"1oefj6"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5",key:"wfsgrz"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]]);e.s(["FileText",0,t],26091)},10160,e=>{"use strict";function t(e){return(t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}e.s(["default",()=>t])},58359,e=>{"use strict";e.s(["CALCULATOR_CONFIG",0,{EMI:{LOAN_AMOUNT:{MIN:1e5,MAX:1e8,STEP:1e5,DEFAULT:25e5},INTEREST_RATE:{MIN:5,MAX:30,STEP:.1,DEFAULT:8.5},TENURE_YEARS:{MIN:1,MAX:30,STEP:1,DEFAULT:20}},ELIGIBILITY:{INCOME:{MIN:15e3,MAX:1e6,STEP:5e3,DEFAULT:5e4}}}])},41120,e=>{"use strict";let t=(0,e.i(56420).default)("refresh-cw",[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]]);e.s(["RefreshCw",0,t],41120)},48503,e=>{e.v(t=>Promise.all(["static/chunks/3gti1qdk5epqn.js"].map(t=>e.l(t))).then(()=>t(15833)))},70653,e=>{e.v(t=>Promise.all(["static/chunks/0eh9mwz0l7h7p.js"].map(t=>e.l(t))).then(()=>t(24154)))},95111,e=>{e.v(t=>Promise.all(["static/chunks/3_s4uuomlz72b.js"].map(t=>e.l(t))).then(()=>t(38201)))}]);