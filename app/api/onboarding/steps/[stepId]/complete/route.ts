import { NextRequest } from 'next/server';
import { getUserFromRequest } from '@/lib/api-auth';
import { OnboardingService } from '@/services/onboarding.service';

const onboardingService = new OnboardingService();

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ stepId: string }> }
) {
  try {
    const user = await getUserFromRequest(req);
    const { stepId } = await params;

    await onboardingService.completeStep(user.id, stepId);

    const status = await onboardingService.getStatus(user.id);

    return Response.json(status);
  } catch (error) {
    console.error('Complete onboarding step error:', error);
    
    const message = error instanceof Error ? error.message : 'Failed to complete onboarding step';
    const status = message.includes('token') || message.includes('Authentication') ? 401 : 500;
    
    return Response.json({ error: message }, { status });
  }
}

