import { NextRequest } from 'next/server';
import { AuthService } from '@/services/auth.service';

const authService = new AuthService();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token } = body;

    if (!token) {
      return Response.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    const user = await authService.verifyToken(token);

    return Response.json({
      valid: true,
      user,
    });
  } catch (error) {
    console.error('Verify token error:', error);
    
    return Response.json(
      {
        valid: false,
        error: 'Invalid or expired token',
      },
      { status: 401 }
    );
  }
}

