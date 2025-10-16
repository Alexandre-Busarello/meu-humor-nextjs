import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request type to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      user?: {
        id: string;
        email: string;
      };
    }
  }
}

export interface AuthTokenPayload {
  sub: string; // user ID
  email: string;
  iat?: number;
  exp?: number;
}

/**
 * Middleware to authenticate JWT tokens from NextAuth or custom auth
 */
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    res.status(401).json({ error: 'Authentication token required' });
    return;
  }
  
  try {
    const jwtSecret = process.env.JWT_SECRET;
    
    if (!jwtSecret) {
      console.error('JWT_SECRET is not configured');
      res.status(500).json({ error: 'Server configuration error' });
      return;
    }
    
    const decoded = jwt.verify(token, jwtSecret) as AuthTokenPayload;
    
    // Attach user info to request
    req.userId = decoded.sub;
    req.user = {
      id: decoded.sub,
      email: decoded.email,
    };
    
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: 'Token expired' });
      return;
    }
    
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(403).json({ error: 'Invalid token' });
      return;
    }
    
    console.error('Token verification error:', error);
    res.status(500).json({ error: 'Authentication error' });
  }
};

/**
 * Optional authentication - doesn't fail if no token
 */
export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    next();
    return;
  }
  
  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (jwtSecret) {
      const decoded = jwt.verify(token, jwtSecret) as AuthTokenPayload;
      req.userId = decoded.sub;
      req.user = {
        id: decoded.sub,
        email: decoded.email,
      };
    }
  } catch (error) {
    // Silently fail for optional auth
    console.log('Optional auth failed:', error);
  }
  
  next();
};

