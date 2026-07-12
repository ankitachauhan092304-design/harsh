export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'LOAN_EXECUTIVE' | 'CONTENT_MANAGER' | 'VIEWER';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface LeadNote {
  id: string;
  leadId: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface LeadStatusHistory {
  id: string;
  leadId: string;
  oldStatus: string;
  newStatus: string;
  changedBy: string;
  changedAt: string;
}

export interface Lead {
  id: string;
  leadNumber: string; // WF-YYYYMMDD-000001
  name: string;
  phone: string;
  email: string;
  city: string;
  employmentType: string;
  monthlyIncome: number;
  loanType: string;
  loanAmount: number;
  status: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  tags: string;
  remarks: string;
  reminderDate?: string | null;
  nextFollowupDate?: string | null;
  source: string;
  campaign?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  // WhatsApp tracking
  whatsappClicked: boolean;
  whatsappClickedAt?: string | null;
  // Traffic metadata
  ipAddress?: string;
  browserInfo?: string;
  landingPage?: string;
  assignedToId?: string | null;
  assignedTo?: AdminUser | null;
  notes?: LeadNote[];
  statusHistory?: LeadStatusHistory[];
  createdAt: string;
  updatedAt: string;
}


export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary: string;
  featuredImage: string;
  status: string;
  publishedAt?: string | Date | null;
  authorName: string;
  category: string;
  tags: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  designation: string;
  company: string;
  rating: number;
  quote: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface WebSetting {
  id: string;
  key: string;
  value: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  adminUserId?: string | null;
  username: string;
  action: string;
  details: string;
  createdAt: string;
}
