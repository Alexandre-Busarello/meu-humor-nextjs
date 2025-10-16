import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export interface AuthTokenPayload {
  sub: string; // user ID
  email: string;
  iat?: number;
  exp?: number;
}

export interface AuthUser {
  id: string;
  email: string;
}

/**
 * Extract and verify JWT token from NextRequest
 * Throws error if token is missing or invalid
 */
export async function getUserFromRequest(req: NextRequest): Promise<AuthUser> {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    throw new Error('Authentication token required');
  }
  
  try {
    const jwtSecret = process.env.JWT_SECRET;
    
    if (!jwtSecret) {
      console.error('JWT_SECRET is not configured');
      throw new Error('Server configuration error');
    }
    
    const decoded = jwt.verify(token, jwtSecret) as AuthTokenPayload;
    
    return {
      id: decoded.sub,
      email: decoded.email,
    };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token expired');
    }
    
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token');
    }
    
    console.error('Token verification error:', error);
    throw new Error('Authentication error');
  }
}

/**
 * Optional authentication - returns user if token is valid, null otherwise
 * Does not throw errors
 */
export async function getOptionalUserFromRequest(req: NextRequest): Promise<AuthUser | null> {
  try {
    return await getUserFromRequest(req);
  } catch {
    // Silently fail for optional auth
    return null;
  }
}

/**
 * Create error response for authentication failures
 */
export function createAuthErrorResponse(message: string, status: number = 401) {
  return Response.json(
    { error: message },
    { status }
  );
}

