(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[46],{22841:(e,t,r)=>{Promise.resolve().then(r.bind(r,64995))},30772:(e,t,r)=>{"use strict";r.d(t,{A:()=>l});var a=r(12115),n=r(30907);let o=e=>{let t=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,r)=>r?r.toUpperCase():t.toLowerCase());return t.charAt(0).toUpperCase()+t.slice(1)};var i=r(71265);let l=(e,t)=>{let r=(0,a.forwardRef)(({className:r,...l},s)=>(0,a.createElement)(i.default,{ref:s,iconNode:t,className:(0,n.z)(`lucide-${o(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,r),...l}));return r.displayName=o(e),r}},30907:(e,t,r)=>{"use strict";r.d(t,{z:()=>a});let a=(...e)=>e.filter((e,t,r)=>!!e&&""!==e.trim()&&r.indexOf(e)===t).join(" ").trim()},36483:(e,t,r)=>{"use strict";r.d(t,{A:()=>a});let a=(0,r(30772).A)("file-text",[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",key:"1oefj6"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5",key:"wfsgrz"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]])},47660:(e,t,r)=>{"use strict";r.d(t,{A:()=>a});let a=(0,r(30772).A)("indian-rupee",[["path",{d:"M6 3h12",key:"ggurg9"}],["path",{d:"M6 8h12",key:"6g4wlu"}],["path",{d:"m6 13 8.5 8",key:"u1kupk"}],["path",{d:"M6 13h3",key:"wdp6ag"}],["path",{d:"M9 13c6.667 0 6.667-10 0-10",key:"1nkvk2"}]])},71265:(e,t,r)=>{"use strict";r.d(t,{default:()=>l});var a=r(12115),n={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"},o=r(30907);let i=(0,a.createContext)({}),l=(0,a.forwardRef)(({color:e,size:t,strokeWidth:r,absoluteStrokeWidth:l,className:s="",children:u,iconNode:p,...m},c)=>{let{size:d=24,strokeWidth:y=2,absoluteStrokeWidth:h=!1,color:N="currentColor",className:$=""}=(0,a.useContext)(i)??{},E=l??h?24*Number(r??y)/Number(t??d):r??y;return(0,a.createElement)("svg",{ref:c,...n,width:t??d??n.width,height:t??d??n.height,stroke:e??N,strokeWidth:E,className:(0,o.z)("lucide",$,s),...!u&&!(e=>{for(let t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0;return!1})(m)&&{"aria-hidden":"true"},...m},[...p.map(([e,t])=>(0,a.createElement)(e,t)),...Array.isArray(u)?u:[u]])})},84325:(e,t,r)=>{"use strict";r.d(t,{DA:()=>s,Y0:()=>c,YI:()=>m,jB:()=>a,k0:()=>u,yD:()=>p});let a="919824975488";function n(e){return null==e?"N/A":String(e).replace(/[<>"'`]/g,"").replace(/\r/g,"").trim().slice(0,500)}function o(e){let t=Number(e);return isNaN(t)?"N/A":`₹${t.toLocaleString("en-IN")}`}let i={PERSONAL:"Personal Loan",BUSINESS:"Business Loan",HOME:"Home Loan",LAP:"Loan Against Property (LAP)",CREDIT_CARD:"Credit Card"};function l(e){return i[e?.toUpperCase()]??e}function s(e){let t=new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}),r=e.loanType?.toUpperCase(),a="";return a="PERSONAL"===r?`
💼 Employment Type: ${n(e.employmentType||"N/A")}
🏢 Company Name: ${n(e.companyName||"N/A")}
📈 Experience: ${n(e.experience||"N/A")}
💰 Monthly Income: ${o(e.monthlyIncome||0)}`:"BUSINESS"===r?`
🏪 Business Name: ${n(e.businessName||"N/A")}
🏢 Business Type: ${n(e.businessType||"N/A")}
📊 Annual Turnover: ${n(e.annualTurnover||"N/A")}
🧾 GST Registered: ${n(e.gstAvailable||"N/A")}
📅 Years in Business: ${n(e.yearsInBusiness||"N/A")}`:"HOME"===r?`
💼 Occupation: ${n(e.employmentType||"N/A")}
💰 Monthly Income: ${o(e.monthlyIncome||0)}
🏘 Property Value: ${n(e.propertyValue||"N/A")}`:"LAP"===r?`
🏠 Property Type: ${n(e.propertyType||"N/A")}
🏘 Property Value: ${n(e.propertyValue||"N/A")}`:`
💼 Employment Type: ${n(e.employmentType||"N/A")}
💰 Monthly Income: ${o(e.monthlyIncome||0)}`,`🏢 *WHITESTONE FINCORP — Loan Enquiry*
${"─".repeat(35)}

📋 *Lead Reference:* ${n(e.leadNumber)}

👤 *Name:* ${n(e.name)}
📞 *Mobile:* +91 ${n(e.phone)}
📧 *Email:* ${n(e.email)}
🏙 *City:* ${n(e.city)}

🏦 *Loan Type:* ${l(e.loanType)}
💵 *Required Amount:* ${o(e.loanAmount)}
${a}

📝 *Remarks:*
${n(e.remarks||"No additional remarks.")}

📅 *Submitted:* ${t}
🌐 *Source:* WHITESTONE FINCORP Website

${"─".repeat(35)}
_Please respond with your best offer._`}function u(e){return`📊 *EMI Calculation — WHITESTONE FINCORP*
${"─".repeat(35)}

💵 *Loan Amount:* ${o(e.loanAmount)}
📈 *Interest Rate:* ${e.interestRate}% p.a.
📅 *Tenure:* ${e.tenure} Years

━━━━━━━━━━━━━━━━━━━━

💳 *Monthly EMI:* ${o(Math.round(e.monthlyEmi))}
💰 *Total Interest:* ${o(Math.round(e.totalInterest))}
🏦 *Total Payment:* ${o(Math.round(e.totalPayment))}

${"─".repeat(35)}
I'd like to discuss loan options for this amount. Can you help me find the best offer?

_Calculated via WHITESTONE FINCORP EMI Calculator_`}function p(e){return`📊 *Credit Score Estimate — WHITESTONE FINCORP*
${"─".repeat(35)}

🎯 *Estimated Score:* ${e.estimatedScore}
⭐ *Rating:* ${n(e.rating)}
🔒 *Risk Level:* ${n(e.riskLevel)}

${"─".repeat(35)}
I'd like to discuss loan options based on my credit profile. Can you guide me?

_Estimated via WHITESTONE FINCORP Credit Score Tool_`}function m(e){return`📊 *Loan Eligibility — WHITESTONE FINCORP*
${"─".repeat(35)}

💰 *Monthly Income:* ${o(e.monthlyIncome)}
🏦 *Loan Type:* ${l(e.loanType)}

━━━━━━━━━━━━━━━━━━━━

✅ *Eligible Amount:* ${o(e.eligibleAmount)}
📊 *FOIR:* ${e.foir}%
🎯 *Approval Chance:* ${n(e.approvalChance)}

${"─".repeat(35)}
I'd like to apply for a loan. Can your team assist me?

_Calculated via WHITESTONE FINCORP Eligibility Checker_`}function c(e,t){let r=(t||a).replace(/[^0-9]/g,""),n=encodeURIComponent(e);return`https://wa.me/${r}?text=${n}`}}},e=>{e.O(0,[930,33,347,995,441,794,358],()=>e(e.s=22841)),_N_E=e.O()}]);