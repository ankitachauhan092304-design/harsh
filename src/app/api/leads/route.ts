import { NextResponse } from 'next/server';
import { dbService } from '@/lib/dbService';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // ── Honeypot / Spam guard ──────────────────────────────────────────────
    if (data.honeypot) {
      // Silently reject bot submissions
      return NextResponse.json({ success: true, leadId: 'bot', leadNumber: 'WF-BOT-000000', message: 'Lead received.' });
    }

    // ── Basic Validation ──────────────────────────────────────────────────
    if (!data.name || !data.phone || !data.email || !data.loanType || !data.loanAmount) {
      return NextResponse.json(
        { error: 'Required fields are missing: name, phone, email, loanType, loanAmount.' },
        { status: 400 }
      );
    }

    if (!/^[6-9]\d{9}$/.test(data.phone)) {
      return NextResponse.json(
        { error: 'Invalid Indian mobile number.' },
        { status: 400 }
      );
    }

    if (isNaN(Number(data.loanAmount)) || Number(data.loanAmount) <= 0) {
      return NextResponse.json(
        { error: 'Loan amount must be a positive number.' },
        { status: 400 }
      );
    }

    // ── Traffic Metadata Collection ───────────────────────────────────────
    const forwarded = request.headers.get('x-forwarded-for');
    const ipAddress = forwarded ? forwarded.split(',')[0].trim() : (request.headers.get('x-real-ip') ?? '');
    const browserInfo = request.headers.get('user-agent') ?? '';
    const landingPage = request.headers.get('referer') ?? data.landingPage ?? '';

    // ── UTM Parameters ────────────────────────────────────────────────────
    const utmSource = data.utmSource ?? null;
    const utmMedium = data.utmMedium ?? null;
    const utmCampaign = data.utmCampaign ?? null;

    // ── Determine source label ────────────────────────────────────────────
    const source = data.source || (data.calculatorSource ? 'CALCULATOR' : 'WEBSITE_FORM');

    // ── Ingest Lead into Database ─────────────────────────────────────────
    const newLead = await dbService.createLead({
      name: data.name,
      phone: data.phone,
      email: data.email,
      city: data.city || '',
      employmentType: data.employmentType || 'SALARIED',
      monthlyIncome: Number(data.monthlyIncome) || 0,
      loanType: data.loanType,
      loanAmount: Number(data.loanAmount),
      remarks: data.remarks || '',
      source,
      campaign: data.campaign ?? null,
      utmSource,
      utmMedium,
      utmCampaign,
      ipAddress,
      browserInfo: browserInfo.slice(0, 500), // cap length
      landingPage: landingPage.slice(0, 500),
    });

    return NextResponse.json({
      success: true,
      leadId: newLead.id,
      leadNumber: (newLead as { id: string; leadNumber?: string }).leadNumber ?? '',
      message: 'Lead created successfully.',
    });
  } catch (error) {
    console.error('Lead Ingestion Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
