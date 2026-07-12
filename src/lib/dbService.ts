import { prisma } from './db';
import { Role, BlogPost, Lead, AdminUser, FAQ } from '../types';
import bcrypt from 'bcryptjs';

// Concrete, rich mock data for fallback when database is not connected
const MOCK_BLOGS: BlogPost[] = [
  {
    id: 'b1',
    title: '5 Crucial Tips to Boost Your Credit Score Fast',
    slug: 'boost-credit-score-fast',
    summary: 'Struggling with a low credit score? Learn actionable tips to improve your score from 600 to 750+ within a few months and qualify for the best loan rates.',
    content: `<h2>Why Your Credit Score Matters</h2><p>Your credit score is a three-digit number that summarizes your credit risk. Lenders use it to decide whether to approve your loan applications and what interest rate to offer you. A higher score means you represent less risk, making you eligible for lower interest rates.</p><h3>1. Pay Your Bills on Time</h3><p>Payment history is the single largest factor in your credit score, accounting for 35% of the total. Even a single payment delayed by 30 days or more can cause a significant drop in your score. Set up autopay or calendar reminders to ensure you never miss a deadline.</p><h3>2. Keep Credit Utilization Low</h3><p>Credit utilization refers to the amount of credit you are using compared to your total credit limit. Ideally, you should keep your utilization below 30% on each card. For instance, if your credit limit is ₹1,00,000, try to keep your monthly balance under ₹30,000.</p><h3>3. Do Not Close Old Credit Cards</h3><p>The length of your credit history accounts for 15% of your score. Closing an old account shortens your average credit history age and reduces your overall available credit limit, both of which can negatively impact your score.</p><h3>4. Monitor Your Credit Report for Errors</h3><p>Errors on credit reports are surprisingly common. These could include accounts that do not belong to you, incorrect payment histories, or outdated negative records. Pull your free credit report annually and dispute any discrepancies immediately.</p><h3>5. Limit New Credit Inquiries</h3><p>Every time you apply for a loan or credit card, the lender performs a hard inquiry on your report, which temporarily dips your score. Avoid making multiple credit inquiries within a short period.</p>`,
    featuredImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=800&auto=format&fit=crop',
    status: 'PUBLISHED' as const,
    publishedAt: new Date().toISOString(),
    authorName: 'Rohan Gupta',
    category: 'Credit Score',
    tags: 'Credit Score, CIBIL, Financial Tips',
    seoTitle: 'How to Boost Your Credit Score Fast | Whitestone Fincorp',
    seoDescription: 'Learn 5 practical ways to improve your credit score quickly to unlock lower interest rates on personal, business, and home loans.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'b2',
    title: 'A Complete Guide to Home Loan Eligibility in India',
    slug: 'home-loan-eligibility-guide',
    summary: 'Understand the key factors that banks consider when assessing your home loan eligibility, including FOIR, LTV, credit history, and employment type.',
    content: `<h2>Understanding Home Loan Eligibility</h2><p>Buying a home is one of the biggest financial decisions you will make. Securing a home loan can make this dream a reality, but you must first qualify for it. Lenders evaluate various aspects of your financial profile before approving a loan.</p><h3>Key Factors Lenders Consider</h3><ul><li><strong>Monthly Income:</strong> Higher income naturally translates to higher borrowing capacity.</li><li><strong>Age:</strong> Younger borrowers have a longer remaining working life, allowing banks to offer longer repayment tenures of up to 30 years.</li><li><strong>Credit Score:</strong> A score of 750 or above is generally preferred for home loans.</li><li><strong>FOIR (Fixed Obligation to Income Ratio):</strong> This is the percentage of your monthly income that goes towards paying existing loans and rent. Lenders prefer a FOIR below 50%.</li><li><strong>LTV (Loan-to-Value) Ratio:</strong> This is the loan amount divided by the market value of the property. Banks typically fund 75% to 90% of the property value.</li></ul><h3>How to Improve Your Home Loan Eligibility</h3><p>To qualify for a higher loan amount, consider adding a co-applicant (such as your spouse or parents) who has a steady income. Additionally, clearing off existing short-term debts like personal loans or credit card dues will reduce your FOIR, enabling lenders to offer you a larger principal amount.</p>`,
    featuredImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop',
    status: 'PUBLISHED' as const,
    publishedAt: new Date().toISOString(),
    authorName: 'Ananya Sen',
    category: 'Home Loan',
    tags: 'Home Loan, Eligibility, Real Estate',
    seoTitle: 'Home Loan Eligibility Guide | Whitestone Fincorp',
    seoDescription: 'Find out how banks calculate your home loan eligibility. Discover tips to increase your borrowing capacity and get approved quickly.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'b3',
    title: 'How Small Businesses Can Secure Unsecured Loans',
    slug: 'unsecured-business-loans-msme',
    summary: 'Unsecured business loans are a powerful tool for MSMEs to manage cash flow and fuel expansion. Learn the documentation and criteria needed to secure approval.',
    content: `<h2>Unsecured Business Loans for MSMEs</h2><p>Unlike secured loans that require collateral like property or equipment, unsecured business loans rely solely on the financial health and creditworthiness of your business. This makes them ideal for service-based companies, retail stores, and startups with minimal physical assets.</p><h3>Eligibility Requirements for Unsecured Business Loans</h3><p>Lenders will typically evaluate the following parameters:</p><ul><li><strong>Business Vintage:</strong> The business must have been operational for at least 2 to 3 continuous years.</li><li><strong>Annual Turnover:</strong> A minimum annual turnover (often starting from ₹15-20 Lakhs) is required.</li><li><strong>GST Returns:</strong> Consistent and timely filing of GST returns over the last 12 months.</li><li><strong>Banking History:</strong> A clean bank statement showing healthy cash flows, minimal search bounces, and adequate average daily balances.</li><li><strong>Financial Audits:</strong> Audited balance sheets and profit & loss statements for the last 2 financial years.</li></ul><h3>Key Documents Needed</h3><p>Prepare the following documents to expedite your loan application:</p><ol><li>PAN Cards of the promoters and the business entity.</li><li>GST registration certificate and 1-year GST returns (GSTR-3B).</li><li>Income Tax Returns (ITR) along with computation of income for the last 2 years.</li><li>12 months of primary business banking statements.</li><li>Address proof of business operations (lease agreement or utility bills).</li></ol>`,
    featuredImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop',
    status: 'PUBLISHED' as const,
    publishedAt: new Date().toISOString(),
    authorName: 'Devraj Sharma',
    category: 'Business Loan',
    tags: 'Business Loan, MSME, Collateral Free',
    seoTitle: 'How to Get Unsecured Business Loans for MSMEs | Whitestone',
    seoDescription: 'A comprehensive guide for small businesses and MSMEs on securing collateral-free unsecured business loans with bank partners.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const MOCK_FAQS: FAQ[] = [
  {
    id: 'f1',
    question: 'Is Whitestone Fincorp a bank or a lender?',
    answer: 'No, Whitestone Fincorp is NOT a bank, NBFC, or direct lender. We are a premier loan facilitation and financial consulting firm. We assist you in finding the best loan offers from our extensive network of trusted banking and financial institution partners, guide you through the documentation process, and facilitate quick approval.',
    category: 'General',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'f2',
    question: 'Does Whitestone Fincorp charge any upfront fees for loan facilitation?',
    answer: 'No, Whitestone Fincorp does NOT charge any upfront processing fees or commission from borrowers for our standard loan consultation services. Any processing fee is charged directly by the lending bank or financial institution during the loan disbursement process.',
    category: 'General',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'f3',
    question: 'What is the minimum credit score required to apply for a loan?',
    answer: 'While requirements vary across bank partners, a credit score of 700 or above is generally preferred for unsecured loans (like Personal or Business Loans). For secured loans (like Home Loans or Loan Against Property), some lenders may approve applications with lower scores, though a higher score (750+) guarantees the lowest interest rates.',
    category: 'Eligibility',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'f4',
    question: 'What is the minimum income criteria for a Personal Loan?',
    answer: 'For salaried individuals, the minimum net monthly salary required starts from ₹20,000, depending on your employer category (Govt, MNC, Private Ltd) and city of residence (Metro vs Non-Metro). For self-employed individuals, a minimum annual ITR of ₹3 Lakhs is typically required.',
    category: 'Eligibility',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'f5',
    question: 'What documents are required for a Business Loan?',
    answer: 'Standard documentation includes: (1) Identity & Address proofs of promoters, (2) Business constitution proof (Partnership Deed, COI), (3) Last 12 months GST returns, (4) Last 12 months primary bank statements, (5) ITR for last 2 years with Balance Sheet & P&L statements, and (6) GST registration certificate.',
    category: 'Documentation',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'f6',
    question: 'Can I apply for a Home Loan if my income is received in cash?',
    answer: 'Most tier-1 banks require salary or business income to be credited via bank transfer or cheque. However, we partner with specialized housing finance companies (HFCs) that evaluate cash incomes based on business turnover and physical verification, enabling cash earners to secure home loans.',
    category: 'Documentation',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'f7',
    question: 'How long does it take for a loan to get disbursed?',
    answer: 'Personal Loans can be approved and disbursed in 24 to 48 hours. Unsecured Business Loans typically take 3 to 5 working days. Secured loans (Home Loans, Loan Against Property) involve property valuation and legal checks, which take 7 to 14 working days.',
    category: 'Processing',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'f8',
    question: 'Can I prepay or foreclose my loan early?',
    answer: 'Yes, most floating-rate home loans have zero foreclosure or prepayment penalties as per RBI guidelines. Unsecured loans (Personal/Business) may attract a foreclosure charge ranging from 2% to 5% of the outstanding principal, depending on the bank partner and the timing of foreclosure.',
    category: 'Processing',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const MOCK_TESTIMONIALS = [
  {
    id: 't1',
    name: 'Aditya Ranade',
    designation: 'Founder',
    company: 'Ranade Tech Solutions',
    rating: 5,
    quote: 'Whitestone Fincorp helped us secure a business loan of ₹45 Lakhs when other banks were stalling due to collateral requirements. Their team guided us to the right partner bank, managed the entire documentation, and got it approved in 4 days. Excellent consulting!',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 't2',
    name: 'Sneha Kulkarni',
    designation: 'Senior Software Engineer',
    company: 'Capgemini',
    rating: 5,
    quote: 'I was looking for a home loan for my new apartment. Whitestone compared interest rates across 6 top banks and found me an offer that was 0.4% lower than my salary bank. That saved me lakhs in interest over the tenure. Highly recommended!',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 't3',
    name: 'Vikram Singh Rathore',
    designation: 'Proprietor',
    company: 'Rathore Logistics',
    rating: 5,
    quote: 'Securing capital for our fleet expansion was seamless. The consultant assigned to us, Ananya, was extremely professional. She understood our cash flows and mapped us to a bank that offered a flexible repayment schedule. Very trustworthy team.',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const MOCK_LEADS: Lead[] = [
  {
    id: 'lead-1',
    leadNumber: 'WF-20260703-000001',
    name: 'Amit Patel',
    phone: '9820012345',
    email: 'amit.patel@gmail.com',
    city: 'Mumbai',
    employmentType: 'SALARIED',
    monthlyIncome: 85000,
    loanType: 'PERSONAL_KEY',
    loanAmount: 500000,
    status: 'NEW',
    priority: 'HIGH' as const,
    tags: 'Hot Lead, Salaried',
    remarks: 'Customer is looking for a quick personal loan for medical emergency. CIBIL score is 765.',
    source: 'Google Search',
    campaign: 'Google Ads Search',
    utmSource: 'google',
    utmMedium: 'cpc',
    utmCampaign: 'personal-loan-mumbai',
    whatsappClicked: true,
    whatsappClickedAt: new Date(Date.now() - 3600000).toISOString(),
    ipAddress: '49.32.45.100',
    browserInfo: 'Chrome/125 Mobile',
    landingPage: '/',
    assignedToId: 'u3',
    assignedTo: { id: 'u3', name: 'Ananya Sen', email: 'executive@whitestonefincorp.com', role: 'LOAN_EXECUTIVE' as const, status: 'ACTIVE' as const, createdAt: '', updatedAt: '' },
    notes: [
      { id: 'n1', leadId: 'lead-1', authorName: 'System', content: 'Lead captured via Google Search. Medium priority assigned.', createdAt: new Date(Date.now() - 3600000 * 2).toISOString() },
      { id: 'n2', leadId: 'lead-1', authorName: 'Ananya Sen', content: 'Tried calling. Customer was busy, asked to callback at 6 PM.', createdAt: new Date(Date.now() - 3600000).toISOString() }
    ],
    statusHistory: [
      { id: 'sh1', leadId: 'lead-1', oldStatus: 'NONE', newStatus: 'NEW', changedBy: 'System Ingestion', changedAt: new Date(Date.now() - 3600000 * 2).toISOString() }
    ],
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'lead-2',
    leadNumber: 'WF-20260703-000002',
    name: 'Priya Sharma',
    phone: '9811098765',
    email: 'priya.sharma@outlook.com',
    city: 'Delhi NCR',
    employmentType: 'BUSINESS_OWNER',
    monthlyIncome: 250000,
    loanType: 'BUSINESS_KEY',
    loanAmount: 2500000,
    status: 'IN_PROGRESS',
    priority: 'HIGH' as const,
    tags: 'MSME, Documents Collected',
    remarks: 'GST returns and bank statements collected. Underwriting in progress with HDFC Bank partner.',
    source: 'Facebook Ad',
    campaign: 'FB Leads Business',
    utmSource: 'facebook',
    utmMedium: 'paid',
    utmCampaign: 'msme-business-loan',
    whatsappClicked: true,
    whatsappClickedAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    ipAddress: '103.14.56.200',
    browserInfo: 'Safari/17 iPhone',
    landingPage: '/services/business-loan',
    assignedToId: 'u3',
    assignedTo: { id: 'u3', name: 'Ananya Sen', email: 'executive@whitestonefincorp.com', role: 'LOAN_EXECUTIVE' as const, status: 'ACTIVE' as const, createdAt: '', updatedAt: '' },
    notes: [
      { id: 'n3', leadId: 'lead-2', authorName: 'System', content: 'Lead captured via Facebook Ad Campaign.', createdAt: new Date(Date.now() - 3600000 * 24).toISOString() },
      { id: 'n4', leadId: 'lead-2', authorName: 'Ananya Sen', content: 'Spoke to customer. GST certificate and 12-month bank statements received via WhatsApp. File is set up.', createdAt: new Date(Date.now() - 3600000 * 18).toISOString() }
    ],
    statusHistory: [
      { id: 'sh2', leadId: 'lead-2', oldStatus: 'NONE', newStatus: 'NEW', changedBy: 'System Ingestion', changedAt: new Date(Date.now() - 3600000 * 24).toISOString() },
      { id: 'sh3', leadId: 'lead-2', oldStatus: 'NEW', newStatus: 'IN_PROGRESS', changedBy: 'Ananya Sen', changedAt: new Date(Date.now() - 3600000 * 18).toISOString() }
    ],
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'lead-3',
    leadNumber: 'WF-20260703-000003',
    name: 'Suresh Kumar',
    phone: '9944011223',
    email: 'suresh.kumar@yahoo.com',
    city: 'Bangalore',
    employmentType: 'PROFESSIONAL',
    monthlyIncome: 120000,
    loanType: 'HOME_KEY',
    loanAmount: 6500000,
    status: 'CONTACTED',
    priority: 'MEDIUM' as const,
    tags: 'First Time Buyer',
    remarks: 'Contacted customer. Property is under construction in Whitefield. Document checklist sent on WhatsApp.',
    source: 'Organic SEO',
    campaign: null,
    utmSource: 'google',
    utmMedium: 'organic',
    utmCampaign: null,
    whatsappClicked: false,
    whatsappClickedAt: null,
    ipAddress: '61.12.88.44',
    browserInfo: 'Chrome/124 Desktop',
    landingPage: '/calculators/eligibility',
    assignedToId: 'u2',
    assignedTo: { id: 'u2', name: 'Rohan Gupta', email: 'admin@whitestonefincorp.com', role: 'ADMIN' as const, status: 'ACTIVE' as const, createdAt: '', updatedAt: '' },
    notes: [
      { id: 'n5', leadId: 'lead-3', authorName: 'System', content: 'Lead captured via organic eligibility calculator.', createdAt: new Date(Date.now() - 3600000 * 48).toISOString() },
      { id: 'n6', leadId: 'lead-3', authorName: 'Rohan Gupta', content: 'Pre-qualified for ₹60 Lakhs loan. Sent documentation checklist on WhatsApp.', createdAt: new Date(Date.now() - 3600000 * 40).toISOString() }
    ],
    statusHistory: [
      { id: 'sh4', leadId: 'lead-3', oldStatus: 'NONE', newStatus: 'NEW', changedBy: 'System Ingestion', changedAt: new Date(Date.now() - 3600000 * 48).toISOString() },
      { id: 'sh5', leadId: 'lead-3', oldStatus: 'NEW', newStatus: 'CONTACTED', changedBy: 'Rohan Gupta', changedAt: new Date(Date.now() - 3600000 * 40).toISOString() }
    ],
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const MOCK_SETTINGS: Record<string, string> = {
  siteName: 'Whitestone Fincorp',
  contactPhone: '+91 98249 75488',
  contactEmail: 'info@whitestonefincorp.com',
  contactAddress: '207/21 WHITESTONE FIN CORP, OPP ADC BAN, RAKHIAL, AHMEDABAD – 380023',
  whatsappNumber: '919824975488',
  facebookUrl: 'https://facebook.com/whitestonefincorp',
  linkedinUrl: 'https://linkedin.com/company/whitestonefincorp',
  twitterUrl: 'https://twitter.com/whitestonefin',
};

const MOCK_AUDIT_LOGS = [
  { id: 'log-1', username: 'Devraj Sharma', action: 'LOGIN', details: 'User logged in successfully.', createdAt: new Date(Date.now() - 3600000 * 2).toISOString() },
  { id: 'log-2', username: 'Ananya Sen', action: 'LEAD_UPDATE', details: 'Updated Lead Amit Patel status from NEW to CONTACTED.', createdAt: new Date(Date.now() - 3600000).toISOString() }
];

const MOCK_USERS: AdminUser[] = [
  { id: 'u1', email: 'superadmin@whitestonefincorp.com', name: 'Devraj Sharma', role: 'SUPER_ADMIN' as const, status: 'ACTIVE' as const, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'u2', email: 'admin@whitestonefincorp.com', name: 'Rohan Gupta', role: 'ADMIN' as const, status: 'ACTIVE' as const, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'u3', email: 'executive@whitestonefincorp.com', name: 'Ananya Sen', role: 'LOAN_EXECUTIVE' as const, status: 'ACTIVE' as const, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'u4', email: 'content@whitestonefincorp.com', name: 'Karan Mehra', role: 'CONTENT_MANAGER' as const, status: 'ACTIVE' as const, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
];

// Helper to check DB connection
async function checkDbConnected(): Promise<boolean> {
  if (!process.env.DATABASE_URL) return false;
  try {
    // Perform a fast query
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

export const dbService = {
  // --- BLOGS ---
  async getBlogs() {
    const isConnected = await checkDbConnected();
    if (!isConnected) {
      console.warn('DB not connected: Falling back to MOCK_BLOGS');
      return MOCK_BLOGS;
    }
    try {
      return await prisma.blogPost.findMany({
        where: { isDeleted: false },
        orderBy: { createdAt: 'desc' },
      });
    } catch {
      return MOCK_BLOGS;
    }
  },

  async getBlogBySlug(slug: string) {
    const isConnected = await checkDbConnected();
    if (!isConnected) {
      return MOCK_BLOGS.find((b) => b.slug === slug) || null;
    }
    try {
      return await prisma.blogPost.findUnique({
        where: { slug },
      });
    } catch {
      return MOCK_BLOGS.find((b) => b.slug === slug) || null;
    }
  },

  async createBlog(data: Partial<BlogPost>) {
    const isConnected = await checkDbConnected();
    if (!isConnected) {
      const newBlog: BlogPost = {
        id: `blog-${Date.now()}`,
        title: data.title || 'Untitled Article',
        slug: data.slug || `blog-${Date.now()}`,
        content: data.content || '',
        summary: data.summary || '',
        featuredImage: data.featuredImage || '',
        status: data.status || 'DRAFT',
        publishedAt: data.publishedAt || null,
        authorName: data.authorName || 'Whitestone Team',
        category: data.category || 'General',
        tags: data.tags || '',
        seoTitle: data.seoTitle || '',
        seoDescription: data.seoDescription || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      MOCK_BLOGS.unshift(newBlog);
      return newBlog;
    }
    return await prisma.blogPost.create({
      data: {
        title: data.title || 'Untitled Article',
        slug: data.slug || `blog-${Date.now()}`,
        content: data.content || '',
        summary: data.summary || '',
        featuredImage: data.featuredImage || '',
        status: data.status || 'DRAFT',
        publishedAt: data.publishedAt || null,
        authorName: data.authorName || 'Whitestone Team',
        category: data.category || 'General',
        tags: data.tags || '',
        seoTitle: data.seoTitle || '',
        seoDescription: data.seoDescription || '',
      }
    });
  },

  async updateBlog(id: string, data: Partial<BlogPost>) {
    const isConnected = await checkDbConnected();
    if (!isConnected) {
      const idx = MOCK_BLOGS.findIndex((b) => b.id === id);
      if (idx !== -1) {
        MOCK_BLOGS[idx] = { ...MOCK_BLOGS[idx], ...data, updatedAt: new Date().toISOString() };
        return MOCK_BLOGS[idx];
      }
      return null;
    }
    return await prisma.blogPost.update({ where: { id }, data });
  },

  async deleteBlog(id: string) {
    const isConnected = await checkDbConnected();
    if (!isConnected) {
      const idx = MOCK_BLOGS.findIndex((b) => b.id === id);
      if (idx !== -1) {
        MOCK_BLOGS.splice(idx, 1);
        return true;
      }
      return false;
    }
    await prisma.blogPost.update({ where: { id }, data: { isDeleted: true } });
    return true;
  },

  // --- FAQS ---
  async getFAQs(category?: string) {
    const isConnected = await checkDbConnected();
    if (!isConnected) {
      return category ? MOCK_FAQS.filter((f) => f.category.toLowerCase() === category.toLowerCase()) : MOCK_FAQS;
    }
    try {
      return await prisma.fAQ.findMany({
        where: category ? { category } : undefined,
        orderBy: { createdAt: 'asc' },
      });
    } catch {
      return category ? MOCK_FAQS.filter((f) => f.category.toLowerCase() === category.toLowerCase()) : MOCK_FAQS;
    }
  },

  async createFAQ(data: { question: string; answer: string; category: string }) {
    const isConnected = await checkDbConnected();
    if (!isConnected) {
      const newFaq = {
        id: `faq-${Date.now()}`,
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      MOCK_FAQS.push(newFaq);
      return newFaq;
    }
    return await prisma.fAQ.create({ data });
  },

  async updateFAQ(id: string, data: Partial<FAQ>) {
    const isConnected = await checkDbConnected();
    if (!isConnected) {
      const idx = MOCK_FAQS.findIndex((f) => f.id === id);
      if (idx !== -1) {
        MOCK_FAQS[idx] = { ...MOCK_FAQS[idx], ...data, updatedAt: new Date().toISOString() };
        return MOCK_FAQS[idx];
      }
      return null;
    }
    return await prisma.fAQ.update({ where: { id }, data });
  },

  async deleteFAQ(id: string) {
    const isConnected = await checkDbConnected();
    if (!isConnected) {
      const idx = MOCK_FAQS.findIndex((f) => f.id === id);
      if (idx !== -1) {
        MOCK_FAQS.splice(idx, 1);
        return true;
      }
      return false;
    }
    await prisma.fAQ.delete({ where: { id } });
    return true;
  },

  // --- TESTIMONIALS ---
  async getTestimonials() {
    const isConnected = await checkDbConnected();
    if (!isConnected) {
      return MOCK_TESTIMONIALS;
    }
    try {
      return await prisma.testimonial.findMany({
        orderBy: { createdAt: 'desc' },
      });
    } catch {
      return MOCK_TESTIMONIALS;
    }
  },

  async createTestimonial(data: { name: string; designation: string; company: string; rating: number; quote: string; imageUrl?: string }) {
    const isConnected = await checkDbConnected();
    if (!isConnected) {
      const newTestimonial = {
        id: `t-${Date.now()}`,
        name: data.name,
        designation: data.designation,
        company: data.company,
        rating: data.rating,
        quote: data.quote,
        imageUrl: data.imageUrl || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      MOCK_TESTIMONIALS.unshift(newTestimonial);
      return newTestimonial;
    }
    return await prisma.testimonial.create({ data });
  },

  async deleteTestimonial(id: string) {
    const isConnected = await checkDbConnected();
    if (!isConnected) {
      const idx = MOCK_TESTIMONIALS.findIndex((t) => t.id === id);
      if (idx !== -1) {
        MOCK_TESTIMONIALS.splice(idx, 1);
        return true;
      }
      return false;
    }
    await prisma.testimonial.delete({ where: { id } });
    return true;
  },

  // --- LEADS ---
  async getLeads() {
    const isConnected = await checkDbConnected();
    if (!isConnected) {
      return MOCK_LEADS;
    }
    try {
      return await prisma.lead.findMany({
        where: { isDeleted: false },
        include: {
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              status: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch {
      return MOCK_LEADS;
    }
  },

  async getLeadById(id: string) {
    const isConnected = await checkDbConnected();
    if (!isConnected) {
      return MOCK_LEADS.find((l) => l.id === id) || null;
    }
    try {
      return await prisma.lead.findUnique({
        where: { id },
        include: {
          assignedTo: true,
          notes: { orderBy: { createdAt: 'desc' } },
          statusHistory: { orderBy: { changedAt: 'desc' } },
        },
      });
    } catch {
      return MOCK_LEADS.find((l) => l.id === id) || null;
    }
  },

  async createLead(data: Partial<Lead>) {
    const isConnected = await checkDbConnected();

    // ── Generate formatted lead number WF-YYYYMMDD-NNNNNN ──
    const { generateLeadNumber } = await import('./whatsapp');
    let sequence = 1;
    if (isConnected) {
      // Count leads created on today's date to get next sequential number
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      sequence = (await prisma.lead.count({ where: { createdAt: { gte: today } } })) + 1;
    } else {
      sequence = MOCK_LEADS.length + 1;
    }
    const leadNumber = generateLeadNumber(sequence);

    if (!isConnected) {
      const newLead: Lead = {
        id: `lead-${Date.now()}`,
        leadNumber,
        name: data.name || 'Anonymous',
        phone: data.phone || '',
        email: data.email || '',
        city: data.city || '',
        employmentType: data.employmentType || 'SALARIED',
        monthlyIncome: Number(data.monthlyIncome) || 0,
        loanType: data.loanType || 'PERSONAL',
        loanAmount: Number(data.loanAmount) || 0,
        status: 'NEW',
        priority: 'MEDIUM',
        tags: '',
        remarks: data.remarks || '',
        source: data.source || 'WEBSITE',
        campaign: data.campaign || null,
        utmSource: data.utmSource || null,
        utmMedium: data.utmMedium || null,
        utmCampaign: data.utmCampaign || null,
        whatsappClicked: false,
        whatsappClickedAt: null,
        ipAddress: data.ipAddress || '',
        browserInfo: data.browserInfo || '',
        landingPage: data.landingPage || '',
        assignedToId: null,
        assignedTo: null,
        notes: [
          { id: `note-${Date.now()}`, leadId: `lead-${Date.now()}`, authorName: 'System', content: `Lead #${leadNumber} captured online. Pre-qualification checked.`, createdAt: new Date().toISOString() }
        ],
        statusHistory: [
          { id: `sh-${Date.now()}`, leadId: `lead-${Date.now()}`, oldStatus: 'NONE', newStatus: 'NEW', changedBy: 'System Ingestion', changedAt: new Date().toISOString() }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      MOCK_LEADS.unshift(newLead);
      return newLead;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return await (prisma.lead as any).create({
      data: {
        leadNumber,
        name: data.name || 'Anonymous',
        phone: data.phone || '',
        email: data.email || '',
        city: data.city || '',
        employmentType: data.employmentType || 'SALARIED',
        monthlyIncome: Number(data.monthlyIncome) || 0,
        loanType: data.loanType || 'PERSONAL',
        loanAmount: Number(data.loanAmount) || 0,
        remarks: data.remarks || '',
        source: data.source || 'WEBSITE',
        campaign: data.campaign || null,
        utmSource: data.utmSource || null,
        utmMedium: data.utmMedium || null,
        utmCampaign: data.utmCampaign || null,
        ipAddress: data.ipAddress || '',
        browserInfo: data.browserInfo || '',
        landingPage: data.landingPage || '',
        notes: {
          create: {
            authorName: 'System',
            content: `Lead #${leadNumber} captured online.`,
          },
        },
        statusHistory: {
          create: {
            oldStatus: 'NONE',
            newStatus: 'NEW',
            changedBy: 'System Ingestion',
          },
        },
      },
    });
  },

  async updateLead(id: string, data: Partial<Lead>, changedBy: string = 'Admin') {
    const isConnected = await checkDbConnected();
    if (!isConnected) {
      const idx = MOCK_LEADS.findIndex((l) => l.id === id);
      if (idx !== -1) {
        const oldLead = MOCK_LEADS[idx];
        const updated = { ...oldLead, ...data, updatedAt: new Date().toISOString() };
        
        if (data.status && data.status !== oldLead.status) {
          updated.statusHistory = updated.statusHistory || [];
          updated.statusHistory.unshift({
            id: `sh-${Date.now()}`,
            leadId: id,
            oldStatus: oldLead.status,
            newStatus: data.status,
            changedBy,
            changedAt: new Date().toISOString(),
          });
        }
        
        MOCK_LEADS[idx] = updated;
        return updated;
      }
      return null;
    }

    const oldLead = await prisma.lead.findUnique({ where: { id } });
    if (!oldLead) return null;

    return await prisma.lead.update({
      where: { id },
      data: {
        status: data.status || undefined,
        priority: data.priority || undefined,
        remarks: data.remarks || undefined,
        assignedToId: data.assignedToId === null ? null : data.assignedToId || undefined,
        statusHistory: data.status && data.status !== oldLead.status ? {
          create: {
            oldStatus: oldLead.status,
            newStatus: data.status,
            changedBy,
          },
        } : undefined,
      },
      include: {
        assignedTo: true,
        notes: { orderBy: { createdAt: 'desc' } },
        statusHistory: { orderBy: { changedAt: 'desc' } },
      },
    });
  },

  async addLeadNote(leadId: string, authorName: string, content: string) {
    const isConnected = await checkDbConnected();
    if (!isConnected) {
      const lead = MOCK_LEADS.find((l) => l.id === leadId);
      if (lead) {
        lead.notes = lead.notes || [];
        const newNote = {
          id: `note-${Date.now()}`,
          leadId,
          authorName,
          content,
          createdAt: new Date().toISOString(),
        };
        lead.notes.unshift(newNote);
        return newNote;
      }
      return null;
    }
    return await prisma.leadNote.create({
      data: {
        leadId,
        authorName,
        content,
      },
    });
  },

  // --- WEBSITE SETTINGS ---
  async getSettings() {
    const isConnected = await checkDbConnected();
    if (!isConnected) {
      return MOCK_SETTINGS;
    }
    try {
      const records = await prisma.webSetting.findMany();
      const settingsMap: Record<string, string> = {};
      records.forEach((r) => {
        settingsMap[r.key] = r.value;
      });
      return { ...MOCK_SETTINGS, ...settingsMap };
    } catch {
      return MOCK_SETTINGS;
    }
  },

  async updateSetting(key: string, value: string) {
    const isConnected = await checkDbConnected();
    MOCK_SETTINGS[key] = value;
    if (!isConnected) {
      return { key, value };
    }
    return await prisma.webSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  },

  // --- AUDIT LOGS ---
  async getAuditLogs() {
    const isConnected = await checkDbConnected();
    if (!isConnected) {
      return MOCK_AUDIT_LOGS;
    }
    try {
      return await prisma.auditLog.findMany({
        orderBy: { createdAt: 'desc' },
      });
    } catch {
      return MOCK_AUDIT_LOGS;
    }
  },

  async createAuditLog(username: string, action: string, details: string, adminUserId?: string) {
    const isConnected = await checkDbConnected();
    if (!isConnected) {
      const newLog = {
        id: `log-${Date.now()}`,
        username,
        action,
        details,
        createdAt: new Date().toISOString(),
      };
      MOCK_AUDIT_LOGS.unshift(newLog);
      return newLog;
    }
    return await prisma.auditLog.create({
      data: {
        username,
        action,
        details,
        adminUserId,
      },
    });
  },

  // --- ADMIN USERS (AUTH HELPERS) ---
  async getAdminByEmail(email: string) {
    const isConnected = await checkDbConnected();
    if (!isConnected) {
      // Return a simulated user with password hash corresponding to:
      // 'SuperAdminPassword123!', 'AdminPassword123!', 'ExecutivePassword123!', 'ContentPassword123!'
      // Let's return it directly from our mock list
      const u = MOCK_USERS.find((user) => user.email === email);
      if (!u) return null;

      // Map passwords
      let passHash = '';
      if (email.startsWith('super')) passHash = bcrypt.hashSync('SuperAdminPassword123!', 10);
      else if (email.startsWith('admin')) passHash = bcrypt.hashSync('AdminPassword123!', 10);
      else if (email.startsWith('exec')) passHash = bcrypt.hashSync('ExecutivePassword123!', 10);
      else passHash = bcrypt.hashSync('ContentPassword123!', 10);

      return {
        ...u,
        passwordHash: passHash,
      };
    }
    return await prisma.adminUser.findUnique({
      where: { email },
    });
  },

  async getAdminUsers() {
    const isConnected = await checkDbConnected();
    if (!isConnected) {
      return MOCK_USERS;
    }
    try {
      return await prisma.adminUser.findMany({
        orderBy: { createdAt: 'desc' },
      });
    } catch {
      return MOCK_USERS;
    }
  },

  async createAdminUser(data: { email: string; name: string; passwordHash: string; role: Role }) {
    const isConnected = await checkDbConnected();
    if (!isConnected) {
      const newUser = {
        id: `user-${Date.now()}`,
        email: data.email,
        name: data.name,
        role: data.role,
        status: 'ACTIVE' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      MOCK_USERS.push(newUser);
      return newUser;
    }
    return await prisma.adminUser.create({ data });
  },

  async updateAdminUser(id: string, data: Partial<AdminUser>) {
    const isConnected = await checkDbConnected();
    if (!isConnected) {
      const idx = MOCK_USERS.findIndex((u) => u.id === id);
      if (idx !== -1) {
        MOCK_USERS[idx] = { ...MOCK_USERS[idx], ...data, updatedAt: new Date().toISOString() };
        return MOCK_USERS[idx];
      }
      return null;
    }
    return await prisma.adminUser.update({ where: { id }, data });
  }
};
