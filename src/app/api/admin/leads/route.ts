import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/apiAuth';
import { dbService } from '@/lib/dbService';

export async function GET(request: Request) {
  // Require VIEWER or above
  const auth = await requireAuth('VIEWER');
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
    if (id) {
      const lead = await dbService.getLeadById(id);
      if (!lead) {
        return NextResponse.json({ error: 'Lead not found.' }, { status: 404 });
      }
      return NextResponse.json({ success: true, lead });
    }

    const leads = await dbService.getLeads();
    return NextResponse.json({ success: true, leads });
  } catch (error) {
    console.error('Fetch Leads Error:', error);
    return NextResponse.json({ error: 'Failed to fetch leads.' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  // Require LOAN_EXECUTIVE or above
  const auth = await requireAuth('LOAN_EXECUTIVE');
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { user } = auth;

  try {
    const { id, newNote, ...data } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Lead ID is required.' }, { status: 400 });
    }

    let updatedLead;
    if (newNote) {
      const addedNote = await dbService.addLeadNote(id, user.name, newNote);
      if (!addedNote) {
        return NextResponse.json({ error: 'Lead not found to attach note.' }, { status: 404 });
      }
      updatedLead = await dbService.getLeadById(id);
    } else {
      updatedLead = await dbService.updateLead(id, data, user.name);
    }

    if (!updatedLead) {
      return NextResponse.json({ error: 'Lead not found.' }, { status: 404 });
    }

    // Log action
    await dbService.createAuditLog(
      user.name,
      'LEAD_UPDATE',
      newNote
        ? `Added note to Lead ${updatedLead.name} (${id})`
        : `Updated Lead ${updatedLead.name} (${id}). Status: ${updatedLead.status}, Priority: ${updatedLead.priority}`,
      user.userId
    );

    return NextResponse.json({ success: true, lead: updatedLead });
  } catch (error) {
    console.error('Update Lead Error:', error);
    return NextResponse.json({ error: 'Failed to update lead.' }, { status: 500 });
  }
}
