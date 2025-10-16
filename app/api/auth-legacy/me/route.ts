import { NextRequest } from 'next/server';
import { getUserFromRequest, createAuthErrorResponse } from '@/lib/api-auth';
import { AuthService } from '@/services/auth.service';

const authService = new AuthService();

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    const userData = await authService.getUserById(user.id);

    return Response.json(userData);
  } catch (error) {
    console.error('Get user error:', error);
    
    const message = error instanceof Error ? error.message : 'Authentication failed';
    const status = message.includes('token') || message.includes('Authentication') ? 401 : 500;
    
    return createAuthErrorResponse(message, status);
  }
}

