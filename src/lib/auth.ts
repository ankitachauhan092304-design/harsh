import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'whitestone-fincorp-secret-key-12345';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  name: string;
}

export function hashPassword(password: string): string {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

export function comparePassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

// Role Hierarchy Helper
const roleHierarchy: Record<string, number> = {
  SUPER_ADMIN: 100,
  ADMIN: 80,
  MANAGER: 60,
  LOAN_EXECUTIVE: 40,
  CONTENT_MANAGER: 30,
  VIEWER: 10,
};

export function hasPermission(userRole: string, requiredRole: string): boolean {
  const userScore = roleHierarchy[userRole] || 0;
  const requiredScore = roleHierarchy[requiredRole] || 0;
  return userScore >= requiredScore;
}
