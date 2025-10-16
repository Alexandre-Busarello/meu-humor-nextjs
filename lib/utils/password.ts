import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const SALT_ROUNDS = 10;

/**
 * Hash a password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate a hash of an email for anonymous users
 * Uses the same algorithm as the original app
 */
export async function hashEmail(email: string): Promise<string> {
  try {
    // Normalize the email
    const normalizedEmail = email.toLowerCase().trim();
    
    // Salt for hashing (same as original app)
    const salt = 'mindful-moments-email-security-salt';
    
    // Create text to hash
    const textToHash = `${normalizedEmail}${salt}`;
    
    // Use SHA-256
    const hash = crypto
      .createHash('sha256')
      .update(textToHash)
      .digest('hex');
    
    // Return formatted as email
    return `anon_${hash}@hashed.com`;
  } catch (error) {
    console.error('Error hashing email:', error);
    
    // Fallback method
    const timestamp = Date.now().toString(16);
    const randomPart = Math.random().toString(16).substring(2);
    return `anon_${timestamp}_${randomPart}@hashed.com`;
  }
}

/**
 * Check if an email is a hashed anonymous email
 */
export function isHashedEmail(email: string): boolean {
  return email.startsWith('anon_') && email.endsWith('@hashed.com');
}

