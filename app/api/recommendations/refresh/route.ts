import { NextRequest } from 'next/server';
import { getUserFromRequest } from '@/lib/api-auth';
import { RecommendationService } from '@/services/recommendation.service';

const recommendationService = new RecommendationService();

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);

    const recommendation = await recommendationService.refreshRecommendation(user.id);

    return Response.json({ recommendation });
  } catch (error) {
    console.error('Refresh recommendation error:', error);
    
    const message = error instanceof Error ? error.message : 'Failed to refresh recommendation';
    const status = message.includes('token') || message.includes('Authentication') ? 401 : 500;
    
    return Response.json({ error: message }, { status });
  }
}

