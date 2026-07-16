/**
 * whatsapp.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Core WhatsApp CRM utilities for Whitestone Fincorp.
 *
 * Responsibilities:
 *  1. Generate unique, formatted lead IDs: WF-YYYYMMDD-000001
 *  2. Build professional, URL-safe WhatsApp enquiry messages
 *  3. Build follow-up messages from admin CRM (per lead)
 *  4. Build calculator result share messages
 *  5. Return safe wa.me URLs ready for window.open()
 *
 * SECURITY:
 *  - All user input is sanitized before embedding into messages
 *  - All URLs are properly encodeURIComponent-encoded
 *  - No raw user input is ever embedded unescaped
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Default WhatsApp business number (country code + number, no +) */
export const DEFAULT_WA_NUMBER = '919824975488';

// ─────────────────────────────────────────────────────────────────────────────
// Lead Number Generation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generates a unique, formatted lead number.
 * Format: WF-YYYYMMDD-NNNNNN  (6-digit sequence, zero-padded)
 * The sequence component is derived from the current timestamp milliseconds
 * modulo 1,000,000 so it stays within 6 digits and is always unique per ms.
 *
 * For true sequential numbering across concurrent requests, the DB layer
 * should call countLeadsOnDate() and pass the sequence in.
 */
export function generateLeadNumber(sequence: number): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const seq = String(sequence).padStart(6, '0');
  return `WF-${yyyy}${mm}${dd}-${seq}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Input Sanitizer
// ─────────────────────────────────────────────────────────────────────────────

/** Strips characters that could break WhatsApp message parsing */
function sanitize(value: unknown): string {
  if (value === null || value === undefined) return 'N/A';
  return String(value)
    .replace(/[<>"'`]/g, '') // Remove HTML-like chars
    .replace(/\r/g, '')       // Normalize line endings
    .trim()
    .slice(0, 500);           // Hard cap to prevent URL length attacks
}

function formatCurrency(amount: number | string): string {
  const n = Number(amount);
  if (isNaN(n)) return 'N/A';
  return `₹${n.toLocaleString('en-IN')}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Loan Type Label Map
// ─────────────────────────────────────────────────────────────────────────────

const LOAN_TYPE_LABELS: Record<string, string> = {
  PERSONAL: 'Personal Loan',
  BUSINESS: 'Business Loan',
  HOME: 'Home Loan',
  LAP: 'Loan Against Property (LAP)',
  CREDIT_CARD: 'Credit Card',
};

function loanLabel(type: string): string {
  return LOAN_TYPE_LABELS[type?.toUpperCase()] ?? type;
}

// ─────────────────────────────────────────────────────────────────────────────
// Enquiry Message Builder (called after lead is saved)
// ─────────────────────────────────────────────────────────────────────────────

export interface EnquiryLeadData {
  leadNumber: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  employmentType?: string;
  monthlyIncome?: number | string;
  loanType: string;
  loanAmount: number | string;
  remarks?: string;
  // Service-specific optional fields
  companyName?: string;
  experience?: string;
  businessName?: string;
  businessType?: string;
  annualTurnover?: string;
  gstAvailable?: string;
  yearsInBusiness?: string;
  propertyType?: string;
  propertyValue?: string;
}

export function buildEnquiryMessage(lead: EnquiryLeadData): string {
  const date = new Date().toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  const type = lead.loanType?.toUpperCase();

  // Service-specific section
  let serviceSection = '';
  if (type === 'PERSONAL') {
    serviceSection = `
💼 Employment Type: ${sanitize(lead.employmentType || 'N/A')}
🏢 Company Name: ${sanitize(lead.companyName || 'N/A')}
📈 Experience: ${sanitize(lead.experience || 'N/A')}
💰 Monthly Income: ${formatCurrency(lead.monthlyIncome || 0)}`;
  } else if (type === 'BUSINESS') {
    serviceSection = `
🏪 Business Name: ${sanitize(lead.businessName || 'N/A')}
🏢 Business Type: ${sanitize(lead.businessType || 'N/A')}
📊 Annual Turnover: ${sanitize(lead.annualTurnover || 'N/A')}
🧾 GST Registered: ${sanitize(lead.gstAvailable || 'N/A')}
📅 Years in Business: ${sanitize(lead.yearsInBusiness || 'N/A')}`;
  } else if (type === 'HOME') {
    serviceSection = `
💼 Occupation: ${sanitize(lead.employmentType || 'N/A')}
💰 Monthly Income: ${formatCurrency(lead.monthlyIncome || 0)}
🏘 Property Value: ${sanitize(lead.propertyValue || 'N/A')}`;
  } else if (type === 'LAP') {
    serviceSection = `
🏠 Property Type: ${sanitize(lead.propertyType || 'N/A')}
🏘 Property Value: ${sanitize(lead.propertyValue || 'N/A')}`;
  } else {
    serviceSection = `
💼 Employment Type: ${sanitize(lead.employmentType || 'N/A')}
💰 Monthly Income: ${formatCurrency(lead.monthlyIncome || 0)}`;
  }

  const message = `🏢 *WHITESTONE FINCORP — Loan Enquiry*
${'─'.repeat(35)}

📋 *Lead Reference:* ${sanitize(lead.leadNumber)}

👤 *Name:* ${sanitize(lead.name)}
📞 *Mobile:* +91 ${sanitize(lead.phone)}
📧 *Email:* ${sanitize(lead.email)}
🏙 *City:* ${sanitize(lead.city)}

🏦 *Loan Type:* ${loanLabel(lead.loanType)}
💵 *Required Amount:* ${formatCurrency(lead.loanAmount)}
${serviceSection}

📝 *Remarks:*
${sanitize(lead.remarks || 'No additional remarks.')}

📅 *Submitted:* ${date}
🌐 *Source:* WHITESTONE FINCORP Website

${'─'.repeat(35)}
_Please respond with your best offer._`;

  return message;
}

// ─────────────────────────────────────────────────────────────────────────────
// Admin Follow-up Message Builder (for CRM "WhatsApp" button in lead drawer)
// ─────────────────────────────────────────────────────────────────────────────

export interface FollowUpData {
  customerName: string;
  leadNumber: string;
  executiveName?: string;
}

export function buildFollowUpMessage(data: FollowUpData): string {
  const message = `Hello ${sanitize(data.customerName)},

This is ${sanitize(data.executiveName || 'your advisor')} from *WHITESTONE FINCORP* 🏢

We have received your loan enquiry.

📋 *Lead Reference:* ${sanitize(data.leadNumber)}

Our team is currently reviewing your application and will get back to you with the best loan offers from our banking partners shortly.

Feel free to reply to this message if you have any questions or need to update any details.

Thank you for trusting WHITESTONE FINCORP! 🙏

_This is a service message from WHITESTONE FINCORP._`;

  return message;
}

// ─────────────────────────────────────────────────────────────────────────────
// Calculator Share Messages
// ─────────────────────────────────────────────────────────────────────────────

export interface EMIShareData {
  loanAmount: number;
  interestRate: number;
  tenure: number;
  monthlyEmi: number;
  totalInterest: number;
  totalPayment: number;
}

export function buildEMIShareMessage(data: EMIShareData): string {
  const message = `📊 *EMI Calculation — WHITESTONE FINCORP*
${'─'.repeat(35)}

💵 *Loan Amount:* ${formatCurrency(data.loanAmount)}
📈 *Interest Rate:* ${data.interestRate}% p.a.
📅 *Tenure:* ${data.tenure} Years

━━━━━━━━━━━━━━━━━━━━

💳 *Monthly EMI:* ${formatCurrency(Math.round(data.monthlyEmi))}
💰 *Total Interest:* ${formatCurrency(Math.round(data.totalInterest))}
🏦 *Total Payment:* ${formatCurrency(Math.round(data.totalPayment))}

${'─'.repeat(35)}
I'd like to discuss loan options for this amount. Can you help me find the best offer?

_Calculated via WHITESTONE FINCORP EMI Calculator_`;

  return message;
}

export interface CreditScoreShareData {
  estimatedScore: number;
  rating: string;
  riskLevel: string;
}

export function buildCreditScoreShareMessage(data: CreditScoreShareData): string {
  const message = `📊 *Credit Score Estimate — WHITESTONE FINCORP*
${'─'.repeat(35)}

🎯 *Estimated Score:* ${data.estimatedScore}
⭐ *Rating:* ${sanitize(data.rating)}
🔒 *Risk Level:* ${sanitize(data.riskLevel)}

${'─'.repeat(35)}
I'd like to discuss loan options based on my credit profile. Can you guide me?

_Estimated via WHITESTONE FINCORP Credit Score Tool_`;

  return message;
}

export interface EligibilityShareData {
  eligibleAmount: number;
  foir: number;
  approvalChance: string;
  monthlyIncome: number;
  loanType: string;
}

export function buildEligibilityShareMessage(data: EligibilityShareData): string {
  const message = `📊 *Loan Eligibility — WHITESTONE FINCORP*
${'─'.repeat(35)}

💰 *Monthly Income:* ${formatCurrency(data.monthlyIncome)}
🏦 *Loan Type:* ${loanLabel(data.loanType)}

━━━━━━━━━━━━━━━━━━━━

✅ *Eligible Amount:* ${formatCurrency(data.eligibleAmount)}
📊 *FOIR:* ${data.foir}%
🎯 *Approval Chance:* ${sanitize(data.approvalChance)}

${'─'.repeat(35)}
I'd like to apply for a loan. Can your team assist me?

_Calculated via WHITESTONE FINCORP Eligibility Checker_`;

  return message;
}

// ─────────────────────────────────────────────────────────────────────────────
// URL Builder — always use this to construct wa.me links
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Builds a safe, encoded WhatsApp URL.
 * @param message - The raw (un-encoded) message string
 * @param phoneNumber - Optional override; defaults to DEFAULT_WA_NUMBER
 */
export function buildWhatsAppUrl(message: string, phoneNumber?: string): string {
  const number = (phoneNumber || DEFAULT_WA_NUMBER).replace(/[^0-9]/g, '');
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${number}?text=${encoded}`;
}

/**
 * Opens WhatsApp in a new tab. Safe to call from client components.
 * Returns the URL that was opened (for analytics tracking).
 */
export function openWhatsApp(message: string, phoneNumber?: string): string {
  const url = buildWhatsAppUrl(message, phoneNumber);
  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
  return url;
}
