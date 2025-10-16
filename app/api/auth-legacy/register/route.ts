import { NextRequest } from 'next/server';
import { AuthService } from '@/services/auth.service';

const authService = new AuthService();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, isAnonymous, legalAcceptances } = body;

    if (!email || !password) {
      return Response.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const result = await authService.register({
      email,
      password,
      isAnonymous,
      legalAcceptances,
    });

    return Response.json(result, { status: 201 });
  } catch (error) {
    console.error('Register error:', error);
    
    const message = error instanceof Error ? error.message : 'Registration failed';
    const status = message === 'User already exists' ? 409 : 500;
    
    return Response.json({ error: message }, { status });
  }
}

