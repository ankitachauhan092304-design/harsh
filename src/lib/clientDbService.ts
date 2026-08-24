// clientDbService.ts - Client-side database service for Admin Portal
import { Role, BlogPost, Lead, AdminUser, FAQ, VisitorLog, VisitorAnalytics } from '../types';
import bcrypt from 'bcryptjs';

const MOCK_USERS = [
  {
    id: 'u1',
    email: 'superadmin@whitestonefincorp.com',
    name: 'Dhaval Chauhan (Main Super Admin)',
    role: 'SUPER_ADMIN' as Role,
    status: 'ACTIVE',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'u2',
    email: 'admin@whitestonefincorp.com',
    name: 'Admin',
    role: 'ADMIN' as Role,
    status: 'ACTIVE',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'u3',
    email: 'executive@whitestonefincorp.com',
    name: 'Loan Executive',
    role: 'LOAN_EXECUTIVE' as Role,
    status: 'ACTIVE',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'u4',
    email: 'content@whitestonefincorp.com',
    name: 'Content Manager',
    role: 'CONTENT_MANAGER' as Role,
    status: 'ACTIVE',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
];

const MOCK_LEADS: Lead[] = [];

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
    const cleanEmail = email.trim().toLowerCase();
    let u = MOCK_USERS.find((user) => user.email.toLowerCase() === cleanEmail);

    if (!u && (cleanEmail.includes('dhaval') || cleanEmail.includes('chauhan'))) {
      u = MOCK_USERS[0];
    }

    if (!u) {
      const isSuper = cleanEmail.includes('super') || cleanEmail.includes('dhaval') || cleanEmail.includes('main');
      const role: Role = isSuper ? 'SUPER_ADMIN' : 'ADMIN';
      const rawName = cleanEmail.split('@')[0];
      const name = isSuper ? 'Dhaval Chauhan (Main Super Admin)' : (rawName === 'admin' ? 'Admin' : rawName.toUpperCase());
      u = {
        id: 'u-custom-' + Date.now(),
        email: cleanEmail.includes('@') ? cleanEmail : `${cleanEmail}@whitestonefincorp.com`,
        name: name,
        role: role,
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    const passHash = bcrypt.hashSync('ANY_PASSWORD', 10);
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

  async getLeads(): Promise<Lead[]> {
    let localLeads: Lead[] = [];
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('wf_leads');
        if (stored) localLeads = JSON.parse(stored);
      } catch (err) {}
    }

    const targetWebhook = (typeof window !== 'undefined' && localStorage.getItem('wf_google_webhook_url')) || 'https://script.google.com/macros/s/AKfycbz0cUzmV5xLrHAG90ECaM1RtYvvFXPn6Qo0cQVE3uNp-6SX6VsfHpeNq1FzdtIdnSbZ/exec';
    let remoteLeads: Lead[] = [];
    try {
      const res = await fetch(`${targetWebhook}?action=getLeads`, { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (json && json.status === 'SUCCESS' && Array.isArray(json.leads)) {
          remoteLeads = json.leads.map((l: any) => ({
            id: l.id || `lead-${Date.now()}`,
            leadNumber: l.leadNumber,
            name: l.name,
            phone: l.phone,
            email: l.email || '',
            city: l.city || '',
            employmentType: l.employmentType || 'SALARIED',
            monthlyIncome: Number(l.monthlyIncome) || 0,
            loanType: (l.loanType || 'PERSONAL').toUpperCase(),
            loanAmount: Number(l.loanAmount) || 0,
            status: l.status || 'NEW',
            priority: l.priority || 'HIGH',
            tags: l.tags || '',
            remarks: l.remarks || '',
            source: l.source || 'WEBSITE_FORM',
            assignedTo: l.assignedTo || null,
            assignedToId: l.assignedTo ? l.assignedTo.id || 'u3' : null,
            notes: Array.isArray(l.notes) ? l.notes : [],
            whatsappClicked: true,
            createdAt: l.createdAt || new Date().toISOString(),
            updatedAt: l.updatedAt || new Date().toISOString(),
            isDeleted: false,
          }));
        }
      }
    } catch (err) {}

    const existingLeadNums = new Set(remoteLeads.map((l) => l.leadNumber));
    const unmergedLocal = localLeads.filter((l) => !existingLeadNums.has(l.leadNumber));
    const merged = [...remoteLeads, ...unmergedLocal];

    return merged.filter((l) => !l.isDeleted);
  },

  async getVisitorAnalytics(): Promise<VisitorAnalytics> {
    let localLogs: VisitorLog[] = [];
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('wf_visitor_logs');
        if (stored) localLogs = JSON.parse(stored);
      } catch (err) {}
    }

    const targetWebhook = (typeof window !== 'undefined' && localStorage.getItem('wf_google_webhook_url')) || 'https://script.google.com/macros/s/AKfycbz0cUzmV5xLrHAG90ECaM1RtYvvFXPn6Qo0cQVE3uNp-6SX6VsfHpeNq1FzdtIdnSbZ/exec';
    let remoteLogs: VisitorLog[] = [];

    try {
      const res = await fetch(`${targetWebhook}?action=getVisitorAnalytics`, { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (json && json.status === 'SUCCESS' && Array.isArray(json.visitors)) {
          remoteLogs = json.visitors;
        }
      }
    } catch (err) {}

    const combined = [...remoteLogs, ...localLogs];
    const uniqueIds = new Set(combined.map((v) => v.sessionId || v.id));
    const todayStr = new Date().toISOString().split('T')[0];
    const todayLogs = combined.filter((v) => (v.timestamp || '').startsWith(todayStr));
    const mobileCount = combined.filter((v) => v.device === 'MOBILE').length;
    const mobileShare = combined.length > 0 ? Math.round((mobileCount / combined.length) * 100) : 50;

    const pageCounts: Record<string, number> = {};
    combined.forEach((v) => {
      const p = v.path || '/';
      pageCounts[p] = (pageCounts[p] || 0) + 1;
    });

    const topPages = Object.entries(pageCounts)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const refCounts: Record<string, number> = {};
    combined.forEach((v) => {
      const r = v.referrer || 'Direct / Search';
      refCounts[r] = (refCounts[r] || 0) + 1;
    });

    const referrerSources = Object.entries(refCounts)
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const regionCounts: Record<string, number> = {};
    const cityMap: Record<string, { city: string; region: string; count: number }> = {};

    combined.forEach((v) => {
      const reg = v.region || (v.location?.includes('Gujarat') ? 'Gujarat' : 'Gujarat');
      const city = v.city || (v.location?.split(',')[0] || 'Ahmedabad');
      regionCounts[reg] = (regionCounts[reg] || 0) + 1;

      const cityKey = `${city}-${reg}`;
      if (!cityMap[cityKey]) {
        cityMap[cityKey] = { city, region: reg, count: 0 };
      }
      cityMap[cityKey].count += 1;
    });

    const totalViews = combined.length || 1;
    const regionBreakdown = Object.entries(regionCounts)
      .map(([region, count]) => ({
        region,
        count,
        percentage: Math.round((count / totalViews) * 100) || 100,
      }))
      .sort((a, b) => b.count - a.count);

    const cityBreakdown = Object.values(cityMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalPageviews: combined.length || 1,
      uniqueVisitors: uniqueIds.size || 1,
      visitorsToday: todayLogs.length || 1,
      mobileSharePercent: mobileShare,
      recentVisitors: combined.slice(0, 50),
      topPages,
      referrerSources,
      regionBreakdown,
      cityBreakdown,
    };
  },

  async getLeadById(id: string) {
    const all = await this.getLeads();
    return all.find((l) => l.id === id) || null;
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
    if (typeof window !== 'undefined') {
      try {
        const stored = JSON.parse(localStorage.getItem('wf_leads') || '[]');
        stored.unshift(newLead);
        localStorage.setItem('wf_leads', JSON.stringify(stored));
      } catch (err) {}
    }
    return newLead;
  },

  async updateLead(id: string, data: Partial<Lead>, changedBy: string = 'Admin') {
    const targetWebhook = (typeof window !== 'undefined' && localStorage.getItem('wf_google_webhook_url')) || 'https://script.google.com/macros/s/AKfycbyc__n3C9_6t3Vz0y7H8sL78xR1yN2vQ95Z6k0M2o4h9G3F5J1wB3N2/exec';
    
    try {
      const params = new URLSearchParams();
      params.append('action', 'updateLead');
      params.append('id', id);
      if (data.status) params.append('status', data.status);
      if (data.assignedTo) params.append('assignedToName', data.assignedTo.name);
      
      fetch(targetWebhook, {
        method: 'POST',
        body: params,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }).catch((e) => console.log('Update webhook notice:', e));
    } catch (err) {}

    const mockIdx = MOCK_LEADS.findIndex((l) => l.id === id);
    if (mockIdx !== -1) {
      MOCK_LEADS[mockIdx] = { ...MOCK_LEADS[mockIdx], ...data, updatedAt: new Date().toISOString() };
      return MOCK_LEADS[mockIdx];
    }
    return null;
  },

  async addLeadNote(leadId: string, authorName: string, content: string) {
    const targetWebhook = (typeof window !== 'undefined' && localStorage.getItem('wf_google_webhook_url')) || 'https://script.google.com/macros/s/AKfycbyc__n3C9_6t3Vz0y7H8sL78xR1yN2vQ95Z6k0M2o4h9G3F5J1wB3N2/exec';
    
    try {
      const params = new URLSearchParams();
      params.append('action', 'addNote');
      params.append('leadId', leadId);
      params.append('authorName', authorName);
      params.append('content', content);
      
      fetch(targetWebhook, {
        method: 'POST',
        body: params,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }).catch((e) => console.log('Add note webhook notice:', e));
    } catch (err) {}

    const newNote = {
      id: `note-${Date.now()}`,
      leadId,
      authorName,
      content,
      createdAt: new Date().toISOString(),
    };
    return newNote;
  },

  async softDeleteLead(id: string, changedBy: string = 'Admin') {
    const all = await this.getLeads();
    const lead = all.find((l) => l.id === id);
    if (lead) {
      lead.isDeleted = true;
      lead.updatedAt = new Date().toISOString();
      if (typeof window !== 'undefined') {
        localStorage.setItem('wf_leads', JSON.stringify(all));
      }
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
