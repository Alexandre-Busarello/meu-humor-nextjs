import { NextRequest } from 'next/server';
import { getUserFromRequest, createAuthErrorResponse } from '@/lib/api-auth';
import { MoodService } from '@/services/mood.service';

const moodService = new MoodService();

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');

    if (!date) {
      return Response.json(
        { error: 'date query parameter is required' },
        { status: 400 }
      );
    }

    const average = await moodService.getDailyAverage(user.id, date);

    return Response.json({ average, count: average > 0 ? 1 : 0 });
  } catch (error) {
    console.error('Get daily average error:', error);
    
    const message = error instanceof Error ? error.message : 'Failed to get daily average';
    const status = message.includes('token') || message.includes('Authentication') ? 401 : 500;
    
    return createAuthErrorResponse(message, status);
  }
}

