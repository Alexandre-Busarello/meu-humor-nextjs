import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  // Only allow in development or with special header
  const debugKey = req.headers.get('x-debug-key');
  if (process.env.NODE_ENV === 'production' && debugKey !== process.env.DEBUG_KEY) {
    return Response.json({ error: 'Not allowed' }, { status: 403 });
  }

  const email = req.nextUrl.searchParams.get('email');
  
  if (!email) {
    return Response.json({ error: 'Email required' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        isAnonymous: true,
        createdAt: true,
        passwordHash: true,
      },
    });

    if (!user) {
      return Response.json({ 
        found: false,
        message: 'User not found' 
      });
    }

    return Response.json({ 
      found: true,
      user: {
        id: user.id,
        email: user.email,
        isAnonymous: user.isAnonymous,
        createdAt: user.createdAt,
        hasPasswordHash: !!user.passwordHash,
        passwordHashLength: user.passwordHash?.length,
        passwordHashPrefix: user.passwordHash?.substring(0, 10),
      }
    });
  } catch (error) {
    console.error('Error checking user:', error);
    return Response.json({ 
      error: 'Database error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

