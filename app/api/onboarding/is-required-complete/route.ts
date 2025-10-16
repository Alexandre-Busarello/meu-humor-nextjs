import { NextRequest } from 'next/server';
import { getUserFromRequest, createAuthErrorResponse } from '@/lib/api-auth';
import { OnboardingService } from '@/services/onboarding.service';

const onboardingService = new OnboardingService();

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);

    const isComplete = await onboardingService.isRequiredComplete(user.id);

    return Response.json({ isComplete });
  } catch (error) {
    console.error('Check required complete error:', error);
    
    const message = error instanceof Error ? error.message : 'Failed to check required completion';
    const status = message.includes('token') || message.includes('Authentication') ? 401 : 500;
    
    return createAuthErrorResponse(message, status);
  }
}

