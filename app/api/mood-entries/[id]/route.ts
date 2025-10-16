import { NextRequest } from 'next/server';
import { getUserFromRequest, createAuthErrorResponse } from '@/lib/api-auth';
import { MoodService } from '@/services/mood.service';

const moodService = new MoodService();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest(req);
    const { id } = await params;

    const entry = await moodService.getEntryById(id, user.id);

    return Response.json({
      ...entry,
      timestamp: Number(entry.timestamp),
      ai_analysis: entry.aiAnalysis,
    });
  } catch (error) {
    console.error('Get mood entry error:', error);
    
    const message = error instanceof Error ? error.message : 'Failed to get mood entry';
    
    if (message === 'Mood entry not found') {
      return Response.json({ error: message }, { status: 404 });
    }
    
    const status = message.includes('token') || message.includes('Authentication') ? 401 : 500;
    return createAuthErrorResponse(message, status);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest(req);
    const { id } = await params;
    const body = await req.json();
    const { score, note, timestamp } = body;

    const entry = await moodService.updateEntry(id, user.id, {
      score,
      note,
      timestamp,
    });

    return Response.json({
      ...entry,
      timestamp: Number(entry.timestamp),
      ai_analysis: entry.aiAnalysis,
    });
  } catch (error) {
    console.error('Update mood entry error:', error);
    
    const message = error instanceof Error ? error.message : 'Failed to update mood entry';
    
    if (message === 'Mood entry not found') {
      return Response.json({ error: message }, { status: 404 });
    }
    
    const status = message.includes('token') || message.includes('Authentication') ? 401 : 500;
    return Response.json({ error: message }, { status });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest(req);
    const { id } = await params;

    await moodService.deleteEntry(id, user.id);

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Delete mood entry error:', error);
    
    const message = error instanceof Error ? error.message : 'Failed to delete mood entry';
    
    if (message === 'Mood entry not found') {
      return Response.json({ error: message }, { status: 404 });
    }
    
    const status = message.includes('token') || message.includes('Authentication') ? 401 : 500;
    return Response.json({ error: message }, { status });
  }
}

