import { NextRequest } from 'next/server';
import { getUserFromRequest } from '@/lib/api-auth';
import { OnboardingService } from '@/services/onboarding.service';

const onboardingService = new OnboardingService();

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);

    await onboardingService.resetOnboarding(user.id);

    return Response.json({ message: 'Onboarding reset successfully' });
  } catch (error) {
    console.error('Reset onboarding error:', error);
    
    const message = error instanceof Error ? error.message : 'Failed to reset onboarding';
    const status = message.includes('token') || message.includes('Authentication') ? 401 : 500;
    
    return Response.json({ error: message }, { status });
  }
}

