import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FileText, ArrowLeft } from 'lucide-react';

const LEGAL_DATA: Record<string, {
  title: string;
  lastUpdated: string;
  content: string[];
}> = {
  'privacy-policy': {
    title: 'Privacy Policy',
    lastUpdated: 'July 3, 2026',
    content: [
      'At Whitestone Fincorp, we prioritize your data privacy. This Privacy Policy details how we collect, store, share, and protect your personal and financial parameters submitted through our calculators, contact forms, or WhatsApp channels.',
      'Information We Collect: When applying for loan facilitation, we collect identifiers (Name, Email, Mobile number, Address), income metrics (Salary, Tax returns, Bank statements), and credit metadata (Existing EMIs, Estimated credit scores). We also collect tech logs like IP address, cookies, and UTM analytics.',
      'How We Use Your Data: Your details are primarily used to evaluate credit eligibility, map your application to banking partners, contact you with recommendations, and update lead logs. We do NOT sell or rent your information to third-party marketing companies.',
      'Data Sharing: As a facilitation consultant, we share your compiled document dossiers only with chosen banking partners (banks or registered NBFCs) upon your explicit consent, to complete underwriting checks. All partner integrations use secure, encrypted channels.',
      'Your Rights: You hold the right to request access to your stored files, modify inaccuracies, revoke consent for WhatsApp support, or request soft delete of your records by emailing privacy@whitestonefincorp.com.',
    ],
  },
  'terms-and-conditions': {
    title: 'Terms of Use',
    lastUpdated: 'July 3, 2026',
    content: [
      'Welcome to Whitestone Fincorp. By accessing and using our website, interactive calculators, blog insights, or lead forms, you agree to comply with and be bound by the following terms of use.',
      'Scope of Service: Whitestone Fincorp provides financial consultation, credit comparing tools, and loan facilitation. We are NOT a lender, bank, or NBFC. We do not issue loans, credit lines, or financial instruments. We assist in preparing documentation files and bridging connection paths to partner financial institutions.',
      'Calculator Disclaimer: Any calculators (EMI, Credit Score Estimator, Eligibility) on this site are for estimation and guidance purposes only. Output results are not final credit quotes or formal sanction letters. Lenders hold absolute discretion over interest slabs, fees, and approval ratios.',
      'User Obligations: You agree to supply only genuine, accurate, and complete information. Uploading forged payslips, mock statements, or incorrect identification is a breach of service guidelines and may result in blocking access to our panel and reporting to lenders.',
      'Limitation of Liability: Whitestone Fincorp will not be held liable for any damages, credit score dips resulting from bank hard inquiries, loan rejections, or delays in bank underwriting workflows.',
    ],
  },
  'disclaimer': {
    title: 'Corporate Disclaimer',
    lastUpdated: 'July 3, 2026',
    content: [
      'Whitestone Fincorp operates solely as an independent corporate financial consultant and facilitation partner. We are NOT a bank, Non-Banking Financial Company (NBFC), or direct lender.',
      'No Direct Lending: We do not lend money, disburse credit, or issue financial credit lines. All credit products mentioned on this site (Personal Loan, Business Loan, Home Loan, LAP, Credit Card) are disbursed exclusively by our partner banks and registered NBFCs.',
      'Interest Rates & Sanctions: The interest rates, tenures, processing fees, and collateral requirements listed on our portal are subject to frequent updates. Lenders evaluate each file independently. Final interest rates and loan sanctions are based on bank credit policy audits and promoter profile verification.',
      'Brokerage & Fee Transparency: Whitestone Fincorp does NOT charge any upfront commissions, file processing charges, or consulting fees from the borrower for standard facilitation. Any loan processing charges or verification fees are collected directly by the bank partner during disbursement.',
    ],
  },
  'refund-policy': {
    title: 'Refund Policy',
    lastUpdated: 'July 3, 2026',
    content: [
      'Whitestone Fincorp provides loan facilitation, profile matching, and credit consultation services entirely free of cost to borrowers. We do NOT collect or charge consulting fees, file charges, or advisory retainers from applicants.',
      'No Fee Collection: Since we do not charge any fees to our users for loan consultation or processing assistance, there are no refund policies applicable on our services.',
      'Bank Processing Fees: Any processing fees, stamp duties, legal fees, or technical valuation charges are charged and collected directly by the respective lending bank or NBFC as part of their standard credit operations. Whitestone Fincorp does not collect, hold, or manage these funds. In case of loan cancellations or rejections, any refund query for bank processing fees must be raised directly with the respective lending bank under their terms.',
    ],
  },
  'cookie-policy': {
    title: 'Cookie Policy',
    lastUpdated: 'July 3, 2026',
    content: [
      'This website uses cookies and tracking technologies to enhance user experience, compile traffic analytics, and optimize lead tracking parameters.',
      'What are Cookies: Cookies are small text files stored on your browser or device when you load web pages. They help us recognize your preferences and keep calculators in sync during page navigation.',
      'Types of Cookies We Use: (1) Essential cookies needed for basic site operation and secure logins, (2) Analytical/Performance cookies (Google Analytics) to track page visits, traffic sources, and performance bugs, and (3) Marketing cookies to track UTM tags, campaigns, and optimize lead source metrics.',
      'Managing Cookies: You can choose to block, disable, or delete cookies through your browser settings. However, doing so may disable or impair interactive sliders in calculators or lead forms.',
    ],
  }
};

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function LegalPage({ params }: Props) {
  const { slug } = await params;
  const legal = LEGAL_DATA[slug];

  if (!legal) {
    notFound();
  }

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-24 font-inter">
      <div className="max-w-4xl mx-auto px-6 md:px-8 pt-8 lg:pt-12 flex flex-col gap-6">
        {/* Back Link */}
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0B4F9C] w-max transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Home
        </Link>

        {/* Title */}
        <div className="flex flex-col gap-2 pb-6 border-b border-slate-200">
          <div className="p-3 bg-blue-50 text-[#0B4F9C] rounded-2xl w-max">
            <FileText size={24} />
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 font-poppins mt-3">
            {legal.title}
          </h1>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            LAST UPDATED: {legal.lastUpdated}
          </span>
        </div>

        {/* Content Blocks */}
        <div className="bg-white p-6 md:p-10 rounded-3xl border border-slate-100 shadow-xs flex flex-col gap-6 text-sm md:text-base text-slate-600 leading-relaxed font-semibold">
          {legal.content.map((paragraph, index) => (
            <p key={index} className="indent-0">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
