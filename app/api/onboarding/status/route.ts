import { NextRequest } from 'next/server';
import { getUserFromRequest, createAuthErrorResponse } from '@/lib/api-auth';
import { OnboardingService } from '@/services/onboarding.service';

const onboardingService = new OnboardingService();

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);

    const status = await onboardingService.getStatus(user.id);

    return Response.json(status);
  } catch (error) {
    console.error('Get onboarding status error:', error);
    
    const message = error instanceof Error ? error.message : 'Failed to get onboarding status';
    const status = message.includes('token') || message.includes('Authentication') ? 401 : 500;
    
    return createAuthErrorResponse(message, status);
  }
}

