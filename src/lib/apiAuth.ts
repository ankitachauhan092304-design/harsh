import { cookies } from 'next/headers';
import { verifyToken, TokenPayload, hasPermission } from './auth';

export async function getAuthenticatedUser(): Promise<TokenPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    
    if (!token) return null;
    
    return verifyToken(token);
  } catch {
    return null;
  }
}

export async function requireAuth(requiredRole?: string): Promise<{ user: TokenPayload } | { error: string; status: number }> {
  const user = await getAuthenticatedUser();
  
  if (!user) {
    return { error: 'Authentication required. Invalid or missing token.', status: 401 };
  }
  
  if (requiredRole && !hasPermission(user.role, requiredRole)) {
    return { error: 'Access denied. Insufficient permissions.', status: 403 };
  }
  
  return { user };
}
