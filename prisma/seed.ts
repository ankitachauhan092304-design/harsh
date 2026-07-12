import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/whitestone_db";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Start seeding...');

  // 1. Clean database
  await prisma.auditLog.deleteMany({});
  await prisma.leadNote.deleteMany({});
  await prisma.leadStatusHistory.deleteMany({});
  await prisma.lead.deleteMany({});
  await prisma.adminUser.deleteMany({});
  await prisma.blogPost.deleteMany({});
  await prisma.fAQ.deleteMany({});
  await prisma.testimonial.deleteMany({});
  await prisma.webSetting.deleteMany({});

  console.log('Database cleaned.');

  // 2. Create Admin Users
  const salt = bcrypt.genSaltSync(10);
  const superAdminPassword = bcrypt.hashSync('SuperAdminPassword123!', salt);
  const adminPassword = bcrypt.hashSync('AdminPassword123!', salt);
  const executivePassword = bcrypt.hashSync('ExecutivePassword123!', salt);
  const contentPassword = bcrypt.hashSync('ContentPassword123!', salt);

  await prisma.adminUser.create({
    data: {
      email: 'superadmin@whitestonefincorp.com',
      name: 'Devraj Sharma',
      passwordHash: superAdminPassword,
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
    },
  });

  const admin = await prisma.adminUser.create({
    data: {
      email: 'admin@whitestonefincorp.com',
      name: 'Rohan Gupta',
      passwordHash: adminPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });

  const executive = await prisma.adminUser.create({
    data: {
      email: 'executive@whitestonefincorp.com',
      name: 'Ananya Sen',
      passwordHash: executivePassword,
      role: 'LOAN_EXECUTIVE',
      status: 'ACTIVE',
    },
  });

  await prisma.adminUser.create({
    data: {
      email: 'content@whitestonefincorp.com',
      name: 'Karan Mehra',
      passwordHash: contentPassword,
      role: 'CONTENT_MANAGER',
      status: 'ACTIVE',
    },
  });

  console.log('Admin users created.');

  // 3. Create Blogs
  const blogs = [
    {
      title: '5 Crucial Tips to Boost Your Credit Score Fast',
      slug: 'boost-credit-score-fast',
      summary: 'Struggling with a low credit score? Learn actionable tips to improve your score from 600 to 750+ within a few months and qualify for the best loan rates.',
      content: `<h2>Why Your Credit Score Matters</h2><p>Your credit score is a three-digit number that summarizes your credit risk. Lenders use it to decide whether to approve your loan applications and what interest rate to offer you. A higher score means you represent less risk, making you eligible for lower interest rates.</p><h3>1. Pay Your Bills on Time</h3><p>Payment history is the single largest factor in your credit score, accounting for 35% of the total. Even a single payment delayed by 30 days or more can cause a significant drop in your score. Set up autopay or calendar reminders to ensure you never miss a deadline.</p><h3>2. Keep Credit Utilization Low</h3><p>Credit utilization refers to the amount of credit you are using compared to your total credit limit. Ideally, you should keep your utilization below 30% on each card. For instance, if your credit limit is ₹1,00,000, try to keep your monthly balance under ₹30,000.</p><h3>3. Do Not Close Old Credit Cards</h3><p>The length of your credit history accounts for 15% of your score. Closing an old account shortens your average credit history age and reduces your overall available credit limit, both of which can negatively impact your score.</p><h3>4. Monitor Your Credit Report for Errors</h3><p>Errors on credit reports are surprisingly common. These could include accounts that do not belong to you, incorrect payment histories, or outdated negative records. Pull your free credit report annually and dispute any discrepancies immediately.</p><h3>5. Limit New Credit Inquiries</h3><p>Every time you apply for a loan or credit card, the lender performs a hard inquiry on your report, which temporarily dips your score. Avoid making multiple credit inquiries within a short period.</p>`,
      featuredImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=800&auto=format&fit=crop',
      status: 'PUBLISHED',
      publishedAt: new Date(),
      authorName: 'Rohan Gupta',
      category: 'Credit Score',
      tags: 'Credit Score, CIBIL, Financial Tips',
      seoTitle: 'How to Boost Your Credit Score Fast | Whitestone Fincorp',
      seoDescription: 'Learn 5 practical ways to improve your credit score quickly to unlock lower interest rates on personal, business, and home loans.',
    },
    {
      title: 'A Complete Guide to Home Loan Eligibility in India',
      slug: 'home-loan-eligibility-guide',
      summary: 'Understand the key factors that banks consider when assessing your home loan eligibility, including FOIR, LTV, credit history, and employment type.',
      content: `<h2>Understanding Home Loan Eligibility</h2><p>Buying a home is one of the biggest financial decisions you will make. Securing a home loan can make this dream a reality, but you must first qualify for it. Lenders evaluate various aspects of your financial profile before approving a loan.</p><h3>Key Factors Lenders Consider</h3><ul><li><strong>Monthly Income:</strong> Higher income naturally translates to higher borrowing capacity.</li><li><strong>Age:</strong> Younger borrowers have a longer remaining working life, allowing banks to offer longer repayment tenures of up to 30 years.</li><li><strong>Credit Score:</strong> A score of 750 or above is generally preferred for home loans.</li><li><strong>FOIR (Fixed Obligation to Income Ratio):</strong> This is the percentage of your monthly income that goes towards paying existing loans and rent. Lenders prefer a FOIR below 50%.</li><li><strong>LTV (Loan-to-Value) Ratio:</strong> This is the loan amount divided by the market value of the property. Banks typically fund 75% to 90% of the property value.</li></ul><h3>How to Improve Your Home Loan Eligibility</h3><p>To qualify for a higher loan amount, consider adding a co-applicant (such as your spouse or parents) who has a steady income. Additionally, clearing off existing short-term debts like personal loans or credit card dues will reduce your FOIR, enabling lenders to offer you a larger principal amount.</p>`,
      featuredImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop',
      status: 'PUBLISHED',
      publishedAt: new Date(),
      authorName: 'Ananya Sen',
      category: 'Home Loan',
      tags: 'Home Loan, Eligibility, Real Estate',
      seoTitle: 'Home Loan Eligibility Guide | Whitestone Fincorp',
      seoDescription: 'Find out how banks calculate your home loan eligibility. Discover tips to increase your borrowing capacity and get approved quickly.',
    },
    {
      title: 'How Small Businesses Can Secure Unsecured Loans',
      slug: 'unsecured-business-loans-msme',
      summary: 'Unsecured business loans are a powerful tool for MSMEs to manage cash flow and fuel expansion. Learn the documentation and criteria needed to secure approval.',
      content: `<h2>Unsecured Business Loans for MSMEs</h2><p>Unlike secured loans that require collateral like property or equipment, unsecured business loans rely solely on the financial health and creditworthiness of your business. This makes them ideal for service-based companies, retail stores, and startups with minimal physical assets.</p><h3>Eligibility Requirements for Unsecured Business Loans</h3><p>Lenders will typically evaluate the following parameters:</p><ul><li><strong>Business Vintage:</strong> The business must have been operational for at least 2 to 3 continuous years.</li><li><strong>Annual Turnover:</strong> A minimum annual turnover (often starting from ₹15-20 Lakhs) is required.</li><li><strong>GST Returns:</strong> Consistent and timely filing of GST returns over the last 12 months.</li><li><strong>Banking History:</strong> A clean bank statement showing healthy cash flows, minimal search bounces, and adequate average daily balances.</li><li><strong>Financial Audits:</strong> Audited balance sheets and profit & loss statements for the last 2 financial years.</li></ul><h3>Key Documents Needed</h3><p>Prepare the following documents to expedite your loan application:</p><ol><li>PAN Cards of the promoters and the business entity.</li><li>GST registration certificate and 1-year GST returns (GSTR-3B).</li><li>Income Tax Returns (ITR) along with computation of income for the last 2 years.</li><li>12 months of primary business banking statements.</li><li>Address proof of business operations (lease agreement or utility bills).</li></ol>`,
      featuredImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop',
      status: 'PUBLISHED',
      publishedAt: new Date(),
      authorName: 'Devraj Sharma',
      category: 'Business Loan',
      tags: 'Business Loan, MSME, Collateral Free',
      seoTitle: 'How to Get Unsecured Business Loans for MSMEs | Whitestone',
      seoDescription: 'A comprehensive guide for small businesses and MSMEs on securing collateral-free unsecured business loans with bank partners.',
    },
  ];

  for (const b of blogs) {
    await prisma.blogPost.create({ data: b });
  }

  console.log('Blogs seeded.');

  // 4. Create FAQs
  const faqs = [
    // General
    {
      question: 'Is Whitestone Fincorp a bank or a lender?',
      answer: 'No, Whitestone Fincorp is NOT a bank, NBFC, or direct lender. We are a premier loan facilitation and financial consulting firm. We assist you in finding the best loan offers from our extensive network of trusted banking and financial institution partners, guide you through the documentation process, and facilitate quick approval.',
      category: 'General',
    },
    {
      question: 'Does Whitestone Fincorp charge any upfront fees for loan facilitation?',
      answer: 'No, Whitestone Fincorp does NOT charge any upfront processing fees or commission from borrowers for our standard loan consultation services. Any processing fee is charged directly by the lending bank or financial institution during the loan disbursement process.',
      category: 'General',
    },
    // Eligibility
    {
      question: 'What is the minimum credit score required to apply for a loan?',
      answer: 'While requirements vary across bank partners, a credit score of 700 or above is generally preferred for unsecured loans (like Personal or Business Loans). For secured loans (like Home Loans or Loan Against Property), some lenders may approve applications with lower scores, though a higher score (750+) guarantees the lowest interest rates.',
      category: 'Eligibility',
    },
    {
      question: 'What is the minimum income criteria for a Personal Loan?',
      answer: 'For salaried individuals, the minimum net monthly salary required starts from ₹20,000, depending on your employer category (Govt, MNC, Private Ltd) and city of residence (Metro vs Non-Metro). For self-employed individuals, a minimum annual ITR of ₹3 Lakhs is typically required.',
      category: 'Eligibility',
    },
    // Documentation
    {
      question: 'What documents are required for a Business Loan?',
      answer: 'Standard documentation includes: (1) Identity & Address proofs of promoters, (2) Business constitution proof (Partnership Deed, COI), (3) Last 12 months GST returns, (4) Last 12 months primary bank statements, (5) ITR for last 2 years with Balance Sheet & P&L statements, and (6) GST registration certificate.',
      category: 'Documentation',
    },
    {
      question: 'Can I apply for a Home Loan if my income is received in cash?',
      answer: 'Most tier-1 banks require salary or business income to be credited via bank transfer or cheque. However, we partner with specialized housing finance companies (HFCs) that evaluate cash incomes based on business turnover and physical verification, enabling cash earners to secure home loans.',
      category: 'Documentation',
    },
    // Processing
    {
      question: 'How long does it take for a loan to get disbursed?',
      answer: 'Personal Loans can be approved and disbursed in 24 to 48 hours. Unsecured Business Loans typically take 3 to 5 working days. Secured loans (Home Loans, Loan Against Property) involve property valuation and legal checks, which take 7 to 14 working days.',
      category: 'Processing',
    },
    {
      question: 'Can I prepay or foreclose my loan early?',
      answer: 'Yes, most floating-rate home loans have zero foreclosure or prepayment penalties as per RBI guidelines. Unsecured loans (Personal/Business) may attract a foreclosure charge ranging from 2% to 5% of the outstanding principal, depending on the bank partner and the timing of foreclosure.',
      category: 'Processing',
    },
  ];

  for (const f of faqs) {
    await prisma.fAQ.create({ data: f });
  }

  console.log('FAQs seeded.');

  // 5. Create Testimonials
  const testimonials = [
    {
      name: 'Aditya Ranade',
      designation: 'Founder',
      company: 'Ranade Tech Solutions',
      rating: 5,
      quote: 'Whitestone Fincorp helped us secure a business loan of ₹45 Lakhs when other banks were stalling due to collateral requirements. Their team guided us to the right partner bank, managed the entire documentation, and got it approved in 4 days. Excellent consulting!',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    },
    {
      name: 'Sneha Kulkarni',
      designation: 'Senior Software Engineer',
      company: 'Capgemini',
      rating: 5,
      quote: 'I was looking for a home loan for my new apartment. Whitestone compared interest rates across 6 top banks and found me an offer that was 0.4% lower than my salary bank. That saved me lakhs in interest over the tenure. Highly recommended!',
      imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    },
    {
      name: 'Vikram Singh Rathore',
      designation: 'Proprietor',
      company: 'Rathore Logistics',
      rating: 5,
      quote: 'Securing capital for our fleet expansion was seamless. The consultant assigned to us, Ananya, was extremely professional. She understood our cash flows and mapped us to a bank that offered a flexible repayment schedule. Very trustworthy team.',
      imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    },
  ];

  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t });
  }

  console.log('Testimonials seeded.');

  // 6. Create WebSettings
  const settings = [
    { key: 'siteName', value: 'Whitestone Fincorp' },
    { key: 'contactPhone', value: '+91 98765 43210' },
    { key: 'contactEmail', value: 'info@whitestonefincorp.com' },
    { key: 'contactAddress', value: 'Level 14, Supreme Business Park, Hiranandani Gardens, Powai, Mumbai - 400076, Maharashtra, India' },
    { key: 'whatsappNumber', value: '919876543210' },
    { key: 'facebookUrl', value: 'https://facebook.com/whitestonefincorp' },
    { key: 'linkedinUrl', value: 'https://linkedin.com/company/whitestonefincorp' },
    { key: 'twitterUrl', value: 'https://twitter.com/whitestonefin' },
  ];

  for (const s of settings) {
    await prisma.webSetting.create({ data: s });
  }

  console.log('WebSettings seeded.');

  // 7. Create Mock Leads
  const leads = [
    {
      name: 'Amit Patel',
      phone: '9820012345',
      email: 'amit.patel@gmail.com',
      city: 'Mumbai',
      employmentType: 'SALARIED',
      monthlyIncome: 85000,
      loanType: 'PERSONAL_KEY', // Personal Loan code
      loanAmount: 500000,
      status: 'NEW',
      priority: 'HIGH',
      tags: 'Hot Lead, Salaried',
      source: 'Google Search',
      remarks: 'Customer is looking for a quick personal loan for medical emergency. CIBIL score is 765.',
      assignedToId: executive.id,
    },
    {
      name: 'Priya Sharma',
      phone: '9811098765',
      email: 'priya.sharma@outlook.com',
      city: 'Delhi NCR',
      employmentType: 'BUSINESS_OWNER',
      monthlyIncome: 250000,
      loanType: 'BUSINESS_KEY', // Business Loan code
      loanAmount: 2500000,
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      tags: 'MSME, Documents Collected',
      source: 'Facebook Ad',
      remarks: 'GST returns and bank statements collected. Underwriting in progress with HDFC Bank partner.',
      assignedToId: executive.id,
    },
    {
      name: 'Suresh Kumar',
      phone: '9944011223',
      email: 'suresh.kumar@yahoo.com',
      city: 'Bangalore',
      employmentType: 'PROFESSIONAL',
      monthlyIncome: 120000,
      loanType: 'HOME_KEY', // Home Loan code
      loanAmount: 6500000,
      status: 'CONTACTED',
      priority: 'MEDIUM',
      tags: 'First Time Buyer',
      source: 'Organic SEO',
      remarks: 'Contacted customer. Property is under construction in Whitefield. Document checklist sent on WhatsApp.',
      assignedToId: admin.id,
    },
  ];

  for (const l of leads) {
    const leadRecord = await prisma.lead.create({
      data: {
        name: l.name,
        phone: l.phone,
        email: l.email,
        city: l.city,
        employmentType: l.employmentType,
        monthlyIncome: l.monthlyIncome,
        loanType: l.loanType,
        loanAmount: l.loanAmount,
        status: l.status,
        priority: l.priority,
        tags: l.tags,
        source: l.source,
        remarks: l.remarks,
        assignedToId: l.assignedToId,
      },
    });

    // Create status histories
    await prisma.leadStatusHistory.create({
      data: {
        leadId: leadRecord.id,
        oldStatus: 'NONE',
        newStatus: l.status,
        changedBy: 'System Seeding',
      },
    });

    // Create a note
    await prisma.leadNote.create({
      data: {
        leadId: leadRecord.id,
        authorName: 'System',
        content: `Lead created from ${l.source}. Initial Status: ${l.status}.`,
      },
    });
  }

  console.log('Mock leads seeded.');

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
