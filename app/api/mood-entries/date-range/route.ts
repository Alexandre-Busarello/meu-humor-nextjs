import { NextRequest } from 'next/server';
import { getUserFromRequest, createAuthErrorResponse } from '@/lib/api-auth';
import { MoodService } from '@/services/mood.service';

const moodService = new MoodService();

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!startDate || !endDate) {
      return Response.json(
        { error: 'startDate and endDate query parameters are required' },
        { status: 400 }
      );
    }

    // Convert to number if it's a numeric string (timestamp)
    const parseDate = (date: string): string | number => {
      const num = Number(date);
      return isNaN(num) ? date : num;
    };

    const entries = await moodService.getEntriesByDateRange(
      user.id,
      parseDate(startDate),
      parseDate(endDate)
    );

    // Convert BigInt to number for JSON serialization
    const serialized = entries.map((entry) => ({
      ...entry,
      timestamp: Number(entry.timestamp),
      ai_analysis: entry.aiAnalysis,
    }));

    return Response.json(serialized);
  } catch (error) {
    console.error('Get mood entries by date range error:', error);
    
    const message = error instanceof Error ? error.message : 'Failed to get mood entries';
    const status = message.includes('token') || message.includes('Authentication') ? 401 : 500;
    
    return createAuthErrorResponse(message, status);
  }
}

