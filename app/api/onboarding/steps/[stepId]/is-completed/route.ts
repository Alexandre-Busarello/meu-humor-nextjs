import { NextRequest } from 'next/server';
import { getUserFromRequest, createAuthErrorResponse } from '@/lib/api-auth';
import { OnboardingService } from '@/services/onboarding.service';

const onboardingService = new OnboardingService();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ stepId: string }> }
) {
  try {
    const user = await getUserFromRequest(req);
    const { stepId } = await params;

    const isCompleted = await onboardingService.isStepCompleted(user.id, stepId);

    return Response.json({
      stepId,
      isCompleted,
    });
  } catch (error) {
    console.error('Check step completed error:', error);
    
    const message = error instanceof Error ? error.message : 'Failed to check step completion';
    const status = message.includes('token') || message.includes('Authentication') ? 401 : 500;
    
    return createAuthErrorResponse(message, status);
  }
}

