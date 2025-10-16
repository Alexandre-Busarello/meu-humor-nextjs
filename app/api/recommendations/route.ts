import { NextRequest } from 'next/server';
import { getUserFromRequest, createAuthErrorResponse } from '@/lib/api-auth';
import { RecommendationService } from '@/services/recommendation.service';

const recommendationService = new RecommendationService();

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);

    const recommendation = await recommendationService.generateRecommendation(user.id);

    return Response.json({ recommendation });
  } catch (error) {
    console.error('Get recommendation error:', error);
    
    const message = error instanceof Error ? error.message : 'Failed to get recommendation';
    const status = message.includes('token') || message.includes('Authentication') ? 401 : 500;
    
    return createAuthErrorResponse(message, status);
  }
}

