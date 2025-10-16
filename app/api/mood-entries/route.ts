import { NextRequest } from 'next/server';
import { getUserFromRequest, createAuthErrorResponse } from '@/lib/api-auth';
import { MoodService } from '@/services/mood.service';

const moodService = new MoodService();

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    const entries = await moodService.getAllEntries(user.id);

    // Convert BigInt to number for JSON serialization
    const serialized = entries.map((entry) => ({
      ...entry,
      timestamp: Number(entry.timestamp),
      ai_analysis: entry.aiAnalysis,
    }));

    return Response.json(serialized);
  } catch (error) {
    console.error('Get mood entries error:', error);
    
    const message = error instanceof Error ? error.message : 'Failed to get mood entries';
    const status = message.includes('token') || message.includes('Authentication') ? 401 : 500;
    
    return createAuthErrorResponse(message, status);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    const body = await req.json();
    const { score, note, timestamp } = body;

    if (score === undefined || note === undefined) {
      return Response.json(
        { error: 'score and note are required' },
        { status: 400 }
      );
    }

    const entry = await moodService.createEntry(user.id, {
      score,
      note,
      timestamp,
    });

    return Response.json(
      {
        ...entry,
        timestamp: Number(entry.timestamp),
        ai_analysis: entry.aiAnalysis,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create mood entry error:', error);
    
    const message = error instanceof Error ? error.message : 'Failed to create mood entry';
    const status = message.includes('token') || message.includes('Authentication') ? 401 : 500;
    
    return Response.json({ error: message }, { status });
  }
}

