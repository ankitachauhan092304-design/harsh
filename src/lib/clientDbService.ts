// clientDbService.ts - Client-side database service for Admin Portal
import { Role, BlogPost, Lead, AdminUser, FAQ } from '../types';
import bcrypt from 'bcryptjs';

const MOCK_USERS = [
  {
    id: 'u1',
    email: 'superadmin@whitestonefincorp.com',
    name: 'Devraj Sharma',
    role: 'SUPER_ADMIN' as Role,
    status: 'ACTIVE',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'u2',
    email: 'admin@whitestonefincorp.com',
    name: 'Rohan Gupta',
    role: 'ADMIN' as Role,
    status: 'ACTIVE',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'u3',
    email: 'executive@whitestonefincorp.com',
    name: 'Ananya Sen',
    role: 'LOAN_EXECUTIVE' as Role,
    status: 'ACTIVE',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'u4',
    email: 'content@whitestonefincorp.com',
    name: 'Karan Mehra',
    role: 'CONTENT_MANAGER' as Role,
    status: 'ACTIVE',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
];

const MOCK_LEADS: Lead[] = [
  {
    id: 'lead-1',
    leadNumber: 'WF-20260729-000101',
    name: 'Amit Patel',
    phone: '9820012345',
    email: 'amit.patel@gmail.com',
    city: 'Ahmedabad',
    employmentType: 'SALARIED',
    monthlyIncome: 85000,
    loanType: 'PERSONAL',
    loanAmount: 500000,
    status: 'NEW',
    priority: 'HIGH',
    tags: 'Hot Lead, Salaried',
    remarks: 'Customer is looking for a quick personal loan for medical emergency. CIBIL score is 765.',
    reminderDate: '2026-07-30T10:00:00.000Z',
    nextFollowupDate: '2026-07-30T10:00:00.000Z',
    source: 'WEBSITE_FORM',
    campaign: 'Summer_Campaign',
    utmSource: 'google',
    utmMedium: 'cpc',
    utmCampaign: 'personal_loan_ahmedabad',
    whatsappClicked: true,
    whatsappClickedAt: '2026-07-29T10:15:00.000Z',
    ipAddress: '103.21.125.4',
    browserInfo: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    landingPage: '/contact.html',
    assignedToId: 'u3',
    assignedTo: { id: 'u3', name: 'Ananya Sen', email: 'executive@whitestonefincorp.com', role: 'LOAN_EXECUTIVE', status: 'ACTIVE', createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
    notes: [
      { id: 'n1', leadId: 'lead-1', authorName: 'Ananya Sen', content: 'Customer confirmed interest in Personal Loan. Salary slip verified.', createdAt: '2026-07-29T11:00:00.000Z' }
    ],
    statusHistory: [
      { id: 'sh1', leadId: 'lead-1', oldStatus: 'NONE', newStatus: 'NEW', changedBy: 'System Ingestion', changedAt: '2026-07-29T10:00:00.000Z' }
    ],
    isDeleted: false,
    createdAt: '2026-07-29T10:00:00.000Z',
    updatedAt: '2026-07-29T11:00:00.000Z',
  },
  {
    id: 'lead-2',
    leadNumber: 'WF-20260729-000102',
    name: 'Priya Sharma',
    phone: '9811098765',
    email: 'priya.sharma@outlook.com',
    city: 'Surat',
    employmentType: 'BUSINESS_OWNER',
    monthlyIncome: 250000,
    loanType: 'BUSINESS',
    loanAmount: 2500000,
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    tags: 'MSME, Documents Collected',
    remarks: 'GST returns and bank statements collected. Underwriting in progress with HDFC Bank partner.',
    reminderDate: '2026-07-28T14:00:00.000Z', // Overdue
    nextFollowupDate: '2026-07-28T14:00:00.000Z',
    source: 'WEBSITE_FORM',
    campaign: 'MSME_Growth',
    utmSource: 'facebook',
    utmMedium: 'social',
    utmCampaign: 'business_loan_gujarat',
    whatsappClicked: false,
    whatsappClickedAt: null,
    ipAddress: '103.24.12.90',
    browserInfo: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    landingPage: '/services/business-loan.html',
    assignedToId: 'u3',
    assignedTo: { id: 'u3', name: 'Ananya Sen', email: 'executive@whitestonefincorp.com', role: 'LOAN_EXECUTIVE', status: 'ACTIVE', createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
    notes: [
      { id: 'n2', leadId: 'lead-2', authorName: 'Ananya Sen', content: 'GST returns collected. Sent file to ICICI Bank team.', createdAt: '2026-07-28T15:00:00.000Z' }
    ],
    statusHistory: [
      { id: 'sh2', leadId: 'lead-2', oldStatus: 'NEW', newStatus: 'IN_PROGRESS', changedBy: 'Ananya Sen', changedAt: '2026-07-28T15:00:00.000Z' }
    ],
    isDeleted: false,
    createdAt: '2026-07-28T09:00:00.000Z',
    updatedAt: '2026-07-28T15:00:00.000Z',
  },
  {
    id: 'lead-3',
    leadNumber: 'WF-20260727-000099',
    name: 'Suresh Kumar',
    phone: '9944011223',
    email: 'suresh.kumar@yahoo.com',
    city: 'Vadodara',
    employmentType: 'PROFESSIONAL',
    monthlyIncome: 120000,
    loanType: 'HOME',
    loanAmount: 6500000,
    status: 'CONTACTED',
    priority: 'MEDIUM',
    tags: 'First Time Buyer',
    remarks: 'Contacted customer. Property is under construction in Satellite. Document checklist sent on WhatsApp.',
    reminderDate: '2026-07-31T11:00:00.000Z',
    nextFollowupDate: '2026-07-31T11:00:00.000Z',
    source: 'WEBSITE_FORM',
    campaign: null,
    utmSource: 'direct',
    utmMedium: 'none',
    utmCampaign: null,
    whatsappClicked: true,
    whatsappClickedAt: '2026-07-27T12:00:00.000Z',
    ipAddress: '103.11.45.12',
    browserInfo: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
    landingPage: '/calculators/emi.html',
    assignedToId: 'u2',
    assignedTo: { id: 'u2', name: 'Rohan Gupta', email: 'admin@whitestonefincorp.com', role: 'ADMIN', status: 'ACTIVE', createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
    notes: [],
    statusHistory: [],
    isDeleted: false,
    createdAt: '2026-07-27T11:00:00.000Z',
    updatedAt: '2026-07-27T12:00:00.000Z',
  },
  {
    id: 'lead-4',
    leadNumber: 'WF-20260726-000095',
    name: 'Rajesh Shah',
    phone: '9898012345',
    email: 'rajesh.shah@gmail.com',
    city: 'Rajkot',
    employmentType: 'BUSINESS_OWNER',
    monthlyIncome: 350000,
    loanType: 'LAP',
    loanAmount: 15000000,
    status: 'APPROVED',
    priority: 'HIGH',
    tags: 'High Value, Approved',
    remarks: 'Valuation complete. Sanction letter issued by Axis Bank.',
    reminderDate: null,
    nextFollowupDate: null,
    source: 'WEBSITE_FORM',
    campaign: null,
    utmSource: 'google',
    utmMedium: 'cpc',
    utmCampaign: 'lap_gujarat',
    whatsappClicked: true,
    whatsappClickedAt: '2026-07-26T10:00:00.000Z',
    ipAddress: '103.50.11.2',
    browserInfo: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    landingPage: '/services/loan-against-property.html',
    assignedToId: 'u2',
    assignedTo: { id: 'u2', name: 'Rohan Gupta', email: 'admin@whitestonefincorp.com', role: 'ADMIN', status: 'ACTIVE', createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
    notes: [],
    statusHistory: [],
    isDeleted: false,
    createdAt: '2026-07-26T09:00:00.000Z',
    updatedAt: '2026-07-26T16:00:00.000Z',
  },
];

const MOCK_BLOGS: BlogPost[] = [
  {
    id: 'b1',
    title: '5 Crucial Tips to Boost Your Credit Score Fast',
    slug: 'boost-credit-score-fast',
    summary: 'Struggling with a low credit score? Learn actionable tips to improve your score from 600 to 750+ within a few months and qualify for the best loan rates.',
    content: `<h2>Why Your Credit Score Matters</h2><p>Your credit score is a three-digit number that summarizes your credit risk. Lenders use it to decide whether to approve your loan applications and what interest rate to offer you.</p>`,
    featuredImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=800&auto=format&fit=crop',
    status: 'PUBLISHED',
    publishedAt: '2026-01-15T00:00:00.000Z',
    authorName: 'Rohan Gupta',
    category: 'Credit Score',
    tags: 'Credit Score, CIBIL, Financial Tips',
    seoTitle: 'How to Boost Your Credit Score Fast | Whitestone Fincorp',
    seoDescription: 'Learn 5 practical ways to improve your credit score quickly.',
    createdAt: '2026-01-15T00:00:00.000Z',
    updatedAt: '2026-01-15T00:00:00.000Z',
  },
  {
    id: 'b2',
    title: 'A Complete Guide to Home Loan Eligibility in India',
    slug: 'home-loan-eligibility-guide',
    summary: 'Understand the key factors that banks consider when assessing your home loan eligibility, including FOIR, LTV, credit history, and employment type.',
    content: `<h2>Understanding Home Loan Eligibility</h2><p>Buying a home is one of the biggest financial decisions you will make. Securing a home loan can make this dream a reality.</p>`,
    featuredImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop',
    status: 'PUBLISHED',
    publishedAt: '2026-02-10T00:00:00.000Z',
    authorName: 'Ananya Sen',
    category: 'Home Loan',
    tags: 'Home Loan, Eligibility, Real Estate',
    seoTitle: 'Home Loan Eligibility Guide | Whitestone Fincorp',
    seoDescription: 'Find out how banks calculate your home loan eligibility.',
    createdAt: '2026-02-10T00:00:00.000Z',
    updatedAt: '2026-02-10T00:00:00.000Z',
  },
  {
    id: 'b3',
    title: 'How Small Businesses Can Secure Unsecured Loans',
    slug: 'unsecured-business-loans-msme',
    summary: 'Unsecured business loans are a powerful tool for MSMEs to manage cash flow and fuel expansion. Learn the documentation and criteria needed.',
    content: `<h2>Unsecured Business Loans for MSMEs</h2><p>Unlike secured loans that require collateral, unsecured business loans rely solely on business health.</p>`,
    featuredImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop',
    status: 'PUBLISHED',
    publishedAt: '2026-03-01T00:00:00.000Z',
    authorName: 'Devraj Sharma',
    category: 'Business Loan',
    tags: 'Business Loan, MSME, Collateral Free',
    seoTitle: 'How to Get Unsecured Business Loans for MSMEs | Whitestone',
    seoDescription: 'A comprehensive guide for small businesses and MSMEs.',
    createdAt: '2026-03-01T00:00:00.000Z',
    updatedAt: '2026-03-01T00:00:00.000Z',
  },
];

const MOCK_AUDIT_LOGS = [
  { id: 'log-1', username: 'Devraj Sharma', action: 'LOGIN_SUCCESS', details: 'Admin logged in with role SUPER_ADMIN', createdAt: '2026-07-29T21:00:00.000Z' },
  { id: 'log-2', username: 'System Ingestion', action: 'LEAD_CREATED', details: 'Lead #WF-20260729-000101 captured online', createdAt: '2026-07-29T10:00:00.000Z' },
  { id: 'log-3', username: 'Ananya Sen', action: 'STATUS_UPDATE', details: 'Lead WF-20260728-000102 updated to IN_PROGRESS', createdAt: '2026-07-28T15:00:00.000Z' },
];

const MOCK_SETTINGS: Record<string, string> = {
  siteName: 'Whitestone Fincorp',
  contactPhone: '+91 98249 75488',
  contactEmail: 'info@whitestonefincorp.com',
  contactAddress: 'Level 14, Supreme Business Park, Hiranandani Gardens, Powai, Mumbai - 400076',
  whatsappNumber: '919824975488',
  googleBusinessUrl: 'https://maps.google.com/?cid=whitestonefincorp',
  facebookUrl: 'https://facebook.com/whitestonefincorp',
  linkedinUrl: 'https://linkedin.com/company/whitestonefincorp',
  twitterUrl: 'https://twitter.com/whitestonefin',
};

export const clientDbService = {
  async getAdminByEmail(email: string) {
    const u = MOCK_USERS.find((user) => user.email === email.toLowerCase());
    if (!u) return null;

    let passHash = '';
    if (email.startsWith('super')) passHash = bcrypt.hashSync('SuperAdminPassword123!', 10);
    else if (email.startsWith('admin')) passHash = bcrypt.hashSync('AdminPassword123!', 10);
    else if (email.startsWith('exec')) passHash = bcrypt.hashSync('ExecutivePassword123!', 10);
    else passHash = bcrypt.hashSync('ContentPassword123!', 10);

    return { ...u, passwordHash: passHash };
  },

  async getAdminUsers() {
    return MOCK_USERS;
  },

  async updateAdminUser(id: string, data: Partial<AdminUser>) {
    const idx = MOCK_USERS.findIndex((u) => u.id === id);
    if (idx !== -1) {
      MOCK_USERS[idx] = { ...MOCK_USERS[idx], ...data, updatedAt: new Date().toISOString() };
      return MOCK_USERS[idx];
    }
    return null;
  },

  async getLeads() {
    return MOCK_LEADS.filter((l) => !l.isDeleted);
  },

  async getLeadById(id: string) {
    return MOCK_LEADS.find((l) => l.id === id) || null;
  },

  async createLead(data: Partial<Lead>) {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const seq = String(MOCK_LEADS.length + 1).padStart(6, '0');
    const leadNumber = `WF-${yyyy}${mm}${dd}-${seq}`;

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
      source: data.source || 'WEBSITE_FORM',
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
        { id: `n-${Date.now()}`, leadId: `lead-${Date.now()}`, authorName: 'System', content: `Lead #${leadNumber} captured.`, createdAt: new Date().toISOString() }
      ],
      statusHistory: [
        { id: `sh-${Date.now()}`, leadId: `lead-${Date.now()}`, oldStatus: 'NONE', newStatus: 'NEW', changedBy: 'System Ingestion', changedAt: new Date().toISOString() }
      ],
      isDeleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    MOCK_LEADS.unshift(newLead);
    return newLead;
  },

  async updateLead(id: string, data: Partial<Lead>, changedBy: string = 'Admin') {
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
  },

  async addLeadNote(leadId: string, authorName: string, content: string) {
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
  },

  async softDeleteLead(id: string, changedBy: string = 'Admin') {
    const lead = MOCK_LEADS.find((l) => l.id === id);
    if (lead) {
      lead.isDeleted = true;
      lead.updatedAt = new Date().toISOString();
      await this.createAuditLog(changedBy, 'LEAD_DELETE', `Lead #${lead.leadNumber} soft deleted`);
      return true;
    }
    return false;
  },

  async getBlogPosts() {
    return MOCK_BLOGS;
  },

  async createBlogPost(data: Partial<BlogPost>) {
    const newBlog: BlogPost = {
      id: `b-${Date.now()}`,
      title: data.title || 'Untitled',
      slug: data.slug || `blog-${Date.now()}`,
      summary: data.summary || '',
      content: data.content || '',
      featuredImage: data.featuredImage || '',
      status: (data.status as 'PUBLISHED' | 'DRAFT') || 'DRAFT',
      publishedAt: data.status === 'PUBLISHED' ? new Date().toISOString() : null,
      authorName: data.authorName || 'Whitestone Team',
      category: data.category || 'Finance',
      tags: data.tags || '',
      seoTitle: data.seoTitle || data.title,
      seoDescription: data.seoDescription || data.summary,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    MOCK_BLOGS.unshift(newBlog);
    return newBlog;
  },

  async updateBlogPost(id: string, data: Partial<BlogPost>) {
    const idx = MOCK_BLOGS.findIndex((b) => b.id === id);
    if (idx !== -1) {
      MOCK_BLOGS[idx] = { ...MOCK_BLOGS[idx], ...data, updatedAt: new Date().toISOString() };
      return MOCK_BLOGS[idx];
    }
    return null;
  },

  async deleteBlogPost(id: string) {
    const idx = MOCK_BLOGS.findIndex((b) => b.id === id);
    if (idx !== -1) {
      MOCK_BLOGS.splice(idx, 1);
      return true;
    }
    return false;
  },

  async getAuditLogs() {
    return MOCK_AUDIT_LOGS;
  },

  async createAuditLog(username: string, action: string, details: string, adminUserId?: string) {
    const newLog = {
      id: `log-${Date.now()}`,
      username,
      action,
      details,
      createdAt: new Date().toISOString(),
    };
    MOCK_AUDIT_LOGS.unshift(newLog);
    return newLog;
  },

  async getSettings() {
    return MOCK_SETTINGS;
  },

  async updateSetting(key: string, value: string) {
    MOCK_SETTINGS[key] = value;
    return { key, value };
  }
};
