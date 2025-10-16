import { prisma } from '@/lib/prisma';
import { hashPassword, verifyPassword, hashEmail, isHashedEmail } from '@/lib/utils/password';
import jwt, { SignOptions } from 'jsonwebtoken';

export interface RegisterData {
  email: string;
  password: string;
  isAnonymous?: boolean;
  legalAcceptances?: {
    termsOfUseDocumentId: string;
    privacyPolicyDocumentId: string;
  };
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    isAnonymous: boolean;
  };
  token: string;
}

export class AuthService {
  /**
   * Register a new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const { email, password, isAnonymous = false, legalAcceptances } = data;
    
    // Determine the email to use (hashed for anonymous users)
    const emailToStore = isAnonymous ? await hashEmail(email) : email;
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: emailToStore },
    });
    
    if (existingUser) {
      throw new Error('User already exists');
    }
    
    // Hash password
    const passwordHash = await hashPassword(password);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email: emailToStore,
        passwordHash,
        isAnonymous,
        emailHash: isAnonymous ? emailToStore : null,
      },
    });
    
    // Record legal acceptances if provided
    if (legalAcceptances) {
      await prisma.userLegalAcceptance.createMany({
        data: [
          {
            userId: user.id,
            documentId: legalAcceptances.termsOfUseDocumentId,
          },
          {
            userId: user.id,
            documentId: legalAcceptances.privacyPolicyDocumentId,
          },
        ],
      });
    }
    
    // Generate JWT token
    const token = this.generateToken(user.id, user.email);
    
    return {
      user: {
        id: user.id,
        email: user.email,
        isAnonymous: user.isAnonymous,
      },
      token,
    };
  }
  
  /**
   * Login a user
   */
  async login(data: LoginData): Promise<AuthResponse> {
    const { email, password } = data;
    
    // Try to find user with original email
    let user = await prisma.user.findUnique({
      where: { email },
    });
    
    // If not found and email is not hashed, try hashed version
    if (!user && !isHashedEmail(email)) {
      const hashedEmail = await hashEmail(email);
      user = await prisma.user.findUnique({
        where: { email: hashedEmail },
      });
    }
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    // Verify password
    if (!user.passwordHash) {
      throw new Error('Invalid credentials');
    }
    
    const isValid = await verifyPassword(password, user.passwordHash);
    
    if (!isValid) {
      throw new Error('Invalid credentials');
    }
    
    // Generate JWT token
    const token = this.generateToken(user.id, user.email);
    
    return {
      user: {
        id: user.id,
        email: user.email,
        isAnonymous: user.isAnonymous,
      },
      token,
    };
  }
  
  /**
   * Verify a token and return user data
   */
  async verifyToken(token: string): Promise<{ id: string; email: string }> {
    const jwtSecret = process.env.JWT_SECRET;
    
    if (!jwtSecret) {
      throw new Error('JWT_SECRET not configured');
    }
    
    try {
      const decoded = jwt.verify(token, jwtSecret) as { sub: string; email: string };
      return {
        id: decoded.sub,
        email: decoded.email,
      };
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
  
  /**
   * Get user by ID
   */
  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        isAnonymous: true,
        createdAt: true,
        userPlan: {
          select: {
            planType: true,
            status: true,
            currentPeriodEnd: true,
          },
        },
      },
    });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  }
  
  /**
   * Generate JWT token
   */
  private generateToken(userId: string, email: string): string {
    const jwtSecret = process.env.JWT_SECRET;
    
    if (!jwtSecret) {
      throw new Error('JWT_SECRET not configured');
    }
    
    const options: SignOptions = {
      expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any,
    };
    
    return jwt.sign(
      {
        sub: userId,
        email,
      },
      jwtSecret,
      options
    );
  }
}

