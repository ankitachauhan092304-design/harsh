import { NextResponse } from 'next/server';
import { dbService } from '@/lib/dbService';

/**
 * POST /api/leads/[id]/whatsapp
 * Records that a user clicked the WhatsApp CTA after submitting a lead.
 * Called client-side immediately before opening wa.me.
 */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Lead ID is required.' }, { status: 400 });
    }

    // Update lead: mark whatsappClicked = true, record timestamp
    await dbService.updateLead(
      id,
      {
        whatsappClicked: true,
        whatsappClickedAt: new Date().toISOString(),
        // If status is still NEW, bump to CONTACTED since customer initiated contact
        status: 'CONTACTED',
      } as Parameters<typeof dbService.updateLead>[1],
      'WhatsApp Auto-Trigger'
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('WhatsApp tracking error:', error);
    // Non-critical — don't fail user journey for analytics error
    return NextResponse.json({ success: true });
  }
}
