import { NextRequest } from 'next/server';
import { getUserFromRequest, createAuthErrorResponse } from '@/lib/api-auth';
import { MoodService } from '@/services/mood.service';

const moodService = new MoodService();

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    
    const { searchParams } = new URL(req.url);
    const daysParam = searchParams.get('days');
    const days = daysParam ? parseInt(daysParam, 10) : 7;

    const hasConcerning = await moodService.hasConcerningPattern(user.id, days);

    return Response.json({ 
      hasConcerningPattern: hasConcerning,
      reason: hasConcerning ? 'Low mood pattern detected' : undefined
    });
  } catch (error) {
    console.error('Check concerning pattern error:', error);
    
    const message = error instanceof Error ? error.message : 'Failed to check concerning pattern';
    const status = message.includes('token') || message.includes('Authentication') ? 401 : 500;
    
    return createAuthErrorResponse(message, status);
  }
}

