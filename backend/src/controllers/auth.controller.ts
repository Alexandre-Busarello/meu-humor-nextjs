import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { AppError } from '../middleware/error-handler';

const authService = new AuthService();

export class AuthController {
  /**
   * POST /api/auth/register
   * Register a new user
   */
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, isAnonymous, legalAcceptances } = req.body;
      
      // Validation
      if (!email || !password) {
        throw new AppError(400, 'Email and password are required');
      }
      
      if (password.length < 6) {
        throw new AppError(400, 'Password must be at least 6 characters');
      }
      
      const result = await authService.register({
        email,
        password,
        isAnonymous,
        legalAcceptances,
      });
      
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof Error && error.message === 'User already exists') {
        next(new AppError(409, 'User already exists'));
      } else {
        next(error);
      }
    }
  }
  
  /**
   * POST /api/auth/login
   * Login a user
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      
      // Validation
      if (!email || !password) {
        throw new AppError(400, 'Email and password are required');
      }
      
      const result = await authService.login({ email, password });
      
      res.json(result);
    } catch (error) {
      if (error instanceof Error && error.message === 'Invalid credentials') {
        next(new AppError(401, 'Invalid email or password'));
      } else {
        next(error);
      }
    }
  }
  
  /**
   * GET /api/auth/me
   * Get current user data
   */
  async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.userId) {
        throw new AppError(401, 'Not authenticated');
      }
      
      const user = await authService.getUserById(req.userId);
      
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * POST /api/auth/verify
   * Verify a token
   */
  async verify(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token } = req.body;
      
      if (!token) {
        throw new AppError(400, 'Token is required');
      }
      
      const user = await authService.verifyToken(token);
      
      res.json({ valid: true, user });
    } catch (error) {
      next(new AppError(401, 'Invalid token'));
    }
  }
}

