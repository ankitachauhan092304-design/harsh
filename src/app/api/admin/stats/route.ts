import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/apiAuth';
import { dbService } from '@/lib/dbService';

export async function GET() {
  const auth = await requireAuth('VIEWER');
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const leads = await dbService.getLeads();

    // 1. Core counters
    const totalLeads = leads.length;
    const approvedLeads = leads.filter((l) => l.status === 'APPROVED').length;
    const inProgressLeads = leads.filter((l) => l.status === 'IN_PROGRESS').length;
    const newLeads = leads.filter((l) => l.status === 'NEW').length;
    const conversionRate = totalLeads > 0 ? (approvedLeads / totalLeads) * 100 : 0;

    // 2. Average Loan Value
    let totalValue = 0;
    leads.forEach((l) => {
      totalValue += l.loanAmount;
    });
    const avgLoanValue = totalLeads > 0 ? totalValue / totalLeads : 0;

    // 3. Status breakdown
    const statusBreakdown: Record<string, number> = {
      NEW: 0,
      CONTACTED: 0,
      IN_PROGRESS: 0,
      APPROVED: 0,
      REJECTED: 0,
    };
    leads.forEach((l) => {
      const s = l.status.toUpperCase();
      if (statusBreakdown[s] !== undefined) {
        statusBreakdown[s]++;
      }
    });

    // 4. Product category breakdown
    const productBreakdown: Record<string, number> = {
      PERSONAL: 0,
      BUSINESS: 0,
      HOME: 0,
      LAP: 0,
      CREDIT_CARD: 0,
    };
    leads.forEach((l) => {
      const type = l.loanType.toUpperCase().replace('_KEY', '');
      if (productBreakdown[type] !== undefined) {
        productBreakdown[type]++;
      }
    });

    // ── Calculate source breakdown buckets ──
    const sourceBreakdown = {
      whatsappLeads: 0,
      websiteLeads: 0,
      calculatorLeads: 0,
      manualLeads: 0,
    };
    leads.forEach((l) => {
      const lead = l as { source?: string; whatsappClicked?: boolean };
      const src = (lead.source || '').toUpperCase();
      if (lead.whatsappClicked || src === 'WHATSAPP') {
        sourceBreakdown.whatsappLeads++;
      } else if (src === 'WEBSITE' || src === 'WEBSITE_FORM') {
        sourceBreakdown.websiteLeads++;
      } else if (src === 'CALCULATOR' || src.includes('CALC')) {
        sourceBreakdown.calculatorLeads++;
      } else {
        sourceBreakdown.manualLeads++;
      }
    });

    // 5. Activity log history preview
    const auditLogs = await dbService.getAuditLogs();
    const recentActivity = auditLogs.slice(0, 10);

    return NextResponse.json({
      success: true,
      stats: {
        totalLeads,
        approvedLeads,
        inProgressLeads,
        newLeads,
        conversionRate,
        avgLoanValue,
        statusBreakdown,
        productBreakdown,
        sourceBreakdown,
        recentActivity,
      },
    });
  } catch (error) {
    console.error('Fetch Stats Error:', error);
    return NextResponse.json({ error: 'Failed to calculate statistics.' }, { status: 500 });
  }
}
