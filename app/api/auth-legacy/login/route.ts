import { NextRequest } from 'next/server';
import { AuthService } from '@/services/auth.service';

const authService = new AuthService();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return Response.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const result = await authService.login({ email, password });

    return Response.json(result);
  } catch (error) {
    console.error('Login error:', error);
    
    const message = error instanceof Error ? error.message : 'Login failed';
    
    return Response.json({ error: message }, { status: 401 });
  }
}

