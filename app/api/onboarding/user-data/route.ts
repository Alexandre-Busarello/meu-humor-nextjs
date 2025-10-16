import { NextRequest } from 'next/server';
import { getUserFromRequest, createAuthErrorResponse } from '@/lib/api-auth';
import { OnboardingService } from '@/services/onboarding.service';

const onboardingService = new OnboardingService();

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);

    const data = await onboardingService.getUserData(user.id);

    return Response.json(data);
  } catch (error) {
    console.error('Get onboarding user data error:', error);
    
    const message = error instanceof Error ? error.message : 'Failed to get onboarding data';
    const status = message.includes('token') || message.includes('Authentication') ? 401 : 500;
    
    return createAuthErrorResponse(message, status);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    const body = await req.json();

    const data = await onboardingService.updateUserData(user.id, body);

    return Response.json(data);
  } catch (error) {
    console.error('Update onboarding user data error:', error);
    
    const message = error instanceof Error ? error.message : 'Failed to update onboarding data';
    const status = message.includes('token') || message.includes('Authentication') ? 401 : 500;
    
    return Response.json({ error: message }, { status });
  }
}

