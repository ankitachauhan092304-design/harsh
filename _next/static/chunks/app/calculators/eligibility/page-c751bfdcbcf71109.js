(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[194],{11222:(e,t,r)=>{"use strict";r.d(t,{A:()=>n});let n={EMI:{LOAN_AMOUNT:{MIN:1e5,MAX:1e8,STEP:1e5,DEFAULT:1e5},INTEREST_RATE:{MIN:5,MAX:30,STEP:.1,DEFAULT:8.5},TENURE_YEARS:{MIN:1,MAX:30,STEP:1,DEFAULT:20}},ELIGIBILITY:{INCOME:{MIN:15e3,MAX:1e6,STEP:5e3,DEFAULT:5e4}}}},30772:(e,t,r)=>{"use strict";r.d(t,{A:()=>l});var n=r(12115),o=r(30907);let a=e=>{let t=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,r)=>r?r.toUpperCase():t.toLowerCase());return t.charAt(0).toUpperCase()+t.slice(1)};var i=r(71265);let l=(e,t)=>{let r=(0,n.forwardRef)(({className:r,...l},s)=>(0,n.createElement)(i.default,{ref:s,iconNode:t,className:(0,o.z)(`lucide-${a(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,r),...l}));return r.displayName=a(e),r}},30907:(e,t,r)=>{"use strict";r.d(t,{z:()=>n});let n=(...e)=>e.filter((e,t,r)=>!!e&&""!==e.trim()&&r.indexOf(e)===t).join(" ").trim()},71265:(e,t,r)=>{"use strict";r.d(t,{default:()=>l});var n=r(12115),o={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"},a=r(30907);let i=(0,n.createContext)({}),l=(0,n.forwardRef)(({color:e,size:t,strokeWidth:r,absoluteStrokeWidth:l,className:s="",children:u,iconNode:m,...p},c)=>{let{size:N=24,strokeWidth:E=2,absoluteStrokeWidth:d=!1,color:y="currentColor",className:$=""}=(0,n.useContext)(i)??{},I=l??d?24*Number(r??E)/Number(t??N):r??E;return(0,n.createElement)("svg",{ref:c,...o,width:t??N??o.width,height:t??N??o.height,stroke:e??y,strokeWidth:I,className:(0,a.z)("lucide",$,s),...!u&&!(e=>{for(let t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0;return!1})(p)&&{"aria-hidden":"true"},...p},[...m.map(([e,t])=>(0,n.createElement)(e,t)),...Array.isArray(u)?u:[u]])})},84325:(e,t,r)=>{"use strict";r.d(t,{DA:()=>s,Y0:()=>c,YI:()=>p,jB:()=>n,k0:()=>u,yD:()=>m});let n="919824975488";function o(e){return null==e?"N/A":String(e).replace(/[<>"'`]/g,"").replace(/\r/g,"").trim().slice(0,500)}function a(e){let t=Number(e);return isNaN(t)?"N/A":`₹${t.toLocaleString("en-IN")}`}let i={PERSONAL:"Personal Loan",BUSINESS:"Business Loan",HOME:"Home Loan",LAP:"Loan Against Property (LAP)",CREDIT_CARD:"Credit Card"};function l(e){return i[e?.toUpperCase()]??e}function s(e){let t=new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}),r=e.loanType?.toUpperCase(),n="";return n="PERSONAL"===r?`
💼 Employment Type: ${o(e.employmentType||"N/A")}
🏢 Company Name: ${o(e.companyName||"N/A")}
📈 Experience: ${o(e.experience||"N/A")}
💰 Monthly Income: ${a(e.monthlyIncome||0)}`:"BUSINESS"===r?`
🏪 Business Name: ${o(e.businessName||"N/A")}
🏢 Business Type: ${o(e.businessType||"N/A")}
📊 Annual Turnover: ${o(e.annualTurnover||"N/A")}
🧾 GST Registered: ${o(e.gstAvailable||"N/A")}
📅 Years in Business: ${o(e.yearsInBusiness||"N/A")}`:"HOME"===r?`
💼 Occupation: ${o(e.employmentType||"N/A")}
💰 Monthly Income: ${a(e.monthlyIncome||0)}
🏘 Property Value: ${o(e.propertyValue||"N/A")}`:"LAP"===r?`
🏠 Property Type: ${o(e.propertyType||"N/A")}
🏘 Property Value: ${o(e.propertyValue||"N/A")}`:`
💼 Employment Type: ${o(e.employmentType||"N/A")}
💰 Monthly Income: ${a(e.monthlyIncome||0)}`,`🏢 *WHITESTONE FINCORP — Loan Enquiry*
${"─".repeat(35)}

📋 *Lead Reference:* ${o(e.leadNumber)}

👤 *Name:* ${o(e.name)}
📞 *Mobile:* +91 ${o(e.phone)}
📧 *Email:* ${o(e.email)}
🏙 *City:* ${o(e.city)}

🏦 *Loan Type:* ${l(e.loanType)}
💵 *Required Amount:* ${a(e.loanAmount)}
${n}

📝 *Remarks:*
${o(e.remarks||"No additional remarks.")}

📅 *Submitted:* ${t}
🌐 *Source:* WHITESTONE FINCORP Website

${"─".repeat(35)}
_Please respond with your best offer._`}function u(e){return`📊 *EMI Calculation — WHITESTONE FINCORP*
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

_Calculated via WHITESTONE FINCORP EMI Calculator_`}function m(e){return`📊 *Credit Score Estimate — WHITESTONE FINCORP*
${"─".repeat(35)}

🎯 *Estimated Score:* ${e.estimatedScore}
⭐ *Rating:* ${o(e.rating)}
🔒 *Risk Level:* ${o(e.riskLevel)}

${"─".repeat(35)}
I'd like to discuss loan options based on my credit profile. Can you guide me?

_Estimated via WHITESTONE FINCORP Credit Score Tool_`}function p(e){return`📊 *Loan Eligibility — WHITESTONE FINCORP*
${"─".repeat(35)}

💰 *Monthly Income:* ${a(e.monthlyIncome)}
🏦 *Loan Type:* ${l(e.loanType)}

━━━━━━━━━━━━━━━━━━━━

✅ *Eligible Amount:* ${a(e.eligibleAmount)}
📊 *FOIR:* ${e.foir}%
🎯 *Approval Chance:* ${o(e.approvalChance)}

${"─".repeat(35)}
I'd like to apply for a loan. Can your team assist me?

_Calculated via WHITESTONE FINCORP Eligibility Checker_`}function c(e,t){let r=(t||n).replace(/[^0-9]/g,""),o=encodeURIComponent(e);return`https://wa.me/${r}?text=${o}`}},98013:(e,t,r)=>{Promise.resolve().then(r.bind(r,86329))}},e=>{e.O(0,[329,441,794,358],()=>e(e.s=98013)),_N_E=e.O()}]);