# Whitestone Fincorp - Enterprise Loan Facilitation & CRM Platform

A production-ready, enterprise-grade financial services website and Lead Management CRM built for Whitestone Fincorp. Facilitates credit matching across 25+ trusted banking partners.

## 🚀 Features

### Customer Portal
*   **14-Section Responsive Homepage**: Hero, Trusted Statistics, Services, Why Choose Us, Process Timeline, Calculators, Partners, Testimonials, FAQs, Recent Blogs, and Contact.
*   **5 Detailed Service Pages**: Personal Loan, Business Loan, Home Loan, Loan Against Property (LAP), and Credit Cards.
*   **3 Interactive Calculators**:
    1.  *EMI Calculator*: Inputs for principal, rates, tenure; outputs monthly EMI, interest, principal splits, SVG Pie Chart, annual amortization tables, and PDF download.
    2.  *Credit Score Estimator*: 9-step questionnaire calculating scores (300-900), health tiers, approval chances, risk factors, and custom score-improvement actions.
    3.  *Loan Eligibility Checker*: Debt-to-income (FOIR) calculation verifying borrowing limits, EMI capacity, recommended documents, and approval prospects.
*   **Blog Engine**: Categorized articles, read statistics, and search indexes.
*   **Document Upload Forms**: Lead forms with size checks, type validation, consent agreements, and honeypot spam protection.

### Admin Dashboard (CRM & CMS)
*   **Role-Based Security**: Protections for Super Admin, Admin, Manager, Loan Executive, Content Manager, and Viewer roles.
*   **CRM Lead Pipeline**: Filter leads by status (New, Contacted, In Progress, Approved, Rejected) and products. Drawer panel to edit details, log remarks, assign executives, and append notes.
*   **CSV Data Export**: Single-click downloads of filtered lead lists to CSV format.
*   **Blog CMS**: Compose, preview, draft, or publish HTML articles, categories, and tags.
*   **Global Settings**: Update phone support numbers, emails, office address, and social links.
*   **Audit logs trail**: Security tracking of operator actions and log times.

---

## 🛠️ Technology Stack

*   **Frontend**: Next.js 15, React, Tailwind CSS (v4), Framer Motion
*   **Backend**: Node.js, Next.js API Routes, JWT Authentication (HTTP-Only Secure Cookies)
*   **Database**: PostgreSQL, Prisma ORM
*   **Report Compilation**: jsPDF & jsPDF-AutoTable
*   **Graphics & Icons**: Recharts, Lucide Icons, Unsplash dynamic illustrations
*   **Languages**: Strict TypeScript

---

## ⚙️ Directory Architecture

```
├── prisma/
│   ├── schema.prisma         # Database models (AdminUser, Lead, Blog, FAQ, Testimonial, Settings)
│   ├── seed.ts               # Database seed script for mock data
│   └── migrations/           # Schema migrations folder
├── src/
│   ├── app/                  # Next.js App Router folders
│   │   ├── api/              # Rest APIs (Auth, CRM Leads, Blogs CMS, Analytics)
│   │   ├── admin/            # Admin Panel pages (Login, Dashboard, Leads list, Blogs, Settings)
│   │   ├── services/         # Loan product detail pages
│   │   ├── calculators/      # Sliders & interactive tools pages
│   │   ├── legal/            # Privacy Policy, Terms, Disclaimers pages
│   │   └── page.tsx          # Main Customer Landing page
│   ├── components/           # Reusable UI widgets
│   │   ├── Header.tsx        # Sticky Header dropdowns
│   │   ├── Footer.tsx        # Dark Premium Footer
│   │   ├── ContactForm.tsx   # Lead collection form
│   │   └── calculators/      # Reusable calculators code
│   ├── context/              # React Session Auth Provider
│   ├── lib/                  # JWT auth, db client, dbService database wrappers
│   └── types/                # Strict TypeScript interfaces
```

---

## 💻 Local Setup & Installation

### Prerequisite
*   Node.js (v18 or above)
*   npm (v9 or above)
*   A running PostgreSQL instance (Optional, app falls back to mock database structures automatically if not connected)

### 1. Clone & Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
# Database configuration url
DATABASE_URL="postgresql://username:password@localhost:5432/whitestone_db"

# JWT token signature key
JWT_SECRET="your-super-secure-secret-key-change-in-production"

# Next Node Environment
NODE_ENV="development"
```

### 3. Generate Database Client & Migrations
```bash
npx prisma db push
```

### 4. Seed Database
This populates blogs, FAQs, testimonials, default admin accounts, and sample leads.
```bash
npx prisma db seed
```
*Default Credentials Created:*
*   **Super Admin**: `superadmin@whitestonefincorp.com` / `SuperAdminPassword123!`
*   **Admin Manager**: `admin@whitestonefincorp.com` / `AdminPassword123!`
*   **Loan Executive**: `executive@whitestonefincorp.com` / `ExecutivePassword123!`
*   **Content Manager**: `content@whitestonefincorp.com` / `ContentPassword123!`

### 5. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to inspect. Access the admin console at [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

---

## 📦 Production Build & Deployments

### 1. Build Verification
Ensure strict type checking and successful compilation:
```bash
npm run build
```

### 2. Deploy on Vercel
1.  Connect your repository to Vercel.
2.  Add `DATABASE_URL` and `JWT_SECRET` in environment settings.
3.  Vercel automatically identifies the build commands and installs Prisma client during postinstall.

### 3. Deploy on Railway / Render
1.  Spin up a PostgreSQL database instance on Railway.
2.  Bind the database URL to the `DATABASE_URL` environment variable of your web service node.
3.  Set the start command to: `npm run start`.
